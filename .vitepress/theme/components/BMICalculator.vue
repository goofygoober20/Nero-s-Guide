<template>
  <div class="bmi-calculator">
    <!-- Glass card -->
    <div class="calculator-card glass">
      <!-- Header -->
      <div class="card-header">
        <span class="header-icon">⚖️</span>
        <h3 class="header-title">BMI Calculator</h3>
      </div>

      <!-- Input fields -->
      <div class="input-group glass-field">
        <label>⚖️ Weight (kg)</label>
        <input
          type="number"
          v-model.number="weight"
          placeholder="e.g., 70"
          class="glass-input"
          min="1"
          step="0.1"
        />
      </div>

      <div class="input-group glass-field">
        <label>📏 Height (cm)</label>
        <input
          type="number"
          v-model.number="height"
          placeholder="e.g., 175"
          class="glass-input"
          min="1"
          step="0.1"
        />
      </div>

      <!-- Inline error -->
      <div v-if="error" class="error-message glass">
        ⚠️ {{ error }}
      </div>

      <!-- Results (shown after calculation) -->
      <div v-if="showResult" class="result glass">
        <div class="result-header">
          <span class="result-icon" :style="{ color: bmiColor }">●</span>
          <span class="result-bmi">BMI: <strong>{{ bmiFormatted }}</strong></span>
          <button class="copy-btn" @click="copyResult" title="Copy result">
            <svg v-if="!copied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </button>
        </div>

        <!-- BMI Gauge -->
        <div class="bmi-gauge">
          <div class="gauge-track">
            <div
              class="gauge-fill"
              :style="{
                width: gaugePercent + '%',
                background: `linear-gradient(90deg, #3498db, ${bmiColor})`
              }"
            ></div>
          </div>
          <div class="gauge-labels">
            <span>Underweight</span>
            <span>Normal</span>
            <span>Overweight</span>
            <span>Obese</span>
          </div>
        </div>

        <!-- Category & Tip -->
        <div class="result-category" :style="{ color: bmiColor }">
          {{ bmiCategory }} {{ bmiEmoji }}
        </div>
        <div class="result-tip" v-if="healthTip">
          💡 {{ healthTip }}
        </div>
      </div>

      <!-- Disclaimer -->
      <div class="disclaimer">
        ℹ️ For adults only. Consult a healthcare professional for medical advice.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BMICalculator',
  data() {
    return {
      weight: 70,
      height: 175,
      showResult: false,
      error: '',
      copied: false,
      bmi: 0,
      bmiCategory: '',
      bmiColor: '#3498db',
      bmiEmoji: '',
      healthTip: ''
    }
  },
  computed: {
    bmiFormatted() {
      return this.bmi.toFixed(1)
    },
    gaugePercent() {
      // Map BMI 10-40 to 0-100%
      const min = 10, max = 40
      let pct = ((this.bmi - min) / (max - min)) * 100
      return Math.min(Math.max(pct, 0), 100)
    }
  },
  watch: {
    weight: 'autoCalculate',
    height: 'autoCalculate'
  },
  mounted() {
    this.autoCalculate()
  },
  methods: {
    autoCalculate() {
      const w = this.weight
      const h = this.height ? this.height / 100 : null

      if (!w || !h || w <= 0 || h <= 0) {
        this.error = 'Please enter valid positive numbers for weight and height.'
        this.showResult = false
        return
      }

      this.error = ''
      this.bmi = w / (h * h)

      // Determine category and color
      if (this.bmi < 18.5) {
        this.bmiCategory = 'Underweight'
        this.bmiColor = '#3498db'
        this.bmiEmoji = '⚠️'
        this.healthTip = 'Consider a balanced diet to reach a healthy weight. Consult a nutritionist.'
      } else if (this.bmi < 25) {
        this.bmiCategory = 'Normal weight'
        this.bmiColor = '#2ecc71'
        this.bmiEmoji = '💪'
        this.healthTip = 'Great! Maintain your healthy lifestyle with balanced nutrition and exercise.'
      } else if (this.bmi < 30) {
        this.bmiCategory = 'Overweight'
        this.bmiColor = '#f39c12'
        this.bmiEmoji = '📈'
        this.healthTip = 'Try incorporating more physical activity and monitor your calorie intake.'
      } else {
        this.bmiCategory = 'Obese'
        this.bmiColor = '#e74c3c'
        this.bmiEmoji = '⚠️'
        this.healthTip = 'Please consult a healthcare professional for personalized guidance.'
      }

      this.showResult = true
    },
    copyResult() {
      const text = `BMI: ${this.bmiFormatted} — ${this.bmiCategory}`
      navigator.clipboard.writeText(text)
      this.copied = true
      setTimeout(() => { this.copied = false }, 1500)
    }
  }
}
</script>

