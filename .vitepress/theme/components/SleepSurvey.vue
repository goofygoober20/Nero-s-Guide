<template>
  <div class="survey-container">
    <div class="sleep-survey-card">

      <!-- Progress Track -->
      <div class="progress-section">
        <div class="progress-info">
          <span class="step-label">
            {{ showResults ? 'Diagnosis Complete' : `Question ${currentStep} of ${totalSteps}` }}
          </span>
          <span class="percentage-label">{{ Math.round(progressPercent) }}%</span>
        </div>
        <div class="progress-track" role="progressbar" :aria-valuenow="Math.round(progressPercent)" aria-valuemin="0" aria-valuemax="100" :aria-label="`Progress: ${Math.round(progressPercent)}%`">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
      </div>

      <!-- Quiz Interface -->
      <div v-if="!showResults" class="quiz-interface">
        <div class="category-tag">{{ currentQuestion.category.toUpperCase() }} PROTOCOL</div>
        <h2 class="question-title">{{ currentQuestion.text }}</h2>

        <div class="options-grid" role="radiogroup" :aria-label="currentQuestion.text">
          <button
            v-for="option in currentQuestion.options"
            :key="option.value"
            @click="selectOption(option.value)"
            class="option-card"
            role="radio"
            :aria-checked="answers[currentQuestion.id] === option.value ? 'true' : 'false'"
            :class="{ 'is-selected': answers[currentQuestion.id] === option.value }"
          >
            <div class="selection-indicator">
              <div class="indicator-inner"></div>
            </div>
            <div class="option-content">
              <span class="option-label">{{ option.label }}</span>
              <span class="option-desc">{{ option.desc }}</span>
            </div>
          </button>
        </div>

        <div class="keyboard-hint">
          Press <kbd>1</kbd> or <kbd>2</kbd> to select &middot; <kbd>Enter</kbd> to continue
        </div>

        <div class="navigation-bar">
          <button
            v-if="currentStep > 1"
            @click="prevStep"
            class="nav-btn btn-back"
            aria-label="Go to previous question"
          >
            &larr; Back
          </button>
          <button
            v-if="answers[currentQuestion.id]"
            @click="nextStep"
            class="nav-btn btn-next"
            :aria-label="currentStep === totalSteps ? 'See diagnostics results' : 'Continue to next question'"
          >
            {{ currentStep === totalSteps ? 'See Diagnostics' : 'Continue' }} &rarr;
          </button>
        </div>
      </div>

      <!-- Results Dashboard -->
      <div v-else class="results-dashboard animate-fade-in">
        <!-- Header with Score Ring -->
        <div class="dashboard-header">
          <svg viewBox="0 0 120 120" class="score-ring">
            <circle cx="60" cy="60" r="52" class="ring-bg" />
            <circle
              cx="60" cy="60" r="52"
              class="ring-fill"
              stroke-dasharray="326.73"
              :stroke-dashoffset="ringOffset"
            />
            <text x="60" y="52" class="ring-number" text-anchor="middle">{{ sleepScore }}%</text>
            <text x="60" y="70" class="ring-label" text-anchor="middle">Sleep Efficiency</text>
          </svg>

          <h2>Your Sleep Protocol Analysis</h2>
          <p class="dashboard-subtitle">We've processed your circadian, biological, and environmental vectors. Here is your roadmap.</p>

          <!-- Previous Results Comparison -->
          <div v-if="previousResults" class="comparison-bar">
            <span class="comparison-text">
              &nbsp;Last assessment ({{ previousResults.date ? new Date(previousResults.date).toLocaleDateString() : 'Unknown' }}): {{ previousResults.score }}%
            </span>
            <span class="comparison-diff" :class="scoreDiff >= 0 ? 'diff-up' : 'diff-down'">
              {{ scoreDiff >= 0 ? '&#8593;' : '&#8595;' }} {{ Math.abs(scoreDiff) }}%
            </span>
          </div>
        </div>

        <!-- Category Progress -->
        <div class="results-section">
          <h3 class="section-title">Category Breakdown</h3>
          <div class="categories-flex">
            <div
              v-for="(cat, name) in categories"
              :key="name"
              class="category-chip"
              :class="cat.optimal === cat.total ? 'cat-optimal' : 'cat-needs-work'"
            >
              <span class="cat-icon">{{ cat.optimal === cat.total ? '&#9989;' : '&#9888;&#65039;' }}</span>
              <span class="cat-name">{{ name }}</span>
              <span class="cat-score">{{ cat.optimal }}/{{ cat.total }}</span>
            </div>
          </div>
        </div>

        <!-- Priority Adjustments -->
        <div v-if="suboptimalRecommendations.length > 0" class="results-section">
          <h3 class="section-title priority">&#9888;&#65039; Priority Adjustments</h3>
          <div class="recommendations-list">
            <div v-for="rec in suboptimalRecommendations" :key="rec.title" class="diagnostic-card critical">
              <div class="card-icon-wrapper">{{ rec.icon }}</div>
              <div class="card-body">
                <h4>{{ rec.title }}</h4>
                <p>{{ rec.description }}</p>
                <div class="protocol-badge">IMMEDIATE ACTION</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Strengths -->
        <div class="results-section">
          <h3 class="section-title optimized">&#10024; Maintained Protocols</h3>
          <p class="section-subtitle">You're successfully managing these sleep drivers. Keep going:</p>
          <div class="recommendations-list">
            <div v-for="rec in optimalRecommendations" :key="rec.title" class="diagnostic-card perfect">
              <div class="card-icon-wrapper">&#9989;</div>
              <div class="card-body">
                <h4>{{ rec.title }}</h4>
                <p>{{ rec.description }}</p>
                <div class="protocol-badge success">OPTIMIZED</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Plan Your Schedule (Suggestion 1) -->
        <div class="results-section cycle-section">
          <h3 class="section-title">&#9200; Plan Your Sleep Schedule</h3>
          <p class="section-subtitle">Enter your desired wake-up time and we'll calculate ideal bedtimes based on 90-minute sleep cycles.</p>
          <div class="cycle-input-row">
            <label class="cycle-label">Wake up at:</label>
            <input type="time" v-model="wakeTime" class="cycle-input" />
          </div>
          <div v-if="cycleResults.length" class="cycle-grid">
            <div v-for="cr in cycleResults" :key="cr.cycles" class="cycle-card" :class="cr.recClass">
              <div class="cycle-time">{{ cr.time }}</div>
              <div class="cycle-detail">{{ cr.sleepHours }}{{ cr.sleepHours % 1 === 0 ? '.0' : '' }} hours &middot; {{ cr.cycles }} cycles</div>
              <div class="cycle-label-tag">{{ cr.recLabel }}</div>
            </div>
          </div>
        </div>

        <!-- Export / Reset -->
        <div class="dashboard-footer">
          <div class="action-row">
            <button @click="exportResults" class="dashboard-btn btn-secondary">
              &#128196; Export Blueprint
            </button>
            <button @click="copyResults" class="dashboard-btn btn-primary">
              &#128203; Copy to Clipboard
            </button>
          </div>
          <button @click="resetSurvey" class="reset-link-btn">
            &#10227; Retake Assessment
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import confetti from 'canvas-confetti'

