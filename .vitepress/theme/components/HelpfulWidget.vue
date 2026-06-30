<template>
  <div v-if="!voted" class="helpful-widget">
    <span class="helpful-label">Was this guide helpful?</span>
    <div class="helpful-actions">
      <button class="helpful-btn" @click="vote('up')" :aria-label="`Yes, this guide was helpful`">
        👍
      </button>
      <button class="helpful-btn" @click="vote('down')" :aria-label="`No, this guide was not helpful`">
        👎
      </button>
    </div>
  </div>
  <div v-else class="helpful-thanks">
    Thanks for the feedback!
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()
const voted = ref(false)

async function vote(type) {
  voted.value = true
  try {
    const pagePath = page.value?.relativePath || window.location.pathname
    await fetch('https://discord.com/api/webhooks/1518952135784534016/dp2fx5ACizkm-tT_lW6PDiNVl-yq5PS89H6yz-83Pca8CYPFLoC_bod9Xq09wlR-9Mwf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: type === 'up'
          ? `👍 **Helpful** — ${pagePath}`
          : `👎 **Not Helpful** — ${pagePath}`
      })
    })
  } catch {}
}
</script>

<style scoped>
.helpful-widget {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  margin-top: 2rem;
}

.helpful-label {
  font-size: 0.88rem;
  color: var(--vp-c-text-2);
}

.helpful-actions {
  display: flex;
  gap: 0.4rem;
}

.helpful-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.helpful-btn:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  transform: scale(1.1);
}

.helpful-thanks {
  padding: 1rem 1.25rem;
  border-radius: 12px;
  background: var(--vp-c-brand-soft);
  border: 1px solid var(--vp-c-divider);
  margin-top: 2rem;
  font-size: 0.88rem;
  color: var(--vp-c-brand-1);
  font-weight: 500;
}
</style>
