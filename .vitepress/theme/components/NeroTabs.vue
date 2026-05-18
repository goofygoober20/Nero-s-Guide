<template>
  <div class="tabs-shell">
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab', { active: modelValue === tab.id }]"
        @click="$emit('update:modelValue', tab.id)"
      >
        <i :class="`lucide-${tab.icon}`"></i>
        {{ tab.label }}
      </button>
      <div class="underline" :style="underlineStyle"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  tabs: Array,
  modelValue: String
})

const underlineStyle = computed(() => {
  const index = props.tabs.findIndex(t => t.id === props.modelValue)
  return {
    transform: `translateX(${index * 100}%)`
  }
})
</script>

<style scoped>
.tabs-shell {
  margin-bottom: 1.5rem;
}

.tabs {
  display: flex;
  position: relative;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  backdrop-filter: blur(18px);
  border-radius: 14px;
  padding: 0.4rem;
}

.tab {
  flex: 1;
  padding: 0.6rem 1rem;
  border: none;
  background: transparent;
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-weight: 500;
  display: flex;
  gap: 0.4rem;
  justify-content: center;
  align-items: center;
  transition: 0.2s ease;
}

.tab.active {
  color: var(--vp-c-brand-1);
}

.underline {
  position: absolute;
  bottom: 4px;
  left: 0;
  width: calc(100% / var(--tab-count, 4));
  height: 3px;
  background: var(--vp-c-brand-1);
  border-radius: 3px;
  transition: 0.25s ease;
}
</style>
