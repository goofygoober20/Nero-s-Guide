<template>
  <div class="privacy-threat-model-quiz">
    <!-- Progress Indicator -->
    <div class="progress-container">
      <div class="progress-bar" :style="{ width: progressPercent + '%' }"></div>
      <div class="progress-text">Question {{ currentStep }} of {{ totalSteps }}</div>
    </div>

    <!-- Threat Model Info Box (shown at start) -->
    <div v-if="currentStep === 1 && !showResults && !started" class="intro-box">
      <h2>🛡️ Build Your Threat Model</h2>
      <p>Privacy isn't one-size-fits-all. This quiz helps you identify <strong>who you're protecting against</strong> and <strong>what you're protecting</strong>, then recommends the right tools for your situation.</p>
      <p class="intro-note">There are no wrong answers — just honest ones. Answer based on your real situation, not what you think you "should" do.</p>
      <button @click="started = true" class="start-btn">Start Quiz →</button>
    </div>

    <!-- Question Area -->
    <div v-if="started && !showResults" class="question-area">
      <div class="question-header">
        <span class="question-category">{{ currentQuestion.category }}</span>
        <h2 class="question-title">{{ currentQuestion.text }}</h2>
        <p v-if="currentQuestion.context" class="question-context">{{ currentQuestion.context }}</p>
      </div>
      
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
          <div v-if="option.impact" class="option-impact">
            <span class="impact-badge" :class="option.impact.level">{{ option.impact.text }}</span>
          </div>
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
          See My Privacy Plan 🎯
        </button>
      </div>
    </div>

    <!-- Results Area -->
    <div v-else-if="showResults" class="results-area">
      <div class="results-header">
        <h2>Your Privacy Profile</h2>
        <div class="threat-model-badge" :class="profile.badgeClass">
          {{ profile.label }}
        </div>
        <p class="profile-description">{{ profile.description }}</p>
      </div>

      <div class="recommendations">
        <h3>Recommended Tools & Actions</h3>
        <div class="tool-categories">
          <div v-for="(tools, category) in categorizedTools" :key="category" class="tool-category">
            <h4>{{ category }}</h4>
            <div class="tool-list">
              <div v-for="tool in tools" :key="tool.name" class="tool-card" :class="{ 'priority-high': tool.priority === 'high', 'priority-medium': tool.priority === 'medium' }">
                <div class="tool-header">
                  <span class="tool-name">{{ tool.icon }} {{ tool.name }}</span>
                  <span class="priority-badge" :class="tool.priority">{{ tool.priority }}</span>
                </div>
                <p class="tool-desc">{{ tool.description }}</p>
                <a v-if="tool.link" :href="tool.link" target="_blank" rel="noopener noreferrer" class="tool-link">Learn More →</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="action-checklist">
        <h3>Your Action Checklist</h3>
        <div class="checklist">
          <label v-for="action in profile.actions" :key="action.id" class="checklist-item">
            <input type="checkbox" v-model="completedActions[action.id]" @change="saveActions" />
            <span class="checkmark"></span>
            <span class="action-text">{{ action.text }}</span>
            <span v-if="action.effort" class="effort-badge">{{ action.effort }}</span>
          </label>
        </div>
        <div class="progress-summary">
          {{ completedCount }} / {{ profile.actions.length }} actions completed
        </div>
      </div>

      <div class="action-buttons">
        <button @click="exportResults" class="export-btn">📄 Export Plan (TXT)</button>
        <button @click="copyResults" class="copy-btn">📋 Copy to Clipboard</button>
        <button @click="resetQuiz" class="reset-btn">⟳ Retake Quiz</button>
      </div>

      <div class="disclaimer">
        <small>⚠️ This is a starting point. Privacy is a process, not a product. Re-evaluate as your situation changes.</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// ============================================
// QUESTIONS
// ============================================

