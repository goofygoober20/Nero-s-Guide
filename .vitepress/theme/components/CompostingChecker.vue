<template>
  <div class="glass-panel">
    <h3 class="section-title"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Can I Compost This?</h3>
    <p class="section-sub">Type a common kitchen or garden item to check if it belongs in your compost pile.</p>

    <div class="search-wrap">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      <input
        v-model="query"
        type="text"
        placeholder="e.g. banana peel, egg shells, coffee grounds..."
        class="search-input"
        @input="search"
      />
    </div>

    <div v-if="query.length >= 2 && filteredResults.length === 0" class="no-result">
      <p>No matches found. Try a different search term.</p>
    </div>

    <div v-if="filteredResults.length > 0" class="results-list">
      <div
        v-for="item in filteredResults"
        :key="item.name"
        class="result-row"
      >
        <span class="item-emoji">{{ item.emoji }}</span>
        <div class="item-info">
          <strong>{{ item.name }}</strong>
          <span class="item-tag" :class="item.category">{{ item.category }}</span>
          <p v-if="item.note" class="item-note">{{ item.note }}</p>
        </div>
      </div>
    </div>

    <div class="category-summary">
      <div class="cat-card green">
        <strong>Greens (Nitrogen)</strong>
        <ul>
          <li v-for="item in greens.slice(0, showAll ? greens.length : 5)" :key="item.name">{{ item.emoji }} {{ item.name }}</li>
        </ul>
        <button v-if="!showAll" class="more-btn" @click="showAll = true">Show all</button>
      </div>
      <div class="cat-card brown">
        <strong>Browns (Carbon)</strong>
        <ul>
          <li v-for="item in browns.slice(0, showAllBrowns ? browns.length : 5)" :key="item.name">{{ item.emoji }} {{ item.name }}</li>
        </ul>
        <button v-if="!showAllBrowns" class="more-btn" @click="showAllBrowns = true">Show all</button>
      </div>
      <div class="cat-card red">
        <strong>Do Not Compost</strong>
        <ul>
          <li v-for="item in dontCompost.slice(0, showAllRed ? dontCompost.length : 5)" :key="item.name">{{ item.emoji }} {{ item.name }}</li>
        </ul>
        <button v-if="!showAllRed" class="more-btn" @click="showAllRed = true">Show all</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const query = ref('')
const showAll = ref(false)
const showAllBrowns = ref(false)
const showAllRed = ref(false)

const greens = [
  { name: 'Banana peels', emoji: '🍌', category: 'green', note: 'Chop smaller to speed decomposition' },
  { name: 'Apple cores', emoji: '🍎', category: 'green', note: '' },
  { name: 'Coffee grounds', emoji: '☕', category: 'green', note: 'Include the filter paper too' },
  { name: 'Tea bags', emoji: '🫖', category: 'green', note: 'Remove staple first. Some bags contain plastic, so check' },
  { name: 'Vegetable scraps', emoji: '🥕', category: 'green', note: 'Peels, cores, trimmings, all green material' },
  { name: 'Egg shells', emoji: '🥚', category: 'green', note: 'Crush them first for faster breakdown' },
  { name: 'Fresh grass clippings', emoji: '🌿', category: 'green', note: 'Mix with browns to avoid slimy pile' },
  { name: 'Plant trimmings', emoji: '✂️', category: 'green', note: 'Only healthy plants, remove diseased material' },
  { name: 'Flower heads', emoji: '🌸', category: 'green', note: 'Spent blooms and deadheaded flowers' },
  { name: 'Weeds (without seeds)', emoji: '🌾', category: 'green', note: 'Only before they set seed' },
  { name: 'Fruit rinds', emoji: '🍊', category: 'green', note: 'Citrus peel is fine in small amounts' },
  { name: 'Old bread', emoji: '🍞', category: 'green', note: 'Break into small pieces to avoid clumping' },
  { name: 'Herb stems', emoji: '🌿', category: 'green', note: 'Basil, parsley, coriander trimmings' },
  { name: 'Pumpkin scraps', emoji: '🎃', category: 'green', note: 'Great in autumn after Halloween' },
]

