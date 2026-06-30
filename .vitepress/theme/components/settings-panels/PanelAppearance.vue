<template>
  <div class="glass-panel">
    <h2 class="panel-title">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-1 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-5.5-4.5-10-10-10Z"/></svg>
      Appearance
    </h2>

    <div class="divider"></div>

    <div class="field">
      <span>Theme Mode</span>
      <select v-model="settings.theme" @change="saveSettings">
        <option value="system">System Default</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>

    <div class="field">
      <span>Font Size</span>
      <select v-model="settings.fontSize" @change="saveSettings">
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>
    </div>

    <div class="divider"></div>

    <div class="field">
      <span>Background Level</span>
      <div class="range-row">
        <span class="range-label">Dark</span>
        <input type="range" min="0" max="100" v-model.number="settings.bgLevel" @input="saveSettings" class="bg-slider" />
        <span class="range-label">Light</span>
      </div>
    </div>

    <div class="divider"></div>

    <div class="field">
      <span>Guide Card Style</span>
      <div class="card-style-options">
        <button
          v-for="style in cardStyles"
          :key="style.id"
          class="card-style-btn"
          :class="{ active: settings.cardStyle === style.id }"
          @click="settings.cardStyle = style.id; saveSettings()"
        >
          <span class="card-style-preview" :class="'preview-' + style.id"></span>
          <span class="card-style-label">{{ style.label }}</span>
        </button>
      </div>
      <button
        v-if="settings.cardStyle !== 'none'"
        class="card-style-reset"
        @click="settings.cardStyle = 'none'; saveSettings()"
      >
        Reset Cards
      </button>
    </div>

    <div class="divider"></div>

    <div class="field">
      <span>Accent Color</span>
      <div class="swatches-grid">
        <button
          v-for="c in colors"
          :key="c.id"
          class="swatch-card"
          :class="{ active: settings.accentTheme === c.id }"
          :title="c.label"
          :aria-label="`Use ${c.label} accent color`"
          :aria-pressed="settings.accentTheme === c.id"
          @click="settings.accentTheme = c.id; saveSettings()"
        >
          <span class="swatch-circle" :style="{ backgroundColor: c.color }">
            <span v-if="settings.accentTheme === c.id" class="swatch-check">✓</span>
          </span>
          <span class="swatch-label">{{ c.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  settings: Object,
  saveSettings: Function
})

const cardStyles = ref([
  { id: 'none',           label: 'None' },
  { id: 'gradients',      label: 'Gradient Borders' },
  { id: 'background',     label: 'Background Wash' },
  { id: 'left-accent',    label: 'Left Accent' },
  { id: 'top-stripe',     label: 'Top Stripe' },
  { id: 'icon-halo',      label: 'Icon Halo' },
  { id: 'corner-ribbon',  label: 'Corner Ribbon' },
  { id: 'border-pulse',   label: 'Border Pulse' },
  { id: 'glass-tint',     label: 'Glass Tint' },
])

const colors = ref([
  { id: 'red',     label: 'Red',     color: '#e06c6c' },
  { id: 'rose',    label: 'Rose',    color: '#e91e63' },
  { id: 'coral',   label: 'Coral',   color: '#ff7f50' },
  { id: 'orange',  label: 'Orange',  color: '#e67e22' },
  { id: 'amber',   label: 'Amber',   color: '#ffc107' },
  { id: 'gold',    label: 'Gold',    color: '#d4a017' },
  { id: 'yellow',  label: 'Yellow',  color: '#f1c40f' },
  { id: 'lime',    label: 'Lime',    color: '#8bc34a' },
  { id: 'green',   label: 'Green',   color: '#71AD70' },
  { id: 'mint',    label: 'Mint',    color: '#4db6ac' },
  { id: 'teal',    label: 'Teal',    color: '#00bcd4' },
  { id: 'cyan',    label: 'Cyan',    color: '#26c6da' },
  { id: 'blue',    label: 'Blue',    color: '#5b9bd5' },
  { id: 'indigo',  label: 'Indigo',  color: '#5c6bc0' },
  { id: 'navy',    label: 'Navy',    color: '#4a6fa5' },
  { id: 'purple',  label: 'Purple',  color: '#a66cff' },
  { id: 'pink',    label: 'Pink',    color: '#e84393' },
  { id: 'grey',    label: 'Grey',    color: '#95a5a6' },
  { id: 'brown',   label: 'Brown',   color: '#a1887f' },
  { id: 'white',   label: 'White',   color: '#e0e0e0' },
])
</script>

