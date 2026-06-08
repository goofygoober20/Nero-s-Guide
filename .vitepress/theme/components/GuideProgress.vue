<script setup>
import { ref, computed, onMounted } from 'vue'
import { useData } from 'vitepress'

const STORAGE_KEY = 'guide-progress'

const GUIDES = [
  { path: '/sleeping', title: 'Sleeping Guide', emoji: '😴' },
  { path: '/all-nighter', title: 'All-Nighter Guide', emoji: '🌙' },
  { path: '/passwords', title: 'Password Guide', emoji: '🔐' },
  { path: '/fitness', title: 'Fitness Guide', emoji: '💪' },
  { path: '/cooking', title: 'Cooking Guide', emoji: '🍳' },
  { path: '/mental-health', title: 'Mental Health Guide', emoji: '🧠' },
  { path: '/drawing', title: 'Drawing Guide', emoji: '🎨' },
  { path: '/shopping', title: 'Shopping Guide', emoji: '🛍️' },
  { path: '/darkweb', title: 'Dark Web Guide', emoji: '🧅' },
  { path: '/chess', title: 'Chess Guide', emoji: '♟️' },
  { path: '/music', title: 'Music Streaming Guide', emoji: '🎵' },
  { path: '/unenrollment', title: 'Unenrollment Guide', emoji: '🔓' },
  { path: '/linux', title: 'Linux for Beginners', emoji: '🐧' },
  { path: '/privacy', title: 'Online Privacy Guide', emoji: '🛡️' },
  { path: '/finance', title: 'Personal Finance Guide', emoji: '💰' },
  { path: '/productivity', title: 'Productivity Guide', emoji: '📋' },
  { path: '/minimalism', title: 'Minimalism Guide', emoji: '🌱' },
  { path: '/gaming', title: 'Gaming Guide', emoji: '🎮' },
]

const { page } = useData()
const progress = ref({})

const currentGuide = computed(() => {
  const path = '/' + page.value.relativePath.replace(/\.md$/, '')
  return GUIDES.find(g => g.path === path) || null
})

const isCompleted = computed(() => {
  return currentGuide.value ? !!progress.value[currentGuide.value.path] : false
})

const completedCount = computed(() => GUIDES.filter(g => progress.value[g.path]).length)
const totalCount = GUIDES.length

function load() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    progress.value = saved ? JSON.parse(saved) : {}
  } catch { progress.value = {} }
}

function toggle() {
  if (!currentGuide.value) return
  const key = currentGuide.value.path
  const next = { ...progress.value }
  if (next[key]) delete next[key]
  else next[key] = true
  progress.value = next
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

onMounted(load)
</script>

<template>
  <div v-if="currentGuide" class="gp-root">
    <div class="gp-divider"></div>
    <div class="gp-row">
      <button class="gp-btn" :class="{ done: isCompleted }" @click="toggle">
        <span class="gp-icon">{{ isCompleted ? '✓' : '○' }}</span>
        <span>{{ isCompleted ? 'Mark as Unread' : 'Mark as Read' }}</span>
      </button>
      <span class="gp-summary">{{ completedCount }}/{{ totalCount }} guides read</span>
    </div>
  </div>
</template>

<style scoped>
.gp-root {
  margin-top: 2rem;
}

.gp-divider {
  height: 1px;
  background: var(--vp-c-divider);
  margin-bottom: 1rem;
}

.gp-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.gp-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.2rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 40px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.gp-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.gp-btn.done {
  border-color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent);
  color: var(--vp-c-brand-1);
}

.gp-icon {
  font-size: 1.1rem;
}

.gp-summary {
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
}
</style>