<style scoped>
/* ── Glass base ── */
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

/* ── Container ── */
.bmi-calculator {
  max-width: 440px;
  margin: 2rem auto;
}

.calculator-card {
  padding: 2rem 1.5rem;
  border-radius: 20px;
  background: linear-gradient(145deg, rgba(30, 30, 40, 0.6), rgba(20, 20, 30, 0.4));
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  overflow: hidden;
  animation: bounceIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.calculator-card::before {
  content: '';
  position: absolute;
  top: -60%;
  right: -20%;
  width: 140%;
  height: 140%;
  background: radial-gradient(circle at 70% 30%, rgba(52, 152, 219, 0.08), transparent 70%);
  pointer-events: none;
}

/* ── Header ── */
.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.header-icon {
  font-size: 2rem;
  line-height: 1;
  filter: drop-shadow(0 2px 8px rgba(52, 152, 219, 0.3));
}

.header-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3498db, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Input fields ── */
.input-group {
  margin-bottom: 1rem;
}

.glass-field {
  padding: 0.85rem 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.glass-field:focus-within {
  border-color: rgba(52, 152, 219, 0.5);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.15);
  transform: scale(1.02);
}

.input-group label {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.45rem;
  letter-spacing: 0.02em;
}

.glass-input {
  width: 100%;
  padding: 0.6rem 0.85rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.glass-input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.glass-input:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(52, 152, 219, 0.3);
}

/* ── Calculate button ── */
.calculate-btn {
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.glass-btn {
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.4), rgba(46, 204, 113, 0.35));
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(52, 152, 219, 0.3);
  color: #fff;
  box-shadow: 0 4px 16px rgba(52, 152, 219, 0.15);
}

.glass-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 32px rgba(52, 152, 219, 0.25);
  border-color: rgba(52, 152, 219, 0.5);
}

.glass-btn:active {
  transform: translateY(0) scale(0.98);
}

.btn-icon {
  font-size: 1.1rem;
}

/* ── Error message ── */
.error-message {
  margin-top: 1rem;
  padding: 0.65rem 1rem;
  border-radius: 10px;
  font-size: 0.85rem;
  color: #f87171;
  text-align: center;
  background: rgba(248, 113, 113, 0.08);
  border: 1px solid rgba(248, 113, 113, 0.15);
  animation: bounceIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
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

/* ── Results ── */
.result {
  margin-top: 1.5rem;
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  animation: bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.result-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.result-icon {
  font-size: 1.4rem;
  line-height: 1;
}

.result-bmi {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
}

.result-bmi strong {
  font-weight: 700;
  font-size: 1.3rem;
  color: #fff;
}

/* ── BMI Gauge ── */
.bmi-gauge {
  margin: 1rem 0;
}

.gauge-track {
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
  position: relative;
}

.gauge-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.gauge-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.3);
  margin-top: 0.25rem;
  padding: 0 0.2rem;
}

.gauge-labels span {
  white-space: nowrap;
}

/* ── Category & Tip ── */
.result-category {
  font-size: 1.1rem;
  font-weight: 700;
  text-align: center;
  margin: 0.5rem 0;
}

.result-tip {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  line-height: 1.5;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  margin-top: 0.5rem;
}

/* ── Disclaimer ── */
.disclaimer {
  margin-top: 1.25rem;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.3);
  text-align: center;
  line-height: 1.5;
}

/* ── Animations ── */
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.85) translateY(12px);
  }
  50% {
    transform: scale(1.02) translateY(-2px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>