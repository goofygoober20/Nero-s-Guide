<template>
  <div class="settings-shell">

    <!-- Search Bar -->
    <SearchSettings v-model="searchQuery" />

    <!-- Tabs -->
    <NeroTabs
      :tabs="tabs"
      v-model="activeTab"
    />

    <!-- Panels -->
    <transition name="fade-slide" mode="out-in">
      <component
        :is="activeComponent"
        :settings="settings"
        :saveSettings="saveSettings"
        :resetSettings="openResetModal"
        key="activeComponent"
      />
    </transition>

    <!-- Reset Modal -->
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
import { ref, computed, onMounted } from 'vue'
import NeroTabs from './NeroTabs.vue'
import SearchSettings from './SearchSettings.vue'
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
const searchQuery = ref('')
const showReset = ref(false)

const settings = ref({
  theme: 'system',
  fontSize: 'medium',
  showNSFW: false,
  externalLinks: 'new-tab',
  telemetry: false
})

onMounted(() => {
  const saved = localStorage.getItem('neros-guide-settings')
  if (saved) {
    try {
      settings.value = { ...settings.value, ...JSON.parse(saved) }
    } catch {}
  }
})

function saveSettings() {
  localStorage.setItem('neros-guide-settings', JSON.stringify(settings.value))
}

function openResetModal() {
  showReset.value = true
}

function confirmReset() {
  settings.value = {
    theme: 'system',
    fontSize: 'medium',
    showNSFW: false,
    externalLinks: 'new-tab',
    telemetry: false
  }
  saveSettings()
  showReset.value = false
}

const activeComponent = computed(() => {
  return {
    general: PanelGeneral,
    appearance: PanelAppearance,
    content: PanelContent,
    privacy: PanelPrivacy
  }[activeTab.value]
})
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
