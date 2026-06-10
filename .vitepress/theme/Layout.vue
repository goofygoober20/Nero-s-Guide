<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import { computed, onMounted } from 'vue'
import NavFeedback from './components/NavFeedback.vue'
import NavSettings from './components/NavSettings.vue'
import ReadingProgressBar from './components/ReadingProgressBar.vue'
import BackToTop from './components/BackToTop.vue'
import Breadcrumbs from './components/Breadcrumbs.vue'
import DifficultyBadge from './components/DifficultyBadge.vue'
import ScrollReveal from './components/ScrollReveal.vue'
import FeedbackTopBar from './components/FeedbackTopBar.vue'
import GuideProgress from './components/GuideProgress.vue'
import DynamicPrompt from './components/DynamicPrompt.vue'

const { Layout } = DefaultTheme
const { frontmatter, page } = useData()

let lastScroll = 0

function onAutoHideScroll() {
  try {
    const saved = localStorage.getItem('neros-guide-settings')
    if (!saved) return
    const parsed = JSON.parse(saved)
    if (!parsed.autoHideNav) return

    const current = window.scrollY
    if (current > 150) {
      document.documentElement.classList.toggle('nav-hidden', current > lastScroll)
    } else {
      document.documentElement.classList.remove('nav-hidden')
    }
    lastScroll = current
  } catch {}
}

onMounted(() => {
  window.addEventListener('scroll', onAutoHideScroll, { passive: true })
  let flashbangTimer
  const obs = new MutationObserver(() => {
    if (document.documentElement.classList.contains('dark')) return
    clearTimeout(flashbangTimer)
    flashbangTimer = setTimeout(() => {
      const el = document.createElement('div')
      el.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;pointer-events:none;transition:opacity 0.5s ease'
      const wrapper = document.createElement('div')
      wrapper.style.cssText = 'width:min(70vw,500px);height:min(70vw,500px);overflow:hidden;clip-path:circle(38% at 50% 62%);'
      const img = document.createElement('img')
      img.src = '/squidward.jpg'
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;object-position:50% 65%;display:block;'
      wrapper.appendChild(img)
      el.appendChild(wrapper)
      document.body.appendChild(el)
      setTimeout(() => {
        el.style.opacity = '0'
        setTimeout(() => el.remove(), 500)
      }, 1000)
    }, 100)
  })
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

const readingTime = computed(() => {
  const text = page.value?.content || ''
  const words = text.split(/\s+/).filter(Boolean).length
  const minutes = Math.ceil(words / 200)
  if (minutes < 1) return '<1 min read'
  return `${minutes} min read`
})
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <NavFeedback />
      <NavSettings />
    </template>

    <template #home-hero-actions-after>
      <DynamicPrompt />
    </template>

    <template #layout-top>
      <ReadingProgressBar />
    </template>

    <template #doc-before>
      <Breadcrumbs />
      <div class="guide-meta-row" v-if="frontmatter?.title && !frontmatter?.layout && !page.relativePath.startsWith('tools/')">
        <DifficultyBadge :difficulty="frontmatter?.difficulty" />
        <span class="reading-time">{{ readingTime }}</span>
      </div>
    </template>

    <template #doc-after>
      <GuideProgress />
      <ScrollReveal />
    </template>

    <template #layout-bottom>
      <FeedbackTopBar v-if="page.relativePath !== 'feedback.md'" />
      <BackToTop />
    </template>
  </Layout>
</template>

<style scoped>
.guide-meta-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.5rem 0 1rem;
}

.reading-time {
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}
</style>
