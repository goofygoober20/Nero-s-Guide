<template>
  <div class="grid-container">
    <a v-for="item in items" :key="item.title" :href="item.link" class="grid-card">
      <div class="card-icon" v-if="item.icon">{{ item.icon }}</div>
      <h3>{{ item.title }}</h3>
      <p>{{ item.details }}</p>
    </a>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.grid-card {
  display: block;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  transition: all 0.2s ease;
}

.grid-card:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.grid-card h3 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
}

.grid-card p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}
</style>