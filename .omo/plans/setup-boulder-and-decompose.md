# Setup Boulder State & Decompose First Wave

## TL;DR (For humans)

This plan doesn't change any product code. It prepares the execution infrastructure so `$start-work` on the **smart-resource-hubs** plan runs fast instead of hanging for 4 minutes. It does two things:
1. **Creates Boulder state** — a `.omo/boulder.json` file that binds the current session to the smart-resource-hubs plan, so the worker knows exactly what plan to execute, where to resume after interruptions, and what's left.
2. **Decomposes the first 4 checkboxes** into atomic sub-tasks — each component (QuickPick, ComparisonTable, ProsCons, RankCard) gets its own sub-tasks with exact file paths, prop signatures, template structure, and CSS tokens, so the worker can execute them in parallel without studying the 150-line plan.

After this runs, `$start-work` will read Boulder state → decomposes the remaining checkboxes 5-7 and F1-F4 → dispatches everything in parallel bursts.

## Scope

### Must have
- Create `.omo/boulder.json` with session-to-plan binding for smart-resource-hubs
- Decompose todos 1-4 (QuickPick, ComparisonTable, ProsCons, RankCard) into atomic sub-task template blocks in `.omo/plans/smart-resource-hubs.md` so the worker can dispatch all four in parallel without decision-making
- Update `.omo/drafts/smart-resource-hubs.md` status to `setup-ready`

### Must NOT have
- NO product code changes (keep `prometheus-md-only` discipline)
- NO changes to existing travel.md, components, or index.js
- NO deleting or restructuring existing plan todos

---

## Todo 0: Create Boulder State

**File:** `.omo/boulder.json`
**Content:**
```json
{
  "schema_version": 2,
  "active_work_id": "smart-resource-hubs",
  "works": {
    "smart-resource-hubs": {
      "work_id": "smart-resource-hubs",
      "active_plan": ".omo/plans/smart-resource-hubs.md",
      "plan_name": "smart-resource-hubs",
      "session_ids": ["opencode:<replace-with-current-session-id>"],
      "status": "active",
      "worktree_path": null
    }
  }
}
```

**Instructions:** Create the `boulder.json` file. Replace `<replace-with-current-session-id>` with the actual session ID from `opencode` context (use `session_list` or `session_info` to find it, or use a meaningful work ID since continuation hooks may not be set up in this environment).

**Why this fixes the hang:** Without Boulder state, `$start-work` has no session-to-plan binding. It cold-starts reading the entire plan every time, with no resume point. Boulder state gives it a checkpoint so it can resume from the next unchecked checkbox.

---

## Wave 1 Decomposition: Todos 1-4 (Parallel — 4 Components)

These four todos are **fully independent** — no shared files, no shared state. A worker can dispatch all four in a single parallel burst.

### Sub-tasks for Todo 1: QuickPick.vue

**File:** `.vitepress/theme/components/QuickPick.vue`

**Structure:**
```vue
<template>
  <div class="quick-pick">
    <div class="qp-header">★ Quick Pick</div>
    <div class="qp-body">
      <span class="qp-icon">{{ icon }}</span>
      <div class="qp-content">
        <h3 class="qp-title">{{ recommendation }}</h3>
        <p class="qp-desc">{{ description }}</p>
        <div class="qp-tags" v-if="tags && tags.length">
          <span class="qp-tag" v-for="tag in tags" :key="tag">{{ tag }}</span>
        </div>
        <a :href="link" target="_blank" rel="noopener" class="qp-link">Learn more →</a>
      </div>
    </div>
  </div>
</template>
```

**Props (exact types):**
```js
defineProps({
  recommendation: { type: String, required: true },
  description:   { type: String, required: true },
  link:          { type: String, required: true },
  tags:          { type: Array, default: () => [] },
  icon:          { type: String, default: '⭐' }
})
```

**CSS tokens to use:** `--accent` or `--vp-c-brand-1` for header, `--radius-md` for card rounding, `--space-*` for padding. All scoped.

**QA scenario:** Create a test markdown file with `<QuickPick recommendation="Google Flights" description="Best flight search" link="https://google.com" :tags="['Best Value','Beginner-Friendly']" icon="✈️" />` — verify header "★ Quick Pick", recommendation name, description, link button, tag badges all render.

---

### Sub-tasks for Todo 2: ComparisonTable.vue

**File:** `.vitepress/theme/components/ComparisonTable.vue`

**Props (exact types):**
```js
defineProps({
  columns: { type: Array, required: true }, // [{label: string}]
  rows:    { type: Array, required: true }  // [{feature: string, values: string[]}]
})
```

