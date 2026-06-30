<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import { computed, onMounted, onUnmounted } from 'vue'
import NavDiscord from './components/NavDiscord.vue'
import NavFeedback from './components/NavFeedback.vue'
import NavRandomGuide from './components/NavRandomGuide.vue'
import NavSettings from './components/NavSettings.vue'
import BackToTop from './components/BackToTop.vue'
import Breadcrumbs from './components/Breadcrumbs.vue'
import ScrollReveal from './components/ScrollReveal.vue'
import FeedbackTopBar from './components/FeedbackTopBar.vue'
import DynamicPrompt from './components/DynamicPrompt.vue'
import GuideActions from './components/GuideActions.vue'
import HelpfulWidget from './components/HelpfulWidget.vue'
import CategoryStrip from './components/CategoryStrip.vue'

const { Layout } = DefaultTheme
const { frontmatter, page } = useData()

const jsonLd = computed(() => {
  if (!frontmatter.value?.title || frontmatter.value?.layout) return ''
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: frontmatter.value.title,
    description: frontmatter.value.description || '',
    url: `https://ner0.netlify.app/${page.value.relativePath.replace(/\.md$/, '')}`,
    author: { '@type': 'Person', name: 'Nero' },
    publisher: { '@type': 'Organization', name: "Nero's Index" },
  }
  if (page.value.lastUpdated) {
    data.dateModified = new Date(page.value.lastUpdated).toISOString()
  }
  return JSON.stringify(data)
})

let lastScroll = 0

function showToast(message, duration = 3000) {
  const toast = document.createElement('div')
  toast.textContent = message
  toast.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:var(--vp-c-bg-soft);color:var(--vp-c-text-1);padding:0.7rem 1.2rem;border-radius:10px;border:1px solid var(--vp-c-divider);font-size:0.85rem;z-index:99999;box-shadow:0 4px 20px rgba(0,0,0,0.3);backdrop-filter:blur(12px);transition:opacity 0.3s ease;font-family:inherit;'
  document.body.appendChild(toast)
  setTimeout(() => { toast.style.opacity = '0' }, duration - 300)
  setTimeout(() => toast.remove(), duration)
}

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

let sudoBuffer = ''
let sudoTimer = null

function onSudoKey(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
  sudoBuffer += e.key.toLowerCase()
  clearTimeout(sudoTimer)
  sudoTimer = setTimeout(() => { sudoBuffer = '' }, 2000)
  if (sudoBuffer.endsWith('whitepin')) {
    sudoBuffer = ''
    showToast('Permission denied: visitor mode active. Try whitepin')
  }
}

const konamiSequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']
let konamiBuffer = []

function onKonamiKey(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
  konamiBuffer.push(e.key)
  if (konamiBuffer.length > konamiSequence.length) {
    konamiBuffer = konamiBuffer.slice(-konamiSequence.length)
  }
  if (JSON.stringify(konamiBuffer) === JSON.stringify(konamiSequence)) {
    konamiBuffer = []
    document.documentElement.classList.toggle('rainbow-mode')
    const active = document.documentElement.classList.contains('rainbow-mode')
    showToast(active ? 'Rainbow mode unlocked!' : 'Rainbow mode disabled')
  }
}

let gBuffer = ''
let gTimer = null

function onGlobalKey(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

  if (e.key === '?') {
    e.preventDefault()
    window.location.href = '/settings'
    return
  }

  if (e.key === 'Escape') {
    document.documentElement.classList.remove('nav-hidden')
    return
  }

  gBuffer += e.key.toLowerCase()
  clearTimeout(gTimer)
  gTimer = setTimeout(() => { gBuffer = '' }, 1000)

  if (gBuffer === 'gh') {
    gBuffer = ''
    window.location.href = '/'
  } else if (gBuffer === 'gt') {
    gBuffer = ''
    window.location.href = '/tools/'
  } else if (gBuffer === 'gs') {
    gBuffer = ''
    window.location.href = '/settings'
  }
}

let touchStartX = 0
let touchStartY = 0

function onTouchStart(e) {
  touchStartX = e.changedTouches[0].screenX
  touchStartY = e.changedTouches[0].screenY
}

function onTouchEnd(e) {
  const dx = e.changedTouches[0].screenX - touchStartX
  const dy = e.changedTouches[0].screenY - touchStartY
  if (Math.abs(dx) < 80 || Math.abs(dy) > Math.abs(dx)) return

  const links = document.querySelectorAll('.VPSidebarItem.level-0 > .item > a, .VPNavBarMenuLink a')
  const current = window.location.pathname
  const hrefs = Array.from(links).map(a => a.getAttribute('href')).filter(Boolean)
  const idx = hrefs.indexOf(current)
  if (idx === -1) return

  if (dx > 0 && idx > 0) window.location.href = hrefs[idx - 1]
  else if (dx < 0 && idx < hrefs.length - 1) window.location.href = hrefs[idx + 1]
}

let logoClicks = 0
let logoTimer = null

const logoMilestones = [
  { at: 7,   msg: 'You clicked the logo 7 times. Are you okay?' },
  { at: 27,  msg: '27 clicks. This is starting to become a problem.' },
  { at: 47,  msg: '47 clicks. I\'m genuinely concerned about you.' },
  { at: 67,  msg: '67 clicks. Have you considered a hobby?' },
  { at: 87,  msg: '87 clicks. You\'re in too deep. There\'s no going back.' },
  { at: 107, msg: '107 clicks. The answer to life is not clicking logos.' },
  { at: 127, msg: '127 clicks. At this point you\'re just mashing things.' },
  { at: 147, msg: '147 clicks. I\'ve seen things you people wouldn\'t believe.' },
  { at: 167, msg: '167 clicks. You and me both know this isn\'t normal.' },
  { at: 187, msg: '187 clicks. Respect the commitment, honestly.' },
  { at: 200, msg: '200 clicks. You are the chosen one. The Logo Clicker. 🏆' },
]

