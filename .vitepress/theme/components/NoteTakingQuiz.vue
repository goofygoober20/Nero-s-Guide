<template>
  <div class="note-taking-quiz">
    <!-- Progress Indicator -->
    <div class="progress-container">
      <div class="progress-bar" :style="{ width: progressPercent + '%' }"></div>
      <div class="progress-text">Question {{ currentStep }} of {{ totalSteps }}</div>
    </div>

    <!-- Question Area -->
    <div v-if="!showResults" class="question-area">
      <h2 class="question-title">{{ currentQuestion.text }}</h2>
      
      <div class="options">
        <div v-for="option in currentQuestion.options" :key="option.value" class="option-group">
          <label class="option-label">
            <input 
              :type="currentQuestion.multi ? 'checkbox' : 'radio'"
              :name="'q' + currentStep"
              :value="option.value"
              :checked="isOptionSelected(option.value)"
              @change="toggleOption(option.value, $event.target.checked)"
              class="option-input"
            />
            <span class="option-text">{{ option.label }}</span>
          </label>
          <p v-if="option.description" class="option-desc">{{ option.description }}</p>
        </div>
      </div>

      <div class="nav-buttons">
        <button 
          v-if="currentStep > 1" 
          @click="prevQuestion" 
          class="nav-btn back"
        >
          ← Back
        </button>
        <button 
          v-if="currentStep < totalSteps" 
          @click="nextQuestion" 
          class="nav-btn next"
          :disabled="!hasAnswer"
        >
          Next →
        </button>
        <button 
          v-if="currentStep === totalSteps" 
          @click="calculateResults" 
          class="nav-btn submit"
          :disabled="!hasAnswer"
        >
          See Results 🎯
        </button>
      </div>
    </div>

    <!-- Results Area -->
    <div v-else class="results-area">
      <h2>Your Note-Taking App Matches</h2>
      <p class="results-intro">Based on your answers, here are the best note-taking apps for you:</p>

      <div class="recommendations">
        <div v-for="(rec, index) in rankedResults" :key="rec.name" class="rec-card" :class="{ 'top-match': index === 0 }">
          <div class="rec-rank">{{ index + 1 }}. {{ rec.matchPercent }}% Match</div>
          <div class="rec-header">
            <div class="rec-icon">{{ rec.icon }}</div>
            <div class="rec-title">
              <h3>{{ rec.name }}</h3>
              <span class="rec-badge" :class="rec.badgeClass">{{ rec.badge }}</span>
            </div>
          </div>
          <div class="rec-content">
            <p>{{ rec.description }}</p>
            <div class="rec-pros">
              <strong>✅ Key Features:</strong>
              <ul>
                <li v-for="pro in rec.pros.slice(0,4)" :key="pro">{{ pro }}</li>
              </ul>
            </div>
            <div class="rec-cons" v-if="rec.cons && rec.cons.length">
              <strong>⚠️ Limitations:</strong>
              <ul>
                <li v-for="con in rec.cons.slice(0,2)" :key="con">{{ con }}</li>
              </ul>
            </div>
            <a :href="rec.link" target="_blank" rel="noopener noreferrer" class="rec-link">Learn More →</a>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="exportResults" class="export-btn">📄 Export Results (TXT)</button>
        <button @click="copyResults" class="copy-btn">📋 Copy to Clipboard</button>
        <button @click="resetQuiz" class="reset-btn">⟳ Take Quiz Again</button>
      </div>

      <div class="disclaimer">
        <small>⚠️ Recommendations are based on your preferences. Try a few apps — the best one is the one you actually use.</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// ============================================
// QUESTIONS
// ============================================

