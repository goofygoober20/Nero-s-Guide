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
  ]
  const randomGuide = guides[Math.floor(Math.random() * guides.length)]
  window.location.href = randomGuide
})
</script>

<div style="text-align: center; padding: 3rem;">
  <p>🎲 Loading a random guide...</p>
</div>