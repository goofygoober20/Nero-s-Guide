<template>
  <div class="search-shell">
    <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      placeholder="Search settings..."
    >
  </div>
</template>

<script setup>
defineProps({
  modelValue: String
})
</script>

<style scoped>
.search-shell {
  margin-bottom: 1.5rem;
}

input {
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(12px);
  color: var(--vp-c-text-1);
}
</style>
