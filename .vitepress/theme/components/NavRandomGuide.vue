<template>
  <button class="nav-random-btn" @click="goRandom" aria-label="Random Guide" title="Random Guide">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="16 3 21 3 21 8"/>
      <line x1="4" y1="20" x2="21" y2="3"/>
      <polyline points="21 16 21 21 16 21"/>
      <line x1="15" y1="15" x2="21" y2="21"/>
      <line x1="4" y1="4" x2="9" y2="9"/>
    </svg>
  </button>
</template>

<script setup>
const guides = [
  '/passwords',
  '/fitness',
  '/cooking',
  '/drawing',
  '/shopping',
  '/chess',
  '/darkweb',
  '/unenrollment',
  '/linux',
  '/privacy',
  '/finance',
  '/productivity',
  '/minimalism',
  '/gaming',
  '/gardening',
]

let randomClicks = 0
let randomTimer = null

function goRandom() {
  randomClicks++
  clearTimeout(randomTimer)
  randomTimer = setTimeout(() => { randomClicks = 0 }, 10000)

  if (randomClicks >= 5) {
    randomClicks = 0
    const toast = document.createElement('div')
    toast.textContent = "You're adventurous!"
    Object.assign(toast.style, {
      position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
      background: 'linear-gradient(135deg, #9b59b6, #8e44ad)', color: '#fff',
      padding: '0.8rem 1.6rem', borderRadius: '12px', fontWeight: '700',
      fontSize: '0.95rem', zIndex: '99999', boxShadow: '0 4px 20px rgba(155,89,182,0.4)'
    })
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 4000)
  }

  const guide = guides[Math.floor(Math.random() * guides.length)]
  window.location.href = guide
}
</script>

<style scoped>
.nav-random-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: none;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
  padding: 0;
}

.nav-random-btn:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}
</style>
