<template>
  <div class="not-found">
    <span class="not-found-number">404</span>

    <h1 class="not-found-heading">You took a wrong turn</h1>
    <p class="not-found-desc">
      This page doesn't exist or has been moved. Try searching below, or head back home.
    </p>

    <div class="not-found-actions">
      <a href="/" class="not-found-btn primary">Home</a>
      <a href="/posts" class="not-found-btn secondary">Latest Posts</a>
    </div>

    <button class="not-found-search" @click="openSearch">
      🔍 Search the guide...
      <span class="search-hint">⌘K</span>
    </button>

    <p class="not-found-feedback">
      Found a broken link?
      <a href="/feedback" class="not-found-link">Let us know</a>
    </p>
  </div>
</template>

<script setup>
function openSearch() {
  const btn = document.querySelector('.VPNavBarSearchButton button')
  if (btn) btn.click()
}
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 6rem 1.5rem 4rem;
  max-width: 480px;
  margin: 0 auto;
}

.not-found-number {
  display: block;
  font-size: 6rem;
  font-weight: 800;
  line-height: 1;
  color: var(--vp-c-divider);
  letter-spacing: -0.04em;
  margin-bottom: 0.5rem;
  user-select: none;
}

.not-found-heading {
  font-size: 1.35rem;
  margin: 0 0 0.75rem;
  color: var(--vp-c-text-1);
  font-weight: 700;
}

.not-found-desc {
  color: var(--vp-c-text-2);
  margin: 0 auto 1.5rem;
  font-size: 0.92rem;
  line-height: 1.6;
}

.not-found-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.not-found-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.not-found-btn.primary {
  background: var(--vp-c-brand-1);
  color: #fff;
  border: 1px solid var(--vp-c-brand-1);
}

.not-found-btn.primary:hover {
  opacity: 0.85;
}

.not-found-btn.secondary {
  background: transparent;
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.not-found-btn.secondary:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.not-found-search {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s;
  justify-content: center;
}

.not-found-search:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}

.search-hint {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-elv);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
}

.not-found-feedback {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  margin-top: 2rem;
}

.not-found-link {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>
