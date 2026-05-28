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
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
      </div>

      <!-- Quiz Interface -->
      <div v-if="!showResults" class="quiz-interface">
        <div class="category-tag">{{ currentQuestion.category.toUpperCase() }} PROTOCOL</div>
        <h2 class="question-title">{{ currentQuestion.text }}</h2>
        
        <div class="options-grid">
          <button 
            v-for="option in currentQuestion.options" 
            :key="option.value"
            @click="selectOption(option.value)"
            class="option-card"
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

        <div class="navigation-bar">
          <button 
            v-if="currentStep > 1" 
            @click="prevStep" 
            class="nav-btn btn-back"
          >
            ← Back
          </button>
          
          <button 
            v-if="answers[currentQuestion.id]" 
            @click="nextStep" 
            class="nav-btn btn-next"
          >
            {{ currentStep === totalSteps ? 'See Diagnostics' : 'Continue' }} →
          </button>
        </div>
      </div>

      <!-- Advanced Diagnostic Dashboard -->
      <div v-else class="results-dashboard animate-fade-in">
        <div class="dashboard-header">
          <div class="score-radial">
            <span class="score-number">{{ sleepScore }}%</span>
            <span class="score-meta">Sleep Efficiency Profile</span>
          </div>
          <h2>Your Sleep Protocol Analysis</h2>
          <p class="dashboard-subtitle">We have processed your circadian, biological, and environmental vectors. Here is your roadmap:</p>
        </div>

        <!-- Areas of Immediate Improvement (Priority Protocols) -->
        <div v-if="suboptimalRecommendations.length > 0" class="results-section">
          <h3 class="section-title priority">⚠️ Action Items (Priority Adjustments)</h3>
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

        <!-- Strong Practices (Maintenance & Optimization) -->
        <div class="results-section">
          <h3 class="section-title optimized">✨ Strengths (Maintained Protocols)</h3>
          <p class="section-subtitle">You are successfully managing these sleep drivers. Keep doing the following:</p>
          <div class="recommendations-list">
            <div v-for="rec in optimalRecommendations" :key="rec.title" class="diagnostic-card perfect">
              <div class="card-icon-wrapper">✅</div>
              <div class="card-body">
                <h4>{{ rec.title }}</h4>
                <p>{{ rec.description }}</p>
                <div class="protocol-badge success">OPTIMIZED</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Global Action Buttons -->
        <div class="dashboard-footer">
          <div class="action-row">
            <button @click="exportResults" class="dashboard-btn btn-secondary">
              📄 Export Blueprint (.txt)
            </button>
            <button @click="copyResults" class="dashboard-btn btn-primary">
              📋 Copy to Clipboard
            </button>
          </div>
          <button @click="resetSurvey" class="reset-link-btn">
            ⟳ Retake Assessment
          </button>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// ============================================
// 10 CLINICAL CIRCADIAN & BIOLOGICAL QUESTIONS
// ============================================

