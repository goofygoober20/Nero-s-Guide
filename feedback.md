---
layout: page
---

<!-- Full-page glass background -->
<div class="page-glass-bg"></div>

<div class="glass-wrapper">

  <!-- Tabs -->
  <div class="tabs">
    <button id="feedbackTab" class="tab active">📝 Feedback</button>
    <button id="submitLinkTab" class="tab">🔗 Submit a Link</button>
  </div>

  <!-- FEEDBACK FORM -->
  <section id="feedbackContent" class="panel active">
    <p class="intro">Found a broken link? Have a suggestion? I’d love to hear it.</p>

  <div class="field">
      <input type="text" id="name" placeholder=" " />
      <label>Name (optional)</label>
    </div>

  <div class="field">
      <input type="email" id="email" placeholder=" " />
      <label>Email (optional)</label>
    </div>

  <div class="field">
      <textarea id="feedbackMsg" rows="5" placeholder=" "></textarea>
      <label>Your Feedback *</label>
    </div>

  <div class="field">
      <input type="text" id="pageUrl" readonly placeholder=" " />
      <label>Page URL</label>
    </div>

  <button id="sendFeedbackBtn" class="primary-btn">Send Feedback</button>
    <div id="feedbackStatus" class="status"></div>
  </section>

  <!-- LINK SUBMISSION FORM -->
  <section id="linkContent" class="panel">
    <p class="intro">Know a great resource? Share it with the community.</p>

  <div class="field">
      <input type="text" id="linkName" placeholder=" " />
      <label>Your Name (optional)</label>
    </div>

  <div class="field">
      <input type="email" id="linkEmail" placeholder=" " />
      <label>Your Email (optional)</label>
    </div>

  <div class="field">
      <input type="text" id="resourceTitle" placeholder=" " />
      <label>Resource Title *</label>
    </div>

  <div class="field">
      <input type="url" id="resourceUrl" placeholder=" " />
      <label>Resource URL *</label>
    </div>

  <div class="field select-wrapper">
      <select id="category">
        <option value=""></option>
        <option value="Privacy">🛡️ Privacy</option>
        <option value="AI">🤖 AI</option>
        <option value="Streaming">🎬 Streaming</option>
        <option value="Gaming">🎮 Gaming</option>
        <option value="Reading">📚 Reading</option>
        <option value="Health">💊 Health</option>
        <option value="Tools">🛠️ Tools</option>
        <option value="Other">📌 Other</option>
      </select>
      <label>Category *</label>
      <div class="select-arrow"></div>
    </div>

  <div class="field">
      <textarea id="description" rows="4" placeholder=" "></textarea>
      <label>Description *</label>
    </div>

  <div class="field">
      <textarea id="whyUseful" rows="2" placeholder=" "></textarea>
      <label>Why is this useful? (optional)</label>
    </div>

  <button id="submitLinkBtn" class="primary-btn">Submit Link</button>
    <div id="linkStatus" class="status"></div>
  </section>

</div>

<!-- GLOBAL GLASS TOAST -->
<div id="toast" class="toast"></div>

<script setup>
import { onMounted } from 'vue'

const FEEDBACK_WEBHOOK = "https://discord.com/api/webhooks/1505481029887070209/dTizqqhVJpZy0eUo4aIJnjJFBOtUB6SwQZVo6Ifccmn07pnnUXX59FLoVsNSbWkQJpui"

const LINK_WEBHOOK = "https://discord.com/api/webhooks/1505691359514988554/c0eQpYLArEq0bXLO_RolYjHGgBKTSGxlv6Wx1wBsoT8hW98cgaTdicTTG23LFO1LjCtJ"

