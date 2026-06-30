<template>
  <div class="bs-container">
    <!-- Glass card -->
    <div class="bs-card glass">
      <!-- Header -->
      <div class="bs-header">
        <span class="bs-icon">💸</span>
        <h3 class="bs-title">Bill Split Calculator</h3>
        <span class="bs-badge" :style="{
          background: people > 0 ? '#3498db' : 'rgba(255,255,255,0.1)'
        }">
          {{ people }} {{ people === 1 ? 'person' : 'people' }}
        </span>
      </div>

      <!-- Total bill -->
      <div class="bs-field glass-field">
        <label>💵 Total bill amount</label>
        <div class="bs-input-wrap">
          <span class="bs-currency">$</span>
          <input
            v-model.number="total"
            type="number"
            min="0"
            step="0.01"
            class="bs-input glass-input"
            placeholder="0.00"
            @focus="selectAll"
          />
        </div>
      </div>

      <!-- Tip percentage -->
      <div class="bs-field glass-field">
        <label>💡 Tip percentage</label>
        <div class="tip-row">
          <button
            v-for="t in [15, 18, 20, 25]"
            :key="t"
            class="tip-btn glass-btn"
            :class="{ active: tip === t }"
            @click="tip = t"
          >
            {{ t }}%
          </button>
          <input
            v-model.number="tip"
            type="number"
            min="0"
            max="100"
            class="bs-input tip-input glass-input"
            placeholder="Custom"
            @focus="selectAll"
          />
        </div>
      </div>

      <!-- Number of people -->
      <div class="bs-field glass-field">
        <label>👥 Number of people</label>
        <div class="people-row">
          <button class="people-btn glass-btn" @click="people = Math.max(1, people - 1)">
            <span class="btn-symbol">−</span>
          </button>
          <span class="people-count">{{ people }}</span>
          <button class="people-btn glass-btn" @click="people++">
            <span class="btn-symbol">+</span>
          </button>
        </div>
      </div>

      <!-- Results -->
      <div v-if="total > 0" class="bs-result glass">
        <div class="result-item" :style="{ '--delay': '0.05s' }">
          <span class="result-label">Tip amount</span>
          <span class="result-value">${{ tipAmount }}</span>
        </div>
        <div class="result-item" :style="{ '--delay': '0.1s' }">
          <span class="result-label">Total with tip</span>
          <span class="result-value">${{ totalWithTip }}</span>
        </div>
        <div class="result-item highlight" :style="{ '--delay': '0.15s' }">
          <span class="result-label">Per person</span>
          <span class="result-value per-person-value">${{ perPerson }}</span>
        </div>

        <!-- Quick breakdown bar -->
        <div class="breakdown-bar">
          <div class="breakdown-fill" :style="{
            width: tipPercentOfTotal + '%',
            background: `linear-gradient(90deg, #2ecc71, #3498db)`
          }"></div>
          <span class="breakdown-label">Tip is {{ tipPercentOfTotal }}% of total</span>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="bs-empty">
        <span class="empty-icon">🧾</span>
        <p>Enter a bill amount to start splitting</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BillSplitCalculator',
  data() {
    return {
      total: 0,
      tip: 20,
      people: 2,
    }
  },
  computed: {
    tipAmount() {
      return (this.total * this.tip / 100).toFixed(2)
    },
    totalWithTip() {
      return (this.total + this.total * this.tip / 100).toFixed(2)
    },
    perPerson() {
      const t = this.total + this.total * this.tip / 100
      return (t / this.people).toFixed(2)
    },
    tipPercentOfTotal() {
      if (this.total === 0) return 0
      return Math.round((this.total * this.tip / 100) / this.total * 100)
    }
  },
  methods: {
    selectAll(e) {
      e.target.select()
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
.bs-container {
  max-width: 440px;
  margin: 2rem auto;
}

.bs-card {
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

.bs-card::before {
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
.bs-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.bs-icon {
  font-size: 2rem;
  line-height: 1;
  filter: drop-shadow(0 2px 8px rgba(52, 152, 219, 0.3));
}

.bs-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3498db, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex: 1;
}

.bs-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.7rem;
  border-radius: 20px;
  color: #fff;
  background: #3498db;
  box-shadow: 0 0 16px rgba(52, 152, 219, 0.2);
  transition: background 0.3s, box-shadow 0.3s;
  white-space: nowrap;
}

/* ── Fields ── */
.bs-field {
  margin-bottom: 1rem;
}

.glass-field {
  padding: 0.85rem 1rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.glass-field:focus-within {
  border-color: rgba(52, 152, 219, 0.3);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.08);
  transform: scale(1.02);
}

.bs-field label {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.4rem;
  letter-spacing: 0.02em;
}

.bs-input-wrap {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: border-color 0.3s;
}

.bs-input-wrap:focus-within {
  border-color: rgba(52, 152, 219, 0.3);
}

.bs-currency {
  padding: 0.6rem 0 0.6rem 0.8rem;
  color: rgba(255, 255, 255, 0.3);
  font-weight: 700;
  font-size: 0.95rem;
}

.bs-input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 1rem;
  outline: none;
  font-family: 'SF Mono', 'Fira Code', monospace;
}

.bs-input::placeholder {
  color: rgba(255, 255, 255, 0.2);
}

.tip-input {
  width: 80px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  padding: 0.4rem;
}

.tip-input:focus {
  border-color: rgba(52, 152, 219, 0.3);
}

.tip-row {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  align-items: center;
}

.tip-btn {
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tip-btn:hover {
  transform: translateY(-2px);
  border-color: rgba(52, 152, 219, 0.3);
  color: rgba(255, 255, 255, 0.8);
}

.tip-btn.active {
  background: rgba(52, 152, 219, 0.25);
  border-color: rgba(52, 152, 219, 0.4);
  color: #3498db;
  box-shadow: 0 0 16px rgba(52, 152, 219, 0.1);
}

/* ── People controls ── */
.people-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.people-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-size: 1.2rem;
}

.people-btn:hover {
  transform: scale(1.1);
  border-color: rgba(52, 152, 219, 0.4);
  background: rgba(52, 152, 219, 0.1);
  color: #fff;
}

.people-btn:active {
  transform: scale(0.9);
}

.btn-symbol {
  line-height: 1;
}

.people-count {
  font-size: 1.5rem;
  font-weight: 700;
  min-width: 2.5rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  font-variant-numeric: tabular-nums;
}

/* ── Results ── */
.bs-result {
  margin-top: 1.25rem;
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  animation: bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.result-item {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  animation: fadeSlideIn 0.3s ease var(--delay, 0s) both;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.result-item:last-of-type {
  border-bottom: none;
}

.result-item.highlight {
  padding: 0.6rem 0 0.2rem;
  font-size: 1.1rem;
  border-bottom: none;
}

.result-label {
  font-weight: 500;
}

.result-value {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'SF Mono', 'Fira Code', monospace;
}

.per-person-value {
  font-size: 1.3rem;
  color: #2ecc71;
  text-shadow: 0 0 20px rgba(46, 204, 113, 0.2);
}

/* ── Breakdown bar ── */
.breakdown-bar {
  margin-top: 0.8rem;
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.04);
  position: relative;
  overflow: hidden;
}

.breakdown-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  border-radius: 8px;
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: 0.15;
}

.breakdown-label {
  position: relative;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.3);
  font-weight: 500;
  letter-spacing: 0.02em;
}

/* ── Empty state ── */
.bs-empty {
  text-align: center;
  padding: 1rem 0 0.5rem;
  color: rgba(255, 255, 255, 0.2);
}

.empty-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.3rem;
  opacity: 0.5;
}

.bs-empty p {
  margin: 0;
  font-size: 0.85rem;
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

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>