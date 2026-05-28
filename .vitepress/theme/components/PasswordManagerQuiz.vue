<template>
  <div class="password-quiz">
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
      <h2>Your Password Manager Matches</h2>
      <p class="results-intro">Based on your answers, here are the best password managers for you:</p>

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
              <strong>✅ Pros:</strong>
              <ul>
                <li v-for="pro in rec.pros.slice(0,3)" :key="pro">{{ pro }}</li>
              </ul>
            </div>
            <div class="rec-cons" v-if="rec.cons && rec.cons.length">
              <strong>⚠️ Cons:</strong>
              <ul>
                <li v-for="con in rec.cons.slice(0,2)" :key="con">{{ con }}</li>
              </ul>
            </div>
            <a :href="rec.link" target="_blank" class="rec-link">Learn More →</a>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="exportResults" class="export-btn">📄 Export Results (TXT)</button>
        <button @click="copyResults" class="copy-btn">📋 Copy to Clipboard</button>
        <button @click="resetQuiz" class="reset-btn">⟳ Take Quiz Again</button>
      </div>

      <div class="disclaimer">
        <small>⚠️ Recommendations are based on your preferences. Always research before choosing a password manager for your security needs.</small>
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
    text: "What's your budget preference?",
    multi: false,
    options: [
      { value: "free", label: "💰 Free only", description: "I don't want to pay anything" },
      { value: "budget", label: "💵 Willing to pay a little ($10-20/year)", description: "Affordable premium features" },
      { value: "premium", label: "💎 Willing to pay for premium ($30-40/year)", description: "Best features and support" }
    ]
  },
  {
    id: 3,
    text: "Do you want cloud sync across all your devices?",
    multi: false,
    options: [
      { value: "cloud", label: "☁️ Yes, automatic cloud sync", description: "Access passwords anywhere, anytime" },
      { value: "local", label: "💾 No, I prefer local-only storage", description: "I want full control over my data" }
    ]
  },
  {
    id: 4,
    text: "Do you want built-in two-factor authentication (2FA/TOTP)?",
    multi: false,
    options: [
      { value: "yes", label: "✅ Yes", description: "Generate 2FA codes within the password manager" },
      { value: "no", label: "❌ No", description: "I use a separate 2FA app like Ente Auth or Aegis" }
    ]
  },
  {
    id: 5,
    text: "Do you need browser extensions for autofill?",
    multi: false,
    options: [
      { value: "yes", label: "✅ Yes", description: "I want autofill in Chrome/Firefox/Edge" },
      { value: "no", label: "❌ No", description: "I'm fine with copy-paste or desktop app only" }
    ]
  },
  {
    id: 6,
    text: "Is open source important to you?",
    multi: false,
    options: [
      { value: "yes", label: "✅ Yes", description: "I want the code to be publicly auditable" },
      { value: "no", label: "❌ No", description: "I trust closed-source solutions" }
    ]
  },
  {
    id: 7,
    text: "Do you want to self-host your password manager?",
    multi: false,
    options: [
      { value: "yes", label: "🖥️ Yes", description: "I want full control and to run my own server" },
      { value: "no", label: "☁️ No", description: "I prefer a managed, hosted solution" }
    ]
  }
]

// ============================================
// PASSWORD MANAGER DATABASE
// ============================================

