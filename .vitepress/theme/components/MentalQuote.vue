<template>
  <p class="mental-quote">{{ quote }}</p>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const quotes = [
  '“You are not your feelings. You are the one who notices them.” — Dr. Julie Smith',
  '“Feelings are visitors — let them come and go.” — Dr. Julie Smith',
  '“Action comes before motivation, not after.” — Dr. Julie Smith',
  '“The way we talk to ourselves shapes our reality.” — Dr. Julie Smith',
  '“You don\'t have to wait to feel confident to do hard things. Courage comes first.” — Dr. Julie Smith',
]

const quote = ref('')

onMounted(() => {
  quote.value = quotes[Math.floor(Math.random() * quotes.length)]
})
</script>

<style scoped>
.mental-quote {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  font-style: italic;
  max-width: 480px;
  margin: 1.5rem auto 0;
  line-height: 1.5;
}
</style>
