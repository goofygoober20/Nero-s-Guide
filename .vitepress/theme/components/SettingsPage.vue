<template>
  <div class="settings-shell">
    <NeroTabs :tabs="tabs" v-model="activeTab" />
    <transition name="fade-slide" mode="out-in">
      <component
        :is="activeComponent"
        :settings="settings"
        :saveSettings="saveSettings"
        :resetSettings="openResetModal"
        key="activeComponent"
      />
    </transition>
    <GlassModal
      v-if="showReset"
      title="Reset All Settings?"
      message="This will restore all settings to their default values."
      confirmText="Reset"
      cancelText="Cancel"
      @confirm="confirmReset"
      @cancel="showReset = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import NeroTabs from './NeroTabs.vue'
import GlassModal from './GlassModal.vue'
import PanelGeneral from './settings-panels/PanelGeneral.vue'
import PanelAppearance from './settings-panels/PanelAppearance.vue'
import PanelContent from './settings-panels/PanelContent.vue'
import PanelPrivacy from './settings-panels/PanelPrivacy.vue'

const tabs = [
  { id: 'general', label: 'General', icon: 'settings' },
  { id: 'appearance', label: 'Appearance', icon: 'palette' },
  { id: 'content', label: 'Content', icon: 'file-text' },
  { id: 'privacy', label: 'Privacy', icon: 'shield' }
]

const activeTab = ref('general')

const showReset = ref(false)
const isInitialized = ref(false)

const defaults = {
  theme: 'system',
  fontSize: 'medium',
  accentTheme: 'green',
  autoHideNav: false,
  reducedMotion: false,
  showBreadcrumbs: true,
  showFunFacts: true,
  showLightModeFlash: true,
  showConfetti: true,
  bgLevel: 50,
  cardStyle: 'none',
  confirmBeforeReset: true,
}

const settings = ref({ ...defaults })

function applyAccentTheme(name) {
  document.documentElement.classList.remove(
    'accent-red', 'accent-rose', 'accent-coral', 'accent-orange', 'accent-amber', 'accent-gold',
    'accent-yellow', 'accent-lime', 'accent-green', 'accent-mint', 'accent-teal', 'accent-cyan',
    'accent-blue', 'accent-indigo', 'accent-navy', 'accent-purple', 'accent-pink',
    'accent-grey', 'accent-brown', 'accent-white'
  )
  document.documentElement.classList.add('accent-' + name)
}

function applyTheme(mode) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (mode === 'dark') {
    document.documentElement.classList.add('dark')
  } else if (mode === 'light') {
    document.documentElement.classList.remove('dark')
  } else {
    document.documentElement.classList.toggle('dark', prefersDark)
  }
}

function applyFontSize(size) {
  document.documentElement.classList.remove('font-small', 'font-medium', 'font-large')
  if (size && size !== 'medium') {
    document.documentElement.classList.add('font-' + size)
  }
}

function applyReducedMotion(val) {
  document.documentElement.classList.toggle('reduced-motion', !!val)
}

function applyAutoHideNav(val) {
  document.documentElement.classList.toggle('auto-hide-nav', !!val)
  if (!val) {
    document.documentElement.classList.remove('nav-hidden')
  }
}

function applyBgLevel(level) {
  const factor = 0.6 + (level / 100) * 0.8
  document.documentElement.style.setProperty('--vp-bg-level', factor)
}

function applyCardStyle(style) {
  const classes = document.documentElement.className.split(' ')
  classes.forEach(c => {
    if (c.startsWith('card-style-')) document.documentElement.classList.remove(c)
  })
  document.documentElement.classList.add('card-style-' + style)
}

function applyVisibility(name, val) {
  document.documentElement.classList.toggle('hide-' + name, !val)
}

function applyAll() {
  const s = settings.value
  applyAccentTheme(s.accentTheme)
  applyTheme(s.theme)
  applyFontSize(s.fontSize)
  applyReducedMotion(s.reducedMotion)
  applyAutoHideNav(s.autoHideNav)
  applyVisibility('breadcrumbs', s.showBreadcrumbs)
  applyBgLevel(s.bgLevel)
  applyCardStyle(s.cardStyle)
}

onMounted(() => {
  const saved = localStorage.getItem('neros-guide-settings')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      settings.value = { ...defaults, ...parsed }
      if (settings.value.cardStyle === 'tints' || settings.value.cardStyle === 'glow') settings.value.cardStyle = 'none'
    } catch {}
  }
  applyAll()
  isInitialized.value = true

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (settings.value.theme === 'system') applyTheme('system')
  })
})

watch(() => settings.value.accentTheme, applyAccentTheme)
watch(() => settings.value.theme, (val) => {
  applyTheme(val)
})
watch(() => settings.value.fontSize, applyFontSize)
watch(() => settings.value.reducedMotion, applyReducedMotion)
watch(() => settings.value.autoHideNav, applyAutoHideNav)
watch(() => settings.value.showBreadcrumbs, (val) => applyVisibility('breadcrumbs', val))
watch(() => settings.value.bgLevel, applyBgLevel)
watch(() => settings.value.cardStyle, applyCardStyle)

function saveSettings() {
  localStorage.setItem('neros-guide-settings', JSON.stringify(settings.value))
}

function openResetModal() {
  if (settings.value.confirmBeforeReset) {
    showReset.value = true
  } else {
    confirmReset()
  }
}

function confirmReset() {
  settings.value = { ...defaults }
  saveSettings()
  applyAll()
  showReset.value = false
}

const activeComponent = computed(() => ({
  general: PanelGeneral,
  appearance: PanelAppearance,
  content: PanelContent,
  privacy: PanelPrivacy
}[activeTab.value]))
</script>

<style scoped>
.settings-shell {
  max-width: 820px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: 0.25s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