const questions = [
  {
    id: 1,
    category: "🎯 Assets",
    text: "What are you primarily trying to protect?",
    multi: true,
    context: "Select all that apply. This determines what data needs the strongest protection.",
    options: [
      { value: "communications", label: "💬 Private Communications", description: "Messages, emails, calls with friends/family/colleagues", impact: { level: "high", text: "High sensitivity" } },
      { value: "financial", label: "💰 Financial Data", description: "Banking, crypto, purchases, tax documents", impact: { level: "high", text: "High sensitivity" } },
      { value: "location", label: "📍 Location & Movement", description: "Where you live, work, travel, daily routes", impact: { level: "high", text: "High sensitivity" } },
      { value: "identity", label: "🆔 Real Identity", description: "Legal name, government ID, biometrics, SSN", impact: { level: "critical", text: "Critical sensitivity" } },
      { value: "browsing", label: "🌐 Browsing History", description: "Sites visited, searches, interests, habits", impact: { level: "medium", text: "Medium sensitivity" } },
      { value: "files", label: "📁 Personal Files", description: "Photos, documents, backups, creative work", impact: { level: "medium", text: "Medium sensitivity" } },
      { value: "accounts", label: "🔐 Account Access", description: "Passwords, 2FA codes, recovery keys", impact: { level: "critical", text: "Critical sensitivity" } }
    ]
  },
  {
    id: 2,
    category: "👤 Adversaries",
    text: "Who are you most concerned about?",
    multi: true,
    context: "Different adversaries require completely different defenses. Be realistic.",
    options: [
      { value: "advertisers", label: "📊 Advertisers & Data Brokers", description: "Google, Meta, data brokers building profiles for ads", impact: { level: "low", text: "Mass surveillance" } },
      { value: "isp", label: "🌐 ISP & Network Admin", description: "Your internet provider, workplace/school WiFi, public hotspots", impact: { level: "low", text: "Network visibility" } },
      { value: "platforms", label: "🏢 Platforms & Services", description: "Apple, Microsoft, apps you use — data they collect", impact: { level: "medium", text: "Service-level access" } },
      { value: "individuals", label: "👤 Specific Individuals", description: "Stalker, abusive partner, harasser, doxxer", impact: { level: "high", text: "Targeted threat" } },
      { value: "employer", label: "💼 Employer/Client", description: "Work monitoring, BYOD policies, corporate spyware", impact: { level: "medium", text: "Organizational access" } },
      { value: "law_enforcement", label: "⚖️ Law Enforcement (Legal)", description: "Subpoenas, warrants, legal requests in your jurisdiction", impact: { level: "high", text: "Legal compulsion" } },
      { value: "state_actors", label: "🏛️ Nation-State Actors", description: "Intelligence agencies, advanced persistent threats", impact: { level: "critical", text: "Advanced threat" } }
    ]
  },
  {
    id: 3,
    category: "⚡ Capability",
    text: "How much resources can your adversary spend?",
    multi: false,
    context: "This determines whether you need basic hygiene or advanced OPSEC.",
    options: [
      { value: "automated", label: "🤖 Automated/Mass Collection", description: "Scripted scraping, bulk data purchases, passive monitoring", impact: { level: "low", text: "Low effort" } },
      { value: "targeted_low", label: "🎯 Targeted - Low Resources", description: "Individual with basic tech skills, social engineering", impact: { level: "medium", text: "Moderate effort" } },
      { value: "targeted_high", label: "🎯 Targeted - High Resources", description: "Private investigators, corporate security, skilled hackers", impact: { level: "high", text: "High effort" } },
      { value: "state_level", label: "🏛️ State-Level Resources", description: "Zero-days, legal compulsion, hardware interdiction", impact: { level: "critical", text: "Extreme effort" } }
    ]
  },
  {
    id: 4,
    category: "🛠️ Effort Budget",
    text: "How much ongoing effort are you willing to invest?",
    multi: false,
    context: "Perfect privacy requires perfect OPSEC forever. Be honest about what you'll actually maintain.",
    options: [
      { value: "minimal", label: "🟢 Minimal (Set & Forget)", description: "Install once, use defaults, < 5 min/week maintenance", impact: { level: "low", text: "Low friction" } },
      { value: "moderate", label: "🟡 Moderate (Weekly Habits)", description: "Regular updates, compartmentalization, 15-30 min/week", impact: { level: "medium", text: "Moderate friction" } },
      { value: "significant", label: "🟠 Significant (Daily Practice)", description: "Multiple profiles, hardware keys, compartmentalized devices, 1+ hr/week", impact: { level: "high", text: "High friction" } },
      { value: "maximum", label: "🔴 Maximum (Lifestyle)", description: "Air-gapped systems, hardware procured anonymously, OPSEC as daily mindset", impact: { level: "critical", text: "Lifestyle change" } }
    ]
  },
  {
    id: 5,
    category: "📱 Ecosystem",
    text: "What's your primary device ecosystem?",
    multi: true,
    context: "Your hardware limits what's possible. Work with what you have.",
    options: [
      { value: "windows", label: "🪟 Windows", description: "Most compatible, most telemetry, hardest to harden" },
      { value: "macos", label: "🍎 macOS", description: "Good baseline privacy, some hardening possible, Apple ecosystem lock-in" },
      { value: "linux", label: "🐧 Linux (Desktop)", description: "Maximum control, no telemetry, learning curve, hardware compatibility varies" },
      { value: "android_stock", label: "📱 Stock Android (Pixel/Samsung)", description: "Google/Apple telemetry, Play Services, limited hardening" },
      { value: "android_custom", label: "📱 De-Googled Android (GrapheneOS/CalyxOS)", description: "No Google services, hardened, Pixel hardware only" },
      { value: "ios", label: "📱 iOS/iPadOS", description: "Best consumer privacy baseline, Lockdown Mode, closed ecosystem" }
    ]
  },
  {
    id: 6,
    category: "🔧 Technical Comfort",
    text: "How comfortable are you with technical setup?",
    multi: false,
    options: [
      { value: "non_technical", label: "👶 Non-Technical", description: "Prefer GUI tools, avoid terminal, want simple instructions" },
      { value: "basic", label: "📖 Basic", description: "Can follow step-by-step guides, install apps, change settings" },
      { value: "intermediate", label: "⚙️ Intermediate", description: "Comfortable with terminal, Docker, config files, basic networking" },
      { value: "advanced", label: "🧙 Advanced", description: "Can compile, self-host, manage keys, audit configs, write scripts" }
    ]
  },
  {
    id: 7,
    category: "🚨 Risk Tolerance",
    text: "What happens if your privacy fails?",
    multi: false,
    context: "Consequences determine how much margin of safety you need.",
    options: [
      { value: "annoyance", label: "😐 Annoyance", description: "More spam, targeted ads, creepy recommendations" },
      { value: "embarrassment", label: "😳 Embarrassment", description: "Private info exposed to friends/family/colleagues" },
      { value: "financial", label: "💸 Financial Loss", description: "Identity theft, drained accounts, fraud, lost crypto" },
      { value: "safety", label: "🚨 Physical Safety", description: "Stalking, harassment, doxxing, swatting, domestic abuse" },
      { value: "legal", label: "⚖️ Legal/Professional Ruin", description: "Job loss, license revocation, criminal exposure, asylum risk" },
      { value: "life", label: "☠️ Life or Liberty", description: "Political persecution, whistleblowing, journalist in hostile regime" }
    ]
  },
  {
    id: 8,
    category: "🌍 Jurisdiction",
    text: "Where are you legally located? (Affects legal compulsion risk)",
    multi: false,
    options: [
      { value: "five_eyes", label: "🇺🇸🇬🇧🇨🇦🇦🇺🇳🇿 Five Eyes", description: "US, UK, Canada, Australia, NZ — extensive surveillance sharing" },
      { value: "nine_eyes", label: "🇩🇰🇫🇷🇳🇱🇧🇪 Nine Eyes", description: "Five Eyes + Denmark, France, Netherlands, Norway — close partners" },
      { value: "fourteen_eyes", label: "🇩🇪🇮🇹🇪🇸🇸🇪 Fourteen Eyes", description: "Nine Eyes + Germany, Italy, Spain, Sweden, Belgium — broader sharing" },
      { value: "eu_gdpr", label: "🇪🇺 EU (GDPR)", description: "Strong data protection rights, but still subject to intelligence sharing" },
      { value: "other_democratic", label: "🌍 Other Democratic", description: "Japan, Switzerland, Brazil, India, etc. — varying protections" },
      { value: "authoritarian", label: "🚫 Authoritarian/High-Risk", description: "China, Russia, Iran, Belarus, etc. — assume full monitoring" }
    ]
  }
]