const questions = [
  {
    id: 1,
    text: "What devices/platforms do you use? (Select all that apply)",
    multi: true,
    options: [
      { value: "windows", label: "🪟 Windows", description: "Desktop PC or laptop" },
      { value: "mac", label: "🍎 Mac", description: "Apple desktop or laptop" },
      { value: "linux", label: "🐧 Linux", description: "Ubuntu, Fedora, etc." },
      { value: "android", label: "📱 Android", description: "Samsung, Google Pixel, etc." },
      { value: "ios", label: "📱 iOS", description: "iPhone or iPad" }
    ]
  },
  {
    id: 2,
    text: "Where should your notes be stored?",
    multi: false,
    options: [
      { value: "local", label: "💾 Local-only (my device)", description: "Maximum privacy, no sync needed" },
      { value: "cloud", label: "☁️ Cloud sync", description: "Access from any device, automatic backup" },
      { value: "both", label: "🔄 Local + optional cloud", description: "Local first, cloud as backup option" }
    ]
  },
  {
    id: 3,
    text: "Do you need real-time collaboration with others?",
    multi: false,
    options: [
      { value: "yes", label: "👥 Yes, team collaboration", description: "Work together on shared documents in real-time" },
      { value: "sometimes", label: "📤 Occasional sharing", description: "Sometimes share notes, but mostly solo" },
      { value: "no", label: "👤 No, just for me", description: "Personal notes only, no sharing needed" }
    ]
  },
  {
    id: 4,
    text: "How do you prefer to organize your notes?",
    multi: false,
    options: [
      { value: "folders", label: "📁 Folders & hierarchy", description: "Traditional folder structure, nested categories" },
      { value: "tags", label: "🏷️ Tags & labels", description: "Flat structure with tags for cross-referencing" },
      { value: "links", label: "🔗 Links & connections", description: "Notes link to each other like a wiki" },
      { value: "flexible", label: "✨ Flexible / don't care", description: "Mix of methods, whatever works" }
    ]
  },
  {
    id: 5,
    text: "What's your primary use case?",
    multi: false,
    options: [
      { value: "student", label: "📚 Study & school", description: "Lectures, homework, exam prep, research papers" },
      { value: "work", label: "💼 Work & projects", description: "Meeting notes, project docs, task tracking" },
      { value: "personal", label: "🧠 Personal knowledge", description: "Journaling, ideas, reading notes, second brain" },
      { value: "creative", label: "✍️ Writing & creative", description: "Essays, stories, blogs, content creation" }
    ]
  },
  {
    id: 6,
    text: "How important are advanced features?",
    multi: false,
    options: [
      { value: "minimal", label: "🎯 Minimal / simple", description: "Just text, maybe basic formatting" },
      { value: "moderate", label: "⚖️ Moderate", description: "Rich text, images, some organization tools" },
      { value: "power", label: "⚡ Power user", description: "Plugins, automation, custom workflows, APIs" }
    ]
  },
  {
    id: 7,
    text: "What's your budget for note-taking software?",
    multi: false,
    options: [
      { value: "free", label: "🆓 Free only", description: "Don't want to pay anything" },
      { value: "freemium", label: "👍 Free + willing to pay for extras", description: "Free core is fine, paid features are bonus" },
      { value: "paid", label: "💰 Will pay for the best", description: "Quality is worth paying for" }
    ]
  }
]

// ============================================
// APP RECOMMENDATIONS DATABASE
// ============================================