const questions = [
  {
    id: 1,
    category: 'Regularity',
    text: 'Do you wake up at the exact same time every single day, including weekends?',
    options: [
      {
        value: 'regular',
        label: 'Yes, my schedule remains highly consistent',
        desc: 'Optimally anchors your circadian rhythm (Process C).'
      },
      {
        value: 'irregular',
        label: 'No, I sleep in late to catch up on weekends',
        desc: "Creates 'Social Jetlag', disrupting melatonin release timers."
      }
    ]
  },
  {
    id: 2,
    category: 'Circadian Alignment',
    text: 'Do you view bright, outdoor sunlight within 30 minutes of waking?',
    options: [
      {
        value: 'sunlight_yes',
        label: 'Yes, I step outdoors for 10-30 minutes',
        desc: 'Triggers crucial morning cortisol and sets a timing trigger for nighttime melatonin.'
      },
      {
        value: 'sunlight_no',
        label: 'No, I remain indoors or look through window glass',
        desc: 'Window glass blocks vital light wavelengths, weakening circadian clock cues.'
      }
    ]
  },
  {
    id: 3,
    category: 'Chemical Blockers',
    text: 'What does your caffeine routine look like?',
    options: [
      {
        value: 'caffeine_delayed',
        label: 'I delay caffeine by 90 mins in morning & cutoff 8-10 hours before bed',
        desc: 'Allows residual adenosine to clear naturally and prevents overnight sleep fragmentation.'
      },
      {
        value: 'caffeine_immediate',
        label: 'I drink caffeine immediately after waking or consume it late in the day',
        desc: 'Suppresses adenosine artificially, causing afternoon crashes and blocking sleep pressure.'
      }
    ]
  },
  {
    id: 4,
    category: 'Sedation Factors',
    text: 'Do you use alcohol or cannabis (THC) close to bedtime?',
    options: [
      {
        value: 'substances_none',
        label: 'No, I avoid them prior to sleeping',
        desc: 'Ensures healthy sleep cycles, preserving restorative deep and REM sleep stages.'
      },
      {
        value: 'substances_used',
        label: 'Yes, I consume them to help me fall asleep faster',
        desc: 'Induces sedation rather than natural sleep, severely blocking REM sleep and raising heart rate.'
      }
    ]
  },
  {
    id: 5,
    category: 'Metabolism Timing',
    text: 'How many hours before bed is your final heavy meal?',
    options: [
      {
        value: 'meal_optimal',
        label: 'At least 3-4 hours before bedtime',
        desc: 'Lowers your Resting Heart Rate (RHR) early in the night, maximizing deep sleep repair.'
      },
      {
        value: 'meal_late',
        label: 'Within 2 hours of going to sleep',
        desc: 'Digestion raises core temperature and spikes RHR, interrupting growth hormone release.'
      }
    ]
  },
  {
    id: 6,
    category: 'Melatonin Suppression',
    text: 'Do you use phones, tablets, or screens in bed within 60 minutes of sleeping?',
    options: [
      {
        value: 'screens_no',
        label: 'No, I enforce a strict screen-free boundary before sleep',
        desc: "Protects your brain's natural melatonin ('vampire hormone') surge."
      },
      {
        value: 'screens_yes',
        label: 'Yes, I scroll or view content in bed in the dark',
        desc: 'Blue light exposure mimics sunrise, actively shutting down melatonin release.'
      }
    ]
  },
  {
    id: 7,
    category: 'Thermoregulation',
    text: 'What temperature is your bedroom sleeping environment?',
    options: [
      {
        value: 'temp_cool',
        label: "Cool (15.6\u00b0C - 19.4\u00b0C / 60\u00b0F - 67\u00b0F)",
        desc: 'Enables your body core temperature to drop 1-2\u00b0C to initiate deep sleep.'
      },
      {
        value: 'temp_warm',
        label: 'Warm (above 21\u00b0C / 70\u00b0F)',
        desc: 'Inhibits necessary body heat dissipation, causing light, highly fragmented sleep.'
      }
    ]
  },
  {
    id: 8,
    category: 'Nasal Ventilation',
    text: 'Do you snore, wake up with a dry mouth, or have a congested nose?',
    options: [
      {
        value: 'nose_clean',
        label: 'No, I breathe cleanly through my nose all night',
        desc: 'Supports healthy oxygen absorption and nitric oxide synthesis.'
      },
      {
        value: 'mouth_breather',
        label: 'Yes, I often breathe through my mouth or snore',
        desc: "Causes micro-awakenings, reduces blood oxygen levels, and leads to waking dehydrated."
      }
    ]
  },
  {
    id: 9,
    category: 'Sleeplessness Routine',
    text: "If you wake up at night and can't fall asleep, what is your approach?",
    options: [
      {
        value: 'insomnia_get_up',
        label: 'I keep lights dim, avoid checking clocks, and do a calm activity',
        desc: "Maintains a calm nervous system and keeps the brain from associating the bed with frustration."
      },
      {
        value: 'insomnia_stay_in_bed',
        label: 'I stay in bed, look at the clock, or check my phone',
        desc: "Generates 'math anxiety' over remaining hours and reinforces bed-related stress."
      }
    ]
  },
  {
    id: 10,
    category: 'Fatigue Screening',
    text: 'Do you feel exhausted despite sleeping 8+ hours a night?',
    options: [
      {
        value: 'fatigue_none',
        label: 'No, I feel reasonably refreshed when sleeping enough',
        desc: 'Indicates good sleep efficiency and healthy sleep stage progression.'
      },
      {
        value: 'fatigue_high',
        label: 'Yes, I remain fatigued regardless of sleep duration',
        desc: 'A major indicator of airway resistance issues, sleep apnea, or severe biological strain.'
      }
    ]
  }
]

