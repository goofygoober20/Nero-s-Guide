<template>
  <div class="pg-wrapper">
    <!-- No card wrapper — just content -->
    <div class="pg-content">
      <!-- Header -->
      <div class="pg-header">
        <span class="pg-icon">🔑</span>
        <h3 class="pg-title">Password Generator</h3>
        <span class="pg-badge" :style="{ background: strengthColor }">
          {{ strengthLabel }}
        </span>
      </div>

      <!-- Password display -->
      <div class="pg-password-row">
        <input
          type="text"
          :value="password"
          readonly
          class="pg-password-input"
        />
        <button class="pg-icon-btn" @click="copyPassword" title="Copy password">
          <svg v-if="!copied" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </button>
        <button class="pg-icon-btn" @click="generatePassword" title="Generate new password">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
        </button>
      </div>

      <!-- Strength bar -->
      <div class="pg-strength-bar">
        <div class="pg-strength-track">
          <div
            class="pg-strength-fill"
            :style="{ width: strengthPercent + '%', background: strengthColor }"
          ></div>
        </div>
        <div class="pg-strength-labels">
          <span>Weak</span>
          <span>Good</span>
          <span>Strong</span>
        </div>
      </div>

      <!-- Controls -->
      <div class="pg-controls">
        <div class="pg-slider-group">
          <label class="pg-slider-label">Length: <strong>{{ length }}</strong></label>
          <input
            type="range"
            v-model.number="length"
            min="4"
            max="64"
            class="pg-slider"
            @input="generatePassword"
          />
        </div>

        <div class="pg-checkboxes">
          <label class="pg-check" :class="{ active: uppercase }">
            <input type="checkbox" v-model="uppercase" @change="generatePassword" />
            <span>A-Z</span>
          </label>
          <label class="pg-check" :class="{ active: lowercase }">
            <input type="checkbox" v-model="lowercase" @change="generatePassword" />
            <span>a-z</span>
          </label>
          <label class="pg-check" :class="{ active: numbers }">
            <input type="checkbox" v-model="numbers" @change="generatePassword" />
            <span>0-9</span>
          </label>
          <label class="pg-check" :class="{ active: symbols }">
            <input type="checkbox" v-model="symbols" @change="generatePassword" />
            <span>!@#$</span>
          </label>
          <label class="pg-check" :class="{ active: avoidAmbiguous }">
            <input type="checkbox" v-model="avoidAmbiguous" @change="generatePassword" />
            <span>Avoid ambiguous</span>
          </label>
        </div>

        <div class="pg-meta">
          <span class="pg-entropy">Entropy: <strong>{{ entropy }} bits</strong></span>
          <span class="pg-length-meta">{{ password.length }} characters</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasswordGenerator',
  watch: {
    password(val) {
      this.checkMilestone(val.length)
    }
  },
  data() {
    return {
      length: 16,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      avoidAmbiguous: true,
      password: '',
      copied: false,
      shownMilestones: new Set(),
    }
  },
  computed: {
    entropy() {
      if (!this.password) return 0
      let charset = 0
      if (this.uppercase) charset += 26
      if (this.lowercase) charset += 26
      if (this.numbers) charset += 10
      if (this.symbols) charset += 33
      return Math.round(this.password.length * Math.log2(charset))
    },
    strengthLabel() {
      const e = this.entropy
      if (e < 40) return 'Weak'
      if (e < 60) return 'Good'
      if (e < 80) return 'Strong'
      return 'Very Strong'
    },
    strengthColor() {
      const e = this.entropy
      if (e < 40) return '#e74c3c'
      if (e < 60) return '#f39c12'
      if (e < 80) return '#2ecc71'
      return '#27ae60'
    },
    strengthPercent() {
      return Math.min((this.entropy / 100) * 100, 100)
    }
  },
  mounted() {
    this.generatePassword()
  },
  methods: {
    generatePassword() {
      let chars = ''
      if (this.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      if (this.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz'
      if (this.numbers) chars += '0123456789'
      if (this.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'

      if (!chars) {
        this.password = 'Select at least one set'
        return
      }

      if (this.avoidAmbiguous) {
        const ambiguous = 'il1Lo0O'
        for (const c of ambiguous) {
          chars = chars.replace(c, '')
        }
      }

      let result = ''
      const array = new Uint32Array(this.length)
      crypto.getRandomValues(array)
      for (let i = 0; i < this.length; i++) {
        result += chars[array[i] % chars.length]
      }
      this.password = result
    },
    async copyPassword() {
      if (!this.password) return
      try {
        await navigator.clipboard.writeText(this.password)
        this.copied = true
        setTimeout(() => (this.copied = false), 1500)
      } catch {
        const ta = document.createElement('textarea')
        ta.value = this.password
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        this.copied = true
        setTimeout(() => (this.copied = false), 1500)
      }
    },
    checkMilestone(len) {
      const milestones = {
        4: 'Getting started...',
        8: 'Not bad!',
        12: 'Now we\'re talking',
        16: 'Solid choice',
        20: 'Paranoid mode engaged',
        32: 'Fort Knox activated',
        48: 'You really don\'t want to be hacked',
        64: 'This password will outlive civilizations',
      }
      if (milestones[len] && !this.shownMilestones.has(len)) {
        this.shownMilestones.add(len)
        this.showToast(milestones[len])
      }
    },
    showToast(msg) {
      const toast = document.createElement('div')
      toast.textContent = msg
      toast.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#fff;padding:0.6rem 1.4rem;border-radius:999px;font-size:0.85rem;font-weight:600;z-index:99999;box-shadow:0 4px 20px rgba(59,130,246,0.4);animation:pgToastIn 0.3s ease;white-space:nowrap;'
      document.body.appendChild(toast)
      setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s' }, 2500)
      setTimeout(() => toast.remove(), 2800)
    }
  }
}
</script>

<style scoped>
/* ── Container ── */
.pg-wrapper {
  max-width: 560px;
  margin: 2rem auto;
}

/* ── No card — just content ── */
.pg-content {
  padding: 0;
  background: transparent;
  border: none;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

/* ── Header ── */
.pg-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.25rem;
}
.pg-icon {
  font-size: 1.6rem;
  line-height: 1;
}
.pg-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: rgba(255,255,255,0.9);
  flex: 1;
}
.pg-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.2rem 0.7rem;
  border-radius: 20px;
  color: #fff;
  background: #27ae60;
  box-shadow: 0 0 12px rgba(39,174,96,0.2);
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

/* ── Password row ── */
.pg-password-row {
  display: flex;
  gap: 0.4rem;
  align-items: center;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 0.2rem 0.2rem 0.2rem 0.8rem;
  transition: border-color 0.2s;
}
.pg-password-row:focus-within {
  border-color: rgba(255,255,255,0.12);
}
.pg-password-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: rgba(255,255,255,0.9);
  font-size: 0.95rem;
  font-family: 'SF Mono', 'Fira Code', monospace;
  padding: 0.5rem 0;
  letter-spacing: 0.02em;
}
.pg-password-input::selection {
  background: rgba(255,255,255,0.1);
}
.pg-icon-btn {
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.3);
  cursor: pointer;
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pg-icon-btn:hover {
  background: rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.7);
}
.pg-icon-btn:active {
  transform: scale(0.9);
}