const passwordManagers = [
  {
    id: "bitwarden",
    name: "Bitwarden",
    icon: "🔐",
    badge: "Best Overall",
    badgeClass: "best",
    description: "The most balanced password manager. Free tier includes unlimited devices, open source, and excellent security.",
    pros: ["Free tier with unlimited devices", "Open source and audited", "Great browser extensions", "Self-host option available"],
    cons: ["Premium features require subscription ($10/year)"],
    link: "https://bitwarden.com",
    features: {
      platforms: ["windows", "mac", "linux", "android", "ios"],
      budget: ["free", "budget"],
      cloudSync: ["cloud"],
      twoFA: true,
      browserExt: true,
      openSource: true,
      selfHost: true
    }
  },
  {
    id: "protonpass",
    name: "Proton Pass",
    icon: "🔒",
    badge: "Privacy Focused",
    badgeClass: "privacy",
    description: "From the makers of Proton Mail. Built with privacy-first principles and end-to-end encryption.",
    pros: ["Privacy-focused company", "Built-in email aliasing (SimpleLogin)", "End-to-end encrypted", "Free tier available"],
    cons: ["Newer than competitors", "Premium features require subscription"],
    link: "https://proton.me/pass",
    features: {
      platforms: ["windows", "mac", "linux", "android", "ios"],
      budget: ["free", "budget"],
      cloudSync: ["cloud"],
      twoFA: true,
      browserExt: true,
      openSource: true,
      selfHost: false
    }
  },
  {
    id: "keepassxc",
    name: "KeePassXC",
    icon: "🔑",
    badge: "Best Local-Only",
    badgeClass: "best",
    description: "Powerful, open-source, local-only password manager. You control your own database file.",
    pros: ["Completely free", "Local storage only (no cloud)", "Highly secure", "Cross-platform desktop app"],
    cons: ["No official mobile apps (3rd party only)", "Manual syncing required", "Steeper learning curve"],
    link: "https://keepassxc.org",
    features: {
      platforms: ["windows", "mac", "linux"],
      budget: ["free"],
      cloudSync: ["local"],
      twoFA: true,
      browserExt: true,
      openSource: true,
      selfHost: false
    }
  },
  {
    id: "keepass",
    name: "KeePass",
    icon: "🗝️",
    badge: "Classic",
    badgeClass: "",
    description: "The original open-source password manager. Highly customizable with many plugins.",
    pros: ["Completely free", "Huge plugin ecosystem", "Local database control", "Proven track record"],
    cons: ["Windows-focused UI", "No official mobile apps", "Requires manual syncing"],
    link: "https://keepass.info",
    features: {
      platforms: ["windows"],
      budget: ["free"],
      cloudSync: ["local"],
      twoFA: true,
      browserExt: true,
      openSource: true,
      selfHost: false
    }
  },
  {
    id: "keepassdx",
    name: "KeePassDX",
    icon: "📱",
    badge: "Best Android Client",
    badgeClass: "best",
    description: "The best Android client for KeePass databases. Open source and feature-rich.",
    pros: ["Excellent Android experience", "Works with KeePass databases", "Free and open source", "Biometric unlock"],
    cons: ["Android only", "Manual sync setup required", "Limited desktop integration"],
    link: "https://www.keepassdx.com",
    features: {
      platforms: ["android"],
      budget: ["free"],
      cloudSync: ["local"],
      twoFA: true,
      browserExt: false,
      openSource: true,
      selfHost: false
    }
  },
  {
    id: "keepassium",
    name: "KeePassium",
    icon: "🍎",
    badge: "Best iOS Client",
    badgeClass: "best",
    description: "The best iOS client for KeePass databases. Privacy-focused and well-designed.",
    pros: ["Excellent iOS experience", "Works with KeePass databases", "Face ID / Touch ID support", "AutoFill integration"],
    cons: ["iOS only", "Manual sync setup", "Premium features require one-time purchase"],
    link: "https://keepassium.com",
    features: {
      platforms: ["ios"],
      budget: ["free", "budget"],
      cloudSync: ["local"],
      twoFA: true,
      browserExt: false,
      openSource: true,
      selfHost: false
    }
  },
  {
    id: "authpass",
    name: "AuthPass",
    icon: "🔓",
    badge: "Cross-Platform KeePass",
    badgeClass: "",
    description: "A cross-platform KeePass-compatible password manager with cloud sync options.",
    pros: ["Works on all platforms", "KeePass database compatible", "Free and open source", "Cloud sync ready"],
    cons: ["Less polish than Bitwarden", "Smaller community"],
    link: "https://authpass.app",
    features: {
      platforms: ["windows", "mac", "linux", "android", "ios"],
      budget: ["free"],
      cloudSync: ["cloud", "local"],
      twoFA: true,
      browserExt: false,
      openSource: true,
      selfHost: false
    }
  },
  {
    id: "vaultwarden",
    name: "VaultWarden",
    icon: "🏠",
    badge: "Best Self-Hosted",
    badgeClass: "best",
    description: "A lightweight self-hosted Bitwarden server. Full control over your data.",
    pros: ["Complete self-hosted solution", "Bitwarden compatible clients", "Lightweight resource usage", "Free and open source"],
    cons: ["Requires technical knowledge", "Hosting costs", "Self-maintenance required"],
    link: "https://github.com/dani-garcia/vaultwarden",
    features: {
      platforms: ["windows", "mac", "linux", "android", "ios"],
      budget: ["free"],
      cloudSync: ["cloud"],
      twoFA: true,
      browserExt: true,
      openSource: true,
      selfHost: true
    }
  },
  {
    id: "lesspass",
    name: "LessPass",
    icon: "🔄",
    badge: "Stateless",
    badgeClass: "",
    description: "Stateless password manager. Generates passwords from a master password and website URL.",
    pros: ["No storage required", "Works anywhere", "Free and open source", "No sync needed"],
    cons: ["No password storage (just generation)", "Can't store notes or 2FA", "Requires remembering site-specific settings"],
    link: "https://lesspass.com",
    features: {
      platforms: ["windows", "mac", "linux", "android", "ios"],
      budget: ["free"],
      cloudSync: ["cloud"],
      twoFA: false,
      browserExt: true,
      openSource: true,
      selfHost: true
    }
  },
  {
    id: "keepweb",
    name: "KeeWeb",
    icon: "🌐",
    badge: "Web-Based KeePass",
    badgeClass: "",
    description: "Web-based desktop client for KeePass databases. Works offline too.",
    pros: ["Modern web interface", "Works with KeePass databases", "Free and open source", "Cross-platform"],
    cons: ["No mobile app", "Less feature-rich than KeePassXC"],
    link: "https://keeweb.info",
    features: {
      platforms: ["windows", "mac", "linux"],
      budget: ["free"],
      cloudSync: ["local"],
      twoFA: false,
      browserExt: false,
      openSource: true,
      selfHost: true
    }
  },
  {
    id: "strongbox",
    name: "Strongbox",
    icon: "📦",
    badge: "iOS Power User",
    badgeClass: "",
    description: "Professional KeePass client for iOS with advanced features.",
    pros: ["Best-in-class iOS experience", "KeePass database compatible", "Advanced security features", "Excellent support"],
    cons: ["iOS only", "Premium version is paid", "No desktop app"],
    link: "https://strongboxsafe.com",
    features: {
      platforms: ["ios"],
      budget: ["budget", "premium"],
      cloudSync: ["local", "cloud"],
      twoFA: true,
      browserExt: false,
      openSource: false,
      selfHost: false
    }
  },
  {
    id: "seahorse",
    name: "Seahorse",
    icon: "🐚",
    badge: "Linux Native",
    badgeClass: "",
    description: "GNOME desktop's built-in password manager. Integrates with the Linux keyring.",
    pros: ["Built into GNOME", "Free", "Integrates with Linux desktop", "Simple to use"],
    cons: ["Linux only", "Limited features", "No mobile or Windows support"],
    link: "https://wiki.gnome.org/Apps/Seahorse",
    features: {
      platforms: ["linux"],
      budget: ["free"],
      cloudSync: ["local"],
      twoFA: false,
      browserExt: false,
      openSource: true,
      selfHost: false
    }
  },
  {
    id: "gopass",
    name: "gopass",
    icon: "⌨️",
    badge: "CLI Power User",
    badgeClass: "",
    description: "Command-line password manager for developers and advanced users.",
    pros: ["Full CLI control", "Git integration", "Team support", "Highly scriptable"],
    cons: ["Command line only", "Steep learning curve", "No GUI by default"],
    link: "https://www.gopass.pw",
    features: {
      platforms: ["windows", "mac", "linux"],
      budget: ["free"],
      cloudSync: ["cloud", "local"],
      twoFA: true,
      browserExt: false,
      openSource: true,
      selfHost: true
    }
  },
  {
    id: "keypass",
    name: "Keypass",
    icon: "🔑",
    badge: "Simple",
    badgeClass: "",
    description: "Simple, lightweight password manager for basic needs.",
    pros: ["Very simple to use", "Free", "Minimal resource usage"],
    cons: ["Limited features", "Smaller user base", "Less frequent updates"],
    link: "https://keypass.xyz",
    features: {
      platforms: ["windows", "android", "ios"],
      budget: ["free"],
      cloudSync: ["local"],
      twoFA: false,
      browserExt: false,
      openSource: true,
      selfHost: false
    }
  }
]

