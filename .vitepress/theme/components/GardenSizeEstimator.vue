<template>
  <div class="glass-panel">
    <h3 class="section-title"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg> Garden Size Estimator</h3>
    <p class="section-sub">Enter your space dimensions to get estimated soil volume, bed count, and cost range.</p>

    <div class="input-grid">
      <div class="input-group">
        <label>Length (m)</label>
        <input type="number" v-model.number="length" min="0.5" step="0.5" class="num-input" />
      </div>
      <div class="input-group">
        <label>Width (m)</label>
        <input type="number" v-model.number="width" min="0.5" step="0.5" class="num-input" />
      </div>
      <div class="input-group">
        <label>Bed depth (cm)</label>
        <select v-model.number="depth" class="num-input">
          <option :value="15">15 cm (shallow)</option>
          <option :value="20">20 cm (standard)</option>
          <option :value="30">30 cm (deep root)</option>
        </select>
      </div>
    </div>

    <div v-if="totalArea >= 0.25" class="results-grid">
      <div class="result-card">
        <span class="result-icon">📐</span>
        <strong>{{ totalArea.toFixed(1) }} m²</strong>
        <span class="result-label">Total area</span>
      </div>
      <div class="result-card">
        <span class="result-icon">📦</span>
        <strong>{{ bedCount }} bed{{ bedCount !== 1 ? 's' : '' }}</strong>
        <span class="result-label">1.2m wide beds</span>
      </div>
      <div class="result-card">
        <span class="result-icon">🪣</span>
        <strong>{{ soilVolume }} m³</strong>
        <span class="result-label">Soil needed</span>
      </div>
      <div class="result-card">
        <span class="result-icon">💷</span>
        <strong>£{{ costLow }}–£{{ costHigh }}</strong>
        <span class="result-label">Estimated cost</span>
      </div>
    </div>

    <div v-if="totalArea >= 0.25" class="breakdown">
      <h4>Cost Breakdown</h4>
      <div class="breakdown-grid">
        <div class="breakdown-item">
          <span>Topsoil ({{ soilVolume }} m³)</span>
          <strong>£{{ topsoilCost }}</strong>
        </div>
        <div class="breakdown-item">
          <span>Compost ({{ compostVolume }} m³)</span>
          <strong>£{{ compostCost }}</strong>
        </div>
        <div class="breakdown-item">
          <span>Bed frame ({{ bedCount }}× raised bed)</span>
          <strong>£{{ frameCost }}</strong>
        </div>
        <div class="breakdown-item">
          <span>Seeds / seedlings</span>
          <strong>£{{ seedCost }}</strong>
        </div>
      </div>
      <p class="breakdown-note">Prices based on UK averages. Soil and compost bought in bulk bags. Costs drop significantly if you make your own compost.</p>
    </div>

    <div v-if="totalArea >= 0.25" class="layout-hint">
      <h4>Suggested Layout</h4>
      <div class="layout-visual">
        <div
          v-for="(bed, i) in layoutBeds"
          :key="i"
          class="layout-bed"
          :style="{ width: bed.w + '%', height: bed.h + 'px' }"
        >
          <span>{{ bed.label }}</span>
        </div>
        <div v-if="layoutPath" class="layout-path">
          <span>path</span>
        </div>
      </div>
      <p class="layout-note">{{ layoutAdvice }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const length = ref(3)
const width = ref(3)
const depth = ref(20)

const totalArea = computed(() => length.value * width.value)
const bedCount = computed(() => Math.max(1, Math.ceil(totalArea.value / (1.2 * Math.min(width.value, length.value)))))
const soilVolume = computed(() => ((totalArea.value * depth.value) / 100).toFixed(2))
const compostVolume = computed(() => ((totalArea.value * (depth.value / 3)) / 100).toFixed(2))

const topsoilCost = computed(() => Math.round(parseFloat(soilVolume.value) * 35))
const compostCost = computed(() => Math.round(parseFloat(compostVolume.value) * 45))
const frameCost = computed(() => bedCount.value * 25)
const seedCost = computed(() => bedCount.value * 15)
const costLow = computed(() => Math.round((topsoilCost.value + compostCost.value + frameCost.value + seedCost.value) * 0.8))
const costHigh = computed(() => Math.round((topsoilCost.value + compostCost.value + frameCost.value + seedCost.value) * 1.3))

const layoutBeds = computed(() => {
  const beds = []
  const n = Math.min(bedCount.value, 6)
  for (let i = 0; i < n; i++) {
    beds.push({
      w: 100 / n,
      h: 50,
      label: `Bed ${i + 1}`,
    })
  }
  return beds
})

const layoutPath = computed(() => bedCount.value > 1)
const layoutAdvice = computed(() => {
  if (bedCount.value === 1) return 'One bed fills your space. Keep it under 1.2m wide so you can reach the centre from both sides.'
  if (bedCount.value === 2) return 'Two parallel beds with a path between. Place the path on the side that gets the most sun.'
  return `${bedCount.value} beds arranged in rows. Leave 30–40cm paths between beds for access and airflow.`
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
  margin: 1.5rem 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
}

.section-sub {
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
  margin-bottom: 1.2rem;
}

.input-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.2rem;
}

.input-group label {
  display: block;
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
  margin-bottom: 0.3rem;
}

.num-input {
  width: 100%;
  padding: 0.6rem 0.7rem;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  box-sizing: border-box;
}

.num-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.2rem;
}

.result-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 1rem 0.5rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  text-align: center;
}

.result-icon {
  font-size: 1.4rem;
}

.result-card strong {
  font-size: 0.95rem;
}

.result-label {
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
}

.breakdown, .layout-hint {
  margin-top: 1.2rem;
}

.breakdown h4, .layout-hint h4 {
  font-size: 0.9rem;
  margin-bottom: 0.6rem;
}

.breakdown-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  font-size: 0.82rem;
}

.breakdown-item strong {
  color: var(--vp-c-brand-1);
}

.breakdown-note {
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  margin-top: 0.3rem;
}

.layout-visual {
  display: flex;
  gap: 0.4rem;
  align-items: flex-end;
  padding: 0.75rem;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  min-height: 80px;
}

.layout-bed {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(113,173,112,0.25);
  border: 1px solid rgba(113,173,112,0.4);
  border-radius: 6px;
  font-size: 0.7rem;
  color: var(--vp-c-brand-1);
  font-weight: 600;
  min-width: 40px;
}

.layout-path {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.65rem;
  color: var(--vp-c-text-3);
}

.layout-note {
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
  margin-top: 0.5rem;
}
</style>
