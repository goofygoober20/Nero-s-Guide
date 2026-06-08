<template>
  <div class="pst-container">
    <div class="pst-card">
      <div class="pst-header">
        <label for="pst-input" class="pst-label">Enter a password to test</label>
        <div class="pst-input-wrap">
          <input
            id="pst-input"
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Type a password..."
            class="pst-input"
            autocomplete="off"
          />
          <button class="pst-toggle" @click="showPassword = !showPassword" aria-label="Toggle visibility">
            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          </button>
        </div>
      </div>

      <div class="pst-meter" v-if="password.length > 0">
        <div class="pst-bar">
          <div class="pst-bar-fill" :style="{ width: scorePercent + '%', background: scoreColor }" />
        </div>
        <div class="pst-score-row">
          <span class="pst-score-text" :style="{ color: scoreColor }">{{ scoreLabel }}</span>
          <span class="pst-entropy">{{ entropy }} bits</span>
        </div>
      </div>

      <div class="pst-criteria" v-if="password.length > 0">
        <div v-for="c in criteria" :key="c.label" class="pst-criterion" :class="{ pass: c.pass }">
          <svg v-if="c.pass" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          <span>{{ c.label }}</span>
        </div>
      </div>

      <button v-if="password.length > 0" class="pst-pwned-btn" @click="checkPwned" :disabled="pwnedLoading">
        {{ pwnedLoading ? 'Checking...' : pwnedResult !== null ? (pwnedResult ? '⚠️ Password has been pwned!' : '✅ Not found in breaches') : '🔍 Check against known breaches' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const password = ref('')
const showPassword = ref(false)
const pwnedLoading = ref(false)
const pwnedResult = ref(null)

const criteria = computed(() => {
  const p = password.value
  return [
    { label: '8+ characters', pass: p.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(p) },
    { label: 'Lowercase letter', pass: /[a-z]/.test(p) },
    { label: 'Number', pass: /[0-9]/.test(p) },
    { label: 'Special character', pass: /[^A-Za-z0-9]/.test(p) },
  ]
})

const score = computed(() => criteria.value.filter(c => c.pass).length)

const scorePercent = computed(() => (score.value / 5) * 100)

const scoreLabel = computed(() => {
  const s = score.value
  if (s <= 1) return 'Very Weak'
  if (s === 2) return 'Weak'
  if (s === 3) return 'Fair'
  if (s === 4) return 'Strong'
  return 'Very Strong'
})

const scoreColor = computed(() => {
  const s = score.value
  if (s <= 1) return '#e74c3c'
  if (s === 2) return '#e67e22'
  if (s === 3) return '#f39c12'
  if (s === 4) return '#2ecc71'
  return '#27ae60'
})

const entropy = computed(() => {
  const p = password.value
  if (!p) return 0
  let charset = 0
  if (/[a-z]/.test(p)) charset += 26
  if (/[A-Z]/.test(p)) charset += 26
  if (/[0-9]/.test(p)) charset += 10
  if (/[^A-Za-z0-9]/.test(p)) charset += 33
  return Math.round(p.length * Math.log2(charset))
})

async function checkPwned() {
  if (!password.value) return
  pwnedLoading.value = true
  pwnedResult.value = null
  try {
    const hash = await sha1(password.value)
    const prefix = hash.substring(0, 5)
    const suffix = hash.substring(5).toUpperCase()
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`)
    const text = await res.text()
    pwnedResult.value = text.includes(suffix)
  } catch {
    pwnedResult.value = false
  } finally {
    pwnedLoading.value = false
  }
}

async function sha1(str) {
  const buf = new TextEncoder().encode(str)
  const hash = await crypto.subtle.digest('SHA-1', buf)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}
</script>

<style scoped>
.pst-container {
  max-width: 520px;
  margin: 2rem auto;
}

.pst-card {
  padding: 1.5rem;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.pst-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
}

.pst-input-wrap {
  display: flex;
  gap: 0.5rem;
}

.pst-input {
  flex: 1;
  padding: 0.75rem;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 1rem;
  font-family: monospace;
  transition: border-color 0.2s;
}

.pst-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.pst-toggle {
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  display: flex;
  align-items: center;
}

.pst-toggle:hover {
  color: var(--vp-c-brand-1);
}

.pst-meter {
  margin-top: 1.25rem;
}

.pst-bar {
  height: 6px;
  background: var(--vp-c-divider);
  border-radius: 3px;
  overflow: hidden;
}

.pst-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s, background 0.3s;
}

.pst-score-row {
  display: flex;
  justify-content: space-between;
  margin-top: 0.4rem;
}

.pst-score-text {
  font-size: 0.85rem;
  font-weight: 700;
}

.pst-entropy {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.pst-criteria {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.4rem;
  margin-top: 1rem;
}

.pst-criterion {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  background: var(--vp-c-bg);
}

.pst-criterion.pass {
  color: var(--vp-c-text-1);
}

.pst-pwned-btn {
  width: 100%;
  margin-top: 1rem;
  padding: 0.65rem;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.85rem;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.pst-pwned-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.pst-pwned-btn:disabled {
  opacity: 0.6;
  cursor: wait;
}
</style>
