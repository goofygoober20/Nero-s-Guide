<template>
  <div class="gpa-container">
    <!-- Glass card -->
    <div class="gpa-card glass">
      <!-- Header -->
      <div class="gpa-header">
        <span class="gpa-icon">📊</span>
        <h3 class="gpa-title">GPA Calculator</h3>
        <span class="gpa-badge" :style="{
          background: gpaColor,
          boxShadow: `0 0 20px ${gpaColor}33`
        }">
          {{ courseCount }} course{{ courseCount > 1 ? 's' : '' }}
        </span>
      </div>

      <!-- Course list -->
      <div class="course-list">
        <div
          v-for="(course, i) in courses"
          :key="i"
          class="course-row glass-field"
          :style="{ '--delay': `${i * 0.06}s` }"
        >
          <input
            v-model="course.name"
            class="gpa-input name-input glass-input"
            placeholder="Course name"
            @input="autoCalculate"
          />
          <select v-model="course.grade" class="gpa-select glass-select" @change="autoCalculate">
            <option v-for="g in grades" :key="g.value" :value="g.value">{{ g.label }}</option>
          </select>
          <input
            v-model.number="course.credits"
            type="number"
            min="0"
            max="10"
            class="gpa-input credits-input glass-input"
            placeholder="Cr"
            @input="validateCredits(i)"
            @change="autoCalculate"
          />
          <button
            v-if="courses.length > 1"
            @click="removeCourse(i)"
            class="remove-btn"
            aria-label="Remove course"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="gpa-actions">
        <button class="add-btn glass-btn" @click="addCourse">
          <span class="btn-icon">➕</span> Add Course
        </button>
        <button v-if="courses.length > 1" class="clear-btn glass-btn" @click="clearAll">
          <span class="btn-icon">🗑️</span> Clear All
        </button>
      </div>

      <!-- Results -->
      <div v-if="hasValidCredits" class="gpa-result glass">
        <div class="gpa-display">
          <div class="gpa-number-wrapper">
            <span class="gpa-number" :style="{ color: gpaColor }">{{ gpa }}</span>
            <span class="gpa-letter" :style="{ color: gpaColor }">{{ gpaLetter }}</span>
          </div>
          <span class="gpa-label">Cumulative GPA</span>
        </div>

        <!-- GPA Gauge -->
        <div class="gpa-gauge">
          <div class="gauge-track">
            <div
              class="gauge-fill"
              :style="{
                width: gpaPercent + '%',
                background: `linear-gradient(90deg, ${gpaColor}66, ${gpaColor})`
              }"
            ></div>
          </div>
          <div class="gauge-labels">
            <span>0.0</span>
            <span>1.0</span>
            <span>2.0</span>
            <span>3.0</span>
            <span>4.0</span>
          </div>
        </div>

        <div class="gpa-details">
          <span class="detail-item">
            <span class="detail-icon">📚</span>
            {{ totalCredits }} credit{{ totalCredits > 1 ? 's' : '' }}
          </span>
          <span class="detail-item">
            <span class="detail-icon">⭐</span>
            {{ totalQualityPoints }} quality points
          </span>
          <span class="detail-item">
            <span class="detail-icon">📝</span>
            {{ courseCount }} course{{ courseCount > 1 ? 's' : '' }}
          </span>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="gpa-empty">
        <span class="empty-icon">📝</span>
        <p>Add courses with credits to calculate your GPA</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GPACalculator',
  data() {
    return {
      grades: [
        { label: 'A+ (4.0)', value: 4.0 },
        { label: 'A (4.0)', value: 4.0 },
        { label: 'A- (3.7)', value: 3.7 },
        { label: 'B+ (3.3)', value: 3.3 },
        { label: 'B (3.0)', value: 3.0 },
        { label: 'B- (2.7)', value: 2.7 },
        { label: 'C+ (2.3)', value: 2.3 },
        { label: 'C (2.0)', value: 2.0 },
        { label: 'C- (1.7)', value: 1.7 },
        { label: 'D+ (1.3)', value: 1.3 },
        { label: 'D (1.0)', value: 1.0 },
        { label: 'D- (0.7)', value: 0.7 },
        { label: 'F (0.0)', value: 0.0 },
      ],
      courses: [
        { name: '', grade: 4.0, credits: 3 },
        { name: '', grade: 3.0, credits: 3 },
      ],
    }
  },
  computed: {
    courseCount() {
      return this.courses.length
    },
    hasValidCredits() {
      return this.courses.some(c => c.credits > 0)
    },
    totalCredits() {
      return this.courses.reduce((s, c) => s + (c.credits || 0), 0)
    },
    totalQualityPoints() {
      return this.courses.reduce((s, c) => s + c.grade * (c.credits || 0), 0)
    },
    gpa() {
      if (this.totalCredits === 0) return '0.00'
      return (this.totalQualityPoints / this.totalCredits).toFixed(2)
    },
    gpaNumber() {
      return parseFloat(this.gpa) || 0
    },
    gpaLetter() {
      const g = this.gpaNumber
      if (g >= 3.7) return 'A'
      if (g >= 3.3) return 'A-'
      if (g >= 3.0) return 'B+'
      if (g >= 2.7) return 'B'
      if (g >= 2.3) return 'B-'
      if (g >= 2.0) return 'C+'
      if (g >= 1.7) return 'C'
      if (g >= 1.3) return 'C-'
      if (g >= 1.0) return 'D+'
      if (g >= 0.7) return 'D'
      if (g >= 0.0) return 'F'
      return '-'
    },
    gpaColor() {
      const g = this.gpaNumber
      if (g >= 3.5) return '#2ecc71'
      if (g >= 3.0) return '#2ecc71'
      if (g >= 2.5) return '#f39c12'
      if (g >= 2.0) return '#f39c12'
      if (g >= 1.5) return '#e67e22'
      return '#e74c3c'
    },
    gpaPercent() {
      return Math.min((this.gpaNumber / 4.0) * 100, 100)
    }
  },
  methods: {
    addCourse() {
      this.courses.push({ name: '', grade: 4.0, credits: 3 })
      // Scroll to bottom after adding
      this.$nextTick(() => {
        const container = this.$el.querySelector('.course-list')
        if (container) container.scrollTop = container.scrollHeight
      })
    },
    removeCourse(index) {
      if (this.courses.length <= 1) return
      this.courses.splice(index, 1)
    },
    clearAll() {
      if (this.courses.length <= 1) {
        this.courses = [{ name: '', grade: 4.0, credits: 3 }]
        return
      }
      if (confirm('Clear all courses?')) {
        this.courses = [{ name: '', grade: 4.0, credits: 3 }]
      }
    },
    validateCredits(index) {
      const course = this.courses[index]
      if (course.credits < 0) course.credits = 0
      if (course.credits > 10) course.credits = 10
    },
    autoCalculate() {
      // Just triggers reactivity - computed values update automatically
      // This method exists for the @change/@input handlers
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
.gpa-container {
  max-width: 580px;
  margin: 2rem auto;
}

.gpa-card {
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

.gpa-card::before {
  content: '';
  position: absolute;
  top: -60%;
  left: -20%;
  width: 140%;
  height: 140%;
  background: radial-gradient(circle at 30% 30%, rgba(46, 204, 113, 0.08), transparent 70%);
  pointer-events: none;
}

/* ── Header ── */
.gpa-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.gpa-icon {
  font-size: 2rem;
  line-height: 1;
  filter: drop-shadow(0 2px 8px rgba(46, 204, 113, 0.3));
}

.gpa-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #2ecc71, #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex: 1;
}

.gpa-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.7rem;
  border-radius: 20px;
  color: #fff;
  background: #2ecc71;
  transition: background 0.4s ease, box-shadow 0.4s ease;
  white-space: nowrap;
}

/* ── Course list ── */
.course-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.2rem;
}

