<template>
  <button v-if="visible" class="back-to-top-btn" @click="scrollToTop" aria-label="Back to top">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
let ticking = false

function checkScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      visible.value = window.scrollY > 300
      ticking = false
    })
    ticking = true
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', checkScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', checkScroll))
</script>

<style scoped>
.back-to-top-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 50;
  transition: transform 0.2s, opacity 0.2s;
  opacity: 0.9;
}

.back-to-top-btn:hover {
  transform: translateY(-3px);
  opacity: 1;
}

@media (max-width: 640px) {
  .back-to-top-btn {
    bottom: 1rem;
    right: 1rem;
    width: 40px;
    height: 40px;
  }
}
</style>