const diagnosticsDatabase = {
  1: {
    icon: '\u23f0',
    title: 'The Regularity Protocol (Social Jetlag)',
    description: 'Your wake times fluctuate. Establish an identical wake-up time even on weekends. Sleeping in late creates social jetlag, making your Monday mornings physically exhausting.'
  },
  2: {
    icon: '\u2600\ufe0f',
    title: 'Light Viewing Optimization',
    description: 'Get bright, outdoor sunlight in your eyes for 10-30 minutes within 30 minutes of waking. This triggers natural morning cortisol and starts a timer in your brain to release melatonin ~16 hours later.'
  },
  3: {
    icon: '\u2615',
    title: 'Adenosine & Caffeine Management',
    description: 'Delay caffeine by 90 minutes in the morning. This lets natural cortisol clear out leftover adenosine, eliminating the dreaded afternoon crash. Keep caffeine cutoff 8-10 hours before bed.'
  },
  4: {
    icon: '🍷',
    title: 'Sleep Architecture Restoration (REM)',
    description: 'Alcohol and cannabis act as sedatives, not sleep aids. They destroy REM sleep stages, suppressing dreaming and memories. Avoid both substances near bedtime.'
  },
  5: {
    icon: '🍽️',
    title: 'Meal Timing & RHR Drop',
    description: 'Stop eating heavy meals 3-4 hours before bedtime. Digestion raises body heat and keeps your heart rate elevated, reducing restorative deep sleep.'
  },
  6: {
    icon: '📵',
    title: 'Circadian Light Boundary',
    description: 'Enforce a strict 60-minute screen-free window before bed. Screens suppress melatonin, preventing your brain from downshifting into sleep.'
  },
  7: {
    icon: '🌡️',
    title: 'Thermoregulation Environment',
    description: 'Set your bedroom temperature between 15.6\u00b0C - 19.4\u00b0C (60\u00b0F - 67\u00b0F). A hot room prevents your core temperature from taking its required 1-2\u00b0C sleep-inducing plunge.'
  },
  8: {
    icon: '🤐',
    title: 'Nasal Breathing Activation',
    description: 'Mouth breathing causes lighter sleep stages and snoring. Consider trying a piece of micropore mouth tape or mechanical nasal strips to physically pull your nostrils open and promote deep nasal breathing.'
  },
  9: {
    icon: '🚶',
    title: 'The 20-Minute Rule & Anti-Math Anxiety',
    description: 'If awake in bed for 20 minutes, immediately get up. Read a fiction book in dim light until sleepy. Never check the clock, as calculating remaining sleep hours triggers an alert stress response.'
  },
  10: {
    icon: '\u26a0\ufe0f',
    title: 'Airway & Sleep Apnea Screening',
    description: 'Waking up exhausted after 8+ hours is a primary sign of Sleep Apnea. Consult a specialist for a sleep study; a physical airway evaluation or CPAP can immediately restore your cognitive energy.'
  }
}

