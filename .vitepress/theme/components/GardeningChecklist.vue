<template>
  <div class="glass-panel">
    <h3 class="section-title"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> {{ currentSeason }} Garden Checklist</h3>
    <p class="section-sub">{{ completedCount }} / {{ currentTasks.length }} tasks completed</p>

    <div class="task-list">
      <label
        v-for="task in currentTasks"
        :key="task.id"
        class="task-item"
        :class="{ done: checked[task.id] }"
      >
        <input type="checkbox" v-model="checked[task.id]" @change="save" />
        <span class="checkmark"></span>
        <span class="task-text">{{ task.text }}</span>
      </label>
    </div>

    <div class="season-nav">
      <button
        v-for="s in seasons"
        :key="s"
        class="season-btn"
        :class="{ active: activeSeason === s }"
        @click="activeSeason = s"
      >{{ seasonEmoji[s] }} {{ s }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const STORAGE_KEY = 'gardening-checklist'
const seasonEmoji = { Spring: '🌱', Summer: '☀️', Autumn: '🍂', Winter: '❄️' }
const seasons = ['Spring', 'Summer', 'Autumn', 'Winter']

function getCurrentSeason() {
  const month = new Date().getMonth()
  if (month >= 2 && month <= 4) return 'Spring'
  if (month >= 5 && month <= 7) return 'Summer'
  if (month >= 8 && month <= 10) return 'Autumn'
  return 'Winter'
}

const taskDB = {
  Spring: [
    { id: 's1', text: 'Prepare beds, dig in compost and remove weeds' },
    { id: 's2', text: 'Start seeds indoors (tomatoes, peppers, aubergines) 6–8 weeks before last frost' },
    { id: 's3', text: 'Direct sow hardy crops (lettuce, radishes, spinach, peas)' },
    { id: 's4', text: 'Harden off transplants, outdoor exposure for increasing periods' },
    { id: 's5', text: 'Check and repair raised beds, supports, and netting' },
    { id: 's6', text: 'Apply fresh mulch after soil warms up' },
    { id: 's7', text: 'Service lawnmower and clean tools' },
    { id: 's8', text: 'Test soil pH if not done recently' },
  ],
  Summer: [
    { id: 'u1', text: 'Water deeply 2–3 times per week (check finger test)' },
    { id: 'u2', text: 'Harvest regularly, pick courgettes small, beans when tender' },
    { id: 'u3', text: 'Feed container plants and heavy feeders with liquid fertiliser' },
    { id: 'u4', text: 'Top up mulch to retain moisture' },
    { id: 'u5', text: 'Stake tall plants (tomatoes, dahlias, delphiniums)' },
    { id: 'u6', text: 'Deadhead flowers to encourage more blooms' },
    { id: 'u7', text: 'Watch for pests, check undersides of leaves' },
    { id: 'u8', text: 'Succession sow salad leaves every 2 weeks' },
  ],
  Autumn: [
    { id: 'a1', text: 'Clear spent vegetable plants, compost healthy material' },
    { id: 'a2', text: 'Plant garlic cloves and spring-flowering bulbs' },
    { id: 'a3', text: 'Collect fallen leaves for leaf mould' },
    { id: 'a4', text: 'Spread compost over empty beds and let worms work it in' },
    { id: 'a5', text: 'Lift and store dahlia tubers and tender perennials' },
    { id: 'a6', text: 'Sow green manure on empty beds to prevent nutrient leaching' },
    { id: 'a7', text: 'Clean and oil garden tools before winter' },
    { id: 'a8', text: 'Service garden compost bin, empty and restart' },
  ],
  Winter: [
    { id: 'w1', text: 'Plan next year\'s garden layout and crop rotation' },
    { id: 'w2', text: 'Order seeds from catalogues' },
    { id: 'w3', text: 'Maintain and sharpen tools' },
    { id: 'w4', text: 'Build or repair raised beds, cold frames, and structures' },
    { id: 'w5', text: 'Prune dormant trees and fruit bushes' },
    { id: 'w6', text: 'Check stored bulbs and tubers for rot' },
    { id: 'w7', text: 'Avoid walking on wet or frozen beds' },
    { id: 'w8', text: 'Browse seed catalogues and plan crop rotation on paper' },
  ],
}

const activeSeason = ref(getCurrentSeason())
const checked = ref({})

const currentTasks = computed(() => taskDB[activeSeason.value] || [])
const completedCount = computed(() => currentTasks.value.filter(t => checked.value[t.id]).length)

function load() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) checked.value = JSON.parse(saved)
  } catch {}
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(checked.value))
}

onMounted(load)
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
  margin-bottom: 1.2rem;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.2rem;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 0.8rem;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  cursor: pointer;
  transition: all 0.2s ease;
}

.task-item:hover {
  border-color: var(--vp-c-brand-1);
}

.task-item.done {
  opacity: 0.5;
}

.task-item.done .task-text {
  text-decoration: line-through;
}

.task-item input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--vp-c-divider);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.task-item.done .checkmark {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.task-item.done .checkmark::after {
  content: '✓';
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
}

.task-text {
  font-size: 0.85rem;
  flex: 1;
}

.season-nav {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.season-btn {
  padding: 0.5rem 1rem;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.season-btn:hover {
  border-color: var(--vp-c-brand-1);
}

.season-btn.active {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
}
</style>
