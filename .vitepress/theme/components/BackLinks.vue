<template>
  <div class="back-links" v-if="links.length > 0">
    <a
      v-for="link in links"
      :key="link.href"
      :href="link.href"
      class="back-link-btn"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      {{ link.label }}
    </a>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { page, theme } = useData()

function flattenSidebar(sidebar) {
  const items = []
  if (!sidebar) return items
  for (const section of sidebar) {
    if (section.items) {
      for (const item of section.items) {
        if (item.link) {
          items.push({ label: item.text.replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}]\s*/u, ''), href: item.link })
        }
        if (item.items) {
          for (const sub of item.items) {
            if (sub.link) {
              items.push({ label: sub.text.replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}]\s*/u, ''), href: sub.link })
            }
          }
        }
      }
    }
  }
  return items
}

const links = computed(() => {
  const path = page.value?.relativePath?.replace(/\.md$/, '') || ''
  const allItems = flattenSidebar(theme.value?.sidebar)
  const idx = allItems.findIndex(i => i.href === '/' + path || i.href === path)
  if (idx === -1) return []

  const result = []
  if (idx > 0) result.push(allItems[idx - 1])
  result.push({ label: 'All Guides', href: '/' })
  if (idx < allItems.length - 1) result.push(allItems[idx + 1])
  return result
})
</script>

<style scoped>
.back-links {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
  margin: 2rem 0 1rem;
}

.back-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  transition: border-color 0.2s, background 0.2s;
}

.back-link-btn:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}
</style>
