<template>
  <footer class="custom-footer">
    <div class="footer-wrapper">
      <div class="footer-content">
        <div class="footer-section">
          <h4>📖 Nero's Guide</h4>
          <p>Curated guides & resources for everyday life</p>
        </div>
        
        <div class="footer-section">
          <h4>🔗 Quick Links</h4>
          <a href="/beginners-guide">Getting Started</a>
          <a href="/settings">Settings</a>
          <div class="random-wrapper">
            <RandomGuide />
          </div>
        </div>
        
        <div class="footer-section">
          <h4>💬 Connect</h4>
          <a href="https://discord.gg/j4ngcS9hj" target="_blank" rel="noopener noreferrer">Discord Community</a>
          <a href="/feedback">Send Feedback</a>
          <a href="/about">About Me</a>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="footer-copyright">
          <span>Made by Nero</span>
          <span>© 2026</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import RandomGuide from './RandomGuide.vue'
</script>

<style scoped>
.custom-footer {
  width: 100%;
  margin-top: 3rem;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
}

.footer-wrapper {
  max-width: 1152px;
  margin: 0 auto;
  padding: 2rem 1.5rem 1.5rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.footer-section h4 {
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.footer-section p {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  line-height: 1.4;
  margin: 0;
}

.footer-section a {
  display: block;
  color: var(--vp-c-text-2);
  text-decoration: none;
  margin-bottom: 0.4rem;
  font-size: 0.8rem;
  transition: all 0.2s ease;
}

.footer-section a:hover {
  color: var(--vp-c-brand-1);
  transform: translateX(3px);
}

.random-wrapper {
  margin-top: 0.5rem;
}

.footer-bottom {
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 1rem;
}

.footer-copyright {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
}

@media (max-width: 640px) {
  .footer-wrapper {
    padding: 1.5rem 1rem 1rem;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.25rem;
    text-align: center;
  }
  
  .footer-section a {
    display: inline-block;
    margin: 0 0.5rem 0.25rem;
  }
  
  .footer-section a:hover {
    transform: translateY(-2px);
  }
  
  .footer-copyright {
    flex-direction: column;
    text-align: center;
  }
}
</style>