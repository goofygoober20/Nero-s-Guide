<template>
  <div class="quiz-wrapper glass-panel">
    <h3 class="quiz-title"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c-4.97 0-9-2.24-9-5v-4c0-2.76 4.03-5 9-5s9 2.24 9 5v4c0 2.76-4.03 5-9 5z"/><path d="M12 8V2"/><path d="M8 6c0-2.21 1.79-4 4-4s4 1.79 4 4"/></svg> What Should I Grow?</h3>

    <div class="progress-bar-wrap">
      <div class="progress-bar" :style="{ width: progressPercent + '%' }"></div>
    </div>
    <p class="progress-text">Question {{ currentStep + 1 }} of {{ questions.length }}</p>

    <div v-if="!showResults" class="quiz-step">
      <h4 class="question-text">{{ questions[currentStep].question }}</h4>
      <div class="options-grid">
        <button
          v-for="opt in questions[currentStep].options"
          :key="opt.value"
          class="option-btn"
          :class="{ active: answers[questions[currentStep].key] === opt.value }"
          @click="selectAnswer(questions[currentStep].key, opt.value)"
        >
          <span class="option-emoji">{{ opt.emoji }}</span>
          <span class="option-label">{{ opt.label }}</span>
        </button>
      </div>
      <div class="quiz-nav">
        <button v-if="currentStep > 0" class="nav-btn" @click="currentStep--">Back</button>
        <button
          v-if="currentStep < questions.length - 1"
          class="nav-btn primary"
          :disabled="!answers[questions[currentStep].key]"
          @click="currentStep++"
        >Next</button>
        <button
          v-else
          class="nav-btn primary"
          :disabled="!answers[questions[currentStep].key]"
          @click="showResults = true"
        >See Results</button>
      </div>
    </div>

    <div v-else class="quiz-results">
      <h4 class="results-heading">Your Personalised Plant List</h4>
      <p class="results-sub">Based on your {{ answers.sun }} sun, {{ answers.experience }} experience level, and preference for {{ answers.preference }}.</p>

      <div class="result-cards">
        <div v-for="plant in results" :key="plant.name" class="result-card">
          <span class="plant-emoji">{{ plant.emoji }}</span>
          <div>
            <strong>{{ plant.name }}</strong>
            <p>{{ plant.reason }}</p>
            <span class="plant-tag">{{ plant.type }}</span>
          </div>
        </div>
      </div>

      <button class="nav-btn" @click="reset">Retake Quiz</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentStep = ref(0)
const showResults = ref(false)
const answers = ref({})

const questions = [
  {
    key: 'sun',
    question: 'How much direct sunlight does your garden get?',
    options: [
      { value: 'full', label: 'Full sun (6+ hours)', emoji: '☀️' },
      { value: 'partial', label: 'Partial sun (3–6 hours)', emoji: '⛅' },
      { value: 'shade', label: 'Mostly shade (< 3 hours)', emoji: '🌤️' },
    ]
  },
  {
    key: 'preference',
    question: 'What do you most want to grow?',
    options: [
      { value: 'vegetables', label: 'Vegetables & fruit', emoji: '🥬' },
      { value: 'herbs', label: 'Herbs & spices', emoji: '🌿' },
      { value: 'flowers', label: 'Flowers & ornamentals', emoji: '🌸' },
      { value: 'mix', label: 'A bit of everything', emoji: '🌈' },
    ]
  },
  {
    key: 'experience',
    question: 'How would you describe your gardening experience?',
    options: [
      { value: 'beginner', label: 'Complete beginner', emoji: '🌱' },
      { value: 'some', label: 'Some experience', emoji: '🧑‍🌾' },
      { value: 'experienced', label: 'Experienced gardener', emoji: '🌻' },
    ]
  },
  {
    key: 'space',
    question: 'What space do you have available?',
    options: [
      { value: 'container', label: 'Containers / balcony only', emoji: '🪴' },
      { value: 'small', label: 'Small raised bed', emoji: '📦' },
      { value: 'large', label: 'Large garden bed', emoji: '🏡' },
    ]
  },
]

const progressPercent = computed(() => ((currentStep.value + 1) / questions.length) * 100)

function selectAnswer(key, value) {
  answers.value[key] = value
}

