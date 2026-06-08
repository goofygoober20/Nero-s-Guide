<template>
  <div class="feedback-bar">
    <div v-if="!isOpen" class="feedback-collapsed">
      <div class="collapsed-inner">
        <div class="collapsed-left">
          <span class="collapsed-icon">💬</span>
          <div>
            <div class="collapsed-title">Got feedback?</div>
            <div class="collapsed-sub">We'd love to know what you think about this page.</div>
          </div>
        </div>
        <button class="share-btn" @click="isOpen = true">
          Share Feedback
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>

    <div v-else class="feedback-expanded">
      <Transition name="fade" mode="out-in">
        <div v-if="!feedback.type" key="select">
          <div class="expanded-header">
            <div class="expanded-title">
              <span class="header-icon">💬</span>
              What do you think about this page?
            </div>
            <button class="close-btn" @click="close">✕</button>
          </div>
          <p class="expanded-desc">Let us know how helpful this page is.</p>
          <div class="type-options">
            <button
              v-for="opt in feedbackOptions"
              :key="opt.value"
              class="type-btn"
              @click="selectType(opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <div v-else-if="feedback.type && !success" key="write">
          <div class="expanded-header">
            <div class="expanded-title">
              <span class="header-icon">{{ selectedIcon }}</span>
              {{ selectedLabel }}
            </div>
            <button class="close-btn" @click="close">✕</button>
          </div>
          <p class="expanded-desc">{{ randomMessage }}</p>
          <div v-if="error" class="error-msg">
            <strong>Error:</strong> {{ error }}
          </div>
          <textarea
            v-model="feedback.message"
            class="feedback-textarea"
            :placeholder="placeholderText"
            rows="4"
            @input="error = null"
          />
          <p class="textarea-footnote">Add your Discord handle if you'd like a response.</p>
          <div class="action-row">
            <button class="back-btn" @click="resetType">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </button>
            <button
              class="send-btn"
              :disabled="isDisabled || loading"
              @click="handleSubmit"
            >
              {{ loading ? 'Sending...' : 'Send Feedback 📩' }}
            </button>
          </div>
        </div>

        <div v-else key="success">
          <div class="expanded-header">
            <div class="expanded-title">
              <span class="header-icon">🎉</span>
              Thanks for your feedback!
            </div>
            <button class="close-btn" @click="close">✕</button>
          </div>
          <p class="expanded-desc">Your feedback has been sent. I read every submission.</p>
        </div>
      </Transition>
    </div>

    <Transition name="toast">
      <div v-if="toastMsg" class="toast" :class="toastType">
        {{ toastMsg }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vitepress'

const WEBHOOK = import.meta.env.VITE_FEEDBACK_WEBHOOK

const router = useRouter()
const isOpen = ref(false)
const loading = ref(false)
const error = ref(null)
const success = ref(false)
const toastMsg = ref('')
const toastType = ref('')

const feedbackOptions = [
  { value: 'suggestion', label: '💡 Suggest', icon: '💡' },
  { value: 'appreciation', label: '🙏 Appreciate', icon: '🙏' },
  { value: 'other', label: '📁 Other', icon: '📁' },
]

const prompts = [
  "Make it count!",
  "We're all ears 🐰",
  "Your thoughts matter to us 💡",
  "Feedback is a gift 🎁",
  "What do you think?",
  "We appreciate your support 🙏",
  "Your feedback is valuable 💯",
  "So... what do you think?",
  "Spill the beans 💣",
  "We're always looking for ways to improve!",
  "aliens are watching you 👽",
]

const messages = {
  suggestion: [
    "We're glad you want to share your ideas!",
    "Nix the fluff and just tell us what you think!",
    "Hello! We're glad you want to share your ideas!",
  ],
  appreciation: [
    "We appreciate your support!",
    "Your feedback is valuable and helps us improve.",
    "We're always looking for ways to get better!",
  ],
  other: [
    "We're always looking for ways to improve!",
    "Your feedback is valuable and helps us make the site better.",
  ],
}

const feedback = reactive({
  message: '',
  type: null,
})

const selectedLabel = computed(() => {
  const opt = feedbackOptions.find(o => o.value === feedback.type)
  return opt ? opt.label : ''
})

const selectedIcon = computed(() => {
  const opt = feedbackOptions.find(o => o.value === feedback.type)
  return opt ? opt.icon : ''
})

const randomMessage = computed(() => {
  const msgs = messages[feedback.type] || messages.other
  return msgs[Math.floor(Math.random() * msgs.length)]
})

const placeholderText = computed(() => {
  if (feedback.type === 'suggestion') return 'I have an idea...'
  if (feedback.type === 'appreciation') return 'I really liked...'
  return 'I wanted to say...'
})

const isDisabled = computed(() => {
  return !feedback.message.length || feedback.message.length < 5 || feedback.message.length > 1000
})

function selectType(type) {
  feedback.type = type
  error.value = null
}

function resetType() {
  feedback.type = null
  error.value = null
}

function close() {
  isOpen.value = false
  feedback.type = null
  feedback.message = ''
  error.value = null
  success.value = false
}

function showToast(msg, type) {
  toastMsg.value = msg
  toastType.value = type
  setTimeout(() => { toastMsg.value = '' }, 4000)
}

async function handleSubmit() {
  loading.value = true
  error.value = null

  const typeLabels = { suggestion: '💡 Suggestion', appreciation: '🙏 Appreciation', other: '📁 Other' }

  const embed = {
    title: `💬 Topbar Feedback: ${typeLabels[feedback.type] || 'Other'}`,
    color: 0x71ad70,
    timestamp: new Date().toISOString(),
    fields: [
      { name: 'Type', value: typeLabels[feedback.type] || 'Other', inline: true },
      { name: 'Page', value: router.route.path, inline: true },
      { name: 'Source', value: 'Top Bar Widget', inline: true },
      { name: 'Message', value: feedback.message },
    ],
  }

  try {
    const res = await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'Feedback Widget', embeds: [embed] }),
    })

    if (!res.ok) throw new Error('Failed to send')

    success.value = true
    showToast('Feedback sent! Thank you 🎉', 'success')
  } catch (err) {
    error.value = 'Failed to send feedback. Please try again.'
    showToast('Error sending feedback', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.feedback-bar {
  margin: 0 auto;
  position: relative;
}

/* Collapsed */
.feedback-collapsed {
  margin: 1rem auto;
  max-width: 840px;
}

.collapsed-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1.25rem;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.collapsed-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.collapsed-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.collapsed-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.collapsed-sub {
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
  margin-top: 0.05rem;
}

.share-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 40px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.2s, transform 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}

.share-btn:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

/* Expanded */
.feedback-expanded {
  margin: 1rem auto;
  max-width: 840px;
  padding: 1.25rem 1.5rem;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.expanded-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.4rem;
}

.expanded-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-icon {
  flex-shrink: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1rem;
  color: var(--vp-c-text-3);
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;
  flex-shrink: 0;
}

.close-btn:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
}