// ============================================
// QUIZ STATE
// ============================================

const currentStep = ref(1)
const answers = ref({
  1: [] // Initialize question 1 as empty array for multi-select
})
const showResults = ref(false)
const rankedResults = ref([])

const totalSteps = computed(() => questions.length)
const progressPercent = computed(() => (currentStep.value / totalSteps.value) * 100)

const currentQuestion = computed(() => {
  return questions.find(q => q.id === currentStep.value)
})

// Check if an option is selected
function isOptionSelected(optionValue) {
  const currentAnswers = answers.value[currentStep.value]
  if (!currentAnswers) return false
  if (Array.isArray(currentAnswers)) {
    return currentAnswers.includes(optionValue)
  }
  return currentAnswers === optionValue
}

// Toggle option for multi-select questions
function toggleOption(optionValue, isChecked) {
  const currentAnswers = answers.value[currentStep.value]
  
  if (currentQuestion.value.multi) {
    // Multi-select (checkboxes)
    let newAnswers = Array.isArray(currentAnswers) ? [...currentAnswers] : []
    if (isChecked) {
      if (!newAnswers.includes(optionValue)) {
        newAnswers.push(optionValue)
      }
    } else {
      newAnswers = newAnswers.filter(v => v !== optionValue)
    }
    answers.value[currentStep.value] = newAnswers
  } else {
    // Single select (radio)
    answers.value[currentStep.value] = optionValue
  }
}

