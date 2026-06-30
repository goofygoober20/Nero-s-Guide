<template>
  <div class="wake-calc">
    <!-- Glass header card -->
    <div class="calc-header glass">
      <span class="calc-icon">🌙</span>
      <div>
        <h3 class="calc-title">Sleep Cycle Wake-Up Calculator</h3>
        <p class="calc-subtitle">Enter when you plan to sleep to find the best alarm times based on 90-minute sleep cycles.</p>
      </div>
    </div>

    <!-- Glass input field - single -->
    <div class="calc-fields">
      <div class="calc-field glass-field">
       <label for="sleepTime">
          <span class="label-icon">🛏️</span> Going to bed at
        </label>
        <input
          id="sleepTime"
          type="time"
          v-model="sleepTime"
          class="calc-input"
          placeholder="Select time"
        />
      </div>
    </div>

    <!-- Suggestion info box -->
    <div v-if="suggestion" class="suggestion-box glass">
<div class="suggestion-header">
        <span class="suggestion-icon">💡</span>
       <span class="suggestion-title">Sleep Tip</span>
      </div>
      <p class="suggestion-text">{{ suggestion }}</p>
      <div class="suggestion-ideal" v-if="idealBedtime">
        <span class="ideal-label">Ideal bedtime range:</span>
        <span class="ideal-time">{{ idealBedtime }}</span>
      </div>
   </div>

   <!-- Glass results section -->
    <div v-if="results.length" class="calc-results glass">
      <div class="results-header">
        <h4>Optimal Wake-Up Times</h4>
        <p class="results-note">Assumes ~15 min <span class="highlight">to fall asleep</span>. Waking at <span class="highlight">cycle end</span> reduces grogginess.</p>
      </div>
      <div class="cycle-grid">
        <div
          v-for="r in results"
          :key="r.cycles"
          class="cycle-card"
          :class="{ 'cycle-best': r.recommended, 'bounce-in': true }"
          :style="{ '--delay': `${r.cycles * 0.1}s` }"
        >
          <div v-if="r.recommended" class="cycle-badge">⭐ Best</div>
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

  const fallAsleep = sleep + 15

  return cycles.map((c) => {
    const wakeMinutes = fallAsleep + c * 90
    const wakeFormatted = formatTime(wakeMinutes)
    const durationFormatted = formatDuration(c * 90 + 15)
    const recommended = c >= 3 && c <= 5
    return {
      cycles: c,
      wakeTime: wakeFormatted,
      duration: durationFormatted,
      recommended,
      totalMinutes: c * 90 + 15,
    }
  })
})

const suggestion = computed(() => {
  const sleep = parseMinutes(sleepTime.value)
  if (sleep === null) return ''

  const hour = Math.floor(sleep / 60)
  const isLateNight = hour >= 0 && hour < 5
  const isEarly = hour >= 20 && hour < 22
  const isMidnight = hour >= 22 && hour < 24

  if (isLateNight) {
    return 'Going to bed very late — even 4–5 cycles (6–7.5 hours) can help. Try to aim for at least 3 cycles for restorative sleep.'
  }
  if (isEarly) {
    return 'Great early bedtime! You can easily get 5–6 full cycles (7.5–9 hours) — the sweet spot for deep rest.'
  }
  if (isMidnight) {
    return 'A solid bedtime. Aim for 4–5 cycles (6–7.5 hours) for optimal alertness tomorrow. Avoid going past midnight if possible.'
  }
  return 'Plan for at least 3–5 cycles (4.5–7.5 hours) for best results. The "Goldilocks zone" is 8–9 hours of total sleep.'
})

const idealBedtime = computed(() => {
  const sleep = parseMinutes(sleepTime.value)
  if (sleep === null) return ''

  const hour = Math.floor(sleep / 60)
  const min = sleep % 60

  // Calculate ideal bedtime range for 7.5-9 hours of sleep (5-6 cycles)
  const wakeHours = [6, 7, 8] // typical wake hours
  const idealBeds = wakeHours.map(h => {
    const bedMin = (h * 60 + 0) - (90 * 5 + 15) // 5 cycles + 15 min fall asleep
    return ((bedMin % 1440 + 1440) % 1440)
  })

  const idealStart = idealBeds[0]
  const idealEnd = idealBeds[idealBeds.length - 1]

  return `${formatTime(idealStart)} – ${formatTime(idealEnd)}`
})
</script>

