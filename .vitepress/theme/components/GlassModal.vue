<template>
  <div class="modal-backdrop">
    <div class="modal">
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>

      <div class="actions">
        <button class="btn cancel" @click="$emit('cancel')">{{ cancelText }}</button>
        <button class="btn confirm" @click="$emit('confirm')">{{ confirmText }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  message: String,
  confirmText: String,
  cancelText: String
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  backdrop-filter: blur(20px);
  padding: 1.5rem;
  border-radius: 16px;
  width: 320px;
  text-align: center;
}

.actions {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}

.btn.confirm {
  background: var(--vp-c-brand-1);
  color: white;
}

.btn.cancel {
  background: rgba(255,255,255,0.1);
  border: 1px solid var(--vp-c-divider);
}
</style>
