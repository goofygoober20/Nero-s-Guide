import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Nero's Guide",
  
  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    // Add custom CSS for search modal
    ['style', {}, `
      /* Search modal overlay */
      .DocSearch-Container {
        background: rgba(0, 0, 0, 0.75) !important;
        backdrop-filter: blur(10px) !important;
        -webkit-backdrop-filter: blur(10px) !important;
      }
      
      /* Dark mode overlay */
      .dark .DocSearch-Container {
        background: rgba(0, 0, 0, 0.85) !important;
      }
      
      /* Search modal itself */
      .DocSearch-Modal {
        background: var(--vp-c-bg-elv) !important;
        border-radius: 16px !important;
      }
      
      /* Search input area */
      .DocSearch-Form {
        background: var(--vp-c-bg-soft) !important;
        border: 1px solid var(--vp-c-divider) !important;
        border-radius: 12px !important;
      }
      
      /* Search results */
      .DocSearch-Hit a {
        background: var(--vp-c-bg-soft) !important;
        border-radius: 8px !important;
      }
      
      .DocSearch-Hit a:hover {
        background: var(--vp-c-bg-soft-up) !important;
      }
      
      /* Footer */
      .DocSearch-Footer {
        background: var(--vp-c-bg-soft) !important;
        border-top: 1px solid var(--vp-c-divider) !important;
      }
      
      /* Highlight color */
      .DocSearch-Highlight {
        color: var(--vp-c-brand-1) !important;
      }
      
      /* Keyboard shortcuts */
      .DocSearch-Commands-Key {
        background: var(--vp-c-bg-soft) !important;
        border: 1px solid var(--vp-c-divider) !important;
        color: var(--vp-c-text-2) !important;
        box-shadow: none !important;
      }
    `]
  ],

  themeConfig: {
    logo: '/logo.png',
    
    nav: [
      { text: '🏠 Home', link: '/' },
      { text: '🌱 Beginners Guide', link: '/beginners-guide' },
      { 
        text: '🛠️ Tools', 
        items: [
          { text: '😴 Sleep Cycle Calculator', link: '/tools/sleep-cycle-calculator' },
          { text: '🔐 Password Strength Tester', link: '/tools/password-strength-tester' },
          { text: '🔑 Password Generator', link: '/tools/password-generator' },
          { text: '📈 Investment Calculator', link: '/tools/investment-calculator' },
          { text: '⏱️ Pomodoro Timer', link: '/tools/pomodoro' },
          { text: '📊 BMI Calculator', link: '/tools/bmi-calculator' },
          { text: '—', link: '' },
          { text: '🎲 Random Guide', link: '/random' },
          { text: '💬 Feedback', link: '/feedback' },
          { text: '⚙️ Settings', link: '/settings' },
        ]
      },
    ],

    sidebar: [
      // Add your sidebar items here
      // Example:
      {
        text: 'Categories',
        items: [
          { text: '🛡️ Adblocking / Privacy', link: '/privacy' },
          { text: '🤖 Artificial Intelligence', link: '/ai' },
          // ... add your other categories
        ]
      }
    ],

    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/j4ngcS9hj' }
    ],

    search: {
      provider: 'local'
    }
  }
})