<style scoped>
/* ── Glass base ── */
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

/* ── Container ── */
.wake-calc {
  padding: 2rem;
  margin: 2rem 0;
  border-radius: 20px;
  background: linear-gradient(145deg, rgba(30, 30, 40, 0.6), rgba(20, 20, 30, 0.4));
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  overflow: hidden;
}

.wake-calc::before {
  content: '';
  position: absolute;
  top: -60%;
  left: -20%;
  width: 140%;
  height: 140%;
  background: radial-gradient(circle at 30% 30%, rgba(155, 89, 182, 0.08), transparent 70%);
  pointer-events: none;
}

/* ── Header ── */
.calc-header {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  animation: bounceIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.calc-icon {
  font-size: 2rem;
  flex-shrink: 0;
  line-height: 1;
  filter: drop-shadow(0 2px 8px rgba(155, 89, 182, 0.3));
}

.calc-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #e0d0ff, #b894f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.calc-subtitle {
  margin: 0.35rem 0 0;
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

/* ── Field ── */
.calc-fields {
  margin-bottom: 1.5rem;
}

.calc-field {
  position: relative;
  max-width: 320px;
}

.glass-field {
  padding: 1rem 1.25rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.glass-field:focus-within {
  border-color: rgba(155, 89, 182, 0.5);
  box-shadow: 0 0 0 3px rgba(155, 89, 182, 0.15);
  transform: scale(1.02);
}

.calc-field label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.label-icon {
  font-size: 1rem;
  line-height: 1;
}

.calc-input {
  width: 100%;
  padding: 0.65rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.calc-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.calc-input:focus {
  border-color: rgba(155, 89, 182, 0.5);
  box-shadow: 0 0 0 3px rgba(155, 89, 182, 0.1);
  background: rgba(255, 255, 255, 0.08);
}

/* ── Suggestion Box ── */
.suggestion-box {
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  margin-bottom: 1.5rem;
  animation: bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-left: 3px solid rgba(155, 89, 182, 0.5);
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.suggestion-icon {
  font-size: 1rem;
  line-height: 1;
}

.suggestion-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.suggestion-text {
  margin: 0;
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

.suggestion-ideal {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.ideal-label {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

.ideal-time {
  font-size: 0.9rem;
  font-weight: 700;
  color: #b894f0;
  background: rgba(155, 89, 182, 0.15);
  padding: 0.15rem 0.6rem;
  border-radius: 6px;
}

/* ── Results ── */
.calc-results {
  padding: 1.5rem;
  border-radius: 16px;
  animation: bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.results-header {
  margin-bottom: 1rem;
}

.results-header h4 {
  margin: 0 0 0.35rem;
  font-size: 1rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: -0.01em;
}

.results-note {
  margin: 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.5;
}

.highlight {
  color: #b894f0;
  font-weight: 600;
}

/* ── Cycle Grid ── */
.cycle-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.8rem;
}

.cycle-card {
  position: relative;
  text-align: center;
  padding: 1.1rem 0.75rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: default;
  animation: bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) var(--delay, 0s) both;
}

.cycle-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(255,255,255,0.06), transparent);
  pointer-events: none;
}

.cycle-card:hover {
  transform: translateY(-4px) scale(1.03);
  border-color: rgba(155, 89, 182, 0.35);
  box-shadow: 0 8px 32px rgba(155, 89, 182, 0.15), 0 0 0 1px rgba(155, 89, 182, 0.1);
  background: rgba(255, 255, 255, 0.1);
}

.cycle-card.cycle-best {
  border-color: rgba(155, 89, 182, 0.5);
  background: rgba(155, 89, 182, 0.12);
  box-shadow: 0 0 20px rgba(155, 89, 182, 0.15);
}

.cycle-card.cycle-best .cycle-time {
  background: linear-gradient(135deg, #e0d0ff, #b894f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cycle-time {
  font-size: 1.15rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.2rem;
  letter-spacing: -0.01em;
}

.cycle-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.15rem;
  font-weight: 500;
}

.cycle-duration {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 500;
}

.cycle-badge {
  display: inline-block;
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.2rem 0.6rem;
  border-radius: 8px;
  background: rgba(155, 89, 182, 0.35);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  color: #fff;
  margin-bottom: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* ── Animations ── */
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(10px);
  }
  50% {
    transform: scale(1.03) translateY(-2px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>