<script setup>
import KitchenChecklist from './.vitepress/theme/components/KitchenChecklist.vue'
</script>

# 🍳 Kitchen Essentials Checklist

<div class="checklist-intro">
  <p>Track what you own, what you need, and what to upgrade. Covers knives, cookware, bakeware, tools, appliances, storage, and pantry staples. Progress saves automatically in your browser.</p>
</div>

<ClientOnly>
  <KitchenChecklist />
</ClientOnly>

<div class="about-tip">
  <span class="tip-icon">💡</span>
  <span><strong>Tip:</strong> Start with "High" priority items. Quality > Quantity — a good chef's knife beats a 12-piece block set. Progress saves automatically via localStorage.</span>
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