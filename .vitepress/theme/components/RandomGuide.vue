<template>
  <div class="random-guide-container">
    <button class="random-guide-btn" @click="goToRandomGuide">
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
  <circle cx="8.5" cy="8.5" r="1.5"></circle>
  <circle cx="15.5" cy="8.5" r="1.5"></circle>
  <circle cx="8.5" cy="15.5" r="1.5"></circle>
  <circle cx="15.5" cy="15.5" r="1.5"></circle>
</svg>
      Random Guide
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m9 18 6-6-6-6"/>
      </svg>
    </button>
    
    <div v-if="showNotification" class="random-notification">
      🎲 Loading a random guide...
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()
const showNotification = ref(false)

// ============================================
// 📝 IMPORTANT: UPDATE THIS LIST WITH YOUR GUIDES
// ============================================
// Add ALL your guide pages here (excluding index, about, settings, etc.)
// Paths should be relative to the site root (no .md extension)

const guides = [
  // Personal Guides
  '/sleeping',
  '/password',
  '/all-nighter',
  '/fitness',
  '/cooking',
  '/mental-health',
  '/drawing',
  '/shopping',
  '/fashion',
  '/chess',
  '/tor-guide',
  
  // Resource Guides
  '/privacy',
  '/ai',
  '/video',
  '/audio',
  '/gaming',
  '/reading',
  '/career',
  '/downloading',
  '/food',
  '/health',
  '/educational',
  '/misc',
  '/settings',
  '/beginners-guide',
]

// Remove duplicates (just in case)
const uniqueGuides = [...new Set(guides)]

const goToRandomGuide = () => {
  // Show loading notification
  showNotification.value = true
  
  // Pick a random guide
  const randomIndex = Math.floor(Math.random() * uniqueGuides.length)
  const randomGuide = uniqueGuides[randomIndex]
  
  // Hide notification after 1 second and navigate
  setTimeout(() => {
    showNotification.value = false
    // Use window.location for full page navigation
    window.location.href = randomGuide
  }, 500)
}
</script>

<style scoped>
.random-guide-container {
  position: relative;
  display: inline-block;
}

.random-guide-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.random-guide-btn:hover {
  transform: translateY(-2px);
  background: var(--vp-c-brand-1);
  color: white;
  box-shadow: 0 4px 12px rgba(var(--vp-c-brand-1-rgb), 0.3);
}

.random-notification {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--vp-c-brand-1);
  color: white;
  padding: 10px 20px;
  border-radius: 50px;
  font-size: 0.875rem;
  z-index: 1000;
  animation: fadeInOut 1.5s ease;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
  20% { opacity: 1; transform: translateX(-50%) translateY(0); }
  80% { opacity: 1; transform: translateX(-50%) translateY(0); }
  100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
}

@media (max-width: 640px) {
  .random-guide-btn {
    padding: 8px 16px;
    font-size: 0.85rem;
  }
  
  .random-notification {
    white-space: normal;
    text-align: center;
    font-size: 0.8rem;
  }
}
</style>