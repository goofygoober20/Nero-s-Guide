<template>
  <div class="glass-panel">
    <h2 class="panel-title">
      <i class="lucide-palette"></i>
      Appearance
    </h2>

    <div class="divider"></div>

    <div class="field">
      <span>Theme Mode</span>
      <select v-model="settings.theme" @change="saveSettings">
        <option value="system">System Default</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>

    <div class="field">
      <span>Font Size</span>
      <select v-model="settings.fontSize" @change="saveSettings">
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>
    </div>
  </div>
</template>

<script setup>
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

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.2rem;
}

.field span {
  opacity: 0.8;
  margin-bottom: 0.3rem;
}

select {
  padding: 0.6rem;
  border-radius: 10px;
  background: rgba(255,255,255,0.15);
  border: 1px solid var(--vp-c-divider);
  backdrop-filter: blur(10px);
}
</style>
