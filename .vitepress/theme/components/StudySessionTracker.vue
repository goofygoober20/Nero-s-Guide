<template>
  <div class="sst-container">
    <!-- Glass card -->
    <div class="sst-card glass">
      <!-- Header -->
      <div class="sst-header">
        <span class="sst-icon">📚</span>
        <h3 class="sst-title">Study Timer</h3>
        <span class="sst-badge">{{ phaseLabel }}</span>
      </div>

      <!-- Timer with progress ring -->
      <div class="sst-timer-wrapper">
        <svg class="sst-ring" viewBox="0 0 120 120">
          <circle
            class="sst-ring-bg"
            cx="60" cy="60" r="54"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            stroke-width="8"
          />
          <circle
            class="sst-ring-fill"
            cx="60" cy="60" r="54"
            fill="none"
            stroke="currentColor"
            stroke-width="8"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeOffset"
            :style="{ color: ringColor }"
          />
        </svg>
        <div class="sst-time">{{ formattedTime }}</div>
      </div>

      <!-- Phase & Controls -->
      <div class="sst-controls">
        <button
          v-if="!running && timeLeft > 0 && timeLeft !== sessionDuration"
          class="sst-btn glass-btn primary"
          @click="startTimer"
        >
          ▶ Resume
        </button>
        <button
          v-else-if="!running && timeLeft === sessionDuration"
          class="sst-btn glass-btn primary"
          @click="startTimer"
        >
          ▶ Start
        </button>
        <button v-if="running" class="sst-btn glass-btn warning" @click="pauseTimer">
          ⏸ Pause
        </button>
        <button class="sst-btn glass-btn secondary" @click="resetTimer">
          ⟳ Reset
        </button>
      </div>

      <!-- Session dots -->
      <div class="sst-sessions">
        <span
          v-for="i in sessions"
          :key="i"
          class="sst-session-dot"
          :class="{ done: i <= completedSessions }"
        />
      </div>

      <!-- Task log section -->
      <div class="sst-section">
        <h4 class="sst-section-title">📝 Task Log</h4>
        <div class="sst-task-row glass-field">
          <input
            type="text"
            v-model="currentTask"
            class="sst-task-input glass-input"
            placeholder="What are you working on?"
            @keyup.enter="logTask"
          />
          <button class="sst-btn glass-btn primary small" @click="logTask" :disabled="!currentTask.trim()">
            Log
          </button>
        </div>

        <!-- History -->
        <div class="sst-history" v-if="sessionsLogged.length > 0">
          <div v-for="(s, i) in sessionsLogged" :key="i" class="sst-history-item">
            <span class="sst-history-time">{{ s.time }}</span>
            <span class="sst-history-task">{{ s.task }}</span>
          </div>
        </div>
        <p v-else class="sst-empty">No sessions logged yet. Complete a session to log it here.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudyTimer',
  data() {
    return {
      SESSION: 25 * 60,      // 25 min focus
      BREAK: 5 * 60,         // 5 min break
      timeLeft: 25 * 60,
      running: false,
      phase: 'focus',        // 'focus', 'break', 'done'
      sessions: 4,           // total sessions per set
      completedSessions: 0,
      currentTask: '',
      sessionsLogged: [],
      sessionDuration: 25 * 60,
      interval: null,
    }
  },
  computed: {
    persistableState() {
      return {
        timeLeft: this.timeLeft,
        phase: this.phase,
        completedSessions: this.completedSessions,
        sessionsLogged: this.sessionsLogged,
      }
    },
    phaseLabel() {
      if (this.phase === 'focus') return '🎯 Focus'
      if (this.phase === 'break') return '☕ Break'
      return '✅ Done'
    },
    ringColor() {
      if (this.phase === 'focus') return '#3498db'
      if (this.phase === 'break') return '#f39c12'
      return '#2ecc71'
    },
    formattedTime() {
      const m = Math.floor(this.timeLeft / 60)
      const s = this.timeLeft % 60
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    },
    circumference() {
      return 2 * Math.PI * 54
    },
    strokeOffset() {
      const total = this.phase === 'focus' ? this.SESSION : (this.phase === 'break' ? this.BREAK : this.SESSION)
      const progress = total > 0 ? this.timeLeft / total : 0
      return this.circumference * (1 - progress)
    }
  },
  watch: {
    persistableState: {
      handler(val) {
        localStorage.setItem('study-session-state', JSON.stringify(val))
      },
      deep: true,
    },
  },
  mounted() {
    const saved = localStorage.getItem('study-session-state')
    if (saved) {
      try {
        const s = JSON.parse(saved)
        this.timeLeft = s.timeLeft ?? this.SESSION
        this.phase = s.phase ?? 'focus'
        this.completedSessions = s.completedSessions ?? 0
        this.sessionsLogged = s.sessionsLogged ?? []
        if (this.phase === 'focus') this.sessionDuration = this.SESSION
        else if (this.phase === 'break') this.sessionDuration = this.BREAK
        else this.sessionDuration = 0
      } catch {
        this.timeLeft = this.SESSION
        this.sessionDuration = this.SESSION
      }
    } else {
      this.timeLeft = this.SESSION
      this.sessionDuration = this.SESSION
    }
  },
  beforeUnmount() {
    if (this.interval) clearInterval(this.interval)
  },
  methods: {
    startTimer() {
      if (this.running) return
      if (this.phase === 'done') {
        // Reset if done
        this.resetTimer()
        return
      }
      this.running = true
      this.interval = setInterval(() => {
        this.timeLeft--
        if (this.timeLeft <= 0) {
          this.handleTimerComplete()
        }
      }, 1000)
    },
    pauseTimer() {
      this.running = false
      clearInterval(this.interval)
      this.interval = null
    },
    resetTimer() {
      this.pauseTimer()
      this.phase = 'focus'
      this.timeLeft = this.SESSION
      this.sessionDuration = this.SESSION
      this.completedSessions = 0
      // Optionally keep sessionsLogged
    },
    handleTimerComplete() {
      // Timer finished
      clearInterval(this.interval)
      this.interval = null
      this.running = false

      if (this.phase === 'focus') {
        // Focus session completed
        this.completedSessions++
        // Log task
        const task = this.currentTask.trim() || 'Focus session'
        this.sessionsLogged.unshift({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          task
        })
        this.currentTask = ''

        // Check if all sessions done
        if (this.completedSessions >= this.sessions) {
          this.phase = 'done'
          this.timeLeft = 0
          this.sessionDuration = 0
          return
        }

        // Switch to break
        this.phase = 'break'
        this.timeLeft = this.BREAK
        this.sessionDuration = this.BREAK
        // Auto-start break? Maybe let user start. For better UX, auto-start break.
        // We'll auto-start break after a short delay, but we can also let user control.
        // Let's auto-start break after 1 second so user sees notification.
        setTimeout(() => {
          if (!this.running && this.phase === 'break') {
            this.startTimer()
          }
        }, 1000)
      } else {
        // Break completed -> back to focus
        this.phase = 'focus'
        this.timeLeft = this.SESSION
        this.sessionDuration = this.SESSION
        // Auto-start next focus
        setTimeout(() => {
          if (!this.running && this.phase === 'focus') {
            this.startTimer()
          }
        }, 1000)
      }
    },
    logTask() {
      const task = this.currentTask.trim()
      if (!task) return
      this.sessionsLogged.unshift({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        task
      })
      this.currentTask = ''
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
.sst-container {
  max-width: 480px;
  margin: 2rem auto;
}

.sst-card {
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

.sst-card::before {
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
.sst-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.sst-icon {
  font-size: 2rem;
  line-height: 1;
  filter: drop-shadow(0 2px 8px rgba(52, 152, 219, 0.3));
}

.sst-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3498db, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex: 1;
}

.sst-badge {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.2rem 0.7rem;
  border-radius: 20px;
  background: rgba(52, 152, 219, 0.2);
  border: 1px solid rgba(52, 152, 219, 0.2);
  color: rgba(255, 255, 255, 0.8);
  transition: background 0.3s, border-color 0.3s;
}

/* ── Timer Ring ── */
.sst-timer-wrapper {
  position: relative;
  width: 160px;
  height: 160px;
  margin: 0 auto 1.2rem;
}

.sst-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.sst-ring-bg {
  stroke: rgba(255, 255, 255, 0.06);
}

.sst-ring-fill {
  transition: stroke-dashoffset 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.sst-time {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2.8rem;
  font-weight: 800;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 0.03em;
}

/* ── Controls ── */
.sst-controls {
  display: flex;
  gap: 0.6rem;
  justify-content: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.sst-btn {
  padding: 0.55rem 1.2rem;
  border-radius: 12px;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  min-width: 80px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
}

.sst-btn:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.sst-btn:active:not(:disabled) {
  transform: scale(0.96);
}

.sst-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none !important;
}

.sst-btn.primary {
  background: rgba(52, 152, 219, 0.25);
  border-color: rgba(52, 152, 219, 0.3);
  color: #3498db;
}

.sst-btn.primary:hover:not(:disabled) {
  background: rgba(52, 152, 219, 0.35);
  box-shadow: 0 0 20px rgba(52, 152, 219, 0.15);
}

.sst-btn.warning {
  background: rgba(243, 156, 18, 0.25);
  border-color: rgba(243, 156, 18, 0.3);
  color: #f39c12;
}

.sst-btn.warning:hover:not(:disabled) {
  background: rgba(243, 156, 18, 0.35);
  box-shadow: 0 0 20px rgba(243, 156, 18, 0.15);
}

.sst-btn.secondary {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
}

.sst-btn.secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.12);
}

.sst-btn.small {
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  min-width: auto;
}

/* ── Session dots ── */
.sst-sessions {
  display: flex;
  gap: 0.4rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.sst-session-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.4s ease;
}

.sst-session-dot.done {
  background: #3498db;
  border-color: #3498db;
  box-shadow: 0 0 12px rgba(52, 152, 219, 0.3);
}

/* ── Task section ── */
.sst-section {
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.sst-section-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 0.75rem;
}

.sst-task-row {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.sst-task-row:focus-within {
  border-color: rgba(52, 152, 219, 0.3);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.08);
  transform: scale(1.02);
}

.sst-task-input {
  flex: 1;
  padding: 0.55rem 0.8rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.3s ease;
}

.sst-task-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.sst-task-input:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(52, 152, 219, 0.3);
}

/* ── History ── */
.sst-history {
  margin-top: 0.75rem;
  max-height: 200px;
  overflow-y: auto;
}

.sst-history-item {
  display: flex;
  gap: 0.5rem;
  padding: 0.4rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  font-size: 0.85rem;
  animation: fadeSlideIn 0.3s ease;
}

.sst-history-item:last-child {
  border-bottom: none;
}

.sst-history-time {
  color: rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
  font-family: monospace;
  font-size: 0.75rem;
}

.sst-history-task {
  color: rgba(255, 255, 255, 0.7);
}

.sst-empty {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.25);
  margin: 0.5rem 0 0;
  text-align: center;
  padding: 0.5rem;
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
    transform: translateX(-6px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>