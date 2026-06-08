<template>
  <nav v-if="crumbs.length > 0" class="breadcrumbs" aria-label="Breadcrumb">
    <a href="/" class="breadcrumb-link">Home</a>
    <span v-for="(crumb, i) in crumbs" :key="i" class="breadcrumb-segment">
      <span class="breadcrumb-sep">/</span>
      <a v-if="i < crumbs.length - 1" :href="crumb.path" class="breadcrumb-link">{{ crumb.label }}</a>
      <span v-else class="breadcrumb-current">{{ crumb.label }}</span>
    </span>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { page, frontmatter } = useData()

const labels = {
  sleeping: 'Sleeping Guide',
  passwords: 'Password Guide',
  fitness: 'Fitness Guide',
  cooking: 'Cooking Guide',
  'mental-health': 'Mental Health Guide',
  drawing: 'Drawing Guide',
  shopping: 'Shopping Guide',
  darkweb: 'Dark Web Guide',
  chess: 'Chess Guide',
  music: 'Music Streaming Guide',
  unenrollment: 'Unenrollment',
  linux: 'Linux for Beginners',
  privacy: 'Online Privacy',
  finance: 'Personal Finance',
  productivity: 'Productivity Guide',
  minimalism: 'Minimalism Guide',
  gaming: 'Gaming Guide',
  tools: 'Tools',
  'all-nighter': 'All-Nighter Guide',
  about: 'About',
  posts: 'Posts',
  feedback: 'Feedback',
  settings: 'Settings',
  random: 'Random Guide',
}

const crumbs = computed(() => {
  const parts = page.value?.relativePath?.replace(/\.md$/, '').split('/') || []
  if (parts.length === 0 || (parts.length === 1 && parts[0] === 'index')) return []

  const result = []
  let path = ''
  for (let i = 0; i < parts.length; i++) {
    path += '/' + parts[i]
    const key = parts[i]
    result.push({
      label: labels[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' '),
      path
    })
  }
  return result
})
</script>

<style scoped>
.breadcrumbs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
  font-size: 0.78rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--vp-c-divider-light);
}

.breadcrumb-link {
  color: var(--vp-c-text-3);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: var(--vp-c-brand-1);
}

.breadcrumb-sep {
  color: var(--vp-c-text-3);
  margin: 0 0.15rem;
  font-size: 0.7rem;
}

.breadcrumb-current {
  color: var(--vp-c-text-1);
  font-weight: 500;
}
</style>
