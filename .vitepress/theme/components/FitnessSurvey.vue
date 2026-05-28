<template>
  <div class="survey-container">
    <div class="fitness-survey-card">
      
      <!-- Progress Bar -->
      <div class="progress-section">
        <div class="progress-info">
          <span class="step-label">
            {{ showResults ? 'Assessment Complete' : `Diagnostic ${currentStep} of ${totalSteps}` }}
          </span>
          <span class="percentage-label">{{ Math.round(progressPercent) }}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
      </div>

      <!-- Quiz Interface -->
      <div v-if="!showResults" class="quiz-interface">
        <div class="category-tag">VECTOR: {{ currentQuestion.category?.toUpperCase() }}</div>
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
            {{ currentStep === totalSteps ? 'Compile Routine' : 'Continue' }} →
          </button>
        </div>
      </div>

      <!-- Tailored Workout Routine & Program Dashboard -->
      <div v-else class="results-dashboard animate-fade-in">
        <div class="dashboard-header">
          <div class="profile-badge">Tactical Fitness Blueprint</div>
          <h2>Your Custom Activity Blueprint</h2>
          <p class="dashboard-subtitle">A balanced health architecture pulling from ExRx.net mechanics and DAREBEE programs:</p>
        </div>

        <!-- Section 1: Custom Weekly Training Block -->
        <div class="results-section">
          <h3 class="section-title priority">📋 Your Custom Weekly Schedule</h3>
          <p class="section-subtitle">Follow this layout to balance physical recovery with muscle protein synthesis limits:</p>
          <div class="weekly-schedule">
            <div v-for="(session, day) in generatedRoutine" :key="day" class="schedule-card">
              <div class="schedule-day">{{ day }}</div>
              <div class="schedule-details">
                <span class="session-type">{{ session.type }}</span>
                <p class="session-exercises">{{ session.description }}</p>
                <div class="session-meta">⏱️ {{ session.duration }} | Intensity: {{ session.intensity }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: Progression Rules (ExRx.net 2-for-2 Rule) -->
        <div class="results-section">
          <h3 class="section-title optimized">⚙️ Progression Rule (The ExRx.net 2-for-2 Rule)</h3>
          <div class="progression-box">
            <p><strong>How to progress safely:</strong> If you can complete <strong>2 more repetitions</strong> than your target goal on the <strong>last 2 sets</strong> of an exercise across two consecutive workouts, it is time to progress.</p>
            <div class="progression-metrics">
              <span class="metric-chip">Increase Reps (e.g., 3x10 → 3x12)</span>
              <span class="metric-chip">Slow down the tempo</span>
              <span class="metric-chip">Shorten rest intervals by 15s</span>
            </div>
          </div>
        </div>

        <!-- Section 3: Curated DAREBEE Program Recommendations -->
        <div class="results-section">
          <h3 class="section-title pathways">🧭 Suggested Free Programs (DAREBEE Path)</h3>
          <div class="pathways-grid">
            <div v-for="program in recommendedPrograms" :key="program.name" class="program-recommendation-card">
              <h4>{{ program.name }}</h4>
              <p>{{ program.description }}</p>
              <a :href="program.link" target="_blank" rel="noopener" class="program-external-link">Open DAREBEE Program →</a>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="dashboard-footer">
          <div class="action-row">
            <button @click="exportBlueprint" class="dashboard-btn btn-secondary">
              📄 Export Blueprint (.txt)
            </button>
            <button @click="resetSurvey" class="dashboard-btn btn-primary">
              ⟳ Re-evaluate
            </button>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const questions = [
  {
    id: 1,
    category: "experience",
    text: "What is your current physical activity/fitness level?",
    options: [
      { value: "beginner", label: "Beginner", desc: "No current structured routine or returning after a major break." },
      { value: "intermediate", label: "Intermediate", desc: "Consistently training 2-3 days a week for at least 3 months." },
      { value: "advanced", label: "Advanced", desc: "Regular structured training 4+ days a week with comfortable lifting patterns." }
    ]
  },
  {
    id: 2,
    category: "focus",
    text: "What is your primary training objective?",
    options: [
      { value: "health", label: "General Longevity & Health", desc: "Balanced mobility, joint structural strength, and cardio efficiency." },
      { value: "strength", label: "Strength & Muscle Development", desc: "Stimulating hypertrophy and progressive mechanical tension." },
      { value: "fatloss", label: "Body Composition & Fat Loss", desc: "High metabolic expenditure combined with muscle mass preservation." },
      { value: "endurance", label: "Cardiovascular Endurance", desc: "Increasing aerobic capacity, LISS thresholds, and VO2 max." }
    ]
  },
  {
    id: 3,
    category: "equipment",
    text: "What training equipment do you have access to?",
    options: [
      { value: "bodyweight", label: "Zero Equipment", desc: "Using floor space, gravity, and household furniture elements." },
      { value: "limited", label: "Limited Gear", desc: "Dumbbells, resistance bands, or a basic home pull-up bar." },
      { value: "full", label: "Full Commercial Gym", desc: "Access to barbells, cable systems, pull stations, and cardio machines." }
    ]
  },
  {
    id: 4,
    category: "schedule",
    text: "How many days per week can you realistically commit to training?",
    options: [
      { value: "minimal", label: "2 - 3 Days per Week", desc: "Focussed full-body training blocks with active rest days." },
      { value: "regular", label: "4 - 5 Days per Week", desc: "Optimized upper/lower splits or high-frequency conditioning." }
    ]
  },
  {
    id: 5,
    category: "time",
    text: "What is your target time commitment per training session?",
    options: [
      { value: "short", label: "20 - 30 Minutes", desc: "High density workouts, short rest periods, time-efficient." },
      { value: "standard", label: "45 - 60 Minutes", desc: "Allows full warm-up, core movements, and dedicated cooldowns." }
    ]
  }
]

// State
const currentStep = ref(1)
const answers = ref({})
const showResults = ref(false)

const totalSteps = computed(() => questions.length)

// Crucial SSR safe computed property with absolute fallbacks
const currentQuestion = computed(() => {
  return questions.find(q => q.id === currentStep.value) || { category: '', text: '', options: [], id: 1 }
})

const progressPercent = computed(() => {
  if (showResults.value) return 100
  return ((currentStep.value - 1) / totalSteps.value) * 100
})

// Custom Blueprint Generator Logic
const generatedRoutine = computed(() => {
  const level = answers.value[1] || 'beginner'
  const goal = answers.value[2] || 'health'
  const gear = answers.value[3] || 'bodyweight'
  const freq = answers.value[4] || 'minimal'
  const duration = answers.value[5] === 'short' ? '20-30 min' : '45-60 min'

  const schedule = {}

  let strengthBlock = ""
  if (gear === 'bodyweight') {
    strengthBlock = level === 'beginner' 
      ? "Bodyweight Squats (3x10), Knee Push-ups (3x8), Planks (3x30s), Glute Bridges (3x12)"
      : "Standard Squats (3x20), Push-ups (3x15), Planks (3x60s), Single-leg Glute Bridges (3x12)";
  } else if (gear === 'limited') {
    strengthBlock = "Dumbbell Goblet Squats (3x10), Dumbbell Floor Chest Press (3x10), Resistance Band Rows (3x12), Planks"
  } else {
    strengthBlock = "Barbell Back Squats (3x8), Bench Press (3x8), Lat Pulldowns/Pullups (3x8), Hanging Leg Raises"
  }

  let cardioBlock = ""
  if (goal === 'endurance') {
    cardioBlock = "High intensity rowing or cycling intervals (HIIT), followed by a 20-minute zone-2 recovery jog."
  } else if (goal === 'fatloss') {
    cardioBlock = "Steady-state incline treadmill walk or cycle keeping heart rate in Zone 2 (fat-burn threshold)."
  } else {
    cardioBlock = "Brisk outdoor walking or joint-friendly cycling to maintain cardiovascular baselines."
  }

  if (freq === 'minimal') {
    schedule["Monday"] = { type: "Full Body Strength", description: strengthBlock, duration, intensity: "Moderate-High" }
    schedule["Wednesday"] = { type: "Full Body Strength", description: strengthBlock, duration, intensity: "Moderate-High" }
    schedule["Friday"] = { type: "Cardio & Mobility Focus", description: `${cardioBlock} Finish with Cat-Cow and Deep Squat holds.`, duration: "30-40 min", intensity: "Moderate" }
  } else {
    schedule["Monday"] = { type: "Strength: Upper Body Focus", description: "Targeting pushing and pulling horizontal patterns (ExRx pattern system).", duration, intensity: "High" }
    schedule["Tuesday"] = { type: "Strength: Lower Body Focus", description: "Targeting squats, hinges, and single-leg lunge variants.", duration, intensity: "High" }
    schedule["Thursday"] = { type: "Conditioning & HIIT", description: cardioBlock, duration: "30 min", intensity: "Vigorous" }
    schedule["Friday"] = { type: "Full Body Synthesis", description: strengthBlock, duration, intensity: "Moderate-High" }
  }

  return schedule
})

const recommendedPrograms = computed(() => {
  const goal = answers.value[2] || 'health'
  const gear = answers.value[3] || 'bodyweight'

  const list = []

  if (gear === 'bodyweight') {
    list.push({
      name: "Foundation (Light)",
      description: "A gentle, equipment-free 30-day program focusing on basic mobility and core strength.",
      link: "https://darebee.com/programs/foundation-program.html"
    })
  } else {
    list.push({
      name: "Ironborn (Strength)",
      description: "A highly structured, dumbbell-only 30-day muscle-building and conditioning program.",
      link: "https://darebee.com/programs/ironborn-program.html"
    })
  }

  if (goal === 'fatloss') {
    list.push({
      name: "30 Days of HIIT",
      description: "Time-efficient, high-metabolic conditioning requiring zero equipment.",
      link: "https://darebee.com/programs/30-days-of-hiit.html"
    })
  } else if (goal === 'health') {
    list.push({
      name: "Active Office / Mobility Focus",
      description: "Gentle daily routines targeting postural alignment, joint health, and desk-fatigue.",
      link: "https://darebee.com/collections/active-office.html"
    })
  }

  return list
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
}

function exportBlueprint() {
  const blueprintText = `
TACTICAL FITNESS BLUEPRINT
Generated: ${new Date().toLocaleDateString()}
========================================

YOUR WEEKLY SCHEDULE:
${Object.entries(generatedRoutine.value).map(([day, ses]) => `\n[${day}] - ${ses.type}\n   Exercises: ${ses.description}\n   Duration: ${ses.duration} | Intensity: ${ses.intensity}`).join('\n')}

========================================
RECOMMENDED FREE DAREBEE PLANS:
${recommendedPrograms.value.map(p => `- ${p.name}: ${p.description}\n  URL: ${p.link}`).join('\n\n')}

========================================
Apply progression protocols continuously. Train movements, not muscles.
  `.trim()

  const blob = new Blob([blueprintText], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `my-custom-fitness-blueprint.txt`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.survey-container {
  --s-font: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif;
  --s-accent: var(--vp-c-brand-1, #0071e3);
  --s-accent-hover: var(--vp-c-brand-2, #0071e3);
  
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

.fitness-survey-card {
  background: var(--s-bg-card);
  border: 1px solid var(--s-border);
  border-radius: var(--s-radius);
  padding: 2.5rem 2.2rem;
  box-shadow: var(--s-shadow);
  box-sizing: border-box;
}

/* Progress Section */
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
  transform: translateY(-3px);
  border-color: var(--s-accent);
  background: var(--s-bg-alt);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
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
  transform: translateY(-2px);
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

/* Blueprint Dashboard */
.results-dashboard {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 2.2rem;
}

.profile-badge {
  display: inline-block;
  padding: 0.35rem 0.85rem;
  background: rgba(var(--vp-c-brand-1-rgb, 0, 113, 227), 0.1);
  color: var(--s-accent);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
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
  color: var(--s-accent);
}

.section-title.optimized {
  color: #34c759;
}

.section-title.pathways {
  color: #bf5af2;
}

.section-subtitle {
  font-size: 0.85rem;
  color: var(--s-text-s);
  margin: 0 0 1rem 0;
}

/* Weekly Schedule Grid Style */
.weekly-schedule {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.schedule-card {
  display: flex;
  gap: 1.1rem;
  padding: 1.3rem;
  border-radius: 14px;
  border: 1px solid var(--s-border);
  background: var(--s-bg-alt);
}

.schedule-day {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--s-accent);
  min-width: 90px;
  border-right: 2px solid var(--s-border);
  padding-right: 10px;
  display: flex;
  align-items: center;
}

.schedule-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.session-type {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--s-text-p);
}

.session-exercises {
  font-size: 0.85rem;
  line-height: 1.4;
  color: var(--s-text-s);
  margin: 0;
}

.session-meta {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--s-text-s);
  margin-top: 0.25rem;
}

/* Progression Setup Box */
.progression-box {
  padding: 1.3rem;
  background: var(--s-bg-card);
  border: 1px solid var(--s-border);
  border-radius: 14px;
}

.progression-box p {
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--s-text-p);
  margin: 0 0 1rem 0;
}

.progression-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.metric-chip {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  background: rgba(52, 199, 89, 0.1);
  color: #34c759;
  border-radius: 100px;
}

/* Pathways Grid Style */
.pathways-grid {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.program-recommendation-card {
  padding: 1.25rem;
  border-radius: 14px;
  border: 1px solid var(--s-border);
  background: var(--s-bg-card);
  transition: transform 0.2s ease;
}

.program-recommendation-card:hover {
  transform: translateY(-2px);
  border-color: #bf5af2;
}

.program-recommendation-card h4 {
  margin: 0 0 0.35rem 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--s-text-p);
}

.program-recommendation-card p {
  margin: 0 0 0.75rem 0;
  font-size: 0.85rem;
  line-height: 1.4;
  color: var(--s-text-s);
}

.program-external-link {
  font-size: 0.8rem;
  font-weight: 700;
  color: #bf5af2;
  text-decoration: none;
}

.program-external-link:hover {
  text-decoration: underline;
}

/* Controls */
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

.btn-primary {
  background: var(--s-accent);
  color: #ffffff;
}

.btn-primary:hover {
  background: var(--s-accent-hover);
}

.btn-secondary {
  background: var(--s-bg-card);
  border-color: var(--s-border);
  color: var(--s-text-p);
}

.btn-secondary:hover {
  background: var(--s-bg-alt);
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

@media (max-width: 640px) {
  .fitness-survey-card {
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

  .schedule-card {
    flex-direction: column;
    gap: 0.5rem;
  }

  .schedule-day {
    border-right: none;
    border-bottom: 2px solid var(--s-border);
    padding-bottom: 5px;
    padding-right: 0;
  }
}
</style>