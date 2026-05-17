# 🔐 Password Generator

<div class="password-generator">
  <div class="generator-card">
    <div class="password-display">
      <input type="text" id="password" readonly value="Click Generate">
      <button id="copyBtn" class="copy-btn">📋 Copy</button>
    </div>

<div class="options">
      <div class="option">
        <label>Password Length:</label>
        <input type="range" id="length" min="8" max="32" value="16">
        <span id="lengthValue">16</span>
      </div>

<div class="option">
        <label>
          <input type="checkbox" id="uppercase" checked> Include Uppercase (A-Z)
        </label>
      </div>

<div class="option">
        <label>
          <input type="checkbox" id="lowercase" checked> Include Lowercase (a-z)
        </label>
      </div>

<div class="option">
        <label>
          <input type="checkbox" id="numbers" checked> Include Numbers (0-9)
        </label>
      </div>

<div class="option">
        <label>
          <input type="checkbox" id="symbols" checked> Include Symbols (!@#$%^&*)
        </label>
      </div>
    </div>

<button id="generateBtn" class="generate-btn">Generate Password</button>

<div id="strength" class="strength-meter">
      <div class="strength-bar"></div>
      <span class="strength-text"></span>
    </div>
  </div>
</div>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const passwordInput = document.getElementById('password')
  const generateBtn = document.getElementById('generateBtn')
  const copyBtn = document.getElementById('copyBtn')
  const lengthSlider = document.getElementById('length')
  const lengthValue = document.getElementById('lengthValue')
  const uppercaseCheck = document.getElementById('uppercase')
  const lowercaseCheck = document.getElementById('lowercase')
  const numbersCheck = document.getElementById('numbers')
  const symbolsCheck = document.getElementById('symbols')
  const strengthBar = document.querySelector('.strength-bar')
  const strengthText = document.querySelector('.strength-text')

  function generatePassword() {
    const length = parseInt(lengthSlider.value)
    const hasUpper = uppercaseCheck.checked
    const hasLower = lowercaseCheck.checked
    const hasNumbers = numbersCheck.checked
    const hasSymbols = symbolsCheck.checked

    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lower = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'

    let chars = ''
    if (hasUpper) chars += upper
    if (hasLower) chars += lower
    if (hasNumbers) chars += numbers
    if (hasSymbols) chars += symbols

    if (chars === '') {
      passwordInput.value = 'Select at least one option'
      return
    }

    let password = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length)
      password += chars[randomIndex]
    }

    passwordInput.value = password
    updateStrength(password)
  }

  function updateStrength(password) {
    let strength = 0
    if (password.length >= 12) strength++
    if (password.length >= 16) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    let level = 'weak'
    let color = '#e74c3c'
    let width = '25%'

    if (strength >= 5) {
      level = 'Very Strong'
      color = '#2ecc71'
      width = '100%'
    } else if (strength >= 4) {
      level = 'Strong'
      color = '#27ae60'
      width = '75%'
    } else if (strength >= 3) {
      level = 'Medium'
      color = '#f39c12'
      width = '50%'
    } else if (strength >= 2) {
      level = 'Weak'
      color = '#e67e22'
      width = '25%'
    }

    strengthBar.style.width = width
    strengthBar.style.backgroundColor = color
    strengthText.textContent = `Strength: ${level}`
    strengthText.style.color = color
  }

  function copyPassword() {
    if (passwordInput.value && passwordInput.value !== 'Click Generate' && passwordInput.value !== 'Select at least one option') {
      navigator.clipboard.writeText(passwordInput.value)
      copyBtn.textContent = '✓ Copied!'
      setTimeout(() => {
        copyBtn.textContent = '📋 Copy'
      }, 2000)
    }
  }

  lengthSlider.addEventListener('input', () => {
    lengthValue.textContent = lengthSlider.value
    generatePassword()
  })

  generateBtn.addEventListener('click', generatePassword)
  copyBtn.addEventListener('click', copyPassword)

  ;[uppercaseCheck, lowercaseCheck, numbersCheck, symbolsCheck].forEach(checkbox => {
    checkbox.addEventListener('change', generatePassword)
  })

  // Generate initial password
  generatePassword()
})
</script>

<style scoped>
.password-generator {
  max-width: 500px;
  margin: 0 auto;
}

.generator-card {
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--vp-c-divider);
}

.password-display {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.password-display input {
  flex: 1;
  padding: 0.75rem;
  font-size: 1rem;
  font-family: monospace;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.copy-btn {
  padding: 0.75rem 1.25rem;
  background: var(--vp-c-brand-soft);
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 8px;
  color: var(--vp-c-brand-1);
  cursor: pointer;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: var(--vp-c-brand-1);
  color: white;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.option input[type="range"] {
  flex: 1;
  min-width: 150px;
}

.generate-btn {
  width: 100%;
  padding: 0.75rem;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.generate-btn:hover {
  transform: translateY(-2px);
}

.strength-meter {
  margin-top: 1rem;
}

.strength-bar {
  height: 8px;
  border-radius: 4px;
  transition: all 0.3s;
  margin-bottom: 0.5rem;
}

.strength-text {
  font-size: 0.85rem;
}
</style>