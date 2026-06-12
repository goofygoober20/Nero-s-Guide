import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

function rssFeedPlugin() {
  return {
    name: 'rss-feed',
    closeBundle() {
      const postsPath = path.resolve(process.cwd(), 'public', 'approved-posts.json')
      if (!fs.existsSync(postsPath)) return

      let posts
      try {
        posts = JSON.parse(fs.readFileSync(postsPath, 'utf-8'))
      } catch {
        return
      }
      
    const SITE_URL = 'https://ner0.netlify.app/'

    const items = posts.map ((post: { message: any; id: any; timestamp: any; date: any })=> `
    <item>
      <title><![CDATA[${post.message}]]></title>
      <link>${SITE_URL}/posts</link>
      <guid isPermaLink="false">${post.id}</guid>
      <pubDate>${new Date(post.timestamp || post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.message}]]></description>
    </item>`).join('')

      const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Nero's Index - Updates</title>
    <link>${SITE_URL}/posts</link>
    <description>Latest updates and changelog for Nero's Index</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>${items}
  </channel>
</rss>`

      const outDir = path.resolve(process.cwd(), '.vitepress', 'dist')
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true })
      }
      fs.writeFileSync(path.join(outDir, 'feed.xml'), feed.trim())
      console.log('✅ RSS feed generated at feed.xml')
    }
  }
}

export default defineConfig({
  srcExclude: ['archived/**/*.md'],
  title: "Nero's Index",

  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: "Nero's Index Updates", href: '/feed.xml' }],
    ['meta', { property: 'og:title', content: "Nero's Index" }],
    ['meta', { property: 'og:description', content: 'Curated collection of free guides and resources.' }],
    ['meta', { property: 'og:image', content: '/og-image.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],

  vite: {
    plugins: [rssFeedPlugin()],
  },

  themeConfig: {
    logo: '/logo.png',

    nav: [
      { text: '🏠  Home', link: '/' },
      { text: '📰  Posts', link: '/posts' },
    ],

    sidebar: [
      {
        text: 'Personal Guides',
        items: [
          { text: '🔐 Password Guide', link: '/passwords' },
          { text: '💪 Fitness Guide', link: '/fitness' },
          { text: '🍳 Cooking Guide', link: '/cooking' },
          { text: '🎨 Drawing Guide', link: '/drawing' },
          {
            text: '🛍️ Shopping Guide',
            collapsed: true,
            items: [
              { text: 'Shopping Guide', link: '/shopping' },
              { text: 'Shopping Resources', link: '/shopping-resources' },
            ]
          },
          { text: '🧅 Dark Web Guide', link: '/darkweb' },
          { text: '♟️ Chess Guide', link: '/chess' },
          { text: '🔓 Unenrollment', link: '/unenrollment' },
          { text: '🐧 Linux for Beginners', link: '/linux' },
          { text: '🛡️ Online Privacy', link: '/privacy' },
          { text: '💰 Personal Finance', link: '/finance' },
          { text: '📋 Productivity Guide', link: '/productivity' },
          { text: '🌱 Minimalism Guide', link: '/minimalism' },
          { text: '🎮 Gaming Guide', link: '/gaming' },
        ]
      },
      {
        text: 'Tools',
        items: [
          { text: '📈 Investment Calculator', link: '/tools/investment-calculator' },
          { text: '⏱️ Pomodoro Timer', link: '/tools/pomodoro' },
          { text: '📊 BMI Calculator', link: '/tools/bmi-calculator' },
          { text: '🔐 Password Strength', link: '/tools/password-strength' },
          { text: '🔑 Password Generator', link: '/tools/password-generator' },
          { text: '🎯 Decision Wheel', link: '/tools/decision-wheel' },
          { text: '📐 Unit Converter', link: '/tools/unit-converter' },
          { text: '📚 Study Tracker', link: '/tools/study-tracker' },
        ]
      },
      {
        text: '📬 Updates',
        collapsed: true,
        items: [
          { text: '📬 Monthly Updates', link: '/updates' },
          { text: 'Posts', link: '/posts' },
          { text: '📖 Reading Progress', link: '/progress' },
          { text: '📦 Archive', link: '/monthly-archive/' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/vhsHR5Xkx' }
    ],

    search: {
      provider: 'local'
    }
  }
})