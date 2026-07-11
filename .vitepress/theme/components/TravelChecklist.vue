<template>
  <div class="travel-checklist">
    <div class="checklist-header">
      <h2><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14l5-5"/><circle cx="9" cy="18" r="2"/><circle cx="20" cy="5" r="2"/></svg> Travel Planning Checklist</h2>
      <p class="checklist-subtitle">Plan trips stress-free. Covers everything from booking to packing to home prep. Progress saves automatically.</p>
      
      <div class="trip-config">
        <div class="config-row">
          <label>Destination: <input type="text" v-model="trip.destination" placeholder="Tokyo, Japan" class="config-input" /></label>
          <label>Dates: <input type="date" v-model="trip.startDate" class="config-input" /> to <input type="date" v-model="trip.endDate" class="config-input" /></label>
        </div>
        <div class="config-row">
          <label>Trip Type: 
            <select v-model="trip.type" class="config-input">
              <option value="leisure">🏖️ Leisure/Vacation</option>
              <option value="business">💼 Business</option>
              <option value="adventure">🏔️ Adventure/Backpacking</option>
              <option value="family">👨‍👩‍👧‍👦 Family</option>
              <option value="digital_nomad">💻 Digital Nomad</option>
            </select>
          </label>
          <label>Duration: {{ tripDuration }} days</label>
        </div>
      </div>

      <div class="progress-summary">
        <div class="progress-bar-container">
          <div class="progress-bar-fill" :style="{ width: overallPercent + '%' }"></div>
        </div>
        <span class="progress-text">{{ completedCount }} / {{ totalItems }} tasks ({{ overallPercent }}%)</span>
      </div>
    </div>

    <div class="phase-tabs">
      <button 
        v-for="phase in phases" 
        :key="phase.id" 
        class="tab-btn" 
        :class="{ active: activePhase === phase.id }"
        @click="activePhase = phase.id"
      >
        <span class="tab-icon">{{ phase.icon }}</span>
        <span class="tab-label">{{ phase.name }}</span>
        <span class="tab-count">{{ getPhaseProgress(phase.id).done }} / {{ getPhaseProgress(phase.id).total }}</span>
      </button>
    </div>

    <div class="phase-content">
      <div v-for="task in getPhaseTasks(activePhase)" :key="task.id" class="checklist-item" :class="{ 'priority-high': task.priority === 'high', 'priority-medium': task.priority === 'medium', 'priority-low': task.priority === 'low', 'completed': checked[task.id], 'optional': task.optional }">
        <div class="item-main">
          <label class="checkbox-wrapper">
            <input 
              type="checkbox" 
              v-model="checked[task.id]" 
              @change="saveState"
              class="checkbox-input"
            />
            <span class="checkbox-custom"></span>
          </label>
          <div class="item-info">
            <div class="item-header">
              <span class="item-name">{{ task.name }}</span>
              <span class="priority-badge" :class="task.priority">{{ task.priority }}</span>
              <span v-if="task.optional" class="optional-badge">Optional</span>
              <span v-if="task.timing" class="timing-badge">{{ task.timing }}</span>
            </div>
            <p v-if="task.description" class="item-desc">{{ task.description }}</p>
            <div v-if="task.subtasks && task.subtasks.length" class="subtasks">
              <label v-for="sub in task.subtasks" :key="sub" class="subtask-item">
                <input type="checkbox" v-model="subtaskState[task.id][sub]" @change="saveSubtask(task.id)" />
                <span>{{ sub }}</span>
              </label>
            </div>
          </div>
        </div>
        
        <div class="item-actions" v-if="checked[task.id]">
          <button class="notes-btn" @click="showNotes(task.id)" title="Add notes">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Notes Modal -->
    <div v-if="editingNotesId" class="notes-modal-overlay" @click.self="closeNotes">
      <div class="notes-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ getTask(editingNotesId).name }} — Notes</h3>
          <button class="close-btn" @click="closeNotes">×</button>
        </div>
        <textarea 
          v-model="taskNotes[editingNotesId]" 
          placeholder="Confirmation numbers, addresses, contact info, reminders..."
          class="notes-textarea"
        ></textarea>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeNotes">Done</button>
        </div>
      </div>
    </div>

    <!-- Packing List Quick View -->
    <div class="packing-summary" v-if="activePhase === 'packing'">
      <h3>📦 Packing Categories</h3>
      <div class="packing-categories">
        <div v-for="cat in packingCategories" :key="cat.name" class="packing-category">
          <h4>{{ cat.icon }} {{ cat.name }} ({{ getCategoryPacked(cat.name) }} / {{ cat.items.length }})</h4>
          <div class="packing-items">
            <label v-for="item in cat.items" :key="item" class="packing-item">
              <input type="checkbox" v-model="packingState[cat.name][item]" @change="savePacking" />
              <span>{{ item }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Export Section -->
    <div class="export-section">
      <h3>📤 Export & Share</h3>
      <div class="export-buttons">
        <button @click="exportFullPlan" class="export-btn">📄 Full Trip Plan (TXT)</button>
        <button @click="exportPackingList" class="export-btn secondary">🎒 Packing List Only</button>
        <button @click="exportPreDeparture" class="export-btn secondary">🏠 Pre-Departure Checklist</button>
        <button @click="copyTripSummary" class="export-btn secondary">📋 Copy Summary</button>
        <button @click="generateShareLink" class="export-btn secondary">🔗 Generate Share Link</button>
      </div>
    </div>

    <div class="disclaimer">
      <small>✈️ Tip: Book refundable when plans aren't firm. Screenshot all confirmations. Share itinerary with a trusted contact. Progress saves via localStorage.</small>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const STORAGE_KEY = 'travel-checklist-v2'

// ============================================
// PHASES & TASKS
// ============================================

const phases = [
  { id: 'planning', name: 'Planning', icon: '🗓️' },
  { id: 'booking', name: 'Booking', icon: '✈️' },
  { id: 'documents', name: 'Documents', icon: '📄' },
  { id: 'health', name: 'Health & Safety', icon: '🏥' },
  { id: 'money', name: 'Money & Tech', icon: '💳' },
  { id: 'home', name: 'Home Prep', icon: '🏠' },
  { id: 'packing', name: 'Packing', icon: '🎒' },
  { id: 'day_of', name: 'Day Of', icon: '☀️' }
]

const allTasks = [
  // PLANNING
  { id: 'p1', phase: 'planning', name: 'Research destination', priority: 'high', timing: '8-12 weeks out', description: 'Weather, visa requirements, local customs, best neighborhoods, transport options, scams to avoid', subtasks: ['Check visa requirements', 'Research neighborhoods to stay', 'Find must-see vs skip', 'Check travel advisories'] },
  { id: 'p2', phase: 'planning', name: 'Set budget', priority: 'high', timing: '8-12 weeks out', description: 'Flights, accommodation, food, activities, transport, insurance, emergency buffer (20%)', subtasks: ['Flight budget', 'Accommodation budget', 'Daily expenses', 'Emergency fund'] },
  { id: 'p3', phase: 'planning', name: 'Request time off', priority: 'high', timing: '8-12 weeks out', description: 'Submit PTO, confirm approval, set out-of-office delegates', subtasks: ['Submit PTO request', 'Get written approval', 'Brief team/delegates'] },
  { id: 'p4', phase: 'planning', name: 'Create rough itinerary', priority: 'medium', timing: '6-8 weeks out', description: 'Day-by-day skeleton: arrival, main activities, buffer days, departure. Leave room for spontaneity.', subtasks: ['Map must-dos per day', 'Identify backup plans', 'Note opening hours/reservations needed'] },
  { id: 'p5', phase: 'planning', name: 'Check passport expiry', priority: 'high', timing: 'Immediately', description: 'Must be valid 6+ months beyond return date for many countries. Renew now if close.', subtasks: ['Check expiry date', 'Renew if < 1 year left', 'Verify blank pages'] },
  
  // BOOKING
  { id: 'b1', phase: 'booking', name: 'Book flights', priority: 'high', timing: '6-8 weeks (domestic: 3-4)', description: 'Use flexible dates, nearby airports. Consider travel insurance for expensive trips.', subtasks: ['Compare Skyscanner/Google Flights', 'Check baggage fees', 'Book refundable if unsure', 'Save confirmation screenshots'] },
  { id: 'b2', phase: 'booking', name: 'Book accommodation', priority: 'high', timing: '4-8 weeks out', description: 'Read recent reviews (last 3 months). Check cancellation policy. Book free cancellation when possible.', subtasks: ['Filter by location/safety', 'Read recent negative reviews', 'Verify check-in process', 'Save address in local language'] },
  { id: 'b3', phase: 'booking', name: 'Book major activities/tours', priority: 'medium', timing: '4-6 weeks out', description: 'Popular tours sell out. Book skip-the-line tickets for major attractions.', subtasks: ['Museum timed entries', 'Popular day tours', 'Restaurant reservations', 'Show/event tickets'] },
  { id: 'b4', phase: 'booking', name: 'Arrange airport transport', priority: 'medium', timing: '1-2 weeks out', description: 'Airport → hotel and return. Research: train, bus, rideshare, shuttle. Have backup plan.', subtasks: ['Research options', 'Book if needed', 'Save offline maps'] },
  { id: 'b5', phase: 'booking', name: 'Rental car / rail passes', priority: 'medium', timing: '4-6 weeks out', description: 'Book early for best rates. Check: insurance coverage, IDP needed, toll systems, parking.', subtasks: ['Compare rental companies', 'Check credit card coverage', 'Get IDP if required', 'Book rail pass'] },
  
  // DOCUMENTS
  { id: 'd1', phase: 'documents', name: 'Digital document backup', priority: 'high', timing: '1 week out', description: 'Scan/save to phone + cloud + email to self: passport, visas, insurance, reservations, prescriptions, IDs', subtasks: ['Passport photo page', 'Visas/entry permits', 'Travel insurance policy', 'All confirmations', 'Prescriptions', 'Vaccination records'] },
  { id: 'd2', phase: 'documents', name: 'Physical copies', priority: 'medium', timing: '1 week out', description: 'Print: passport copy, insurance card, emergency contacts, accommodation address in local language', subtasks: ['2 passport copies', 'Insurance card', 'Emergency contacts', 'Hotel address (local script)'] },
  { id: 'd3', phase: 'documents', name: 'Share itinerary', priority: 'high', timing: '1 week out', description: 'Share with trusted contact: flight details, accommodation, daily plans, emergency contacts', subtasks: ['Send to emergency contact', 'Share location (Find My/Google)', 'Set check-in schedule'] },
  { id: 'd4', phase: 'documents', name: 'Visa / entry requirements', priority: 'high', timing: 'ASAP', description: 'E-visas, ETIAS, tourist cards, vaccination proof, onward ticket proof, sufficient funds proof', subtasks: ['Apply for e-visa', 'Print confirmations', 'Check photo requirements', 'Verify processing time'] },
  
  // HEALTH & SAFETY
  { id: 'h1', phase: 'health', name: 'Travel insurance', priority: 'high', timing: 'Book with flights', description: 'Medical evacuation, trip cancellation, baggage, COVID. Read exclusions. Credit card insurance often insufficient.', subtasks: ['Compare Squaremouth/InsureMyTrip', 'Verify medical evac coverage', 'Check adventure sports coverage', 'Save policy number + claims line'] },
  { id: 'h2', phase: 'health', name: 'Vaccinations & meds', priority: 'high', timing: '6-8 weeks out', description: 'Check CDC/WHO for destination. Routine boosters + destination-specific. Malaria prophylaxis if needed.', subtasks: ['Check CDC destination page', 'Schedule travel clinic', 'Get prescriptions filled', 'Carry in original bottles'] },
  { id: 'h3', phase: 'health', name: 'Prescription prep', priority: 'high', timing: '2 weeks out', description: 'Bring extra (1.5x trip length), original bottles, doctor letter for controlled substances, generic names', subtasks: ['Count pills needed', 'Request early refill', 'Get doctor letter', 'Split between bags'] },
  { id: 'h4', phase: 'health', name: 'First aid kit', priority: 'medium', timing: '1 week out', description: 'Pain reliever, antihistamine, loperamide, band-aids, blister pads, electrolyte packets, hand sanitizer', subtasks: ['Pain/fever meds', 'Anti-diarrheal', 'Antihistamine', 'Band-aids/blister care', 'Electrolytes', 'Hand sanitizer'] },
  { id: 'h5', phase: 'health', name: 'Register with embassy', priority: 'low', timing: '1 week out', description: 'STEP (US) / ROCA (UK) / Registration of Canadians Abroad. Enables emergency alerts & evacuation.', subtasks: ['Enroll in STEP/equivalent', 'Save embassy contact', 'Note 24hr emergency line'] },
  
  // MONEY & TECH
  { id: 'm1', phase: 'money', name: 'Notify banks', priority: 'high', timing: '3 days out', description: 'Set travel notices on all cards. Ask about foreign transaction fees, ATM fees, daily limits.', subtasks: ['Set travel alerts', 'Check foreign fees', 'Increase daily limits', 'Save bank intl numbers'] },
  { id: 'm2', phase: 'money', name: 'Get local currency', priority: 'medium', timing: '1 week out', description: 'Order from bank (better rates) or use no-fee ATM on arrival. Avoid airport exchange. Bring $100-200 USD backup.', subtasks: ['Order from bank', 'Find no-fee ATMs', 'Bring USD backup', 'Split cash locations'] },
  { id: 'm3', phase: 'money', name: 'Payment setup', priority: 'high', timing: '1 week out', description: 'Primary: no-FX-fee card (Chase Sapphire, Capital One, Schwab). Backup: different network. Apple/Google Pay.', subtasks: ['Primary no-FX card', 'Backup Visa/MC', 'Set up Apple/Google Pay', 'Test before leaving'] },
  { id: 'm4', phase: 'money', name: 'Phone plan', priority: 'high', timing: '1 week out', description: 'eSIM (Airalo, Ubigi, Nomad) or local SIM on arrival. Unlock phone first. Google Fi / T-Mobile for included data.', subtasks: ['Check phone unlocked', 'Buy eSIM', 'Or plan for local SIM', 'Download offline maps'] },
  { id: 'm5', phase: 'money', name: 'Digital security', priority: 'medium', timing: '1 week out', description: 'VPN, password manager, 2FA codes accessible, offline maps, translation app, ride-hailing apps', subtasks: ['Set up VPN', 'Export 2FA codes', 'Download offline maps', 'Install translation app', 'Set up ride apps'] },
  
  // HOME PREP
  { id: 'hm1', phase: 'home', name: 'Mail & deliveries', priority: 'high', timing: '1 week out', description: 'USPS hold mail, pause packages, notify neighbors, set up package lockbox or redirect', subtasks: ['USPS hold mail', 'Pause Amazon/subscriptions', 'Notify neighbor', 'Set up package hold'] },
  { id: 'hm2', phase: 'home', name: 'Bills & autopay', priority: 'high', timing: '1 week out', description: 'Ensure all bills on autopay. Check due dates during trip. Pay early if needed.', subtasks: ['Verify autopay active', 'Pay early if due', 'Check credit card due'] },
  { id: 'hm3', phase: 'home', name: 'Plants & pets', priority: 'high', timing: '1 week out', description: 'Plant sitter, self-watering spikes, pet sitter/boarding, vet info, meds, emergency contact', subtasks: ['Arrange plant care', 'Book pet sitter/boarding', 'Prep pet instructions', 'Leave vet info'] },
  { id: 'hm4', phase: 'home', name: 'Security & energy', priority: 'high', timing: 'Day before', description: 'Lights on timers, unplug non-essentials, adjust thermostat, lock windows, hide valuables, car in garage', subtasks: ['Set light timers', 'Unplug electronics', 'Set thermostat (55°F/85°F)', 'Lock all windows/doors', 'Hide valuables', 'Park car securely'] },
  { id: 'hm5', phase: 'home', name: 'Fridge & trash', priority: 'medium', timing: 'Day before', description: 'Eat perishables, freeze rest, take out trash, run disposal, leave baking soda in fridge', subtasks: ['Clear perishables', 'Take out trash', 'Run disposal', 'Baking soda in fridge'] },
  
  // PACKING
  { id: 'pk1', phase: 'packing', name: 'Luggage strategy', priority: 'high', timing: '1 week out', description: 'Carry-on only if possible. Checked: weigh it. Distribute essentials across bags. Photo luggage + contents.', subtasks: ['Choose bags', 'Weigh checked bag', 'Distribute essentials', 'Photo luggage + contents'] },
  { id: 'pk2', phase: 'packing', name: 'Pack using categories', priority: 'high', timing: '2-3 days out', description: 'Use packing cubes. Roll clothes. Use packing list below. Leave 20% space for returns.', subtasks: ['Pack clothes', 'Pack toiletries', 'Pack electronics', 'Pack documents', 'Leave buffer space'] },
  { id: 'pk3', phase: 'packing', name: 'Carry-on essentials', priority: 'high', timing: 'Night before', description: 'Passport, wallet, phone, meds, change of clothes, valuables, chargers, snacks, empty water bottle', subtasks: ['Passport + docs', 'Wallet + cards', 'Phone + charger', 'Meds (original bottles)', 'Change of clothes', 'Valuables', 'Snacks + empty bottle'] },
  { id: 'pk4', phase: 'packing', name: 'Liquids bag', priority: 'high', timing: 'Night before', description: 'TSA 3-1-1: 3.4oz containers, 1 quart bag, 1 per person. Pre-pack in accessible outer pocket.', subtasks: ['3.4oz containers only', '1 quart ziploc', 'Accessible pocket', 'Meds exempt (declare)'] },
  { id: 'pk5', phase: 'packing', name: 'Tech & chargers', priority: 'medium', timing: 'Night before', description: 'Phone, laptop, tablet, watch, headphones, power bank, universal adapter, cables. Backup charger.', subtasks: ['All devices', 'All chargers', 'Power bank (carry-on)', 'Universal adapter', 'Cable organizer'] },
  
  // DAY OF
  { id: 'do1', phase: 'day_of', name: 'Final home walkthrough', priority: 'high', timing: 'Departure day', description: 'Stove off, windows locked, thermostat set, lights on timers, water off (long trips), trash out', subtasks: ['Stove/oven off', 'Windows locked', 'Thermostat set', 'Timers on', 'Water main off (2+ weeks)', 'Trash out'] },
  { id: 'do2', phase: 'day_of', name: 'Documents accessible', priority: 'high', timing: 'Departure day', description: 'Passport, boarding passes (digital + printed), ID, insurance card, reservation confirmations', subtasks: ['Passport', 'Boarding passes', 'Photo ID', 'Insurance card', 'Hotel/rental confirmations'] },
  { id: 'do3', phase: 'day_of', name: 'Airport arrival', priority: 'high', timing: 'Departure day', description: 'Domestic: 2hrs. International: 3hrs. Check-in online 24hrs prior. Download airline app.', subtasks: ['Check-in online', 'Download airline app', 'Allow extra time', 'Know terminal'] },
  { id: 'do4', phase: 'day_of', name: 'Notify contact', priority: 'medium', timing: 'Departure day', description: 'Text emergency contact: "Leaving now, arriving [time], will message when landed"', subtasks: ['Text departure', 'Share flight tracking', 'Plan arrival message'] },
]

// PACKING CATEGORIES
const packingCategories = [
  {
    name: 'Clothing',
    icon: '👕',
    items: ['Underwear (days + 1)', 'Socks (days + 1)', 'T-shirts/tops', 'Pants/shorts/skirts', 'Light jacket/sweater', 'Sleepwear', 'Swimwear', 'Workout clothes', 'Nice outfit (optional)', 'Hat/cap', 'Scarf/bandana']
  },
  {
    name: 'Footwear',
    icon: '👟',
    items: ['Walking shoes (broken in)', 'Sandals/flip-flops', 'Nice shoes (optional)', 'Hiking boots (if needed)', 'Shoe bags']
  },
  {
    name: 'Toiletries',
    icon: '🧴',
    items: ['Toothbrush + paste', 'Deodorant', 'Shampoo/conditioner', 'Body wash/soap', 'Face wash + moisturizer', 'Sunscreen (SPF 30+)', 'Lip balm SPF', 'Hair brush/comb', 'Contacts + solution', 'Glasses + case', 'Razor', 'Medications', 'Basic first aid']
  },
  {
    name: 'Electronics',
    icon: '🔌',
    items: ['Phone + charger', 'Power bank', 'Universal adapter', 'Laptop/tablet + charger', 'Headphones', 'Watch + charger', 'Camera + charger', 'E-reader', 'Cable organizer', 'Portable SSD']
  },
  {
    name: 'Documents & Money',
    icon: '📋',
    items: ['Passport', 'Visas/printouts', 'Driver\'s license', 'Credit cards (2+)', 'Debit card (no ATM fee)', 'Cash (USD + local)', 'Insurance card', 'Vaccination record', 'Emergency contacts', 'Boarding passes', 'Hotel confirmations', 'Rental car confirmation']
  },
  {
    name: 'Health & Comfort',
    icon: '💊',
    items: ['Prescription meds (extra)', 'Pain reliever', 'Anti-diarrheal', 'Antihistamine', 'Motion sickness', 'Electrolyte packets', 'Hand sanitizer', 'Masks', 'Eye mask', 'Ear plugs', 'Neck pillow', 'Compression socks']
  },
  {
    name: 'Miscellaneous',
    icon: '🎒',
    items: ['Daypack/tote', 'Reusable water bottle', 'Snacks', 'Pen', 'Notebook', 'Kindle/book', 'Playing cards', 'Ziploc bags', 'Laundry bag', 'Travel umbrella', 'Packing cubes', 'Luggage scale', 'Clothespins', 'Carabiner']
  }
]

// ============================================
// STATE
// ============================================

const activePhase = ref('planning')
const checked = ref({})
const taskNotes = ref({})
const subtaskState = ref({})
const packingState = ref({})
const editingNotesId = ref(null)

const trip = ref({
  destination: '',
  startDate: '',
  endDate: '',
  type: 'leisure'
})

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      checked.value = data.checked || {}
      taskNotes.value = data.notes || {}
      subtaskState.value = data.subtasks || {}
      packingState.value = data.packing || {}
      trip.value = data.trip || trip.value
      activePhase.value = data.activePhase || 'planning'
    }
  } catch {}
  
  // Initialize subtask state
  allTasks.forEach(task => {
    if (task.subtasks && !subtaskState.value[task.id]) {
      subtaskState.value[task.id] = {}
      task.subtasks.forEach(sub => { subtaskState.value[task.id][sub] = false })
    }
  })
  
  // Initialize packing state
  packingCategories.forEach(cat => {
    if (!packingState.value[cat.name]) {
      packingState.value[cat.name] = {}
      cat.items.forEach(item => { packingState.value[cat.name][item] = false })
    }
  })
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    checked: checked.value,
    notes: taskNotes.value,
    subtasks: subtaskState.value,
    packing: packingState.value,
    trip: trip.value,
    activePhase: activePhase.value
  }))
}

