<template>
  <div class="financial-health-quiz">
    <!-- Progress Indicator -->
    <div class="progress-container">
      <div class="progress-bar" :style="{ width: progressPercent + '%' }"></div>
      <div class="progress-text">Question {{ currentStep }} of {{ totalSteps }}</div>
    </div>

    <!-- Question Area -->
    <div v-if="!showResults" class="question-area">
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
          See My Financial Plan 💰
        </button>
      </div>
    </div>

    <!-- Results Area -->
    <div v-else class="results-area">
      <div class="results-header">
        <h2>Your Financial Health Score</h2>
        <div class="score-circle" :class="scoreClass">
          <span class="score-number">{{ financialScore }}</span>
          <span class="score-label">/ 100</span>
        </div>
        <div class="tier-badge" :class="tierClass">{{ tierLabel }}</div>
        <p class="tier-description">{{ tierDescription }}</p>
      </div>

      <div class="priority-actions">
        <h3>🎯 Your Top 3 Priorities</h3>
        <div class="action-cards">
          <div v-for="(action, index) in topPriorities" :key="action.id" class="action-card" :class="'priority-' + (index + 1)">
            <div class="priority-number">{{ index + 1 }}</div>
            <div class="action-content">
              <h4>{{ action.title }}</h4>
              <p>{{ action.description }}</p>
              <div class="action-meta">
                <span class="effort">{{ action.effort }}</span>
                <span class="impact">{{ action.impact }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="detailed-breakdown">
        <h3>📊 Category Breakdown</h3>
        <div class="breakdown-grid">
          <div v-for="cat in categoryScores" :key="cat.name" class="breakdown-card">
            <div class="breakdown-header">
              <span class="cat-name">{{ cat.icon }} {{ cat.name }}</span>
              <span class="cat-score" :class="cat.scoreClass">{{ cat.score }}/{{ cat.max }}</span>
            </div>
            <div class="breakdown-bar">
              <div class="breakdown-fill" :style="{ width: cat.percent + '%' }" :class="cat.scoreClass"></div>
            </div>
            <p class="cat-feedback">{{ cat.feedback }}</p>
          </div>
        </div>
      </div>

      <div class="personalized-roadmap">
        <h3>🗺️ Your 12-Month Roadmap</h3>
        <div class="roadmap-phases">
          <div v-for="(phase, index) in roadmap" :key="phase.month" class="roadmap-phase">
            <div class="phase-header">
              <span class="phase-month">{{ phase.month }}</span>
              <span class="phase-focus">{{ phase.focus }}</span>
            </div>
            <ul class="phase-tasks">
              <li v-for="task in phase.tasks" :key="task">{{ task }}</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="exportResults" class="export-btn">📄 Export Plan (TXT)</button>
        <button @click="copyResults" class="copy-btn">📋 Copy to Clipboard</button>
        <button @click="resetQuiz" class="reset-btn">⟳ Retake Quiz</button>
      </div>

      <div class="disclaimer">
        <small>⚠️ Educational only — not financial advice. Verify rates, rules, and eligibility for your country. Consult a qualified professional for major decisions.</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// ============================================
// QUESTIONS
// ============================================

const questions = [
  {
    id: 1,
    category: "🛡️ Foundation",
    text: "Do you have an emergency fund?",
    context: "Cash set aside for unexpected expenses (job loss, medical, car repair) — not invested, kept in a savings account.",
    multi: false,
    options: [
      { value: "none", label: "❌ None — I'd need to borrow or use credit cards", description: "Zero cash buffer for emergencies" },
      { value: "starter", label: "🌱 Starter ($500–$1,000)", description: "Covers minor emergencies like car repair or urgent dental" },
      { value: "partial", label: "📦 Partial (1–2 months expenses)", description: "Some breathing room but not full 3–6 months" },
      { value: "full", label: "✅ Full (3–6 months expenses in HYSA)", description: "Proper emergency fund in high-yield savings account" },
      { value: "excess", label: "💰 More than 6 months expenses", description: "Excess cash beyond emergency needs — consider investing" }
    ]
  },
  {
    id: 2,
    category: "🛡️ Foundation",
    text: "What's your high-interest debt situation? (Credit cards, payday loans, personal loans > 7% APR)",
    multi: false,
    options: [
      { value: "severe", label: "🔴 Severe — Can't make minimums / in collections", description: "Debt is unmanageable, credit damaged, collectors calling" },
      { value: "high", label: "🟠 High — Carrying balances month to month", description: "Paying 15–30%+ interest, making minimums but not progress" },
      { value: "moderate", label: "🟡 Moderate — Some balances, paying extra", description: "Have debt but actively paying more than minimums" },
      { value: "low", label: "🟢 Low — Only mortgage/student loans < 7%", description: "No consumer debt, only 'good' low-interest debt" },
      { value: "none", label: "✅ Debt-free", description: "No debt at all" }
    ]
  },
  {
    id: 3,
    category: "🛡️ Foundation",
    text: "Are you getting your full employer 401(k)/403(b) match?",
    context: "Free money — typically 3–6% of salary. This is the highest guaranteed return in finance.",
    multi: false,
    options: [
      { value: "no_match", label: "❌ No employer plan or no match offered", description: "Self-employed, part-time, or employer doesn't match" },
      { value: "not_contributing", label: "💸 Plan exists but I'm not contributing enough", description: "Leaving free money on the table" },
      { value: "partial", label: "🟡 Contributing but not getting full match", description: "Putting in something but missing the full match" },
      { value: "full", label: "✅ Getting the full match", description: "Contributing at least enough to capture 100% of employer match" },
      { value: "maxed", label: "🚀 Maxing out ($23,000+ / $30,500 50+)", description: "Hitting the annual contribution limit" }
    ]
  },
  {
    id: 4,
    category: "📈 Investing",
    text: "How are you investing for the long term (10+ years)?",
    multi: true,
    options: [
      { value: "not_investing", label: "📉 Not investing at all", description: "Cash only, no brokerage/IRA/401k investments" },
      { value: "target_date", label: "🎯 Target-date fund in 401k/IRA", description: "Set-it-and-forget-it, automatically rebalances" },
      { value: "index_funds", label: "📊 Low-cost index funds / ETFs (VTI, VOO, VT)", description: "Total market or S&P 500, expense ratio < 0.1%" },
      { value: "robo", label: "🤖 Robo-advisor (Betterment, Wealthfront, Schwab)", description: "Automated portfolio management for ~0.25% fee" },
      { value: "individual_stocks", label: "📈 Individual stock picking", description: "Choosing specific companies — higher risk, more work" },
      { value: "crypto", label: "₿ Crypto / alternatives", description: "Bitcoin, ETH, or other speculative assets" },
      { value: "real_estate", label: "🏠 Real estate (REITs, rental property)", description: "Property or REITs for diversification" }
    ]
  },
  {
    id: 5,
    category: "📈 Investing",
    text: "What's your investment cost awareness?",
    multi: false,
    options: [
      { value: "unaware", label: "❓ Don't know my fees", description: "Never checked expense ratios or advisor fees" },
      { value: "high_fees", label: "💸 Paying > 0.5% in fees", description: "Active funds, high-fee 401k options, advisor AUM fee" },
      { value: "moderate_fees", label: "📊 Paying 0.1–0.5%", description: "Mix of index funds and some active, or robo-advisor" },
      { value: "low_fees", label: "✅ Paying < 0.1% (index funds/ETFs)", description: "Vanguard, Fidelity, Schwab zero/low-cost funds" },
      { value: "zero_fees", label: "🆓 Zero fees (Fidelity ZERO, Schwab SWTSX)", description: "Using expense-ratio-free index funds" }
    ]
  },
  {
    id: 6,
    category: "📈 Investing",
    text: "Which tax-advantaged accounts are you using?",
    multi: true,
    context: "Check all that apply. These are the most powerful wealth-building tools available.",
    options: [
      { value: "none", label: "🚫 None — only taxable brokerage", description: "Missing out on tax-free/tax-deferred growth" },
      { value: "traditional_401k", label: "🏢 Traditional 401(k)/403(b)", description: "Pre-tax contributions, tax-deferred growth" },
      { value: "roth_401k", label: "🏢 Roth 401(k)/403(b)", description: "Post-tax contributions, tax-free growth & withdrawal" },
      { value: "traditional_ira", label: "💰 Traditional IRA", description: "Pre-tax (if eligible), $7,000 limit ($8,000 50+)" },
      { value: "roth_ira", label: "💰 Roth IRA", description: "Post-tax, tax-free growth, $7,000 limit ($8,000 50+)" },
      { value: "hsa", label: "🏥 HSA (Health Savings Account)", description: "Triple tax advantage — best account if eligible" },
      { value: "529", label: "🎓 529 College Savings", description: "Tax-free growth for education expenses" },
      { value: "mega_backdoor", label: "🚀 Mega Backdoor Roth", description: "After-tax 401k → in-plan Roth conversion, up to $69k total" }
    ]
  },
  {
    id: 7,
    category: "💰 Cash Flow",
    text: "How do you manage monthly spending?",
    multi: false,
    options: [
      { value: "no_clue", label: "❓ No idea where money goes", description: "Never track, surprised by credit card bill" },
      { value: "mental", label: "🧠 Rough mental tracking", description: "Know big bills but not daily spending" },
      { value: "spreadsheet", label: "📊 Spreadsheet / manual tracking", description: "Log expenses manually each week/month" },
      { value: "app_auto", label: "📱 Budgeting app (YNAB, Monarch, Mint, etc.)", description: "Auto-sync, categorize, review regularly" },
      { value: "zero_based", label: "🎯 Zero-based budget (every dollar assigned)", description: "YNAB-style: give every dollar a job before month starts" }
    ]
  },
  {
    id: 8,
    category: "💰 Cash Flow",
    text: "What's your savings rate? (Percentage of gross income saved/invested)",
    multi: false,
    options: [
      { value: "negative", label: "📉 Negative (spending > income)", description: "Going into debt each month" },
      { value: "zero", label: "0% (breaking even)", description: "No money left to save" },
      { value: "low", label: "1–10%", description: "Saving something but below recommended" },
      { value: "moderate", label: "11–20%", description: "Solid progress, building wealth" },
      { value: "high", label: "21–35%", description: "Strong saver, on track for early financial freedom" },
      { value: "very_high", label: "35%+ (FIRE trajectory)", description: "Aggressive savings, potential early retirement" }
    ]
  },
  {
    id: 9,
    category: "🛡️ Protection",
    text: "Do you have adequate insurance coverage?",
    multi: true,
    options: [
      { value: "health", label: "🏥 Health insurance", description: "Employer, marketplace, Medicaid, or parent's plan" },
      { value: "auto", label: "🚗 Auto insurance (adequate liability)", description: "At least 100/300/100, not just state minimums" },
      { value: "home_renters", label: "🏠 Homeowners / Renters insurance", description: "Covers liability, personal property, loss of use" },
      { value: "term_life", label: "👨‍👩‍👧 Term life insurance (if dependents)", description: "10–12x income, 20–30 year term" },
      { value: "disability", label: "🦽 Disability insurance (own-occupation)", description: "Protects your income — most overlooked critical coverage" },
      { value: "umbrella", label: "☂️ Umbrella liability ($1M+)", description: "Extra liability protection above auto/home limits" },
      { value: "none_needed", label: "✅ Covered appropriately for my situation", description: "Have what I need, reviewed recently" }
    ]
  },
  {
    id: 10,
    category: "🛡️ Protection",
    text: "Do you have essential estate documents?",
    multi: true,
    context: "Not just for the wealthy — protects your choices and loved ones.",
    options: [
      { value: "will", label: "📜 Will / Trust", description: "Directs asset distribution, names guardians for minors" },
      { value: "poa_financial", label: "💰 Financial Power of Attorney", description: "Someone can manage finances if you're incapacitated" },
      { value: "poa_medical", label: "🏥 Medical Power of Attorney / Advance Directive", description: "Someone can make healthcare decisions + your wishes documented" },
      { value: "beneficiaries", label: "📋 Beneficiaries updated on all accounts", description: "401k, IRA, life insurance, bank POD/TOD — supersedes will" },
      { value: "none", label: "❌ None of the above", description: "State law decides everything if something happens" }
    ]
  },
  {
    id: 11,
    category: "🎯 Goals",
    text: "Do you have specific, written financial goals with timelines?",
    multi: false,
    options: [
      { value: "none", label: "🚫 No written goals", description: "Vague ideas like 'save more' or 'retire someday'" },
      { value: "vague", label: "☁️ Vague goals, no numbers", description: "Know what I want but haven't quantified" },
      { value: "partial", label: "📝 Some goals with numbers/dates", description: "e.g., '$50k house down payment by 2026'" },
      { value: "comprehensive", label: "📋 Comprehensive written plan", description: "Short/medium/long-term goals with amounts, dates, and progress tracking" }
    ]
  },
  {
    id: 12,
    category: "🎯 Goals",
    text: "How often do you review your financial big picture?",
    multi: false,
    options: [
      { value: "never", label: "🚫 Never — set and forget (or ignore)", description: "Haven't looked at net worth or allocations in a year+" },
      { value: "yearly", label: "📅 Once a year", description: "Annual review around tax time or birthday" },
      { value: "quarterly", label: "📊 Quarterly", description: "Check net worth, rebalance, adjust contributions every 3 months" },
      { value: "monthly", label: "📈 Monthly", description: "Regular check-in with budget, investments, goals" }
    ]
  }
]

// ============================================
// SCORING & RESULTS
// ============================================

const categoryMap = {
  '🛡️ Foundation': ['emergency_fund', 'high_interest_debt', 'employer_match'],
  '📈 Investing': ['investing_approach', 'investment_fees', 'tax_advantaged'],
  '💰 Cash Flow': ['budgeting', 'savings_rate'],
  '🛡️ Protection': ['insurance', 'estate_docs'],
  '🎯 Goals': ['written_goals', 'review_frequency']
}

const weights = {
  emergency_fund: 10,
  high_interest_debt: 15,
  employer_match: 10,
  investing_approach: 15,
  investment_fees: 10,
  tax_advantaged: 10,
  budgeting: 5,
  savings_rate: 10,
  insurance: 5,
  estate_docs: 5,
  written_goals: 5,
  review_frequency: 5
}

// Scoring functions for each question
function scoreQ1(val) { // emergency fund
  const scores = { none: 0, starter: 3, partial: 6, full: 10, excess: 8 }
  return scores[val] || 0
}

function scoreQ2(val) { // high interest debt
  const scores = { severe: 0, high: 2, moderate: 5, low: 8, none: 15 }
  return scores[val] || 0
}

function scoreQ3(val) { // employer match
  const scores = { no_match: 5, not_contributing: 0, partial: 5, full: 10, maxed: 10 }
  return scores[val] || 0
}

function scoreQ4(val) { // investing approach (multi)
  if (!val) return 0
  const arr = Array.isArray(val) ? val : [val]
  let score = 0
  if (arr.includes('not_investing')) return 0
  if (arr.includes('target_date')) score += 5
  if (arr.includes('index_funds')) score += 8
  if (arr.includes('robo')) score += 5
  if (arr.includes('individual_stocks')) score += 2
  if (arr.includes('crypto')) score += 1
  if (arr.includes('real_estate')) score += 3
  return Math.min(score, 15)
}

function scoreQ5(val) { // investment fees
  const scores = { unaware: 2, high_fees: 0, moderate_fees: 5, low_fees: 8, zero_fees: 10 }
  return scores[val] || 0
}

function scoreQ6(val) { // tax advantaged (multi)
  if (!val) return 0
  const arr = Array.isArray(val) ? val : [val]
  if (arr.includes('none')) return 0
  let score = 0
  const valuable = ['traditional_401k', 'roth_401k', 'traditional_ira', 'roth_ira', 'hsa', 'mega_backdoor']
  valuable.forEach(v => { if (arr.includes(v)) score += 2 })
  if (arr.includes('529')) score += 1
  return Math.min(score, 10)
}

function scoreQ7(val) { // budgeting
  const scores = { no_clue: 0, mental: 2, spreadsheet: 5, app_auto: 8, zero_based: 10 }
  return scores[val] || 0
}

function scoreQ8(val) { // savings rate
  const scores = { negative: 0, zero: 0, low: 3, moderate: 6, high: 8, very_high: 10 }
  return scores[val] || 0
}

function scoreQ9(val) { // insurance (multi)
  if (!val) return 0
  const arr = Array.isArray(val) ? val : [val]
  if (arr.includes('none_needed')) return 5
  let score = 0
  const essential = ['health', 'auto', 'home_renters']
  essential.forEach(v => { if (arr.includes(v)) score += 1 })
  const important = ['term_life', 'disability', 'umbrella']
  important.forEach(v => { if (arr.includes(v)) score += 1 })
  return Math.min(score, 5)
}

function scoreQ10(val) { // estate docs (multi)
  if (!val) return 0
  const arr = Array.isArray(val) ? val : [val]
  if (arr.includes('none')) return 0
  let score = 0
  arr.forEach(v => { score += 1 })
  return Math.min(score, 5)
}

function scoreQ11(val) { // written goals
  const scores = { none: 0, vague: 2, partial: 5, comprehensive: 10 }
  return scores[val] || 0
}

function scoreQ12(val) { // review frequency
  const scores = { never: 0, yearly: 3, quarterly: 7, monthly: 10 }
  return scores[val] || 0
}

const scoringFns = {
  emergency_fund: scoreQ1,
  high_interest_debt: scoreQ2,
  employer_match: scoreQ3,
  investing_approach: scoreQ4,
  investment_fees: scoreQ5,
  tax_advantaged: scoreQ6,
  budgeting: scoreQ7,
  savings_rate: scoreQ8,
  insurance: scoreQ9,
  estate_docs: scoreQ10,
  written_goals: scoreQ11,
  review_frequency: scoreQ12
}

// Tier definitions
const tiers = [
  { min: 85, label: "🏆 Financial Jedi", class: "tier-jedi", desc: "You've mastered the fundamentals and are optimizing. Focus on tax efficiency, estate planning, and giving back." },
  { min: 70, label: "🚀 Strong Foundation", class: "tier-strong", desc: "Core pillars are solid. Fine-tune: max tax-advantaged space, optimize fees, dial in insurance." },
  { min: 50, label: "📈 Building Momentum", class: "tier-building", desc: "Good progress! Priority: eliminate high-interest debt, capture full employer match, start investing in index funds." },
  { min: 30, label: "🛠️ Needs Work", class: "tier-needs", desc: "Focus on the Foundation tier: starter emergency fund ($1k), kill high-interest debt, get employer match." },
  { min: 0, label: "🚨 Crisis Mode", class: "tier-crisis", desc: "Immediate action needed: stop the bleeding, build $500 buffer, contact creditors, seek nonprofit credit counseling." }
]

// ============================================
// ROADMAP GENERATION
// ============================================

function generateRoadmap(answers, score) {
  const hasDebt = answers[2] === 'severe' || answers[2] === 'high'
  const noEmergency = answers[1] === 'none' || answers[1] === 'starter'
  const noMatch = answers[3] === 'not_contributing' || answers[3] === 'partial'
  const notInvesting = answers[4] && (Array.isArray(answers[4]) ? answers[4].includes('not_investing') : false)
  const highFees = answers[5] === 'high_fees' || answers[5] === 'unaware'
  const lowSavingsRate = answers[8] === 'negative' || answers[8] === 'zero' || answers[8] === 'low'
  const noInsurance = answers[9] && !(Array.isArray(answers[9]) && answers[9].includes('none_needed'))
  const noEstate = answers[10] && !(Array.isArray(answers[10]) && answers[10].includes('none'))
  
  const phases = []
  
  // Month 1-2: Stabilize
  if (noEmergency || hasDebt || lowSavingsRate) {
    phases.push({
      month: "Months 1–2",
      focus: "🛑 Stabilize & Stop the Bleeding",
      tasks: [
        "Track every dollar for 30 days (YNAB trial, Monarch, or spreadsheet)",
        "Build starter emergency fund: $1,000 in separate savings account",
        "List all debts with balance, APR, minimum — target highest APR first (avalanche)",
        "If debt is unmanageable: contact NFCC-certified credit counselor (nonprofit)",
        "Cancel unused subscriptions, negotiate bills, find $100–300/mo to redirect"
      ]
    })
  }
  
  // Month 3-4: Foundation
  if (noMatch || noEmergency) {
    phases.push({
      month: "Months 3–4",
      focus: "🏗️ Build the Foundation",
      tasks: [
        "Contribute enough to get FULL employer 401k match — it's 100% instant ROI",
        "Grow emergency fund to 1 month expenses, then 2 months",
        "Open Roth IRA (Fidelity/Schwab/Vanguard) if eligible — contribute monthly",
        "Switch high-fee funds to index funds (VTI, VOO, VT, FXAIX, SWTSX)",
        "Set up automatic transfers: pay yourself first on payday"
      ]
    })
  }
  
  // Month 5-6: Invest & Optimize
  if (notInvesting || highFees) {
    phases.push({
      month: "Months 5–6",
      focus: "📈 Invest & Optimize",
      tasks: [
        "If not investing: start with target-date fund or 3-fund portfolio (US/Intl/Bonds)",
        "Audit all account fees — move to <0.1% expense ratio funds",
        "Maximize tax-advantaged space: HSA → Roth IRA → 401k → taxable",
        "Set up automatic rebalancing or use target-date fund",
        "Increase 401k contribution by 1% (barely noticeable, compounds huge)"
      ]
    })
  }
  
  // Month 7-9: Protect
  if (noInsurance || noEstate) {
    phases.push({
      month: "Months 7–9",
      focus: "🛡️ Protect What You've Built",
      tasks: [
        "Get term life insurance (10–12x income) if anyone depends on your income",
        "Get own-occupation disability insurance — protects your earning power",
        "Create basic estate docs: Will, Financial POA, Medical POA, Advance Directive",
        "Update beneficiaries on ALL accounts (401k, IRA, life, bank POD/TOD)",
        "Consider umbrella policy ($1M+) if net worth > $500k or you have risk factors"
      ]
    })
  }
  
  // Month 10-12: Advanced
  phases.push({
    month: "Months 10–12",
    focus: "🚀 Advanced & Automation",
    tasks: [
      "Write down 3–5 specific financial goals with dollar amounts and deadlines",
      "Set up quarterly net worth tracking (spreadsheet or Monarch/Kubera)",
      "If eligible: Mega Backdoor Roth (after-tax 401k → in-plan Roth conversion)",
      "Tax optimization: harvest losses, bunch deductions, consider Roth conversions",
      "Schedule annual 'Financial Summit' with yourself/partner — review everything"
    ]
  })
  
  return phases
}

// ============================================
// PRIORITY ACTIONS
// ============================================

function generatePriorities(answers, categoryScores) {
  const priorities = []
  
  // Foundation priorities (highest impact)
  if (answers[1] === 'none' || answers[1] === 'starter') {
    priorities.push({
      id: 'p1',
      title: 'Build Starter Emergency Fund ($1,000)',
      description: 'Open a separate HYSA (Ally, Marcus, SoFi ~4–5% APY). Auto-transfer $50–100/paycheck until you hit $1,000. This prevents new debt when life happens.',
      effort: '2 hours setup + ongoing auto-transfer',
      impact: 'Stops the debt cycle; psychological win'
    })
  }
  
  if (answers[2] === 'severe' || answers[2] === 'high') {
    priorities.push({
      id: 'p2',
      title: 'Attack High-Interest Debt (Avalanche Method)',
      description: 'List every debt with APR. Pay minimums on all, throw every extra dollar at highest APR. Consider 0% balance transfer if credit allows. If payments are unmanageable, contact NFCC nonprofit counselor.',
      effort: 'Ongoing monthly focus',
      impact: 'Guaranteed 15–30% return — best investment possible'
    })
  }
  
  if (answers[3] === 'not_contributing' || answers[3] === 'partial') {
    priorities.push({
      id: 'p3',
      title: 'Capture Full Employer 401(k) Match',
      description: 'Log into your 401k portal today. Increase contribution to meet the match threshold (usually 3–6%). This is free money — 100% instant return. Choose target-date fund or low-cost index if unsure.',
      effort: '15 minutes one-time',
      impact: 'Instant 50–100% return on matched dollars'
    })
  }
  
  // Investing priorities
  if (answers[4] && (Array.isArray(answers[4]) ? answers[4].includes('not_investing') : false)) {
    priorities.push({
      id: 'p4',
      title: 'Start Investing in Low-Cost Index Funds',
      description: 'Open Roth IRA at Fidelity/Schwab/Vanguard. Set auto-invest $50–500/month into FXAIX (S&P 500) or FZROX (Total Market, zero fee). Time in market beats timing the market.',
      effort: '30 minutes setup + auto-monthly',
      impact: 'Compound growth — $500/mo at 8% = $734k in 30 years'
    })
  }
  
  if (answers[5] === 'high_fees' || answers[5] === 'unaware') {
    priorities.push({
      id: 'p5',
      title: 'Slash Investment Fees to < 0.1%',
      description: 'Check every fund\'s expense ratio. Replace anything > 0.2% with Vanguard/Fidelity/Schwab index funds (VTI 0.03%, FXAIX 0.015%, SWTSX 0%). In 401k, pick lowest-cost options — usually an S&P 500 or total market index.',
      effort: '1–2 hours one-time',
      impact: 'Saves tens/hundreds of thousands over lifetime'
    })
  }
  
  // Tax-advantaged
  if (answers[6] && (Array.isArray(answers[6]) ? answers[6].includes('none') : false)) {
    priorities.push({
      id: 'p6',
      title: 'Open & Fund Tax-Advantaged Accounts',
      description: 'Priority order: HSA (triple tax-free) → Roth IRA (tax-free growth) → 401k (match then max) → Taxable. Even $50/mo in Roth IRA builds the habit.',
      effort: '1 hour to open accounts',
      impact: 'Tax-free growth worth 6–7 figures over decades'
    })
  }
  
  // Cash flow
  if (answers[7] === 'no_clue' || answers[7] === 'mental') {
    priorities.push({
      id: 'p7',
      title: 'Implement a Real Budgeting System',
      description: 'Try YNAB (zero-based, 34-day trial) or Monarch Money. Give every dollar a job BEFORE the month starts. Review weekly. Awareness alone typically frees up 10–15% more for savings.',
      effort: '2–4 hours setup + 20 min/week',
      impact: 'Find hidden money; align spending with values'
    })
  }
  
  if (answers[8] === 'negative' || answers[8] === 'zero' || answers[8] === 'low') {
    priorities.push({
      id: 'p8',
      title: 'Increase Savings Rate by 1% Every Quarter',
      description: 'Automate: when you get a raise, save 50%, spend 50%. Increase 401k contribution by 1% every 3 months. You won\'t miss it. Target 20%+ savings rate.',
      effort: '5 minutes per quarter',
      impact: 'Each 1% = years earlier financial freedom'
    })
  }
  
  // Protection
  if (answers[9] && !(Array.isArray(answers[9]) ? answers[9].includes('none_needed') : false)) {
    priorities.push({
      id: 'p9',
      title: 'Close Critical Insurance Gaps',
      description: 'Health + Auto + Home/Renters are non-negotiable. If dependents: term life (10–12x income). Everyone needs disability (own-occ). Umbrella if assets > $500k. Shop: Policygenius, Zander, or independent agent.',
      effort: '2–4 hours research + application',
      impact: 'Prevents financial catastrophe from single event'
    })
  }
  
  if (answers[10] && !(Array.isArray(answers[10]) ? answers[10].includes('none') : false)) {
    priorities.push({
      id: 'p10',
      title: 'Execute Essential Estate Documents',
      description: 'Use FreeWill, Trust & Will, or attorney for: Will, Financial POA, Medical POA, Advance Directive. Update beneficiaries on ALL accounts (401k, IRA, life, bank POD/TOD) — these override your will.',
      effort: '2–4 hours (DIY) or $300–1,000 (attorney)',
      impact: 'Ensures your wishes honored; avoids probate mess'
    })
  }
  
  // Goals & Review
  if (answers[11] === 'none' || answers[11] === 'vague') {
    priorities.push({
      id: 'p11',
      title: 'Write 3 Specific Financial Goals with Numbers & Dates',
      description: 'Example: "Save $40,000 for house down payment by June 2026" not "save for house." Break into monthly targets. Track in spreadsheet or app.',
      effort: '1 hour thinking + writing',
      impact: 'Goals with numbers get achieved; vague wishes don\'t'
    })
  }
  
  if (answers[12] === 'never' || answers[12] === 'yearly') {
    priorities.push({
      id: 'p12',
      title: 'Schedule Quarterly Financial Reviews',
      description: 'Calendar invite: "Quarterly Financial Summit" — review net worth, savings rate, investment allocation, goal progress, upcoming expenses. Rebalance if off >5%. Adjust course.',
      effort: '1 hour per quarter',
      impact: 'Catches drift early; keeps you intentional'
    })
  }
  
  // Sort by impact (foundation first) and return top 3
  return priorities.slice(0, 3)
}

// ============================================
// QUIZ STATE
// ============================================

const currentStep = ref(1)
const answers = ref({ 1: [] }) // Initialize Q1 as array for multi-select
const showResults = ref(false)
const financialScore = ref(0)
const tierLabel = ref('')
const tierClass = ref('')
const tierDescription = ref('')
const categoryScores = ref([])
const topPriorities = ref([])
const roadmap = ref([])

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
      if (!newAnswers.includes(optionValue)) {
        newAnswers.push(optionValue)
      }
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
    // Initialize next multi-select question as array
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

function calculateResults() {
  // Score each question
  const scored = {}
  questions.forEach(q => {
    const key = Object.keys(scoringFns).find(k => 
      questions.indexOf(q) === Object.keys(scoringFns).indexOf(k)
    )
    if (key && scoringFns[key]) {
      scored[key] = scoringFns[key](answers.value[q.id])
    }
  })
  
  // Calculate total score
  let totalScore = 0
  let maxPossible = 0
  Object.entries(scored).forEach(([key, score]) => {
    totalScore += score
    maxPossible += weights[key] || 0
  })
  
  // Normalize to 100
  const normalizedScore = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0
  financialScore.value = normalizedScore
  
  // Determine tier
  const tier = tiers.find(t => normalizedScore >= t.min)
  tierLabel.value = tier.label
  tierClass.value = tier.class
  tierDescription.value = tier.desc
  
  // Category breakdown
  const catBreakdown = {}
  Object.entries(categoryMap).forEach(([catName, keys]) => {
    let catScore = 0
    let catMax = 0
    keys.forEach(k => {
      catScore += scored[k] || 0
      catMax += weights[k] || 0
    })
    const percent = catMax > 0 ? Math.round((catScore / catMax) * 100) : 0
    let scoreClass = 'score-low'
    if (percent >= 80) scoreClass = 'score-excellent'
    else if (percent >= 60) scoreClass = 'score-good'
    else if (percent >= 40) scoreClass = 'score-fair'
    
    let feedback = 'Needs attention'
    if (percent >= 80) feedback = 'Excellent — keep optimizing'
    else if (percent >= 60) feedback = 'Solid — minor tweaks needed'
    else if (percent >= 40) feedback = 'Building — focus on fundamentals'
    
    catBreakdown[catName] = {
      name: catName,
      icon: catName.match(/^(\S+)/)[1],
      score: catScore,
      max: catMax,
      percent,
      scoreClass,
      feedback
    }
  })
  categoryScores.value = Object.values(catBreakdown)
  
  // Top priorities
  topPriorities.value = generatePriorities(answers.value, scored)
  
  // Roadmap
  roadmap.value = generateRoadmap(answers.value, normalizedScore)
  
  showResults.value = true
}

function resetQuiz() {
  currentStep.value = 1
  answers.value = { 1: [] }
  showResults.value = false
  financialScore.value = 0
  tierLabel.value = ''
  tierClass.value = ''
  tierDescription.value = ''
  categoryScores.value = []
  topPriorities.value = []
  roadmap.value = []
}

function exportResults() {
  const date = new Date().toLocaleDateString()
  let resultsText = `FINANCIAL HEALTH QUIZ RESULTS - ${date}\n`
  resultsText += `========================================\n\n`
  
  resultsText += `Overall Score: ${financialScore.value}/100 — ${tierLabel.value}\n`
  resultsText += `${tierDescription.value}\n\n`
  
  resultsText += `Category Breakdown:\n`
  resultsText += `========================================\n`
  categoryScores.value.forEach(cat => {
    resultsText += `${cat.icon} ${cat.name}: ${cat.score}/${cat.max} (${cat.percent}%) — ${cat.feedback}\n`
  })
  resultsText += `\n`
  
  resultsText += `Top 3 Priorities:\n`
  resultsText += `========================================\n`
  topPriorities.value.forEach((p, i) => {
    resultsText += `${i + 1}. ${p.title}\n`
    resultsText += `   ${p.description}\n`
    resultsText += `   Effort: ${p.effort} | Impact: ${p.impact}\n\n`
  })
  
  resultsText += `12-Month Roadmap:\n`
  resultsText += `========================================\n`
  roadmap.value.forEach(phase => {
    resultsText += `${phase.month}: ${phase.focus}\n`
    phase.tasks.forEach(t => { resultsText += `  - ${t}\n` })
    resultsText += `\n`
  })
  
  const blob = new Blob([resultsText], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `financial-health-plan-${Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

function copyResults() {
  const topText = topPriorities.value.map(p => 
    `${p.title}: ${p.description} (Effort: ${p.effort}, Impact: ${p.impact})`
  ).join('\n\n')
  navigator.clipboard.writeText(`Financial Health Score: ${financialScore.value}/100 (${tierLabel.value})\n\nTop Priorities:\n${topText}`)
  alert('Financial plan copied to clipboard!')
}
</script>

<style scoped>
.financial-health-quiz {
  max-width: 750px;
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

/* Question Area */
.question-header { margin-bottom: 1.5rem; }
.question-category {
  display: inline-block; font-size: 0.75rem; font-weight: 700;
  padding: 0.25rem 0.75rem; background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1);
  border-radius: 20px; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;
}
.question-title { font-size: 1.4rem; margin-bottom: 0.5rem; }
.question-context { font-size: 0.9rem; color: var(--vp-c-text-2); font-style: italic; }

.options { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
.option-group { padding: 1rem; background: var(--vp-c-bg); border-radius: 12px; border: 1px solid var(--vp-c-divider); }
.option-label { display: flex; align-items: flex-start; gap: 0.75rem; cursor: pointer; width: 100%; }
.option-input { margin-top: 0.2rem; flex-shrink: 0; }
.option-text { font-weight: 500; }
.option-desc { margin: 0.5rem 0 0 1.6rem; font-size: 0.8rem; color: var(--vp-c-text-2); line-height: 1.4; }

.nav-buttons { display: flex; justify-content: space-between; gap: 1rem; }
.nav-btn { padding: 0.6rem 1.2rem; border-radius: 40px; border: none; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }
.nav-btn.back { background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); }
.nav-btn.next, .nav-btn.submit { background: var(--vp-c-brand-1); color: white; margin-left: auto; }
.nav-btn.next:hover, .nav-btn.submit:hover { transform: translateX(3px); }
.nav-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

/* Results Area */
.results-header { text-align: center; margin-bottom: 2rem; }
.results-header h2 { margin-bottom: 1rem; }

.score-circle {
  width: 140px; height: 140px; border-radius: 50%;
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  margin: 0 auto 1rem; position: relative; border: 8px solid;
}
.score-circle::before { content: ''; position: absolute; inset: -8px; border-radius: 50%; opacity: 0.15; }
.score-number { font-size: 2.5rem; font-weight: 800; line-height: 1; }
.score-label { font-size: 0.8rem; font-weight: 600; opacity: 0.8; }
.score-circle.tier-jedi { background: linear-gradient(135deg, #f1c40f, #f39c12); border-color: #f1c40f; color: #2c3e50; }
.score-circle.tier-jedi::before { background: #f1c40f; }
.score-circle.tier-strong { background: linear-gradient(135deg, #2ecc71, #27ae60); border-color: #2ecc71; color: white; }
.score-circle.tier-strong::before { background: #2ecc71; }
.score-circle.tier-building { background: linear-gradient(135deg, #3498db, #2980b9); border-color: #3498db; color: white; }
.score-circle.tier-building::before { background: #3498db; }
.score-circle.tier-needs { background: linear-gradient(135deg, #f39c12, #e67e22); border-color: #f39c12; color: white; }
.score-circle.tier-needs::before { background: #f39c12; }
.score-circle.tier-crisis { background: linear-gradient(135deg, #e74c3c, #c0392b); border-color: #e74c3c; color: white; animation: pulse 2s infinite; }
.score-circle.tier-crisis::before { background: #e74c3c; }

.tier-badge { display: inline-block; padding: 0.5rem 1.5rem; border-radius: 40px; font-weight: 700; font-size: 1rem; margin-bottom: 1rem; }
.tier-badge.tier-jedi { background: #f1c40f; color: #2c3e50; }
.tier-badge.tier-strong { background: #2ecc71; color: white; }
.tier-badge.tier-building { background: #3498db; color: white; }
.tier-badge.tier-needs { background: #f39c12; color: white; }
.tier-badge.tier-crisis { background: #e74c3c; color: white; animation: pulse 2s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }

.tier-description { color: var(--vp-c-text-2); max-width: 500px; margin: 0 auto; line-height: 1.6; }

/* Priority Actions */
.priority-actions { margin-bottom: 2rem; }
.priority-actions h3 { margin-bottom: 1rem; font-size: 1.2rem; }
.action-cards { display: flex; flex-direction: column; gap: 1rem; }
.action-card { padding: 1.25rem; background: var(--vp-c-bg); border-radius: 16px; border: 1px solid var(--vp-c-divider); display: flex; gap: 1rem; }
.action-card.priority-1 { border-left: 5px solid #e74c3c; }
.action-card.priority-2 { border-left: 5px solid #f39c12; }
.action-card.priority-3 { border-left: 5px solid #3498db; }
.priority-number { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; color: white; flex-shrink: 0; }
.action-card.priority-1 .priority-number { background: #e74c3c; }
.action-card.priority-2 .priority-number { background: #f39c12; }
.action-card.priority-3 .priority-number { background: #3498db; }
.action-content { flex: 1; }
.action-content h4 { margin: 0 0 0.5rem; font-size: 1rem; }
.action-content p { margin: 0 0 0.75rem; font-size: 0.85rem; color: var(--vp-c-text-2); line-height: 1.5; }
.action-meta { display: flex; gap: 1rem; font-size: 0.7rem; }
.effort { background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); padding: 0.15rem 0.5rem; border-radius: 4px; font-weight: 600; }
.impact { background: #27ae60; color: white; padding: 0.15rem 0.5rem; border-radius: 4px; font-weight: 600; }

/* Breakdown */
.detailed-breakdown { margin-bottom: 2rem; }
.detailed-breakdown h3 { margin-bottom: 1rem; font-size: 1.2rem; }
.breakdown-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
.breakdown-card { padding: 1.25rem; background: var(--vp-c-bg); border-radius: 14px; border: 1px solid var(--vp-c-divider); }
.breakdown-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
.cat-name { font-weight: 600; font-size: 0.9rem; }
.cat-score { font-weight: 700; font-size: 0.9rem; padding: 0.15rem 0.5rem; border-radius: 6px; }
.cat-score.score-excellent { background: #27ae60; color: white; }
.cat-score.score-good { background: #2ecc71; color: white; }
.cat-score.score-fair { background: #f39c12; color: white; }
.cat-score.score-low { background: #e74c3c; color: white; }
.breakdown-bar { height: 8px; background: var(--vp-c-bg-soft); border-radius: 4px; overflow: hidden; margin-bottom: 0.5rem; }
.breakdown-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }
.breakdown-fill.score-excellent { background: #27ae60; }
.breakdown-fill.score-good { background: #2ecc71; }
.breakdown-fill.score-fair { background: #f39c12; }
.breakdown-fill.score-low { background: #e74c3c; }
.cat-feedback { font-size: 0.75rem; color: var(--vp-c-text-2); margin: 0; }

/* Roadmap */
.personalized-roadmap { margin-bottom: 2rem; }
.personalized-roadmap h3 { margin-bottom: 1rem; font-size: 1.2rem; }
.roadmap-phases { display: flex; flex-direction: column; gap: 1rem; }
.roadmap-phase { padding: 1rem; background: var(--vp-c-bg); border-radius: 12px; border: 1px solid var(--vp-c-divider); border-left: 4px solid var(--vp-c-brand-1); }
.phase-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
.phase-month { font-weight: 700; color: var(--vp-c-brand-1); font-size: 0.9rem; }
.phase-focus { font-size: 0.8rem; color: var(--vp-c-text-2); font-weight: 500; }
.phase-tasks { margin: 0; padding-left: 1.2rem; font-size: 0.8rem; line-height: 1.6; color: var(--vp-c-text-2); }
.phase-tasks li { margin-bottom: 0.3rem; }

/* Action Buttons */
.action-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 1rem; }
.export-btn, .copy-btn, .reset-btn { padding: 0.6rem 1.2rem; border-radius: 40px; border: none; cursor: pointer; font-size: 0.85rem; transition: all 0.2s; }
.export-btn { background: #2ecc71; color: white; }
.copy-btn { background: var(--vp-c-brand-1); color: white; }
.reset-btn { background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); }

.disclaimer { text-align: center; font-size: 0.7rem; color: var(--vp-c-text-3); margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--vp-c-divider); }

/* Mobile */
@media (max-width: 640px) {
  .financial-health-quiz { padding: 1rem; margin: 1rem; }
  .question-title { font-size: 1.2rem; }
  .score-circle { width: 110px; height: 110px; }
  .score-number { font-size: 2rem; }
  .action-card { flex-direction: column; }
  .priority-number { width: 28px; height: 28px; font-size: 0.9rem; align-self: flex-start; }
  .breakdown-grid { grid-template-columns: 1fr; }
  .phase-header { flex-direction: column; align-items: flex-start; gap: 0.25rem; }
  .action-buttons { flex-direction: column; }
}
</style>