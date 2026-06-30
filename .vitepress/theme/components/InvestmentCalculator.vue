<template>
  <div class="investment-calculator">
    <!-- Tab buttons -->
    <div class="tab-buttons">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'savings' }"
        @click="switchTab('savings')"
      >
        <span class="tab-icon">🎯</span> Savings Goal
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'investment' }"
        @click="switchTab('investment')"
      >
        <span class="tab-icon">📈</span> Investment Growth
      </button>
    </div>

    <!-- Savings Goal Mode -->
    <div v-show="activeTab === 'savings'" class="mode">
      <div class="input-group">
        <label>🎯 Target Amount ($)</label>
        <input type="number" v-model="savings.target" placeholder="10000" class="input-field" min="1" />
      </div>
      <div class="input-group">
        <label>💵 Monthly Contribution ($)</label>
        <input type="number" v-model="savings.monthly" placeholder="500" class="input-field" min="1" />
      </div>
      <div class="input-group">
        <label>📊 Annual Interest Rate (%)</label>
        <input type="number" v-model="savings.rate" placeholder="5" class="input-field" min="0" max="100" step="0.5" />
      </div>
      <div v-if="error && activeTab === 'savings'" class="error-message">
        ⚠️ {{ error }}
      </div>
    </div>

    <!-- Investment Growth Mode -->
    <div v-show="activeTab === 'investment'" class="mode">
      <div class="input-group">
        <label>💰 Initial Investment ($)</label>
        <input type="number" v-model="investment.initial" placeholder="1000" class="input-field" min="0" />
      </div>
      <div class="input-group">
        <label>💵 Monthly Contribution ($)</label>
        <input type="number" v-model="investment.monthly" placeholder="200" class="input-field" min="0" />
      </div>
      <div class="input-group">
        <label>📈 Annual Return Rate (%)</label>
        <input type="number" v-model="investment.rate" placeholder="7" class="input-field" min="0" max="100" step="0.5" />
      </div>
      <div class="input-group">
        <label>⏳ Years to Grow</label>
        <input type="number" v-model="investment.years" placeholder="10" class="input-field" min="1" max="100" />
      </div>
      <div v-if="error && activeTab === 'investment'" class="error-message">
        ⚠️ {{ error }}
      </div>
    </div>

    <!-- Results -->
    <div v-if="showResults" class="results">
      <div class="result-header">
        <span class="result-icon">{{ resultIcon }}</span>
        <h3>{{ resultTitle }}</h3>
        <button class="copy-btn" @click="copyResult" title="Copy results">
          <svg v-if="!copied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </button>
      </div>
      <div
        v-for="(item, index) in resultItems"
        :key="index"
        class="result-item"
        :style="{ '--delay': `${index * 0.1}s` }"
      >
        <span class="result-label">{{ item.label }}</span>
        <strong class="result-value" :class="{ positive: item.positive }">{{ item.value }}</strong>
      </div>
      <!-- Summary bar -->
      <div v-if="summaryBar" class="summary-bar">
        <div class="summary-bar-fill" :style="{ width: summaryBar.percent }"></div>
        <span class="summary-bar-text">{{ summaryBar.text }}</span>
      </div>
    </div>

    <!-- Disclaimer -->
    <div class="info">
      <p>💡 This is for educational purposes.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InvestmentCalculator',
  data() {
    return {
      activeTab: 'savings',
      showResults: false,
      error: '',
      copied: false,
      resultIcon: '',
      resultTitle: '',
      resultItems: [],
      summaryBar: null,
      savings: {
        target: 10000,
        monthly: 500,
        rate: 5,
      },
      investment: {
        initial: 1000,
        monthly: 200,
        rate: 7,
        years: 10,
      },
    }
  },
  watch: {
    'savings.target': 'autoCalculateSavings',
    'savings.monthly': 'autoCalculateSavings',
    'savings.rate': 'autoCalculateSavings',
    'investment.initial': 'autoCalculateInvestment',
    'investment.monthly': 'autoCalculateInvestment',
    'investment.rate': 'autoCalculateInvestment',
    'investment.years': 'autoCalculateInvestment',
  },
  mounted() {
    this.calculateSavings()
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
    },
    switchTab(tab) {
      this.activeTab = tab
      this.showResults = false
      this.error = ''
    },
    autoCalculateSavings() {
      if (this.activeTab !== 'savings') return
      this.calculateSavings()
    },
    calculateSavings() {
      const { target, monthly, rate } = this.savings
      if (!target || !monthly || !rate || monthly <= 0 || target <= 0) {
        this.error = 'Please enter valid positive numbers for all fields.'
        this.showResults = false
        return
      }
      this.error = ''
      const monthlyRate = rate / 100 / 12
      let months = 0
      let balance = 0
      const maxMonths = 600
      while (balance < target && months < maxMonths) {
        balance = (balance + monthly) * (1 + monthlyRate)
        months++
      }
      const years = Math.floor(months / 12)
      const remainingMonths = months % 12
      const totalContributions = monthly * months
      const interestEarned = balance - totalContributions

      this.resultIcon = '📊'
      this.resultTitle = 'Savings Results'
      this.resultItems = [
        { label: 'Target Amount', value: this.formatCurrency(target) },
        { label: 'Time to Reach Goal', value: `${years} year${years !== 1 ? 's' : ''}${remainingMonths > 0 ? ` and ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}` : ''}` },
        { label: 'Total Contributions', value: this.formatCurrency(totalContributions) },
        { label: 'Interest Earned', value: `+${this.formatCurrency(interestEarned)}`, positive: true },
      ]
      const progress = Math.min((totalContributions / target) * 100, 100)
      this.summaryBar = {
        percent: `${progress.toFixed(0)}%`,
        text: `${progress.toFixed(0)}% of target covered by contributions alone`,
      }
      this.showResults = true
    },
    autoCalculateInvestment() {
      if (this.activeTab !== 'investment') return
      this.calculateInvestment()
    },
    calculateInvestment() {
      const { initial, monthly, rate, years } = this.investment
      if (!initial || !monthly || !rate || !years || years <= 0) {
        this.error = 'Please enter valid positive numbers for all fields.'
        this.showResults = false
        return
      }
      this.error = ''
      const monthlyRate = rate / 100 / 12
      const months = years * 12
      let balance = initial
      for (let i = 0; i < months; i++) {
        balance = (balance + monthly) * (1 + monthlyRate)
      }
      const totalContributions = initial + monthly * months
      const growth = balance - totalContributions

      this.resultIcon = '📈'
      this.resultTitle = 'Investment Growth'
      this.resultItems = [
        { label: 'Initial Investment', value: this.formatCurrency(initial) },
        { label: 'Total Contributions', value: this.formatCurrency(totalContributions) },
        { label: 'Final Balance', value: this.formatCurrency(balance) },
        { label: 'Total Growth', value: `+${this.formatCurrency(growth)}`, positive: true },
      ]
      const growthRatio = (growth / totalContributions) * 100
      this.summaryBar = {
        percent: `${Math.min(growthRatio, 100).toFixed(0)}%`,
        text: `Growth is ${growthRatio.toFixed(0)}% of total contributions`,
      }
      this.showResults = true
    },
    copyResult() {
      const lines = this.resultItems.map(i => `${i.label}: ${i.value}`).join('\n')
      navigator.clipboard.writeText(`${this.resultTitle}\n${lines}`)
      this.copied = true
      setTimeout(() => { this.copied = false }, 1500)
    }
  }
}
</script>

