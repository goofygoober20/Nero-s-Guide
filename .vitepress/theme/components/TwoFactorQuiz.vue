<template>
  <div class="twofactor-quiz">
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
      <h2>Your 2FA App Matches</h2>
      <p class="results-intro">Based on your answers, here are the best authenticator apps for you:</p>

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
        <small>⚠️ Recommendations are based on your preferences. Always use 2FA for your important accounts!</small>
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
      { value: "ios", label: "📱 iOS", description: "iPhone or iPad" },
      { value: "browser", label: "🌐 Browser Extension", description: "Chrome, Firefox, or Edge" }
    ]
  },
  {
    id: 2,
    text: "Do you want cloud backup/sync across devices?",
    multi: false,
    options: [
      { value: "cloud", label: "☁️ Yes, cloud sync/backup", description: "Access your 2FA codes anywhere, automatic backup" },
      { value: "local", label: "💾 No, local-only storage", description: "Keep tokens only on this device" }
    ]
  },
  {
    id: 3,
    text: "What's your preference for open source software?",
    multi: false,
    options: [
      { value: "required", label: "🔓 Required (open source only)", description: "I want the code to be publicly auditable" },
      { value: "preferred", label: "👍 Preferred but not required", description: "I like open source but flexible" },
      { value: "not_important", label: "❌ Not important", description: "I trust closed-source solutions too" }
    ]
  },
  {
    id: 4,
    text: "Do you need Apple Watch support?",
    multi: false,
    options: [
      { value: "yes", label: "⌚ Yes", description: "View 2FA codes on my Apple Watch" },
      { value: "no", label: "❌ No", description: "Not needed" }
    ]
  },
  {
    id: 5,
    text: "Do you want biometric unlock (Face ID / Fingerprint)?",
    multi: false,
    options: [
      { value: "yes", label: "✅ Yes", description: "Quick unlock with biometrics" },
      { value: "no", label: "❌ No", description: "PIN/password is fine" }
    ]
  },
  {
    id: 6,
    text: "Do you need to extract tokens from screenshots or QR codes?",
    multi: false,
    options: [
      { value: "yes", label: "✅ Yes", description: "Extract tokens from existing screenshots or QR codes" },
      { value: "no", label: "❌ No", description: "I'll set up new tokens manually" }
    ]
  },
  {
    id: 7,
    text: "Do you need Steam Guard 2FA codes?",
    multi: false,
    options: [
      { value: "yes", label: "🎮 Yes", description: "Generate Steam 2FA codes" },
      { value: "no", label: "❌ No", description: "Not needed" }
    ]
  }
]

// ============================================
// 2FA APP DATABASE
// ============================================

