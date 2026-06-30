---
title: Monthly Updates
---

<script setup>
const nextUpdateDate = () => {
  const now = new Date()
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return lastDay.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}
</script>

# 📬 Monthly Updates

<div class="cadence-badge">🗓️ Published on the last day of every month. Next update: {{ nextUpdateDate() }}</div>

## 🏆 This Month's Highlights

| What | Details |
|------|---------|
| 🆕 **Shopping Resources** | 30+ tools across 5 categories, price tracking, ethical shopping, games, electronics, collectibles |
| 🖼️ **Favicon Migration** | All resource card icons replaced with live favicons |

| 🎨 **404 Redesign** | Warm on-brand page with search trigger, rotating quote, GuideIcon buttons |
| 🌐 **Site-Wide Polish** | OG tags added, RSS URL fixed, nav expanded, `lastUpdated` enabled |


## 💬 Quote of the Month

> "No amount of skillful invention can replace the essential element of imagination" - Edward Hopper


## 🔧 Behind the Scenes

> This month I migrated from hardcoded SVG icons to live DuckDuckGo favicons - each resource card now loads its site's actual logo automatically. The BoxBreathing component was a fun Vue challenge using `requestAnimationFrame` for smooth circle animation.

<div class="archive-footer">
  <a href="/monthly-archive/" class="archive-link">📦 View past monthly updates</a>
</div>

<style scoped>
.cadence-badge {
  display: inline-block;
  background: linear-gradient(135deg, var(--vp-c-brand-soft), var(--vp-c-bg-soft));
  border: 1px solid var(--vp-c-brand-2);
  border-radius: 40px;
  padding: 0.35rem 1rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin: 0.5rem 0 1.5rem;
}

.roadmap {
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  padding: 0.25rem 1.25rem;
  margin: 1rem 0;
  border: 1px solid var(--vp-c-divider);
}

.roadmap-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 0.95rem;
}

.roadmap-item:last-child {
  border-bottom: none;
}

.roadmap-item .status {
  font-size: 1.1rem;
  width: 32px;
  flex-shrink: 0;
}

.roadmap-item .label {
  flex: 1;
}

.roadmap-item .eta {
  margin-left: auto;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg);
  padding: 2px 10px;
  border-radius: 20px;
  flex-shrink: 0;
}

.done .label { color: var(--vp-c-text-1); }
.in-progress .label { color: var(--vp-c-text-1); }
.planned .label { color: var(--vp-c-text-2); }

.archive-footer {
  text-align: center;
  margin: 2.5rem 0 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
}

.archive-link {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  border-radius: 40px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.25s ease;
  text-decoration: none;
  color: var(--vp-c-text-1);
}

.archive-link:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .roadmap-item {
    flex-wrap: wrap;
  }
  
  .roadmap-item .eta {
    margin-left: 2rem;
  }
}
</style>
