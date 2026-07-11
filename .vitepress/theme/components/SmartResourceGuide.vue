<template>
  <div class="smart-hub">
    <!-- Category Selector (only shown if no category prop is specified) -->
    <div v-if="!category" class="category-selector-container">
      <p class="selector-label">Select a Resource Hub:</p>
      <div class="category-pills">
        <button 
          v-for="(cat, key) in categories" 
          :key="key"
          :class="['cat-pill', { active: activeCategoryKey === key }]"
          @click="selectCategory(key)"
        >
          <span class="cat-icon">{{ cat.icon }}</span>
          {{ cat.title }}
        </button>
      </div>
    </div>

    <!-- Active Hub Header -->
    <div class="hub-header">
      <h2>{{ activeCategory.title }}</h2>
      <p class="hub-subtitle">{{ activeCategory.subtitle }}</p>
    </div>

    <!-- Interactive Filters & Search -->
    <div class="hub-controls">
      <div class="search-box">
        <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search tools, tags, or features..." 
          class="search-input"
        />
        <button v-if="searchQuery" @click="searchQuery = ''" class="clear-search">×</button>
      </div>

      <div class="filter-sort-group">
        <!-- Tag Filter Pills -->
        <div class="tag-filter-pills">
          <button 
            v-for="tag in availableFilterTags" 
            :key="tag"
            :class="['tag-pill', { active: selectedFilters.includes(tag) }]"
            @click="toggleFilter(tag)"
          >
            {{ tag }}
          </button>
        </div>

        <div class="sort-selector">
          <select v-model="sortBy" class="sort-select">
            <option value="rank">Sort by: Rank</option>
            <option value="rating">Sort by: Rating</option>
            <option value="difficulty">Sort by: Difficulty</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Main Navigation Tabs (Rankings vs Comparison Matrix vs Pros/Cons) -->
    <div class="tabs-navigation">
      <button 
        :class="['nav-tab', { active: activeTab === 'rankings' }]" 
        @click="activeTab = 'rankings'"
      >
        🏆 Rankings & Details
      </button>
      <button 
        :class="['nav-tab', { active: activeTab === 'matrix' }]" 
        @click="activeTab = 'matrix'"
      >
        📊 Comparison Matrix
      </button>
      <button 
        :class="['nav-tab', { active: activeTab === 'proscons' }]" 
        @click="activeTab = 'proscons'"
      >
        ⚖️ Pros & Cons Grid
      </button>
    </div>

    <!-- TAB 1: Rankings & Detail View -->
    <div v-if="activeTab === 'rankings'" class="tab-content rankings-tab">
      <!-- Quick Recommendations Grid -->
      <div v-if="quickRecommendations.length > 0 && !searchQuery && selectedFilters.length === 0" class="recommendations-container">
        <h3 class="rec-section-title">⚡ Quick Recommendations</h3>
        <div class="recommendations-grid">
          <div 
            v-for="rec in quickRecommendations" 
            :key="rec.id" 
            class="rec-card"
            @click="selectToolById(rec.id)"
          >
            <div class="rec-badge">{{ rec.quickRec }}</div>
            <h4>{{ rec.name }}</h4>
            <p>{{ rec.desc }}</p>
            <span class="view-detail-link">View Details →</span>
          </div>
        </div>
      </div>

      <!-- Split Layout: List on Left, Detail Panel on Right -->
      <div class="split-view">
        <!-- Tools List -->
        <div class="tools-list">
          <div 
            v-for="tool in filteredTools" 
            :key="tool.id"
            :class="['tool-list-card', { active: selectedTool && selectedTool.id === tool.id }]"
            @click="selectedTool = tool"
          >
            <div class="tool-list-header">
              <span class="tool-rank">#{{ tool.rank }}</span>
              <span class="tool-rating-badge">★ {{ tool.rating.toFixed(1) }}</span>
            </div>
            
            <div class="tool-list-body">
              <h4 class="tool-name">{{ tool.name }}</h4>
              <p class="tool-desc-short">{{ truncate(tool.desc, 90) }}</p>
            </div>

            <div class="tool-list-footer">
              <span class="diff-badge" :class="'diff-' + tool.difficulty">{{ tool.difficulty }}</span>
              <div class="tool-tags-mini">
                <span v-for="tag in tool.tags.slice(0, 2)" :key="tag" class="mini-tag">{{ tag }}</span>
              </div>
            </div>
          </div>

          <div v-if="filteredTools.length === 0" class="empty-state">
            <p>No tools match your active search or filters.</p>
            <button @click="resetFilters" class="reset-btn">Clear Filters</button>
          </div>
        </div>

        <!-- Tool Detail Panel (Sticky / Desktop only, opens modal on mobile) -->
        <div class="tool-detail-panel" v-if="selectedTool">
          <div class="detail-scroll-container">
            <!-- Header -->
            <div class="detail-header">
              <div class="detail-title-row">
                <span class="detail-rank">Rank #{{ selectedTool.rank }}</span>
                <span class="detail-rating">Score: <strong>{{ selectedTool.rating.toFixed(1) }}/10</strong></span>
              </div>
              <h3 class="detail-name">{{ selectedTool.name }}</h3>
              <p v-if="selectedTool.quickRec" class="detail-rec-banner">
                <span>{{ selectedTool.quickRec }}</span>
              </p>
            </div>

            <!-- Image/Screenshot Mockup -->
            <div class="detail-screenshot-container" v-if="selectedTool.screenshot">
              <img :src="selectedTool.screenshot" :alt="selectedTool.name + ' screenshot'" class="detail-screenshot" />
              <div class="screenshot-overlay">
                <span>Representative Mockup View</span>
              </div>
            </div>

            <!-- Tags & Difficulty -->
            <div class="detail-meta-row">
              <span class="difficulty-tag" :class="'diff-' + selectedTool.difficulty">
                {{ selectedTool.difficulty.toUpperCase() }} DIFFICULTY
              </span>
              <div class="detail-tags">
                <span v-for="tag in selectedTool.tags" :key="tag" class="detail-tag-badge">{{ tag }}</span>
              </div>
            </div>

            <!-- Description -->
            <div class="detail-section">
              <p class="detail-desc">{{ selectedTool.desc }}</p>
            </div>

            <!-- Pros & Cons -->
            <div class="detail-section pros-cons-section">
              <div class="pro-column">
                <h4 class="pc-title pro-title">🟢 Pros</h4>
                <ul>
                  <li v-for="pro in selectedTool.pros" :key="pro">{{ pro }}</li>
                </ul>
              </div>
              <div class="con-column">
                <h4 class="pc-title con-title">🔴 Cons</h4>
                <ul>
                  <li v-for="con in selectedTool.cons" :key="con">{{ con }}</li>
                </ul>
              </div>
            </div>

            <!-- Detail Specs (Horizontal list) -->
            <div class="detail-specs">
              <div class="spec-item" v-for="(val, key) in selectedTool.comparisonFeatures" :key="key">
                <span class="spec-label">{{ key }}</span>
                <span class="spec-value">{{ val }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="detail-actions">
              <a :href="selectedTool.url" target="_blank" rel="noopener noreferrer" class="visit-btn">
                Visit Official Website
                <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: Comparison Matrix -->
    <div v-if="activeTab === 'matrix'" class="tab-content matrix-tab">
      <div class="matrix-table-wrapper">
        <table class="matrix-table">
          <thead>
            <tr>
              <th>Tool Name</th>
              <th>Rank</th>
              <th>Rating</th>
              <th>Difficulty</th>
              <th v-for="feature in comparisonFeatureKeys" :key="feature">{{ feature }}</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tool in filteredTools" :key="tool.id">
              <td class="td-name">
                <div class="td-name-content">
                  <strong>{{ tool.name }}</strong>
                  <span class="td-quick-rec" v-if="tool.quickRec">{{ tool.quickRec }}</span>
                </div>
              </td>
              <td><span class="matrix-rank">#{{ tool.rank }}</span></td>
              <td><span class="matrix-rating">★ {{ tool.rating.toFixed(1) }}</span></td>
              <td><span class="diff-badge" :class="'diff-' + tool.difficulty">{{ tool.difficulty }}</span></td>
              <td v-for="feature in comparisonFeatureKeys" :key="feature">
                <span :class="['feature-val', getFeatureClass(tool.comparisonFeatures[feature])]">
                  {{ tool.comparisonFeatures[feature] }}
                </span>
              </td>
              <td>
                <a :href="tool.url" target="_blank" rel="noopener noreferrer" class="matrix-link-btn">Visit</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 3: Pros & Cons Grid -->
    <div v-if="activeTab === 'proscons'" class="tab-content proscons-tab">
      <div class="proscons-grid">
        <div 
          v-for="tool in filteredTools" 
          :key="tool.id" 
          class="pc-grid-card"
        >
          <div class="pc-card-header">
            <h4>#{{ tool.rank }} - {{ tool.name }}</h4>
            <span class="diff-badge" :class="'diff-' + tool.difficulty">{{ tool.difficulty }}</span>
          </div>
          <div class="pc-card-body">
            <div class="pc-column">
              <h5 class="pro-heading">🟢 Pros</h5>
              <ul>
                <li v-for="pro in tool.pros" :key="pro">{{ pro }}</li>
              </ul>
            </div>
            <div class="pc-column">
              <h5 class="con-heading">🔴 Cons</h5>
              <ul>
                <li v-for="con in tool.cons" :key="con">{{ con }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Detail Drawer Modal -->
    <div v-if="isMobileDetailOpen && selectedTool" class="mobile-drawer-overlay" @click="closeMobileDetail">
      <div class="mobile-drawer-content" @click.stop>
        <button class="close-drawer-btn" @click="closeMobileDetail">×</button>
        <div class="drawer-scroll">
          <div class="detail-header">
            <div class="detail-title-row">
              <span class="detail-rank">Rank #{{ selectedTool.rank }}</span>
              <span class="detail-rating">★ {{ selectedTool.rating.toFixed(1) }}/10</span>
            </div>
            <h3 class="detail-name">{{ selectedTool.name }}</h3>
            <p v-if="selectedTool.quickRec" class="detail-rec-banner">
              <span>{{ selectedTool.quickRec }}</span>
            </p>
          </div>

          <div class="detail-screenshot-container" v-if="selectedTool.screenshot">
            <img :src="selectedTool.screenshot" :alt="selectedTool.name + ' screenshot'" class="detail-screenshot" />
          </div>

          <div class="detail-meta-row">
            <span class="difficulty-tag" :class="'diff-' + selectedTool.difficulty">
              {{ selectedTool.difficulty }}
            </span>
          </div>
          <div class="detail-tags" style="margin-bottom: var(--space-md);">
            <span v-for="tag in selectedTool.tags" :key="tag" class="detail-tag-badge">{{ tag }}</span>
          </div>

          <p class="detail-desc">{{ selectedTool.desc }}</p>

          <div class="pros-cons-section">
            <div class="pro-column">
              <h4 class="pc-title pro-title">🟢 Pros</h4>
              <ul>
                <li v-for="pro in selectedTool.pros" :key="pro">{{ pro }}</li>
              </ul>
            </div>
            <div class="con-column" style="margin-top: 1rem;">
              <h4 class="pc-title con-title">🔴 Cons</h4>
              <ul>
                <li v-for="con in selectedTool.cons" :key="con">{{ con }}</li>
              </ul>
            </div>
          </div>

          <div class="detail-specs" style="margin: 1.5rem 0;">
            <div class="spec-item" v-for="(val, key) in selectedTool.comparisonFeatures" :key="key">
              <span class="spec-label">{{ key }}</span>
              <span class="spec-value">{{ val }}</span>
            </div>
          </div>

          <a :href="selectedTool.url" target="_blank" rel="noopener noreferrer" class="visit-btn" style="width: 100%; box-sizing: border-box; justify-content: center;">
            Visit Website
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  category: {
    type: String,
    default: ''
  }
})