function getPhaseTasks(phaseId) {
  return allTasks.filter(task => task.phase === phaseId)
}

function getPhaseProgress(phaseId) {
  const tasks = getPhaseTasks(phaseId)
  const done = tasks.filter(t => checked.value[t.id]).length
  return { done, total: tasks.length }
}

function getCategoryPacked(catName) {
  const cat = packingCategories.find(c => c.name === catName)
  if (!cat) return 0
  return cat.items.filter(item => packingState.value[catName]?.[item]).length
}

const totalItems = computed(() => allTasks.length)
const completedCount = computed(() => Object.values(checked.value).filter(v => v).length)
const overallPercent = computed(() => totalItems.value > 0 ? Math.round((completedCount.value / totalItems.value) * 100) : 0)

const tripDuration = computed(() => {
  if (!trip.value.startDate || !trip.value.endDate) return 0
  const start = new Date(trip.value.startDate)
  const end = new Date(trip.value.endDate)
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
})

function getTask(id) {
  return allTasks.find(t => t.id === id)
}

function saveSubtask(taskId) {
  saveState()
}

function savePacking() {
  saveState()
}

function showNotes(id) {
  editingNotesId.value = id
}

function closeNotes() {
  editingNotesId.value = null
}

function exportFullPlan() {
  const date = new Date().toLocaleDateString()
  let text = `TRIP PLAN: ${trip.value.destination || 'TBD'} - ${date}\n`
  text += `========================================\n\n`
  if (trip.value.destination) text += `Destination: ${trip.value.destination}\n`
  if (trip.value.startDate && trip.value.endDate) text += `Dates: ${trip.value.startDate} to ${trip.value.endDate} (${tripDuration.value} days)\n`
  if (trip.value.type) text += `Type: ${trip.value.type}\n`
  text += `Progress: ${completedCount.value} / ${totalItems.value} (${overallPercent.value}%)\n\n`
  
  phases.forEach(phase => {
    const tasks = getPhaseTasks(phase.id)
    const prog = getPhaseProgress(phase.id)
    text += `${phase.icon} ${phase.name.toUpperCase()} (${prog.done}/${prog.total})\n`
    text += `----------------------------------------\n`
    tasks.forEach(task => {
      const status = checked.value[task.id] ? '[✓]' : '[ ]'
      const opt = task.optional ? ' (Optional)' : ''
      text += `${status} ${task.name}${opt} — ${task.priority.toUpperCase()} ${task.timing ? `(${task.timing})` : ''}\n`
      if (task.description) text += `    ${task.description}\n`
      if (task.subtasks) {
        task.subtasks.forEach(sub => {
          const subDone = subtaskState.value[task.id]?.[sub] ? '[✓]' : '[ ]'
          text += `    ${subDone} ${sub}\n`
        })
      }
      const note = taskNotes.value[task.id]
      if (note) text += `    📝 ${note}\n`
    })
    text += `\n`
  })
  
  // Packing list
  text += `🎒 PACKING LIST\n`
  text += `----------------------------------------\n`
  packingCategories.forEach(cat => {
    text += `\n${cat.icon} ${cat.name}\n`
    cat.items.forEach(item => {
      const packed = packingState.value[cat.name]?.[item] ? '[✓]' : '[ ]'
      text += `  ${packed} ${item}\n`
    })
  })
  
  downloadText(text, `trip-plan-${trip.value.destination || 'trip'}-${Date.now()}.txt`)
}

