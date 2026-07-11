---
slug: smart-resource-hubs
status: setup-ready
intent: unclear
pending-action: run $start-work setup-boulder-and-decompose → then $start-work (no args) on smart-resource-hubs
approach: Build 4 Vue hub components + convert travel.md to hub format as pilot, with playbook for future conversions
setup-notes: Boulder state plan ready at .omo/plans/setup-boulder-and-decompose.md. Todos 1-4 decomposed with exact prop signatures, file paths, and QA scenarios for parallel dispatch.
---

# Draft: smart-resource-hubs

## Components (topology ledger)
id | outcome | status | evidence path
--- | --- | --- | ---
QuickPick.vue | Hero recommendation card | active | .vitepress/theme/components/ (47 existing components)
ComparisonTable.vue | Side-by-side comparison table | active | Same dir
ProsCons.vue | Structured pros/cons card with verdict | active | Same dir
RankCard.vue | Numbered ranking card with badges | active | Same dir
travel.md | Converted to hub format using new components | active | /travel.md (492 lines, inline scoped CSS)
index.js | Register all 4 new components | active | .vitepress/theme/index.js (111 lines)

## Open assumptions (announced defaults)
assumption | adopted default | rationale | reversible?
--- | --- | --- | ---
Which pilot guide to convert | travel.md | User confirmed — recommended choice | No
Plan review | High-accuracy (Momus) | User confirmed — automatic for unclear intent | No
Component design tokens | Existing CSS var system (--accent-*, --radius-*, --space-*) | Matches all 47 existing components | Yes
Component naming | QuickPick, ComparisonTable, ProsCons, RankCard | Descriptive, matches convention (DifficultyBadge, Not Difficulty-Badge-Beginner) | Yes
Registration pattern | Global in index.js app.component(...) | Matches all existing component reg | Yes
travel.md sections to convert | All 12 sections use hub components; keep strength-chart and step-cards as inline CSS only if genuinely distinct | Preserve existing visual patterns while adding new structure | Yes
Scoped vs global CSS | Scoped <style> per component + any shared hub CSS in custom.css | Matches existing pattern | Yes
Mobile breakpoint | 640px (existing travel.md breakpoint) | Already defined in travel.md scoped CSS | Yes

## Findings (cited - path:lines)
1. travel.md: 492 lines, 12 content sections + hero + sources + BackLinks — flat text links, no rankings/comparisons
2. travel.md already has scoped inline CSS for: strength-chart (lines 366-424), steps-grid (lines 426-465), sources-grid (lines 305-364), guide-hero (lines 252-283), mobile 640px (lines 467-489)
3. .vitepress/theme/components/ has 47 existing Vue components, all registered in index.js via app.component()
4. DifficultyBadge.vue (45 lines) is the closest existing pattern — prop-driven, scoped CSS, badge styling with --accent-* colors
5. custom.css: 2160 lines with comprehensive design tokens (--accent-*, --radius-*, --space-*, --vp-c-brand-*, --transition-*)
6. index.js pattern: import + app.component + global registration, router.onAfterRouteChanged for table-label injection

## Decisions (with rationale)
1. **Pilot: travel.md** — user confirmed; strongest candidate because it already has partial structure (strength-chart, steps-grid, sources-grid) making the transformation cleaner
2. **4 components, not 5** — QuickPick, ComparisonTable, ProsCons, RankCard cover all hub needs (rankings, comparisons, pros/cons, tags/difficulty, quick recommendations). No extra component for filtering/tags — DifficultyBadge pattern covers that.
3. **Scoped component CSS** — not adding to global custom.css unless a style applies to the same class name across components
4. **Keep existing travel.md inline CSS** — strength-chart and steps-grid are travel-specific and clean; no need to extract to components
5. **One conversion wave** — not incremental. Write the complete new travel.md in one pass to avoid intermediate broken states
6. **Playbook as .omo/playbooks/hub-conversion.md** — document the pattern so future guide conversions are mechanical

## Scope IN
- Build 4 Vue components: QuickPick, ComparisonTable, ProsCons, RankCard
- Register all in index.js
- Convert travel.md to hub format using new components
- Write a conversion playbook at .omo/playbooks/hub-conversion.md
- Update single .omo/plans entry (the rewrite-travel-intro plan is separate and pre-existing)

## Scope OUT (Must NOT have)
- NO conversion of other guides (gardening, gaming, cooking, etc.)
- NO changes to homepage or site navigation
- NO new guide creation (photography, music, etc.)
- NO changes to existing unrelated components (BackLinks, DifficultyBadge, etc.)
- NO changes to config.mts, custom.css global tokens (unless a small shared hub CSS class is needed)
- NO breaking changes to travel.md URLs or anchors
- NO deletions of existing travel.md content (reformat only, preserve all tool recommendations)

## Open questions
None — all forks resolved by codebase research or user answers.

## Approval gate
status: awaiting-approval
pending-action: write .omo/plans/smart-resource-hubs.md
approach: Phase 1 (4 Vue components + registration) → Phase 2 (convert travel.md) → Phase 3 (write conversion playbook)