const questions = [
  {
    id: 1,
    category: "Regularity",
    text: "Do you wake up at the exact same time every single day, including weekends?",
    options: [
      { 
        value: "regular", 
        label: "Yes, my schedule remains highly consistent", 
        desc: "Optimally anchors your circadian rhythm (Process C)." 
      },
      { 
        value: "irregular", 
        label: "No, I sleep in late to catch up on weekends", 
        desc: "Creates 'Social Jetlag', disrupting melatonin release timers." 
      }
    ]
  },
  {
    id: 2,
    category: "Circadian Alignment",
    text: "Do you view bright, outdoor sunlight within 30 minutes of waking?",
    options: [
      { 
        value: "sunlight_yes", 
        label: "Yes, I step outdoors for 10-30 minutes", 
        desc: "Triggers crucial morning cortisol and sets a timing trigger for nighttime melatonin." 
      },
      { 
        value: "sunlight_no", 
        label: "No, I remain indoors or look through window glass", 
        desc: "Window glass blocks vital light wavelengths, weakening circadian clock cues." 
      }
    ]
  },
  {
    id: 3,
    category: "Chemical Blockers",
    text: "What does your caffeine routine look like?",
    options: [
      { 
        value: "caffeine_delayed", 
        label: "I delay caffeine by 90 mins in morning & cutoff 8-10 hours before bed", 
        desc: "Allows residual adenosine to clear naturally and prevents overnight sleep fragmentation." 
      },
      { 
        value: "caffeine_immediate", 
        label: "I drink caffeine immediately after waking or consume it late in the day", 
        desc: "Suppresses adenosine artificially, causing afternoon crashes and blocking sleep pressure." 
      }
    ]
  },
  {
    id: 4,
    category: "Sedation Factors",
    text: "Do you use alcohol or cannabis (THC) close to bedtime?",
    options: [
      { 
        value: "substances_none", 
        label: "No, I avoid them prior to sleeping", 
        desc: "Ensures healthy sleep cycles, preserving restorative deep and REM sleep stages." 
      },
      { 
        value: "substances_used", 
        label: "Yes, I consume them to help me fall asleep faster", 
        desc: "Induces sedation rather than natural sleep, severely blocking REM sleep and raising heart rate." 
      }
    ]
  },
  {
    id: 5,
    category: "Metabolism Timing",
    text: "How many hours before bed is your final heavy meal?",
    options: [
      { 
        value: "meal_optimal", 
        label: "At least 3-4 hours before bedtime", 
        desc: "Lowers your Resting Heart Rate (RHR) early in the night, maximizing deep sleep repair." 
      },
      { 
        value: "meal_late", 
        label: "Within 2 hours of going to sleep", 
        desc: "Digestion raises core temperature and spikes RHR, interrupting growth hormone release." 
      }
    ]
  },
  {
    id: 6,
    category: "Melatonin Suppression",
    text: "Do you use phones, tablets, or screens in bed within 60 minutes of sleeping?",
    options: [
      { 
        value: "screens_no", 
        label: "No, I enforce a strict screen-free boundary before sleep", 
        desc: "Protects your brain's natural melatonin ('vampire hormone') surge." 
      },
      { 
        value: "screens_yes", 
        label: "Yes, I scroll or view content in bed in the dark", 
        desc: "Blue light exposure mimics sunrise, actively shutting down melatonin release." 
      }
    ]
  },
  {
    id: 7,
    category: "Thermoregulation",
    text: "What temperature is your bedroom sleeping environment?",
    options: [
      { 
        value: "temp_cool", 
        label: "Cool (15.6°C - 19.4°C / 60°F - 67°F)", 
        desc: "Enables your body core temperature to drop 1-2°C to initiate deep sleep." 
      },
      { 
        value: "temp_warm", 
        label: "Warm (above 21°C / 70°F)", 
        desc: "Inhibits necessary body heat dissipation, causing light, highly fragmented sleep." 
      }
    ]
  },
  {
    id: 8,
    category: "Nasal Ventilation",
    text: "Do you snore, wake up with a dry mouth, or have a congested nose?",
    options: [
      { 
        value: "nose_clean", 
        label: "No, I breathe cleanly through my nose all night", 
        desc: "Supports healthy oxygen absorption and nitric oxide synthesis." 
      },
      { 
        value: "mouth_breather", 
        label: "Yes, I often breathe through my mouth or snore", 
        desc: "Causes micro-awakenings, reduces blood oxygen levels, and leads to waking dehydrated." 
      }
    ]
  },
  {
    id: 9,
    category: "Sleeplessness Routine",
    text: "If you wake up at night and can't fall asleep, what is your approach?",
    options: [
      { 
        value: "insomnia_get_up", 
        label: "I keep lights dim, avoid checking clocks, and do a calm activity", 
        desc: "Maintains a calm nervous system and keeps the brain from associating the bed with frustration." 
      },
      { 
        value: "insomnia_stay_in_bed", 
        label: "I stay in bed, look at the clock, or check my phone", 
        desc: "Generates 'math anxiety' over remaining hours and reinforces bed-related stress." 
      }
    ]
  },
  {
    id: 10,
    category: "Fatigue Screening",
    text: "Do you feel exhausted despite sleeping 8+ hours a night?",
    options: [
      { 
        value: "fatigue_none", 
        label: "No, I feel reasonably refreshed when sleeping enough", 
        desc: "Indicates good sleep efficiency and healthy sleep stage progression." 
      },
      { 
        value: "fatigue_high", 
        label: "Yes, I remain fatigued regardless of sleep duration", 
        desc: "A major indicator of airway resistance issues, sleep apnea, or severe biological strain." 
      }
    ]
  }
]

