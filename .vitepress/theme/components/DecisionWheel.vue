<template>
  <div class="dw-container">
    <div class="dw-card">
      <canvas ref="canvas" class="dw-canvas" :width="size" :height="size" />

      <button class="dw-spin-btn" @click="spin" :disabled="spinning || items.length < 2">
        {{ spinning ? 'Spinning...' : 'Spin!' }}
      </button>

      <div v-if="result" class="dw-result">
        Result: <strong>{{ result }}</strong>
      </div>

      <div class="dw-inputs">
        <label class="dw-label">Options (one per line):</label>
        <textarea
          v-model="textInput"
          class="dw-textarea"
          rows="4"
          placeholder="Pizza&#10;Sushi&#10;Tacos"
          @input="parseItems"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const canvas = ref(null)
const items = ref([])
const textInput = ref('Pizza\nSushi\nTacos\nBurgers')
const spinning = ref(false)
const result = ref('')
const size = 300

const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#e84393', '#00b894']

function parseItems() {
  items.value = textInput.value.split('\n').map(s => s.trim()).filter(Boolean)
  result.value = ''
  drawWheel(0)
}

function drawWheel(rotation) {
  const el = canvas.value
  if (!el) return
  const ctx = el.getContext('2d')
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 10
  const n = items.value.length

  ctx.clearRect(0, 0, size, size)

  if (n === 0) {
    ctx.fillStyle = '#ddd'
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fill()
    return
  }

  const slice = (Math.PI * 2) / n

  for (let i = 0; i < n; i++) {
    const start = rotation + i * slice
    const end = start + slice

    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, r, start, end)
    ctx.closePath()
    ctx.fillStyle = colors[i % colors.length]
    ctx.fill()

    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.stroke()

    const mid = start + slice / 2
    const tx = cx + Math.cos(mid) * r * 0.6
    const ty = cy + Math.sin(mid) * r * 0.6

    ctx.fillStyle = '#fff'
    ctx.font = 'bold 12px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(items.value[i].substring(0, 8), tx, ty)
  }

  // Pointer
  ctx.beginPath()
  ctx.moveTo(cx + r + 8, cy)
  ctx.lineTo(cx + r - 5, cy - 8)
  ctx.lineTo(cx + r - 5, cy + 8)
  ctx.closePath()
  ctx.fillStyle = '#333'
  ctx.fill()
}

function spin() {
  if (spinning.value || items.value.length < 2) return
  spinning.value = true
  result.value = ''

  const spins = 5 + Math.random() * 5
  const stopAngle = Math.random() * Math.PI * 2
  const totalRotation = spins * Math.PI * 2 + stopAngle
  const duration = 3000
  const startTime = performance.now()
  const startRotation = 0

  function animate(time) {
    const elapsed = time - startTime
    const progress = Math.min(elapsed / duration, 1)
    const ease = 1 - Math.pow(1 - progress, 3)
    const currentRotation = startRotation + totalRotation * ease

    drawWheel(currentRotation)

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      const n = items.value.length
      const slice = (Math.PI * 2) / n
      const normalized = (((currentRotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2))
      const idx = Math.floor(((Math.PI * 2 - normalized + slice / 2) % (Math.PI * 2)) / slice) % n
      result.value = items.value[idx]
      spinning.value = false
    }
  }

  requestAnimationFrame(animate)
}

onMounted(() => {
  parseItems()
})
</script>

<style scoped>
.dw-container {
  max-width: 400px;
  margin: 2rem auto;
  text-align: center;
}

.dw-card {
  padding: 1.5rem;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.dw-canvas {
  display: block;
  margin: 0 auto 1rem;
  border-radius: 50%;
  max-width: 100%;
  height: auto;
}

.dw-spin-btn {
  padding: 0.7rem 2rem;
  border-radius: 50px;
  border: none;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}

.dw-spin-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  opacity: 0.9;
}

.dw-spin-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dw-result {
  margin: 1rem 0;
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
}

.dw-result strong {
  color: var(--vp-c-brand-1);
}

.dw-inputs {
  margin-top: 1rem;
  text-align: left;
}

.dw-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: var(--vp-c-text-1);
}

.dw-textarea {
  width: 100%;
  padding: 0.65rem;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  resize: vertical;
  box-sizing: border-box;
}

.dw-textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}
</style>
