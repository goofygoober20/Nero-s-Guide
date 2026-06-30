<template>
  <div class="ct-container">
    <!-- Glass card -->
    <div class="ct-card glass">
      <!-- Header -->
      <div class="ct-header">
        <span class="ct-icon">⏳</span>
        <h3 class="ct-title">Countdown Timer</h3>
        <span v-if="running || finished" class="ct-badge" :style="{ background: badgeColor }">
          {{ badgeText }}
        </span>
      </div>

      <!-- Setup Mode -->
      <div v-if="!running && !finished" class="ct-setup">
        <div class="ct-presets">
          <button
            v-for="p in presets"
            :key="p.label"
            class="ct-preset glass-btn"
            @click="setPreset(p.minutes)"
            :class="{ active: customMinutes === p.minutes }"
          >
            {{ p.label }}
          </button>
        </div>
        <div class="ct-custom glass-field">
          <span class="ct-custom-label">Custom minutes</span>
          <div class="ct-custom-input-wrap">
            <input
              v-model.number="customMinutes"
              type="number"
              min="1"
              max="999"
              class="ct-input glass-input"
              placeholder="Minutes"
              @focus="selectAll"
              @keyup.enter="startTimer(customMinutes)"
            />
            <button class="ct-btn glass-btn primary" @click="startTimer(customMinutes)" :disabled="!customMinutes || customMinutes <= 0">
              🚀 Start
            </button>
          </div>
        </div>
      </div>

      <!-- Active Timer -->
      <div v-else-if="!finished" class="ct-active">
        <div class="ct-ring-wrapper">
          <div class="ct-ring" :class="{ paused: paused }">
            <svg viewBox="0 0 120 120" class="ct-svg">
              <circle cx="60" cy="60" r="52" class="ct-ring-bg" />
              <circle
                cx="60"
                cy="60"
                r="52"
                class="ct-ring-fill"
                :style="{
                  strokeDashoffset: ringOffset,
                  stroke: ringColor
                }"
              />
            </svg>
            <span class="ct-time">{{ displayTime }}</span>
          </div>
          <div class="ct-progress-text" v-if="totalSeconds > 0">
            {{ Math.round(100 - (remaining / totalSeconds) * 100) }}% complete
          </div>
        </div>

        <div class="ct-controls">
          <button class="ct-btn glass-btn" @click="togglePause">
            {{ paused ? '▶ Resume' : '⏸ Pause' }}
          </button>
          <button class="ct-btn glass-btn secondary" @click="reset">⟳ Reset</button>
        </div>
      </div>

      <!-- Finished State -->
      <div v-else class="ct-finished">
        <div class="ct-done-icon">✅</div>
        <p class="ct-done-text">Time's up!</p>
        <div class="ct-done-actions">
          <button class="ct-btn glass-btn primary" @click="reset">🔄 Start Another</button>
        </div>
      </div>

      <!-- Quick reset (bottom) -->
      <button v-if="running || finished" class="ct-reset-btn glass-btn" @click="reset">
        ↩️ Reset All
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CountdownTimer',
  data() {
    return {
      presets: [
        { label: '1 min', minutes: 1 },
        { label: '5 min', minutes: 5 },
        { label: '10 min', minutes: 10 },
        { label: '15 min', minutes: 15 },
        { label: '25 min', minutes: 25 },
        { label: '60 min', minutes: 60 },
      ],
      customMinutes: 25,
      totalSeconds: 0,
      remaining: 0,
      running: false,
      paused: false,
      finished: false,
      timer: null,
    }
  },
  computed: {
    displayTime() {
      const m = Math.floor(this.remaining / 60)
      const s = this.remaining % 60
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    },
    ringOffset() {
      const circ = 2 * Math.PI * 52
      if (this.totalSeconds === 0) return circ
      return circ * (1 - this.remaining / this.totalSeconds)
    },
    ringColor() {
      const progress = this.totalSeconds > 0 ? this.remaining / this.totalSeconds : 0
      if (progress > 0.5) return '#2ecc71'
      if (progress > 0.25) return '#f39c12'
      return '#e74c3c'
    },
    badgeText() {
      if (this.finished) return '✅ Done'
      if (this.paused) return '⏸ Paused'
      return '⏳ Running'
    },
    badgeColor() {
      if (this.finished) return '#2ecc71'
      if (this.paused) return '#f39c12'
      return '#3498db'
    }
  },
  watch: {
    // Optional: reset when component unmounts? Handled in beforeUnmount
  },
  mounted() {
    // Keyboard shortcut: space to toggle pause
    document.addEventListener('keydown', this.handleKeydown)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydown)
    if (this.timer) clearInterval(this.timer)
  },
  methods: {
    handleKeydown(e) {
      if (e.code === 'Space' && this.running && !this.finished) {
        e.preventDefault()
        this.togglePause()
      }
    },
    setPreset(minutes) {
      this.customMinutes = minutes
      this.startTimer(minutes)
    },
    startTimer(minutes) {
      if (!minutes || minutes <= 0) return
      // Clear any existing timer
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      this.totalSeconds = minutes * 60
      this.remaining = minutes * 60
      this.running = true
      this.paused = false
      this.finished = false
      this.timer = setInterval(this.tick, 1000)
    },
    tick() {
      if (this.paused) return
      this.remaining--
      if (this.remaining <= 0) {
        this.remaining = 0
        clearInterval(this.timer)
        this.timer = null
        this.running = false
        this.finished = true
        // Play notification sound if supported
        try {
          const audio = new Audio('data:audio/wav;base64,U3RlYWx0aCBub3RpZmljYXRpb24gc291bmQ=')
          audio.play().catch(() => {})
        } catch(e) {}
        // Show browser notification if permitted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('⏰ Time\'s up!', { body: 'Your countdown has finished.' })
        }
      }
    },
    togglePause() {
      if (this.finished || !this.running) return
      this.paused = !this.paused
    },
    reset() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      this.running = false
      this.paused = false
      this.finished = false
      this.remaining = 0
      this.totalSeconds = 0
    },
    selectAll(e) {
      e.target.select()
    }
  }
}
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
.ct-container {
  max-width: 420px;
  margin: 2rem auto;
}

