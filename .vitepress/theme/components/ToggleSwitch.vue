<template>
  <label class="switch">
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)">
    <span class="slider"></span>
  </label>
</template>

<script setup>
defineProps({
  modelValue: Boolean
})
</script>

<style scoped>
.switch {
  position: relative;
  width: 46px;
  height: 24px;
  display: inline-block;
}

.switch input {
  display: none;
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

input:checked + .slider {
  background: var(--vp-c-brand-1);
}

input:checked + .slider::before {
  transform: translateX(22px);
}
</style>