const browns = [
  { name: 'Cardboard', emoji: '📦', category: 'brown', note: 'Remove tape and staples. Tear into small pieces' },
  { name: 'Newspaper', emoji: '📰', category: 'brown', note: 'Shred or tear for faster breakdown' },
  { name: 'Dry leaves', emoji: '🍂', category: 'brown', note: 'Shred first for quicker decomposition' },
  { name: 'Straw', emoji: '🌾', category: 'brown', note: 'Excellent carbon source, layer with greens' },
  { name: 'Wood chips', emoji: '🪵', category: 'brown', note: 'Small chips break down faster' },
  { name: 'Paper bags', emoji: '🛍️', category: 'brown', note: 'Torn into strips work best' },
  { name: 'Twigs and branches', emoji: '🌳', category: 'brown', note: 'Chop small, ideal for the base layer' },
  { name: 'Sawdust', emoji: '🪚', category: 'brown', note: 'Only from untreated wood. Mix well with greens' },
  { name: 'Dryer lint', emoji: '🧶', category: 'brown', note: 'Natural fibres only (cotton, wool)' },
  { name: 'Paper towels', emoji: '🧻', category: 'brown', note: 'Only if not greasy or soiled with chemicals' },
  { name: 'Pine needles', emoji: '🌲', category: 'brown', note: 'Acidic, good in small amounts' },
  { name: 'Nut shells', emoji: '🥜', category: 'brown', note: 'Walnut shells take longer than others' },
  { name: 'Coffee filters', emoji: '🟤', category: 'brown', note: 'The brown ring around the filter is carbon' },
  { name: 'Toilet roll tubes', emoji: '🧻', category: 'brown', note: 'Tear into pieces' },
]

const dontCompost = [
  { name: 'Meat', emoji: '🥩', category: 'red', note: 'Attracts rats and creates anaerobic conditions' },
  { name: 'Fish', emoji: '🐟', category: 'red', note: 'Smells attract pests. Bury directly if you must' },
  { name: 'Dairy', emoji: '🧀', category: 'red', note: 'Cheese, milk, yoghurt, all attract rodents' },
  { name: 'Cooked food', emoji: '🍳', category: 'red', note: 'Oils and seasonings cause problems' },
  { name: 'Diseased plants', emoji: '🦠', category: 'red', note: 'Pathogens survive composting. Bin or burn instead' },
  { name: 'Pet waste', emoji: '🐕', category: 'red', note: 'Dog and cat faeces contain harmful pathogens' },
  { name: 'Treated wood', emoji: '🪵', category: 'red', note: 'Chemicals leach into compost and soil' },
  { name: 'Plastic bags', emoji: '🛍️', category: 'red', note: 'Even "biodegradable" bags need industrial composting' },
  { name: 'Glossy paper', emoji: '📖', category: 'red', note: 'Coatings contain chemicals not suitable for compost' },
  { name: 'Rice', emoji: '🍚', category: 'red', note: 'Raw rice can attract rodents. Small amounts of cooked rice are risky' },
  { name: 'Onion skins', emoji: '🧅', category: 'red', note: 'Large amounts can inhibit plant growth' },
]

const allItems = [...greens, ...browns, ...dontCompost]

const filteredResults = computed(() => {
  if (query.value.length < 2) return []
  const term = query.value.toLowerCase()
  return allItems.filter(item =>
    item.name.toLowerCase().includes(term) ||
    item.note.toLowerCase().includes(term)
  )
})
</script>

<style scoped>
.glass-panel {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.15);
  backdrop-filter: blur(22px) saturate(140%);
  border-radius: 20px;
  padding: 1.6rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
  margin: 1.5rem 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
}

.section-sub {
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
  margin-bottom: 1rem;
}

.search-wrap {
  position: relative;
  margin-bottom: 1rem;
}

.search-icon {
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--vp-c-text-3);
}

.search-input {
  width: 100%;
  padding: 0.7rem 0.8rem 0.7rem 2.4rem;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: var(--vp-c-brand-1);
}

.no-result {
  text-align: center;
  padding: 1rem;
  color: var(--vp-c-text-3);
  font-size: 0.85rem;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.result-row {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.item-emoji {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.item-info strong {
  font-size: 0.9rem;
}

.item-tag {
  display: inline-block;
  width: fit-content;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  font-weight: 600;
}

.item-tag.green {
  background: rgba(113,173,112,0.2);
  color: #5a9e59;
}

.item-tag.brown {
  background: rgba(180,140,80,0.2);
  color: #b48c50;
}

.item-tag.red {
  background: rgba(231,76,60,0.2);
  color: #e74c3c;
}

.item-note {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  margin: 0.15rem 0 0;
}

.category-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.cat-card {
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.cat-card strong {
  display: block;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}

.cat-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cat-card li {
  font-size: 0.78rem;
  padding: 0.2rem 0;
  color: var(--vp-c-text-2);
}

.cat-card.green {
  border-left: 3px solid #71AD70;
}

.cat-card.brown {
  border-left: 3px solid #b48c50;
}

.cat-card.red {
  border-left: 3px solid #e74c3c;
}

.more-btn {
  margin-top: 0.5rem;
  background: none;
  border: none;
  color: var(--vp-c-brand-1);
  font-size: 0.75rem;
  cursor: pointer;
  font-weight: 600;
}

.more-btn:hover {
  text-decoration: underline;
}
</style>