function exportPackingList() {
  let text = `PACKING LIST: ${trip.value.destination || 'Trip'} - ${new Date().toLocaleDateString()}\n`
  text += `========================================\n\n`
  packingCategories.forEach(cat => {
    text += `${cat.icon} ${cat.name} (${getCategoryPacked(cat.name)}/${cat.items.length})\n`
    cat.items.forEach(item => {
      const packed = packingState.value[cat.name]?.[item] ? '[✓]' : '[ ]'
      text += `  ${packed} ${item}\n`
    })
    text += `\n`
  })
  downloadText(text, `packing-list-${Date.now()}.txt`)
}

function exportPreDeparture() {
  const preDepTasks = allTasks.filter(t => t.phase === 'home' || t.phase === 'day_of')
  let text = `PRE-DEPARTURE CHECKLIST - ${new Date().toLocaleDateString()}\n`
  text += `========================================\n\n`
  preDepTasks.forEach(task => {
    const status = checked.value[task.id] ? '[✓]' : '[ ]'
    text += `${status} ${task.name} (${task.priority.toUpperCase()})\n`
    if (task.description) text += `    ${task.description}\n`
    if (task.subtasks) {
      task.subtasks.forEach(sub => {
        const subDone = subtaskState.value[task.id]?.[sub] ? '[✓]' : '[ ]'
        text += `    ${subDone} ${sub}\n`
      })
    }
  })
  downloadText(text, `pre-departure-${Date.now()}.txt`)
}