const apps = [
  {
    name: "Obsidian",
    icon: "💎",
    badge: "Free / Local-First",
    badgeClass: "badge-free",
    description: "The power-user choice. Local-first Markdown files with backlinks, graph view, and 2000+ community plugins. Your data stays on your device forever.",
    link: "https://obsidian.md/",
    platforms: ["windows", "mac", "linux", "android", "ios"],
    storage: ["local", "both"],
    collaboration: ["no", "sometimes"],
    organization: ["tags", "links", "folders"],
    useCase: ["student", "work", "personal", "creative"],
    level: ["moderate", "power"],
    budget: ["free", "freemium"],
    pros: ["100% local-first — your data never leaves your device", "2000+ plugins for any workflow", "Backlinks and graph view for connecting ideas", "Active community and extensive documentation"],
    cons: ["Steeper learning curve than simpler apps", "No built-in real-time collaboration", "Mobile apps less feature-rich than desktop"],
    scoreBoost: { power: 15, links: 15, local: 20 }
  },
  {
    name: "Notion",
    icon: "📝",
    badge: "Freemium / Cloud",
    badgeClass: "badge-freemium",
    description: "All-in-one workspace. Docs, databases, kanban boards, wikis — all in one app. Beautiful out of the box, great for team collaboration.",
    link: "https://www.notion.com/",
    platforms: ["windows", "mac", "linux", "android", "ios"],
    storage: ["cloud"],
    collaboration: ["yes", "sometimes"],
    organization: ["folders", "tags", "flexible"],
    useCase: ["student", "work", "creative"],
    level: ["minimal", "moderate", "power"],
    budget: ["free", "freemium", "paid"],
    pros: ["Beautiful, intuitive interface", "Databases + docs in one app", "Real-time collaboration built-in", "Templates for everything"],
    cons: ["Cloud-only — no offline access (limited)", "Data lives on their servers", "Can get slow with large workspaces"],
    scoreBoost: { yes: 20, cloud: 15, work: 15 }
  },
  {
    name: "Apple Notes",
    icon: "🍎",
    badge: "Free / iCloud",
    badgeClass: "badge-free",
    description: "Best if you're all-Apple. Fast, reliable, excellent handwriting with Apple Pencil. iCloud sync just works.",
    link: "https://apps.apple.com/us/app/apple-notes/id1451685025",
    platforms: ["mac", "ios"],
    storage: ["cloud"],
    collaboration: ["sometimes"],
    organization: ["folders"],
    useCase: ["student", "personal", "work"],
    level: ["minimal", "moderate"],
    budget: ["free"],
    pros: ["Fastest capture-to-note experience", "Excellent Apple Pencil support", "iCloud sync is seamless", "No setup required"],
    cons: ["Locked to Apple ecosystem", "No Windows/Android apps", "Limited organization options", "No Markdown support"],
    scoreBoost: { mac: 15, ios: 15, minimal: 15, folders: 10 }
  },
  {
    name: "Google Keep",
    icon: "🟡",
    badge: "Free / Cloud",
    badgeClass: "badge-free",
    description: "Quick capture, zero friction. Sticky-note style with color labels, reminders, and Google integration. Perfect for fleeting notes and lists.",
    link: "https://keep.google.com/",
    platforms: ["windows", "mac", "linux", "android", "ios"],
    storage: ["cloud"],
    collaboration: ["sometimes"],
    organization: ["tags"],
    useCase: ["personal", "work"],
    level: ["minimal"],
    budget: ["free"],
    pros: ["Instant capture from any device", "Color-coded notes and labels", "Reminders and location-based alerts", "Google Docs integration"],
    cons: ["No folders or complex organization", "Limited formatting options", "No Markdown support", "Notes can get messy quickly"],
    scoreBoost: { minimal: 20, cloud: 15, personal: 10 }
  },
  {
    name: "Anytype",
    icon: "🌐",
    badge: "Free / Local-First",
    badgeClass: "badge-free",
    description: "End-to-end encrypted, local-first alternative to Notion. Object-based data model, works offline. Great for privacy-conscious users who want Notion-like features.",
    link: "https://anytype.io/",
    platforms: ["windows", "mac", "linux", "android", "ios"],
    storage: ["local", "both"],
    collaboration: ["sometimes"],
    organization: ["tags", "links", "flexible"],
    useCase: ["student", "work", "personal"],
    level: ["moderate", "power"],
    budget: ["free"],
    pros: ["End-to-end encrypted", "Local-first with P2P sync", "Notion-like features without cloud lock-in", "Open-source"],
    cons: ["Still maturing — some features incomplete", "Smaller community than Obsidian/Notion", "Sync can be finicky"],
    scoreBoost: { local: 15, power: 10, both: 10 }
  },
  {
    name: "Logseq",
    icon: "🌿",
    badge: "Free / Open-Source",
    badgeClass: "badge-free",
    description: "Outlining and knowledge management with bidirectional links. Built on org-mode and Markdown. Great for daily notes and building a personal knowledge graph.",
    link: "https://logseq.com/",
    platforms: ["windows", "mac", "linux", "android", "ios"],
    storage: ["local", "both"],
    collaboration: ["no"],
    organization: ["links", "tags"],
    useCase: ["personal", "student", "work"],
    level: ["moderate", "power"],
    budget: ["free"],
    pros: ["Outliner-first — great for structured thinking", "Daily notes built-in", "Bidirectional links and graph view", "Local-first, open-source"],
    cons: ["Outliner paradigm isn't for everyone", "Less polished than Obsidian", "Smaller plugin ecosystem"],
    scoreBoost: { links: 15, local: 10, personal: 10 }
  },
  {
    name: "Simplenote",
    icon: "✨",
    badge: "Free / Open-Source",
    badgeClass: "badge-free",
    description: "Just text, everywhere. The simplest note-taking app that works across all platforms. Fast, clean, no distractions.",
    link: "https://simplenote.com/",
    platforms: ["windows", "mac", "linux", "android", "ios"],
    storage: ["cloud"],
    collaboration: ["sometimes"],
    organization: ["tags"],
    useCase: ["personal"],
    level: ["minimal"],
    budget: ["free"],
    pros: ["Incredibly fast and simple", "Works everywhere", "Markdown support", "Open-source"],
    cons: ["No images or rich media", "Limited organization", "No offline-only mode"],
    scoreBoost: { minimal: 25, free: 15 }
  }
]

