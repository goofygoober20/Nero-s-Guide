<template>
  <div class="glass-panel">
    <h2 class="panel-title">
      <i class="lucide-shield"></i>
      Privacy
    </h2>

    <div class="divider"></div>

    <p class="info">
      Your settings are stored locally in your browser.  
      No data is sent to any server.
    </p>

    <button class="btn danger" @click="resetSettings">
      <i class="lucide-rotate-ccw"></i>
      Reset All Settings
    </button>
  </div>
</template>

<script setup>
defineProps({
  resetSettings: Function
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

.info {
  opacity: 0.8;
  margin-bottom: 1.5rem;
}

.btn {
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn.danger {
  background: rgba(255, 80, 80, 0.25);
  color: #ff6b6b;
  border: 1px solid rgba(255, 80, 80, 0.4);
}
</style>