function copyTripSummary() {
  const summary = `Trip: ${trip.value.destination || 'TBD'} | ${trip.value.startDate} to ${trip.value.endDate} (${tripDuration.value} days) | Progress: ${completedCount.value}/${totalItems.value} (${overallPercent.value}%) | Type: ${trip.value.type}`
  navigator.clipboard.writeText(summary)
  alert('Trip summary copied!')
}

function generateShareLink() {
  // Create a shareable encoded string of the trip data
  const shareData = {
    trip: trip.value,
    checked: checked.value,
    packing: packingState.value,
    timestamp: Date.now()
  }
  const encoded = btoa(JSON.stringify(shareData))
  const url = `${window.location.origin}${window.location.pathname}#share=${encoded}`
  navigator.clipboard.writeText(url)
  alert('Share link copied! Send to travel companions.')
}

function downloadText(text, filename) {
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// Handle share links
onMounted(() => {
  loadState()
  
  // Check for share link
  const hash = window.location.hash
  if (hash.startsWith('#share=')) {
    try {
      const encoded = hash.substring(7)
      const data = JSON.parse(atob(encoded))
      if (data.trip) trip.value = data.trip
      if (data.checked) checked.value = data.checked
      if (data.packing) packingState.value = data.packing
      saveState()
      alert('Trip plan loaded from share link!')
    } catch {
      console.warn('Invalid share link')
    }
  }
})

watch([checked, taskNotes, subtaskState, packingState, trip, activePhase], saveState, { deep: true })
</script>

<style scoped>
.travel-checklist {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider);
}

