<template>
  <div class="guide-actions" v-if="showActions">
    <p class="actions-label">Found this helpful?</p>
    <div class="actions-row">
      <button class="action-btn share-x" @click="shareOnX" title="Share on X">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        Share on X
      </button>
      <button class="action-btn copy-link" @click="copyLink" :class="{ copied }">
        <svg v-if="!copied" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        {{ copied ? 'Copied!' : 'Copy Link' }}
      </button>
      <button class="action-btn download-btn" @click="downloadTxt" title="Download as .txt">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        .txt
      </button>
      <button class="action-btn download-btn" @click="downloadMd" title="Download as .md">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        .md
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useData } from 'vitepress'

const { page, frontmatter } = useData()
const copied = ref(false)

const showActions = computed(() => {
  const path = page.value?.relativePath || ''
  if (path.startsWith('tools/')) return false
  if (path === 'index.md' || path === 'about.md' || path === 'feedback.md' || path === 'settings.md' || path === 'posts.md' || path === 'updates.md') return false
  if (frontmatter.value?.layout === 'home') return false
  return true
})

const pageUrl = computed(() => {
  if (typeof window !== 'undefined') return window.location.href
  return ''
})

const pageTitle = computed(() => frontmatter.value?.title || 'Nero\'s Index')

function shareOnX() {
  const url = encodeURIComponent(pageUrl.value)
  const text = encodeURIComponent(`Check out this guide: ${pageTitle.value}`)
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=550,height=420')
}

function copyLink() {
  navigator.clipboard.writeText(pageUrl.value).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  })
}

function getPageText() {
  const el = document.querySelector('.vp-doc')
  if (!el) return ''
  return el.innerText
}

function downloadTxt() {
  const text = getPageText()
  const blob = new Blob([text], { type: 'text/plain' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${pageTitle.value.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.txt`
  a.click()
  URL.revokeObjectURL(a.href)
}

function downloadMd() {
  const rawPath = page.value?.relativePath
  if (!rawPath) return
  fetch(`/${rawPath}`)
    .then(r => r.text())
    .then(text => {
      const blob = new Blob([text], { type: 'text/markdown' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = rawPath.split('/').pop()
      a.click()
      URL.revokeObjectURL(a.href)
    })
}
</script>

<style scoped>
.guide-actions {
  margin: 2.5rem 0 1.5rem;
  padding: 1.2rem 1.5rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
}

.actions-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin: 0 0 0.75rem;
}

.actions-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  transform: translateY(-1px);
}

.share-x:hover {
  background: #1a1a2e;
  color: #fff;
  border-color: #1a1a2e;
}

.copy-link.copied {
  border-color: #22c55e;
  color: #22c55e;
}

.download-btn:hover {
  background: var(--vp-c-bg-soft);
}
</style>
