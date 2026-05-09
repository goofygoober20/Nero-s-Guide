<template>
  <div class="settings-panel">
    <h2>Appearance</h2>
    
    <div class="setting-group">
      <label>Light/Dark Mode</label>
      <select v-model="settings.theme" @change="saveSettings">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System Default</option>
      </select>
    </div>

    <div class="setting-group">
      <label>Theme Style</label>
      <select v-model="settings.themeStyle" @change="saveSettings">
        <option value="default">Default (VitePress)</option>
        <option value="ocean">Ocean Blue</option>
        <option value="forest">Forest Green</option>
        <option value="sunset">Sunset Orange</option>
        <option value="midnight">Midnight Purple</option>
        <option value="mono">Monochrome</option>
      </select>
    </div>

    <div class="setting-group">
      <label>Font Size</label>
      <select v-model="settings.fontSize" @change="saveSettings">
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>
    </div>

    <h2>Content</h2>
    
    <div class="setting-group">
      <label class="checkbox">
        <input type="checkbox" v-model="settings.showNSFW" @change="saveSettings">
        Show NSFW content
      </label>
    </div>

    <div class="setting-group">
      <label>External Links</label>
      <select v-model="settings.externalLinks" @change="saveSettings">
        <option value="new-tab">Open in new tab</option>
        <option value="same-tab">Open in same tab</option>
      </select>
    </div>

    <h2>Privacy</h2>
    
    <div class="setting-group">
      <button @click="resetSettings" class="danger-btn">Reset All Settings</button>
      <button @click="exportSettings" class="secondary-btn">Export Settings</button>
    </div>

    <div class="status" v-if="savedMessage">
      {{ savedMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const settings = ref({
  theme: 'system',
  themeStyle: 'default',
  fontSize: 'medium',
  showNSFW: false,
  externalLinks: 'new-tab'
})

const savedMessage = ref('')

// Load saved settings when page loads
onMounted(() => {
  const saved = localStorage.getItem('neros-guide-settings')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      settings.value = { ...settings.value, ...parsed }
    } catch(e) {
      console.error('Failed to load settings', e)
    }
  }
  applySettings()
})

function saveSettings() {
  localStorage.setItem('neros-guide-settings', JSON.stringify(settings.value))
  applySettings()
  
  savedMessage.value = 'Settings saved!'
  setTimeout(() => {
    savedMessage.value = ''
  }, 2000)
}

function applySettings() {
  // Apply dark/light theme
  if (settings.value.theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else if (settings.value.theme === 'light') {
    document.documentElement.classList.remove('dark')
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  // Apply theme style
  document.documentElement.setAttribute('data-theme-style', settings.value.themeStyle)
  
  // Apply font size
  let fontSize = '16px'
  if (settings.value.fontSize === 'small') fontSize = '14px'
  if (settings.value.fontSize === 'large') fontSize = '18px'
  document.documentElement.style.fontSize = fontSize
}

function resetSettings() {
  if (confirm('Reset all settings to default?')) {
    settings.value = {
      theme: 'system',
      themeStyle: 'default',
      fontSize: 'medium',
      showNSFW: false,
      externalLinks: 'new-tab'
    }
    saveSettings()
  }
}

function exportSettings() {
  const dataStr = JSON.stringify(settings.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'neros-guide-settings.json'
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.settings-panel {
  max-width: 600px;
  margin: 0 auto;
}

.setting-group {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}

label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
}

select {
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox input {
  width: auto;
  cursor: pointer;
}

button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  margin-right: 0.5rem;
  font-size: 0.9rem;
}

.danger-btn {
  background: #dc2626;
  color: white;
}

.danger-btn:hover {
  background: #b91c1c;
}

.secondary-btn {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.secondary-btn:hover {
  background: var(--vp-c-bg-soft);
}

.status {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--vp-c-green-soft);
  color: var(--vp-c-green-1);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  animation: fadeInOut 2s ease;
}

@keyframes fadeInOut {
  0% { opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; }
}

h2 {
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

/* Theme Styles - Ocean */
[data-theme-style="ocean"] {
  --vp-c-brand-1: #00b4d8;
  --vp-c-brand-2: #0077b6;
  --vp-c-brand-soft: rgba(0, 180, 216, 0.16);
  --vp-c-bg: #e0fbfc;
  --vp-c-bg-soft: #caf0f8;
  --vp-c-text-1: #03045e;
}

/* Theme Styles - Forest */
[data-theme-style="forest"] {
  --vp-c-brand-1: #2d6a4f;
  --vp-c-brand-2: #1b4332;
  --vp-c-brand-soft: rgba(45, 106, 79, 0.16);
  --vp-c-bg: #d8f3dc;
  --vp-c-bg-soft: #b7e4c7;
  --vp-c-text-1: #081c15;
}

/* Theme Styles - Sunset */
[data-theme-style="sunset"] {
  --vp-c-brand-1: #e85d04;
  --vp-c-brand-2: #dc2f02;
  --vp-c-brand-soft: rgba(232, 93, 4, 0.16);
  --vp-c-bg: #fff3b0;
  --vp-c-bg-soft: #ffea9e;
  --vp-c-text-1: #370617;
}

/* Theme Styles - Midnight */
[data-theme-style="midnight"] {
  --vp-c-brand-1: #9d4edd;
  --vp-c-brand-2: #7b2cbf;
  --vp-c-brand-soft: rgba(157, 78, 221, 0.16);
  --vp-c-bg: #10002b;
  --vp-c-bg-soft: #240046;
  --vp-c-text-1: #e0aaff;
}

/* Theme Styles - Monochrome */
[data-theme-style="mono"] {
  --vp-c-brand-1: #6c757d;
  --vp-c-brand-2: #495057;
  --vp-c-brand-soft: rgba(108, 117, 125, 0.16);
  --vp-c-bg: #f8f9fa;
  --vp-c-bg-soft: #e9ecef;
  --vp-c-text-1: #212529;
}
</style>