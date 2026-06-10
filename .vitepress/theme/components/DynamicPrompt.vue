<template>
  <div v-if="visible" class="fact-inline" @click="nextFact" :title="'Click for another fact'">
    <span class="fi-emoji">{{ current.icon || '🧠' }}</span>
    <span class="fi-text">
      <Transition name="fade" mode="out-in">
        <span :key="current.id">{{ current.text }}</span>
      </Transition>
    </span>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import prompts from './prompts.json'

const visible = ref(true)
const currentIndex = ref(0)
const lastIds = ref([])
const visitCount = ref(1)
const shuffled = ref([])

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
  if (visitCount.value === 1) seasonal.push({ id: 96, text: 'First time here? This site is full of random facts and guides.', icon: '👋' })
  if (visitCount.value >= 10) seasonal.push({ id: 95, text: `You've visited ${visitCount.value} times. You deserve a medal.`, icon: '🏅' })

  const lastId = parseInt(localStorage.getItem('last-fact-id') || '0')
  pool = pool.filter(p => p.id !== lastId)
  const lastBatch = JSON.parse(localStorage.getItem('last-fact-ids') || '[]')
  pool = pool.filter(p => !lastBatch.includes(p.id))

  if (seasonal.length) pool = [...pool, ...seasonal]
  shuffled.value = weightedShuffle(pool)
  currentIndex.value = 0
}

function nextFact() {
  if (shuffled.value.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % shuffled.value.length
  persistProgress()
}

function persistProgress() {
  const p = current.value
  if (p && p.id) {
    localStorage.setItem('last-fact-id', String(p.id))
    lastIds.value.push(p.id)
    if (lastIds.value.length > 5) lastIds.value.shift()
    localStorage.setItem('last-fact-ids', JSON.stringify(lastIds.value))
  }
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

  const v = parseInt(localStorage.getItem('visit-count') || '1')
  visitCount.value = v + 1
  localStorage.setItem('visit-count', String(v + 1))

  const saved = localStorage.getItem('last-fact-ids')
  if (saved) lastIds.value = JSON.parse(saved)

  initPrompts()
  startRotation()
})

onUnmounted(() => {
  stopRotation()
})
</script>

<style scoped>
.fact-inline {
  text-align: left;
  padding: 0.5rem 0;
  cursor: pointer;
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