// ============================================
// PROFILES & RECOMMENDATIONS
// ============================================

const profiles = {
  everyday: {
    label: "🟢 Everyday Privacy",
    badgeClass: "badge-everyday",
    description: "You want to stop corporations from profiling you and reduce your digital footprint. Standard tools with good defaults will serve you well.",
    actions: [
      { id: "a1", text: "Switch to a privacy-respecting browser (Firefox + uBlock Origin or Brave)", effort: "5 min" },
      { id: "a2", text: "Use a password manager (Bitwarden) with unique passwords everywhere", effort: "15 min" },
      { id: "a3", text: "Enable 2FA on all important accounts (prefer TOTP over SMS)", effort: "10 min" },
      { id: "a4", text: "Switch search engine to DuckDuckGo or Startpage", effort: "2 min" },
      { id: "a5", text: "Use email aliases (SimpleLogin/Addy.io) for signups", effort: "10 min" },
      { id: "a6", text: "Enable encrypted DNS (NextDNS or Quad9) on devices/router", effort: "10 min" },
      { id: "a7", text: "Review app permissions — revoke unnecessary location/mic/camera access", effort: "15 min" },
      { id: "a8", text: "Opt out of data broker sites (use JustDeleteMe or paid removal)", effort: "Ongoing" }
    ],
    tools: {
      "Browser & Search": [
        { name: "Firefox + uBlock Origin", icon: "🦊", priority: "high", description: "Best balance of privacy, compatibility, and extensions. Harden with arkenfox user.js for more.", link: "https://github.com/arkenfox/user.js" },
        { name: "Brave Browser", icon: "🦁", priority: "high", description: "Chromium-based, built-in shields, fingerprinting protection. Good if you need Chrome compatibility.", link: "https://brave.com" },
        { name: "DuckDuckGo / Startpage / Brave Search", icon: "🔍", priority: "high", description: "Private search engines that don't track you or build profiles.", link: "https://duckduckgo.com" }
      ],
      "Communications": [
        { name: "Signal", icon: "📱", priority: "high", description: "Gold standard for encrypted messaging. Open source, minimal metadata, disappearing messages.", link: "https://signal.org" },
        { name: "Proton Mail / Tuta", icon: "📧", priority: "medium", description: "End-to-end encrypted email. Proton has better ecosystem; Tuta encrypts subject lines too.", link: "https://proton.me/mail" },
        { name: "SimpleLogin / Addy.io", icon: "🔐", priority: "high", description: "Email aliases that forward to your real inbox. Kill aliases that get spammed.", link: "https://simplelogin.io" }
      ],
      "Network & DNS": [
        { name: "NextDNS", icon: "🛡️", priority: "high", description: "Encrypted DNS with customizable blocklists, logs, and analytics. Works on all devices.", link: "https://nextdns.io" },
        { name: "Mullvad VPN", icon: "🔒", priority: "medium", description: "No-logs, anonymous account (no email), WireGuard, port forwarding. Cash/Monero accepted.", link: "https://mullvad.net" },
        { name: "Quad9 (Free)", icon: "9️⃣", priority: "medium", description: "Free encrypted DNS with malware blocking. No account needed.", link: "https://quad9.net" }
      ]
    }
  },
  enhanced: {
    label: "🟡 Enhanced Privacy",
    badgeClass: "badge-enhanced",
    description: "You have specific threats (stalker, employer, targeted ads) or higher-value data. You need compartmentalization and stronger defaults.",
    actions: [
      { id: "b1", text: "Everything in Everyday tier, plus:", effort: "—" },
      { id: "b2", text: "Compartmentalize: Separate browsers/profiles for banking, shopping, social, personal", effort: "30 min setup" },
      { id: "b3", text: "Use a reputable paid VPN (Mullvad, IVPN, Proton) on untrusted networks", effort: "15 min" },
      { id: "b4", text: "Hardened browser: LibreWolf or Firefox with arkenfox user.js", effort: "20 min" },
      { id: "b5", text: "Self-hosted password manager (Vaultwarden) or hardware key (YubiKey) for 2FA", effort: "1-2 hrs" },
      { id: "b6", text: "Encrypt backups with Cryptomator before uploading to cloud", effort: "30 min" },
      { id: "b7", text: "Use different email aliases per service + unique usernames", effort: "Ongoing" },
      { id: "b8", text: "Enable Lockdown Mode (iOS) or GrapheneOS (Pixel) if mobile is critical", effort: "Varies" },
      { id: "b9", text: "Metadata stripping: ExifTool for photos, mat2 for documents before sharing", effort: "Per file" }
    ],
    tools: {
      "Browser & Hardening": [
        { name: "LibreWolf", icon: "🐺", priority: "high", description: "Firefox fork with privacy-hardened defaults, no telemetry, uBlock Origin built-in.", link: "https://librewolf.net" },
        { name: "Firefox + arkenfox user.js", icon: "🦊", priority: "high", description: "Maximum hardening via user.js. Requires maintenance but most configurable.", link: "https://github.com/arkenfox/user.js" },
        { name: "Tor Browser", icon: "🧅", priority: "medium", description: "For high-sensitivity browsing. Slow, breaks many sites, but best anonymity.", link: "https://torproject.org" }
      ],
      "Compartmentalization": [
        { name: "Firefox Multi-Account Containers", icon: "📦", priority: "high", description: "Isolate cookies/storage per container (Banking, Shopping, Social, Google).", link: "https://addons.mozilla.org/en-US/firefox/addon/multi-account-containers/" },
        { name: "Qubes OS", icon: "🧱", priority: "low", description: "Security-by-compartmentalization OS. Each app in separate VM. Steep learning curve.", link: "https://qubes-os.org" },
        { name: "Virtual Machines (VirtualBox/VMware)", icon: "💻", priority: "medium", description: "Isolate risky activities (unknown downloads, sketchy sites) in disposable VMs.", link: "https://virtualbox.org" }
      ],
      "Identity & Auth": [
        { name: "YubiKey / Nitrokey", icon: "🔑", priority: "high", description: "Hardware FIDO2/WebAuthn keys. Phishing-proof 2FA. Get 2 (primary + backup).", link: "https://yubico.com" },
        { name: "Vaultwarden (Self-hosted Bitwarden)", icon: "🏠", priority: "medium", description: "Your own password manager server. Full control, no third-party trust.", link: "https://github.com/dani-garcia/vaultwarden" },
        { name: "Passkeys (WebAuthn)", icon: "🔐", priority: "high", description: "Replace passwords entirely where supported. Synced via iCloud Keychain / Google Password Manager / Bitwarden.", link: "https://passkeys.dev" }
      ],
      "Mobile Hardening": [
        { name: "GrapheneOS (Pixel only)", icon: "📱", priority: "high", description: "Hardened Android, no Google services, exploit mitigations, sandboxed Play Services optional.", link: "https://grapheneos.org" },
        { name: "iOS Lockdown Mode", icon: "🍎", priority: "medium", description: "Extreme attack surface reduction. For high-risk users. Settings → Privacy & Security → Lockdown Mode.", link: "https://support.apple.com/en-us/HT212650" }
      ]
    }
  },
  high_threat: {
    label: "🔴 High-Threat / Adversarial",
    badgeClass: "badge-high",
    description: "You face capable, motivated adversaries (state actors, organized crime, high-stakes legal). Standard tools are insufficient. You need operational security as a discipline.",
    actions: [
      { id: "c1", text: "Everything in Enhanced tier, plus:", effort: "—" },
      { id: "c2", text: "Separate physical devices for each identity/context (no crossover)", effort: "Expensive" },
      { id: "c3", text: "Air-gapped machine for most sensitive operations (keys, signing, decryption)", effort: "High" },
      { id: "c4", text: "Tails OS for all high-risk sessions — amnesic, Tor-forced, no persistence", effort: "Per session" },
      { id: "c5", text: "PGP/GPG for all sensitive comms — verify fingerprints out-of-band", effort: "Ongoing" },
      { id: "c6", text: "Operational security (OPSEC) as daily practice: no real names, no patterns, no trust", effort: "Lifestyle" },
      { id: "c7", text: "Legal counsel familiar with digital rights / surveillance law", effort: "As needed" },
      { id: "c8", text: "Duress passwords / plausible deniability (VeraCrypt hidden volumes)", effort: "Setup once" },
      { id: "c9", text: "Regular threat modeling reviews — adversary capabilities change", effort: "Quarterly" }
    ],
    tools: {
      "Operating Systems": [
        { name: "Tails", icon: "🐛", priority: "high", description: "Amnesic live OS, forces all traffic through Tor, forgets everything on shutdown.", link: "https://tails.net" },
        { name: "Qubes OS", icon: "🧱", priority: "high", description: "Xen-based, strong isolation via qubes. Disposable VMs, split GPG, USB guard.", link: "https://qubes-os.org" },
        { name: "Whonix", icon: "🔒", priority: "medium", description: "Two-VM design (Gateway + Workstation) — IP leaks impossible by architecture.", link: "https://whonix.org" }
      ],
      "Communications": [
        { name: "Signal (with registration lock)", icon: "📱", priority: "high", description: "Still best for messaging. Enable registration lock, disappearing messages, screen security.", link: "https://signal.org" },
        { name: "SimpleX Chat", icon: "💬", priority: "medium", description: "No user identifiers at all. Decentralized, no phone number, quantum-resistant.", link: "https://simplex.chat" },
        { name: "Briar", icon: "🌿", priority: "medium", description: "Offline-first, Bluetooth/WiFi mesh, Tor transport. For when internet is down/monitored.", link: "https://briarproject.org" }
      ],
      "Anonymity & Traffic": [
        { name: "Tor (standalone)", icon: "🧅", priority: "high", description: "Use Tor Browser or system Tor. Bridges (obfs4, Snowflake) if blocked.",        link: "https://torproject.org" },
        { name: "Mullvad VPN (cash/Monero)", icon: "💰", priority: "high", description: "Anonymous account, no logs, WireGuard, port forwarding, multi-hop.",
          link: "https://mullvad.net" },
        { name: "Orbot (Android Tor)", icon: "📱", priority: "medium", description: "Tor for Android. Can route all device traffic or per-app.",
          link: "https://orbot.app" }
      ],
      "Data Protection": [
        { name: "VeraCrypt (Hidden Volumes)", icon: "🗝️", priority: "high", description: "Plausible deniability — hidden OS/volume inside outer volume.",
          link: "https://veracrypt.fr" },
        { name: "Cryptomator", icon: "☁️", priority: "medium", description: "Client-side encryption for cloud sync. Encrypts filenames too.",
          link: "https://cryptomator.org" },
        { name: "Metadata Cleaners (mat2, ExifTool)", icon: "🧹", priority: "high", description: "Strip EXIF, GPS, author info from files BEFORE sharing.",
          link: "https://0xacab.org/jvoisin/mat2" }
      ]
    }
  }
}

