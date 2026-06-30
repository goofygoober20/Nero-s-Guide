import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

function rssFeedPlugin() {
  return {
    name: 'rss-feed',
    closeBundle() {
      const postsPath = path.resolve(process.cwd(), '_data', 'approved-posts.json')
      if (!fs.existsSync(postsPath)) return

      let posts
      try {
        posts = JSON.parse(fs.readFileSync(postsPath, 'utf-8'))
      } catch {
        return
      }
      
    const SITE_URL = 'https://ner0.netlify.app'

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
      fs.copyFileSync(postsPath, path.join(outDir, 'approved-posts.json'))
      console.log('✅ RSS feed generated at feed.xml')
    }
  }
}

function sitemapPlugin() {
  const SITE_URL = 'https://ner0.netlify.app'

  function walk(dir: string): string[] {
    if (!fs.existsSync(dir)) return []
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const fullPath = path.join(dir, entry.name)
      const relPath = path.relative(process.cwd(), fullPath)
      if (entry.isDirectory()) {
        if (
          entry.name === 'node_modules' ||
          entry.name === '.vitepress' ||
          entry.name === 'archived' ||
          entry.name.startsWith('_') ||
          entry.name.startsWith('.') ||
          entry.name.startsWith('@')
        ) return []
        return walk(fullPath)
      }
      if (!entry.isFile() || !entry.name.endsWith('.md')) return []
      if (relPath.startsWith('archived/')) return []
      return [relPath]
    })
  }

  function routeFromFile(file: string) {
    const withoutExt = file.replace(/\.md$/, '')
    if (withoutExt === 'index') return '/'
    if (withoutExt.endsWith('/index')) return `/${withoutExt.replace(/\/index$/, '')}/`
    return `/${withoutExt}`
  }

  return {
    name: 'sitemap',
    closeBundle() {
      const urls = walk(process.cwd())
        .map(routeFromFile)
        .sort()
        .map((route) => `  <url><loc>${SITE_URL}${route}</loc></url>`)
        .join('\n')

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
      const outDir = path.resolve(process.cwd(), '.vitepress', 'dist')
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap)
      console.log('✅ Sitemap generated at sitemap.xml')
    }
  }
}

export default defineConfig({
  srcExclude: ['archived/**/*.md'],
  title: "Nero's Index",

  lastUpdated: true,
  editLink: {
    pattern: 'https://github.com/goofygaober/my-docs/edit/main/:path'
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700;14..32,800;14..32,900&display=swap', rel: 'stylesheet' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: "Nero's Index Updates", href: '/feed.xml' }],
    ['meta', { property: 'og:title', content: "Nero's Index" }],
    ['meta', { property: 'og:description', content: 'Curated collection of free guides and resources.' }],
    ['meta', { property: 'og:image', content: '/og-image.png' }],
    ['meta', { property: 'og:url', content: 'https://ner0.netlify.app' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['script', { type: 'speculationrules' }, JSON.stringify({
      prerender: [{
        source: 'document',
        where: { href_matches: '/*' },
        eagerness: 'moderate'
      }]
    })],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],

  vite: {
    plugins: [rssFeedPlugin(), sitemapPlugin()],
  },

  themeConfig: {
    logo: '/logo.png',

    outline: [2, 3],

    nav: [
      { text: '🏠  Home', link: '/' },
      { text: '📰  Posts', link: '/posts' },
    ],

    sidebar: [
      {
        text: 'Personal Guides',
        items: [
          { text: '🔐 Password Guide', link: '/passwords' },
          { text: '🧅 Dark Web Guide', link: '/darkweb' },
          { text: '🛡️ Online Privacy', link: '/privacy' },
          { text: '💪 Fitness Guide', link: '/fitness' },
          { text: '🍳 Cooking Guide', link: '/cooking' },
          {
            text: '😴 Sleeping Guide',
            collapsed: true,
            items: [
              { text: 'Sleeping Guide', link: '/sleeping/' },
              { text: 'All-Nighter Guide', link: '/all-nighter' },
              { text: 'Shift Schedule', link: '/sleeping/shift-schedule' },
              { text: 'Sleep Quiz', link: '/sleeping/quiz' },
            ]
          },
          { text: '💰 Personal Finance', link: '/finance' },
          { text: '📋 Productivity Guide', link: '/productivity' },
          { text: '🌱 Minimalism Guide', link: '/minimalism' },
          { text: '📝 Writing & Note-Taking', link: '/writing-and-note-taking' },
          { text: '♟️ Chess Guide', link: '/chess' },
          { text: '🐧 Linux for Beginners', link: '/linux' },
          { text: '🎮 Gaming Guide', link: '/gaming' },
          { text: '🌻 Gardening Guide', link: '/gardening' },
          { text: '🔓 Unenrollment', link: '/unenrollment' },
          { text: '🎨 Drawing Guide', link: '/drawing' },
          {
            text: '🛍️ Shopping Guide',
            collapsed: true,
            items: [
              { text: 'Shopping Guide', link: '/shopping' },
              { text: 'Shopping Resources', link: '/shopping-resources' },
            ]
          },
        ]
      },
      {
        text: 'Tools',
        items: [
          { text: '🧰 All Tools', link: '/tools/' },
          { text: '📈 Investment Calculator', link: '/tools/investment-calculator' },
          { text: '📊 BMI Calculator', link: '/tools/bmi-calculator' },
          { text: '📚 GPA Calculator', link: '/tools/gpa-calculator' },
          { text: '🔐 Password Strength', link: '/tools/password-strength' },
          { text: '🔑 Password Generator', link: '/tools/password-generator' },
          { text: '⏱️ Pomodoro Timer', link: 'https://pomorollo.vercel.app' },
          { text: '⏳ Countdown Timer', link: '/tools/countdown-timer' },
          { text: '🫁 Box Breathing', link: '/tools/box-breathing' },
          { text: '📚 Study Tracker', link: '/tools/study-tracker' },
          { text: '🎯 Decision Wheel', link: '/tools/decision-wheel' },
          { text: '📐 Unit Converter', link: '/tools/unit-converter' },
          { text: '💵 Bill Split', link: '/tools/bill-split' },
          { text: '🪙 Coin Flip & Dice', link: '/tools/coin-flip' },
          { text: '⌨️ Typing Speed', link: 'https://monkeytype.com' },
        ]
      },
      {
        text: '📬 Updates',
        collapsed: true,
        items: [
          { text: '📬 Monthly Updates', link: '/updates' },
          { text: 'Posts', link: '/posts' },
          { text: '📦 Archive', link: '/monthly-archive/' },
        ]
      }
    ],

    socialLinks: [],

    search: {
      provider: 'local'
    }
  }
})