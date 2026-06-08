<template>
  <span v-if="difficulty" class="difficulty-badge" :class="'diff-' + difficulty">
    {{ labels[difficulty] || difficulty }}
  </span>
</template>

<script setup>
defineProps({
  difficulty: { type: String, default: '' }
})

const labels = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }
</script>

<style scoped>
.difficulty-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  border: 1px solid;
}

.diff-beginner {
  background: rgba(46, 204, 113, 0.12);
  color: #2ecc71;
  border-color: rgba(46, 204, 113, 0.3);
}

.diff-intermediate {
  background: rgba(243, 156, 18, 0.12);
  color: #f39c12;
  border-color: rgba(243, 156, 18, 0.3);
}

.diff-advanced {
  background: rgba(231, 76, 60, 0.12);
  color: #e74c3c;
  border-color: rgba(231, 76, 60, 0.3);
}
</style>
