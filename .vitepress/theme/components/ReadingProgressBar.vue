<template>
  <div class="reading-progress-bar" :style="{ width: progress + '%' }" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)

function updateProgress() {
  const scroll = window.scrollY
  const height = document.documentElement.scrollHeight - window.innerHeight
  progress.value = height > 0 ? Math.min((scroll / height) * 100, 100) : 0
}

onMounted(() => window.addEventListener('scroll', updateProgress, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', updateProgress))
</script>

<style scoped>
.reading-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--vp-c-brand-2), var(--vp-c-brand-1));
  z-index: 100;
  transition: width 0.1s linear;
}
</style>
