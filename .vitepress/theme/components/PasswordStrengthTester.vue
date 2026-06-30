<template>
  <div class="pst-container">
    <!-- Glass card -->
    <div class="pst-card glass">
      <!-- Header -->
      <div class="pst-header">
        <div class="pst-title-row">
          <span class="pst-icon">🔒</span>
          <h3 class="pst-title">Password Strength Tester</h3>
        </div>
        <p class="pst-subtitle">Enter a password to check its strength and security</p>
      </div>

      <!-- Input field -->
      <div class="pst-input-wrap glass-field">
        <label for="pst-input" class="pst-label">Password</label>
        <div class="pst-input-group">
          <input
            id="pst-input"
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Type a password..."
            class="pst-input"
            autocomplete="off"
          />
          <button class="pst-toggle" @click="showPassword = !showPassword" aria-label="Toggle visibility">
            <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Strength meter -->
      <div v-if="password.length > 0" class="pst-meter">
        <div class="pst-bar">
          <div class="pst-bar-fill" :style="{ width: scorePercent + '%', background: scoreColor }" />
        </div>
        <div class="pst-score-row">
          <span class="pst-score-text" :style="{ color: scoreColor }">{{ scoreLabel }}</span>
          <span class="pst-entropy">{{ entropy }} bits</span>
        </div>
      </div>

      <!-- Criteria checklist -->
      <div v-if="password.length > 0" class="pst-criteria">
        <div
          v-for="(c, index) in criteria"
          :key="c.label"
          class="pst-criterion"
          :class="{ pass: c.pass }"
          :style="{ '--delay': `${index * 0.08}s` }"
        >
          <span class="pst-criterion-icon">
            <svg v-if="c.pass" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="3">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </span>
          <span>{{ c.label }}</span>
        </div>
      </div>

      <!-- Pwned check -->
      <template v-if="password.length > 0">
        <!-- Skeleton loading -->
        <div v-if="pwnedLoading" class="pst-skel">
          <div class="pst-skel-btn pst-skel-shimmer"></div>
          <div class="pst-skel-line pst-skel-shimmer"></div>
        </div>

        <!-- Error -->
        <button
          v-else-if="pwnedError"
          class="pst-pwned-btn glass-btn pst-error-btn"
          @click="checkPwned"
        >
          <span>⚠️ Could not check right now — tap to retry</span>
        </button>

        <!-- Result -->
        <template v-else-if="pwnedResult !== null">
          <button class="pst-pwned-btn glass-btn" :class="pwnedResult ? 'pst-pwned-yes' : 'pst-pwned-no'" disabled>
            <span>{{ pwnedResult ? '⚠️ Password has been pwned!' : '✅ Not found in breaches' }}</span>
          </button>
          <div class="pst-breach-detail" :class="pwnedResult ? 'pst-breach-bad' : 'pst-breach-good'">
            {{ pwnedResult ? 'This password appears in data breaches. Change it immediately.' : 'Great! This password hasn\'t been exposed in known breaches.' }}
          </div>
        </template>

        <!-- Initial idle state -->
        <button v-else class="pst-pwned-btn glass-btn" @click="checkPwned">
          <span>🔍 Check against known breaches</span>
        </button>
      </template>

      <!-- Suggestions -->
      <div v-if="password.length > 0 && score < 4" class="pst-tip">
        💡 {{ score < 2 ? 'Try adding uppercase, numbers, and special characters.' : 'Add more variety to make it stronger.' }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasswordStrengthTester',
  data() {
    return {
      password: '',
      showPassword: false,
      pwnedLoading: false,
      pwnedResult: null,
      pwnedError: false,
    }
  },
  watch: {
    password() {
      this.pwnedResult = null
      this.pwnedError = false
    }
  },
  computed: {
    criteria() {
      const p = this.password
      return [
        { label: '8+ characters', pass: p.length >= 8 },
        { label: 'Uppercase letter', pass: /[A-Z]/.test(p) },
        { label: 'Lowercase letter', pass: /[a-z]/.test(p) },
        { label: 'Number', pass: /[0-9]/.test(p) },
        { label: 'Special character', pass: /[^A-Za-z0-9]/.test(p) },
      ]
    },
    score() {
      return this.criteria.filter(c => c.pass).length
    },
    scorePercent() {
      return (this.score / 5) * 100
    },
    scoreLabel() {
      const s = this.score
      if (s <= 1) return 'Very Weak'
      if (s === 2) return 'Weak'
      if (s === 3) return 'Fair'
      if (s === 4) return 'Strong'
      return 'Very Strong'
    },
    scoreColor() {
      const s = this.score
      if (s <= 1) return '#e74c3c'
      if (s === 2) return '#e67e22'
      if (s === 3) return '#f39c12'
      if (s === 4) return '#2ecc71'
      return '#27ae60'
    },
    entropy() {
      const p = this.password
      if (!p) return 0
      let charset = 0
      if (/[a-z]/.test(p)) charset += 26
      if (/[A-Z]/.test(p)) charset += 26
      if (/[0-9]/.test(p)) charset += 10
      if (/[^A-Za-z0-9]/.test(p)) charset += 33
      return Math.round(p.length * Math.log2(charset))
    }
  },
  methods: {
    async checkPwned() {
      if (!this.password) return
      this.pwnedLoading = true
      this.pwnedResult = null
      this.pwnedError = false
      try {
        const hash = await this.sha1(this.password)
        const prefix = hash.substring(0, 5)
        const suffix = hash.substring(5).toUpperCase()
        const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`)
        const text = await res.text()
        this.pwnedResult = text.includes(suffix)
      } catch {
        this.pwnedError = true
      } finally {
        this.pwnedLoading = false
      }
    },
    async sha1(str) {
      const buf = new TextEncoder().encode(str)
      const hash = await crypto.subtle.digest('SHA-1', buf)
      return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
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
.pst-container {
  max-width: 520px;
  margin: 2rem auto;
}

.pst-card {
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

.pst-card::before {
  content: '';
  position: absolute;
  top: -60%;
  right: -20%;
  width: 140%;
  height: 140%;
  background: radial-gradient(circle at 70% 30%, rgba(155, 89, 182, 0.08), transparent 70%);
  pointer-events: none;
}

/* ── Header ── */
.pst-header {
  margin-bottom: 1.5rem;
}

.pst-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.pst-icon {
  font-size: 2rem;
  line-height: 1;
  filter: drop-shadow(0 2px 8px rgba(155, 89, 182, 0.3));
}

.pst-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #e0d0ff, #b894f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.pst-subtitle {
  margin: 0.3rem 0 0;
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.5);
}

/* ── Input field ── */
.pst-input-wrap {
  padding: 0.85rem 1rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.pst-input-wrap:focus-within {
  border-color: rgba(155, 89, 182, 0.5);
  box-shadow: 0 0 0 3px rgba(155, 89, 182, 0.15);
  transform: scale(1.02);
}

.pst-label {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.45rem;
  letter-spacing: 0.02em;
}

.pst-input-group {
  display: flex;
  gap: 0.5rem;
}

.pst-input {
  flex: 1;
  padding: 0.6rem 0.85rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  font-size: 0.95rem;
  font-family: 'SF Mono', 'Fira Code', monospace;
  outline: none;
  transition: all 0.3s ease;
}

.pst-input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.pst-input:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(155, 89, 182, 0.3);
}

.pst-toggle {
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.pst-toggle:hover {
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.08);
}

/* ── Meter ── */
.pst-meter {
  margin-top: 1.25rem;
  animation: fadeSlideIn 0.4s ease;
}

.pst-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.pst-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.4s ease;
}

.pst-score-row {
  display: flex;
  justify-content: space-between;
  margin-top: 0.4rem;
}

.pst-score-text {
  font-size: 0.9rem;
  font-weight: 700;
}

.pst-entropy {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
}

/* ── Criteria ── */
.pst-criteria {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 1rem;
}

.pst-criterion {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: all 0.3s ease;
  animation: fadeSlideIn 0.3s ease var(--delay, 0s) both;
}

.pst-criterion.pass {
  color: rgba(255, 255, 255, 0.8);
  background: rgba(46, 204, 113, 0.08);
  border-color: rgba(46, 204, 113, 0.15);
}

.pst-criterion-icon {
  display: flex;
  align-items: center;
  line-height: 1;
}

/* ── Skeleton ── */
.pst-skel {
  margin-top: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.pst-skel-btn {
  height: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
}

.pst-skel-line {
  height: 14px;
  width: 70%;
  margin: 0 auto;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
}

.pst-skel-shimmer {
  position: relative;
  overflow: hidden;
}

.pst-skel-shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.08) 50%,
    transparent 100%
  );
  animation: pst-shimmer 1.5s ease-in-out infinite;
}

@keyframes pst-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* ── Pwned Button ── */
.pst-pwned-btn {
  width: 100%;
  margin-top: 1.25rem;
  padding: 0.7rem;
  border-radius: 12px;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}

.glass-btn {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
}

.glass-btn:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.02);
  border-color: rgba(155, 89, 182, 0.4);
  background: rgba(155, 89, 182, 0.1);
  box-shadow: 0 4px 16px rgba(155, 89, 182, 0.15);
}

.glass-btn:active:not(:disabled) {
  transform: scale(0.96);
}

.glass-btn:disabled {
  opacity: 0.7;
  cursor: default;
}

.pst-error-btn {
  border-color: rgba(231, 76, 60, 0.3);
  color: rgba(231, 76, 60, 0.8);
}

.pst-error-btn:hover {
  border-color: rgba(231, 76, 60, 0.5) !important;
  background: rgba(231, 76, 60, 0.1) !important;
}

.pst-pwned-yes {
  border-color: rgba(231, 76, 60, 0.3);
  color: rgba(231, 76, 60, 0.8);
  background: rgba(231, 76, 60, 0.08);
}

.pst-pwned-no {
  border-color: rgba(46, 204, 113, 0.3);
  color: rgba(46, 204, 113, 0.8);
  background: rgba(46, 204, 113, 0.08);
}

.pst-breach-bad {
  border-left-color: rgba(231, 76, 60, 0.4);
  color: rgba(231, 76, 60, 0.6);
}

.pst-breach-good {
  border-left-color: rgba(46, 204, 113, 0.4);
  color: rgba(46, 204, 113, 0.6);
}

.pst-breach-detail {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  padding: 0.4rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  animation: fadeSlideIn 0.3s ease;
}

.pst-tip {
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  padding: 0.4rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border-left: 2px solid rgba(155, 89, 182, 0.3);
  animation: fadeSlideIn 0.3s ease;
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

/* ── Mobile ── */
@media (max-width: 400px) {
  .pst-card {
    padding: 1.25rem 1rem;
    border-radius: 16px;
  }

  .pst-criteria {
    grid-template-columns: 1fr;
    gap: 0.4rem;
  }

  .pst-input {
    font-size: 0.85rem;
    padding: 0.5rem 0.7rem;
  }

  .pst-title {
    font-size: 1.05rem;
  }
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateX(-6px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>