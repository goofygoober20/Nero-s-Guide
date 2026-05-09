<!-- eslint-disable vue/require-v-for-key -->
<script setup lang="ts">
import { data as posts } from './posts.data'

const formatDate = (raw: string): string => {
  const date = new Date(raw)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <div>
    <section>
      <h1>Posts</h1>
      <p>Monthly updates, announcements, and more.</p>
    </section>
    <template v-for="year in Object.keys(posts).reverse()" :key="year">
      <h2>{{ year }}</h2>
      <ul>
        <li v-for="post of posts[year]" :key="post.url">
          <article>
            <a :href="post.url">{{ post.title }}</a>
            -
            <time :datetime="post.date">{{ formatDate(post.date) }}</time>
          </article>
        </li>
      </ul>
    </template>
  </div>
</template>