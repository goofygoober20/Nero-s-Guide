---
title: Feedback
description: Send bug reports, guide suggestions, appreciation, or website help requests for Nero's Index.
layout: page
---

<!-- Full-page glass background -->
<div class="page-glass-bg"></div>

<div class="glass-wrapper">

  <!-- Tabs -->
  <div class="tabs">
    <button id="feedbackTab" class="tab active">🐛 Feedback</button>
    <button id="suggestionTab" class="tab">💡 Suggestion</button>
    <button id="appreciationTab" class="tab">🙏 Appreciation</button>
    <button id="helpTab" class="tab">🛟 Website Help</button>
    <button id="otherTab" class="tab">📁 Something Else</button>
  </div>

  <!-- FEEDBACK -->
  <section id="feedbackContent" class="panel active">
    <p class="intro">Found a bug, broken link, or something not working right? Let me know.</p>
    <div class="field">
      <input type="text" id="fbName" placeholder=" " />
      <label>Name (optional)</label>
    </div>
    <div class="field">
      <input type="email" id="fbEmail" placeholder=" " />
      <label>Email (optional)</label>
    </div>
    <div class="field">
      <textarea id="fbMsg" rows="5" placeholder=" "></textarea>
      <label>What went wrong? *</label>
    </div>
    <button id="sendFeedbackBtn" class="primary-btn">Send Feedback</button>
    <div id="feedbackStatus" class="status"></div>
  </section>

  <!-- SUGGESTION -->
  <section id="suggestionContent" class="panel">
    <p class="intro">Have an idea for a new guide, tool, or feature? I'm all ears.</p>
    <div class="field">
      <input type="text" id="sgName" placeholder=" " />
      <label>Name (optional)</label>
    </div>
    <div class="field">
      <input type="email" id="sgEmail" placeholder=" " />
      <label>Email (optional)</label>
    </div>
    <div class="field">
      <textarea id="sgMsg" rows="5" placeholder=" "></textarea>
      <label>Your Suggestion *</label>
    </div>
    <button id="sendSuggestionBtn" class="primary-btn">Submit Suggestion</button>
    <div id="suggestionStatus" class="status"></div>
  </section>

  <!-- APPRECIATION -->
  <section id="appreciationContent" class="panel">
    <p class="intro">Made your day? Say thanks - it means a lot.</p>
    <div class="field">
      <input type="text" id="apName" placeholder=" " />
      <label>Your Name (optional)</label>
    </div>
    <div class="field">
      <textarea id="apMsg" rows="4" placeholder=" "></textarea>
      <label>Your Message *</label>
    </div>
    <button id="sendAppreciationBtn" class="primary-btn">Send Thanks</button>
    <div id="appreciationStatus" class="status"></div>
  </section>

  <!-- WEBSITE HELP -->
  <section id="helpContent" class="panel">
    <p class="intro">Stuck navigating the site? Can't find something? Ask away.</p>
    <div class="field">
      <input type="text" id="hlName" placeholder=" " />
      <label>Name (optional)</label>
    </div>
    <div class="field">
      <input type="email" id="hlEmail" placeholder=" " />
      <label>Email (optional - for reply)</label>
    </div>
    <div class="field">
      <textarea id="hlMsg" rows="5" placeholder=" "></textarea>
      <label>What do you need help with? *</label>
    </div>
    <button id="sendHelpBtn" class="primary-btn">Send Help Request</button>
    <div id="helpStatus" class="status"></div>
  </section>

  <!-- SOMETHING ELSE -->
  <section id="otherContent" class="panel">
    <p class="intro">Doesn't fit anywhere else? This is your catch-all.</p>
    <div class="field">
      <input type="text" id="otName" placeholder=" " />
      <label>Name (optional)</label>
    </div>
    <div class="field">
      <input type="email" id="otEmail" placeholder=" " />
      <label>Email (optional - for reply)</label>
    </div>
    <div class="field select-wrapper">
      <select id="otType">
        <option value=""></option>
        <option value="Question">❓ Question</option>
        <option value="Collaboration">🤝 Collaboration Inquiry</option>
        <option value="Other">📌 Other</option>
      </select>
      <label>Type *</label>
      <div class="select-arrow"></div>
    </div>
    <div class="field">
      <textarea id="otMsg" rows="5" placeholder=" "></textarea>
      <label>Your Message *</label>
    </div>
    <button id="sendOtherBtn" class="primary-btn">Send Message</button>
    <div id="otherStatus" class="status"></div>
  </section>

