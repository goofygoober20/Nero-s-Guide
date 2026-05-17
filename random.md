---
title: Random Guide
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

onMounted(() => {
  const guides = [
    '/sleeping',
    '/password',
    '/all-nighter',
    '/fitness',
    '/cooking',
    '/mental-health',
    '/productivity',
    '/drawing',
    '/shopping',
    '/fashion',
    '/chess',
    '/gaming-tools',
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
    '/unenrollment',
    '/misc',
    '/settings',
  ]
  const randomGuide = guides[Math.floor(Math.random() * guides.length)]
  window.location.href = randomGuide
})
</script>

<div style="text-align: center; padding: 3rem;">
  <p>🎲 Loading a random guide...</p>
</div>