// ============================================
// STATE
// ============================================

const currentStep = ref(1)
const answers = ref({})
const showResults = ref(false)

const totalSteps = computed(() => questions.length)
const progressPercent = computed(() => (currentStep.value / totalSteps.value) * 100)

const currentQuestion = computed(() => questions[currentStep.value - 1])

const hasAnswer = computed(() => {
  const q = currentQuestion.value
  if (q.multi) {
    return answers.value[q.id] && answers.value[q.id].length > 0
  }
  return !!answers.value[q.id]
})

// ============================================
// METHODS
// ============================================

function isOptionSelected(value) {
  const q = currentQuestion.value
  if (q.multi) {
    return answers.value[q.id]?.includes(value) || false
  }
  return answers.value[q.id] === value
}

function toggleOption(value, checked) {
  const q = currentQuestion.value
  if (q.multi) {
    if (!answers.value[q.id]) answers.value[q.id] = []
    if (checked) {
      answers.value[q.id].push(value)
    } else {
      answers.value[q.id] = answers.value[q.id].filter(v => v !== value)
    }
  } else {
    answers.value[q.id] = value
  }
}

function nextQuestion() {
  if (currentStep.value < totalSteps.value) {
    currentStep.value++
  }
}

function prevQuestion() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const rankedResults = computed(() => {
  return apps.map(app => {
    let score = 50 // base score
    
    // Platform match
    const userPlatforms = answers.value[1] || []
    const platformMatch = userPlatforms.filter(p => app.platforms.includes(p)).length
    score += platformMatch * 8
    
    // Storage preference
    const storagePref = answers.value[2]
    if (storagePref && app.storage.includes(storagePref)) score += 15
    if (storagePref === 'both' && app.storage.includes('local')) score += 5
    
    // Collaboration
    const collabPref = answers.value[3]
    if (collabPref && app.collaboration.includes(collabPref)) score += 12
    
    // Organization
    const orgPref = answers.value[4]
    if (orgPref && app.organization.includes(orgPref)) score += 10
    
    // Use case
    const useCase = answers.value[5]
    if (useCase && app.useCase.includes(useCase)) score += 12
    
    // Level
    const level = answers.value[6]
    if (level && app.level.includes(level)) score += 10
    
    // Budget
    const budget = answers.value[7]
    if (budget && app.budget.includes(budget)) score += 10
    
    // Special boosts
    if (app.scoreBoost) {
      if (level === 'power' && app.scoreBoost.power) score += app.scoreBoost.power
      if (orgPref === 'links' && app.scoreBoost.links) score += app.scoreBoost.links
      if (storagePref === 'local' && app.scoreBoost.local) score += app.scoreBoost.local
      if (collabPref === 'yes' && app.scoreBoost.yes) score += app.scoreBoost.yes
      if (level === 'minimal' && app.scoreBoost.minimal) score += app.scoreBoost.minimal
      if (useCase === 'work' && app.scoreBoost.work) score += app.scoreBoost.work
      if (useCase === 'personal' && app.scoreBoost.personal) score += app.scoreBoost.personal
    }
    
    // Clamp to 100
    score = Math.min(100, Math.max(0, score))
    
    return {
      ...app,
      matchPercent: score
    }
  })
  .sort((a, b) => b.matchPercent - a.matchPercent)
  .slice(0, 5)
})

