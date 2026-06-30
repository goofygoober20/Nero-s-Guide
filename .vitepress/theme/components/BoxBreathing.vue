<template>
  <div class="box-breathing">
    <!-- Glass card -->
    <div class="breathing-card glass">
      <!-- Header -->
      <div class="bb-header">
        <span class="bb-icon">🧘</span>
        <h3 class="bb-title">Box Breathing</h3>
        <span class="bb-badge" :style="{ background: phaseColor }">{{ phaseEmoji }} {{ phaseLabel }}</span>
      </div>

      <!-- Breathing circle with ring -->
      <div class="breathing-circle" :class="phase">
        <div class="circle-visual">
          <svg viewBox="0 0 120 120" width="200" height="200">
            <!-- Background ring -->
            <circle cx="60" cy="60" r="54" class="circle-bg" />
            <!-- Progress ring -->
            <circle cx="60" cy="60" r="54" class="circle-progress"
              :style="{ strokeDashoffset: dashOffset, stroke: phaseColor }" />
          </svg>
          <div class="phase-label">{{ phaseLabel }}</div>
          <div class="count-label">{{ countDown }}</div>
          <div class="cycle-label">Cycle {{ completedCycles + 1 }}</div>
        </div>
      </div>

      <!-- Controls -->
      <div class="controls">
        <button class="bb-btn glass-btn primary" @click="toggle" :aria-label="running ? 'Stop' : 'Start'">
          {{ running ? '⏸ Stop' : '▶ Start' }}
        </button>
        <button class="bb-btn glass-btn secondary" @click="reset" aria-label="Reset">
          ⟳ Reset
        </button>
      </div>

      <!-- Hints and status -->
      <div class="bb-footer">
        <p class="hint">Inhale 4s — Hold 4s — Exhale 4s — Hold 4s</p>
        <p class="sr-only" aria-live="assertive" aria-atomic="true">{{ liveAnnouncement }}</p>
        <p v-if="completedCycles > 0" class="cycle-count">{{ completedCycles }} cycle{{ completedCycles > 1 ? 's' : '' }} completed</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BoxBreathing',
  data() {
    return {
      phases: ['inhale', 'hold-in', 'exhale', 'hold-out'],
      labels: {
        'inhale': 'Breathe In',
        'hold-in': 'Hold',
        'exhale': 'Breathe Out',
        'hold-out': 'Hold'
      },
      emojis: {
        'inhale': '⬆️',
        'hold-in': '⏸️',
        'exhale': '⬇️',
        'hold-out': '⏸️'
      },
      colors: {
        'inhale': '#3498db',
        'hold-in': '#f39c12',
        'exhale': '#2ecc71',
        'hold-out': '#f39c12'
      },
      DURATION: 4,
      TOTAL: 16,
      running: false,
      phaseIdx: 0,
      count: 0,        // seconds elapsed in current phase
      completedCycles: 0,
      timer: null,
    }
  },
  computed: {
    phase() {
      return this.phases[this.phaseIdx]
    },
    phaseLabel() {
      return this.labels[this.phase] || ''
    },
    phaseEmoji() {
      return this.emojis[this.phase] || ''
    },
    phaseColor() {
      return this.colors[this.phase] || '#3498db'
    },
    countDown() {
      return this.DURATION - this.count
    },
    dashOffset() {
      const totalDash = 2 * Math.PI * 54 // ~339.29
      const progress = ((this.phaseIdx * this.DURATION) + this.count) / this.TOTAL
      return totalDash * (1 - progress)
    },
    liveAnnouncement() {
      if (!this.running) return 'Box breathing stopped'
      return `${this.phaseLabel}, ${this.countDown} seconds remaining`
    }
  },
  watch: {
    // Automatically stop when cycles reach a target? Not needed.
  },
  mounted() {
    // Add keyboard shortcut (space bar)
    document.addEventListener('keydown', this.handleKeydown)
    // Initialize display
    this.count = 0
    this.phaseIdx = 0
    this.completedCycles = 0
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydown)
    if (this.timer) clearInterval(this.timer)
  },
  methods: {
    handleKeydown(e) {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault()
        this.toggle()
      }
    },
    tick() {
      this.count++
      if (this.count >= this.DURATION) {
        this.count = 0
        this.phaseIdx = (this.phaseIdx + 1) % 4
        if (this.phaseIdx === 0) {
          this.completedCycles++
          if (this.completedCycles === 10) {
            this.showZenToast()
          }
        }
      }
    },
    toggle() {
      if (this.running) {
        clearInterval(this.timer)
        this.running = false
        this.timer = null
      } else {
        // If we are at the end (phase done and count 0?), reset? No, start from where we are.
        // But if not started, ensure phaseIdx and count are reset.
        if (this.completedCycles === 0 && this.phaseIdx === 0 && this.count === 0) {
          // fresh start
        }
        this.running = true
        this.timer = setInterval(this.tick, 1000)
      }
    },
    reset() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      this.running = false
      this.phaseIdx = 0
      this.count = 0
      this.completedCycles = 0
    },
    showZenToast() {
      const toast = document.createElement('div')
      toast.textContent = '🧘 Zen mode reached! 10 cycles completed.'
      Object.assign(toast.style, {
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(26, 188, 156, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(26, 188, 156, 0.4)',
        color: '#fff',
        padding: '0.8rem 1.6rem',
        borderRadius: '16px',
        fontWeight: '700',
        fontSize: '0.95rem',
        zIndex: '99999',
        boxShadow: '0 4px 24px rgba(26, 188, 156, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        animation: 'bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
      })
      document.body.appendChild(toast)
      setTimeout(() => {
        toast.style.transition = 'opacity 0.4s, transform 0.4s'
        toast.style.opacity = '0'
        toast.style.transform = 'translateX(-50%) translateY(20px)'
        setTimeout(() => toast.remove(), 500)
      }, 3500)
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
.box-breathing {
  max-width: 480px;
  margin: 2rem auto;
}

.breathing-card {
  padding: 2rem 1.5rem;
  border-radius: 20px;
  background: linear-gradient(145deg, rgba(30, 30, 40, 0.6), rgba(20, 20, 30, 0.4));
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  overflow: hidden;
  animation: bounceIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
}

.breathing-card::before {
  content: '';
  position: absolute;
  top: -60%;
  right: -20%;
  width: 140%;
  height: 140%;
  background: radial-gradient(circle at 70% 30%, rgba(52, 152, 219, 0.06), transparent 70%);
  pointer-events: none;
}

/* ── Header ── */
.bb-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.bb-icon {
  font-size: 2rem;
  line-height: 1;
  filter: drop-shadow(0 2px 8px rgba(52, 152, 219, 0.3));
}

.bb-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3498db, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex: 1;
}

.bb-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.7rem;
  border-radius: 20px;
  color: #fff;
  background: #3498db;
  box-shadow: 0 0 16px rgba(52, 152, 219, 0.2);
  transition: background 0.4s ease;
  white-space: nowrap;
}