<style scoped>
.glass-panel {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.15);
  backdrop-filter: blur(22px) saturate(140%);
  border-radius: 20px;
  padding: 1.6rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
  transition: 0.25s ease;
}

.glass-panel:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.35);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
}

.panel-title i {
  font-size: 1.2rem;
  opacity: 0.85;
}

.divider {
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(255,255,255,0.25),
    transparent
  );
  margin: 1rem 0 1.4rem;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.2rem;
}

.field span {
  opacity: 0.8;
  margin-bottom: 0.3rem;
}

select {
  padding: 0.6rem;
  border-radius: 10px;
  background: rgba(255,255,255,0.15);
  border: 1px solid var(--vp-c-divider);
  backdrop-filter: blur(10px);
}

.range-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.range-label {
  font-size: 0.75rem;
  opacity: 0.6;
  white-space: nowrap;
}

.bg-slider {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  border-radius: 3px;
  background: var(--vp-c-divider);
  outline: none;
  cursor: pointer;
}

.bg-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  border: 2px solid var(--vp-c-bg);
  cursor: pointer;
  transition: transform 0.2s;
}

.bg-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

.bg-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  border: 2px solid var(--vp-c-bg);
  cursor: pointer;
}

.swatches-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.swatch-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.25rem;
  border-radius: 10px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.swatch-card:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
}

.swatch-card.active {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-brand-1);
}

.swatch-circle {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  flex-shrink: 0;
}

.swatch-card:hover .swatch-circle {
  transform: scale(1.12);
}

.swatch-card.active .swatch-circle {
  transform: scale(1.08);
  box-shadow: 0 0 0 2px var(--vp-c-bg), 0 0 0 3px currentColor;
}

.swatch-check {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

.swatch-label {
  font-size: 0.6rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  text-align: center;
  line-height: 1.1;
  transition: color 0.2s ease;
}

.swatch-card.active .swatch-label {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.swatch-card:hover .swatch-label {
  color: var(--vp-c-text-2);
}

.card-style-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.card-style-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.25rem;
  border-radius: 10px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.card-style-btn:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
}

.card-style-btn.active {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-brand-1);
}

.card-style-preview {
  width: 100%;
  height: 2rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.2s ease;
}

.preview-none {
  background: var(--vp-c-bg-soft);
}

.preview-gradients {
  background: var(--vp-c-bg-soft);
  border: 2px solid transparent;
  background-image: linear-gradient(var(--vp-c-bg-soft), var(--vp-c-bg-soft)), linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  background-origin: border-box;
  background-clip: padding-box, border-box;
}

.preview-background {
  background: var(--vp-c-bg-soft);
  position: relative;
}
.preview-background::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--vp-c-brand-1);
  opacity: 0.1;
  border-radius: 4px;
}

.preview-left-accent {
  background: var(--vp-c-bg-soft);
  border-left: 3px solid var(--vp-c-brand-1);
}

.preview-top-stripe {
  background: var(--vp-c-bg-soft);
  border-top: 3px solid var(--vp-c-brand-1);
}

.preview-icon-halo {
  background: var(--vp-c-bg-soft);
  position: relative;
}
.preview-icon-halo::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 30%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid var(--vp-c-brand-1);
  opacity: 0.5;
}

.preview-corner-ribbon {
  background: var(--vp-c-bg-soft);
  position: relative;
  overflow: hidden;
}
.preview-corner-ribbon::after {
  content: '';
  position: absolute;
  top: -1px;
  right: -1px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 14px 14px 0;
  border-color: transparent var(--vp-c-brand-1) transparent transparent;
}

.preview-border-pulse {
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-brand-1);
  opacity: 0.8;
}

.preview-glass-tint {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  position: relative;
}
.preview-glass-tint::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--vp-c-brand-1);
  opacity: 0.08;
  border-radius: 4px;
}

.card-style-label {
  font-size: 0.6rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}

.card-style-btn.active .card-style-label {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.card-style-reset {
  margin-top: 0.6rem;
  padding: 0.45rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: var(--vp-c-text-2);
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.card-style-reset:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
</style>