// Categories Definition
const categories = {
  'passwords': {
    title: '🔐 Password Managers',
    subtitle: 'Secure your digital life with top-ranked secure vaults.',
    icon: '🔐'
  },
  'note-taking': {
    title: '📝 Note-Taking Apps',
    subtitle: 'Compare digital journals, second-brain outliners, and wikis.',
    icon: '📝'
  },
  'privacy': {
    title: '🛡️ Privacy Browsers & Search',
    subtitle: 'Block ads, stop trackers, and secure your browsing fingerprint.',
    icon: '🛡️'
  },
  'linux': {
    title: '🐧 Linux Distros',
    subtitle: 'Find the perfect desktop environment for your computing needs.',
    icon: '🐧'
  },
  'finance': {
    title: '💰 Budgeting Apps',
    subtitle: 'Track cash flow, assign envelopes, and project net worth.',
    icon: '💰'
  }
}

// Active Category Key
const activeCategoryKey = ref(props.category || 'passwords')

// Sync state if prop changes
watch(() => props.category, (newVal) => {
  if (newVal) {
    activeCategoryKey.value = newVal
  }
})

const activeCategory = computed(() => {
  return categories[activeCategoryKey.value] || categories['passwords']
})

// Navigation tabs: 'rankings', 'matrix', 'proscons'
const activeTab = ref('rankings')

// Filtering states
const searchQuery = ref('')
const selectedFilters = ref([])
const sortBy = ref('rank')

// Split Layout states
const selectedTool = ref(null)
const isMobile = ref(false)
const isMobileDetailOpen = ref(false)

