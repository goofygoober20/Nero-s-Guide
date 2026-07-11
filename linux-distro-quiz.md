<script setup>
import LinuxDistroQuiz from './.vitepress/theme/components/LinuxDistroQuiz.vue'
</script>

# 🐧 Linux Distro Quiz

<div class="quiz-intro">
  <p>Not sure which Linux distribution is right for you? Answer 8 questions about your hardware, goals, experience level, and preferences — we'll match you with the best distros for your situation.</p>
</div>

<ClientOnly>
  <LinuxDistroQuiz />
</ClientOnly>

<div class="about-tip">
  <span class="tip-icon">💡</span>
  <span><strong>Recommendations are based on your preferences.</strong> Always test with a live USB before installing. Your hardware compatibility matters most!</span>
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