const hasAnswer = computed(() => {
  const answer = answers.value[currentStep.value]
  if (!answer) return false
  if (Array.isArray(answer)) return answer.length > 0
  return true
})

function nextQuestion() {
  if (currentStep.value < totalSteps.value && hasAnswer.value) {
    currentStep.value++
  }
}

function prevQuestion() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// Calculate match percentage for each manager
function calculateResults() {
  const userSelections = answers.value
  
  // Get selected platforms from question 1
  const selectedPlatforms = userSelections[1] || []
  const selectedBudget = userSelections[2]
  const selectedCloudSync = userSelections[3]
  const selectedTwoFA = userSelections[4] === 'yes'
  const selectedBrowserExt = userSelections[5] === 'yes'
  const selectedOpenSource = userSelections[6] === 'yes'
  const selectedSelfHost = userSelections[7] === 'yes'
  
  const results = passwordManagers.map(manager => {
    let matchScore = 0
    let maxScore = 0
    
    // Platform match (weight: 25%)
    const platformMatch = manager.features.platforms.some(p => selectedPlatforms.includes(p))
    if (selectedPlatforms.length > 0) {
      maxScore += 25
      if (platformMatch) matchScore += 25
    }
    
    // Budget match (weight: 15%)
    if (selectedBudget) {
      maxScore += 15
      if (manager.features.budget.includes(selectedBudget)) matchScore += 15
      else if (selectedBudget === 'free' && manager.features.budget.includes('free')) matchScore += 15
      else if (selectedBudget === 'budget' && manager.features.budget.includes('budget')) matchScore += 15
    }
    
    // Cloud sync match (weight: 15%)
    if (selectedCloudSync) {
      maxScore += 15
      if (manager.features.cloudSync.includes(selectedCloudSync)) matchScore += 15
    }
    
    // 2FA support (weight: 10%)
    maxScore += 10
    if (selectedTwoFA && manager.features.twoFA) matchScore += 10
    if (!selectedTwoFA) matchScore += 10  // Not needing 2FA doesn't penalize
    
    // Browser extension (weight: 10%)
    maxScore += 10
    if (selectedBrowserExt && manager.features.browserExt) matchScore += 10
    if (!selectedBrowserExt) matchScore += 10
    
    // Open source (weight: 15%)
    maxScore += 15
    if (selectedOpenSource && manager.features.openSource) matchScore += 15
    if (!selectedOpenSource) matchScore += 15
    
    // Self-host (weight: 10%)
    maxScore += 10
    if (selectedSelfHost && manager.features.selfHost) matchScore += 10
    if (!selectedSelfHost) matchScore += 10
    
    const matchPercent = Math.round((matchScore / maxScore) * 100)
    
    return {
      ...manager,
      matchPercent
    }
  })
  
  // Sort by match percentage (highest first) and filter out 0% matches
  rankedResults.value = results
    .filter(r => r.matchPercent > 0)
    .sort((a, b) => b.matchPercent - a.matchPercent)
  
  showResults.value = true
}

function resetQuiz() {
  currentStep.value = 1
  answers.value = {
    1: [] // Reset question 1 to empty array
  }
  showResults.value = false
  rankedResults.value = []
}