const optimalSelections = {
  1: 'regular',
  2: 'sunlight_yes',
  3: 'caffeine_delayed',
  4: 'substances_none',
  5: 'meal_optimal',
  6: 'screens_no',
  7: 'temp_cool',
  8: 'nose_clean',
  9: 'insomnia_get_up',
  10: 'fatigue_none'
}

const currentStep = ref(1)
const answers = ref({})
const showResults = ref(false)
const wakeTime = ref('07:00')
const previousResults = ref(null)

const totalSteps = computed(() => questions.length)
const currentQuestion = computed(() => questions.find(q => q.id === currentStep.value))
const progressPercent = computed(() => {
  if (showResults.value) return 100
  return ((currentStep.value - 1) / totalSteps.value) * 100
})

const sleepScore = computed(() => {
  let optimalCount = 0
  for (const qId in optimalSelections) {
    if (answers.value[qId] === optimalSelections[qId]) {
      optimalCount++
    }
  }
  return Math.round((optimalCount / totalSteps.value) * 100)
})

const suboptimalRecommendations = computed(() => {
  const list = []
  for (const qId in optimalSelections) {
    if (answers.value[qId] !== optimalSelections[qId]) {
      list.push(diagnosticsDatabase[qId])
    }
  }
  return list
})

const optimalRecommendations = computed(() => {
  const list = []
  for (const qId in optimalSelections) {
    if (answers.value[qId] === optimalSelections[qId]) {
      list.push({
        title: diagnosticsDatabase[qId].title,
        description: diagnosticsDatabase[qId].description.split('.')[0] + '.'
      })
    }
  }
  return list
})

