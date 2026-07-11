<script setup>
import TravelChecklist from './.vitepress/theme/components/TravelChecklist.vue'
</script>

# ✈️ Travel Planning Checklist

<div class="checklist-intro">
  <p>Plan trips stress-free. Covers everything from booking to packing to home prep. Progress saves automatically in your browser.</p>
</div>

<ClientOnly>
  <TravelChecklist />
</ClientOnly>

<div class="about-tip">
  <span class="tip-icon">✈️</span>
  <span><strong>Tip:</strong> Book refundable when plans aren't firm. Screenshot all confirmations. Share itinerary with a trusted contact. Progress saves via localStorage.</span>
</div>

<style scoped>
.checklist-intro {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 1.5rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}
.about-tip {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  background: var(--vp-c-brand-soft);
  border: 1px solid var(--vp-c-divider);
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  margin-top: 1rem;
}
.tip-icon { flex-shrink: 0; font-size: 1.1rem; margin-top: 0.1rem; }
</style>