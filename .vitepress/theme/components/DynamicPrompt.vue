<template>
  <div>
    <div v-if="isNightOwl" class="night-owl-badge">
      <span class="night-owl-moon">🌙</span>
      <span>Still up? We've got an <a href="/all-nighter" class="night-owl-link">all-nighter guide</a> for that.</span>
    </div>
    <div v-if="visible" class="fact-inline">
      <span class="fi-emoji">{{ current.icon || '🧠' }}</span>
      <span class="fi-text">
        <Transition name="fade" mode="out-in">
          <span :key="current.id">{{ current.text }}</span>
        </Transition>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import prompts from './prompts.json'

const visible = ref(true)
const currentIndex = ref(0)
const shuffled = ref([])
const isNightOwl = ref(false)

const current = computed(() => shuffled.value[currentIndex.value] || shuffled.value[0] || {})

function weightedShuffle(arr) {
  const pool = []
  for (const item of arr) {
    const w = item.weight || 1
    for (let i = 0; i < w; i++) pool.push(item)
  }
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]]
  }
  const seen = new Set()
  const result = []
  for (const item of pool) {
    if (!seen.has(item.id)) {
      seen.add(item.id)
      result.push(item)
    }
  }
  return result
}

function initPrompts() {
  let pool = [...prompts]
  const now = new Date()
  const hour = now.getHours()
  const month = now.getMonth()

  const seasonal = []
  if (month === 11) seasonal.push({ id: 99, text: 'The world record for most lights on a Christmas tree is over 500,000.', icon: '🎄' })
  if (month === 0) seasonal.push({ id: 98, text: 'The tradition of New Year resolutions dates back 4,000 years to Babylon.', icon: '🎉' })
  if (hour >= 22 || hour < 5) seasonal.push({ id: 97, text: 'The average person falls asleep in 7 minutes.', icon: '🌙' })

  if (seasonal.length) pool = [...pool, ...seasonal]
  shuffled.value = weightedShuffle(pool)
  currentIndex.value = 0
}

function nextFact() {
  if (shuffled.value.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % shuffled.value.length
}

let timer = null

function startRotation() {
  stopRotation()
  timer = setInterval(() => {
    if (visible.value) nextFact()
  }, 8000)
}

function stopRotation() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(() => {
  const hour = new Date().getHours()
  isNightOwl.value = hour >= 0 && hour < 5

  const settings = localStorage.getItem('neros-guide-settings')
  if (settings) {
    try {
      const parsed = JSON.parse(settings)
      if (parsed.showFunFacts === false) {
        visible.value = false
        return
      }
    } catch {}
  }

  initPrompts()
  startRotation()
})

onUnmounted(() => {
  stopRotation()
})
</script>

<style scoped>
.night-owl-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  background: rgba(155, 89, 182, 0.1);
  border: 1px solid rgba(155, 89, 182, 0.3);
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}

.night-owl-moon {
  font-size: 0.9rem;
}

.night-owl-link {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.night-owl-link:hover {
  color: var(--vp-c-brand-2);
}
.fact-inline {
  text-align: left;
  padding: 0.5rem 0;
  transition: opacity 0.25s ease;
  opacity: 0.7;
  min-height: 2rem;
  display: flex;
  align-items: flex-start;
  gap: 0.3rem;
}

.fact-inline:hover {
  opacity: 1;
}

.fi-emoji {
  flex-shrink: 0;
  font-size: 0.85rem;
  margin-top: 0.1rem;
}

.fi-text {
  font-size: 0.78rem;
  line-height: 1.55;
  color: var(--vp-c-text-2);
  font-weight: 400;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