function calculateResults() {
  showResults.value = true
}

function resetQuiz() {
  currentStep.value = 1
  answers.value = {}
  showResults.value = false
}

function getResultsText() {
  let text = "📝 Note-Taking App Quiz Results\n"
  text += "================================\n\n"
  rankedResults.value.forEach((rec, i) => {
    text += `${i + 1}. ${rec.name} — ${rec.matchPercent}% Match\n`
    text += `   ${rec.badge}\n`
    text += `   ${rec.description}\n`
    text += `   Link: ${rec.link}\n\n`
  })
  return text
}

function exportResults() {
  const text = getResultsText()
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'note-taking-quiz-results.txt'
  a.click()
  URL.revokeObjectURL(url)
}

function copyResults() {
  const text = getResultsText()
  navigator.clipboard.writeText(text)
}
</script>

<style scoped>
.note-taking-quiz {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
}

.progress-container {
  position: relative;
  height: 24px;
  background: var(--vp-c-bg);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
  border-radius: 12px;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.question-area {
  min-height: 300px;
}

.question-title {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-1);
}

.options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option-group {
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  transition: border-color 0.2s, background 0.2s;
  cursor: pointer;
}

.option-group:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.option-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.option-input {
  width: 18px;
  height: 18px;
  accent-color: #667eea;
}

.option-text {
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.option-desc {
  margin: 0.5rem 0 0 2rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.nav-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: center;
}

.nav-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-btn.back {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.nav-btn.next, .nav-btn.submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.nav-btn.next:hover:not(:disabled), .nav-btn.submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.results-area {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.results-area h2 {
  text-align: center;
  margin-bottom: 0.5rem;
}

.results-intro {
  text-align: center;
  color: var(--vp-c-text-2);
  margin-bottom: 1.5rem;
}

.recommendations {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rec-card {
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.2s;
}

.rec-card.top-match {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.rec-card.top-match .rec-rank {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.rec-rank {
  display: inline-block;
  background: var(--vp-c-bg-soft);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.rec-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.rec-icon {
  font-size: 2rem;
}

.rec-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rec-title h3 {
  margin: 0;
  font-size: 1.1rem;
}

.rec-badge {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
}

.badge-free {
  background: rgba(39, 174, 96, 0.15);
  color: #27ae60;
}

.badge-freemium {
  background: rgba(243, 156, 18, 0.15);
  color: #f39c12;
}

.rec-content p {
  margin: 0.5rem 0;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.rec-pros, .rec-cons {
  margin: 0.75rem 0;
  font-size: 0.85rem;
}

.rec-pros strong, .rec-cons strong {
  display: block;
  margin-bottom: 0.25rem;
}

.rec-pros ul, .rec-cons ul {
  margin: 0.25rem 0 0 1.5rem;
  padding: 0;
}

.rec-pros li, .rec-cons li {
  margin: 0.25rem 0;
  color: var(--vp-c-text-2);
}

.rec-link {
  display: inline-block;
  margin-top: 0.5rem;
  color: #667eea;
  font-weight: 500;
  text-decoration: none;
}

.rec-link:hover {
  text-decoration: underline;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.action-buttons button {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: all 0.2s;
}

.action-buttons button:hover {
  background: var(--vp-c-bg-soft);
  border-color: #667eea;
}

.disclaimer {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-3);
}
</style>
