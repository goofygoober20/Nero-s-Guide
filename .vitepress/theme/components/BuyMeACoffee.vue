<template>
  <div class="coffee-container">
    <div class="coffee-card">
      <div class="coffee-icon">☕</div>
      <h3>Support Nero's Guide</h3>
      <p>If this guide has helped you, consider buying me a coffee!<br>It keeps the project alive and free for everyone.</p>
      
      <div class="buttons">
        <a :href="coffeeLink" target="_blank" class="coffee-btn primary">
          ☕ Buy Me a Coffee
        </a>
        <a href="https://github.com/goofygoober20/Nero-s-Guide" target="_blank" class="coffee-btn secondary">
          ⭐ Star on GitHub
        </a>
      </div>
      
      <div class="stats" v-if="showStats">
        <span>❤️ 0 supporters</span>
        <span>📅 Updated May 2026</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const coffeeLink = 'https://www.alz.org/?form=FUNDHYMMBXU'
const showStats = false // Set to true if you want stats
</script>

<style scoped>
.coffee-container {
  margin: 3rem 0 1rem;
}

.coffee-card {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, var(--vp-c-bg-soft) 0%, var(--vp-c-bg) 100%);
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.coffee-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.coffee-card h3 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
}

.coffee-card p {
  color: var(--vp-c-text-2);
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.coffee-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.coffee-btn.primary {
  background: #FFDD00;
  color: #000;
}

.coffee-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 221, 0, 0.3);
}

.coffee-btn.secondary {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.coffee-btn.secondary:hover {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
}

.stats {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

@media (max-width: 640px) {
  .buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .coffee-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>