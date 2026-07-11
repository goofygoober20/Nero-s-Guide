---
title: Sleep Guide
description: Science-backed sleep resources and guides for better rest
---

<script setup></script>

# Sleep Guide

## Science-Backed Resources

<div class="resource-grid">
  <a href="https://www.sleepfoundation.org/" target="_blank" rel="noopener noreferrer" class="resource-card">
    <GuideIcon name="moon" class="resource-icon" />
    <div class="resource-body">
      <h4>Sleep Foundation</h4>
      <p>Evidence-based sleep information and practical guides</p>
    </div>
  </a>
  <a href="https://www.hubermanlab.com/topics/sleep-hygiene" target="_blank" rel="noopener noreferrer" class="resource-card">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="resource-icon"><path d="M10 2v6.292a7 7 0 1 0 4 0V2"/><path d="M5 15h14"/><path d="M8.5 2h7"/></svg>
    <div class="resource-body">
      <h4>Huberman Lab Sleep Toolkit</h4>
      <p>Neuroscience-based sleep protocols and tools</p>
    </div>
  </a>
  <a href="https://www.sleepdiplomat.com/" target="_blank" rel="noopener noreferrer" class="resource-card">
    <GuideIcon name="book" class="resource-icon" />
    <div class="resource-body">
      <h4>Why We Sleep - Matthew Walker</h4>
      <p>Bestselling book on the science of sleep and its impact on health</p>
    </div>
  </a>
  <a href="https://www.youtube.com/results?search_query=nsdr+huberman" target="_blank" rel="noopener noreferrer" class="resource-card">
    <GuideIcon name="music" class="resource-icon" />
    <div class="resource-body">
      <h4>NSDR Guided Sessions</h4>
      <p>Non-Sleep Deep Rest protocols for recovery and relaxation</p>
    </div>
  </a>
</div>

## Guides & Tools

<div class="guide-grid">
  <a href="/sleeping/quiz" class="guide-card">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="guide-icon"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    <div class="guide-body">
      <h4>Sleep Quiz</h4>
      <p>Interactive assessment to understand your sleep patterns</p>
    </div>
  </a>
  <a href="/sleeping/shift-schedule" class="guide-card">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="guide-icon"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    <div class="guide-body">
      <h4>Shifting Your Sleep Schedule</h4>
      <p>Adjust your sleep schedule for different routines or time zones</p>
    </div>
  </a>
  <a href="/all-nighter" class="guide-card">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="guide-icon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
    <div class="guide-body">
      <h4>All-Nighter Guide</h4>
      <p>How to survive and recover when you have to stay up</p>
    </div>
  </a>
</div>

## Box Breathing

Use this guided breathing exercise before bed to activate your parasympathetic nervous system and prepare your body for sleep.

<BoxBreathing />

<style scoped>
.resource-icon,
.guide-icon {
  flex-shrink: 0;
}

.guide-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 640px) {
  .guide-grid {
    grid-template-columns: 1fr;
  }
}

.guide-card {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1rem;
  text-decoration: none;
  transition: border-color 0.2s, transform 0.2s;
}

.guide-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-1px);
  text-decoration: none;
}

.guide-icon {
  color: var(--vp-c-brand-1);
  margin-top: 0.15rem;
}

.guide-body h4 {
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
}

.guide-body p {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.45;
  color: var(--vp-c-text-2);
}
</style>