.ct-card {
  padding: 2rem 1.5rem;
  border-radius: 20px;
  background: linear-gradient(145deg, rgba(30, 30, 40, 0.6), rgba(20, 20, 30, 0.4));
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  overflow: hidden;
  animation: bounceIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ct-card::before {
  content: '';
  position: absolute;
  top: -60%;
  left: -20%;
  width: 140%;
  height: 140%;
  background: radial-gradient(circle at 30% 30%, rgba(52, 152, 219, 0.08), transparent 70%);
  pointer-events: none;
}

/* ── Header ── */
.ct-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.ct-icon {
  font-size: 2rem;
  line-height: 1;
  filter: drop-shadow(0 2px 8px rgba(52, 152, 219, 0.3));
}

.ct-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3498db, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex: 1;
}

.ct-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.2rem 0.7rem;
  border-radius: 20px;
  color: #fff;
  background: #3498db;
  transition: background 0.3s, box-shadow 0.3s;
  white-space: nowrap;
  box-shadow: 0 0 16px rgba(52, 152, 219, 0.2);
}

/* ── Setup Mode ── */
.ct-setup {
  animation: fadeSlideIn 0.3s ease;
}

.ct-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.ct-preset {
  padding: 0.4rem 0.9rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.ct-preset:hover {
  transform: translateY(-2px);
  border-color: rgba(52, 152, 219, 0.3);
  color: rgba(255, 255, 255, 0.8);
}

.ct-preset.active {
  background: rgba(52, 152, 219, 0.2);
  border-color: rgba(52, 152, 219, 0.4);
  color: #3498db;
  box-shadow: 0 0 16px rgba(52, 152, 219, 0.1);
}

.ct-custom {
  padding: 0.85rem 1rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ct-custom:focus-within {
  border-color: rgba(52, 152, 219, 0.3);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.08);
  transform: scale(1.02);
}

.ct-custom-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 0.5rem;
  letter-spacing: 0.02em;
}

.ct-custom-input-wrap {
  display: flex;
  gap: 0.5rem;
}

.ct-input {
  flex: 1;
  padding: 0.6rem 0.8rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  font-size: 1rem;
  text-align: center;
  outline: none;
  transition: all 0.3s ease;
  font-family: 'SF Mono', 'Fira Code', monospace;
}

.ct-input::placeholder {
  color: rgba(255, 255, 255, 0.2);
}

.ct-input:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(52, 152, 219, 0.3);
}

.ct-btn {
  padding: 0.6rem 1.5rem;
  border-radius: 12px;
  border: none;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
}

.ct-btn.primary {
  background: rgba(52, 152, 219, 0.25);
  border-color: rgba(52, 152, 219, 0.3);
  color: #3498db;
}

.ct-btn.primary:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 0 24px rgba(52, 152, 219, 0.15);
  background: rgba(52, 152, 219, 0.35);
}

.ct-btn.secondary {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
}

.ct-btn.secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
}

.ct-btn:active:not(:disabled) {
  transform: scale(0.96);
}

.ct-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none !important;
}

/* ── Active Timer ── */
.ct-active {
  animation: fadeSlideIn 0.3s ease;
}

.ct-ring-wrapper {
  text-align: center;
}

.ct-ring {
  position: relative;
  width: 170px;
  height: 170px;
  margin: 0.5rem auto;
}

.ct-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ct-ring-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.06);
  stroke-width: 6;
}

.ct-ring-fill {
  fill: none;
  stroke-width: 6;
  stroke-linecap: round;
  stroke-dasharray: 326.73;
  transition: stroke-dashoffset 1s linear, stroke 0.4s ease;
}

.ct-time {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.4rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.95);
  font-variant-numeric: tabular-nums;
  font-family: 'SF Mono', 'Fira Code', monospace;
  letter-spacing: 0.03em;
}

.ct-ring.paused .ct-ring-fill {
  stroke: #f39c12;
}

.ct-progress-text {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.3);
  margin-top: 0.2rem;
}

.ct-controls {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 1rem;
}

/* ── Finished State ── */
.ct-finished {
  padding: 0.5rem 0;
  animation: bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ct-done-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.ct-done-text {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2ecc71;
  margin: 0 0 1rem;
}

.ct-done-actions {
  display: flex;
  justify-content: center;
}

/* ── Reset Button ── */
.ct-reset-btn {
  width: 100%;
  margin-top: 1.25rem;
  padding: 0.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.25);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ct-reset-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.5);
  border-color: rgba(255, 255, 255, 0.1);
}

/* ── Animations ── */
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.85) translateY(12px);
  }
  50% {
    transform: scale(1.02) translateY(-2px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>