// All data
const toolsData = {
  'passwords': [
    {
      id: 'bitwarden',
      rank: 1,
      name: 'Bitwarden',
      url: 'https://bitwarden.com',
      rating: 9.7,
      difficulty: 'intermediate',
      tags: ['Open Source', 'Free Tier', 'Cloud Sync', 'Cross-Platform'],
      quickRec: '🏆 Best Overall',
      desc: 'Bitwarden is the gold standard for password management. It is fully open-source, features a very generous free tier, and supports strong zero-knowledge AES-256 bit encryption. It works flawlessly across Windows, Mac, Linux, iOS, Android, and all major web browsers. Highly audited and trust-worthy.',
      screenshot: '/screenshots/bitwarden.jpg',
      pros: [
        'Generous free tier includes unlimited devices and credentials',
        'Fully open-source and regularly audited by third parties',
        'Supports self-hosting for advanced power users',
        'Includes secure note storage and file attachments'
      ],
      cons: [
        'User interface is functional but can feel plain/dated compared to premium competition',
        'Self-hosting setup requires systems administration knowledge'
      ],
      comparisonFeatures: {
        'Price': 'Free / $10/year Premium',
        'Storage': 'Cloud (Self-host option)',
        'Encryption': 'AES-256 (Zero-Knowledge)',
        'Open Source': 'Yes'
      }
    },
    {
      id: '1password',
      rank: 2,
      name: '1Password',
      url: 'https://1password.com',
      rating: 9.4,
      difficulty: 'beginner',
      tags: ['Proprietary', 'Paid Only', 'Cloud Sync', 'Premium Design'],
      quickRec: '⚡ Best User Experience',
      desc: '1Password offers the most polished user experience on the market. It includes advanced features like Travel Mode (wipes vaults from device temporarily), credit card virtual numbers integration (via Privacy.com), and deep integrations with macOS and iOS. Excellent family sharing plans.',
      screenshot: '/screenshots/bitwarden.jpg',
      pros: [
        'Gorgeous and highly intuitive UI across all platforms',
        'Travel Mode increases physical security at border crossings',
        'Fantastic family and vault sharing capabilities',
        'Excellent browser extension autofill'
      ],
      cons: [
        'No free tier (only 14-day trial)',
        'Proprietary closed-source code (audited but not public)'
      ],
      comparisonFeatures: {
        'Price': '$36/year Personal',
        'Storage': '1Password Cloud',
        'Encryption': 'AES-256 + Secret Key',
        'Open Source': 'No'
      }
    },
    {
      id: 'keepassxc',
      rank: 3,
      name: 'KeePassXC',
      url: 'https://keepassxc.org',
      rating: 9.0,
      difficulty: 'advanced',
      tags: ['Open Source', 'Free', 'Local First', 'Zero Knowledge'],
      quickRec: '🛡️ Best Offline & Privacy',
      desc: 'KeePassXC is a community fork of KeePass designed to run locally. It has no cloud sync backend out-of-the-box: your passwords live in a encrypted `.kdbx` file on your local machine. Perfect for privacy purists who do not want their password vault stored on third-party servers.',
      screenshot: '/screenshots/bitwarden.jpg',
      pros: [
        '100% local-first, zero reliance on external servers',
        'Completely free and open-source, no ads or tracking',
        'High customization: customize icons, databases, and fields',
        'Integrated TOTP generator'
      ],
      cons: [
        'No built-in cloud sync; user must sync file manually (e.g. Syncthing, Dropbox)',
        'Setup browser extension is more complex than competitors'
      ],
      comparisonFeatures: {
        'Price': '100% Free',
        'Storage': 'Local File only',
        'Encryption': 'AES-256 / ChaCha20',
        'Open Source': 'Yes'
      }
    },
    {
      id: 'protonpass',
      rank: 4,
      name: 'Proton Pass',
      url: 'https://proton.me/pass',
      rating: 8.8,
      difficulty: 'beginner',
      tags: ['Free Tier', 'Cloud Sync', 'Privacy First', 'Email Aliases'],
      quickRec: '📧 Best Integrated Privacy',
      desc: 'From the makers of ProtonMail, Proton Pass is a newer password manager featuring strong end-to-end encryption. A major standout feature is the built-in email alias generator (via SimpleLogin) which lets you create unique, tracking-resistant emails for every website.',
      screenshot: '/screenshots/bitwarden.jpg',
      pros: [
        'Generates hide-my-email aliases directly within the app',
        'Operated from Switzerland under strict privacy laws',
        'Sleek and modern user interface',
        'Good integration with Proton ecosystem'
      ],
      cons: [
        'Newer tool with fewer advanced configuration features than Bitwarden',
        'Free tier limits the number of email aliases you can generate'
      ],
      comparisonFeatures: {
        'Price': 'Free / $24/year Plus',
        'Storage': 'Proton Secure Cloud',
        'Encryption': 'AES-256 + bcrypt',
        'Open Source': 'Yes (Clients)'
      }
    }
  ],
  'note-taking': [
    {
      id: 'obsidian',
      rank: 1,
      name: 'Obsidian',
      url: 'https://obsidian.md',
      rating: 9.8,
      difficulty: 'intermediate',
      tags: ['Local First', 'Markdown', 'Free', 'Extensible'],
      quickRec: '🏆 Best Overall',
      desc: 'Obsidian is a powerful local-first note-taking app that runs on plain text Markdown files. It uses a graph view to visualize links between notes, enabling a non-linear "second brain" organization style. Massive community plugin registry allows it to be customized into anything.',
      screenshot: '/screenshots/obsidian.jpg',
      pros: [
        'All files live on your computer; zero vendor lock-in',
        'Stupidly fast performance even with tens of thousands of notes',
        'Over 2,000 plugins allow you to customize task boards, calendars, and tables',
        'Highly powerful visual link graph'
      ],
      cons: [
        'Mobile sync requires paying for Obsidian Sync ($48/yr) or setting up manual sync',
        'Markdown and system structure can be intimidating for beginners'
      ],
      comparisonFeatures: {
        'Price': 'Free (Personal) / $48/yr Sync',
        'Storage': 'Local Folder (.md files)',
        'Format': 'Plain Markdown text',
        'Offline Support': '100% Native'
      }
    },
    {
      id: 'notion',
      rank: 2,
      name: 'Notion',
      url: 'https://notion.so',
      rating: 9.2,
      difficulty: 'beginner',
      tags: ['Cloud Sync', 'Database-driven', 'Collaboration', 'Freemium'],
      quickRec: '👥 Best for Collaboration & Teams',
      desc: 'Notion is an all-in-one workspace that replaces spreadsheets, documents, wikis, and Kanban boards. It relies on a "block" structure where everything is an object. Its standout feature is relational databases, allowing you to filter and view data in multiple layouts (boards, timelines).',
      screenshot: '/screenshots/obsidian.jpg',
      pros: [
        'Highly versatile databases let you structure notes as tables or boards',
        'Unmatched collaboration features make team wikis effortless',
        'Sleek default templates and design aesthetic',
        'Extremely flexible block-based layout builder'
      ],
      cons: [
        'Cloud-only; offline support is notoriously limited and slow to load',
        'Exporting database-linked pages can be messy'
      ],
      comparisonFeatures: {
        'Price': 'Free / $10/mo Personal Pro',
        'Storage': 'Proprietary Cloud',
        'Format': 'Rich text blocks',
        'Offline Support': 'Poor (Requires network)'
      }
    },
    {
      id: 'logseq',
      rank: 3,
      name: 'Logseq',
      url: 'https://logseq.com',
      rating: 8.9,
      difficulty: 'advanced',
      tags: ['Open Source', 'Local First', 'Outliner', 'Graph-based'],
      quickRec: '🧠 Best for Bullet Outlines',
      desc: 'Logseq is a local-first, open-source outliner note-taking system. Unlike Obsidian which is page-based, Logseq is block-based (every bullet point is an atomic block). It focuses heavily on journaling (Daily Notes) and PDF annotation for academic research.',
      screenshot: '/screenshots/obsidian.jpg',
      pros: [
        'Block-level linking enables deep granular notes matching Zettelkasten',
        'Fully open-source and local-first with strong privacy guarantees',
        'Built-in PDF reader with text highlighting that links back to notes',
        'Built-in Flashcard system for active recall'
      ],
      cons: [
        'Outliner structure is strict; writing long-form essays can feel rigid',
        'Steep learning curve to master block references and queries'
      ],
      comparisonFeatures: {
        'Price': '100% Free',
        'Storage': 'Local Folder (.md / .org)',
        'Format': 'Markdown outlines',
        'Offline Support': '100% Native'
      }
    },
    {
      id: 'google-keep',
      rank: 4,
      name: 'Google Keep',
      url: 'https://keep.google.com',
      rating: 8.2,
      difficulty: 'beginner',
      tags: ['Free', 'Cloud Sync', 'Quick Capture'],
      quickRec: '🆓 Best Free Sticky Notes',
      desc: 'Google Keep is a digital sticky-note board. It is designed for fast, frictionless note capture, simple checklist creation, and voice memos. It syncs instantly with your Google account and integrates with Google Docs and Calendar.',
      screenshot: '/screenshots/obsidian.jpg',
      pros: [
        'Zero-friction, instant loading for capture on-the-go',
        'Color coding, labels, and reminders are simple to use',
        'Optical Character Recognition (OCR) extracts text from images',
        'Completely free with no storage caps'
      ],
      cons: [
        'No nested notes, linking, or long-form editing features',
        'Limited organization: notes quickly become a messy wall'
      ],
      comparisonFeatures: {
        'Price': 'Free with Google account',
        'Storage': 'Google Drive Cloud',
        'Format': 'Plain rich text cards',
        'Offline Support': 'Basic (Offline caches)'
      }
    },
    {
      id: 'apple-notes',
      rank: 5,
      name: 'Apple Notes',
      url: 'https://icloud.com',
      rating: 8.0,
      difficulty: 'beginner',
      tags: ['Free', 'iCloud Sync', 'Apple Ecosystem Only'],
      quickRec: '🍎 Best for iPad/iPhone Users',
      desc: 'Apple Notes is built directly into iOS and macOS. It is highly optimized, supports handwriting and sketching with Apple Pencil on iPad, document scanning, and collaborative shared folders. Fully integrated with Siri.',
      screenshot: '/screenshots/obsidian.jpg',
      pros: [
        'Deep operating system integration (e.g. Quick Note shortcut)',
        'Excellent support for sketching and Apple Pencil latency',
        'Fast and reliable iCloud synchronization',
        'Build-in document scanner works beautifully'
      ],
      cons: [
        'Strictly locked to the Apple ecosystem (Web client is basic)',
        'Very limited export formats'
      ],
      comparisonFeatures: {
        'Price': 'Free with Apple ID',
        'Storage': 'iCloud Drive',
        'Format': 'Rich text + Attachments',
        'Offline Support': 'Native on Apple devices'
      }
    }
  ],
  'privacy': [
    {
      id: 'firefox',
      rank: 1,
      name: 'Firefox',
      url: 'https://mozilla.org/firefox',
      rating: 9.6,
      difficulty: 'beginner',
      tags: ['Open Source', 'Free', 'Highly Extensible', 'Anti-Fingerprinting'],
      quickRec: '🏆 Best Overall Browser',
      desc: 'Mozilla Firefox is the most important browser for web privacy. It is one of the last major browsers not running on Google\'s Chromium engine. With features like Enhanced Tracking Protection and containers, combined with the uBlock Origin extension, it offers a secure, customizable browsing environment.',
      screenshot: '/screenshots/firefox.jpg',
      pros: [
        'Independent Gecko engine prevents Google Web monopolization',
        'Multi-Account Containers separate cookies between tabs (e.g. login to separate accounts)',
        'Full support for manifest V2 extensions like uBlock Origin',
        'Highly customizable via about:config settings'
      ],
      cons: [
        'Requires manual configuration for optimal privacy hardening',
        'Occasionally suffers slight compatibility speed lags vs Chromium'
      ],
      comparisonFeatures: {
        'Engine': 'Gecko (Mozilla)',
        'Ad Block': 'Via Extension (uBlock)',
        'Containers': 'Yes (Native)',
        'Licensing': 'Open Source'
      }
    },
    {
      id: 'brave',
      rank: 2,
      name: 'Brave',
      url: 'https://brave.com',
      rating: 9.2,
      difficulty: 'beginner',
      tags: ['Chromium-based', 'Ad-blocker built-in', 'Fast', 'Privacy-default'],
      quickRec: '⚡ Best Out-of-the-Box Security',
      desc: 'Brave is a Chromium-based browser that prioritizes privacy out of the box. Its "Brave Shields" block trackers, ads, and fingerprinting scripts automatically without needing external extensions. It runs on the same engine as Chrome, ensuring 100% site compatibility and top performance.',
      screenshot: '/screenshots/firefox.jpg',
      pros: [
        'Blocks all ads, trackers, and cookie notices out-of-the-box',
        'Extremely fast loading speeds and low memory consumption',
        'Brave Shields are easy to toggle and configure per-site',
        'Includes Tor tabs for quick anonymous routing'
      ],
      cons: [
        'Ships with bloated default features (Crypto wallet, rewards, AI) that must be manually disabled',
        'Built on Google\'s Chromium engine'
      ],
      comparisonFeatures: {
        'Engine': 'Blink (Chromium)',
        'Ad Block': 'Yes (Built-in Shields)',
        'Containers': 'No',
        'Licensing': 'Open Source'
      }
    },
    {
      id: 'mullvad-browser',
      rank: 3,
      name: 'Mullvad Browser',
      url: 'https://mullvad.net/browser',
      rating: 8.9,
      difficulty: 'intermediate',
      tags: ['Anti-Fingerprinting', 'No Account', 'Privacy-hardened'],
      quickRec: '🛡️ Best Anti-Fingerprinting',
      desc: 'Developed in collaboration with the Tor Project, the Mullvad Browser is designed to bring Tor\'s advanced anti-fingerprinting protection to the regular web. It does not route traffic through Tor, meaning normal speeds, but forces you to blend in with other Mullvad users to prevent tracking.',
      screenshot: '/screenshots/firefox.jpg',
      pros: [
        'Blends user agent and canvas fingerprint with thousands of users to make tracking impossible',
        'Private browsing mode active by default (wipes history on close)',
        'No accounts, no telemetry, no bloatware',
        'Pre-configured extension blocklist'
      ],
      cons: [
        'No history caching (cannot save logins or sessions between launches)',
        'Forces strict layout box sizes which can look odd on widescreen'
      ],
      comparisonFeatures: {
        'Engine': 'Gecko (Tor-based)',
        'Ad Block': 'Yes (uBlock Origin)',
        'Containers': 'No',
        'Licensing': 'Open Source'
      }
    },
    {
      id: 'tor-browser',
      rank: 4,
      name: 'Tor Browser',
      url: 'https://torproject.org',
      rating: 8.5,
      difficulty: 'advanced',
      tags: ['Onion Routing', 'Anonymous', 'Slow', 'High Privacy'],
      quickRec: '🧅 Best for Anonymity',
      desc: 'The official Tor Browser routes your internet traffic through three separate encryption relays in the global Tor network. This hides your physical location and IP address. Essential for journalists, activists, and accessing onion links.',
      screenshot: '/screenshots/firefox.jpg',
      pros: [
        'Hides your IP address and physical location entirely',
        'Allows access to hidden services (.onion dark web sites)',
        'Highest resistance to state surveillance and active tracking',
        'Fully open-source and managed by a non-profit'
      ],
      cons: [
        'Extremely slow download and load speeds due to multi-layered routing',
        'Many mainstream websites block Tor nodes entirely with Captchas'
      ],
      comparisonFeatures: {
        'Engine': 'Gecko (Tor-focused)',
        'Ad Block': 'Yes (NoScript + HTTPS)',
        'Containers': 'No (Isolated tabs)',
        'Licensing': 'Open Source'
      }
    }
  ],
  'linux': [
    {
      id: 'linux-mint',
      rank: 1,
      name: 'Linux Mint',
      url: 'https://linuxmint.com',
      rating: 9.5,
      difficulty: 'beginner',
      tags: ['User Friendly', 'Windows-like', 'Stable', 'Cinnamon Desktop'],
      quickRec: '🏆 Best for Beginners',
      desc: 'Linux Mint is widely considered the best distribution for newcomers transitioning from Windows or macOS. It features the Cinnamon desktop environment, which layout-wise mimics Windows. Built on Ubuntu\'s stable base, it works out of the box with automatic driver management.',
      screenshot: '/screenshots/linux_mint.jpg',
      pros: [
        'Familiar taskbar, start menu, and desktop interface',
        'Software Manager lists flatpaks and deb packages in one click',
        'Driver Manager automatically downloads proprietary graphics card files',
        'Highly conservative, stable release cycle avoids breakages'
      ],
      cons: [
        'Packages are older due to stability focus (not recommended for bleeding-edge gaming systems)',
        'Desktop theme looks slightly traditional out-of-the-box'
      ],
      comparisonFeatures: {
        'Desktop': 'Cinnamon / MATE / Xfce',
        'Base': 'Ubuntu / Debian',
        'Package System': 'APT / Flatpak',
        'Release Cycle': 'Point Release (6 mo)'
      }
    },
    {
      id: 'ubuntu',
      rank: 2,
      name: 'Ubuntu',
      url: 'https://ubuntu.com',
      rating: 9.0,
      difficulty: 'beginner',
      tags: ['Large Community', 'Corporate-backed', 'GNOME Desktop', 'Driver Support'],
      quickRec: '👥 Best Community Support',
      desc: 'Ubuntu, maintained by Canonical, is the most popular Linux distribution. Almost all Linux software guides target Ubuntu. It features a modern GNOME interface, broad hardware support, and commercial backing. It is a solid foundation for server and developer environments alike.',
      screenshot: '/screenshots/linux_mint.jpg',
      pros: [
        'Massive online help database (AskUbuntu has answers for everything)',
        'Easiest OS setup with hardware manufacturers (Dell, Lenovo)',
        'Excellent enterprise and server infrastructure integration',
        'Active development with frequent updates'
      ],
      cons: [
        'Pushes "Snap" package formats aggressively, which load slower than standard packages',
        'Corporate telemetry gathers system stats (can be disabled)'
      ],
      comparisonFeatures: {
        'Desktop': 'GNOME (Customised)',
        'Base': 'Debian',
        'Package System': 'APT / Snap / Flatpak',
        'Release Cycle': 'Point Release (LTS)'
      }
    },
    {
      id: 'fedora',
      rank: 3,
      name: 'Fedora',
      url: 'https://fedoraproject.org',
      rating: 8.8,
      difficulty: 'intermediate',
      tags: ['Cutting Edge', 'Red Hat-backed', 'Pure GNOME', 'Developer Preferred'],
      quickRec: '💻 Best for Developers',
      desc: 'Fedora is an upstream project backed by Red Hat. It focuses on shipping pure, vanilla open-source software packages without modifications, alongside cutting-edge technologies like Wayland and PipeWire. Ideal for developers who want recent kernels and packages.',
      screenshot: '/screenshots/linux_mint.jpg',
      pros: [
        'Vanilla GNOME provides a clean, distraction-free work environment',
        'Incorporates modern Linux technologies first (Wayland, PipeWire)',
        'Very recent kernels support new laptops and processors',
        'Excellent package security defaults (SELinux)'
      ],
      cons: [
        'Short life cycle (each release supported for 13 months)',
        'Installing proprietary codecs/drivers requires enabling RPM Fusion repositories'
      ],
      comparisonFeatures: {
        'Desktop': 'GNOME (Vanilla)',
        'Base': 'Independent (Red Hat)',
        'Package System': 'DNF / Flatpak',
        'Release Cycle': 'Point Release (6 mo)'
      }
    },
    {
      id: 'arch-linux',
      rank: 4,
      name: 'Arch Linux',
      url: 'https://archlinux.org',
      rating: 8.2,
      difficulty: 'advanced',
      tags: ['DIY installation', 'Rolling Release', 'Lightweight', 'Command Line First'],
      quickRec: '⚡ Best DIY Power User OS',
      desc: 'Arch Linux is a rolling-release distribution built for users who want complete control over their operating system. There is no default desktop environment, app selection, or graphical installer. You construct the OS piece-by-piece using the terminal and the legendary Arch Wiki.',
      screenshot: '/screenshots/linux_mint.jpg',
      pros: [
        'Rolling release model means you update packages daily and never re-install',
        'Arch User Repository (AUR) contains virtually every Linux program in existence',
        'Zero bloat: only software you manually install exists on the drive',
        'Arch Wiki is the best comprehensive documentation in the Linux world'
      ],
      cons: [
        'Command-line-only installer requires understanding partitions and boot loaders',
        'Users must handle configuration updates manually, which can occasionally break boots'
      ],
      comparisonFeatures: {
        'Desktop': 'None (User chooses)',
        'Base': 'Independent',
        'Package System': 'Pacman / AUR',
        'Release Cycle': 'Rolling Release'
      }
    }
  ],
  'finance': [
    {
      id: 'ynab',
      rank: 1,
      name: 'YNAB (You Need A Budget)',
      url: 'https://ynab.com',
      rating: 9.6,
      difficulty: 'intermediate',
      tags: ['Zero-based Budgeting', 'Paid', 'Bank Sync', 'Goal Tracking'],
      quickRec: '🏆 Best for Active Budgeters',
      desc: 'YNAB is built around the "zero-based budgeting" philosophy (give every dollar a job). It focuses on assigning money you *currently have* to categories, rather than predicting future income. Features bank syncing, powerful reports, and mobile access. Highly effective for breaking the paycheck-to-paycheck cycle.',
      screenshot: '/screenshots/ynab.jpg',
      pros: [
        'Zero-based envelopes force conscious spending decisions',
        'Reliable automated bank syncing across thousands of institutions',
        'Excellent goal setting and credit card handling systems',
        'Great educational resources and active community support'
      ],
      cons: [
        'High subscription cost ($109/yr or $15/mo)',
        'Steep initial learning curve to understand zero-based concepts'
      ],
      comparisonFeatures: {
        'Price': '$109/year',
        'Sync': 'Automatic Bank Sync',
        'Platform': 'Web, iOS, Android, Apple Watch',
        'Privacy': 'Cloud storage (Proprietary)'
      }
    },
    {
      id: 'monarch-money',
      rank: 2,
      name: 'Monarch Money',
      url: 'https://monarchmoney.com',
      rating: 9.3,
      difficulty: 'beginner',
      tags: ['Modern UI', 'Paid', 'Multi-account Sync', 'Net Worth Tracker'],
      quickRec: '⚡ Best Modern Dashboard',
      desc: 'Monarch Money is a modern financial dashboard created by the original product manager of Mint. It focuses on high-level net worth tracking, automated transaction categorization, custom dashboards, and collaborative joint accounts for partners.',
      screenshot: '/screenshots/ynab.jpg',
      pros: [
        'Modern, highly polished interface with drag-and-drop widgets',
        'Excellent support for joint accounts and partner sharing at no extra fee',
        'Tracks investments and overall net worth alongside budgets',
        'Allows selecting between multiple bank sync providers (Plaid, Finicity, MX)'
      ],
      cons: [
        'Subscription cost is high ($100/yr)',
        'Budgeting features are traditional (not envelope-style)'
      ],
      comparisonFeatures: {
        'Price': '$100/year',
        'Sync': 'Automatic (Plaid/Finicity)',
        'Platform': 'Web, iOS, Android',
        'Privacy': 'Cloud storage (Proprietary)'
      }
    },
    {
      id: 'actual-budget',
      rank: 3,
      name: 'Actual Budget',
      url: 'https://actualbudget.org',
      rating: 9.0,
      difficulty: 'advanced',
      tags: ['Open Source', 'Self-Hosted', 'Free', 'Local First'],
      quickRec: '🛡️ Best Free & Privacy-First',
      desc: 'Actual Budget is a local-first, open-source budgeting application that operates on the envelope budgeting method (similar to YNAB). It was open-sourced after the creator shut down the commercial product. It runs in the browser, can be self-hosted on a server, and supports end-to-end encryption.',
      screenshot: '/screenshots/ynab.jpg',
      pros: [
        'Fully open-source and free, zero subscriptions',
        'Local-first: database lives on your machine, syncs via optional self-hosted server',
        'Supports end-to-end encryption for cloud backups',
        'Envelope-style budgeting matches YNAB philosophy'
      ],
      cons: [
        'Self-hosting (e.g. Fly.io, Docker) requires technical expertise',
        'Bank syncing requires setting up manual CSV imports or paying for GoCardless/SimpleFin'
      ],
      comparisonFeatures: {
        'Price': 'Free (Self-Hosted)',
        'Sync': 'Manual / SimpleFin (Paid addon)',
        'Platform': 'Web, Android (PWA), iOS (PWA)',
        'Privacy': '100% End-to-End Encrypted'
      }
    },
    {
      id: 'excel-sheets',
      rank: 4,
      name: 'Excel / Google Sheets',
      url: 'https://docs.google.com/spreadsheets',
      rating: 8.0,
      difficulty: 'advanced',
      tags: ['Infinite Customization', 'Free', 'Offline-capable', 'DIY'],
      quickRec: '📊 Best for DIY Control',
      desc: 'Spreadsheets are the ultimate flexible canvas. You can build your own custom templates, calculate cash flows, and plot charts without any vendor lock-in or subscription costs. Popular templates like Aspire Budget offer full YNAB-like features built entirely in Sheets.',
      screenshot: '/screenshots/ynab.jpg',
      pros: [
        'Infinite flexibility: if you can write a formula, you can build it',
        '100% free and ownership over your raw CSV files',
        'Works offline and requires zero internet connection (Excel)',
        'No concern about services shutting down or raising rates'
      ],
      cons: [
        'Requires manual entry for every single transaction (unless using paid plugins)',
        'Very easy to break cell references and formulas by mistake'
      ],
      comparisonFeatures: {
        'Price': 'Free / MS 365 License',
        'Sync': 'Manual CSV / Tiller Sync (Paid)',
        'Platform': 'Web, Desktop, iOS, Android',
        'Privacy': 'Local File / Google Drive'
      }
    }
  ]
}