<style scoped>
/* ── No card — just content ── */
.investment-calculator {
  max-width: 540px;
  margin: 2rem auto;
  padding: 0;
  background: transparent;
}

/* ── Tabs ── */
.tab-buttons {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
}
.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.6rem 1rem;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
  background: transparent;
  color: rgba(255,255,255,0.4);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.tab-btn:hover {
  color: rgba(255,255,255,0.7);
  background: rgba(255,255,255,0.02);
}
.tab-btn.active {
  color: #fff;
  background: rgba(99,102,241,0.12);
  border-color: rgba(99,102,241,0.2);
}
.tab-icon {
  font-size: 0.9rem;
}

/* ── Inputs ── */
.mode {
  animation: fadeIn 0.2s ease;
}
.input-group {
  margin-bottom: 0.75rem;
}
.input-group label {
  display: block;
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(255,255,255,0.4);
  margin-bottom: 0.2rem;
}
.input-field {
  width: 100%;
  padding: 0.5rem 0.6rem;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);
  color: rgba(255,255,255,0.9);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.input-field::placeholder {
  color: rgba(255,255,255,0.15);
}
.input-field:focus {
  border-color: rgba(99,102,241,0.3);
  background: rgba(255,255,255,0.03);
}

/* ── Error message ── */
.error-message {
  margin-top: 0.75rem;
  padding: 0.55rem 0.85rem;
  border-radius: 8px;
  font-size: 0.82rem;
  color: #f87171;
  text-align: center;
  background: rgba(248, 113, 113, 0.08);
  border: 1px solid rgba(248, 113, 113, 0.15);
  animation: fadeIn 0.3s ease;
}

/* ── Copy button ── */
.copy-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  margin-left: auto;
}

.copy-btn:hover {
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.06);
}

/* ── Button ── */
.calc-btn {
  width: 100%;
  padding: 0.6rem;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15));
  color: rgba(255,255,255,0.8);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.calc-btn:hover {
  background: linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2));
  transform: translateY(-1px);
}
.calc-btn:active {
  transform: scale(0.98);
}

/* ── Results ── */
.results {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255,255,255,0.04);
  animation: fadeIn 0.3s ease;
}
.result-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
}
.result-icon {
  font-size: 1.2rem;
}
.result-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: rgba(255,255,255,0.8);
}
.result-item {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  animation: fadeSlideIn 0.25s ease var(--delay, 0s) both;
}
.result-item:last-child {
  border-bottom: none;
}
.result-label {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.4);
}
.result-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255,255,255,0.8);
}
.result-value.positive {
  color: #4ade80;
}

/* ── Summary Bar ── */
.summary-bar {
  margin-top: 0.75rem;
  padding: 0.3rem 0.4rem;
  border-radius: 6px;
  background: rgba(255,255,255,0.02);
  position: relative;
  overflow: hidden;
}
.summary-bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05));
  border-radius: 6px;
  transition: width 0.6s ease;
}
.summary-bar-text {
  position: relative;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.3);
  font-weight: 500;
}

/* ── Disclaimer ── */
.info {
  margin-top: 1.25rem;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.15);
  text-align: center;
}

/* ── Animations ── */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateX(-6px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>