const ringOffset = computed(() => {
  const circ = 2 * Math.PI * 52
  return circ - (circ * sleepScore.value / 100)
})

const categories = computed(() => {
  const map = {}
  questions.forEach(q => {
    if (!map[q.category]) {
      map[q.category] = { total: 0, optimal: 0 }
    }
    map[q.category].total++
    if (answers.value[q.id] === optimalSelections[q.id]) {
      map[q.category].optimal++
    }
  })
  return map
})

const cycleResults = computed(() => {
  if (!wakeTime.value) return []
  const [h, m] = wakeTime.value.split(':')
  const wakeDate = new Date()
  wakeDate.setHours(+h, +m, 0)
  const cycles = [5, 4, 3, 2]
  return cycles.map(c => {
    const bedDate = new Date(wakeDate)
    bedDate.setMinutes(bedDate.getMinutes() - (c * 90 + 15))
    const time = bedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const sleepHours = (c * 90) / 60
    let recLabel, recClass
    if (c >= 4) { recLabel = '\u2b50 Recommended'; recClass = 'rec-recommended' }
    else if (c >= 3) { recLabel = '\U0001f44d Acceptable'; recClass = 'rec-acceptable' }
    else { recLabel = '\u26a0\ufe0f Short'; recClass = 'rec-short' }
    return { time, sleepHours, cycles: c, recLabel, recClass }
  })
})

const scoreDiff = computed(() => {
  if (!previousResults.value) return 0
  return sleepScore.value - previousResults.value.score
})

function selectOption(val) {
  answers.value[currentStep.value] = val
}

