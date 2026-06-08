<template>
  <div class="sst-container">
    <div class="sst-card">
      <div class="sst-timer">
        <div class="sst-time">{{ formatTime(timeLeft) }}</div>
        <div class="sst-phase" :class="phase">{{ phaseLabel }}</div>

        <div class="sst-controls">
          <button v-if="!running && timeLeft > 0" class="sst-btn sst-btn-primary" @click="startTimer">Resume</button>
          <button v-if="!running && timeLeft === sessionDuration" class="sst-btn sst-btn-primary" @click="startTimer">Start</button>
          <button v-if="running" class="sst-btn sst-btn-warning" @click="pauseTimer">Pause</button>
          <button class="sst-btn sst-btn-secondary" @click="resetTimer">Reset</button>
        </div>

        <div class="sst-sessions">
          <span 
            v-for="i in sessions" 
            :key="i" 
            class="sst-session-dot" 
            :class="{ done: i <= completedSessions }" 
          />
        </div>
      </div>

      <div class="sst-section">
        <h4 class="sst-section-title">Task Log</h4>
        <div class="sst-task-row">
          <input 
            type="text" 
            v-model="currentTask" 
            class="sst-task-input" 
            placeholder="What are you working on?"
            @keyup.enter="logTask"
          />
          <button class="sst-btn sst-btn-primary" @click="logTask" :disabled="!currentTask.trim()">Log</button>
        </div>
        <div class="sst-history" v-if="sessionsLogged.length > 0">
          <div v-for="(s, i) in sessionsLogged" :key="i" class="sst-history-item">
            <span class="sst-history-time">{{ s.time }}</span>
            <span class="sst-history-task">{{ s.task }}</span>
          </div>
        </div>
        <p v-else class="sst-empty">No sessions logged yet. Complete a pomodoro to log it here.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const SESSION = 25 * 60
const BREAK = 5 * 60

const timeLeft = ref(SESSION)
const running = ref(false)
const phase = ref('focus')
const sessions = ref(4)
const completedSessions = ref(0)
const currentTask = ref('')
const sessionsLogged = ref([])
const sessionDuration = ref(SESSION)

let interval = null

const phaseLabel = computed(() => {
  return phase.value === 'focus' ? 'Focus' : 'Break'
})

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function startTimer() {
  if (running.value) return
  running.value = true
  interval = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      if (phase.value === 'focus') {
        completedSessions.value++
        const task = currentTask.value.trim() || 'Focus session'
        sessionsLogged.value.unshift({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          task
        })
        currentTask.value = ''
        if (completedSessions.value >= sessions.value) {
          clearInterval(interval)
          running.value = false
          phase.value = 'done'
          timeLeft.value = 0
          return
        }
        phase.value = 'break'
        timeLeft.value = BREAK
        sessionDuration.value = BREAK
      } else {
        phase.value = 'focus'
        timeLeft.value = SESSION
        sessionDuration.value = SESSION
      }
    }
  }, 1000)
}

function pauseTimer() {
  running.value = false
  clearInterval(interval)
}

function resetTimer() {
  pauseTimer()
  phase.value = 'focus'
  timeLeft.value = SESSION
  sessionDuration.value = SESSION
}

function logTask() {
  const task = currentTask.value.trim()
  if (!task) return
  sessionsLogged.value.unshift({
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    task
  })
  currentTask.value = ''
}

onUnmounted(() => clearInterval(interval))
</script>

<style scoped>
.sst-container {
  max-width: 480px;
  margin: 2rem auto;
}

.sst-card {
  padding: 1.5rem;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.sst-timer {
  text-align: center;
  margin-bottom: 1.5rem;
}

.sst-time {
  font-size: 3rem;
  font-weight: 800;
  font-family: monospace;
  color: var(--vp-c-text-1);
  letter-spacing: 0.05em;
  line-height: 1;
}

.sst-phase {
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0.5rem 0 1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.sst-phase.focus {
  color: var(--vp-c-brand-1);
}

.sst-phase.break {
  color: #f39c12;
}

.sst-phase.done {
  color: #2ecc71;
}

.sst-controls {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 0.75rem;
}

.sst-btn {
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  border: none;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}

.sst-btn:hover {
  transform: translateY(-1px);
}

.sst-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.sst-btn-primary {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.sst-btn-warning {
  background: #f39c12;
  color: #fff;
}

.sst-btn-secondary {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.sst-sessions {
  display: flex;
  gap: 0.35rem;
  justify-content: center;
}

.sst-session-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--vp-c-divider);
  border: 1px solid var(--vp-c-divider);
}

.sst-session-dot.done {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.sst-section {
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--vp-c-divider);
}

.sst-section-title {
  font-size: 0.9rem;
  margin: 0 0 0.75rem;
  color: var(--vp-c-text-1);
}

.sst-task-row {
  display: flex;
  gap: 0.5rem;
}

.sst-task-input {
  flex: 1;
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.85rem;
}

.sst-task-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.sst-history {
  margin-top: 0.75rem;
  max-height: 200px;
  overflow-y: auto;
}

.sst-history-item {
  display: flex;
  gap: 0.5rem;
  padding: 0.4rem 0;
  border-bottom: 1px solid var(--vp-c-divider-light);
  font-size: 0.8rem;
}

.sst-history-item:last-child {
  border-bottom: none;
}

.sst-history-time {
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  font-family: monospace;
}

.sst-history-task {
  color: var(--vp-c-text-1);
}

.sst-empty {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  margin: 0.5rem 0 0;
  text-align: center;
}
</style>
