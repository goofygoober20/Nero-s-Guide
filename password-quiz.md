---
title: Password Manager Quiz
description: Find the perfect password manager for your needs with our interactive quiz.
---

<script setup>
import PasswordManagerQuiz from './.vitepress/theme/components/PasswordManagerQuiz.vue'
</script>

# &#128272; Password Manager Quiz

<div class="quiz-intro">
  <p>Not sure which password manager is right for you? Answer 7 quick questions about your devices, budget, and preferences &mdash; we'll match you with the best option.</p>
</div>

<PasswordManagerQuiz />

<div class="quiz-footer">
  <a href="/passwords" class="back-link">&larr; Back to the Password Guide</a>
  <a href="/tools/password-generator" class="back-link">&#128273; Try the Password Generator</a>
</div>

<div class="about-tip">
  <span class="tip-icon">&#128161;</span>
  <span>Recommendations are based on your preferences. Always research before choosing a password manager for your security needs.</span>
</div>

<style scoped>
.quiz-intro {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 1.5rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.quiz-footer {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin: 1.5rem 0;
}

.back-link {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  transition: border-color 0.2s, background 0.2s;
}

.back-link:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
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

.tip-icon {
  flex-shrink: 0;
  font-size: 1.1rem;
}
</style>
