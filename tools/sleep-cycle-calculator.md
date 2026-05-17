# 😴 Sleep Cycle Calculator

<div class="sleep-calculator">
  <div class="calculator-card">
    <p class="intro">Based on 90-minute sleep cycles. Wake up at the end of a cycle to feel refreshed!</p>

 <div class="tab-buttons">
      <button id="wakeUpTab" class="tab-btn active">Wake up at</button>
      <button id="bedtimeTab" class="tab-btn">Go to bed at</button>
    </div>

<div id="wakeUpMode" class="mode active">
      <div class="input-group">
        <label>I want to wake up at:</label>
        <input type="time" id="wakeTime" value="07:00">
      </div>
      <button id="calculateBedtimeBtn" class="calculate-btn">Calculate Bedtimes</button>
    </div>

 <div id="bedtimeMode" class="mode">
      <div class="input-group">
        <label>I want to go to bed at:</label>
        <input type="time" id="bedTime" value="23:00">
      </div>
      <button id="calculateWakeTimeBtn" class="calculate-btn">Calculate Wake Times</button>
    </div>

<div id="results" class="results" style="display: none;">
      <h3>Recommended Times</h3>
      <div id="timeList" class="time-list"></div>
      <p class="note">💡 Allow 15 minutes to fall asleep</p>
    </div>
  </div>
</div>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const wakeUpTab = document.getElementById('wakeUpTab')
  const bedtimeTab = document.getElementById('bedtimeTab')
  const wakeUpMode = document.getElementById('wakeUpMode')
  const bedtimeMode = document.getElementById('bedtimeMode')
  const calculateBedtimeBtn = document.getElementById('calculateBedtimeBtn')
  const calculateWakeTimeBtn = document.getElementById('calculateWakeTimeBtn')
  const resultsDiv = document.getElementById('results')
  const timeList = document.getElementById('timeList')

  function switchMode(mode) {
    if (mode === 'wakeUp') {
      wakeUpTab.classList.add('active')
      bedtimeTab.classList.remove('active')
      wakeUpMode.classList.add('active')
      bedtimeMode.classList.remove('active')
    } else {
      wakeUpTab.classList.remove('active')
      bedtimeTab.classList.add('active')
      wakeUpMode.classList.remove('active')
      bedtimeMode.classList.add('active')
    }
    resultsDiv.style.display = 'none'
  }

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  function calculateBedtimes() {
    const wakeTime = document.getElementById('wakeTime').value
    if (!wakeTime) return

    const [hours, minutes] = wakeTime.split(':')
    const wakeDate = new Date()
    wakeDate.setHours(parseInt(hours), parseInt(minutes), 0)

    const cycles = [5, 4, 3, 2, 1] // 5 cycles = 7.5 hours sleep
    const times = []

    cycles.forEach(cycles => {
      const bedDate = new Date(wakeDate)
      bedDate.setMinutes(bedDate.getMinutes() - (cycles * 90 + 15)) // 15 min to fall asleep
      times.push({
        time: formatTime(bedDate),
        sleepHours: (cycles * 90) / 60,
        cycles: cycles
      })
    })

    displayResults(times, 'bed')
  }

  function calculateWakeTimes() {
    const bedTime = document.getElementById('bedTime').value
    if (!bedTime) return

    const [hours, minutes] = bedTime.split(':')
    const bedDate = new Date()
    bedDate.setHours(parseInt(hours), parseInt(minutes), 0)
    bedDate.setMinutes(bedDate.getMinutes() + 15) // Add 15 min to fall asleep

    const cycles = [5, 4, 3, 2, 1]
    const times = []

    cycles.forEach(cycles => {
      const wakeDate = new Date(bedDate)
      wakeDate.setMinutes(wakeDate.getMinutes() + cycles * 90)
      times.push({
        time: formatTime(wakeDate),
        sleepHours: (cycles * 90) / 60,
        cycles: cycles
      })
    })

    displayResults(times, 'wake')
  }

  function displayResults(times, type) {
    timeList.innerHTML = ''
    
    times.forEach(t => {
      const card = document.createElement('div')
      card.className = 'time-card'
      const recommendation = t.cycles === 5 || t.cycles === 4 ? '⭐ Recommended' : t.cycles === 3 ? '👍 Acceptable' : '⚠️ Short sleep'
      card.innerHTML = `
        <div class="time">${t.time}</div>
        <div class="details">${t.sleepHours} hours sleep (${t.cycles} cycles)</div>
        <div class="rec">${recommendation}</div>
      `
      timeList.appendChild(card)
    })
    
    resultsDiv.style.display = 'block'
  }

  wakeUpTab.addEventListener('click', () => switchMode('wakeUp'))
  bedtimeTab.addEventListener('click', () => switchMode('bedtime'))
  calculateBedtimeBtn.addEventListener('click', calculateBedtimes)
  calculateWakeTimeBtn.addEventListener('click', calculateWakeTimes)
})
</script>

<style scoped>
.sleep-calculator {
  max-width: 500px;
  margin: 0 auto;
}

.calculator-card {
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--vp-c-divider);
}

.intro {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-2);
}

.tab-buttons {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tab-btn {
  flex: 1;
  padding: 0.75rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

.mode {
  display: none;
}

.mode.active {
  display: block;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.input-group input {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 1.1rem;
  box-sizing: border-box;
}

.calculate-btn {
  width: 100%;
  padding: 0.75rem;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.calculate-btn:hover {
  transform: translateY(-2px);
}

.results {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

.results h3 {
  margin-bottom: 1rem;
}

.time-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.time-card {
  padding: 0.75rem;
  background: var(--vp-c-bg);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.time-card .time {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--vp-c-brand-1);
}

.time-card .details {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  margin: 0.25rem 0;
}

.time-card .rec {
  font-size: 0.75rem;
}

.note {
  margin-top: 1rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  text-align: center;
}
</style>