<template>
  <div class="wake-calc">
    <div class="calc-header">
      <span class="calc-icon">🌙</span>
      <div>
        <h3 class="calc-title">Sleep Cycle Wake-Up Calculator</h3>
        <p class="calc-subtitle">Enter when you plan to sleep, and optionally when you must wake up, to find the best alarm times.</p>
      </div>
    </div>

    <div class="calc-fields">
      <div class="calc-field">
        <label for="sleepTime">Going to sleep at</label>
        <input id="sleepTime" type="time" v-model="sleepTime" class="calc-input" />
      </div>
      <div class="calc-field">
        <label for="deadlineTime">Must wake by (optional)</label>
        <input id="deadlineTime" type="time" v-model="deadlineTime" class="calc-input" />
      </div>
    </div>

    <div v-if="results.length" class="calc-results">
      <div class="results-header">
        <h4>Optimal Wake-Up Times</h4>
        <p class="results-note">Assumes ~15 min to fall asleep. Waking at cycle end reduces grogginess.</p>
      </div>
      <div class="cycle-grid">
        <div
          v-for="r in results"
          :key="r.cycles"
          class="cycle-card"
          :class="{ 'cycle-best': r.recommended, 'cycle-overtime': r.pastDeadline }"
        >
          <div v-if="r.recommended" class="cycle-badge">Best</div>
          <div v-if="r.pastDeadline" class="cycle-badge deadline-badge">Past deadline</div>
          <div class="cycle-time">{{ r.wakeTime }}</div>
          <div class="cycle-label">{{ r.cycles }} cycle{{ r.cycles > 1 ? 's' : '' }}</div>
          <div class="cycle-duration">{{ r.duration }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const sleepTime = ref('')
const deadlineTime = ref('')

const cycles = [1, 2, 3, 4, 5, 6]

function parseMinutes(val) {
  if (!val) return null
  const parts = val.split(':')
  if (parts.length !== 2) return null
  const h = parseInt(parts[0], 10)
  const m = parseInt(parts[1], 10)
  if (isNaN(h) || isNaN(m)) return null
  return h * 60 + m
}

function formatTime(totalMinutes) {
  const h = Math.floor(totalMinutes / 60) % 24
  const m = totalMinutes % 60
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
}

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} hr`
  return `${h} hr ${m} min`
}

const results = computed(() => {
  const sleep = parseMinutes(sleepTime.value)
  if (sleep === null) return []

  const deadline = parseMinutes(deadlineTime.value)
  const fallAsleep = sleep + 15

  return cycles.map((c) => {
    const wakeMinutes = fallAsleep + c * 90
    const wakeFormatted = formatTime(wakeMinutes)
    const durationFormatted = formatDuration(c * 90 + 15)
    const recommended = c >= 3 && c <= 5
    const pastDeadline = deadline !== null && wakeMinutes > deadline
    return {
      cycles: c,
      wakeTime: wakeFormatted,
      duration: durationFormatted,
      recommended,
      pastDeadline,
    }
  })
})
</script>

<style scoped>
.wake-calc {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  padding: 1.5rem;
  margin: 1.5rem 0;
}

.calc-header {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  margin-bottom: 1.25rem;
}

.calc-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  line-height: 1;
}

.calc-title {
  margin: 0;
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
}

.calc-subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}

.calc-fields {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.calc-field {
  flex: 1;
  min-width: 180px;
}

.calc-field label {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 0.4rem;
}

.calc-input {
  width: 100%;
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.calc-input:focus {
  border-color: var(--vp-c-brand-1);
}

.calc-results {
  margin-top: 0.5rem;
}

.results-header {
  margin-bottom: 0.75rem;
}

.results-header h4 {
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
}

.results-note {
  margin: 0;
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
}

.cycle-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.6rem;
}

.cycle-card {
  position: relative;
  text-align: center;
  padding: 0.85rem 0.6rem;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  transition: border-color 0.2s, background 0.2s;
}

.cycle-card.cycle-best {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.cycle-card.cycle-overtime {
  opacity: 0.5;
}

.cycle-time {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 0.15rem;
}

.cycle-label {
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.1rem;
}

.cycle-duration {
  font-size: 0.72rem;
  color: var(--vp-c-text-2);
}

.cycle-badge {
  display: inline-block;
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  background: var(--vp-c-brand-1);
  color: #fff;
  margin-bottom: 0.4rem;
}

.cycle-badge.deadline-badge {
  background: var(--vp-c-warning-soft, #f5a623);
  color: var(--vp-c-text-1);
}
</style>
