<template>
  <a href="/feedback" class="nav-feedback-btn" aria-label="Feedback">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      <line x1="9" y1="10" x2="15" y2="10"/>
      <line x1="12" y1="7" x2="12" y2="13"/>
    </svg>
  </a>
</template>

<style scoped>
.nav-feedback-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  color: var(--vp-c-text-2);
  transition: color 0.2s, background 0.2s;
  text-decoration: none;
}

.nav-feedback-btn:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}
</style>
