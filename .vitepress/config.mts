import { defineConfig } from 'vitepress'
import { transformsPlugin } from './.vitepress/transformers'

export default defineConfig({
  title: "Nero's Guide",

  vite: {
    plugins: [transformsPlugin()]
  },

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
          { text: '📚 Reading', link: '/reading' },
          { text: '⬇️ Downloading', link: '/downloading' },
          { text: '🎓 Educational', link: '/educational' },
          { text: '💻 Unenrollment', link: '/unenrollment' },
          { text: '📦 Miscellaneous', link: '/misc' },
        ]
      },
      {
        text: 'Other',
        items: [
          { text: 'Beginners Guide', link: '/beginners-guide' },
          { text: '👁️ Theories & Mysteries', link: '/theories' }, // <-- Added your new page here!
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
      message: "Made with ❤️ by Nero)",
      copyright: `© 2026`
    }
  }
})