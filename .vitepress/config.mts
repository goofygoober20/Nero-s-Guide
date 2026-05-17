import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Nero's Guide",
  
  ignoreDeadLinks: true,

  themeConfig: {
    logo: '/logo.png',

    nav: [
      { text: '🏠 Home', link: '/' },
      { text: '🌱 Beginners Guide', link: '/beginners-guide' },
      { text: '⚙️ Settings', link: '/settings' },
      { text: '💬 Feedback', link: '/feedback' },
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
      // ... your existing sidebar (keep as is)
    ],

    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/j4ngcS9hj' }
    ],

    search: {
      provider: 'local'
    }
  }
})