const twoFactorApps = [
  {
    id: "ente_auth",
    name: "Ente Auth",
    icon: "🔐",
    badge: "Best Overall",
    badgeClass: "best",
    description: "The most feature-complete 2FA app. Open source, cross-platform sync, and encrypted backups.",
    pros: ["Open source", "Cross-platform sync (all devices)", "Encrypted cloud backups", "Beautiful UI", "Desktop apps available"],
    cons: ["Requires account for sync"],
    link: "https://ente.io/auth",
    features: {
      platforms: ["windows", "mac", "linux", "android", "ios"],
      cloudSync: true,
      openSource: "required",
      appleWatch: false,
      biometric: true,
      tokenExtraction: false,
      steamGuard: false
    }
  },
  {
    id: "aegis",
    name: "Aegis",
    icon: "🛡️",
    badge: "Best Android",
    badgeClass: "best",
    description: "The best 2FA app for Android. Open source with encrypted exports and biometric lock.",
    pros: ["Open source", "Encrypted exports", "Biometric unlock", "No account required", "Import from other apps"],
    cons: ["Android only", "Manual backup needed"],
    link: "https://getaegis.app",
    features: {
      platforms: ["android"],
      cloudSync: false,
      openSource: "required",
      appleWatch: false,
      biometric: true,
      tokenExtraction: false,
      steamGuard: false
    }
  },
  {
    id: "2fas",
    name: "2FAS",
    icon: "🔑",
    badge: "Best Cross-Platform",
    badgeClass: "best",
    description: "Great cross-platform 2FA with cloud backup and browser extension.",
    pros: ["Cloud backup", "Browser extension available", "Clean interface", "No account required for basic use"],
    cons: ["Limited desktop options", "Some features require account"],
    link: "https://2fas.com",
    features: {
      platforms: ["android", "ios", "browser"],
      cloudSync: true,
      openSource: "preferred",
      appleWatch: false,
      biometric: true,
      tokenExtraction: false,
      steamGuard: false
    }
  },
  {
    id: "proton_auth",
    name: "Proton Authenticator",
    icon: "🔒",
    badge: "Privacy Focused",
    badgeClass: "privacy",
    description: "From the makers of Proton Mail. End-to-end encrypted and privacy-first.",
    pros: ["End-to-end encrypted", "Cross-platform", "Privacy-focused company", "Integrates with Proton ecosystem"],
    cons: ["Requires Proton account", "Newer app"],
    link: "https://proton.me/blog/proton-authenticator",
    features: {
      platforms: ["windows", "mac", "linux", "android", "ios"],
      cloudSync: true,
      openSource: "preferred",
      appleWatch: false,
      biometric: true,
      tokenExtraction: false,
      steamGuard: false
    }
  },
  {
    id: "stratum",
    name: "Stratum",
    icon: "📱",
    badge: "Best iOS + Watch",
    badgeClass: "best",
    description: "Open source 2FA app for iOS with excellent Apple Watch support.",
    pros: ["Open source", "Apple Watch app", "Clean iOS design", "iCloud sync optional"],
    cons: ["iOS only", "No Windows/Linux/Android"],
    link: "https://stratumauth.com",
    features: {
      platforms: ["ios"],
      cloudSync: true,
      openSource: "required",
      appleWatch: true,
      biometric: true,
      tokenExtraction: false,
      steamGuard: false
    }
  },
  {
    id: "otp_auth",
    name: "OTP Auth",
    icon: "⏰",
    badge: "iOS Power User",
    badgeClass: "",
    description: "Feature-rich iOS 2FA app with iCloud sync and Apple Watch support.",
    pros: ["iCloud sync", "Apple Watch support", "Encrypted backups", "Import from multiple sources"],
    cons: ["iOS only", "Premium features require purchase"],
    link: "https://otpauth.app",
    features: {
      platforms: ["ios"],
      cloudSync: true,
      openSource: "not_important",
      appleWatch: true,
      biometric: true,
      tokenExtraction: false,
      steamGuard: false
    }
  },
  {
    id: "tofu",
    name: "Tofu",
    icon: "🥟",
    badge: "Minimalist iOS",
    badgeClass: "",
    description: "Simple, open source, minimalist 2FA app for iOS.",
    pros: ["Open source", "Free", "Simple and clean", "No account needed"],
    cons: ["iOS only", "No cloud sync", "Basic features only"],
    link: "https://tofu.auth.com",
    features: {
      platforms: ["ios"],
      cloudSync: false,
      openSource: "required",
      appleWatch: false,
      biometric: true,
      tokenExtraction: false,
      steamGuard: false
    }
  },
  {
    id: "freeotp",
    name: "FreeOTPPlus",
    icon: "🔓",
    badge: "Simple Android",
    badgeClass: "",
    description: "Open source fork of Red Hat's FreeOTP for Android.",
    pros: ["Open source", "Free", "No account required", "Simple"],
    cons: ["Android only", "No cloud sync", "Basic interface"],
    link: "https://github.com/helloworld1/FreeOTPPlus",
    features: {
      platforms: ["android"],
      cloudSync: false,
      openSource: "required",
      appleWatch: false,
      biometric: true,
      tokenExtraction: false,
      steamGuard: false
    }
  },
  {
    id: "mauth",
    name: "Mauth",
    icon: "🔏",
    badge: "Simple iOS",
    badgeClass: "",
    description: "Simple and clean 2FA app for iOS.",
    pros: ["Simple interface", "Free", "Easy to use"],
    cons: ["iOS only", "Limited features", "No cloud sync"],
    link: "https://mauth.app",
    features: {
      platforms: ["ios"],
      cloudSync: false,
      openSource: "not_important",
      appleWatch: false,
      biometric: true,
      tokenExtraction: false,
      steamGuard: false
    }
  },
  {
    id: "authme",
    name: "AuthMe",
    icon: "✅",
    badge: "Material Android",
    badgeClass: "",
    description: "Open source Android 2FA app with Material Design.",
    pros: ["Open source", "Material Design", "Biometric unlock", "Free"],
    cons: ["Android only", "Manual backups"],
    link: "https://authme.software",
    features: {
      platforms: ["android"],
      cloudSync: false,
      openSource: "required",
      appleWatch: false,
      biometric: true,
      tokenExtraction: false,
      steamGuard: false
    }
  },
  {
    id: "otpclient",
    name: "OTPClient",
    icon: "💻",
    badge: "Best Linux",
    badgeClass: "best",
    description: "Desktop OTP client for Linux users.",
    pros: ["Native Linux app", "Open source", "Lightweight", "Secure"],
    cons: ["Linux only", "Desktop only (no mobile)"],
    link: "https://github.com/paolostivanin/OTPClient",
    features: {
      platforms: ["linux"],
      cloudSync: false,
      openSource: "required",
      appleWatch: false,
      biometric: false,
      tokenExtraction: false,
      steamGuard: false
    }
  },
  {
    id: "authenticator_ext",
    name: "Authenticator (Browser)",
    icon: "🌐",
    badge: "Best Browser",
    badgeClass: "best",
    description: "TOTP authenticator that works directly in your browser.",
    pros: ["Works in browser", "Convenient for web use", "Free", "Cross-browser"],
    cons: ["Browser only", "Less secure than dedicated apps", "No mobile app"],
    link: "https://github.com/Authenticator-Extension/Authenticator",
    features: {
      platforms: ["browser"],
      cloudSync: false,
      openSource: "required",
      appleWatch: false,
      biometric: false,
      tokenExtraction: false,
      steamGuard: false
    }
  },
  {
    id: "otp_helper",
    name: "OTP Helper",
    icon: "🔍",
    badge: "Extraction Tool",
    badgeClass: "",
    description: "Extract OTP tokens from screenshots or QR codes.",
    pros: ["Extract from screenshots", "Extract from QR codes", "Useful for migration", "Open source"],
    cons: ["Not a full 2FA app", "Tool only"],
    link: "https://github.com/ente-io/OTP-Helper",
    features: {
      platforms: ["windows", "mac", "linux"],
      cloudSync: false,
      openSource: "required",
      appleWatch: false,
      biometric: false,
      tokenExtraction: true,
      steamGuard: false
    }
  },
  {
    id: "steamguard",
    name: "steamguard-cli",
    icon: "🎮",
    badge: "Steam Users",
    badgeClass: "",
    description: "Generate Steam 2FA codes and confirm trades from the command line.",
    pros: ["Steam Guard support", "Confirm trades", "CLI interface", "Open source"],
    cons: ["Steam only", "Command line only", "Technical knowledge required"],
    link: "https://github.com/dyc3/steamguard-cli",
    features: {
      platforms: ["windows", "mac", "linux"],
      cloudSync: false,
      openSource: "required",
      appleWatch: false,
      biometric: false,
      tokenExtraction: false,
      steamGuard: true
    }
  },
  {
    id: "keepassxc",
    name: "KeePassXC",
    icon: "🔑",
    badge: "Password + 2FA",
    badgeClass: "",
    description: "Password manager with built-in TOTP support. Stores 2FA alongside passwords.",
    pros: ["Password manager + 2FA", "Local storage", "Open source", "Cross-platform"],
    cons: ["Manual sync required", "Mobile apps are separate", "Steeper learning curve"],
    link: "https://keepassxc.org",
    features: {
      platforms: ["windows", "mac", "linux"],
      cloudSync: false,
      openSource: "required",
      appleWatch: false,
      biometric: true,
      tokenExtraction: false,
      steamGuard: false
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

// Calculate match percentage for each app
function calculateResults() {
  const userSelections = answers.value
  
  // Get selections
  const selectedPlatforms = userSelections[1] || []
  const selectedCloudSync = userSelections[2] === 'cloud'
  const selectedOpenSource = userSelections[3]
  const selectedAppleWatch = userSelections[4] === 'yes'
  const selectedBiometric = userSelections[5] === 'yes'
  const selectedTokenExtraction = userSelections[6] === 'yes'
  const selectedSteamGuard = userSelections[7] === 'yes'
  
  const results = twoFactorApps.map(app => {
    let matchScore = 0
    let maxScore = 0
    
    // Platform match (weight: 25%)
    let platformMatch = false
    if (app.features.platforms) {
      platformMatch = app.features.platforms.some(p => selectedPlatforms.includes(p))
    }
    if (selectedPlatforms.length > 0) {
      maxScore += 25
      if (platformMatch) matchScore += 25
    }
    
    // Cloud sync match (weight: 20%)
    maxScore += 20
    if (selectedCloudSync && app.features.cloudSync) matchScore += 20
    if (!selectedCloudSync && !app.features.cloudSync) matchScore += 20
    
    // Open source preference (weight: 15%)
    maxScore += 15
    if (selectedOpenSource === 'required' && app.features.openSource === 'required') {
      matchScore += 15
    } else if (selectedOpenSource === 'preferred' && (app.features.openSource === 'required' || app.features.openSource === 'preferred')) {
      matchScore += 15
    } else if (selectedOpenSource === 'not_important') {
      matchScore += 15
    }
    
    // Apple Watch support (weight: 10%)
    if (selectedAppleWatch) {
      maxScore += 10
      if (app.features.appleWatch) matchScore += 10
    } else {
      matchScore += 10
    }
    
    // Biometric unlock (weight: 10%)
    if (selectedBiometric) {
      maxScore += 10
      if (app.features.biometric) matchScore += 10
    } else {
      matchScore += 10
    }
    
    // Token extraction (weight: 10%)
    if (selectedTokenExtraction) {
      maxScore += 10
      if (app.features.tokenExtraction) matchScore += 10
    } else {
      matchScore += 10
    }
    
    // Steam Guard (weight: 10%)
    if (selectedSteamGuard) {
      maxScore += 10
      if (app.features.steamGuard) matchScore += 10
    } else {
      matchScore += 10
    }
    
    const matchPercent = Math.round((matchScore / maxScore) * 100)
    
    return {
      ...app,
      matchPercent
    }
  })
  
  // Sort by match percentage (highest first) and filter out low matches
  rankedResults.value = results
    .filter(r => r.matchPercent > 30)
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, 10) // Show top 10
  
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
  let resultsText = `2FA APP QUIZ RESULTS - ${date}\n`
  resultsText += `========================================\n\n`
  
  resultsText += `Your Answers:\n`
  resultsText += `1. Platforms: ${(answers.value[1] || []).join(', ') || 'Not specified'}\n`
  resultsText += `2. Cloud Sync: ${answers.value[2] === 'cloud' ? 'Yes' : answers.value[2] === 'local' ? 'No (local-only)' : 'Not specified'}\n`
  resultsText += `3. Open Source: ${answers.value[3] === 'required' ? 'Required' : answers.value[3] === 'preferred' ? 'Preferred' : answers.value[3] === 'not_important' ? 'Not important' : 'Not specified'}\n`
  resultsText += `4. Apple Watch: ${answers.value[4] === 'yes' ? 'Yes' : 'No'}\n`
  resultsText += `5. Biometric Unlock: ${answers.value[5] === 'yes' ? 'Yes' : 'No'}\n`
  resultsText += `6. Token Extraction: ${answers.value[6] === 'yes' ? 'Yes' : 'No'}\n`
  resultsText += `7. Steam Guard: ${answers.value[7] === 'yes' ? 'Yes' : 'No'}\n\n`
  
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
  a.download = `2fa-quiz-results-${Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

function copyResults() {
  const topPicks = rankedResults.value.slice(0, 3).map(rec => `${rec.name} (${rec.matchPercent}% match): ${rec.description}`).join('\n\n')
  navigator.clipboard.writeText(`Top 2FA App Picks:\n\n${topPicks}`)
  alert('Top 3 recommendations copied to clipboard!')
}
</script>

<style scoped>
.twofactor-quiz {
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

.rec-pros ul {
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
  .twofactor-quiz {
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