// ============================================
// QUIZ STATE
// ============================================

const currentStep = ref(1)
const answers = ref({ 1: [] })
const showResults = ref(false)
const started = ref(false)
const completedActions = ref({})
const profile = ref(null)
const categorizedTools = ref({})

const totalSteps = computed(() => questions.length)
const progressPercent = computed(() => (currentStep.value / totalSteps.value) * 100)

const currentQuestion = computed(() => {
  return questions.find(q => q.id === currentStep.value)
})

function isOptionSelected(optionValue) {
  const currentAnswers = answers.value[currentStep.value]
  if (!currentAnswers) return false
  if (Array.isArray(currentAnswers)) {
    return currentAnswers.includes(optionValue)
  }
  return currentAnswers === optionValue
}

function toggleOption(optionValue, isChecked) {
  const currentAnswers = answers.value[currentStep.value]
  
  if (currentQuestion.value.multi) {
    let newAnswers = Array.isArray(currentAnswers) ? [...currentAnswers] : []
    if (isChecked) {
      if (!newAnswers.includes(optionValue)) newAnswers.push(optionValue)
    } else {
      newAnswers = newAnswers.filter(v => v !== optionValue)
    }
    answers.value[currentStep.value] = newAnswers
  } else {
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
    if (questions[currentStep.value - 1].multi) {
      answers.value[currentStep.value] = []
    }
  }
}

