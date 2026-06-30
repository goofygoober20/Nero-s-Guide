<template>
  <div class="glass-panel">
    <h3 class="section-title"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c-4.97 0-9-2.24-9-5v-4c0-2.76 4.03-5 9-5s9 2.24 9 5v4c0 2.76-4.03 5-9 5z"/><path d="M12 8V2"/></svg> What Soil Do I Have?</h3>
    <p class="section-sub">Answer a few quick questions to identify your soil type and get tailored advice.</p>

    <div v-if="!showResult" class="quiz-step">
      <h4 class="question-text">{{ questions[q].question }}</h4>
      <div class="options-list">
        <button
          v-for="(opt, i) in questions[q].options"
          :key="i"
          class="option-btn"
          :class="{ active: answers[q] === i }"
          @click="answers[q] = i"
        >
          <span class="option-label">{{ opt.label }}</span>
          <span class="option-desc">{{ opt.desc }}</span>
        </button>
      </div>
      <div class="quiz-nav">
        <button v-if="q > 0" class="nav-btn" @click="q--">Back</button>
        <button
          class="nav-btn primary"
          :disabled="answers[q] === null"
          @click="q < questions.length - 1 ? q++ : (showResult = true)"
        >{{ q < questions.length - 1 ? 'Next' : 'See Result' }}</button>
      </div>
    </div>

    <div v-else class="result-panel">
      <div class="result-type" :class="resultType.id">
        <span class="type-emoji">{{ resultType.emoji }}</span>
        <strong>{{ resultType.name }}</strong>
      </div>
      <p class="result-desc">{{ resultType.description }}</p>

      <div class="result-section">
        <h4>Improve it</h4>
        <ul><li v-for="(tip, i) in resultType.tips" :key="i">{{ tip }}</li></ul>
      </div>

      <div class="result-section">
        <h4>Best crops</h4>
        <div class="crop-tags">
          <span v-for="(crop, i) in resultType.crops" :key="i" class="crop-tag">{{ crop }}</span>
        </div>
      </div>

      <div class="quiz-nav">
        <button class="nav-btn" @click="reset">Retake</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const q = ref(0)
const showResult = ref(false)
const answers = ref([null, null, null, null])

const questions = [
  {
    question: 'When you grab a handful of damp soil and squeeze, what happens?',
    options: [
      { label: 'Falls apart immediately', desc: 'Feels gritty, won\'t hold shape' },
      { label: 'Holds a solid ball', desc: 'Feels sticky and dense' },
      { label: 'Holds shape but crumbles when poked', desc: 'Feels soft and springy' },
    ]
  },
  {
    question: 'How does the soil feel between your fingers?',
    options: [
      { label: 'Gritty and coarse', desc: 'You can feel individual grains' },
      { label: 'Smooth and slippery', desc: 'Almost like wet clay or modelling putty' },
      { label: 'Soft and crumbly', desc: 'Neither gritty nor sticky' },
    ]
  },
  {
    question: 'How quickly does water drain after rain or watering?',
    options: [
      { label: 'Very fast (puddles disappear in minutes)', desc: 'Water seems to vanish instantly' },
      { label: 'Very slow (puddles sit for hours)', desc: 'Water pools on the surface' },
      { label: 'Moderate (drains within an hour or so)', desc: 'Neither instant nor persistent' },
    ]
  },
  {
    question: 'What does the soil look like when dry?',
    options: [
      { label: 'Loose and sandy', desc: 'Falls apart, may blow away' },
      { label: 'Hard and cracked', desc: 'Forms a hard crust with visible cracks' },
      { label: 'Dark and crumbly', desc: 'Loose crumbs, easy to dig' },
    ]
  },
]

