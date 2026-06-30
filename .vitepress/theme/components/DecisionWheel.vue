<template>
  <div class="dw-container">
    <!-- Header -->
    <div class="dw-header">
      <span class="dw-icon">🎡</span>
      <h3 class="dw-title">Wheel Spinner</h3>
    </div>

    <!-- Canvas wrapper with pointer -->
    <div class="dw-canvas-wrapper">
      <div class="dw-pointer">▼</div>
      <canvas ref="canvas" class="dw-canvas" :width="size" :height="size" />
    </div>

    <!-- Spin button -->
    <button class="dw-spin-btn" @click="spin" :disabled="spinning || items.length < 2">
      <span v-if="spinning" class="btn-spinner">⏳</span>
      <span v-else>🎯 Spin!</span>
    </button>

    <!-- Result display -->
    <Transition name="bounce-result">
      <div v-if="result" class="dw-result">
        <span class="dw-result-label">🎉 Winner</span>
        <span class="dw-result-text">{{ result }}</span>
      </div>
    </Transition>

    <!-- Options input -->
    <div class="dw-inputs">
      <label class="dw-label">Options (one per line)</label>
      <textarea
        v-model="textInput"
        class="dw-textarea"
        rows="4"
        placeholder="Pizza&#10;Sushi&#10;Tacos"
        @input="parseItems"
      />
      <div class="dw-item-count" v-if="items.length > 0">
        {{ items.length }} option{{ items.length > 1 ? 's' : '' }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WheelSpinner',
  data() {
    return {
      items: [],
      textInput: 'Pizza\nSushi\nTacos\nBurgers',
      spinning: false,
      result: '',
      size: 300,
      colors: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#e84393', '#00b894'],
      rotation: 0,
      animationId: null,
    }
  },
  computed: {
    is42() {
      return this.result === '42'
    },
    itemCount() {
      return this.items.length
    }
  },
  watch: {
    items() {
      this.result = ''
      this.drawWheel(this.rotation)
    },
    result(val) {
      if (val === '42') this.show42Popup()
    }
  },
  mounted() {
    this.parseItems()
    document.addEventListener('keydown', this.handleKeydown)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydown)
    if (this.animationId) cancelAnimationFrame(this.animationId)
  },
  methods: {
    handleKeydown(e) {
      if (e.code === 'Space' && !this.spinning && this.items.length >= 2) {
        e.preventDefault()
        this.spin()
      }
    },
    parseItems() {
      this.items = this.textInput.split('\n').map(s => s.trim()).filter(Boolean)
      this.result = ''
      this.rotation = 0
      this.drawWheel(0)
    },
    drawWheel(rotation) {
      const el = this.$refs.canvas
      if (!el) return
      const ctx = el.getContext('2d')
      const cx = this.size / 2
      const cy = this.size / 2
      const r = this.size / 2 - 10
      const n = this.items.length

      ctx.clearRect(0, 0, this.size, this.size)

      if (n === 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.05)'
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = 'rgba(255,255,255,0.2)'
        ctx.font = '14px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('Add options', cx, cy)
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
        ctx.fillStyle = this.colors[i % this.colors.length]
        ctx.fill()

        ctx.shadowColor = 'rgba(0,0,0,0.1)'
        ctx.shadowBlur = 6
        ctx.strokeStyle = 'rgba(255,255,255,0.3)'
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.shadowBlur = 0

        const mid = start + slice / 2
        const tx = cx + Math.cos(mid) * r * 0.65
        const ty = cy + Math.sin(mid) * r * 0.65

        ctx.fillStyle = '#fff'
        ctx.font = 'bold 13px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowColor = 'rgba(0,0,0,0.3)'
        ctx.shadowBlur = 4
        ctx.fillText(this.items[i].substring(0, 10), tx, ty)
        ctx.shadowBlur = 0
      }

      ctx.beginPath()
      ctx.arc(cx, cy, 12, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      ctx.shadowColor = 'rgba(0,0,0,0.2)'
      ctx.shadowBlur = 8
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.strokeStyle = 'rgba(0,0,0,0.1)'
      ctx.lineWidth = 2
      ctx.stroke()
    },
    spin() {
      if (this.spinning || this.items.length < 2) return
      this.spinning = true
      this.result = ''

      const spins = 5 + Math.random() * 5
      const stopAngle = Math.random() * Math.PI * 2
      const totalRotation = spins * Math.PI * 2 + stopAngle
      const duration = 4500
      const startTime = performance.now()
      const startRotation = this.rotation

      const animate = (time) => {
        const elapsed = time - startTime
        const progress = Math.min(elapsed / duration, 1)
        const ease = 1 - Math.pow(1 - progress, 3)
        const currentRotation = startRotation + totalRotation * ease

        this.rotation = currentRotation
        this.drawWheel(currentRotation)

        if (progress < 1) {
          this.animationId = requestAnimationFrame(animate)
        } else {
          const n = this.items.length
          const slice = (Math.PI * 2) / n
          const normalized = (((currentRotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2))
          const adjusted = (normalized + Math.PI / 2) % (Math.PI * 2)
          const idx = Math.floor(adjusted / slice) % n
          this.result = this.items[idx]
          this.spinning = false
          this.animationId = null
        }
      }

      this.animationId = requestAnimationFrame(animate)
    },
    show42Popup() {
      const popup = document.createElement('div')
      popup.innerHTML = '🌌 The Answer to Everything'
      popup.style.cssText = 'position:fixed;bottom:2.5rem;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#f39c12,#e74c3c);color:#fff;padding:0.65rem 1.6rem;border-radius:999px;font-size:0.9rem;font-weight:700;z-index:99999;box-shadow:0 6px 28px rgba(243,156,18,0.45);animation:dw42Pop 0.5s cubic-bezier(0.34,1.56,0.64,1);white-space:nowrap;pointer-events:none;'
      document.body.appendChild(popup)
      setTimeout(() => { popup.style.opacity = '0'; popup.style.transition = 'opacity 0.4s' }, 3000)
      setTimeout(() => popup.remove(), 3400)
    }
  }
}
</script>

