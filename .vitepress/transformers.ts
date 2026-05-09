import type { Plugin } from 'vitepress'

export function transformsPlugin(): Plugin {
  return {
    name: 'custom:transform-content',
    enforce: 'pre',
    transform(code, id) {
      if (
        id.endsWith('.md') &&
        !id.includes('index.md') &&
        !id.includes('posts') &&
        !id.includes('other')
      ) {
        return transformLinks(transformContent(code))
      }
    }
  }
}

function transformContent(text: string): string {
  return text
    // Replace note/warning/tip patterns
    .replace(/^\*\*Note\*\* - (.+)$/gm, ':::tip\n$1\n:::')
    .replace(/^\* \*\*Note\*\* - (.+)$/gm, ':::tip\n$1\n:::')
    .replace(/^Note - (.+)$/gm, ':::tip\n$1\n:::')
    .replace(/^\*\*Warning\*\* - (.+)$/gm, ':::warning\n$1\n:::')
    .replace(/^\* \*\*Warning\*\* - (.+)$/gm, ':::warning\n$1\n:::')
    // Replace bullet points
    .replace(/^\*\s([^*])/gm, '- $1')
    // Replace emojis with vitepress equivalents
    .replace(/⭐/g, ':star:')
    .replace(/🌐/g, ':globe-with-meridians:')
}

function transformLinks(text: string): string {
  return text
    // Social/code links → icons
    .replace(
      /\[Discord\]\(([^\)]*?)\)/gm,
      '<a target="_blank" href="$1" title="Discord">💬</a>'
    )
    .replace(
      /\[GitHub\]\(([^\)]*?)\)/gm,
      '<a target="_blank" href="$1" title="GitHub">🐙</a>'
    )
    .replace(
      /\[GitLab\]\(([^\)]*?)\)/gm,
      '<a target="_blank" href="$1" title="GitLab">🦊</a>'
    )
    .replace(
      /\[Telegram\]\(([^\)]*?)\)/gm,
      '<a target="_blank" href="$1" title="Telegram">✈️</a>'
    )
    .replace(
      /\[Subreddit\]\(([^\)]*?)\)/gm,
      '<a target="_blank" href="$1" title="Reddit">🤖</a>'
    )
    .replace(
      /\[X\]\(([^\)]*?)\)/gm,
      '<a target="_blank" href="$1" title="X">🐦</a>'
    )
    .replace(
      /\[Source Code\]\(([^\)]*?)\)/gm,
      '<a target="_blank" href="$1" title="Source Code">💻</a>'
    )
    .replace(
      /\[\.onion\]\(([^\)]*?)\)/gm,
      '<a target="_blank" href="$1" title=".onion">🧅</a>'
    )
}