---
title: Updates & Changelog
---

<script setup>
import { ref, onMounted } from 'vue'

const posts = ref([])
const loading = ref(true)

// Your Discord channel ID for approved posts
const APPROVED_CHANNEL_ID = '1508345092262596618'

// Discord API requires a bot token to read messages
// For now, we'll use a simple JSON file approach

onMounted(async () => {
  try {
    // Try to fetch from a JSON file (we'll set this up next)
    const response = await fetch('/approved-posts.json')
    if (response.ok) {
      const data = await response.json()
      posts.value = data.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else {
      // Fallback to manual posts
      posts.value = [
        { id: 1, date: 'May 24, 2026', message: '✨ New: Privacy guide added' },
        { id: 2, date: 'May 23, 2026', message: '🔧 Updated: Tools section' },
        { id: 3, date: 'May 22, 2026', message: '🐛 Fixed: Search modal styling' },
      ]
    }
  } catch (error) {
    console.error('Failed to load posts:', error)
    posts.value = []
  } finally {
    loading.value = false
  }
})
</script>

<div class="posts-container">
  <p class="intro">Latest updates, new guides, and site improvements.</p>

  <div v-if="loading" class="loading">Loading updates...</div>

  <div v-else-if="posts.length === 0" class="empty">
    <p>No updates yet. Check back soon!</p>
  </div>

  <div v-else class="timeline">
    <div v-for="post in posts" :key="post.id" class="post-item">
      <span class="post-date">{{ post.date }}</span>
      <div class="post-content">
        <p>{{ post.message }}</p>
      </div>
    </div>
  </div>
</div>

<style scoped>
.posts-container {
  max-width: 800px;
  margin: 0 auto;
}

.intro {
  text-align: center;
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-item {
  display: flex;
  gap: 1.5rem;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

.post-date {
  min-width: 100px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.post-content p {
  margin: 0;
  color: var(--vp-c-text-1);
}

.loading, .empty {
  text-align: center;
  padding: 2rem;
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .post-item {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .post-date {
    min-width: auto;
  }
}
</style>