onMounted(() => {
  const feedbackTab = document.getElementById("feedbackTab")
  const submitLinkTab = document.getElementById("submitLinkTab")
  const feedbackContent = document.getElementById("feedbackContent")
  const linkContent = document.getElementById("linkContent")
  const toast = document.getElementById("toast")

  const switchTab = (tab) => {
    const isFeedback = tab === "feedback"
    feedbackTab.classList.toggle("active", isFeedback)
    submitLinkTab.classList.toggle("active", !isFeedback)
    feedbackContent.classList.toggle("active", isFeedback)
    linkContent.classList.toggle("active", !isFeedback)
  }

  feedbackTab.onclick = () => switchTab("feedback")
  submitLinkTab.onclick = () => switchTab("link")

  document.getElementById("pageUrl").value = window.location.href

  const showToast = (msg, type) => {
    toast.textContent = msg
    toast.className = `toast show ${type}`
    setTimeout(() => {
      toast.classList.remove("show")
    }, 5000)
  }

  const sendToDiscord = async (url, payload) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    return res.ok
  }

  document.getElementById("category").addEventListener("change", (e) => {
    if (e.target.value !== "") e.target.classList.add("filled")
    else e.target.classList.remove("filled")
  })

  document.getElementById("sendFeedbackBtn").onclick = async () => {
    const name = document.getElementById("name").value.trim() || "Anonymous"
    const email = document.getElementById("email").value.trim()
    const feedback = document.getElementById("feedbackMsg").value.trim()
    const page = document.getElementById("pageUrl").value

    if (!feedback) return showToast("Please enter feedback.", "error")

    const embed = {
      title: "📬 New Feedback",
      color: 0x5865f2,
      timestamp: new Date().toISOString(),
      fields: [
        { name: "From", value: name + (email ? ` (${email})` : ""), inline: true },
        { name: "Page", value: page, inline: true },
        { name: "Message", value: feedback },
      ],
    }

    const ok = await sendToDiscord(FEEDBACK_WEBHOOK, {
      username: "Feedback Bot",
      embeds: [embed],
    })

    showToast(ok ? "Thank you!" : "Error sending feedback.", ok ? "success" : "error")
  }

  document.getElementById("submitLinkBtn").onclick = async () => {
    const name = document.getElementById("linkName").value.trim() || "Anonymous"
    const email = document.getElementById("linkEmail").value.trim()
    const title = document.getElementById("resourceTitle").value.trim()
    const url = document.getElementById("resourceUrl").value.trim()
    const category = document.getElementById("category").value
    const description = document.getElementById("description").value.trim()
    const whyUseful = document.getElementById("whyUseful").value.trim()

    if (!title || !url || !category || !description) return showToast("Please fill all required fields.", "error")

    const embed = {
      title: "🔗 New Link Submission",
      color: 0x2ecc71,
      timestamp: new Date().toISOString(),
      fields: [
        { name: "Submitted by", value: name + (email ? ` (${email})` : ""), inline: true },
        { name: "Category", value: category, inline: true },
        { name: "Title", value: title },
        { name: "URL", value: url },
        { name: "Description", value: description },
      ],
    }

    if (whyUseful) embed.fields.push({ name: "Why it’s useful", value: whyUseful })

    const ok = await sendToDiscord(LINK_WEBHOOK, {
      username: "Link Bot",
      embeds: [embed],
    })

    showToast(ok ? "Link submitted!" : "Error submitting link.", ok ? "success" : "error")
  }
})
</script>

<style scoped>
/* Glass Background */
.page-glass-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 30%, rgba(88, 101, 242, 0.08), transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.glass-wrapper {
  position: relative;
  z-index: 1;
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: rgba(var(--vp-c-bg), 0.7);
  backdrop-filter: blur(12px);
  border-radius: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Tabs */
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 0.5rem;
}

.tab {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  color: var(--vp-c-text-2);
  transition: all 0.2s;
}

.tab.active {
  color: var(--vp-c-brand-1);
  border-bottom: 2px solid var(--vp-c-brand-1);
  margin-bottom: -0.5rem;
}

/* Panels */
.panel {
  display: none;
}

.panel.active {
  display: block;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.intro {
  text-align: center;
  color: var(--vp-c-text-2);
  margin-bottom: 1.5rem;
}

/* Floating Labels */
.field {
  position: relative;
  margin-bottom: 1.5rem;
}

.field input,
.field textarea,
.field select {
  width: 100%;
  padding: 1rem 0.75rem 0.5rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 1rem;
  transition: all 0.2s;
  box-sizing: border-box;
}

.field input:focus,
.field textarea:focus,
.field select:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.field label {
  position: absolute;
  left: 0.75rem;
  top: 0.9rem;
  color: var(--vp-c-text-3);
  font-size: 1rem;
  pointer-events: none;
  transition: all 0.2s;
}

.field input:focus ~ label,
.field input:not(:placeholder-shown) ~ label,
.field textarea:focus ~ label,
.field textarea:not(:placeholder-shown) ~ label,
.field select:focus ~ label,
.field select.filled ~ label {
  top: 0.25rem;
  font-size: 0.7rem;
  color: var(--vp-c-brand-1);
}

.field input[readonly] {
  background: var(--vp-c-bg-soft);
  cursor: not-allowed;
}

.required {
  color: #e74c3c;
}

/* Select Wrapper */
.select-wrapper {
  position: relative;
}

.select-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid var(--vp-c-text-2);
  pointer-events: none;
}

/* Primary Button */
.primary-btn {
  width: 100%;
  padding: 0.85rem;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 40px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.primary-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
}

/* Status Messages */
.status {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.85rem;
}

/* Toast Notification */
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%) translateY(100%);
  background: var(--vp-c-bg-soft);
  backdrop-filter: blur(8px);
  padding: 0.75rem 1.5rem;
  border-radius: 40px;
  font-size: 0.85rem;
  font-weight: 500;
  z-index: 1000;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--vp-c-divider);
  white-space: nowrap;
}

.toast.show {
  transform: translateX(-50%) translateY(0);
}

.toast.success {
  background: #2ecc71;
  color: white;
  border-color: #2ecc71;
}

.toast.error {
  background: #e74c3c;
  color: white;
  border-color: #e74c3c;
}

/* Responsive */
@media (max-width: 640px) {
  .glass-wrapper {
    margin: 1rem;
    padding: 1.5rem;
  }
  
  .toast {
    white-space: normal;
    text-align: center;
    max-width: 80%;
  }
}
</style>