/* ── Strength bar ── */
.pg-strength-bar {
  margin: 1rem 0 0.5rem;
}
.pg-strength-track {
  height: 4px;
  background: rgba(255,255,255,0.06);
  border-radius: 2px;
  overflow: hidden;
}
.pg-strength-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.4s ease, background 0.3s;
}
.pg-strength-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.55rem;
  color: rgba(255,255,255,0.15);
  margin-top: 0.2rem;
  padding: 0 0.2rem;
  letter-spacing: 0.02em;
}

/* ── Controls ── */
.pg-controls {
  margin-top: 0.75rem;
}
.pg-slider-group {
  margin-bottom: 0.75rem;
}
.pg-slider-label {
  display: block;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.4);
  margin-bottom: 0.3rem;
}
.pg-slider-label strong {
  color: rgba(255,255,255,0.7);
}
.pg-slider {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255,255,255,0.08);
  border-radius: 2px;
  outline: none;
}
.pg-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  cursor: pointer;
  box-shadow: 0 0 12px rgba(59,130,246,0.2);
  transition: transform 0.2s;
}
.pg-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}
.pg-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  cursor: pointer;
}

.pg-checkboxes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.3rem;
  margin: 0.75rem 0 0.5rem;
}
.pg-check {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.35);
  cursor: pointer;
  padding: 0.2rem 0.4rem;
  border-radius: 6px;
  transition: all 0.2s;
}
.pg-check.active {
  color: rgba(255,255,255,0.7);
  background: rgba(255,255,255,0.03);
}
.pg-check input[type="checkbox"] {
  accent-color: #3b82f6;
  width: 14px;
  height: 14px;
  cursor: pointer;
  opacity: 0.5;
}
.pg-check.active input[type="checkbox"] {
  opacity: 1;
}
.pg-check span {
  user-select: none;
}

.pg-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.2);
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255,255,255,0.03);
  margin-top: 0.25rem;
}
.pg-entropy strong {
  color: rgba(255,255,255,0.5);
}
.pg-length-meta {
  font-family: monospace;
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .pg-content { padding: 0; }
  .pg-checkboxes { grid-template-columns: 1fr; }
  .pg-password-input { font-size: 0.8rem; }
}
</style>