// Compute active tools based on search and filters
const activeTools = computed(() => {
  return toolsData[activeCategoryKey.value] || []
})

// Get available filter tags for active category
const availableFilterTags = computed(() => {
  const tags = new Set()
  activeTools.value.forEach(t => {
    t.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags)
})

// Reset filters when changing category or when empty
function resetFilters() {
  searchQuery.value = ''
  selectedFilters.value = []
}

// Handle select category
function selectCategory(key) {
  activeCategoryKey.value = key
  resetFilters()
}

// Toggle filters
function toggleFilter(tag) {
  const index = selectedFilters.value.indexOf(tag)
  if (index > -1) {
    selectedFilters.value.splice(index, 1)
  } else {
    selectedFilters.value.push(tag)
  }
}

// Filtered and sorted tools
const filteredTools = computed(() => {
  let list = [...activeTools.value]

  // Filter by search query
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.desc.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q)) ||
      Object.values(t.comparisonFeatures).some(val => val.toLowerCase().includes(q))
    )
  }

  // Filter by tags
  if (selectedFilters.value.length > 0) {
    list = list.filter(t => 
      selectedFilters.value.every(tag => t.tags.includes(tag))
    )
  }

  // Sort tools
  if (sortBy.value === 'rank') {
    list.sort((a, b) => a.rank - b.rank)
  } else if (sortBy.value === 'rating') {
    list.sort((a, b) => b.rating - a.rating)
  } else if (sortBy.value === 'difficulty') {
    const diffWeight = { beginner: 1, intermediate: 2, advanced: 3 }
    list.sort((a, b) => diffWeight[a.difficulty] - diffWeight[b.difficulty])
  }

  return list
})