**Structure:** Desktop renders as a `<table>` with `<thead>` (column labels from `columns[].label`) and `<tbody>` (feature name as first cell, values[i] in each subsequent cell matching columns index). Mobile (<640px) collapses to a stacked format: each row becomes a block with the feature name as a header and "label: value" pairs below.

**Responsive technique:** Use `data-label` attributes on `<td>` elements (matching the existing site pattern at index.js:44-110 which injects data-label for mobile). On mobile, use CSS `::before` to display the column label.

**CSS tokens:** `--radius-md` for card rounding, `--border-color` or `--vp-c-divider` for table borders.

**QA scenario:** 3-column table (columns: `[{label:"Free"},{label:"Pro"},{label:"Enterprise"}]`, rows: `[{feature:"Price", values:["$0","$10","$100"]},{feature:"Users", values:["1","10","Unlimited"]}]`) — verify desktop renders as proper table, mobile collapses correctly.

---

### Sub-tasks for Todo 3: ProsCons.vue

**File:** `.vitepress/theme/components/ProsCons.vue`

**Props (exact types):**
```js
defineProps({
  pros:    { type: Array, required: true },    // array of strings
  cons:    { type: Array, required: true },    // array of strings
  verdict: { type: String, default: '' },
  rating:  { type: Number, default: 0 }
})
```

**Structure:** Two-column layout on desktop: left column (green tint) lists each `pro` with a `✅` prefix; right column (red tint) lists each `con` with a `❌` prefix. Below the two columns: verdict line (if `verdict` non-empty) and star rating (if `rating > 0`, render `★` repeated `rating` times + `☆` for remaining to fill 5). On mobile (<640px), columns stack.

**CSS tokens:** `--accent-green: #2ecc71` (or rgba variant), `--accent-red: #e74c3c`, `--radius-md` for card rounding.

**QA scenario:** `pros={["Free forever","Open source","Great community"]}` `cons={["Steep learning curve","Limited docs"]}` `verdict="Best for experienced users"` `rating=4` — verify pros column green, cons column red, verdict text, 4 filled + 1 empty star.

---

### Sub-tasks for Todo 4: RankCard.vue

**File:** `.vitepress/theme/components/RankCard.vue`

**Props (exact types):**
```js
defineProps({
  rank:        { type: Number, required: true },
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  difficulty:  { type: String, default: '' },   // 'beginner' | 'intermediate' | 'advanced' — for DifficultyBadge
  price:       { type: String, default: '' },
  link:        { type: String, default: '' },
  tags:        { type: Array, default: () => [] }
})
```

**Structure:** Horizontal card with flex layout (NO `position: absolute` or `position: fixed` for the rank number):
- Left: large rank number (48px bold, --vp-c-brand-1 color)
- Center: title (bold) + description (muted) + optional DifficultyBadge/price tag
- Right: link button + optional tag badges

**CSS tokens:** `--vp-c-brand-1` for rank number, `--vp-c-text-2` for description, `--radius-md`.

**QA scenario:** `rank=1 title="Google Flights" description="Fast, accurate flight search" difficulty="beginner" price="Free" link="https://flights.google.com"` — verify rank "1" displays prominently, title in bold, difficulty badge renders (reuse DifficultyBadge), price "Free" shown.

---

## Directions for $start-work

1. **Run `$start-work setup-boulder-and-decompose`** — this plan runs first to create Boulder state and embed the sub-task decompositions into the main plan. It takes ~30 seconds.
2. **Then run `$start-work`** (no args) — with Boulder state present, the worker auto-selects the smart-resource-hubs plan. It finds the first unchecked checkbox (Todo 1), then scans and sees Todos 2-4 are also unchecked and independent → dispatches all four components in one parallel burst.
3. **Each component** gets written, verified (build check), and evidence-captured independently.
4. **Then phase 2**: Todos 5-7 serialize (registration → travel.md → playbook).
5. **Final wave**: F1-F4 verification runs in parallel.

**If $start-work still hangs:** The Boulder state was the critical missing piece. If it still stalls, try `$start-work smart-resource-hubs` to explicitly name the plan.

---

## Verification

- [ ] `.omo/boulder.json` exists with valid JSON and `active_plan` pointing to smart-resource-hubs
- [ ] Todos 1-4 now have explicit sub-task structure with exact prop types, path, and styles
- [ ] Draft status updated to `setup-ready`
- [ ] No product files changed

## Commit

N/A — no product code changes. Only `.omo/` state files.
