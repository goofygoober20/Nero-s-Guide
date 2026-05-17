# 📈 Investment & Savings Calculator

<div class="investment-calculator">
  <div class="calculator-card">
    <div class="tab-buttons">
      <button id="savingsTab" class="tab-btn active">Savings Goal</button>
      <button id="investmentTab" class="tab-btn">Investment Growth</button>
    </div>

<!-- Savings Goal Mode -->
<div id="savingsMode" class="mode active">
      <div class="input-group">
        <label>Target Amount ($):</label>
        <input type="number" id="targetAmount" placeholder="e.g., 10000" value="10000">
      </div>
      <div class="input-group">
        <label>Monthly Contribution ($):</label>
        <input type="number" id="monthlyContribution" placeholder="e.g., 500" value="500">
      </div>
      <div class="input-group">
        <label>Annual Interest Rate (%):</label>
        <input type="number" id="savingsRate" placeholder="e.g., 5" value="5" step="0.5">
      </div>
      <button id="calculateSavingsBtn" class="calculate-btn">Calculate</button>
    </div>

<!-- Investment Growth Mode -->
<div id="investmentMode" class="mode">
      <div class="input-group">
        <label>Initial Investment ($):</label>
        <input type="number" id="initialInvestment" placeholder="e.g., 1000" value="1000">
      </div>
      <div class="input-group">
        <label>Monthly Contribution ($):</label>
        <input type="number" id="investMonthly" placeholder="e.g., 200" value="200">
      </div>
      <div class="input-group">
        <label>Annual Return Rate (%):</label>
        <input type="number" id="returnRate" placeholder="e.g., 7" value="7" step="0.5">
      </div>
      <div class="input-group">
        <label>Years to Grow:</label>
        <input type="number" id="years" placeholder="e.g., 10" value="10">
      </div>
      <button id="calculateInvestmentBtn" class="calculate-btn">Calculate</button>
    </div>

 <div id="results" class="results" style="display: none;">
      <div id="resultContent"></div>
    </div>

   <div class="info">
      <p>💡 Disclaimer: This is for educational purposes. Past performance doesn't guarantee future results.</p>
    </div>
  </div>
</div>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const savingsTab = document.getElementById('savingsTab')
  const investmentTab = document.getElementById('investmentTab')
  const savingsMode = document.getElementById('savingsMode')
  const investmentMode = document.getElementById('investmentMode')
  const calculateSavingsBtn = document.getElementById('calculateSavingsBtn')
  const calculateInvestmentBtn = document.getElementById('calculateInvestmentBtn')
  const resultsDiv = document.getElementById('results')
  const resultContent = document.getElementById('resultContent')

  function switchMode(mode) {
    if (mode === 'savings') {
      savingsTab.classList.add('active')
      investmentTab.classList.remove('active')
      savingsMode.classList.add('active')
      investmentMode.classList.remove('active')
    } else {
      savingsTab.classList.remove('active')
      investmentTab.classList.add('active')
      savingsMode.classList.remove('active')
      investmentMode.classList.add('active')
    }
    resultsDiv.style.display = 'none'
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  function calculateSavingsGoal() {
    const target = parseFloat(document.getElementById('targetAmount').value)
    const monthly = parseFloat(document.getElementById('monthlyContribution').value)
    const rate = parseFloat(document.getElementById('savingsRate').value) / 100 / 12

    if (isNaN(target) || isNaN(monthly) || monthly <= 0) {
      alert('Please enter valid numbers')
      return
    }

    let months = 0
    let balance = 0

    while (balance < target && months < 600) {
      balance = (balance + monthly) * (1 + rate)
      months++
    }

    const years = Math.floor(months / 12)
    const remainingMonths = months % 12

    resultContent.innerHTML = `
      <div class="result-card">
        <h3>📊 Results</h3>
        <div class="result-item">
          <span>Target Amount:</span>
          <strong>${formatCurrency(target)}</strong>
        </div>
        <div class="result-item">
          <span>Time to Reach Goal:</span>
          <strong>${years} years${remainingMonths > 0 ? ` and ${remainingMonths} months` : ''}</strong>
        </div>
        <div class="result-item">
          <span>Total Contributions:</span>
          <strong>${formatCurrency(monthly * months)}</strong>
        </div>
        <div class="result-item">
          <span>Interest Earned:</span>
          <strong>${formatCurrency(balance - (monthly * months))}</strong>
        </div>
      </div>
    `
    resultsDiv.style.display = 'block'
  }

  function calculateInvestment() {
    const initial = parseFloat(document.getElementById('initialInvestment').value)
    const monthly = parseFloat(document.getElementById('investMonthly').value)
    const rate = parseFloat(document.getElementById('returnRate').value) / 100 / 12
    const years = parseFloat(document.getElementById('years').value)

    if (isNaN(initial) || isNaN(monthly) || isNaN(rate) || isNaN(years)) {
      alert('Please enter valid numbers')
      return
    }

    const months = years * 12
    let balance = initial

    for (let i = 0; i < months; i++) {
      balance = (balance + monthly) * (1 + rate)
    }

    const totalContributions = initial + (monthly * months)

    resultContent.innerHTML = `
      <div class="result-card">
        <h3>📈 Investment Growth</h3>
        <div class="result-item">
          <span>Initial Investment:</span>
          <strong>${formatCurrency(initial)}</strong>
        </div>
        <div class="result-item">
          <span>Total Contributions:</span>
          <strong>${formatCurrency(totalContributions)}</strong>
        </div>
        <div class="result-item">
          <span>Final Balance:</span>
          <strong>${formatCurrency(balance)}</strong>
        </div>
        <div class="result-item">
          <span>Total Growth:</span>
          <strong style="color: #2ecc71;">+${formatCurrency(balance - totalContributions)}</strong>
        </div>
      </div>
    `
    resultsDiv.style.display = 'block'
  }

  savingsTab.addEventListener('click', () => switchMode('savings'))
  investmentTab.addEventListener('click', () => switchMode('investment'))
  calculateSavingsBtn.addEventListener('click', calculateSavingsGoal)
  calculateInvestmentBtn.addEventListener('click', calculateInvestment)
})
</script>

<style scoped>
.investment-calculator {
  max-width: 500px;
  margin: 0 auto;
}

.calculator-card {
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--vp-c-divider);
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

.result-card {
  padding: 1rem;
  background: var(--vp-c-bg);
  border-radius: 8px;
}

.result-card h3 {
  margin: 0 0 1rem;
}

.result-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.result-item:last-child {
  border-bottom: none;
}

.info {
  margin-top: 1rem;
  font-size: 0.7rem;
  color: var(--vp-c-text-2);
  text-align: center;
}
</style>