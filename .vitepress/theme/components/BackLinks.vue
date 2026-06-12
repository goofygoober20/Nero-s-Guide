<template>
  <div class="back-links" v-if="links.length > 0">
    <a
      v-for="link in links"
      :key="link.href"
      :href="link.href"
      class="back-link-btn"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      {{ link.label }}
    </a>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()

const prevGuides = {
  'all-nighter': { label: 'All-Nighter Guide', href: '/all-nighter' },
  passwords: { label: 'Password Guide', href: '/passwords' },
  fitness: { label: 'Fitness Guide', href: '/fitness' },
  cooking: { label: 'Cooking Guide', href: '/cooking' },
  drawing: { label: 'Drawing Guide', href: '/drawing' },
  shopping: { label: 'Shopping Guide', href: '/shopping' },
  darkweb: { label: 'Dark Web Guide', href: '/darkweb' },
  chess: { label: 'Chess Guide', href: '/chess' },
  unenrollment: { label: 'Unenrollment', href: '/unenrollment' },
  linux: { label: 'Linux for Beginners', href: '/linux' },
  privacy: { label: 'Online Privacy Guide', href: '/privacy' },
  finance: { label: 'Personal Finance Guide', href: '/finance' },
  productivity: { label: 'Productivity Guide', href: '/productivity' },
  minimalism: { label: 'Minimalism Guide', href: '/minimalism' },
  gaming: { label: 'Gaming Guide', href: '/gaming' },
  'tools/investment-calculator': { label: 'Investment Calculator', href: '/tools/investment-calculator' },
  'tools/pomodoro': { label: 'Pomodoro Timer', href: '/tools/pomodoro' },
  'tools/bmi-calculator': { label: 'BMI Calculator', href: '/tools/bmi-calculator' },
  'tools/password-strength': { label: 'Password Strength', href: '/tools/password-strength' },
  'tools/password-generator': { label: 'Password Generator', href: '/tools/password-generator' },
  'tools/decision-wheel': { label: 'Decision Wheel', href: '/tools/decision-wheel' },
  'tools/unit-converter': { label: 'Unit Converter', href: '/tools/unit-converter' },
  'tools/study-tracker': { label: 'Study Tracker', href: '/tools/study-tracker' },
}

const links = computed(() => {
  const path = page.value?.relativePath?.replace(/\.md$/, '') || ''
  const keys = Object.keys(prevGuides)
  const idx = keys.indexOf(path)
  if (idx === -1) return []

  const result = []
  if (idx > 0) result.push({ label: prevGuides[keys[idx - 1]].label, href: prevGuides[keys[idx - 1]].href })
  result.push({ label: 'All Guides', href: '/' })
  if (idx < keys.length - 1) result.push({ label: prevGuides[keys[idx + 1]].label, href: prevGuides[keys[idx + 1]].href })
  return result
})
</script>

<style scoped>
.back-links {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
  margin: 2rem 0 1rem;
}

.back-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  transition: border-color 0.2s, background 0.2s;
}

.back-link-btn:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}
</style>