// Priority Protocol Recommendations (When user submits Suboptimal answers)
const diagnosticsDatabase = {
  1: {
    icon: "⏰",
    title: "The Regularity Protocol (Social Jetlag)",
    description: "Your wake times fluctuate. Establish an identical wake-up time even on weekends. Sleeping in late creates social jetlag, making your Monday mornings physically exhausting."
  },
  2: {
    icon: "☀️",
    title: "Light Viewing Optimization",
    description: "Get bright, outdoor sunlight in your eyes for 10-30 minutes within 30 minutes of waking. This triggers natural morning cortisol and starts a timer in your brain to release melatonin ~16 hours later."
  },
  3: {
    icon: "☕",
    title: "Adenosine & Caffeine Management",
    description: "Delay caffeine by 90 minutes in the morning. This lets natural cortisol clear out leftover adenosine, eliminating the dreaded afternoon crash. Keep caffeine cutoff 8-10 hours before bed."
  },
  4: {
    icon: "🍷",
    title: "Sleep Architecture Restoration (REM)",
    description: "Alcohol and cannabis act as sedatives, not sleep aids. They destroy REM sleep stages, suppressing dreaming and memories. Avoid both substances near bedtime."
  },
  5: {
    icon: "🍽️",
    title: "Meal Timing & RHR Drop",
    description: "Stop eating heavy meals 3-4 hours before bedtime. Digestion raises body heat and keeps your heart rate elevated, reducing restorative deep sleep."
  },
  6: {
    icon: "📵",
    title: "Circadian Light Boundary",
    description: "Enforce a strict 60-minute screen-free window before bed. Screens suppress melatonin, preventing your brain from downshifting into sleep."
  },
  7: {
    icon: "🌡️",
    title: "Thermoregulation Environment",
    description: "Set your bedroom temperature between 15.6°C - 19.4°C (60°F - 67°F). A hot room prevents your core temperature from taking its required 1-2°C sleep-inducing plunge."
  },
  8: {
    icon: "🤐",
    title: "Nasal Breathing Activation",
    description: "Mouth breathing causes lighter sleep stages and snoring. Consider trying a piece of micropore mouth tape or mechanical nasal strips to physically pull your nostrils open and promote deep nasal breathing."
  },
  9: {
    icon: "🚶",
    title: "The 20-Minute Rule & Anti-Math Anxiety",
    description: "If awake in bed for 20 minutes, immediately get up. Read a fiction book in dim light until sleepy. Never check the clock, as calculating remaining sleep hours triggers an alert stress response."
  },
  10: {
    icon: "⚠️",
    title: "Airway & Sleep Apnea Screening",
    description: "Waking up exhausted after 8+ hours is a primary sign of Sleep Apnea. Consult a specialist for a sleep study; a physical airway evaluation or CPAP can immediately restore your cognitive energy."
  }
}

// State
const currentStep = ref(1)
const answers = ref({})
const showResults = ref(false)

const totalSteps = computed(() => questions.length)
const currentQuestion = computed(() => questions.find(q => q.id === currentStep.value))
const progressPercent = computed(() => {
  if (showResults.value) return 100
  return ((currentStep.value - 1) / totalSteps.value) * 100
})

// Calculations for Report Card
const optimalSelections = {
  1: "regular",
  2: "sunlight_yes",
  3: "caffeine_delayed",
  4: "substances_none",
  5: "meal_optimal",
  6: "screens_no",
  7: "temp_cool",
  8: "nose_clean",
  9: "insomnia_get_up",
  10: "fatigue_none"
}

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
        description: diagnosticsDatabase[qId].description.split('.')[0] + "." // first sentence for compact display
      })
    }
  }
  return list
})

