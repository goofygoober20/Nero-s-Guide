import { createContentLoader } from 'vitepress'

interface Post {
  title: string
  url: string
  date: string
}

export default createContentLoader('posts/*.md', {
  transform(raw): Record<string, Post[]> {
    const posts = raw
      .map(({ url, frontmatter }) => ({
        title: frontmatter.title,
        url,
        date: frontmatter.date
      }))
      .filter((post) => post.date)
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))

    const grouped: Record<string, Post[]> = {}
    for (const post of posts) {
      const year = new Date(post.date).getFullYear().toString()
      if (!grouped[year]) grouped[year] = []
      grouped[year].push(post)
    }

    return grouped
  }
})

export declare const data: Record<string, { title: string; url: string; date: string }[]>