.course-list::-webkit-scrollbar {
  width: 4px;
}

.course-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 2px;
}

.course-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.course-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: fadeSlideIn 0.3s ease var(--delay, 0s) both;
}

.course-row:focus-within {
  border-color: rgba(46, 204, 113, 0.3);
  box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.08);
  transform: scale(1.02);
}

.course-row:hover {
  border-color: rgba(255, 255, 255, 0.1);
}

.gpa-input,
.gpa-select {
  padding: 0.5rem 0.7rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  font-size: 0.88rem;
  outline: none;
  transition: all 0.3s ease;
}

.gpa-input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.gpa-input:focus,
.gpa-select:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(46, 204, 113, 0.3);
}

.name-input {
  flex: 1;
  min-width: 0;
}

.credits-input {
  width: 60px;
  text-align: center;
}

.gpa-select {
  width: 130px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(255,255,255,0.3)'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
  padding-right: 2rem;
}

.gpa-select option {
  background: #2d2d3d;
  color: #fff;
}

.remove-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.3rem 0.4rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  line-height: 1;
}

.remove-btn:hover {
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
}

/* ── Actions ── */
.gpa-actions {
  display: flex;
  gap: 0.6rem;
  margin-top: 0.75rem;
}

.add-btn,
.clear-btn {
  padding: 0.5rem 1rem;
  border-radius: 12px;
  border: none;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  flex: 1;
}

.add-btn:hover {
  transform: translateY(-2px) scale(1.02);
  border-color: rgba(46, 204, 113, 0.4);
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
  box-shadow: 0 4px 16px rgba(46, 204, 113, 0.15);
}

.clear-btn:hover {
  transform: translateY(-2px) scale(1.02);
  border-color: rgba(231, 76, 60, 0.4);
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
  box-shadow: 0 4px 16px rgba(231, 76, 60, 0.15);
}

.add-btn:active,
.clear-btn:active {
  transform: scale(0.96);
}

.btn-icon {
  font-size: 0.9rem;
  line-height: 1;
}

/* ── Results ── */
.gpa-result {
  margin-top: 1.25rem;
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  animation: bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.gpa-display {
  text-align: center;
  margin-bottom: 0.5rem;
}

.gpa-number-wrapper {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.4rem;
}

.gpa-number {
  font-size: 2.8rem;
  font-weight: 800;
  font-family: 'SF Mono', 'Fira Code', monospace;
  transition: color 0.4s ease;
}

.gpa-letter {
  font-size: 1.4rem;
  font-weight: 700;
  transition: color 0.4s ease;
  opacity: 0.6;
}

.gpa-label {
  display: block;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: 0.1rem;
}

/* ── GPA Gauge ── */
.gpa-gauge {
  margin: 0.8rem 0;
}

.gauge-track {
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
  position: relative;
}

.gauge-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.gauge-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.55rem;
  color: rgba(255, 255, 255, 0.2);
  margin-top: 0.2rem;
  padding: 0 0.2rem;
}

/* ── Details ── */
.gpa-details {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  flex-wrap: wrap;
  padding-top: 0.6rem;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  margin-top: 0.2rem;
}

.detail-item {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.detail-icon {
  font-size: 0.8rem;
}

/* ── Empty state ── */
.gpa-empty {
  text-align: center;
  padding: 1.5rem 0 0.5rem;
  color: rgba(255, 255, 255, 0.25);
}

.empty-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
  opacity: 0.5;
}

.gpa-empty p {
  margin: 0;
  font-size: 0.85rem;
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
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>