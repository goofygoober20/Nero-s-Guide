<template>
  <div class="pg-container">
    <div class="pg-card">
      <div class="pg-result">
        <input type="text" :value="password" readonly class="pg-result-input" ref="resultInput" />
        <button class="pg-copy-btn" @click="copyPassword" :title="copied ? 'Copied!' : 'Copy password'">
          <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
        <button class="pg-refresh-btn" @click="generate" title="Generate new password">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        </button>
      </div>

      <div class="pg-controls">
        <div class="pg-control">
          <label for="pg-length">Length: <strong>{{ length }}</strong></label>
          <input id="pg-length" type="range" v-model.number="length" min="4" max="64" class="pg-slider" />
        </div>

        <div class="pg-checkboxes">
          <label class="pg-check">
            <input type="checkbox" v-model="uppercase" />
            <span>Uppercase (A-Z)</span>
          </label>
          <label class="pg-check">
            <input type="checkbox" v-model="lowercase" />
            <span>Lowercase (a-z)</span>
          </label>
          <label class="pg-check">
            <input type="checkbox" v-model="numbers" />
            <span>Numbers (0-9)</span>
          </label>
          <label class="pg-check">
            <input type="checkbox" v-model="symbols" />
            <span>Symbols (!@#$)</span>
          </label>
          <label class="pg-check">
            <input type="checkbox" v-model="avoidAmbiguous" />
            <span>Avoid ambiguous (il1Lo0O)</span>
          </label>
        </div>

        <div class="pg-info">
          <span class="pg-entropy">Entropy: <strong>{{ entropy }} bits</strong></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const length = ref(16)
const uppercase = ref(true)
const lowercase = ref(true)
const numbers = ref(true)
const symbols = ref(true)
const avoidAmbiguous = ref(true)
const password = ref('')
const copied = ref(false)

const ambiguous = 'il1Lo0O'

function generate() {
  let chars = ''
  if (uppercase.value) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (lowercase.value) chars += 'abcdefghijklmnopqrstuvwxyz'
  if (numbers.value) chars += '0123456789'
  if (symbols.value) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'

  if (!chars) {
    password.value = 'Select at least one set'
    return
  }

  if (avoidAmbiguous.value) {
    for (const c of ambiguous) {
      chars = chars.replace(c, '')
    }
  }

  let result = ''
  const array = new Uint32Array(length.value)
  crypto.getRandomValues(array)
  for (let i = 0; i < length.value; i++) {
    result += chars[array[i] % chars.length]
  }
  password.value = result
}

const entropy = computed(() => {
  const p = password.value
  if (!p || p === 'Select at least one set') return 0
  let charset = 0
  if (uppercase.value) charset += 26
  if (lowercase.value) charset += 26
  if (numbers.value) charset += 10
  if (symbols.value) charset += 33
  return Math.round(p.length * Math.log2(charset))
})

async function copyPassword() {
  if (!password.value || password.value === 'Select at least one set') return
  try {
    await navigator.clipboard.writeText(password.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = password.value
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}

onMounted(generate)
</script>

<style scoped>
.pg-container {
  max-width: 520px;
  margin: 2rem auto;
}

.pg-card {
  padding: 1.5rem;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.pg-result {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.pg-result-input {
  flex: 1;
  padding: 0.75rem;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 1rem;
  font-family: monospace;
  letter-spacing: 0.05em;
}

.pg-copy-btn,
.pg-refresh-btn {
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: border-color 0.2s, color 0.2s;
}

.pg-copy-btn:hover,
.pg-refresh-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.pg-slider {
  width: 100%;
  margin: 0.5rem 0;
  accent-color: var(--vp-c-brand-1);
}

.pg-checkboxes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin: 1rem 0;
}

.pg-check {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-1);
  cursor: pointer;
}

.pg-check input {
  accent-color: var(--vp-c-brand-1);
}

.pg-info {
  text-align: center;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.pg-entropy strong {
  color: var(--vp-c-brand-1);
}
</style>
