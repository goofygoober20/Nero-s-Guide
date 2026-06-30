<template>
  <button
    class="switch"
    role="switch"
    :aria-checked="modelValue"
    :aria-label="label"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <span class="slider"></span>
  </button>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  label: {
    type: String,
    default: 'Toggle setting'
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.switch {
  position: relative;
  width: 46px;
  height: 24px;
  display: inline-block;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 24px;
}

.switch:focus-visible .slider {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.slider {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.2);
  border-radius: 24px;
  transition: 0.25s ease;
}

.slider::before {
  content: "";
  position: absolute;
  width: 20px;
  height: 20px;
  left: 2px;
  top: 2px;
  background: white;
  border-radius: 50%;
  transition: 0.25s ease;
}

[aria-checked="true"] .slider {
  background: var(--vp-c-brand-1);
}

[aria-checked="true"] .slider::before {
  transform: translateX(22px);
}
</style>