function onLogoClick(e) {
  const target = e.target.closest('.VPNavBarTitle')
  if (!target) return
  logoClicks++
  clearTimeout(logoTimer)
  logoTimer = setTimeout(() => { logoClicks = 0 }, 5000)
  const milestone = logoMilestones.find(m => m.at === logoClicks)
  if (milestone) {
    const logo = target.querySelector('img') || target
    logo.style.animation = 'logo-wobble 0.5s ease'
    setTimeout(() => { logo.style.animation = '' }, 500)
    showToast(milestone.msg)
  }
}

const categoryMap = {
  '/passwords': 'health', '/fitness': 'health', '/cooking': 'health',
  '/sleeping/': 'health', '/all-nighter': 'health',
  '/sleeping/quiz': 'health', '/sleeping/shift-schedule': 'health',
  '/finance': 'money', '/shopping': 'money', '/shopping-resources': 'money',
  '/linux': 'tech', '/privacy': 'tech', '/darkweb': 'tech', '/unenrollment': 'tech',
  '/drawing': 'lifestyle', '/gardening': 'lifestyle', '/minimalism': 'lifestyle',
  '/productivity': 'lifestyle', '/writing-and-note-taking': 'lifestyle',
  '/chess': 'gaming', '/gaming': 'gaming',
}

const categoryColors = {
  health: 'var(--accent-orange)',
  money: 'var(--accent-green)',
  tech: 'var(--accent-blue)',
  lifestyle: 'var(--accent-purple)',
  gaming: 'var(--accent-red)',
}

function annotatePageCards() {
  const path = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/'
  for (const [p, cat] of Object.entries(categoryMap)) {
    const normalized = p.replace(/\/$/, '')
    if (path === normalized || path.startsWith(normalized)) {
      document.documentElement.classList.add(`cat-${cat}`)
      break
    }
  }
}

onMounted(() => {
  annotatePageCards()

  window.addEventListener('scroll', onAutoHideScroll, { passive: true })
  document.addEventListener('keydown', onSudoKey)
  document.addEventListener('keydown', onKonamiKey)
  document.addEventListener('keydown', onGlobalKey)
  document.addEventListener('click', onLogoClick)
  document.addEventListener('touchstart', onTouchStart, { passive: true })
  document.addEventListener('touchend', onTouchEnd, { passive: true })

  if (frontmatter.value?.title && !frontmatter.value?.layout) {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = jsonLd.value
    document.head.appendChild(script)
  }

  const newGuides = {
    '/gardening': '2026-06-01',
    '/gardening.html': '2026-06-01',
    '/writing-and-note-taking': '2026-06-27',
    '/writing-and-note-taking.html': '2026-06-27',
    '/linux': '2026-06-27',
    '/linux.html': '2026-06-27',
    '/chess': '2026-06-28',
    '/chess.html': '2026-06-28',
    '/privacy': '2026-06-28',
    '/privacy.html': '2026-06-28',
  }
  const now = Date.now()

  function addNewBadges() {
    document.querySelectorAll('.VPFeature, .vp-feature, a.VPFeature').forEach(card => {
      if (card.querySelector('.new-badge')) return
      const link = (card.getAttribute('href') || '').replace(/\/$/, '')
      if (newGuides[link]) {
        const added = new Date(newGuides[link]).getTime()
        if (now - added < 15 * 24 * 60 * 60 * 1000) {
          const badge = document.createElement('span')
          badge.className = 'new-badge'
          badge.textContent = 'NEW'
          card.style.position = 'relative'
          card.appendChild(badge)
        }
      }
    })
  }

  setTimeout(addNewBadges, 500)
  setTimeout(addNewBadges, 1500)
  const badgeObs = new MutationObserver(() => setTimeout(addNewBadges, 100))
  badgeObs.observe(document.body, { childList: true, subtree: true })

  let flashbangTimer
  const obs = new MutationObserver(() => {
    const settings = JSON.parse(localStorage.getItem('neros-guide-settings') || '{}')
    if (settings.showLightModeFlash === false) return
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

onUnmounted(() => {
  document.removeEventListener('keydown', onSudoKey)
  document.removeEventListener('keydown', onKonamiKey)
  document.removeEventListener('keydown', onGlobalKey)
  document.removeEventListener('click', onLogoClick)
  document.removeEventListener('touchstart', onTouchStart)
  document.removeEventListener('touchend', onTouchEnd)
})
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <NavDiscord />
      <NavRandomGuide />
      <NavFeedback />
      <NavSettings />
    </template>

    <template #home-hero-actions-after>
      <CategoryStrip />
      <DynamicPrompt />
    </template>

    <template #doc-before>
      <Breadcrumbs />
      <div class="guide-meta-row" v-if="frontmatter?.title && !frontmatter?.layout && !page.relativePath.startsWith('tools/')">
        <span class="guide-author">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          By {{ frontmatter.author || 'Nero' }}
        </span>
        <span class="last-updated" v-if="page.lastUpdated">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Updated {{ new Date(page.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
        </span>
      </div>
    </template>

    <template #doc-after>
      <GuideActions />
      <HelpfulWidget v-if="!frontmatter?.layout && !page.relativePath.startsWith('tools/')" />
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

.guide-author {
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.last-updated {
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
</style>
