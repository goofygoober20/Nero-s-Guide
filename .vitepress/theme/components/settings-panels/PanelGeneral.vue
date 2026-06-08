<template>
  <div class="glass-panel">
    <h2 class="panel-title">General</h2>
    <div class="divider"></div>

    <div class="field checkbox-field">
      <ToggleSwitch v-model="settings.autoHideNav" @update:modelValue="saveSettings" />
      <span>Auto-hide header on scroll</span>
    </div>

    <div class="field checkbox-field">
      <ToggleSwitch v-model="settings.confirmBeforeLeave" @update:modelValue="saveSettings" />
      <span>Confirm before leaving page</span>
    </div>

    <div class="field checkbox-field">
      <ToggleSwitch v-model="settings.reducedMotion" @update:modelValue="saveSettings" />
      <span>Reduced motion</span>
    </div>

    <div class="divider"></div>

    <p class="section-label">Component Visibility</p>

    <div class="field checkbox-field">
      <ToggleSwitch v-model="settings.showReadingProgress" @update:modelValue="saveSettings" />
      <span>Show reading progress bar</span>
    </div>

    <div class="field checkbox-field">
      <ToggleSwitch v-model="settings.showBreadcrumbs" @update:modelValue="saveSettings" />
      <span>Show breadcrumbs</span>
    </div>

    <div class="divider"></div>

    <p class="section-label">Reset Behavior</p>

    <div class="field checkbox-field">
      <ToggleSwitch v-model="settings.confirmBeforeReset" @update:modelValue="saveSettings" />
      <span>Confirm before resetting settings</span>
    </div>

    <div class="field checkbox-field">
      <ToggleSwitch v-model="settings.telemetry" @update:modelValue="saveSettings" />
      <span>Enable Telemetry</span>
    </div>
  </div>
</template>

<script setup>
import ToggleSwitch from '../ToggleSwitch.vue'

defineProps({
  settings: Object,
  saveSettings: Function
})
</script>

<style scoped>
.glass-panel {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.15);
  backdrop-filter: blur(22px) saturate(140%);
  border-radius: 20px;
  padding: 1.6rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
  transition: 0.25s ease;
}

.glass-panel:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.35);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
}

.divider {
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(255,255,255,0.25), transparent);
  margin: 1rem 0 1.4rem;
}

.section-label {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-3);
  margin: 0 0 0.8rem;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.2rem;
}

.field > span:first-child {
  opacity: 0.8;
  margin-bottom: 0.3rem;
}

select {
  padding: 0.6rem;
  border-radius: 10px;
  background: rgba(255,255,255,0.15);
  border: 1px solid var(--vp-c-divider);
  backdrop-filter: blur(10px);
  color: var(--vp-c-text-1);
}

.checkbox-field {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.8rem;
}

.checkbox-field > span:first-child {
  margin-bottom: 0;
}
</style>
