# ⏱️ Pomodoro Timer

<div class="pomodoro-timer">
  <div class="timer-card">
    <div class="timer-display">
      <span id="minutes">25</span>
      <span>:</span>
      <span id="seconds">00</span>
    </div>

 <div class="mode-indicator">
      <span id="modeText" class="mode-text">Focus Time</span>
    </div>

<div class="controls">
      <button id="startBtn" class="timer-btn start">▶ Start</button>
      <button id="pauseBtn" class="timer-btn pause" disabled>⏸ Pause</button>
      <button id="resetBtn" class="timer-btn reset">🔄 Reset</button>
    </div>

<div class="settings">
      <div class="setting">
        <label>Focus (min):</label>
        <input type="number" id="focusTime" value="25" min="1" max="60">
      </div>
      <div class="setting">
        <label>Break (min):</label>
        <input type="number" id="breakTime" value="5" min="1" max="30">
      </div>
    </div>

<div class="sessions">
      <p>Sessions Completed: <span id="sessionCount">0</span></p>
    </div>

<div class="quote">
      <p id="quote">"Focus on one thing at a time"</p>
    </div>
  </div>
</div>

<script setup>
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  let timerInterval = null
  let isRunning = false
  let currentMode = 'focus' // 'focus' or 'break'
  let timeLeft = 25 * 60 // seconds
  let sessionCount = 0

  const minutesDisplay = document.getElementById('minutes')
  const secondsDisplay = document.getElementById('seconds')
  const modeText = document.getElementById('modeText')
  const startBtn = document.getElementById('startBtn')
  const pauseBtn = document.getElementById('pauseBtn')
  const resetBtn = document.getElementById('resetBtn')
  const focusTimeInput = document.getElementById('focusTime')
  const breakTimeInput = document.getElementById('breakTime')
  const sessionCountDisplay = document.getElementById('sessionCount')
  const quoteDisplay = document.getElementById('quote')

  const quotes = [
    "Focus on one thing at a time",
    "Small progress is still progress",
    "You've got this!",
    "Stay present, stay focused",
    "One pomodoro at a time",
    "Great work takes time",
    "You're building momentum",
    "Keep going, you're doing great"
  ]

  function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    minutesDisplay.textContent = minutes.toString().padStart(2, '0')
    secondsDisplay.textContent = seconds.toString().padStart(2, '0')
  }

  function updateModeDisplay() {
    if (currentMode === 'focus') {
      modeText.textContent = '🎯 Focus Time'
      modeText.style.color = '#e74c3c'
    } else {
      modeText.textContent = '☕ Break Time'
      modeText.style.color = '#2ecc71'
    }
  }

  function switchMode() {
    if (currentMode === 'focus') {
      currentMode = 'break'
      timeLeft = parseInt(breakTimeInput.value) * 60
      sessionCount++
      sessionCountDisplay.textContent = sessionCount
      updateQuote()
    } else {
      currentMode = 'focus'
      timeLeft = parseInt(focusTimeInput.value) * 60
    }
    updateModeDisplay()
    updateDisplay()
    
    // Play a gentle notification sound (if supported)
    try {
      const audio = new Audio('data:audio/wav;base64,U3RlYWx0aCBub3RpZmljYXRpb24gc291bmQ=')
      audio.play().catch(() => {})
    } catch(e) {}
  }

  function updateQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    quoteDisplay.textContent = `"${quotes[randomIndex]}"`
  }

  function tick() {
    if (timeLeft <= 0) {
      // Timer finished
      if (currentMode === 'focus') {
        switchMode()
      } else {
        switchMode()
      }
    } else {
      timeLeft--
      updateDisplay()
    }
  }

  function startTimer() {
    if (isRunning) return
    isRunning = true
    timerInterval = setInterval(tick, 1000)
    startBtn.disabled = true
    pauseBtn.disabled = false
  }

  function pauseTimer() {
    if (!isRunning) return
    isRunning = false
    clearInterval(timerInterval)
    startBtn.disabled = false
    pauseBtn.disabled = true
  }

  function resetTimer() {
    pauseTimer()
    currentMode = 'focus'
    timeLeft = parseInt(focusTimeInput.value) * 60
    updateModeDisplay()
    updateDisplay()
    startBtn.disabled = false
    pauseBtn.disabled = true
  }

  function updateSettings() {
    if (!isRunning) {
      if (currentMode === 'focus') {
        timeLeft = parseInt(focusTimeInput.value) * 60
      } else {
        timeLeft = parseInt(breakTimeInput.value) * 60
      }
      updateDisplay()
    }
  }

  startBtn.addEventListener('click', startTimer)
  pauseBtn.addEventListener('click', pauseTimer)
  resetBtn.addEventListener('click', resetTimer)
  focusTimeInput.addEventListener('change', updateSettings)
  breakTimeInput.addEventListener('change', updateSettings)

  updateDisplay()
  updateModeDisplay()

  onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval)
  })
})
</script>

<style scoped>
.pomodoro-timer {
  max-width: 500px;
  margin: 0 auto;
}

.timer-card {
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--vp-c-divider);
  text-align: center;
}

.timer-display {
  font-size: 4rem;
  font-family: monospace;
  font-weight: bold;
  letter-spacing: 4px;
  margin-bottom: 0.5rem;
}

.mode-indicator {
  margin-bottom: 1.5rem;
}

.mode-text {
  font-size: 1.2rem;
  font-weight: 500;
}

.controls {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.timer-btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.timer-btn.start {
  background: #2ecc71;
  color: white;
}

.timer-btn.start:hover {
  background: #27ae60;
}

.timer-btn.pause {
  background: #f39c12;
  color: white;
}

.timer-btn.pause:hover {
  background: #e67e22;
}

.timer-btn.reset {
  background: #e74c3c;
  color: white;
}

.timer-btn.reset:hover {
  background: #c0392b;
}

.timer-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.settings {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.setting {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.setting label {
  font-size: 0.85rem;
}

.setting input {
  width: 60px;
  padding: 0.25rem;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  text-align: center;
}

.sessions {
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.quote {
  font-size: 0.85rem;
  font-style: italic;
  color: var(--vp-c-text-2);
  padding-top: 0.5rem;
  border-top: 1px solid var(--vp-c-divider);
}
</style>