<template>
  <button class="copy-discord-btn" @click="copy" :title="copied ? 'Copied!' : 'Click to copy'">
    {{ copied ? 'Copied!' + ' ✓' : username }}
  </button>
</template>

<script setup>
import { ref } from 'vue'

const username = 'danxyz7'
const copied = ref(false)

function copy() {
  navigator.clipboard.writeText(username)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>

<style scoped>
.copy-discord-btn {
  background: none;
  border: none;
  color: var(--vp-c-brand-1);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: opacity 0.2s;
}

.copy-discord-btn:hover {
  opacity: 0.75;
}
</style>