// Quick recommendations for current category
const quickRecommendations = computed(() => {
  return activeTools.value.filter(t => t.quickRec)
})

// Compare feature headers
const comparisonFeatureKeys = computed(() => {
  if (activeTools.value.length === 0) return []
  return Object.keys(activeTools.value[0].comparisonFeatures)
})

// Initialise selected tool
watch(filteredTools, (newVal) => {
  if (newVal.length > 0) {
    // Keep selection if still in filtered list, otherwise pick first
    if (!selectedTool.value || !newVal.some(t => t.id === selectedTool.value.id)) {
      selectedTool.value = newVal[0]
    }
  } else {
    selectedTool.value = null
  }
}, { immediate: true })

// Helper to select from quick recommendations
function selectToolById(id) {
  const tool = activeTools.value.find(t => t.id === id)
  if (tool) {
    selectedTool.value = tool
    if (isMobile.value) {
      isMobileDetailOpen.value = true
    }
  }
}

// Feature cell classes for color highlighting
function getFeatureClass(val) {
  const lower = String(val).toLowerCase()
  if (lower === 'yes' || lower.includes('free') && !lower.includes('paid')) {
    return 'feature-positive'
  }
  if (lower === 'no' || lower === 'cloud only' || lower === 'poor') {
    return 'feature-negative'
  }
  if (lower.includes('local') || lower.includes('encrypted')) {
    return 'feature-info'
  }
  return 'feature-neutral'
}

