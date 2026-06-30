<template>
  <div class="glass-panel">
    <h2 class="panel-title">General</h2>
    <div class="divider"></div>

    <div class="field checkbox-field">
      <ToggleSwitch v-model="settings.autoHideNav" @update:modelValue="saveSettings" />
      <span>Auto-hide header on scroll</span>
    </div>

    <div class="field checkbox-field">
      <ToggleSwitch v-model="settings.reducedMotion" @update:modelValue="saveSettings" />
      <span>Reduced motion</span>
    </div>

    <div class="divider"></div>

    <p class="section-label">Component Visibility</p>

    <div class="field checkbox-field">
      <ToggleSwitch v-model="settings.showBreadcrumbs" @update:modelValue="saveSettings" />
      <span>Show breadcrumbs</span>
    </div>

    <div class="field checkbox-field">
      <ToggleSwitch v-model="settings.showFunFacts" @update:modelValue="saveSettings" />
      <span>Show fun facts</span>
    </div>

    <div class="field checkbox-field">
      <ToggleSwitch v-model="settings.showLightModeFlash" @update:modelValue="saveSettings" />
      <span>Show light mode easter egg</span>
    </div>

    <div class="field checkbox-field">
      <ToggleSwitch v-model="settings.showConfetti" @update:modelValue="saveSettings" />
      <span>Confetti on guide completion</span>
    </div>

    <div class="divider"></div>

    <p class="section-label">Reset Behavior</p>

    <div class="field checkbox-field">
      <ToggleSwitch v-model="settings.confirmBeforeReset" @update:modelValue="saveSettings" />
      <span>Confirm before resetting settings</span>
    </div>

    <div class="divider"></div>

    <p class="section-label">Keyboard Shortcuts</p>

    <div class="shortcuts-list">
      <div class="shortcut-row">
        <kbd>?</kbd>
        <span>Open settings</span>
      </div>
      <div class="shortcut-row">
        <kbd>g</kbd> then <kbd>h</kbd>
        <span>Go to home</span>
      </div>
      <div class="shortcut-row">
        <kbd>g</kbd> then <kbd>t</kbd>
        <span>Go to tools</span>
      </div>
      <div class="shortcut-row">
        <kbd>g</kbd> then <kbd>s</kbd>
        <span>Go to settings</span>
      </div>
      <div class="shortcut-row">
        <kbd>Esc</kbd>
        <span>Un-hide auto-hide nav</span>
      </div>
      <div class="shortcut-row">
        <kbd>Ctrl</kbd>+<kbd>K</kbd>
        <span>Open search</span>
      </div>
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

.shortcuts-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.shortcut-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
}

.shortcut-row kbd {
  display: inline-block;
  padding: 0.15rem 0.45rem;
  font-size: 0.72rem;
  font-family: inherit;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 5px;
  color: var(--vp-c-text-1);
  line-height: 1.4;
  min-width: 1.4rem;
  text-align: center;
}
</style>
