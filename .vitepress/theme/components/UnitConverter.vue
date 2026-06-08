<template>
  <div class="uc-container">
    <div class="uc-card">
      <div class="uc-tabs">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="uc-tab"
          :class="{ active: activeCategory === cat.id }"
          @click="activeCategory = cat.id"
        >
          {{ cat.label }}
        </button>
      </div>

      <div class="uc-converter">
        <div class="uc-field">
          <input type="number" v-model.number="fromValue" class="uc-input" min="0" step="any" />
          <select v-model="fromUnit" class="uc-select">
            <option v-for="u in currentUnits" :key="u" :value="u">{{ u }}</option>
          </select>
        </div>

        <button class="uc-swap-btn" @click="swapUnits" aria-label="Swap units">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
        </button>

        <div class="uc-field">
          <input type="number" :value="toValue" class="uc-input" readonly />
          <select v-model="toUnit" class="uc-select">
            <option v-for="u in currentUnits" :key="u" :value="u">{{ u }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const categories = [
  { id: 'length', label: 'Length' },
  { id: 'mass', label: 'Mass / Weight' },
  { id: 'volume', label: 'Volume' },
  { id: 'temp', label: 'Temperature' },
]

const activeCategory = ref('length')

const units = {
  length: { base: 'm', values: { 'mm': 0.001, 'cm': 0.01, 'm': 1, 'km': 1000, 'in': 0.0254, 'ft': 0.3048, 'yd': 0.9144, 'mi': 1609.344 } },
  mass: { base: 'g', values: { 'mg': 0.001, 'g': 1, 'kg': 1000, 'oz': 28.3495, 'lb': 453.592, 'st': 6350.29 } },
  volume: { base: 'L', values: { 'mL': 0.001, 'L': 1, 'gal': 3.78541, 'qt': 0.946353, 'pt': 0.473176, 'cup': 0.236588, 'fl oz': 0.0295735, 'tbsp': 0.0147868, 'tsp': 0.00492892 } },
  temp: { base: '°C', values: {} },
}

const fromUnit = ref('m')
const toUnit = ref('ft')
const fromValue = ref(1)

const currentUnits = computed(() => Object.keys(units[activeCategory.value]?.values || {}))

function convert(value, from, to, cat) {
  if (cat === 'temp') {
    if (from === to) return value
    let celsius
    if (from === '°C') celsius = value
    else if (from === '°F') celsius = (value - 32) * 5 / 9
    else if (from === 'K') celsius = value - 273.15

    if (to === '°C') return celsius
    if (to === '°F') return celsius * 9 / 5 + 32
    if (to === 'K') return celsius + 273.15
    return value
  }

  const u = units[cat]
  const baseFrom = from === u.base ? value : value * (u.values[from] || 1)
  const baseTo = to === u.base ? 1 : (u.values[to] || 1)
  return baseFrom / baseTo
}

const toValue = computed(() => {
  const v = convert(fromValue.value || 0, fromUnit.value, toUnit.value, activeCategory.value)
  if (typeof v === 'number' && !Number.isInteger(v)) return parseFloat(v.toFixed(6))
  return v
})

function swapUnits() {
  const tmp = fromUnit.value
  fromUnit.value = toUnit.value
  toUnit.value = tmp
}

watch(activeCategory, (cat) => {
  const keys = Object.keys(units[cat]?.values || {})
  if (keys.length >= 2) {
    fromUnit.value = keys[0]
    toUnit.value = keys[1]
  }
})
</script>

<style scoped>
.uc-container {
  max-width: 480px;
  margin: 2rem auto;
}

.uc-card {
  padding: 1.5rem;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.uc-tabs {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.uc-tab {
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.uc-tab.active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.uc-tab:hover:not(.active) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}

.uc-converter {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
}

.uc-field {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.uc-input {
  flex: 1;
  padding: 0.65rem;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 1.1rem;
  font-family: monospace;
  min-width: 0;
}

.uc-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.uc-input[readonly] {
  background: var(--vp-c-bg-soft);
  cursor: default;
}

.uc-select {
  padding: 0.65rem;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  cursor: pointer;
}

.uc-swap-btn {
  padding: 0.4rem;
  border-radius: 50%;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: border-color 0.2s, color 0.2s;
}

.uc-swap-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
</style>
