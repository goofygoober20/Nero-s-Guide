---
title: Reading Progress
---

<script setup>
import { ref, computed, onMounted } from 'vue'

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

const progress = ref({})

const completedCount = computed(() => GUIDES.filter(g => progress.value[g.path]).length)
const totalCount = GUIDES.length
const percentage = computed(() => Math.round((completedCount.value / totalCount) * 100))

function load() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    progress.value = saved ? JSON.parse(saved) : {}
  } catch { progress.value = {} }
}

function toggle(path) {
  const next = { ...progress.value }
  if (next[path]) delete next[path]
  else next[path] = true
  progress.value = next
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

onMounted(load)
</script>

<ClientOnly>
  <div class="pp-root">
    <p class="pp-intro">Track which guides you've read and discover ones you haven't.</p>

    <div class="pp-hero">
      <div class="pp-ring">
        <svg viewBox="0 0 120 120">
          <circle class="pp-ring-bg" cx="60" cy="60" r="52" />
          <circle class="pp-ring-fill" cx="60" cy="60" r="52"
            :style="{ strokeDashoffset: 327 - (327 * percentage / 100) }" />
        </svg>
        <div class="pp-ring-text">
          <span class="pp-pct">{{ percentage }}%</span>
          <span class="pp-label">complete</span>
        </div>
      </div>
      <div class="pp-hero-stats">
        <span class="pp-stat"><strong>{{ completedCount }}</strong> / {{ totalCount }} guides</span>
        <span class="pp-stat-label">{{ completedCount === totalCount ? 'All done! 🎉' : `${totalCount - completedCount} remaining` }}</span>
      </div>
    </div>

    <div class="pp-grid">
      <div v-for="g in GUIDES" :key="g.path" class="pp-card"
        :class="{ done: progress.value[g.path] }">
        <button class="pp-toggle" @click="toggle(g.path)" :title="progress.value[g.path] ? 'Mark unread' : 'Mark read'">
          <span class="pp-check">{{ progress.value[g.path] ? '✓' : '○' }}</span>
        </button>
        <span class="pp-emoji">{{ g.emoji }}</span>
        <span class="pp-title">{{ g.title }}</span>
        <a :href="g.path" class="pp-open">Open →</a>
      </div>
    </div>
  </div>
</ClientOnly>

<style scoped>
.pp-root {
  max-width: 640px;
  margin: 0 auto;
  padding: 0 0 2rem;
}

.pp-intro {
  text-align: center;
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}

/* --- Hero --- */
.pp-hero {
  display: flex;
  align-items: center;
  gap: 2rem;
  justify-content: center;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.pp-ring {
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.pp-ring svg {
  transform: rotate(-90deg);
}

.pp-ring-bg {
  fill: none;
  stroke: var(--vp-c-divider);
  stroke-width: 8;
}

.pp-ring-fill {
  fill: none;
  stroke: var(--vp-c-brand-1);
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 327;
  stroke-dashoffset: 327;
  transition: stroke-dashoffset 0.6s ease;
}

.pp-ring-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pp-pct {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  line-height: 1;
}

.pp-label {
  font-size: 0.65rem;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pp-hero-stats {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.pp-stat {
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
}

.pp-stat strong {
  color: var(--vp-c-brand-1);
}

.pp-stat-label {
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
}

/* --- Grid --- */
.pp-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
}

.pp-card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 0.8rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  transition: all 0.2s;
}

.pp-card:hover {
  border-color: var(--vp-c-brand-1);
}

.pp-card.done {
  background: color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent);
  border-color: var(--vp-c-brand-1);
}

.pp-toggle {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  flex-shrink: 0;
}

.pp-check {
  font-size: 1.2rem;
  color: var(--vp-c-text-3);
  transition: color 0.2s;
}

.pp-card.done .pp-check {
  color: var(--vp-c-brand-1);
}

.pp-emoji {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.pp-title {
  flex: 1;
  font-size: 0.82rem;
  color: var(--vp-c-text-1);
  line-height: 1.2;
}

.pp-open {
  background: none;
  border: none;
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  color: var(--vp-c-brand-1);
  cursor: pointer;
  flex-shrink: 0;
  border-radius: 6px;
  transition: background 0.2s;
}

.pp-open:hover {
  background: color-mix(in srgb, var(--vp-c-brand-1) 15%, transparent);
}

@media (max-width: 640px) {
  .pp-grid {
    grid-template-columns: 1fr;
  }
}
</style>