const plantDB = {
  vegetables: {
    full: {
      beginner: [
        { name: 'Courgette', emoji: '🥒', reason: 'Produces heavily with minimal effort. One or two plants feed a household.', type: 'Easy vegetable' },
        { name: 'Green Beans', emoji: '🫘', reason: 'Fast growing, high yield, and they fix nitrogen in the soil.', type: 'Easy vegetable' },
        { name: 'Lettuce', emoji: '🥬', reason: 'Cut-and-come-again varieties give weeks of continuous harvest.', type: 'Easy vegetable' },
        { name: 'Radishes', emoji: '🔴', reason: 'Ready in under 4 weeks. Great for impatient gardeners.', type: 'Easy vegetable' },
        { name: 'Tomatoes', emoji: '🍅', reason: 'The classic garden crop. Cherry varieties are almost impossible to fail.', type: 'Medium vegetable' },
      ],
      some: [
        { name: 'Tomatoes', emoji: '🍅', reason: 'Cherry or bush varieties are reliable. Stake or cage them.', type: 'Medium vegetable' },
        { name: 'Courgette', emoji: '🥒', reason: 'Prolific producer. Give each plant plenty of space.', type: 'Easy vegetable' },
        { name: 'Peppers', emoji: '🫑', reason: 'Need warmth but reward you with continuous harvest.', type: 'Medium vegetable' },
        { name: 'Kale', emoji: '🥬', reason: 'Tolerates heat and cold. Harvest leaves as needed.', type: 'Easy vegetable' },
        { name: 'Beetroot', emoji: '🟣', reason: 'Both the roots and leaves are edible. Hardy and reliable.', type: 'Medium vegetable' },
      ],
      experienced: [
        { name: 'Aubergine', emoji: '🍆', reason: 'Needs long warm season but impressive when done right.', type: 'Advanced vegetable' },
        { name: 'Celery', emoji: '🥬', reason: 'Water-hungry but rewarding. Blanch for milder flavour.', type: 'Advanced vegetable' },
        { name: 'Sweet Potatoes', emoji: '🍠', reason: 'Need heat and space but yields are worth the effort.', type: 'Advanced vegetable' },
        { name: 'Brassicas', emoji: '🥦', reason: 'Cauliflower, broccoli, sprouts, need netting against cabbage white butterflies.', type: 'Medium vegetable' },
        { name: 'Garlic', emoji: '🧄', reason: 'Plant in autumn for summer harvest. Very low maintenance.', type: 'Easy vegetable' },
      ],
    },
    partial: {
      beginner: [
        { name: 'Lettuce', emoji: '🥬', reason: 'Prefers partial shade in summer. Bolts slower out of direct sun.', type: 'Easy vegetable' },
        { name: 'Spinach', emoji: '🥬', reason: 'Thrives in cooler, shadier spots. Harvest leaves young.', type: 'Easy vegetable' },
        { name: 'Radishes', emoji: '🔴', reason: 'Tolerates partial shade. Sow successively every 2 weeks.', type: 'Easy vegetable' },
        { name: 'Spring Onions', emoji: '🧅', reason: 'Compact, fast, and work well in partial shade.', type: 'Easy vegetable' },
        { name: 'Kale', emoji: '🥬', reason: 'Handles shade better than most vegetables. Very hardy.', type: 'Easy vegetable' },
      ],
      some: [
        { name: 'Chard', emoji: '🥬', reason: 'Colourful, productive, and happier without scorching sun.', type: 'Medium vegetable' },
        { name: 'Beetroot', emoji: '🟣', reason: 'Roots develop fine in partial shade. Leaves are edible too.', type: 'Medium vegetable' },
        { name: 'Peas', emoji: '🫛', reason: 'Cool-season crop that appreciates shelter from harsh sun.', type: 'Easy vegetable' },
        { name: 'Runner Beans', emoji: '🫘', reason: 'Tolerate partial shade. Provide a frame or netting.', type: 'Medium vegetable' },
        { name: 'Courgette', emoji: '🥒', reason: 'Can manage with less sun but yields drop. Worth trying.', type: 'Medium vegetable' },
      ],
      experienced: [
        { name: 'Brassicas', emoji: '🥦', reason: 'Net against pests. Handle shade well in sheltered spots.', type: 'Medium vegetable' },
        { name: 'Leeks', emoji: '🧅', reason: 'One of the most shade-tolerant vegetables. Harvest winter to spring.', type: 'Easy vegetable' },
        { name: 'Potatoes', emoji: '🥔', reason: 'First early varieties in grow bags can work in partial shade.', type: 'Medium vegetable' },
        { name: 'Celeriac', emoji: '🥬', reason: 'Slow but reliable. Appreciates cooler conditions.', type: 'Advanced vegetable' },
        { name: 'Garlic', emoji: '🧄', reason: 'Plant in autumn, harvest in summer. Very adaptable.', type: 'Easy vegetable' },
      ],
    },
    shade: {
      beginner: [
        { name: 'Lettuce', emoji: '🥬', reason: 'One of the most shade-tolerant vegetables. Perfect for north-facing spots.', type: 'Easy vegetable' },
        { name: 'Mint', emoji: '🌿', reason: 'Grows almost anywhere. Keep in a pot or it will take over.', type: 'Easy herb' },
        { name: 'Chives', emoji: '🌿', reason: 'Tolerates shade and comes back every year.', type: 'Easy herb' },
        { name: 'Radishes', emoji: '🔴', reason: 'Fast enough to succeed even in poor light.', type: 'Easy vegetable' },
        { name: 'Spring Onions', emoji: '🧅', reason: 'Do not need much sun. Grows in containers too.', type: 'Easy vegetable' },
      ],
      some: [
        { name: 'Spinach', emoji: '🥬', reason: 'Actually prefers shade in summer. Bolts in full sun.', type: 'Easy vegetable' },
        { name: 'Sorrel', emoji: '🌿', reason: 'Leafy herb that thrives in shade. Lemon flavour.', type: 'Medium herb' },
        { name: 'Endive', emoji: '🥬', reason: 'Shade-tolerant salad green. Sow in summer for autumn harvest.', type: 'Medium vegetable' },
        { name: 'Watercress', emoji: '🌿', reason: 'Loves damp shade. Grows well in containers with a saucer of water.', type: 'Medium herb' },
        { name: 'Wild Garlic', emoji: '🌿', reason: 'Native shade-lover. Forage or grow from bulbs.', type: 'Easy herb' },
      ],
      experienced: [
        { name: 'Oca', emoji: '🥔', reason: 'Tuber crop from South America. Grows well in UK shade.', type: 'Advanced vegetable' },
        { name: 'Yacon', emoji: '🍠', reason: 'Sweet root crop that tolerates shade. Unique flavour.', type: 'Advanced vegetable' },
        { name: 'Salsify', emoji: '🥕', reason: 'Root vegetable that handles shade. Tastes like oyster.', type: 'Advanced vegetable' },
        { name: 'Skirret', emoji: '🥬', reason: 'Historical root crop. Shade-tolerant and perennial.', type: 'Advanced vegetable' },
        { name: 'Good King Henry', emoji: '🌿', reason: 'Perennial leafy green. Once established, harvests forever.', type: 'Medium vegetable' },
      ],
    },
  },
  herbs: {
    full: {
      beginner: [
        { name: 'Basil', emoji: '🌿', reason: 'The king of herbs. Needs sun and warmth. Pinch tips for bushier growth.', type: 'Easy herb' },
        { name: 'Chives', emoji: '🌿', reason: 'Cut-and-come-again. Purple flowers are edible. Comes back yearly.', type: 'Easy herb' },
        { name: 'Rosemary', emoji: '🌿', reason: 'Drought tolerant, aromatic, and lives for years in sunny spots.', type: 'Easy herb' },
        { name: 'Thyme', emoji: '🌿', reason: 'Low growing, tough, and perfect for sunny borders or containers.', type: 'Easy herb' },
        { name: 'Parsley', emoji: '🌿', reason: 'Versatile kitchen herb. Grows well in sun with regular watering.', type: 'Easy herb' },
      ],
      some: [
        { name: 'Lavender', emoji: '💜', reason: 'Needs sun and well-drained soil. Incredibly fragrant.', type: 'Medium herb' },
        { name: 'Sage', emoji: '🌿', reason: 'Hardy perennial. Dry it for winter use.', type: 'Easy herb' },
        { name: 'Oregano', emoji: '🌿', reason: 'Spreads readily. Best in a container to keep in check.', type: 'Easy herb' },
        { name: 'Lemon Balm', emoji: '🌿', reason: 'Useful herb but invasive. Plant in a pot sunk into the ground.', type: 'Easy herb' },
        { name: 'Dill', emoji: '🌿', reason: 'Attracts beneficial insects. Self-seeds freely.', type: 'Medium herb' },
      ],
      experienced: [
        { name: 'Tarragon', emoji: '🌿', reason: 'French tarragon needs propagation from cuttings. Subtle anise flavour.', type: 'Medium herb' },
        { name: 'Lovage', emoji: '🌿', reason: 'Tall, celery-like herb. Perennial and needs space.', type: 'Medium herb' },
        { name: 'Shiso', emoji: '🌿', reason: 'Japanese herb. Needs warmth and sun. Stunning in salads.', type: 'Advanced herb' },
        { name: 'Lemon Verbena', emoji: '🌿', reason: 'Intensely lemony. Needs pot protection in cold climates.', type: 'Advanced herb' },
        { name: 'Fennel', emoji: '🌿', reason: 'Bronze fennel makes a dramatic statement. Self-seeds.', type: 'Medium herb' },
      ],
    },
    partial: {
      beginner: [
        { name: 'Mint', emoji: '🌿', reason: 'Grows almost anywhere. Always use a container.', type: 'Easy herb' },
        { name: 'Parsley', emoji: '🌿', reason: 'Prefers partial shade in hot climates. Very forgiving.', type: 'Easy herb' },
        { name: 'Chives', emoji: '🌿', reason: 'Adaptable. Does well in sun or partial shade.', type: 'Easy herb' },
        { name: 'Cilantro', emoji: '🌿', reason: 'Bolts slower in partial shade. Succession sow.', type: 'Easy herb' },
        { name: 'Sweet Cicely', emoji: '🌿', reason: 'Shade-loving herb with anise flavour. Hardy perennial.', type: 'Easy herb' },
      ],
      some: [
        { name: 'Sorrel', emoji: '🌿', reason: 'Lemon-flavoured leaf. Prefers cooler, shadier spots.', type: 'Medium herb' },
        { name: 'Chervil', emoji: '🌿', reason: 'Delicate French herb. Loves shade. Self-seeds.', type: 'Easy herb' },
        { name: 'Borage', emoji: '🌿', reason: 'Blue flowers attract pollinators. Tolerates shade.', type: 'Easy herb' },
        { name: 'Angelica', emoji: '🌿', reason: 'Shade-loving architectural herb. Seeds and stems are edible.', type: 'Medium herb' },
        { name: 'Vietnamese Coriander', emoji: '🌿', reason: 'Thrives in shade. Essential for Asian cooking.', type: 'Medium herb' },
      ],
      experienced: [
        { name: 'Wasabi', emoji: '🌿', reason: 'Genuinely needs shade. Grows near streams in Japan.', type: 'Advanced herb' },
        { name: 'Wild Garlic', emoji: '🌿', reason: 'Shade specialist. Forage from woodlands in spring.', type: 'Easy herb' },
        { name: 'Mitsuba', emoji: '🌿', reason: 'Japanese parsley. Shade-loving and delicate.', type: 'Advanced herb' },
        { name: 'Ramps', emoji: '🌿', reason: 'Wild leek from North American forests. True shade crop.', type: 'Advanced herb' },
        { name: 'Sweet Woodruff', emoji: '🌿', reason: 'Ground cover herb for deep shade. Used in German drinks.', type: 'Medium herb' },
      ],
    },
    shade: {
      beginner: [
        { name: 'Mint', emoji: '🌿', reason: 'Nearly indestructible. Grows in shade, sun, and everywhere between.', type: 'Easy herb' },
        { name: 'Chives', emoji: '🌿', reason: 'Very adaptable. Will flower less in shade but still grows.', type: 'Easy herb' },
        { name: 'Parsley', emoji: '🌿', reason: 'Tolerates deep shade. Keep watered.', type: 'Easy herb' },
        { name: 'Sweet Cicely', emoji: '🌿', reason: 'Native shade herb. White flowers and anise flavour.', type: 'Easy herb' },
        { name: 'Wild Garlic', emoji: '🌿', reason: 'Born for shade. Plant bulbs in autumn under trees.', type: 'Easy herb' },
      ],
      some: [
        { name: 'Sorrel', emoji: '🌿', reason: 'Acidic, lemony leaves. Thrives in shade.', type: 'Medium herb' },
        { name: 'Chervil', emoji: '🌿', reason: 'French fine herb. Prefers cool shade.', type: 'Easy herb' },
        { name: 'Lemon Balm', emoji: '🌿', reason: 'Grows vigorously in shade. Keep contained.', type: 'Easy herb' },
        { name: 'Wood Avens', emoji: '🌿', reason: 'Native shade herb. Roots smell of cloves.', type: 'Medium herb' },
        { name: 'Herb Robert', emoji: '🌿', reason: 'Tiny red-flowered geranium. Grows in cracks and shade.', type: 'Easy herb' },
      ],
      experienced: [
        { name: 'Wasabi', emoji: '🌿', reason: 'The ultimate shade herb. Needs constant moisture and cool temps.', type: 'Advanced herb' },
        { name: 'Ramps', emoji: '🌿', reason: 'Wild ramps need 2+ years to establish in deep shade.', type: 'Advanced herb' },
        { name: 'Babington Leek', emoji: '🌿', reason: 'Wild perennial leek from shady hedgerows.', type: 'Medium herb' },
        { name: 'Opposite-leaved Saltwort', emoji: '🌿', reason: 'Coastal shade plant. Salty leaves.', type: 'Advanced herb' },
        { name: 'Sweet Woodruff', emoji: '🌿', reason: 'Carpet-forming shade herb. Used in May wine.', type: 'Medium herb' },
      ],
    },
  },
  flowers: {
    full: {
      beginner: [
        { name: 'Sunflowers', emoji: '🌻', reason: 'Iconic, fast, and children love them. Direct sow in spring.', type: 'Easy flower' },
        { name: 'Marigolds', emoji: '🌼', reason: 'Deters pests from vegetables. Blooms all summer.', type: 'Easy flower' },
        { name: 'Nasturtiums', emoji: '🧡', reason: 'Edible flowers and leaves. Trap crop for aphids.', type: 'Easy flower' },
        { name: 'Zinnias', emoji: '💐', reason: 'Vibrant colours, cut-and-come-again. Loved by pollinators.', type: 'Easy flower' },
        { name: 'Sweet Peas', emoji: '🌸', reason: 'Fragrant, climbing, and brilliant for cutting.', type: 'Easy flower' },
      ],
      some: [
        { name: 'Echinacea', emoji: '💜', reason: 'Perennial that returns bigger each year. Medicinal too.', type: 'Medium flower' },
        { name: 'Dahlias', emoji: '🌺', reason: 'Show-stopping blooms. Lift tubers in winter in cold areas.', type: 'Medium flower' },
        { name: 'Lavender', emoji: '💜', reason: 'Fragrant, pollinator-friendly, and drought tolerant.', type: 'Medium flower' },
        { name: 'Rudbeckia', emoji: '🌻', reason: 'Gold star-shaped flowers. Perennial and tough.', type: 'Easy flower' },
        { name: 'Cosmos', emoji: '🌸', reason: 'Airy, cottage-garden feel. Self-seeds freely.', type: 'Easy flower' },
      ],
      experienced: [
        { name: 'Delphiniums', emoji: '💙', reason: 'Tall spires of blue. Need staking and slug protection.', type: 'Advanced flower' },
        { name: 'Peonies', emoji: '🌸', reason: 'Decades-long investment. Stunning but slow to establish.', type: 'Advanced flower' },
        { name: 'Sweet William', emoji: '💗', reason: 'Cottage garden staple. Biennial, plan two years ahead.', type: 'Medium flower' },
        { name: 'Hollyhocks', emoji: '🌸', reason: 'Tall, romantic, self-seeding. Classic cottage garden.', type: 'Medium flower' },
        { name: 'Roses', emoji: '🌹', reason: 'The queen of flowers. Needs pruning knowledge and care.', type: 'Advanced flower' },
      ],
    },
    partial: {
      beginner: [
        { name: 'Foxgloves', emoji: '🔔', reason: 'Native shade-lover. Biennial but self-seeds freely.', type: 'Easy flower' },
        { name: 'Impatiens', emoji: '🌸', reason: 'One of the best shade annuals. Blooms non-stop.', type: 'Easy flower' },
        { name: 'Begonias', emoji: '🌺', reason: 'Shade champions with stunning foliage and flowers.', type: 'Easy flower' },
        { name: 'Bleeding Heart', emoji: '💗', reason: 'Arching pink hearts in spring. Classic shade perennial.', type: 'Easy flower' },
        { name: 'Asters', emoji: '💜', reason: 'Late summer colour in shadier spots. Pollinator magnet.', type: 'Easy flower' },
      ],
      some: [
        { name: 'Hostas', emoji: '🌿', reason: 'Foliage stars for shade. Slug-prone but worth it.', type: 'Easy flower' },
        { name: 'Astilbe', emoji: '🌸', reason: 'Feathery plumes in shade. Needs moisture.', type: 'Medium flower' },
        { name: 'Japanese Anemone', emoji: '🌸', reason: 'Late summer beauty. Spreads to form colonies.', type: 'Medium flower' },
        { name: 'Hellebores', emoji: '❄️', reason: 'Winter-flowering. One of the first signs of life.', type: 'Medium flower' },
        { name: 'Tiarella', emoji: '🌸', reason: 'Foam flower. Shade ground cover with starry blooms.', type: 'Medium flower' },
      ],
      experienced: [
        { name: 'Cyclamen', emoji: '🌸', reason: 'Delicate autumn and winter blooms. Needs patience.', type: 'Advanced flower' },
        { name: 'Rodgersia', emoji: '🌸', reason: 'Bold foliage, dramatic plumes. Needs moisture and shade.', type: 'Medium flower' },
        { name: 'Erythronium', emoji: '🌸', reason: 'Dog tooth violet. Delicate spring bulbs for woodland.', type: 'Advanced flower' },
        { name: 'Bluebells', emoji: '💙', reason: 'Native carpet of blue. Plant green bulbs in autumn.', type: 'Medium flower' },
        { name: 'Snowdrops', emoji: '🤍', reason: 'Plant "in the green" in spring. Naturalises beautifully.', type: 'Easy flower' },
      ],
    },
    shade: {
      beginner: [
        { name: 'Impatiens', emoji: '🌸', reason: 'The go-to shade annual. Constant blooms.', type: 'Easy flower' },
        { name: 'Begonias', emoji: '🌺', reason: 'Thrives in deep shade. Both flowers and foliage.', type: 'Easy flower' },
        { name: 'Foxgloves', emoji: '🔔', reason: 'Native woodland flower. Biennial and self-seeding.', type: 'Easy flower' },
        { name: 'Bleeding Heart', emoji: '💗', reason: 'Arching pink hearts. Dormant in summer, returns in spring.', type: 'Easy flower' },
        { name: 'Snowdrops', emoji: '🤍', reason: 'First flowers of the year. Thrive in shady woodland.', type: 'Easy flower' },
      ],
      some: [
        { name: 'Hellebores', emoji: '❄️', reason: 'Winter flowers for the darkest months. Evergreen foliage.', type: 'Medium flower' },
        { name: 'Hostas', emoji: '🌿', reason: 'Foliage comes in endless varieties. Slug protection needed.', type: 'Easy flower' },
        { name: 'Japanese Anemone', emoji: '🌸', reason: 'Autumn colour in shady spots. Spreads freely.', type: 'Medium flower' },
        { name: 'Solomon Seal', emoji: '🌿', reason: 'Graceful arching stems. Native woodland plant.', type: 'Medium flower' },
        { name: 'Lungwort', emoji: '🌸', reason: 'Spotted foliage and early spring flowers. Very tough.', type: 'Easy flower' },
      ],
      experienced: [
        { name: 'Trillium', emoji: '🌸', reason: 'Three-petalled woodland treasure. Slow but spectacular.', type: 'Advanced flower' },
        { name: 'Epimedium', emoji: '🌸', reason: 'Barrenwort. Delicate flowers, excellent ground cover.', type: 'Medium flower' },
        { name: 'Arum italicum', emoji: '🌿', reason: 'Striking veined leaves and orange berries. Shade specialist.', type: 'Medium flower' },
        { name: 'Cyclamen hederifolium', emoji: '🌸', reason: 'Autumn-flowering cyclamen. Naturalises in dry shade.', type: 'Medium flower' },
        { name: 'Voodoo Lily', emoji: '💜', reason: 'Dramatic shade plant. Stunning but pungent flowers.', type: 'Advanced flower' },
      ],
    },
  },
  mix: {
    full: {
      beginner: [
        { name: 'Courgette', emoji: '🥒', reason: 'Easy vegetable that produces relentlessly.', type: 'Easy vegetable' },
        { name: 'Basil', emoji: '🌿', reason: 'Essential herb. Grows alongside tomatoes perfectly.', type: 'Easy herb' },
        { name: 'Sunflowers', emoji: '🌻', reason: 'Fast, fun, and attracts pollinators to the whole garden.', type: 'Easy flower' },
        { name: 'Lettuce', emoji: '🥬', reason: 'Cut-and-come-again. Harvest in weeks.', type: 'Easy vegetable' },
        { name: 'Nasturtiums', emoji: '🧡', reason: 'Edible flowers, trap crop, and pest deterrent all in one.', type: 'Easy flower' },
      ],
      some: [
        { name: 'Tomatoes', emoji: '🍅', reason: 'The gateway crop. Cherry varieties are foolproof.', type: 'Medium vegetable' },
        { name: 'Rosemary', emoji: '🌿', reason: 'Permanent herb. Drought tolerant and aromatic.', type: 'Easy herb' },
        { name: 'Echinacea', emoji: '💜', reason: 'Medicinal perennial flower. Returns yearly.', type: 'Medium flower' },
        { name: 'Kale', emoji: '🥬', reason: 'Hardy, nutritious, and handles all seasons.', type: 'Easy vegetable' },
        { name: 'Thyme', emoji: '🌿', reason: 'Tough ground-cover herb. Aromatic and useful.', type: 'Easy herb' },
      ],
      experienced: [
        { name: 'Garlic', emoji: '🧄', reason: 'Plant autumn, harvest summer. Minimal effort, maximum reward.', type: 'Easy vegetable' },
        { name: 'Lavender', emoji: '💜', reason: 'Fragrant hedge or border. Needs good drainage.', type: 'Medium flower' },
        { name: 'Dahlias', emoji: '🌺', reason: 'Summer spectacle. Lift and store tubers for next year.', type: 'Medium flower' },
        { name: 'Sage', emoji: '🌿', reason: 'Perennial herb. Purple varieties are stunning.', type: 'Easy herb' },
        { name: 'Sweet Potatoes', emoji: '🍠', reason: 'Tropical vines with edible tubers. Need long warm season.', type: 'Advanced vegetable' },
      ],
    },
    partial: {
      beginner: [
        { name: 'Lettuce', emoji: '🥬', reason: 'Prefers cooler spots. Shade slows bolting.', type: 'Easy vegetable' },
        { name: 'Mint', emoji: '🌿', reason: 'Grows anywhere. Keep in a pot.', type: 'Easy herb' },
        { name: 'Foxgloves', emoji: '🔔', reason: 'Native shade flower. Biennial and self-seeding.', type: 'Easy flower' },
        { name: 'Radishes', emoji: '🔴', reason: 'Ready in 4 weeks. Great confidence booster.', type: 'Easy vegetable' },
        { name: 'Chives', emoji: '🌿', reason: 'Edible flowers, useful herb, comes back every year.', type: 'Easy herb' },
      ],
      some: [
        { name: 'Spinach', emoji: '🥬', reason: 'Bolts slower in shade. Harvest leaves young.', type: 'Easy vegetable' },
        { name: 'Sorrel', emoji: '🌿', reason: 'Lemon-flavoured leaves for shade gardens.', type: 'Medium herb' },
        { name: 'Astilbe', emoji: '🌸', reason: 'Feathery plumes that love moisture and shade.', type: 'Medium flower' },
        { name: 'Peas', emoji: '🫛', reason: 'Cool-season crop. Appreciates shelter from harsh sun.', type: 'Easy vegetable' },
        { name: 'Hellebores', emoji: '❄️', reason: 'Winter-flowering shade plants. Evergreen.', type: 'Medium flower' },
      ],
      experienced: [
        { name: 'Brassicas', emoji: '🥦', reason: 'Net against pests. Handle shade well in sheltered spots.', type: 'Medium vegetable' },
        { name: 'Wasabi', emoji: '🌿', reason: 'The ultimate shade herb. Difficult but rewarding.', type: 'Advanced herb' },
        { name: 'Trillium', emoji: '🌸', reason: 'Woodland treasure. Needs patience and right conditions.', type: 'Advanced flower' },
        { name: 'Leeks', emoji: '🧅', reason: 'Harvest winter to spring. Shade-tolerant.', type: 'Easy vegetable' },
        { name: 'Epimedium', emoji: '🌸', reason: 'Barrenwort. Delicate flowers for dry shade.', type: 'Medium flower' },
      ],
    },
    shade: {
      beginner: [
        { name: 'Mint', emoji: '🌿', reason: 'Grows in almost complete shade. Always contain it.', type: 'Easy herb' },
        { name: 'Lettuce', emoji: '🥬', reason: 'One of the few vegetables that truly thrives in shade.', type: 'Easy vegetable' },
        { name: 'Impatiens', emoji: '🌸', reason: 'Shade annual that blooms non-stop.', type: 'Easy flower' },
        { name: 'Wild Garlic', emoji: '🌿', reason: 'Born for shade. Plant bulbs under trees.', type: 'Easy herb' },
        { name: 'Snowdrops', emoji: '🤍', reason: 'First flowers of the year in shady woodland.', type: 'Easy flower' },
      ],
      some: [
        { name: 'Sorrel', emoji: '🌿', reason: 'Acidic leaves. Loves cool shade.', type: 'Medium herb' },
        { name: 'Hostas', emoji: '🌿', reason: 'Foliage shade champions. Many varieties available.', type: 'Easy flower' },
        { name: 'Chervil', emoji: '🌿', reason: 'French herb. Prefers cool shade.', type: 'Easy herb' },
        { name: 'Hellebores', emoji: '❄️', reason: 'Winter flowers for the darkest months.', type: 'Medium flower' },
        { name: 'Watercress', emoji: '🌿', reason: 'Grows in damp shade. Great in salads.', type: 'Medium herb' },
      ],
      experienced: [
        { name: 'Wasabi', emoji: '🌿', reason: 'Needs constant moisture and deep shade. Challenge accepted.', type: 'Advanced herb' },
        { name: 'Cyclamen', emoji: '🌸', reason: 'Delicate woodland flowers. Autumn and winter blooming.', type: 'Advanced flower' },
        { name: 'Solomon Seal', emoji: '🌿', reason: 'Graceful native woodland plant. Elegant arching stems.', type: 'Medium flower' },
        { name: 'Ramps', emoji: '🌿', reason: 'Wild leeks from North American forests. 2+ year commitment.', type: 'Advanced herb' },
        { name: 'Bluebells', emoji: '💙', reason: 'Native carpet of blue. Plant green bulbs in spring.', type: 'Medium flower' },
      ],
    },
  },
}

