<template>
  <div class="uc-container">
    <!-- Glass card -->
    <div class="uc-card glass">
      <!-- Header -->
      <div class="uc-header">
        <span class="uc-icon">📐</span>
        <h3 class="uc-title">Unit Converter</h3>
      </div>

      <!-- Category tabs -->
      <div class="uc-tabs">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="uc-tab glass-tab"
          :class="{ active: activeCategory === cat.id }"
          @click="activeCategory = cat.id"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- Converter -->
      <div class="uc-converter">
        <div class="uc-field glass-field">
          <input
            type="number"
            v-model.number="fromValue"
            class="uc-input glass-input"
            min="0"
            step="any"
            @focus="selectAll"
          />
          <select v-model="fromUnit" class="uc-select glass-select">
            <option v-for="u in currentUnits" :key="u" :value="u">{{ u }}</option>
          </select>
        </div>

        <button class="uc-swap-btn glass-btn" @click="swapUnits" aria-label="Swap units">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="17 1 21 5 17 9"/>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
            <polyline points="7 23 3 19 7 15"/>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
          </svg>
        </button>

        <div class="uc-field glass-field">
          <input
            type="text"
            :value="formattedResult"
            class="uc-input glass-input result-input"
            readonly
            @click="copyResult"
          />
          <select v-model="toUnit" class="uc-select glass-select">
            <option v-for="u in currentUnits" :key="u" :value="u">{{ u }}</option>
          </select>
        </div>

        <div v-if="resultCopied" class="uc-copied-toast glass">
          ✅ Copied!
        </div>
      </div>

      <!-- Quick reference (optional) -->
      <div v-if="showReference" class="uc-reference glass">
        <span>{{ referenceText }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UnitConverter',
  data() {
    return {
      categories: [
        { id: 'length', label: 'Length' },
        { id: 'mass', label: 'Mass' },
        { id: 'volume', label: 'Volume' },
        { id: 'temp', label: 'Temperature' },
      ],
      activeCategory: 'length',
      fromUnit: 'm',
      toUnit: 'ft',
      fromValue: 1,
      resultCopied: false,
      tempToastShown: false,
      copyTimeout: null,
    }
  },
  computed: {
    units() {
      return {
        length: { base: 'm', values: { 'mm': 0.001, 'cm': 0.01, 'm': 1, 'km': 1000, 'in': 0.0254, 'ft': 0.3048, 'yd': 0.9144, 'mi': 1609.344 } },
        mass: { base: 'g', values: { 'mg': 0.001, 'g': 1, 'kg': 1000, 'oz': 28.3495, 'lb': 453.592, 'st': 6350.29 } },
        volume: { base: 'L', values: { 'mL': 0.001, 'L': 1, 'gal': 3.78541, 'qt': 0.946353, 'pt': 0.473176, 'cup': 0.236588, 'fl oz': 0.0295735, 'tbsp': 0.0147868, 'tsp': 0.00492892 } },
        temp: { base: '°C', values: { '°C': 1, '°F': 1, 'K': 1 } },
      }
    },
    currentUnits() {
      return Object.keys(this.units[this.activeCategory]?.values || {})
    },
    resultValue() {
      return this.convert(this.fromValue || 0, this.fromUnit, this.toUnit, this.activeCategory)
    },
    formattedResult() {
      const v = this.resultValue
      if (typeof v === 'number' && !Number.isInteger(v)) {
        return parseFloat(v.toFixed(6)).toString()
      }
      return v.toString()
    },
    persistableState() {
      return {
        activeCategory: this.activeCategory,
        fromUnit: this.fromUnit,
        toUnit: this.toUnit,
        fromValue: this.fromValue,
      }
    },
    showReference() {
      // Show a fun fact for temperature conversions
      if (this.activeCategory === 'temp') {
        const v = this.fromValue
        const u = this.fromUnit
        if (u === '°C' && v === 0) return 'Water freezes at 0°C'
        if (u === '°C' && v === 100) return 'Water boils at 100°C'
        if (u === '°C' && v === 37) return 'Human body temperature'
        if (u === '°F' && v === 32) return 'Water freezes at 32°F'
        if (u === '°F' && v === 212) return 'Water boils at 212°F'
        if (u === '°F' && v === 98.6) return 'Human body temperature'
        if (u === 'K' && v === 273.15) return 'Water freezes at 273.15 K'
        if (u === 'K' && v === 373.15) return 'Water boils at 373.15 K'
        return ''
      }
      return ''
    },
    referenceText() {
      return this.showReference || ''
    }
  },
  watch: {
    persistableState: {
      handler(val) {
        localStorage.setItem('unit-converter-state', JSON.stringify(val))
      },
      deep: true,
    },
    activeCategory(cat) {
      const keys = Object.keys(this.units[cat]?.values || {})
      if (keys.length >= 2) {
        this.fromUnit = keys[0]
        this.toUnit = keys[1]
      }
      this.tempToastShown = false
    },
    fromValue() {
      this.tempToastShown = false
      this.showTempEasterEgg()
    },
    fromUnit() {
      this.tempToastShown = false
      this.showTempEasterEgg()
    },
  },
  mounted() {
    const saved = localStorage.getItem('unit-converter-state')
    if (saved) {
      try {
        const s = JSON.parse(saved)
        this.activeCategory = s.activeCategory ?? 'length'
        this.fromUnit = s.fromUnit ?? 'm'
        this.toUnit = s.toUnit ?? 'ft'
        this.fromValue = s.fromValue ?? 1
      } catch {
        this.fromUnit = 'm'
        this.toUnit = 'ft'
      }
    } else {
      this.fromUnit = 'm'
      this.toUnit = 'ft'
    }
    document.addEventListener('keydown', this.handleKeydown)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydown)
    if (this.copyTimeout) clearTimeout(this.copyTimeout)
  },
  methods: {
    convert(value, from, to, cat) {
      if (cat === 'temp') {
        if (from === to) return value
        let celsius
        if (from === '°C') celsius = value
        else if (from === '°F') celsius = (value - 32) * 5 / 9
        else if (from === 'K') celsius = value - 273.15

        if (to === '°C') return celsius
        if (to === '°F') return celsius * 9 / 5 + 32
        if (to === 'K') return celsius + 273.15
        return value
      }

      const u = this.units[cat]
      const baseFrom = from === u.base ? value : value * (u.values[from] || 1)
      const baseTo = to === u.base ? 1 : (u.values[to] || 1)
      return baseFrom / baseTo
    },
    swapUnits() {
      const tmp = this.fromUnit
      this.fromUnit = this.toUnit
      this.toUnit = tmp
    },
    selectAll(e) {
      e.target.select()
    },
    async copyResult() {
      if (!this.resultValue && this.resultValue !== 0) return
      const text = this.formattedResult
      try {
        await navigator.clipboard.writeText(text)
        this.showCopiedToast()
      } catch {
        // Fallback
        const ta = document.createElement('textarea')
        ta.value = text
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        this.showCopiedToast()
      }
    },
    showCopiedToast() {
      this.resultCopied = true
      if (this.copyTimeout) clearTimeout(this.copyTimeout)
      this.copyTimeout = setTimeout(() => {
        this.resultCopied = false
      }, 2000)
    },
    showTempEasterEgg() {
      if (this.activeCategory !== 'temp') return
      const v = this.fromValue
      const u = this.fromUnit
      let msg = ''
      let color = ''
      if (u === '°C' && v === 42) { msg = 'The answer to life, the universe, and everything'; color = '#e67e22' }
      else if (u === '°C' && v === 100) { msg = 'Boiling point! Water says hello.'; color = '#3498db' }
      else if (u === '°C' && v === 0) { msg = 'Brr! Water freezes here.'; color = '#2ecc71' }
      else if (u === '°C' && v === 37) { msg = 'Human body temperature. You are alive.'; color = '#e74c3c' }
      else if (u === '°F' && v === 98.6) { msg = 'Human body temperature. You are alive.'; color = '#e74c3c' }
      else if (u === '°F' && v === 212) { msg = 'Boiling point in Fahrenheit!'; color = '#3498db' }
      else if (u === '°F' && v === 32) { msg = 'Freezing point in Fahrenheit!'; color = '#2ecc71' }
      else if (u === 'K' && v === 273.15) { msg = 'Water freezes at 273.15 K.'; color = '#1abc9c' }
      else if (u === 'K' && v === 373.15) { msg = 'Water boils at 373.15 K.'; color = '#3498db' }
      else return
      this.showTempToast(msg, color)
    },
    showTempToast(msg, color) {
      if (this.tempToastShown) return
      this.tempToastShown = true
      const toast = document.createElement('div')
      toast.textContent = msg
      Object.assign(toast.style, {
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: `rgba(20, 20, 30, 0.85)`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${color}66`,
        color: '#fff',
        padding: '0.8rem 1.6rem',
        borderRadius: '16px',
        fontWeight: '700',
        fontSize: '0.95rem',
        zIndex: '99999',
        boxShadow: `0 4px 24px ${color}33, inset 0 1px 0 rgba(255,255,255,0.1)`,
        animation: 'bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
      })
      document.body.appendChild(toast)
      setTimeout(() => {
        toast.style.transition = 'opacity 0.4s, transform 0.4s'
        toast.style.opacity = '0'
        toast.style.transform = 'translateX(-50%) translateY(20px)'
        setTimeout(() => toast.remove(), 500)
      }, 3500)
    },
    handleKeydown(e) {
      // Escape to clear? Not necessary.
      // Arrow up/down to adjust value?
      if (e.target && e.target.tagName === 'INPUT') {
        // Let the input handle it
        return
      }
    }
  }
}
</script>

<style scoped>
/* ── Mobile ── */
@media (max-width: 400px) {
  .uc-card {
    padding: 1.25rem 0.9rem;
    border-radius: 16px;
  }
  .uc-title {
    font-size: 1rem;
  }
  .uc-icon {
    font-size: 1.5rem;
  }
  .uc-field {
    flex-direction: column;
    gap: 0.4rem;
    padding: 0.4rem;
  }
  .uc-input {
    font-size: 0.95rem;
    padding: 0.5rem 0.6rem;
  }
  .uc-select {
    font-size: 0.8rem;
    padding: 0.5rem 0.6rem;
    min-width: 0;
    width: 100%;
  }
  .uc-tab {
    padding: 0.3rem 0.6rem;
    font-size: 0.72rem;
  }
}

/* ── Glass base ── */
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

/* ── Container ── */
.uc-container {
  max-width: 480px;
  margin: 2rem auto;
}

.uc-card {
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

.uc-card::before {
  content: '';
  position: absolute;
  top: -60%;
  left: -20%;
  width: 140%;
  height: 140%;
  background: radial-gradient(circle at 30% 30%, rgba(52, 152, 219, 0.08), transparent 70%);
  pointer-events: none;
}

/* ── Header ── */
.uc-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.uc-icon {
  font-size: 2rem;
  line-height: 1;
  filter: drop-shadow(0 2px 8px rgba(52, 152, 219, 0.3));
}

.uc-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3498db, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Tabs ── */
.uc-tabs {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.uc-tab {
  padding: 0.4rem 0.9rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  color: rgba(255, 255, 255, 0.5);
}

.uc-tab:hover:not(.active) {
  transform: translateY(-2px);
  border-color: rgba(52, 152, 219, 0.3);
  color: rgba(255, 255, 255, 0.8);
}

.uc-tab.active {
  background: rgba(52, 152, 219, 0.2);
  border-color: rgba(52, 152, 219, 0.4);
  color: #fff;
  box-shadow: 0 0 20px rgba(52, 152, 219, 0.1);
}

/* ── Converter ── */
.uc-converter {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  align-items: center;
}

.uc-field {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.uc-field:focus-within {
  border-color: rgba(52, 152, 219, 0.4);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.08);
  transform: scale(1.02);
}

.uc-input {
  flex: 1;
  padding: 0.6rem 0.8rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  font-size: 1.1rem;
  font-family: 'SF Mono', 'Fira Code', monospace;
  min-width: 0;
  outline: none;
  transition: all 0.3s ease;
}

.uc-input:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(52, 152, 219, 0.3);
}

.uc-input.result-input {
  cursor: pointer;
  transition: background 0.2s;
}

.uc-input.result-input:hover {
  background: rgba(255, 255, 255, 0.08);
}

.uc-input[readonly] {
  cursor: default;
}

.uc-select {
  padding: 0.6rem 0.8rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
  min-width: 70px;
}

.uc-select:focus {
  border-color: rgba(52, 152, 219, 0.4);
  background: rgba(255, 255, 255, 0.08);
}

.uc-select option {
  background: #2d2d3d;
  color: #fff;
}

/* ── Swap Button ── */
.uc-swap-btn {
  padding: 0.5rem;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.uc-swap-btn:hover {
  transform: rotate(180deg) scale(1.1);
  border-color: rgba(52, 152, 219, 0.4);
  color: #fff;
  box-shadow: 0 0 20px rgba(52, 152, 219, 0.15);
  background: rgba(52, 152, 219, 0.1);
}

.uc-swap-btn:active {
  transform: rotate(180deg) scale(0.95);
}

/* ── Copied toast ── */
.uc-copied-toast {
  margin-top: 0.2rem;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #2ecc71;
  background: rgba(46, 204, 113, 0.1);
  border-color: rgba(46, 204, 113, 0.2);
  animation: fadeSlideIn 0.3s ease;
}

/* ── Reference ── */
.uc-reference {
  margin-top: 1rem;
  padding: 0.5rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.04);
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
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── Global toast override ── */
:global(.uc-toast) {
  animation: bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}
</style>