const soilTypes = [
  {
    id: 'sandy', emoji: '🏖️', name: 'Sandy Soil',
    description: 'Sandy soil is light, warm, and drains very quickly. It is easy to work but struggles to hold water and nutrients. You will need to water more frequently and add organic matter regularly.',
    tips: [
      'Add compost every season to improve water retention',
      'Mulch heavily to reduce evaporation',
      'Use organic fertiliser more often, nutrients wash out quickly',
      'Plant drought-tolerant herbs like rosemary, thyme, and lavender',
      'Water little and often rather than deep and infrequent',
    ],
    crops: ['Carrots', 'Radishes', 'Lettuce', 'Strawberries', 'Rosemary', 'Thyme', 'Potatoes', 'Sweet Potatoes'],
  },
  {
    id: 'clay', emoji: '🧱', name: 'Clay Soil',
    description: 'Clay soil holds plenty of water and nutrients but compacts easily and drains poorly. It is cold in spring and bakes hard in summer. Improving it takes patience but the payoff is enormous.',
    tips: [
      'Add coarse grit and organic matter to improve drainage',
      'Never work clay soil when it is waterlogged, it will compact further',
      'Mulch to prevent surface crusting in summer',
      'Add gypsum to help break up heavy clay structure',
      'Plant in raised beds if ground-level drainage is poor',
    ],
    crops: ['Runner Beans', 'Kale', 'Broccoli', 'Roses', ' asters', 'Apple Trees', 'Plums', 'Broad Beans'],
  },
  {
    id: 'loam', emoji: '🌱', name: 'Loamy Soil',
    description: 'Loam is the ideal garden soil (a balanced mix of sand, silt, and clay). It holds moisture while draining well, and it is rich in nutrients. Most gardens benefit from annual compost additions to maintain loam quality.',
    tips: [
      'Maintain with annual compost top-dressing',
      'Rotate crops to prevent nutrient depletion',
      'Add mulch in summer to retain moisture and suppress weeds',
      'Avoid over-tilling to preserve soil structure and worm tunnels',
      'Test pH every couple of years; most vegetables prefer 6.0–7.0',
    ],
    crops: ['Tomatoes', 'Courgette', 'Peppers', 'Beans', 'Lettuce', 'Herbs', 'Dahlias', 'Almost All Vegtables'],
  },
]

const resultType = computed(() => {
  const [a0, a1, a2, a3] = answers.value
  let sandyScore = 0
  let clayScore = 0
  let loamScore = 0

  const matrix = [
    [0, 1, 2], // Q0
    [0, 1, 2], // Q1
    [0, 1, 2], // Q2
    [0, 1, 2], // Q3
  ]

  answers.value.forEach((a, qi) => {
    if (a === 0) sandyScore++
    else if (a === 1) clayScore++
    else loamScore++
  })

  if (sandyScore >= 3) return soilTypes[0]
  if (clayScore >= 3) return soilTypes[1]
  return soilTypes[2]
})

function reset() {
  q.value = 0
  showResult.value = false
  answers.value = [null, null, null, null]
}
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

.question-text {
  font-size: 1.05rem;
  margin-bottom: 1rem;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
}

.option-btn {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.8rem 1rem;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--vp-c-text-1);
}

.option-btn:hover {
  border-color: var(--vp-c-brand-1);
}

.option-btn.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  box-shadow: 0 0 0 2px var(--vp-c-brand-1);
}

.option-label {
  font-weight: 600;
  font-size: 0.9rem;
}

.option-desc {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.quiz-nav {
  display: flex;
  gap: 0.75rem;
}

.nav-btn {
  padding: 0.6rem 1.4rem;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: var(--vp-c-bg-elv);
  border-color: var(--vp-c-brand-1);
}

.nav-btn.primary {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.result-panel {
  text-align: center;
}

.result-type {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 1.2rem;
  border-radius: 14px;
  margin-bottom: 1rem;
}

.result-type.sandy {
  background: linear-gradient(135deg, rgba(241,196,15,0.15), rgba(230,126,34,0.15));
  border: 1px solid rgba(241,196,15,0.3);
}

.result-type.clay {
  background: linear-gradient(135deg, rgba(183,110,50,0.15), rgba(160,82,45,0.15));
  border: 1px solid rgba(183,110,50,0.3);
}

.result-type.loam {
  background: linear-gradient(135deg, rgba(113,173,112,0.15), rgba(85,114,64,0.15));
  border: 1px solid rgba(113,173,112,0.3);
}

.type-emoji {
  font-size: 2.5rem;
}

.result-type strong {
  font-size: 1.1rem;
}

.result-desc {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-bottom: 1.2rem;
  line-height: 1.6;
}

.result-section {
  text-align: left;
  margin-bottom: 1rem;
}

.result-section h4 {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.result-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.result-section li {
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  padding: 0.3rem 0;
  padding-left: 1rem;
  position: relative;
}

.result-section li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--vp-c-brand-1);
  font-weight: 700;
}

.crop-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.crop-tag {
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 8px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 0.78rem;
  font-weight: 500;
}
</style>
