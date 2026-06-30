<template>
  <div class="category-strip">
    <button
      v-for="cat in categories"
      :key="cat.id"
      class="cat-pill"
      :class="{ active: active === cat.id, bouncing: bouncing === cat.id }"
      @click="select(cat.id)"
    >
      {{ cat.icon }} {{ cat.label }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['select'])

const categories = [
  { id: 'all', label: 'All', icon: '📋' },
  { id: 'health', label: 'Health', icon: '💪' },
  { id: 'money', label: 'Money', icon: '💰' },
  { id: 'tech', label: 'Tech', icon: '💻' },
  { id: 'lifestyle', label: 'Lifestyle', icon: '🌿' },
  { id: 'gaming', label: 'Gaming', icon: '🎮' },
]

const active = ref('all')
const bouncing = ref(null)

const categoryMap = {
  '/passwords': 'health',
  '/fitness': 'health',
  '/cooking': 'health',
  '/sleeping/': 'health',
  '/all-nighter': 'health',
  '/sleeping/quiz': 'health',
  '/sleeping/shift-schedule': 'health',
  '/finance': 'money',
  '/shopping': 'money',
  '/shopping-resources': 'money',
  '/linux': 'tech',
  '/privacy': 'tech',
  '/darkweb': 'tech',
  '/unenrollment': 'tech',
  '/drawing': 'lifestyle',
  '/gardening': 'lifestyle',
  '/minimalism': 'lifestyle',
  '/productivity': 'lifestyle',
  '/writing-and-note-taking': 'lifestyle',
  '/chess': 'gaming',
  '/gaming': 'gaming',
}

let filteredContainer = null

function select(id) {
  bouncing.value = id
  setTimeout(() => { bouncing.value = null }, 400)

  active.value = id
  emit('select', id)

  const cards = document.querySelectorAll('.VPFeature, .vp-feature, a.VPFeature')
  if (!cards.length) return

  const featuresWrap = cards[0]?.closest('.VPHomeFeatures')
  if (!featuresWrap) return

  if (id === 'all') {
    if (filteredContainer) {
      filteredContainer.remove()
      filteredContainer = null
    }
    featuresWrap.style.display = ''
    cards.forEach((card, i) => {
      card.style.cssText = ''
      card.style.animation = `cardFadeIn 0.35s ease ${i * 0.03}s both`
    })
    return
  }

  featuresWrap.style.display = 'none'

  if (filteredContainer) filteredContainer.remove()

  filteredContainer = document.createElement('div')
  filteredContainer.className = 'cat-filtered-wrap'
  filteredContainer.style.cssText = `
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 1rem !important;
    width: 100% !important;
    max-width: 1152px !important;
    margin: 0 auto !important;
    padding: 0 24px !important;
    box-sizing: border-box !important;
  `

  let matchIndex = 0
  cards.forEach(card => {
    const link = (card.getAttribute('href') || card.querySelector('a')?.getAttribute('href') || '').replace(/\/$/, '')
    const match = Object.entries(categoryMap).some(([path, cat]) => {
      return cat === id && (link === path || link.startsWith(path))
    })

    if (match) {
      const clone = card.cloneNode(true)
      clone.style.cssText = ''
      clone.style.animation = `cardFadeIn 0.35s ease ${matchIndex * 0.05}s both`
      clone.classList.remove(...clone.classList)
      clone.classList.add('VPFeature', 'link', 'cat-cloned-card')
      filteredContainer.appendChild(clone)
      matchIndex++
    }
  })

  featuresWrap.parentElement.insertBefore(filteredContainer, featuresWrap.nextSibling)
}
</script>

<style scoped>
.category-strip {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.75rem 0;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.category-strip::-webkit-scrollbar {
  display: none;
}

.cat-pill {
  flex-shrink: 0;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.cat-pill:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}

.cat-pill.active {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
}

.cat-pill.bouncing {
  animation: pillBounce 0.4s ease;
}

@keyframes pillBounce {
  0%   { transform: scale(1); }
  30%  { transform: scale(0.92); }
  60%  { transform: scale(1.08); }
  100% { transform: scale(1); }
}
</style>

<style>
@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.cat-filtered-wrap .VPFeature {
  display: flex !important;
  flex-direction: column !important;
  border: 1px solid rgba(var(--vp-c-brand-1-rgb), 0.25) !important;
  border-radius: 14px !important;
  background: var(--vp-c-bg-soft) !important;
  padding: 1.5rem !important;
  text-decoration: none !important;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease !important;
  color: inherit !important;
  height: auto !important;
  width: auto !important;
  min-width: 0 !important;
  max-width: none !important;
  position: relative !important;
  visibility: visible !important;
  opacity: 1 !important;
  overflow: visible !important;
}

.cat-filtered-wrap .VPFeature:hover {
  border-color: var(--vp-c-brand-1) !important;
  transform: translateY(-3px) !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08) !important;
}

.cat-filtered-wrap .VPFeature .icon {
  display: inline-flex !important;
  width: auto !important;
  height: auto !important;
  margin-bottom: 0.5rem !important;
  background: none !important;
  border-radius: 0 !important;
  padding: 0 !important;
  position: static !important;
  aspect-ratio: auto !important;
}

.cat-filtered-wrap .VPFeature .icon::before,
.cat-filtered-wrap .VPFeature .icon::after {
  display: none !important;
}

.cat-filtered-wrap .VPFeature h3 {
  margin: 0 0 0.25rem !important;
  font-size: 1rem !important;
  color: var(--vp-c-text-1) !important;
}

.cat-filtered-wrap .VPFeature p {
  margin: 0 !important;
  font-size: 0.85rem !important;
  color: var(--vp-c-text-2) !important;
  line-height: 1.5 !important;
}

@media (max-width: 768px) {
  .cat-filtered-wrap {
    grid-template-columns: 1fr !important;
  }
}
</style>
