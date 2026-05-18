// REPLACE THIS WITH YOUR DISCORD WEBHOOK URL
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1505691359514988554/c0eQpYLArEq0bXLO_RolYjHGgBKTSGxlv6Wx1wBsoT8hW98cgaTdicTTG23LFO1LjCtJ'

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  console.log('Feedback page loaded')
  
  // Tab switching
  const feedbackTab = document.getElementById('feedbackTab')
  const submitLinkTab = document.getElementById('submitLinkTab')
  const feedbackContent = document.getElementById('feedbackContent')
  const linkContent = document.getElementById('linkContent')

  if (feedbackTab && submitLinkTab) {
    function switchTab(tab) {
      if (tab === 'feedback') {
        feedbackTab.classList.add('active')
        submitLinkTab.classList.remove('active')
        feedbackContent.classList.add('active')
        linkContent.classList.remove('active')
      } else {
        feedbackTab.classList.remove('active')
        submitLinkTab.classList.add('active')
        feedbackContent.classList.remove('active')
        linkContent.classList.add('active')
      }
    }

    feedbackTab.addEventListener('click', () => switchTab('feedback'))
    submitLinkTab.addEventListener('click', () => switchTab('link'))
  }

  // Auto-fill page URL
  const pageUrlInput = document.getElementById('pageUrl')
  if (pageUrlInput) {
    pageUrlInput.value = window.location.href
  }

  // Helper function to show status
  function showStatus(element, message, type) {
    element.textContent = message
    element.className = 'status-message ' + type
    element.style.display = 'block'
    setTimeout(function() {
      element.style.display = 'none'
    }, 5000)
  }

  // Send to Discord
  async function sendToDiscord(payload) {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    return response.ok
  }

  // Feedback submission
  const sendFeedbackBtn = document.getElementById('sendFeedbackBtn')
  const feedbackStatus = document.getElementById('feedbackStatus')

  if (sendFeedbackBtn) {
    sendFeedbackBtn.addEventListener('click', async function() {
      const name = document.getElementById('name').value.trim() || 'Anonymous'
      const email = document.getElementById('email').value.trim()
      const feedback = document.getElementById('feedbackMsg').value.trim()
      const page = document.getElementById('pageUrl').value
      
      if (!feedback) {
        showStatus(feedbackStatus, 'Please enter your feedback before submitting.', 'error')
        return
      }
      
      const embed = {
        title: '📬 New Feedback Received',
        color: 0x5865F2,
        timestamp: new Date().toISOString(),
        fields: [
          { name: '👤 From', value: name + (email ? ' (' + email + ')' : ''), inline: true },
          { name: '📄 Page', value: page, inline: true },
          { name: '💬 Message', value: feedback.substring(0, 1000), inline: false }
        ]
      }
      
      const payload = {
        username: 'Feedback Bot',
        embeds: [embed]
      }
      
      try {
        const success = await sendToDiscord(payload)
        if (success) {
          document.getElementById('feedbackMsg').value = ''
          document.getElementById('name').value = ''
          document.getElementById('email').value = ''
          showStatus(feedbackStatus, '✅ Thank you for your feedback!', 'success')
        } else {
          throw new Error('Failed')
        }
      } catch (error) {
        showStatus(feedbackStatus, '❌ Something went wrong. Please try again later.', 'error')
      }
    })
  }

  // Link submission
  const submitLinkBtn = document.getElementById('submitLinkBtn')
  const linkStatus = document.getElementById('linkStatus')

  if (submitLinkBtn) {
    submitLinkBtn.addEventListener('click', async function() {
      const name = document.getElementById('linkName').value.trim() || 'Anonymous'
      const email = document.getElementById('linkEmail').value.trim()
      const title = document.getElementById('resourceTitle').value.trim()
      const url = document.getElementById('resourceUrl').value.trim()
      const category = document.getElementById('category').value
      const description = document.getElementById('description').value.trim()
      const whyUseful = document.getElementById('whyUseful').value.trim()
      
      if (!title || !url || !category || !description) {
        showStatus(linkStatus, 'Please fill in all required fields.', 'error')
        return
      }
      
      // Validate URL
      try {
        new URL(url)
      } catch {
        showStatus(linkStatus, 'Please enter a valid URL (including https://)', 'error')
        return
      }
      
      const fields = [
        { name: '👤 Submitted by', value: name + (email ? ' (' + email + ')' : ''), inline: true },
        { name: '📂 Category', value: category, inline: true },
        { name: '📌 Title', value: title, inline: false },
        { name: '🔗 URL', value: url, inline: false },
        { name: '📝 Description', value: description.substring(0, 500), inline: false }
      ]
      
      if (whyUseful) {
        fields.push({ name: '💡 Why it\'s useful', value: whyUseful.substring(0, 500), inline: false })
      }
      
      const embed = {
        title: '🔗 New Link Submission',
        color: 0x2ecc71,
        timestamp: new Date().toISOString(),
        fields: fields
      }
      
      const payload = {
        username: 'Link Submissions',
        embeds: [embed]
      }
      
      try {
        const success = await sendToDiscord(payload)
        if (success) {
          document.getElementById('linkForm').reset()
          showStatus(linkStatus, '✅ Link submitted successfully! I\'ll review it soon.', 'success')
        } else {
          throw new Error('Failed')
        }
      } catch (error) {
        showStatus(linkStatus, '❌ Something went wrong. Please try again later.', 'error')
      }
    })
  }
})