<style scoped>
/* ── No card — just content ── */
.dw-container {
  max-width: 420px;
  margin: 2rem auto;
  padding: 0;
  background: transparent;
  text-align: center;
}

/* ── Header ── */
.dw-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1rem;
  justify-content: center;
}
.dw-icon {
  font-size: 2rem;
  line-height: 1;
}
.dw-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: rgba(255,255,255,0.8);
}

/* ── Canvas wrapper ── */
.dw-canvas-wrapper {
  position: relative;
  width: 100%;
  max-width: 300px;
  margin: 0 auto 0.5rem;
}
.dw-pointer {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
  color: #fff;
  z-index: 10;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));
  animation: pointerPulse 2s ease-in-out infinite;
}
.dw-canvas {
  display: block;
  margin: 0 auto;
  border-radius: 50%;
  max-width: 100%;
  height: auto;
}

/* ── Spin button ── */
.dw-spin-btn {
  display: block;
  width: 100%;
  padding: 0.6rem;
  border: none;
  border-radius: 10px;
  background: rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.7);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.dw-spin-btn:hover:not(:disabled) {
  background: rgba(255,255,255,0.08);
  color: #fff;
}
.dw-spin-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.btn-spinner {
  display: inline-block;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ── Result ── */
.dw-result {
  margin-top: 1rem;
  padding: 0.6rem 0.8rem;
  text-align: center;
  animation: bounceIn 0.5s ease;
}
.dw-result-label {
  display: block;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255,255,255,0.25);
}
.dw-result-text {
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
}

/* ── Inputs ── */
.dw-inputs {
  margin-top: 1rem;
  text-align: left;
}
.dw-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(255,255,255,0.3);
  margin-bottom: 0.2rem;
}
.dw-textarea {
  width: 100%;
  padding: 0.5rem 0.6rem;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 8px;
  background: rgba(255,255,255,0.02);
  color: rgba(255,255,255,0.8);
  font-size: 0.9rem;
  resize: vertical;
  box-sizing: border-box;
  outline: none;
  font-family: inherit;
}
.dw-textarea:focus {
  border-color: rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.04);
}
.dw-textarea::placeholder {
  color: rgba(255,255,255,0.15);
}
.dw-item-count {
  margin-top: 0.2rem;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.15);
  text-align: right;
}

/* ── Transitions ── */
.bounce-result-enter-active {
  animation: bounceIn 0.4s ease;
}
.bounce-result-leave-active {
  animation: bounceOut 0.2s ease forwards;
}
@keyframes bounceIn {
  0% { opacity: 0; transform: scale(0.9) translateY(8px); }
  60% { transform: scale(1.02) translateY(-2px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes bounceOut {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(0.9); }
}

/* ── Animations ── */
@keyframes pointerPulse {
  0%, 100% { transform: translateX(-50%) scale(1); }
  50% { transform: translateX(-50%) scale(1.1); }
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 8px rgba(243, 156, 18, 0.2); }
  50% { box-shadow: 0 0 20px rgba(243, 156, 18, 0.5); }
}
@keyframes dw42Pop {
  0% { opacity: 0; transform: translateX(-50%) scale(0.6) translateY(20px); }
  60% { transform: translateX(-50%) scale(1.08) translateY(-4px); }
  100% { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); }
}
</style>