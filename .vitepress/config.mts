import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Nero's Guide",
  
  ignoreDeadLinks: true,  // Add this line to fix the build error

  // We removed the "vite: { plugins }" section here

  themeConfig: {
    logo: '/logo.png',

    nav: [
      { text: 'Beginners Guide', link: '/beginners-guide' },
      { text: 'Changelog', link: '/changelog' },
    ],

    sidebar: [
      {
        text: 'Categories',
        items: [
          { text: '🛡️ Adblocking / Privacy', link: '/privacy' },
          { text: '🤖 Artificial Intelligence', link: '/ai' },
          { text: '🎬 Streaming', link: '/video' },
          { text: '🎵 Listening', link: '/audio' },
          { text: '🎮 Gaming', link: '/gaming' },
          { text: '🧠 Theories', link: '/theories' },
          { text: '📚 Reading', link: '/reading' },
          { text: '💼 Career', link: '/career' },
          { text: '⬇️ Downloading', link: '/downloading' },
          { text: '🍽️ Food', link: '/food' },
          { text: '💊 Health', link: '/health' },
          { text: '🎓 Educational', link: '/educational' },
          { text: '💻 Unenrollment', link: '/unenrollment' },
          { text: '📦 Miscellaneous', link: '/misc' },
          { text: '⚙️ Settings', link: '/settings' }
        ]
      },
      {
        text: 'Other',
        items: [
          { text: 'Beginners Guide', link: '/beginners-guide' },
          { text: 'Posts', link: '/posts' },
          { text: 'Contributing', link: '/other/contributing' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/j4ngcS9hj' }
    ],

    search: {
      provider: 'local'
    },

    footer: {
      message: "Made with ❤️ by Nero (or cameron c if you know who i am)",
      copyright: `© 2026`
    }
  }
})