.expanded-desc {
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  margin: 0 0 1rem;
  line-height: 1.4;
}

/* Type options */
.type-options {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.type-btn {
  padding: 0.55rem 1.1rem;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, transform 0.2s;
}

.type-btn:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  transform: translateY(-1px);
}

/* Textarea */
.feedback-textarea {
  width: 100%;
  padding: 0.75rem;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.88rem;
  line-height: 1.5;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  font-family: inherit;
}

.feedback-textarea:focus {
  border-color: var(--vp-c-brand-1);
}

.feedback-textarea::placeholder {
  color: var(--vp-c-text-3);
}

.textarea-footnote {
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  margin: 0.4rem 0 0.75rem;
}

/* Error */
.error-msg {
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.3);
  color: #e74c3c;
  font-size: 0.78rem;
  margin-bottom: 0.75rem;
}

/* Action row */
.action-row {
  display: flex;
  gap: 0.6rem;
  align-items: center;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.55rem 1rem;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.back-btn:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.send-btn {
  flex: 1;
  padding: 0.55rem 1rem;
  border-radius: 40px;
  border: none;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.2s, transform 0.2s;
}

.send-btn:hover:not(:disabled) {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%) translateY(0);
  padding: 0.65rem 1.25rem;
  border-radius: 40px;
  font-size: 0.82rem;
  font-weight: 600;
  z-index: 1000;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.toast.success {
  background: #2ecc71;
  color: #fff;
  border-color: #2ecc71;
}

.toast.error {
  background: #e74c3c;
  color: #fff;
  border-color: #e74c3c;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.toast-enter-active,
.toast-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  transform: translateX(-50%) translateY(100%);
  opacity: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .feedback-bar {
    padding: 0 1rem;
  }

  .collapsed-inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .share-btn {
    width: 100%;
    justify-content: center;
  }

  .type-options {
    flex-direction: column;
  }

  .action-row {
    flex-direction: column;
  }

  .back-btn {
    width: 100%;
    justify-content: center;
  }

  .toast {
    white-space: normal;
    text-align: center;
    max-width: 80%;
  }
}
</style>
