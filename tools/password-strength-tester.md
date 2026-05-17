# 🔒 Password Strength Tester

<div class="strength-tester">
  <div class="tester-card">
    <div class="input-group">
      <label>Enter a password to test:</label>
      <input type="password" id="password" placeholder="Type your password here...">
      <button id="toggleView" class="toggle-btn">👁️ Show</button>
    </div>

<div id="strengthResult" class="strength-result">
      <div class="strength-bar-container">
        <div id="strengthBar" class="strength-bar" style="width: 0%"></div>
      </div>
      <div id="strengthText" class="strength-text"></div>
    </div>

<div id="feedback" class="feedback">
      <h4>Password Analysis</h4>
      <ul id="feedbackList"></ul>
    </div>

<div class="tips">
      <h4>💡 Tips for a Strong Password</h4>
      <ul>
        <li>Use at least 12 characters</li>
        <li>Mix uppercase and lowercase letters</li>
        <li>Include numbers and symbols</li>
        <li>Avoid common words or personal info</li>
        <li>Never reuse passwords across sites</li>
      </ul>
    </div>
  </div>
</div>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const passwordInput = document.getElementById('password')
  const strengthBar = document.getElementById('strengthBar')
  const strengthText = document.getElementById('strengthText')
  const feedbackList = document.getElementById('feedbackList')
  const toggleBtn = document.getElementById('toggleView')

  function testPassword(password) {
    let score = 0
    let feedback = []

    // Length check
    if (password.length >= 12) {
      score += 2
      feedback.push('✅ Good length (12+ characters)')
    } else if (password.length >= 8) {
      score += 1
      feedback.push('⚠️ Decent length, but 12+ is better')
    } else {
      feedback.push('❌ Too short - use at least 12 characters')
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1
      feedback.push('✅ Contains uppercase letters')
    } else {
      feedback.push('❌ Add uppercase letters (A-Z)')
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1
      feedback.push('✅ Contains lowercase letters')
    } else {
      feedback.push('❌ Add lowercase letters (a-z)')
    }

    // Numbers check
    if (/[0-9]/.test(password)) {
      score += 1
      feedback.push('✅ Contains numbers')
    } else {
      feedback.push('❌ Add numbers (0-9)')
    }

    // Symbols check
    if (/[^A-Za-z0-9]/.test(password)) {
      score += 2
      feedback.push('✅ Contains symbols (!@#$% etc.)')
    } else {
      feedback.push('❌ Add symbols for extra security')
    }

    // Common patterns check
    const commonPatterns = ['password', '123456', 'qwerty', 'admin', 'letmein']
    if (commonPatterns.some(p => password.toLowerCase().includes(p))) {
      score = Math.max(0, score - 2)
      feedback.push('⚠️ Contains common weak patterns')
    }

    // Calculate percentage
    const maxScore = 7
    const percentage = (score / maxScore) * 100

    // Update UI
    strengthBar.style.width = `${percentage}%`
    
    let strength = ''
    let color = ''
    if (percentage >= 80) {
      strength = 'Very Strong 🔒'
      color = '#2ecc71'
    } else if (percentage >= 60) {
      strength = 'Strong ✅'
      color = '#27ae60'
    } else if (percentage >= 40) {
      strength = 'Medium ⚠️'
      color = '#f39c12'
    } else if (percentage >= 20) {
      strength = 'Weak ❌'
      color = '#e67e22'
    } else {
      strength = 'Very Weak 🚫'
      color = '#e74c3c'
    }

    strengthBar.style.backgroundColor = color
    strengthText.textContent = strength
    strengthText.style.color = color

    // Update feedback list
    feedbackList.innerHTML = ''
    feedback.forEach(item => {
      const li = document.createElement('li')
      li.innerHTML = item
      feedbackList.appendChild(li)
    })
  }

  passwordInput.addEventListener('input', (e) => {
    const password = e.target.value
    if (password.length === 0) {
      strengthBar.style.width = '0%'
      strengthText.textContent = ''
      feedbackList.innerHTML = ''
      return
    }
    testPassword(password)
  })

  let isPasswordVisible = false
  toggleBtn.addEventListener('click', () => {
    isPasswordVisible = !isPasswordVisible
    passwordInput.type = isPasswordVisible ? 'text' : 'password'
    toggleBtn.textContent = isPasswordVisible ? '🙈 Hide' : '👁️ Show'
  })
})
</script>

<style scoped>
.strength-tester {
  max-width: 600px;
  margin: 0 auto;
}

.tester-card {
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--vp-c-divider);
}

.input-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.input-group input {
  width: 100%;
  padding: 0.75rem;
  padding-right: 70px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: monospace;
  font-size: 1rem;
  box-sizing: border-box;
}

.toggle-btn {
  position: absolute;
  right: 8px;
  bottom: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.strength-result {
  margin-bottom: 1.5rem;
}

.strength-bar-container {
  height: 12px;
  background: var(--vp-c-divider);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.strength-bar {
  height: 100%;
  width: 0%;
  transition: width 0.3s, background-color 0.3s;
  border-radius: 6px;
}

.strength-text {
  font-weight: bold;
  text-align: center;
}

.feedback {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--vp-c-bg);
  border-radius: 8px;
}

.feedback h4 {
  margin: 0 0 0.5rem;
}

.feedback ul {
  margin: 0;
  padding-left: 1.2rem;
}

.feedback li {
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

.tips {
  padding: 1rem;
  background: var(--vp-c-bg);
  border-radius: 8px;
  font-size: 0.9rem;
}

.tips h4 {
  margin: 0 0 0.5rem;
}

.tips ul {
  margin: 0;
  padding-left: 1.2rem;
}

.tips li {
  margin: 0.25rem 0;
}
</style>