function exportResults() {
  const date = new Date().toLocaleDateString()
  let resultsText = `PASSWORD MANAGER QUIZ RESULTS - ${date}\n`
  resultsText += `========================================\n\n`
  
  resultsText += `Your Answers:\n`
  resultsText += `1. Platforms: ${(answers.value[1] || []).join(', ') || 'Not specified'}\n`
  resultsText += `2. Budget: ${answers.value[2] || 'Not specified'}\n`
  resultsText += `3. Cloud Sync: ${answers.value[3] === 'cloud' ? 'Yes' : answers.value[3] === 'local' ? 'No (local-only)' : 'Not specified'}\n`
  resultsText += `4. Built-in 2FA: ${answers.value[4] === 'yes' ? 'Yes' : answers.value[4] === 'no' ? 'No' : 'Not specified'}\n`
  resultsText += `5. Browser Extensions: ${answers.value[5] === 'yes' ? 'Yes' : answers.value[5] === 'no' ? 'No' : 'Not specified'}\n`
  resultsText += `6. Open Source: ${answers.value[6] === 'yes' ? 'Important' : answers.value[6] === 'no' ? 'Not important' : 'Not specified'}\n`
  resultsText += `7. Self-Host: ${answers.value[7] === 'yes' ? 'Yes' : answers.value[7] === 'no' ? 'No' : 'Not specified'}\n\n`
  
  resultsText += `Recommendations (by match percentage):\n`
  resultsText += `========================================\n`
  rankedResults.value.forEach((rec, idx) => {
    resultsText += `${idx + 1}. ${rec.name} - ${rec.matchPercent}% Match\n`
    resultsText += `   ${rec.description}\n`
    resultsText += `   Learn more: ${rec.link}\n\n`
  })
  
  const blob = new Blob([resultsText], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `password-manager-quiz-${Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

function copyResults() {
  const topPicks = rankedResults.value.slice(0, 3).map(rec => `${rec.name} (${rec.matchPercent}% match): ${rec.description}`).join('\n\n')
  navigator.clipboard.writeText(`Top Password Manager Picks:\n\n${topPicks}`)
  alert('Top 3 recommendations copied to clipboard!')
}
</script>

<style scoped>
.password-quiz {
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 24px;
  border: 1px solid var(--vp-c-divider);
}

/* Progress Bar */
.progress-container {
  margin-bottom: 2rem;
}

.progress-bar {
  height: 6px;
  background: var(--vp-c-brand-1);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: right;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  margin-top: 0.5rem;
}

/* Question Area */
.question-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.option-group {
  padding: 0.75rem;
  background: var(--vp-c-bg);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

.option-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
}

.option-input {
  margin-top: 0.2rem;
}

.option-text {
  font-weight: 500;
}

.option-desc {
  margin: 0.5rem 0 0 1.6rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

/* Navigation Buttons */
.nav-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.nav-btn {
  padding: 0.6rem 1.2rem;
  border-radius: 40px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.nav-btn.back {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
}

.nav-btn.next, .nav-btn.submit {
  background: var(--vp-c-brand-1);
  color: white;
  margin-left: auto;
}

.nav-btn.next:hover, .nav-btn.submit:hover {
  transform: translateX(3px);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Results Area */
.results-area h2 {
  text-align: center;
  margin-bottom: 0.5rem;
}

.results-intro {
  text-align: center;
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}

.recommendations {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.rec-card {
  padding: 1rem;
  background: var(--vp-c-bg);
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
}

.rec-card.top-match {
  border: 2px solid var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.rec-rank {
  font-size: 0.7rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}

.rec-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.rec-icon {
  font-size: 2rem;
}

.rec-title h3 {
  margin: 0;
  font-size: 1.1rem;
}

.rec-badge {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
  background: var(--vp-c-bg-soft);
}

.rec-badge.best {
  background: #2ecc71;
  color: white;
}

.rec-badge.privacy {
  background: #5865f2;
  color: white;
}

.rec-content p {
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.rec-pros, .rec-cons {
  font-size: 0.8rem;
  margin-bottom: 0.75rem;
}

.rec-pros ul, .rec-cons ul {
  margin: 0.25rem 0 0 1.2rem;
}

.rec-link {
  display: inline-block;
  margin-top: 0.5rem;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-size: 0.8rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.export-btn, .copy-btn, .reset-btn {
  padding: 0.6rem 1.2rem;
  border-radius: 40px;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.export-btn {
  background: #2ecc71;
  color: white;
}

.copy-btn {
  background: var(--vp-c-brand-1);
  color: white;
}

.reset-btn {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
}

.disclaimer {
  text-align: center;
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

@media (max-width: 640px) {
  .password-quiz {
    padding: 1rem;
    margin: 1rem;
  }
  
  .question-title {
    font-size: 1.2rem;
  }
  
  .rec-header {
    flex-direction: column;
    text-align: center;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>