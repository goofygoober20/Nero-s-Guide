<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
let observer = null

function observeRevealElements() {
  if (observer) observer.disconnect()

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
}

watch(() => route.path, () => {
  setTimeout(observeRevealElements, 50)
})

onMounted(() => {
  observeRevealElements()
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<template><div /></template>
