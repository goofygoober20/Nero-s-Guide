# 📊 BMI Calculator

<div class="bmi-calculator">
  <div class="calculator-card">
    <div class="input-group">
      <label>Weight (kg):</label>
      <input type="number" id="weight" placeholder="e.g., 70">
    </div>

<div class="input-group">
      <label>Height (cm):</label>
      <input type="number" id="height" placeholder="e.g., 175">
    </div>

<button id="calculateBtn" class="calculate-btn">Calculate BMI</button>

<div id="result" class="result" style="display: none;">
      <h3>Your BMI: <span id="bmiValue"></span></h3>
      <p id="bmiCategory"></p>
    </div>
  </div>
</div>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const weightInput = document.getElementById('weight')
  const heightInput = document.getElementById('height')
  const calculateBtn = document.getElementById('calculateBtn')
  const resultDiv = document.getElementById('result')
  const bmiValue = document.getElementById('bmiValue')
  const bmiCategory = document.getElementById('bmiCategory')

  calculateBtn.addEventListener('click', () => {
    const weight = parseFloat(weightInput.value)
    const height = parseFloat(heightInput.value) / 100

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
      alert('Please enter valid weight and height')
      return
    }

    const bmi = weight / (height * height)
    bmiValue.textContent = bmi.toFixed(1)

    let category = ''
    let color = ''

    if (bmi < 18.5) {
      category = 'Underweight'
      color = '#3498db'
    } else if (bmi < 25) {
      category = 'Normal weight'
      color = '#2ecc71'
    } else if (bmi < 30) {
      category = 'Overweight'
      color = '#f39c12'
    } else {
      category = 'Obese'
      color = '#e74c3c'
    }

    bmiCategory.textContent = category
    bmiCategory.style.color = color
    resultDiv.style.display = 'block'
  })
})
</script>

<style scoped>
.bmi-calculator {
  max-width: 400px;
  margin: 0 auto;
}

.calculator-card {
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--vp-c-divider);
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.input-group input {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-sizing: border-box;
}

.calculate-btn {
  width: 100%;
  padding: 0.75rem;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
}

.result {
  margin-top: 1.5rem;
  text-align: center;
  padding: 1rem;
  background: var(--vp-c-bg);
  border-radius: 8px;
}

.result h3 {
  margin: 0 0 0.5rem;
}
</style>