// Truncate desc helper
function truncate(text, length) {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

// Mobile check & modal logic
function checkMobile() {
  isMobile.value = window.innerWidth <= 768
}

watch(selectedTool, (newVal) => {
  if (newVal && isMobile.value) {
    // In mobile, selection triggers drawer
    isMobileDetailOpen.value = true
  }
})

function closeMobileDetail() {
  isMobileDetailOpen.value = false
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.smart-hub {
  font-family: var(--vp-font-family-base);
  color: var(--vp-c-text-1);
  margin: var(--space-2xl) 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

/* Category Selector */
.category-selector-container {
  background: var(--vp-c-bg-soft);
  padding: var(--space-lg);
  border-radius: var(--radius-2xl);
  border: 1px solid var(--vp-c-divider-light);
}

.selector-label {
  font-weight: 600;
  margin: 0 0 var(--space-md) 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.category-pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.cat-pill {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: 0.6rem var(--space-lg);
  border-radius: 99px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.cat-pill:hover {
  background: var(--vp-c-bg-soft-up);
  color: var(--vp-c-text-1);
  transform: translateY(-1px);
}

.cat-pill.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}

/* Hub Header */
.hub-header h2 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.hub-subtitle {
  margin: var(--space-xs) 0 0 0;
  color: var(--vp-c-text-2);
  font-size: 1rem;
}

/* Hub Controls */
.hub-controls {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  background: var(--vp-c-bg-elv);
  padding: var(--space-lg);
  border-radius: var(--radius-xl);
  border: 1px solid var(--vp-c-divider-light);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: var(--vp-c-text-3);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.8rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  transition: all var(--transition-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-elv);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.clear-search {
  position: absolute;
  right: 14px;
  border: none;
  background: transparent;
  font-size: 1.4rem;
  color: var(--vp-c-text-3);
  cursor: pointer;
}

.filter-sort-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-md);
}

.tag-filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.tag-pill {
  padding: 0.35rem var(--space-md);
  border-radius: var(--radius-sm);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider-light);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tag-pill:hover {
  background: var(--vp-c-bg-soft-up);
}

.tag-pill.active {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.sort-select {
  padding: 0.4rem var(--space-md);
  border-radius: var(--radius-sm);
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
}

.sort-select:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

/* Tabs Navigation */
.tabs-navigation {
  display: flex;
  border-bottom: 2px solid var(--vp-c-divider-light);
  gap: var(--space-lg);
}

.nav-tab {
  padding: 0.8rem 0;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--vp-c-text-2);
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-bottom: -2px;
}

.nav-tab:hover {
  color: var(--vp-c-text-1);
}

.nav-tab.active {
  color: var(--vp-c-brand-1);
  border-bottom-color: var(--vp-c-brand-1);
}

/* Quick Recommendations */
.rec-section-title {
  margin: 0 0 var(--space-md) 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.rec-card {
  background: linear-gradient(135deg, var(--vp-c-bg-soft) 0%, var(--vp-c-bg-elv) 100%);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.rec-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(74, 124, 72, 0.08);
  border-color: var(--vp-c-brand-1);
}

.rec-badge {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-xs);
  text-transform: uppercase;
  margin-bottom: var(--space-sm);
  letter-spacing: 0.02em;
}

.rec-card h4 {
  margin: 0 0 var(--space-xs) 0;
  font-size: 1rem;
  font-weight: 700;
}

.rec-card p {
  margin: 0 0 var(--space-md) 0;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}

.view-detail-link {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

/* Split View Layout */
.split-view {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--space-xl);
  align-items: start;
}

@media (max-width: 768px) {
  .split-view {
    grid-template-columns: 1fr;
  }
  .tool-detail-panel {
    display: none !important;
  }
}

/* Tools List */
.tools-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.tool-list-card {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider-light);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.tool-list-card:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
  transform: translateX(2px);
}

.tool-list-card.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  box-shadow: 0 0 0 2px var(--vp-c-brand-1);
}

.tool-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tool-rank {
  font-weight: 800;
  font-size: 1.1rem;
  color: var(--vp-c-brand-1);
}

.tool-rating-badge {
  font-weight: 700;
  font-size: 0.8rem;
  background: rgba(243, 156, 18, 0.12);
  color: #f39c12;
  padding: 0.15rem 0.4rem;
  border-radius: var(--radius-xs);
}

.tool-name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.tool-desc-short {
  margin: 0;
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}

.tool-list-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-xs);
  border-top: 1px dashed var(--vp-c-divider-light);
  padding-top: var(--space-sm);
}