// Methods
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
}

function exportResults() {
  const resultsText = `
SLEEP PROTOCOL ASSESSMENT BLUEPRINT
Generated: ${new Date().toLocaleDateString()}
Sleep Efficiency Score: ${sleepScore.value}%
========================================

PRIORITY ACTIONS FOR ADJUSTMENT:
${suboptimalRecommendations.value.map((rec, i) => `${i+1}. [${rec.icon}] ${rec.title}\n   - Guidance: ${rec.description}`).join('\n\n')}

MAINTAINED PROTOCOLS:
${optimalRecommendations.value.map((rec, i) => `${i+1}. ✅ ${rec.title}\n   - Guidance: ${rec.description}`).join('\n\n')}

----------------------------------------
Access full science guidelines at: ${window.location.origin}/sleeping
  `.trim()

  const blob = new Blob([resultsText], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `my-circadian-sleep-protocol.txt`
  a.click()
  URL.revokeObjectURL(url)
}

function copyResults() {
  const resultsText = `Sleep Efficiency Profile: ${sleepScore.value}%\n\nPriority Adjustments:\n` + 
    suboptimalRecommendations.value.map(rec => `- ${rec.title}`).join('\n')
  
  navigator.clipboard.writeText(resultsText).then(() => {
    alert('Diagnostics blueprint copied to clipboard!')
  }).catch(() => {
    alert('Could not copy automatically. Please copy manually.')
  })
}
</script>

<style scoped>
/* ============================================
   SOLID APPLE INTERFACE SYSTEM
   ============================================ */

.survey-container {
  /* Scope Theme Variables (VitePress Compliant) */
  --s-font: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif;
  --s-accent: var(--vp-c-brand-1, #0071e3);
  --s-accent-hover: var(--vp-c-brand-2, #0071e3);
  
  /* Solid Crisp Colors (No heavy filters or blurs for readability) */
  --s-bg-card: #ffffff;
  --s-bg-alt: #f5f5f7;
  --s-border: #e5e5ea;
  --s-text-p: #1d1d1f;
  --s-text-s: #86868b;
  --s-shadow: 0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
  --s-radius: 18px;

  position: relative;
  width: 100%;
  max-width: 660px;
  margin: 1.5rem auto;
  font-family: var(--s-font);
  box-sizing: border-box;
}

/* Dark Mode Overrides */
:dark .survey-container,
.dark .survey-container,
[data-theme='dark'] .survey-container {
  --s-bg-card: #1c1c1e;
  --s-bg-alt: #2c2c2e;
  --s-border: #38383a;
  --s-text-p: #f5f5f7;
  --s-text-s: #8e8e93;
  --s-shadow: 0 12px 30px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);
}

.sleep-survey-card {
  background: var(--s-bg-card);
  border: 1px solid var(--s-border);
  border-radius: var(--s-radius);
  padding: 2.5rem 2.2rem;
  box-shadow: var(--s-shadow);
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
  color: var(--s-text-s);
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
}

.progress-track {
  width: 100%;
  height: 6px;
  background: var(--s-bg-alt);
  border-radius: 100px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--s-accent);
  border-radius: 100px;
  transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Question Engine styling */
.category-tag {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--s-accent);
  letter-spacing: 0.08em;
  margin-bottom: 0.75rem;
}

.question-title {
  font-size: 1.45rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--s-text-p);
  margin: 0 0 1.8rem 0;
  border: none;
  letter-spacing: -0.02em;
}

.options-grid {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-bottom: 2rem;
}

/* Option Cards - Interactive Elevating & Transforming */
.option-card {
  display: flex;
  align-items: flex-start;
  gap: 1.1rem;
  padding: 1.25rem 1.4rem;
  background: var(--s-bg-card);
  border: 1.5px solid var(--s-border);
  border-radius: 14px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 1px 2px rgba(0,0,0,0.01);
}

/* Interactive Hover state - Gives the buttons actions */
.option-card:hover {
  transform: translateY(-2px);
  border-color: var(--s-accent);
  background: var(--s-bg-alt);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.04);
}