.checklist-header {
  text-align: center;
  margin-bottom: 1.5rem;
}
.checklist-header h2 {
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  margin-bottom: 0.5rem; font-size: 1.5rem;
}
.checklist-subtitle {
  color: var(--vp-c-text-2); font-size: 0.9rem; margin-bottom: 1rem;
}

.trip-config {
  background: var(--vp-c-bg); border-radius: 12px; padding: 1rem;
  border: 1px solid var(--vp-c-divider); margin-bottom: 1rem;
}
.config-row { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.75rem; align-items: end; }
.config-row:last-child { margin-bottom: 0; }
.config-row label { display: flex; flex-direction: column; gap: 0.25rem; flex: 1; min-width: 150px; }
.config-row label:last-child { flex: 0 0 auto; }
.config-input {
  padding: 0.5rem; border: 1px solid var(--vp-c-divider);
  border-radius: 6px; background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1); font-size: 0.9rem;
}
.config-input:focus { outline: none; border-color: var(--vp-c-brand-1); }

.progress-summary { display: flex; flex-direction: column; gap: 0.5rem; align-items: center; }
.progress-bar-container {
  width: 100%; max-width: 400px; height: 10px;
  background: var(--vp-c-bg); border-radius: 5px; overflow: hidden;
}
.progress-bar-fill {
  height: 100%; background: var(--vp-c-brand-1); border-radius: 5px;
  transition: width 0.3s ease;
}
.progress-text { font-size: 0.85rem; color: var(--vp-c-text-2); font-weight: 600; }

