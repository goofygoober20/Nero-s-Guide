<template>
  <div class="cf-container">
    <!-- Glass card -->
    <div class="cf-card glass">
      <!-- Header -->
      <div class="cf-header">
        <span class="cf-icon">🎲</span>
        <h3 class="cf-title">Coin Flip & Dice Roller</h3>
      </div>

      <!-- Coin Flip Section -->
      <div class="cf-section">
        <h4 class="cf-section-title">🪙 Coin Flip</h4>
        <div class="cf-coin-wrapper" @click="flipCoin" role="button" tabindex="0" @keydown.enter="flipCoin">
          <div class="cf-coin" :class="{
            flipping: coinFlipping,
            'result-heads': coinResult === 'heads',
            'result-tails': coinResult === 'tails'
          }">
            <div class="coin-inner">
              <div class="coin-front">
                <span class="coin-symbol">H</span>
              </div>
              <div class="coin-back">
                <span class="coin-symbol">T</span>
              </div>
            </div>
          </div>
        </div>
        <div class="cf-controls">
          <button class="cf-btn glass-btn primary" @click="flipCoin" :disabled="coinFlipping">
            {{ coinFlipping ? '⏳ Flipping...' : '🔄 Flip Coin' }}
          </button>
          <span v-if="coinResult && !coinFlipping" class="cf-result" :class="coinResult">
            {{ coinResult === 'heads' ? 'Heads 🟢' : 'Tails 🔵' }}
          </span>
        </div>
      </div>

      <div class="cf-divider"></div>

      <!-- Dice Section -->
      <div class="cf-section">
        <h4 class="cf-section-title">🎯 Dice Roller</h4>
        <div class="cf-dice-row">
          <button
            v-for="s in [4, 6, 8, 10, 12, 20]"
            :key="s"
            class="cf-dice-btn glass-btn"
            :class="{ active: diceSides === s }"
            @click="diceSides = s"
          >
            d{{ s }}
          </button>
        </div>
        <div class="cf-dice-display" :class="{ rolling: diceRolling }" @click="rollDice" role="button" tabindex="0" @keydown.enter="rollDice">
          <span class="dice-result" v-if="diceResult !== null">{{ diceResult }}</span>
          <span class="dice-placeholder" v-else>?</span>
        </div>
        <div class="cf-controls">
          <button class="cf-btn glass-btn primary" @click="rollDice" :disabled="diceRolling">
            {{ diceRolling ? '⏳ Rolling...' : '🎲 Roll d' + diceSides }}
          </button>
          <span v-if="diceResult !== null && !diceRolling" class="cf-dice-label">
            d{{ diceSides }} → {{ diceResult }}
          </span>
        </div>
      </div>

      <!-- Quick reset (optional) -->
      <button class="cf-reset-btn glass-btn" @click="resetAll" v-if="coinResult || diceResult !== null">
        ↩️ Reset All
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CoinFlipDiceRoller',
  data() {
    return {
      coinResult: null,
      coinFlipping: false,
      diceSides: 6,
      diceResult: null,
      diceRolling: false,
    }
  },
  methods: {
    flipCoin() {
      if (this.coinFlipping) return
      this.coinFlipping = true
      this.coinResult = null
      // Randomize result
      const result = Math.random() < 0.5 ? 'heads' : 'tails'
      setTimeout(() => {
        this.coinResult = result
        this.coinFlipping = false
      }, 700)
    },
    rollDice() {
      if (this.diceRolling) return
      this.diceRolling = true
      this.diceResult = null
      // Animate a few random values before final
      let count = 0
      const interval = setInterval(() => {
        this.diceResult = Math.floor(Math.random() * this.diceSides) + 1
        count++
        if (count >= 10) {
          clearInterval(interval)
          // Final result
          this.diceResult = Math.floor(Math.random() * this.diceSides) + 1
          this.diceRolling = false
        }
      }, 80)
    },
    resetAll() {
      this.coinResult = null
      this.coinFlipping = false
      this.diceResult = null
      this.diceRolling = false
    }
  }
}
</script>

<style scoped>
/* ── Glass base ── */
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

/* ── Container ── */
.cf-container {
  max-width: 440px;
  margin: 2rem auto;
}

