<script setup>
import PrivacyThreatModelQuiz from './.vitepress/theme/components/PrivacyThreatModelQuiz.vue'
</script>

# 🛡️ Privacy Threat Model Quiz

<div class="quiz-intro">
  <p>Privacy isn't one-size-fits-all. This quiz helps you identify <strong>who you're protecting against</strong> and <strong>what you're protecting</strong>, then recommends the right tools and a personalized action checklist for your threat model.</p>
</div>

<ClientOnly>
  <PrivacyThreatModelQuiz />
</ClientOnly>

<div class="about-tip">
  <span class="tip-icon">⚠️</span>
  <span><strong>This is a starting point.</strong> Privacy is a process, not a product. Re-evaluate as your situation changes.</span>
</div>

<style scoped>
.quiz-intro {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 1.5rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}
.about-tip {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  background: var(--vp-c-brand-soft);
  border: 1px solid var(--vp-c-divider);
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  margin-top: 1rem;
}
.tip-icon { flex-shrink: 0; font-size: 1.1rem; margin-top: 0.1rem; }
</style>