</div>

<!-- GLOBAL GLASS TOAST -->
<div id="toast" class="toast"></div>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const toast = document.getElementById("toast")
  const tabs = ["feedback", "suggestion", "appreciation", "help", "other"]

  const switchTab = (tab) => {
    tabs.forEach((t) => {
      document.getElementById(`${t}Tab`).classList.toggle("active", t === tab)
      document.getElementById(`${t}Content`).classList.toggle("active", t === tab)
    })
  }

  tabs.forEach((t) => {
    document.getElementById(`${t}Tab`).onclick = () => switchTab(t)
  })

  const showToast = (msg, type) => {
    toast.textContent = msg
    toast.className = `toast show ${type}`
    setTimeout(() => toast.classList.remove("show"), 5000)
  }

  const sendFeedback = async (type, payload) => {
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ...payload }),
      })
      return res.ok
    } catch {
      return false
    }
  }

  document.getElementById("otType").addEventListener("change", (e) => {
    e.target.classList.toggle("filled", e.target.value !== "")
  })

  // --- Feedback ---
  document.getElementById("sendFeedbackBtn").onclick = async () => {
    const name = document.getElementById("fbName").value.trim() || "Anonymous"
    const email = document.getElementById("fbEmail").value.trim()
    const msg = document.getElementById("fbMsg").value.trim()

    if (!msg) return showToast("Please enter feedback.", "error")

    const ok = await sendFeedback('feedback', { name, email, message: msg })
    showToast(ok ? "Thank you!" : "Error sending feedback.", ok ? "success" : "error")
  }

  // --- Suggestion ---
  document.getElementById("sendSuggestionBtn").onclick = async () => {
    const name = document.getElementById("sgName").value.trim() || "Anonymous"
    const email = document.getElementById("sgEmail").value.trim()
    const msg = document.getElementById("sgMsg").value.trim()

    if (!msg) return showToast("Please enter your suggestion.", "error")

    const ok = await sendFeedback('suggestion', { name, email, message: msg })
    showToast(ok ? "Suggestion submitted!" : "Error submitting suggestion.", ok ? "success" : "error")
  }

  // --- Appreciation ---
  document.getElementById("sendAppreciationBtn").onclick = async () => {
    const name = document.getElementById("apName").value.trim() || "Anonymous"
    const msg = document.getElementById("apMsg").value.trim()

    if (!msg) return showToast("Please enter a message.", "error")

    const ok = await sendFeedback('appreciation', { name, message: msg })
    showToast(ok ? "Thanks for the kind words! 💚" : "Error sending message.", ok ? "success" : "error")
  }

  // --- Website Help ---
  document.getElementById("sendHelpBtn").onclick = async () => {
    const name = document.getElementById("hlName").value.trim() || "Anonymous"
    const email = document.getElementById("hlEmail").value.trim()
    const msg = document.getElementById("hlMsg").value.trim()

    if (!msg) return showToast("Please describe what you need help with.", "error")

    const ok = await sendFeedback('help', { name, email, message: msg })
    showToast(ok ? "Help request sent!" : "Error sending request.", ok ? "success" : "error")
  }

  // --- Something Else ---
  document.getElementById("sendOtherBtn").onclick = async () => {
    const name = document.getElementById("otName").value.trim() || "Anonymous"
    const email = document.getElementById("otEmail").value.trim()
    const type = document.getElementById("otType").value
    const msg = document.getElementById("otMsg").value.trim()

    if (!type || !msg) return showToast("Please fill all required fields.", "error")

    const ok = await sendFeedback('other', { name, email, message: msg, subject: type })
    showToast(ok ? "Message sent!" : "Error sending message.", ok ? "success" : "error")
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
  flex-wrap: wrap;
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
  
  .tabs {
    gap: 0.5rem;
  }
  
  .tab {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
}
</style>