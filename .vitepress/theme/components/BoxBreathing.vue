<template>
  <div class="box-breathing">
    <div class="breathing-circle" :class="phase">
      <div class="circle-visual">
        <svg viewBox="0 0 100 100" width="180" height="180">
          <circle cx="50" cy="50" r="45" class="circle-bg" />
          <circle cx="50" cy="50" r="45" class="circle-progress"
            :style="{ strokeDashoffset: dashOffset }" />
        </svg>
        <span class="phase-label">{{ label }}</span>
        <span class="count-label">{{ count }}</span>
      </div>
    </div>
    <div class="controls">
      <button class="start-btn" @click="toggle">
        {{ running ? 'Stop' : 'Start' }}
      </button>
      <button class="reset-btn" @click="reset">Reset</button>
    </div>
    <p class="hint">Inhale 4s — Hold 4s — Exhale 4s — Hold 4s</p>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const phases = ['inhale', 'hold-in', 'exhale', 'hold-out']
const labels = { 'inhale': 'Breathe In', 'hold-in': 'Hold', 'exhale': 'Breathe Out', 'hold-out': 'Hold' }
const DURATION = 4
const TOTAL = 16

const running = ref(false)
const phaseIdx = ref(0)
const count = ref(0)
let timer = null

const phase = computed(() => phases[phaseIdx.value])
const label = computed(() => labels[phase.value])
const dashOffset = computed(() => {
  const totalDash = 282.74
  const progress = ((phaseIdx.value * DURATION) + count.value) / TOTAL
  return totalDash * (1 - progress)
})

function tick() {
  count.value++
  if (count.value >= DURATION) {
    count.value = 0
    phaseIdx.value = (phaseIdx.value + 1) % 4
  }
}

function toggle() {
  if (running.value) {
    clearInterval(timer)
    running.value = false
  } else {
    running.value = true
    timer = setInterval(tick, 1000)
  }
}

function reset() {
  clearInterval(timer)
  running.value = false
  phaseIdx.value = 0
  count.value = 0
}

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.box-breathing {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  margin: 1.5rem 0;
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.breathing-circle {
  transition: transform 0.3s ease;
}

.circle-visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-bg {
  fill: none;
  stroke: var(--vp-c-divider);
  stroke-width: 4;
}

.circle-progress {
  fill: none;
  stroke: var(--vp-c-brand-1);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 282.74;
  transition: stroke-dashoffset 1s linear;
  transform: rotate(-90deg);
  transform-origin: center;
}

.phase-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  font-size: 1rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  text-align: center;
  transition: opacity 0.3s;
}

.count-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 20%);
  font-size: 2rem;
  font-weight: 800;
  color: var(--vp-c-text-1);
  font-variant-numeric: tabular-nums;
}

.controls {
  display: flex;
  gap: 0.75rem;
}

.start-btn, .reset-btn {
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.start-btn {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
}

.start-btn:hover {
  opacity: 0.85;
}

.reset-btn {
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
}

.reset-btn:hover {
  background: var(--vp-c-bg-soft-up);
}

.hint {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  margin: 0;
}

.inhale .circle-progress {
  stroke: var(--vp-c-brand-1);
}

.hold-in .circle-progress,
.hold-out .circle-progress {
  stroke: var(--vp-c-brand-2);
}

.exhale .circle-progress {
  stroke: var(--vp-c-brand-3);
}
</style>