/* ── Breathing Circle ── */
.breathing-circle {
  transition: transform 0.3s ease;
}

.circle-visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
}

.circle-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.06);
  stroke-width: 4;
}

.circle-progress {
  fill: none;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 339.29; /* 2 * PI * 54 */
  transition: stroke-dashoffset 1s linear, stroke 0.4s ease;
  transform: rotate(-90deg);
  transform-origin: center;
}

.phase-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -70%);
  font-size: 1.2rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  transition: opacity 0.3s;
  text-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.count-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 15%);
  font-size: 2.4rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.95);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.05em;
}

.cycle-label {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.3);
  font-weight: 500;
  letter-spacing: 0.03em;
}

/* ── Controls ── */
.controls {
  display: flex;
  gap: 0.75rem;
  width: 100%;
  justify-content: center;
}

.bb-btn {
  padding: 0.6rem 1.6rem;
  border-radius: 12px;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  min-width: 100px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
}

.bb-btn:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.bb-btn:active:not(:disabled) {
  transform: scale(0.96);
}

.bb-btn.primary {
  background: rgba(52, 152, 219, 0.25);
  border-color: rgba(52, 152, 219, 0.3);
  color: #3498db;
}

.bb-btn.primary:hover:not(:disabled) {
  background: rgba(52, 152, 219, 0.35);
  box-shadow: 0 0 20px rgba(52, 152, 219, 0.15);
}

.bb-btn.secondary {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
}

.bb-btn.secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.12);
}

/* ── Footer ── */
.bb-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  width: 100%;
}

.hint {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.3);
  margin: 0;
  letter-spacing: 0.02em;
}

.cycle-count {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.25);
  margin: 0;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
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
</style>