const results = computed(() => {
  const sun = answers.value.sun || 'full'
  const experience = answers.value.experience || 'beginner'
  const preference = answers.value.preference || 'vegetables'
  const db = plantDB[preference]?.[sun]?.[experience]
  return db || plantDB.vegetables.full.beginner
})

function reset() {
  currentStep.value = 0
  showResults.value = false
  answers.value = {}
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

.quiz-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.progress-bar-wrap {
  height: 4px;
  background: var(--vp-c-divider);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 100%;
  background: var(--vp-c-brand-1);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  margin-bottom: 1.2rem;
}

.question-text {
  font-size: 1.05rem;
  margin-bottom: 1rem;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.option-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--vp-c-text-1);
}

.option-btn:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.option-btn.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  box-shadow: 0 0 0 2px var(--vp-c-brand-1);
}

.option-emoji {
  font-size: 1.6rem;
}

.option-label {
  font-size: 0.82rem;
  text-align: center;
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

.nav-btn.primary:hover {
  opacity: 0.9;
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.results-heading {
  font-size: 1.15rem;
  margin-bottom: 0.4rem;
}

.results-sub {
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  margin-bottom: 1.2rem;
}

.result-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.2rem;
}

.result-card {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.plant-emoji {
  font-size: 1.8rem;
  flex-shrink: 0;
}

.result-card strong {
  display: block;
  margin-bottom: 0.2rem;
}

.result-card p {
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
  margin: 0 0 0.4rem;
}

.plant-tag {
  display: inline-block;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}
</style>
