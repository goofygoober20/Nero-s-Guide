<template>
  <div class="glass-panel">
    <h2 class="panel-title">
      <i class="lucide-file-text"></i>
      Content
    </h2>

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

.panel-title i {
  font-size: 1.2rem;
  opacity: 0.85;
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
}
</style>