/* Interactive Click feedback - tactile press */
.option-card:active {
  transform: translateY(1px);
}

/* Selection State styling */
.option-card.is-selected {
  border-color: var(--s-accent);
  background: rgba(var(--vp-c-brand-1-rgb, 0, 113, 227), 0.06);
  box-shadow: 0 2px 8px rgba(var(--vp-c-brand-1-rgb, 0, 113, 227), 0.1);
}

/* Selection Indicator Circle */
.selection-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--s-text-s);
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
  border-color: var(--s-accent);
  background: var(--s-accent);
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
  color: var(--s-text-p);
  margin-bottom: 0.25rem;
}

.option-desc {
  font-size: 0.8rem;
  line-height: 1.4;
  color: var(--s-text-s);
}

/* Navigation control bar */
.navigation-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 44px;
  margin-top: 2rem;
  border-top: 1px solid var(--s-border);
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
  background: var(--s-bg-card);
  border-color: var(--s-border);
  color: var(--s-text-p);
}

.btn-back:hover {
  background: var(--s-bg-alt);
}

.btn-next {
  background: var(--s-accent);
  color: #ffffff;
  margin-left: auto;
}

.btn-next:hover {
  background: var(--s-accent-hover);
}

/* Advanced Diagnostics Dashboard */
.results-dashboard {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 2.2rem;
}

.score-radial {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 2rem;
  background: var(--s-bg-alt);
  border-radius: 100px;
  margin-bottom: 1.25rem;
}

.score-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--s-accent);
  line-height: 1;
}

.score-meta {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--s-text-s);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.25rem;
}

.dashboard-header h2 {
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--s-text-p);
  margin: 0 0 0.5rem 0;
  border: none;
}

.dashboard-subtitle {
  color: var(--s-text-s);
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}

.results-section {
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.01em;
}

.section-title.priority {
  color: #ff9500;
}

.section-title.optimized {
  color: #34c759;
}

.section-subtitle {
  font-size: 0.85rem;
  color: var(--s-text-s);
  margin: 0 0 1rem 0;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Crisp Diagnostic Cards */
.diagnostic-card {
  display: flex;
  gap: 1.1rem;
  padding: 1.3rem;
  border-radius: 14px;
  border: 1px solid var(--s-border);
  background: var(--s-bg-card);
}

.diagnostic-card.critical {
  border-left: 4px solid #ff9500;
}

.diagnostic-card.perfect {
  border-left: 4px solid #34c759;
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
  color: var(--s-text-p);
}

.card-body p {
  margin: 0 0 0.75rem 0;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--s-text-s);
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
  background: rgba(52, 199, 89, 0.1);
  color: #34c759;
}

/* Diagnostic Dashboard Controls */
.dashboard-footer {
  margin-top: 2.5rem;
  padding-top: 1.8rem;
  border-top: 1px solid var(--s-border);
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
  background: var(--s-accent);
  color: #ffffff;
}

.btn-primary:hover {
  background: var(--s-accent-hover);
  box-shadow: 0 4px 12px rgba(var(--vp-c-brand-1-rgb, 0, 113, 227), 0.25);
}

.btn-secondary {
  background: var(--s-bg-card);
  border-color: var(--s-border);
  color: var(--s-text-p);
}

.btn-secondary:hover {
  background: var(--s-bg-alt);
}

.reset-link-btn {
  background: none;
  border: none;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--s-text-s);
  cursor: pointer;
  transition: color 0.2s;
}

.reset-link-btn:hover {
  color: var(--s-text-p);
  text-decoration: underline;
}

.disclaimer {
  margin-top: 2rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--s-border);
  font-size: 0.75rem;
  color: var(--s-text-s);
  line-height: 1.5;
}

/* Animations */
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

/* Mobile Responsiveness */
@media (max-width: 640px) {
  .sleep-survey-card {
    padding: 1.8rem 1.4rem;
  }
  
  .question-title {
    font-size: 1.25rem;
  }
  
  .action-row {
    flex-direction: column;
    width: 100%;
  }

  .dashboard-btn {
    width: 100%;
  }
}
</style>