function prevQuestion() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// Calculate threat model profile
function calculateResults() {
  const userSelections = answers.value
  
  // Score each profile
  const scores = {
    everyday: 0,
    enhanced: 0,
    high_threat: 0
  }
  
  // Assets (Q1) - more sensitive assets = higher tier
  const assets = userSelections[1] || []
  const highSensitivityAssets = ['identity', 'accounts', 'financial', 'location']
  const criticalCount = assets.filter(a => highSensitivityAssets.includes(a)).length
  if (criticalCount >= 3) { scores.high_threat += 3; scores.enhanced += 2 }
  else if (criticalCount >= 1) { scores.enhanced += 2; scores.everyday += 1 }
  else { scores.everyday += 2 }
  
  // Adversaries (Q2)
  const adversaries = userSelections[2] || []
  const highThreatAdversaries = ['individuals', 'law_enforcement', 'state_actors']
  const targetedAdversaries = ['individuals', 'employer']
  const hasHighThreat = adversaries.some(a => highThreatAdversaries.includes(a))
  const hasTargeted = adversaries.some(a => targetedAdversaries.includes(a))
  const hasMassOnly = adversaries.length > 0 && !hasHighThreat && !hasTargeted
  
  if (hasHighThreat) { scores.high_threat += 5; scores.enhanced += 2 }
  else if (hasTargeted) { scores.enhanced += 4; scores.high_threat += 1 }
  else if (hasMassOnly) { scores.everyday += 3; scores.enhanced += 1 }
  
  // Capability (Q3)
  const capability = userSelections[3]
  if (capability === 'state_level') { scores.high_threat += 5; scores.enhanced += 2 }
  else if (capability === 'targeted_high') { scores.high_threat += 3; scores.enhanced += 3 }
  else if (capability === 'targeted_low') { scores.enhanced += 2; scores.everyday += 1 }
  else { scores.everyday += 2 }
  
  // Effort Budget (Q4)
  const effort = userSelections[4]
  if (effort === 'maximum') { scores.high_threat += 3; scores.enhanced += 1 }
  else if (effort === 'significant') { scores.enhanced += 3; scores.high_threat += 1 }
  else if (effort === 'moderate') { scores.enhanced += 2; scores.everyday += 1 }
  else { scores.everyday += 3 }
  
  // Ecosystem (Q5)
  const ecosystem = userSelections[5] || []
  const hasHardenedMobile = ecosystem.includes('android_custom')
  const hasLinux = ecosystem.includes('linux')
  const hasIos = ecosystem.includes('ios')
  const onlyMainstream = ecosystem.length > 0 && !hasHardenedMobile && !hasLinux && !hasIos
  
  if (hasHardenedMobile || hasLinux) { scores.enhanced += 2; scores.high_threat += 1 }
  else if (hasIos) { scores.everyday += 1; scores.enhanced += 1 }
  else if (onlyMainstream) { scores.everyday += 1 }
  
  // Technical Comfort (Q6)
  const comfort = userSelections[6]
  if (comfort === 'advanced') { scores.high_threat += 2; scores.enhanced += 2 }
  else if (comfort === 'intermediate') { scores.enhanced += 2; scores.everyday += 1 }
  else if (comfort === 'basic') { scores.enhanced += 1; scores.everyday += 1 }
  else { scores.everyday += 2 }
  
  // Risk Tolerance (Q7) - consequences of failure
  const risk = userSelections[7]
  if (risk === 'life' || risk === 'legal') { scores.high_threat += 5; scores.enhanced += 2 }
  else if (risk === 'safety') { scores.high_threat += 4; scores.enhanced += 3 }
  else if (risk === 'financial') { scores.enhanced += 3; scores.high_threat += 1 }
  else if (risk === 'embarrassment') { scores.enhanced += 2; scores.everyday += 1 }
  else { scores.everyday += 2 }
  
  // Jurisdiction (Q8)
  const jurisdiction = userSelections[8]
  if (jurisdiction === 'authoritarian') { scores.high_threat += 4; scores.enhanced += 2 }
  else if (jurisdiction === 'five_eyes') { scores.enhanced += 2; scores.high_threat += 1 }
  else if (jurisdiction === 'nine_eyes' || jurisdiction === 'fourteen_eyes') { scores.enhanced += 1 }
  else { scores.everyday += 1 }
  
  // Determine primary profile
  let primaryProfile = 'everyday'
  let maxScore = scores.everyday
  if (scores.enhanced > maxScore) { maxScore = scores.enhanced; primaryProfile = 'enhanced' }
  if (scores.high_threat > maxScore) { maxScore = scores.high_threat; primaryProfile = 'high_threat' }
  
  profile.value = profiles[primaryProfile]
  categorizedTools.value = profile.value.tools
  
  // Load saved actions
  const saved = localStorage.getItem('privacy-actions-' + primaryProfile)
  if (saved) {
    try { completedActions.value = JSON.parse(saved) } catch {}
  }
  
  showResults.value = true
}

