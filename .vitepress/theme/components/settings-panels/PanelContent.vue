<template>
  <div class="glass-panel">
    <h2 class="panel-title">Content</h2>

    <div class="divider"></div>

    <div class="field checkbox-field">
      <ToggleSwitch v-model="settings.showNSFW" @update:modelValue="saveSettings" />
      <span>Show NSFW content</span>
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
  background: linear-gradient(
    to right,
    transparent,
    rgba(255,255,255,0.25),
    transparent
  );
  margin: 1rem 0 1.4rem;
}

.checkbox-field {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
}

.field-label {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: var(--vp-c-text-1);
}

.text-input {
  padding: 0.65rem 0.8rem;
  border-radius: 10px;
  background: rgba(255,255,255,0.15);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.text-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.field-hint {
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  margin: 0.35rem 0 0;
}
</style>