.phase-tabs {
  display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;
  padding: 0.5rem; background: var(--vp-c-bg); border-radius: 12px;
}
.tab-btn {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 1rem; border-radius: 8px;
  border: 1px solid transparent; background: transparent;
  color: var(--vp-c-text-2); font-size: 0.8rem; font-weight: 500;
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.tab-btn:hover { background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); }
.tab-btn.active {
  background: var(--vp-c-brand-1); color: white; border-color: var(--vp-c-brand-1);
}
.tab-count {
  font-size: 0.65rem; padding: 0.1rem 0.4rem; border-radius: 10px;
  background: var(--vp-c-bg-soft); font-weight: 600;
}
.tab-btn.active .tab-count { background: rgba(255,255,255,0.2); }

.phase-content { min-height: 300px; }

.checklist-item {
  display: flex; justify-content: space-between; align-items: flex-start;
  gap: 1rem; padding: 1rem;
  background: var(--vp-c-bg); border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  margin-bottom: 0.75rem; transition: all 0.2s;
}
.checklist-item:hover { border-color: var(--vp-c-brand-1); }
.checklist-item.priority-high { border-left: 4px solid #e74c3c; }
.checklist-item.priority-medium { border-left: 4px solid #f39c12; }
.checklist-item.priority-low { border-left: 4px solid #3498db; }
.checklist-item.completed { opacity: 0.7; background: var(--vp-c-brand-soft); }
.checklist-item.completed .item-name { text-decoration: line-through; color: var(--vp-c-text-2); }
.checklist-item.optional { border-style: dashed; opacity: 0.8; }

.checkbox-wrapper { display: flex; align-items: center; cursor: pointer; flex-shrink: 0; }
.checkbox-input { display: none; }
.checkbox-custom {
  width: 22px; height: 22px; border-radius: 6px;
  border: 2px solid var(--vp-c-divider);
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s; flex-shrink: 0;
}
.checkbox-input:checked + .checkbox-custom {
  background: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1);
}
.checkbox-input:checked + .checkbox-custom::after {
  content: '✓'; color: white; font-size: 0.8rem; font-weight: 700;
}

.item-info { flex: 1; min-width: 0; }
.item-header { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.25rem; }
.item-name { font-weight: 600; font-size: 0.95rem; }
.priority-badge {
  font-size: 0.6rem; font-weight: 700; padding: 0.15rem 0.4rem;
  border-radius: 4px; text-transform: uppercase;
}
.priority-badge.high { background: #e74c3c; color: white; }
.priority-badge.medium { background: #f39c12; color: white; }
.priority-badge.low { background: #3498db; color: white; }
.optional-badge {
  font-size: 0.6rem; background: var(--vp-c-text-3); color: white;
  padding: 0.15rem 0.4rem; border-radius: 4px; font-weight: 600;
}
.timing-badge {
  font-size: 0.65rem; background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1);
  padding: 0.15rem 0.4rem; border-radius: 4px; font-weight: 600; white-space: nowrap;
}
.item-desc { margin: 0.25rem 0 0.5rem; font-size: 0.8rem; color: var(--vp-c-text-2); line-height: 1.4; }

.subtasks { display: flex; flex-direction: column; gap: 0.3rem; margin-top: 0.5rem; padding-left: 1.5rem; }
.subtask-item {
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.75rem; color: var(--vp-c-text-2); cursor: pointer;
}
.subtask-item input { accent-color: var(--vp-c-brand-1); width: 14px; height: 14px; }

.item-actions { display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end; flex-shrink: 0; }
.notes-btn {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 8px;
  background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2); cursor: pointer; transition: all 0.2s;
}
.notes-btn:hover { background: var(--vp-c-brand-soft); border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }

/* Notes Modal */
.notes-modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 1rem;
}
.notes-modal {
  background: var(--vp-c-bg); border-radius: 16px; padding: 1.5rem;
  max-width: 500px; width: 100%; max-height: 80vh; overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.modal-header h3 { margin: 0; font-size: 1.1rem; }
.close-btn {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider);
  font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center;
}
.close-btn:hover { background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); }
.notes-textarea {
  width: 100%; min-height: 150px; padding: 1rem;
  border: 1px solid var(--vp-c-divider); border-radius: 10px;
  background: var(--vp-c-bg-soft); color: var(--vp-c-text-1);
  font-family: inherit; font-size: 0.9rem; line-height: 1.5; resize: vertical;
}
.notes-textarea:focus { outline: none; border-color: var(--vp-c-brand-1); }
.modal-footer { display: flex; justify-content: flex-end; margin-top: 1rem; }
.btn-secondary {
  padding: 0.5rem 1.2rem; border-radius: 8px;
  background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1); cursor: pointer;
}
.btn-secondary:hover { border-color: var(--vp-c-brand-1); }

