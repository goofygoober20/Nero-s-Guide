<script setup>
import { ref, computed, onMounted } from 'vue'
import { withBase } from 'vitepress'

const posts = ref([])
const loading = ref(true)
const activeFilter = ref('all')

const CATEGORIES = {
  '✨': 'new', '📚': 'new', '🔑': 'new', '💰': 'new', '🎮': 'new',
  '🐧': 'new', '🛡️': 'new', '📋': 'new', '🌱': 'new', '📐': 'new', '🔐': 'new',
  '🐛': 'fix', '🔒': 'fix',
  '🔧': 'update', '🧹': 'update', '😱': 'update',
}

const CATEGORY_META = {
  all:    { label: 'All',        color: 'var(--vp-c-brand-1)' },
  new:    { label: 'New',        color: '#2ecc71' },
  fix:    { label: 'Fixed',      color: '#e74c3c' },
  update: { label: 'Updated',    color: '#3498db' },
  site:   { label: 'Site',       color: '#9b59b6' },
}

function getCategory(msg) {
  const clean = msg.replace(/\uFE0F/g, '')
  const match = clean.match(/^(\S)/u)
  if (!match) return 'site'
  const emoji = match[1]
  if (emoji in CATEGORIES) return CATEGORIES[emoji]
  if (emoji === '🎯') {
    const text = clean.slice(emoji.length).trim().toLowerCase()
    if (text.startsWith('fix') || text.startsWith('fixed')) return 'fix'
    return 'new'
  }
  return 'site'
}

const filteredPosts = computed(() => {
  if (activeFilter.value === 'all') return posts.value
  return posts.value.filter(p => getCategory(p.message) === activeFilter.value)
})

function relativeTime(post) {
  const ts = post.timestamp || post.date
  const diff = Date.now() - new Date(ts).getTime()
  const days = Math.floor(diff / 86400000)
  if (days < 0) return ''
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days}d ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

onMounted(async () => {
  try {
    const res = await fetch(withBase('/approved-posts.json'))
    if (res.ok) {
      const data = await res.json()
      posts.value = data.filter(p => p.message).reverse()
    } else {
      posts.value = []
    }
  } catch {
    posts.value = []
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="pp-root">
    <p class="pp-intro">Latest updates, new guides, and site improvements.</p>

    <div v-if="loading" class="pp-state">
      <div class="pp-spinner"></div>
      <span>Loading updates…</span>
    </div>

    <div v-else-if="posts.length === 0" class="pp-state">
      <span>No updates yet. Check back soon!</span>
    </div>

    <div v-else class="pp-content">
      <div class="pp-filters">
        <button
          v-for="(meta, key) in CATEGORY_META"
          :key="key"
          :class="['pp-filter', { active: activeFilter === key }]"
          :style="activeFilter === key ? { '--accent': meta.color } : {}"
          @click="activeFilter = key"
        >
          {{ meta.label }}
          <span class="pp-count">{{ posts.filter(p => getCategory(p.message) === key).length }}</span>
        </button>
      </div>

      <TransitionGroup name="post" tag="div" class="pp-timeline">
        <div
          v-for="(post, i) in filteredPosts"
          :key="post.id"
          class="pp-entry"
          :style="{ '--i': i }"
        >
          <div class="pp-dot" :style="{ '--dot': CATEGORY_META[getCategory(post.message)].color }"></div>
          <div class="pp-card">
            <div class="pp-head">
              <span class="pp-badge" :style="{ '--badge': CATEGORY_META[getCategory(post.message)].color }">
                {{ CATEGORY_META[getCategory(post.message)].label }}
              </span>
              <span class="pp-date">{{ post.date }}</span>
              <span class="pp-rel">{{ relativeTime(post) }}</span>
            </div>
            <p class="pp-msg">{{ post.message }}</p>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.pp-root {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 0 2rem;
}

.pp-intro {
  text-align: center;
  color: var(--vp-c-text-2);
  margin-bottom: 1.5rem;
  font-size: 1.05rem;
}

.pp-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  color: var(--vp-c-text-3);
  font-size: 0.95rem;
}

.pp-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: pp-spin 0.8s linear infinite;
}

@keyframes pp-spin {
  to { transform: rotate(360deg); }
}

.pp-filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.pp-filter {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 40px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.pp-filter:hover {
  border-color: var(--vp-c-text-3);
  color: var(--vp-c-text-1);
}

.pp-filter.active {
  border-color: var(--accent, var(--vp-c-brand-1));
  color: var(--accent, var(--vp-c-brand-1));
  background: color-mix(in srgb, var(--accent, var(--vp-c-brand-1)) 10%, transparent);
}

.pp-count {
  font-size: 0.75rem;
  opacity: 0.6;
}

.pp-timeline {
  position: relative;
}

.pp-timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: var(--vp-c-divider);
}

.pp-entry {
  position: relative;
  padding-left: 42px;
  padding-bottom: 1.25rem;
  animation: pp-up 0.4s ease both;
  animation-delay: calc(var(--i, 0) * 0.04s);
}

.pp-entry:last-child {
  padding-bottom: 0;
}

@keyframes pp-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pp-dot {
  position: absolute;
  left: 8px;
  top: 4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--dot, var(--vp-c-brand-1));
  border: 3px solid var(--vp-c-bg);
  box-shadow: 0 0 0 2px var(--dot, var(--vp-c-brand-1));
  z-index: 1;
}

.pp-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 0.85rem 1rem;
  transition: all 0.2s;
}

.pp-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateX(2px);
}

.pp-head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.4rem;
  flex-wrap: wrap;
}

.pp-badge {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.15rem 0.5rem;
  border-radius: 40px;
  color: #fff;
  background: var(--badge, var(--vp-c-brand-1));
}

.pp-date {
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
}

.pp-rel {
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  opacity: 0.7;
}

.pp-rel::before {
  content: '·';
  margin-right: 0.4rem;
}

.pp-msg {
  margin: 0;
  font-size: 0.92rem;
  color: var(--vp-c-text-1);
  line-height: 1.5;
}

.post-enter-active {
  transition: all 0.35s ease;
}

.post-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.post-move {
  transition: transform 0.35s ease;
}

@media (max-width: 640px) {
  .pp-entry {
    padding-left: 36px;
  }

  .pp-dot {
    left: 5px;
    width: 14px;
    height: 14px;
  }

  .pp-timeline::before {
    left: 11px;
  }

  .pp-card {
    padding: 0.7rem 0.85rem;
  }

  .pp-head {
    gap: 0.4rem;
  }

  .pp-date {
    font-size: 0.72rem;
  }

  .pp-rel {
    display: none;
  }

  .pp-msg {
    font-size: 0.85rem;
  }

  .pp-filters {
    gap: 0.35rem;
  }

  .pp-filter {
    font-size: 0.78rem;
    padding: 0.35rem 0.75rem;
  }

  .pp-count {
    display: none;
  }
}
</style>
