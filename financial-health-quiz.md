---
title: Financial Health Quiz
description: Assess your financial health across 6 categories — get a score, tier, personalized priorities, and a 12-month roadmap.
---

<script setup>
import FinancialHealthQuiz from './.vitepress/theme/components/FinancialHealthQuiz.vue'
</script>

# 💰 Financial Health Quiz

<div class="quiz-intro">
  <p>Where do you stand? This quiz evaluates your financial life across <strong>6 categories</strong> — Foundation, Investing, Cash Flow, Protection, Goals, and Review — then gives you a score, tier, top 3 priorities, and a personalized 12-month roadmap.</p>
</div>

<ClientOnly>
  <FinancialHealthQuiz />
</ClientOnly>

<div class="about-tip">
  <span class="tip-icon">⚠️</span>
  <span><strong>Educational only — not financial advice.</strong> Verify rates, rules, and eligibility for your country. Consult a qualified professional for major decisions.</span>
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