function nextStep() {
  if (currentStep.value < totalSteps.value) {
    currentStep.value++
  } else {
    showResults.value = true
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function resetSurvey() {
  currentStep.value = 1
  answers.value = {}
  showResults.value = false
  wakeTime.value = '07:00'
}

function saveResults() {
  try {
    const data = {
      score: sleepScore.value,
      date: new Date().toISOString(),
      answers: { ...answers.value }
    }
    localStorage.setItem('neros-guide-settings.sleepResults', JSON.stringify(data))
  } catch {}
}

function loadPreviousResults() {
  try {
    const saved = localStorage.getItem('neros-guide-settings.sleepResults')
    if (saved) previousResults.value = JSON.parse(saved)
  } catch {}
}

function handleKeydown(e) {
  if (showResults.value) return
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return
  const q = currentQuestion.value
  if (!q) return

  if (e.key === '1') {
    e.preventDefault()
    const opt = q.options[0]
    if (opt) selectOption(opt.value)
  } else if (e.key === '2') {
    e.preventDefault()
    const opt = q.options[1]
    if (opt) selectOption(opt.value)
  } else if (e.key === 'Enter' && answers.value[q.id]) {
    e.preventDefault()
    nextStep()
  }
}

function exportResults() {
  const lines = []
  const divider = '\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550'
  const sep = '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500'

  lines.push(divider)
  lines.push('  SLEEP PROTOCOL ASSESSMENT BLUEPRINT')
  lines.push(`  Generated: ${new Date().toLocaleDateString()}`)
  lines.push(`  Sleep Efficiency Score: ${sleepScore.value}%`)
  if (previousResults.value) {
    lines.push(`  Previous Score: ${previousResults.value.score}% (${previousResults.value.date ? new Date(previousResults.value.date).toLocaleDateString() : 'N/A'})`)
  }
  lines.push(divider)
  lines.push('')

  if (suboptimalRecommendations.value.length) {
    lines.push('PRIORITY ADJUSTMENTS')
    lines.push(sep)
    suboptimalRecommendations.value.forEach((rec, i) => {
      lines.push(`${i + 1}. ${rec.icon} ${rec.title}`)
      lines.push(`   ${rec.description}`)
      lines.push('')
    })
  }

  if (optimalRecommendations.value.length) {
    lines.push('MAINTAINED PROTOCOLS')
    lines.push(sep)
    optimalRecommendations.value.forEach((rec, i) => {
      lines.push(`${i + 1}. ${rec.title}`)
      lines.push(`   ${rec.description}`)
      lines.push('')
    })
  }

  lines.push(sep)
  lines.push('Access the full interactive guide with resources:')
  lines.push(divider)

  const text = lines.join('\n')
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `sleep-protocol-${new Date().toISOString().split('T')[0]}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

function copyResults() {
  const lines = []
  lines.push(`Sleep Efficiency Profile: ${sleepScore.value}%`)
  lines.push(`Assessment Date: ${new Date().toLocaleDateString()}`)
  if (previousResults.value) {
    lines.push(`Previous Score: ${previousResults.value.score}% (${previousResults.value.date ? new Date(previousResults.value.date).toLocaleDateString() : 'N/A'})`)
  }
  lines.push('')

  if (suboptimalRecommendations.value.length) {
    lines.push('Priority Adjustments:')
    suboptimalRecommendations.value.forEach(rec => {
      lines.push(`  ${rec.icon} ${rec.title}`)
      lines.push(`    ${rec.description}`)
    })
    lines.push('')
  }

  if (optimalRecommendations.value.length) {
    lines.push('Maintained Protocols:')
    optimalRecommendations.value.forEach(rec => {
      lines.push(`  ${rec.title}`)
      lines.push(`    ${rec.description}`)
    })
  }

  navigator.clipboard.writeText(lines.join('\n')).then(() => {
    alert('Diagnostics blueprint copied to clipboard!')
  }).catch(() => {
    alert('Could not copy automatically. Please copy manually.')
  })
}

watch(showResults, (val) => {
  if (val) {
    saveResults()
    if (sleepScore.value === 100) {
      showSleepMasterToast()
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.7 } })
    }
  }
})

function showSleepMasterToast() {
  const toast = document.createElement('div')
  toast.textContent = 'Sleep Master! Perfect score!'
  Object.assign(toast.style, {
    position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
    background: 'linear-gradient(135deg, #2ecc71, #27ae60)', color: '#fff',
    padding: '0.8rem 1.6rem', borderRadius: '12px', fontWeight: '700',
    fontSize: '0.95rem', zIndex: '99999', boxShadow: '0 4px 20px rgba(46,204,113,0.4)',
    animation: 'fadeIn 0.3s ease'
  })
  document.body.appendChild(toast)
  setTimeout(() => toast.remove(), 4000)
}

onMounted(() => {
  loadPreviousResults()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.survey-container {
  max-width: 660px;
  margin: 1.5rem auto;
  box-sizing: border-box;
}

.sleep-survey-card {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  padding: 2.5rem 2.2rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
  box-sizing: border-box;
}

/* Progress Area */
.progress-section {
  margin-bottom: 2.2rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}

.progress-track {
  width: 100%;
  height: 6px;
  background: var(--vp-c-bg-soft);
  border-radius: 100px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--vp-c-brand-1);
  border-radius: 100px;
  transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Question Engine */
.category-tag {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  letter-spacing: 0.08em;
  margin-bottom: 0.75rem;
}

.question-title {
  font-size: 1.45rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--vp-c-text-1);
  margin: 0 0 1.8rem 0;
  border: none;
}

.options-grid {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-bottom: 1rem;
}

.option-card {
  display: flex;
  align-items: flex-start;
  gap: 1.1rem;
  padding: 1.25rem 1.4rem;
  background: var(--vp-c-bg-elv);
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 14px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.01);
}

.option-card:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.04);
}

.option-card:active {
  transform: translateY(1px);
}

.option-card.is-selected {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  box-shadow: 0 2px 8px rgba(var(--vp-c-brand-1-rgb), 0.1);
}

.selection-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--vp-c-text-3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.15rem;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.indicator-inner {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ffffff;
  transform: scale(0);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.option-card.is-selected .selection-indicator {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-1);
}

.option-card.is-selected .indicator-inner {
  transform: scale(1);
}

.option-content {
  display: flex;
  flex-direction: column;
}

.option-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.25rem;
}

.option-desc {
  font-size: 0.8rem;
  line-height: 1.4;
  color: var(--vp-c-text-2);
}

.keyboard-hint {
  text-align: center;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  margin-bottom: 0.75rem;
}

.keyboard-hint kbd {
  display: inline-block;
  padding: 0.1rem 0.4rem;
  font-size: 0.7rem;
  font-family: inherit;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  color: var(--vp-c-text-2);
}

.navigation-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 44px;
  margin-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 1.5rem;
}

.nav-btn {
  padding: 0.75rem 1.4rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-btn:hover {
  transform: translateY(-1px);
}

.nav-btn:active {
  transform: translateY(1px);
}

.btn-back {
  background: var(--vp-c-bg-elv);
  border-color: var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.btn-back:hover {
  background: var(--vp-c-bg-soft);
}

.btn-next {
  background: var(--vp-c-brand-1);
  color: #ffffff;
  margin-left: auto;
}

.btn-next:hover {
  background: var(--vp-c-brand-2);
}

/* Results Dashboard */
.results-dashboard {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 2.2rem;
}

.dashboard-header h2 {
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--vp-c-text-1);
  margin: 0 0 0.5rem 0;
  border: none;
}

.dashboard-subtitle {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}

/* Score Ring */
.score-ring {
  width: 150px;
  height: 150px;
  display: block;
  margin: 0 auto 1rem;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: var(--vp-c-bg-soft);
  stroke-width: 8;
}

.ring-fill {
  fill: none;
  stroke: var(--vp-c-brand-1);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.ring-number {
  transform: rotate(90deg);
  transform-origin: 60px 60px;
  font-size: 1.5rem;
  font-weight: 800;
  fill: var(--vp-c-text-1);
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

.ring-label {
  transform: rotate(90deg);
  transform-origin: 60px 60px;
  font-size: 0.55rem;
  fill: var(--vp-c-text-2);
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Comparison Bar */
.comparison-bar {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  background: var(--vp-c-bg-soft);
  font-size: 0.8rem;
  font-weight: 600;
}

.comparison-text {
  color: var(--vp-c-text-2);
}

.comparison-diff {
  font-weight: 700;
}

.diff-up {
  color: var(--vp-c-brand-1);
}

.diff-down {
  color: #e06c6c;
}

/* Results Sections */
.results-section {
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.section-title.priority {
  color: #ff9500;
}

.section-title.optimized {
  color: var(--vp-c-brand-1);
}

.section-subtitle {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin: 0 0 1rem;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.diagnostic-card {
  display: flex;
  gap: 1.1rem;
  padding: 1.3rem;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-elv);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.diagnostic-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
}

.diagnostic-card.critical {
  border-left: 4px solid #ff9500;
}

.diagnostic-card.perfect {
  border-left: 4px solid var(--vp-c-brand-1);
}

.card-icon-wrapper {
  font-size: 1.6rem;
  line-height: 1;
  margin-top: 0.1rem;
}

.card-body h4 {
  margin: 0 0 0.35rem 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.card-body p {
  margin: 0 0 0.75rem 0;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}

.protocol-badge {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  background: rgba(255, 149, 0, 0.1);
  color: #ff9500;
  border-radius: 4px;
}

.protocol-badge.success {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

/* Category Progress Chips */
.categories-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.75rem;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.cat-optimal {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.cat-needs-work {
  border-color: rgba(255, 149, 0, 0.3);
  background: rgba(255, 149, 0, 0.08);
  color: #ff9500;
}

.cat-icon {
  font-size: 0.7rem;
}

.cat-score {
  font-size: 0.7rem;
  opacity: 0.8;
}

/* Cycle Calculator */
.cycle-section {
  padding: 1.5rem;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.cycle-input-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.cycle-label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
}

.cycle-input {
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
  font-size: 1rem;
  font-family: inherit;
}

.cycle-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.65rem;
}

.cycle-card {
  padding: 0.85rem;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-elv);
  text-align: center;
}

.cycle-card.rec-recommended {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.cycle-card.rec-acceptable {
  border-color: var(--vp-c-divider);
}

.cycle-card.rec-short {
  border-color: rgba(255, 149, 0, 0.3);
  background: rgba(255, 149, 0, 0.06);
}

.cycle-time {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.cycle-detail {
  font-size: 0.7rem;
  color: var(--vp-c-text-2);
  margin: 0.15rem 0 0.3rem;
}

.cycle-label-tag {
  font-size: 0.6rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.rec-recommended .cycle-label-tag {
  color: var(--vp-c-brand-1);
}

/* Footer */
.dashboard-footer {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
  text-align: center;
}

.action-row {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.dashboard-btn {
  flex: 1;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dashboard-btn:hover {
  transform: translateY(-2px);
}

.dashboard-btn:active {
  transform: translateY(1px);
}

.btn-primary {
  background: var(--vp-c-brand-1);
  color: #ffffff;
}

.btn-primary:hover {
  background: var(--vp-c-brand-2);
  box-shadow: 0 4px 12px rgba(var(--vp-c-brand-1-rgb), 0.25);
}

.btn-secondary {
  background: var(--vp-c-bg-elv);
  border-color: var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.btn-secondary:hover {
  background: var(--vp-c-bg-soft);
}

.reset-link-btn {
  background: none;
  border: none;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  cursor: pointer;
  transition: color 0.2s;
}

.reset-link-btn:hover {
  color: var(--vp-c-text-1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .sleep-survey-card {
    padding: 1.8rem 1.4rem;
  }

  .question-title {
    font-size: 1.25rem;
  }

  .score-ring {
    width: 120px;
    height: 120px;
  }

  .action-row {
    flex-direction: column;
    width: 100%;
  }

  .dashboard-btn {
    width: 100%;
  }

  .cycle-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