.diff-badge {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.15rem 0.4rem;
  border-radius: var(--radius-xs);
}

.diff-beginner {
  background: rgba(46, 204, 113, 0.12);
  color: #2ecc71;
}

.diff-intermediate {
  background: rgba(243, 156, 18, 0.12);
  color: #f39c12;
}

.diff-advanced {
  background: rgba(231, 76, 60, 0.12);
  color: #e74c3c;
}

.tool-tags-mini {
  display: flex;
  gap: var(--space-xs);
}

.mini-tag {
  font-size: 0.72rem;
  background: var(--vp-c-bg-soft-up);
  color: var(--vp-c-text-2);
  padding: 0.1rem 0.35rem;
  border-radius: var(--radius-xs);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--space-2xl) var(--space-lg);
  border: 2px dashed var(--vp-c-divider-light);
  border-radius: var(--radius-xl);
  color: var(--vp-c-text-3);
}

.reset-btn {
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  padding: 0.5rem var(--space-lg);
  border-radius: var(--radius-md);
  cursor: pointer;
  margin-top: var(--space-md);
}

/* Tool Detail Panel (Desktop sticky layout) */
.tool-detail-panel {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-elv);
  border-radius: var(--radius-2xl);
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
}

.detail-scroll-container {
  overflow-y: auto;
  padding: var(--space-2xl);
}