.cf-card {
  padding: 2rem 1.5rem;
  border-radius: 20px;
  background: linear-gradient(145deg, rgba(30, 30, 40, 0.6), rgba(20, 20, 30, 0.4));
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  overflow: hidden;
  animation: bounceIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.cf-card::before {
  content: '';
  position: absolute;
  top: -60%;
  left: -20%;
  width: 140%;
  height: 140%;
  background: radial-gradient(circle at 30% 30%, rgba(241, 196, 15, 0.08), transparent 70%);
  pointer-events: none;
}

/* ── Header ── */
.cf-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.cf-icon {
  font-size: 2rem;
  line-height: 1;
  filter: drop-shadow(0 2px 8px rgba(241, 196, 15, 0.3));
}

.cf-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f1c40f, #e67e22);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Sections ── */
.cf-section {
  text-align: center;
}

.cf-section-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 0.75rem;
}

.cf-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  margin: 1.5rem 0;
}

/* ── Coin flip ── */
.cf-coin-wrapper {
  display: flex;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 1rem;
  perspective: 300px;
}

.cf-coin {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
}

.cf-coin.flipping {
  animation: coinFlip 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes coinFlip {
  0% { transform: rotateY(0); }
  25% { transform: rotateY(180deg); }
  50% { transform: rotateY(360deg); }
  75% { transform: rotateY(540deg); }
  100% { transform: rotateY(720deg); }
}

.cf-coin.result-heads {
  transform: rotateY(0deg);
}

.cf-coin.result-tails {
  transform: rotateY(180deg);
}

.coin-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
}

.coin-front,
.coin-back {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  border: 3px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1);
}

.coin-front {
  background: radial-gradient(circle at 40% 40%, rgba(46, 204, 113, 0.3), rgba(46, 204, 113, 0.05));
  border-color: #2ecc71;
}

.coin-back {
  transform: rotateY(180deg);
  background: radial-gradient(circle at 40% 40%, rgba(52, 152, 219, 0.3), rgba(52, 152, 219, 0.05));
  border-color: #3498db;
}

.coin-symbol {
  font-size: 2.2rem;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 2px 12px rgba(0,0,0,0.3);
}

/* ── Controls ── */
.cf-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.cf-btn {
  padding: 0.6rem 1.5rem;
  border-radius: 12px;
  border: none;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
}

.cf-btn.primary {
  background: rgba(241, 196, 15, 0.2);
  border-color: rgba(241, 196, 15, 0.3);
  color: #f1c40f;
}

.cf-btn.primary:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 0 24px rgba(241, 196, 15, 0.15);
  background: rgba(241, 196, 15, 0.3);
}

.cf-btn.primary:active:not(:disabled) {
  transform: scale(0.96);
}

.cf-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none !important;
}

.cf-result {
  font-size: 1.1rem;
  font-weight: 700;
  padding: 0.2rem 0.8rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  animation: fadeSlideIn 0.3s ease;
}

.cf-result.heads {
  color: #2ecc71;
}

.cf-result.tails {
  color: #3498db;
}

/* ── Dice ── */
.cf-dice-row {
  display: flex;
  justify-content: center;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.cf-dice-btn {
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.cf-dice-btn:hover {
  transform: translateY(-2px);
  border-color: rgba(241, 196, 15, 0.3);
  color: rgba(255, 255, 255, 0.8);
}

.cf-dice-btn.active {
  background: rgba(241, 196, 15, 0.2);
  border-color: rgba(241, 196, 15, 0.4);
  color: #f1c40f;
  box-shadow: 0 0 16px rgba(241, 196, 15, 0.1);
}

.cf-dice-display {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 2.6rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.9);
  font-variant-numeric: tabular-nums;
}

.cf-dice-display:hover {
  border-color: rgba(241, 196, 15, 0.3);
  transform: scale(1.02);
}

.cf-dice-display.rolling {
  animation: diceBounce 0.3s ease 3;
}

@keyframes diceBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.dice-placeholder {
  color: rgba(255, 255, 255, 0.15);
  font-size: 1.8rem;
}

.cf-dice-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 500;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  animation: fadeSlideIn 0.3s ease;
}

/* ── Reset Button ── */
.cf-reset-btn {
  width: 100%;
  margin-top: 1.25rem;
  padding: 0.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cf-reset-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.1);
}

/* ── Animations ── */
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.85) translateY(12px);
  }
  50% {
    transform: scale(1.02) translateY(-2px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateX(-6px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>