/* Packing Summary */
.packing-summary { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--vp-c-divider); }
.packing-summary h3 { margin-bottom: 1rem; font-size: 1rem; }
.packing-categories { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
.packing-category { background: var(--vp-c-bg); border-radius: 12px; padding: 1rem; border: 1px solid var(--vp-c-divider); }
.packing-category h4 { margin: 0 0 0.75rem; font-size: 0.85rem; font-weight: 600; color: var(--vp-c-text-1); }
.packing-items { display: flex; flex-direction: column; gap: 0.35rem; }
.packing-item {
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.75rem; color: var(--vp-c-text-2); cursor: pointer;
}
.packing-item input { accent-color: var(--vp-c-brand-1); width: 14px; height: 14px; }

/* Export Section */
.export-section { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--vp-c-divider); }
.export-section h3 { margin-bottom: 1rem; font-size: 1rem; }
.export-buttons { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.export-btn {
  padding: 0.6rem 1.2rem; border-radius: 8px; border: none;
  cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.2s;
}
.export-btn:not(.secondary) { background: var(--vp-c-brand-1); color: white; }
.export-btn.secondary { background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); color: var(--vp-c-text-1); }
.export-btn:hover:not(.secondary) { transform: translateY(-2px); }
.export-btn.secondary:hover { border-color: var(--vp-c-brand-1); }

.disclaimer {
  margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--vp-c-divider);
  text-align: center; font-size: 0.75rem; color: var(--vp-c-text-3); line-height: 1.5;
}

/* Mobile */
@media (max-width: 640px) {
  .travel-checklist { padding: 1rem; margin: 1rem; }
  .config-row { flex-direction: column; align-items: stretch; }
  .config-row label { width: 100%; }
  .phase-tabs { justify-content: center; }
  .tab-btn .tab-label { display: none; }
  .item-actions { flex-direction: row; justify-content: space-between; width: 100%; }
  .export-buttons { flex-direction: column; }
  .export-btn { width: 100%; }
  .packing-categories { grid-template-columns: 1fr; }
}
</style>