.detail-header {
  margin-bottom: var(--space-lg);
}

.detail-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xs);
}

.detail-rank {
  font-weight: 800;
  font-size: 0.85rem;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
  letter-spacing: 0.05em;
}

.detail-rating {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.detail-name {
  margin: 0 0 var(--space-xs) 0;
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.detail-rec-banner {
  margin: 0;
  display: inline-block;
  background: var(--vp-c-brand-soft);
  border: 1px solid var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  font-weight: 700;
  font-size: 0.8rem;
  padding: 0.25rem var(--space-md);
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

/* Screenshot Mockup styling */
.detail-screenshot-container {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--vp-c-divider-light);
  margin-bottom: var(--space-lg);
  aspect-ratio: 16/9;
  background: #000;
}

.detail-screenshot {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.screenshot-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  padding: var(--space-sm) var(--space-md);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  text-align: center;
  font-weight: 500;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.detail-meta-row {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
  border-bottom: 1px solid var(--vp-c-divider-light);
  padding-bottom: var(--space-lg);
}

.difficulty-tag {
  align-self: flex-start;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
}

.difficulty-tag.diff-beginner {
  background: rgba(46, 204, 113, 0.12);
  color: #2ecc71;
}

.difficulty-tag.diff-intermediate {
  background: rgba(243, 156, 18, 0.12);
  color: #f39c12;
}

.difficulty-tag.diff-advanced {
  background: rgba(231, 76, 60, 0.12);
  color: #e74c3c;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.detail-tag-badge {
  font-size: 0.75rem;
  font-weight: 500;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--vp-c-divider-light);
}

.detail-desc {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.detail-section {
  margin-bottom: var(--space-xl);
}

.pros-cons-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  border-top: 1px solid var(--vp-c-divider-light);
  padding-top: var(--space-xl);
}

@media (max-width: 900px) {
  .pros-cons-section {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
}

.pc-title {
  margin: 0 0 var(--space-md) 0;
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
}

.pro-title {
  color: #2ecc71;
}

.con-title {
  color: #e74c3c;
}

.pro-column ul,
.con-column ul {
  padding-left: 1.2rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.pro-column li,
.con-column li {
  font-size: 0.85rem;
  line-height: 1.4;
  color: var(--vp-c-text-2);
}

/* Detail Specs */
.detail-specs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
  background: var(--vp-c-bg-soft);
  padding: var(--space-lg);
  border-radius: var(--radius-xl);
  border: 1px solid var(--vp-c-divider-light);
  margin-top: var(--space-xl);
}

.spec-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.spec-label {
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.spec-value {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

/* Detail Visit Link Button */
.detail-actions {
  margin-top: var(--space-xl);
  display: flex;
}

.visit-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  background: var(--vp-c-brand-1);
  color: white;
  padding: 0.8rem 1.6rem;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none !important;
  transition: all var(--transition-base);
  box-shadow: 0 4px 14px var(--vp-c-brand-soft);
}

.visit-btn:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 124, 72, 0.25);
  color: white !important;
}

.btn-icon {
  width: 16px;
  height: 16px;
}

/* Comparison Matrix Styling */
.matrix-table-wrapper {
  overflow-x: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-xl);
  background: var(--vp-c-bg-elv);
}

.matrix-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.88rem;
}

.matrix-table th {
  background: var(--vp-c-bg-soft);
  padding: 1rem var(--space-lg);
  font-weight: 700;
  border-bottom: 2px solid var(--vp-c-divider-light);
  color: var(--vp-c-text-2);
}

.matrix-table td {
  padding: 1rem var(--space-lg);
  border-bottom: 1px solid var(--vp-c-divider-light);
  color: var(--vp-c-text-1);
}

.td-name-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.td-quick-rec {
  align-self: flex-start;
  font-size: 0.65rem;
  font-weight: 700;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  padding: 0.05rem 0.35rem;
  border-radius: 4px;
  text-transform: uppercase;
}

.matrix-rank {
  font-weight: 800;
  color: var(--vp-c-brand-1);
}

.matrix-rating {
  font-weight: 700;
  color: #f39c12;
}

/* Cell highlight colors */
.feature-val {
  font-weight: 500;
  font-size: 0.8rem;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
}

.feature-positive {
  background: rgba(46, 204, 113, 0.12);
  color: #27ae60;
}

.feature-negative {
  background: rgba(231, 76, 60, 0.12);
  color: #c0392b;
}

.feature-info {
  background: rgba(52, 152, 219, 0.12);
  color: #2980b9;
}

.feature-neutral {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

.matrix-link-btn {
  display: inline-block;
  padding: 0.3rem var(--space-md);
  border-radius: var(--radius-sm);
  border: 1px solid var(--vp-c-brand-1);
  color: var(--vp-c-brand-1) !important;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none !important;
  transition: all var(--transition-fast);
}

.matrix-link-btn:hover {
  background: var(--vp-c-brand-1);
  color: white !important;
}

/* Pros Cons Tab */
.proscons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-lg);
}

.pc-grid-card {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider-light);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  box-shadow: 0 4px 16px rgba(0,0,0,0.01);
}

.pc-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--vp-c-divider-light);
  padding-bottom: var(--space-sm);
}

.pc-card-header h4 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
}

.pc-card-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.pc-column h5 {
  margin: 0 0 var(--space-xs) 0;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
}

.pc-column ul {
  padding-left: 1.1rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.pc-column li {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  line-height: 1.35;
}

/* Mobile Detail Drawer Drawer */
.mobile-drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}

.mobile-drawer-content {
  width: 100%;
  max-height: 85%;
  background: var(--vp-c-bg);
  border-top-left-radius: var(--radius-2xl);
  border-top-right-radius: var(--radius-2xl);
  padding: var(--space-xl);
  position: relative;
  display: flex;
  flex-direction: column;
}

.close-drawer-btn {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  border: none;
  background: transparent;
  font-size: 2rem;
  line-height: 1;
  color: var(--vp-c-text-3);
  cursor: pointer;
  padding: var(--space-xs);
  z-index: 10;
}

.drawer-scroll {
  overflow-y: auto;
  margin-top: var(--space-md);
}
</style>