function saveActions() {
  if (profile.value) {
    localStorage.setItem('privacy-actions-' + profile.value.label, JSON.stringify(completedActions.value))
  }
}

const completedCount = computed(() => {
  return Object.values(completedActions.value).filter(v => v).length
})

function resetQuiz() {
  currentStep.value = 1
  answers.value = { 1: [] }
  showResults.value = false
  started.value = false
  profile.value = null
  categorizedTools.value = {}
}

function exportResults() {
  if (!profile.value) return
  const date = new Date().toLocaleDateString()
  let resultsText = `PRIVACY THREAT MODEL PLAN - ${date}\n`
  resultsText += `========================================\n\n`
  resultsText += `Profile: ${profile.value.label}\n`
  resultsText += `${profile.value.description}\n\n`
  
  resultsText += `YOUR ANSWERS:\n`
  const qLabels = ['Assets', 'Adversaries', 'Adversary Capability', 'Effort Budget', 'Device Ecosystem', 'Technical Comfort', 'Risk if Compromised', 'Jurisdiction']
  questions.forEach((q, i) => {
    const ans = answers.value[q.id]
    if (ans) {
      const val = Array.isArray(ans) ? ans.join(', ') : ans
      resultsText += `${i+1}. ${qLabels[i]}: ${val}\n`
    }
  })
  resultsText += `\n`
  
  resultsText += `ACTION CHECKLIST:\n`
  resultsText += `========================================\n`
  profile.value.actions.forEach((action, i) => {
    const done = completedActions.value[action.id] ? '[x]' : '[ ]'
    resultsText += `${done} ${action.text} ${action.effort ? `(${action.effort})` : ''}\n`
  })
  resultsText += `\n`
  
  resultsText += `RECOMMENDED TOOLS:\n`
  resultsText += `========================================\n`
  Object.entries(categorizedTools.value).forEach(([category, tools]) => {
    resultsText += `\n${category}:\n`
    tools.forEach(t => {
      resultsText += `  ${t.priority.toUpperCase()} - ${t.name}: ${t.description}\n`
    })
  })
  
  const blob = new Blob([resultsText], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `privacy-threat-model-${Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

function copyResults() {
  if (!profile.value) return
  const topTools = Object.values(categorizedTools.value).flat().filter(t => t.priority === 'high').slice(0, 5)
  const toolList = topTools.map(t => `${t.name}: ${t.description}`).join('\n')
  const actionList = profile.value.actions.slice(0, 5).map(a => `${completedActions.value[a.id] ? '✓' : '☐'} ${a.text}`).join('\n')
  navigator.clipboard.writeText(
    `Privacy Plan: ${profile.value.label}\n\nTop Tools:\n${toolList}\n\nTop Actions:\n${actionList}`
  )
  alert('Privacy plan summary copied!')
}
</script>

<style scoped>
.privacy-threat-model-quiz {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 24px;
  border: 1px solid var(--vp-c-divider);
}

/* Progress Bar */
.progress-container { margin-bottom: 2rem; }
.progress-bar { height: 6px; background: var(--vp-c-brand-1); border-radius: 3px; transition: width 0.3s ease; }
.progress-text { text-align: right; font-size: 0.8rem; color: var(--vp-c-text-2); margin-top: 0.5rem; }

/* Intro Box */
.intro-box {
  text-align: center;
  padding: 2rem;
  background: var(--vp-c-brand-soft);
  border-radius: 16px;
  border: 1px solid var(--vp-c-brand-1);
}
.intro-box h2 { margin-bottom: 1rem; }
.intro-box p { color: var(--vp-c-text-2); line-height: 1.6; margin-bottom: 1rem; }
.intro-note { font-size: 0.9rem !important; font-style: italic; }
.start-btn {
  padding: 1rem 2rem;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 40px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}
.start-btn:hover { transform: scale(1.02); }

/* Question Area */
.question-header { margin-bottom: 1.5rem; }
.question-category {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-radius: 20px;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.question-title { font-size: 1.4rem; margin-bottom: 0.5rem; }
.question-context { font-size: 0.9rem; color: var(--vp-c-text-2); font-style: italic; }

.options { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }

.option-group {
  padding: 1rem;
  background: var(--vp-c-bg);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  transition: border-color 0.2s, background 0.2s;
}
.option-group:hover { border-color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }

.option-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  width: 100%;
}
.option-input { margin-top: 0.2rem; flex-shrink: 0; }
.option-text { font-weight: 500; }
.option-desc { margin: 0.5rem 0 0 1.6rem; font-size: 0.8rem; color: var(--vp-c-text-2); line-height: 1.4; }

.option-impact { margin-top: 0.5rem; }
.impact-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
}
.impact-badge.low { background: #27ae60; color: white; }
.impact-badge.medium { background: #f39c12; color: white; }
.impact-badge.high { background: #e67e22; color: white; }
.impact-badge.critical { background: #e74c3c; color: white; animation: pulse 2s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }

.nav-buttons { display: flex; justify-content: space-between; gap: 1rem; }
.nav-btn {
  padding: 0.6rem 1.2rem;
  border-radius: 40px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}
.nav-btn.back { background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); }
.nav-btn.next, .nav-btn.submit { background: var(--vp-c-brand-1); color: white; margin-left: auto; }
.nav-btn.next:hover, .nav-btn.submit:hover { transform: translateX(3px); }
.nav-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

/* Results Area */
.results-header { text-align: center; margin-bottom: 2rem; }
.results-header h2 { margin-bottom: 0.5rem; }

.threat-model-badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  border-radius: 40px;
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 1rem;
}
.badge-everyday { background: #27ae60; color: white; }
.badge-enhanced { background: #f39c12; color: white; }
.badge-high { background: #e74c3c; color: white; animation: pulse 2s infinite; }

.profile-description { color: var(--vp-c-text-2); max-width: 600px; margin: 0 auto; line-height: 1.6; }

.recommendations { margin-bottom: 2rem; }
.recommendations h3 { margin-bottom: 1rem; font-size: 1.2rem; }

.tool-categories { display: flex; flex-direction: column; gap: 1.5rem; }
.tool-category h4 { 
  font-size: 0.9rem; 
  text-transform: uppercase; 
  letter-spacing: 0.05em; 
  color: var(--vp-c-text-3); 
  margin-bottom: 0.75rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid var(--vp-c-divider);
}
.tool-list { display: flex; flex-direction: column; gap: 0.75rem; }

.tool-card {
  padding: 1rem;
  background: var(--vp-c-bg);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  transition: border-color 0.2s;
}
.tool-card:hover { border-color: var(--vp-c-brand-1); }
.tool-card.priority-high { border-left: 4px solid #e74c3c; }
.tool-card.priority-medium { border-left: 4px solid #f39c12; }

.tool-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
.tool-name { font-weight: 600; font-size: 0.95rem; }
.priority-badge {
  font-size: 0.6rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
}
.priority-badge.high { background: #e74c3c; color: white; }
.priority-badge.medium { background: #f39c12; color: white; }
.priority-badge.low { background: var(--vp-c-text-3); color: white; }

.tool-desc { font-size: 0.8rem; color: var(--vp-c-text-2); margin-bottom: 0.5rem; line-height: 1.4; }
.tool-link { font-size: 0.75rem; font-weight: 600; color: var(--vp-c-brand-1); text-decoration: none; }
.tool-link:hover { text-decoration: underline; }

/* Action Checklist */
.action-checklist { margin-bottom: 2rem; }
.action-checklist h3 { margin-bottom: 1rem; font-size: 1.2rem; }

.checklist { display: flex; flex-direction: column; gap: 0.5rem; }
.checklist-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--vp-c-bg);
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  cursor: pointer;
  transition: all 0.2s;
}
.checklist-item:hover { border-color: var(--vp-c-brand-1); }
.checklist-item input { display: none; }
.checkmark {
  width: 20px; height: 20px;
  border-radius: 50%;
  border: 2px solid var(--vp-c-divider);
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.checklist-item input:checked + .checkmark {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}
.checklist-item input:checked + .checkmark::after {
  content: '✓'; color: white; font-size: 0.7rem; font-weight: 700;
}
.action-text { flex: 1; font-size: 0.85rem; line-height: 1.4; }
.effort-badge {
  font-size: 0.65rem;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  white-space: nowrap;
}

.progress-summary {
  text-align: center;
  margin-top: 1rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

/* Action Buttons */
.action-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 1rem; }
.export-btn, .copy-btn, .reset-btn {
  padding: 0.6rem 1.2rem;
  border-radius: 40px;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}
.export-btn { background: #2ecc71; color: white; }
.copy-btn { background: var(--vp-c-brand-1); color: white; }
.reset-btn { background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); }

.disclaimer { text-align: center; font-size: 0.7rem; color: var(--vp-c-text-3); margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--vp-c-divider); }

/* Mobile */
@media (max-width: 640px) {
  .privacy-threat-model-quiz { padding: 1rem; margin: 1rem; }
  .question-title { font-size: 1.2rem; }
  .tool-header { flex-direction: column; align-items: flex-start; gap: 0.25rem; }
  .action-buttons { flex-direction: column; }
}
</style>