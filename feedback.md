# 💬 Send Feedback

<div class="feedback-container">
  <p class="feedback-intro">Found a broken link? Have a suggestion for a new guide? Let me know!</p>

  <form id="feedbackForm">
    <div class="form-group">
      <label for="name">Name (optional)</label>
      <input type="text" id="name" name="name" placeholder="Your name or 'Anonymous'">
    </div>

 <div class="form-group">
      <label for="email">Email (optional — only if you want a reply)</label>
      <input type="email" id="email" name="email" placeholder="your@email.com">
    </div>

<div class="form-group">
      <label for="feedback">Your Feedback <span class="required">*</span></label>
      <textarea id="feedback" name="feedback" rows="6" placeholder="What's on your mind? Bug report, suggestion, question..." required></textarea>
    </div>

<div class="form-group">
      <label for="page">Page URL (auto-detected)</label>
      <input type="text" id="page" name="page" readonly placeholder="Current page will appear here">
    </div>

<button type="submit" id="submitBtn" class="submit-btn">Send Feedback</button>
  </form>

  <div id="feedbackStatus" class="feedback-status" style="display: none;"></div>
</div>

<script setup>
import { onMounted } from 'vue'

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1505481029887070209/dTizqqhVJpZy0eUo4aIJnjJFBOtUB6SwQZVo6Ifccmn07pnnUXX59FLoVsNSbWkQJpui'

onMounted(() => {
  const form = document.getElementById('feedbackForm')
  const statusDiv = document.getElementById('feedbackStatus')
  const pageInput = document.getElementById('page')
  
  if (pageInput) {
    pageInput.value = window.location.href
  }
  
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      
      const nameInput = document.getElementById('name')
      const emailInput = document.getElementById('email')
      const feedbackInput = document.getElementById('feedback')
      
      const name = nameInput ? (nameInput.value.trim() || 'Anonymous') : 'Anonymous'
      const email = emailInput ? emailInput.value.trim() : ''
      const feedback = feedbackInput ? feedbackInput.value.trim() : ''
      const page = pageInput ? pageInput.value : window.location.href
      
      if (!feedback) {
        if (statusDiv) {
          statusDiv.textContent = 'Please enter your feedback before submitting.'
          statusDiv.className = 'feedback-status error'
          statusDiv.style.display = 'block'
          setTimeout(() => { if (statusDiv) statusDiv.style.display = 'none' }, 5000)
        }
        return
      }
      
      const embed = {
        title: '📬 New Feedback Received',
        color: 0x5865F2,
        timestamp: new Date().toISOString(),
        fields: [
          { name: '👤 From', value: name + (email ? ` (${email})` : ''), inline: true },
          { name: '📄 Page', value: page, inline: true },
          { name: '💬 Message', value: feedback.substring(0, 1000), inline: false }
        ]
      }
      
      const payload = {
        username: 'Feedback Bot',
        embeds: [embed]
      }
      
      try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        
        if (response.ok) {
          if (feedbackInput) feedbackInput.value = ''
          if (nameInput) nameInput.value = ''
          if (emailInput) emailInput.value = ''
          
          if (statusDiv) {
            statusDiv.textContent = '✅ Thank you for your feedback!'
            statusDiv.className = 'feedback-status success'
            statusDiv.style.display = 'block'
            setTimeout(() => { if (statusDiv) statusDiv.style.display = 'none' }, 5000)
          }
        } else {
          throw new Error('Webhook failed')
        }
      } catch (error) {
        if (statusDiv) {
          statusDiv.textContent = '❌ Something went wrong. Please try again later.'
          statusDiv.className = 'feedback-status error'
          statusDiv.style.display = 'block'
          setTimeout(() => { if (statusDiv) statusDiv.style.display = 'none' }, 5000)
        }
      }
    })
  }
})
</script>

<style scoped>
.feedback-container {
  max-width: 600px;
  margin: 0 auto;
}

.feedback-intro {
  background: var(--vp-c-bg-soft);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
  color: var(--vp-c-text-2);
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.required {
  color: #e74c3c;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.form-group input[readonly] {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: not-allowed;
}

.submit-btn {
  width: 100%;
  padding: 0.85rem;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  background: var(--vp-c-brand-2);
}

.feedback-status {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  text-align: center;
}

.feedback-status.success {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
  border: 1px solid #2ecc71;
}

.feedback-status.error {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
  border: 1px solid #e74c3c;
}
</style>