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
      
    const SITE_URL = 'https://cameronguide.netlify.app/'

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
    <title>Nero's Guide - Updates</title>
    <link>${SITE_URL}/posts</link>
    <description>Latest updates and changelog for Nero's Guide</description>
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
  title: "Nero's Guide",

  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: "Nero's Guide Updates", href: '/feed.xml' }],
  ],

  vite: {
    plugins: [rssFeedPlugin()],
  },

  themeConfig: {
    logo: '/logo.png',

    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        text: 'Personal Guides',
        items: [
          { text: '😴 Sleeping Guide', link: '/sleeping' },
          { text: '🌙 All-Nighter Guide', link: '/all-nighter' },
          { text: '🔐 Password Guide', link: '/passwords' },
          { text: '💪 Fitness Guide', link: '/fitness' },
          { text: '🍳 Cooking Guide', link: '/cooking' },
          { text: '🧠 Mental Health Guide', link: '/mental-health' },
          { text: '🎨 Drawing Guide', link: '/drawing' },
          { text: '🛍️ Shopping Guide', link: '/shopping' },
          { text: '🧅 Dark Web Guide', link: '/darkweb' },
          { text: '♟️ Chess Guide', link: '/chess' },
          { text: '🎵 Music Streaming Guide', link: '/music' },
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
        text: 'Other',
        collapsed: true,
        items: [
          { text: 'Posts', link: '/posts' },
          { text: '📖 Reading Progress', link: '/progress' },
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