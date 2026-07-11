# smart-resource-hubs - Work Plan

## TL;DR (For humans)
<!-- Fill this LAST, after the detailed plan below is written, so it summarizes the REAL plan. -->
<!-- Plain English for a non-engineer: NO file paths, NO todo numbers, NO wave/agent/tool names. -->

**What you'll get:** travel.md transformed from a flat list of tool links into an interactive decision hub with ranking cards, comparison tables, pros/cons breakdowns, and quick-pick recommendations for each travel category (flights, trains, maps, accommodation, etc.). Four new reusable Vue components will be built so the same format can be applied to other guides later.

**Why this approach:** Building components first (not doing a one-off markup rewrite) means every future guide conversion uses the same structured format. Converting travel.md as pilot proves the pattern on a real guide with diverse sections. The playbook document makes follow-up conversions mechanical and fast.

**What it will NOT do:** Convert other guides, create new guides, change homepage/site nav, delete any existing travel recommendations.

**Effort:** Medium
**Risk:** Low — all new components are small (40-80 lines each, following 47 existing component examples), travel.md rewrite preserves all content, no build system changes
**Decisions I made for you:** Component naming (QuickPick/ComparisonTable/ProsCons/RankCard), scoped CSS per component, global registration in index.js, 640px mobile breakpoint, keep existing travel.md inline CSS for strength-chart/step-cards

Your next move: Run high-accuracy (Momus) plan review, then approve to begin execution.

---

> TL;DR (machine): Medium effort, Low risk. Build 4 Vue components → convert travel.md → write conversion playbook. 1 wave, 6 sequential todos.

## Scope
### Must have
- 4 new Vue components: QuickPick.vue, ComparisonTable.vue, ProsCons.vue, RankCard.vue
- Register all 4 in .vitepress/theme/index.js
- Convert travel.md to hub format using new components (preserve all existing tool recommendations and anchors)
- Write conversion playbook at .omo/playbooks/hub-conversion.md
- All existing travel.md content preserved (flight tools, train tools, maps, accommodation, visa info, weather, destinations, special interests, essential tools, sources, BackLinks)

### Must NOT have (guardrails, anti-slop, scope boundaries)
- NO converting other guides (cooking, gaming, gardening, etc.)
- NO changes to homepage, site nav, sidebar, or config.mts
- NO new guide creation
- NO changes to existing components (BackLinks, DifficultyBadge, etc.)
- NO deletion of existing travel.md sections — reformat only, preserve URLs/anchors
- NO changes to global custom.css beyond a small shared hub section if genuinely needed

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision: tests-after (manual visual verification via VitePress dev server or build)
- Framework: vitepress dev build check
- Evidence: .omo/evidence/task-<N>-smart-resource-hubs.md (screenshot or description of component rendering)

## Execution strategy
### Parallel execution waves
Wave 1: Todos 1-6 (sequential — each component feeds the next, travel.md depends on all components)

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| 1. QuickPick.vue | — | 5 (travel.md) | 2, 3, 4 (components are independent) |
| 2. ComparisonTable.vue | — | 5 (travel.md) | 1, 3, 4 |
| 3. ProsCons.vue | — | 5 (travel.md) | 1, 2, 4 |
| 4. RankCard.vue | — | 5 (travel.md) | 1, 2, 3 |
| 5. index.js registration | 1, 2, 3, 4 | 6 (travel.md) | — |
| 6. travel.md conversion | 1, 2, 3, 4, 5 | playbook (7) | — |
| 7. Playbook | 6 | F1-F4 | — |

## Todos
> Implementation + Test = ONE todo. Never separate.
<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->
- [ ] 1. Build QuickPick.vue
  What to do / Must NOT do: Create `.vitepress/theme/components/QuickPick.vue` — a recommendation hero card that promotes one "best pick" per category. Takes props: `recommendation` (string: tool name), `description` (string: why), `link` (string: URL), `tags` (array of string: e.g. ['Best Value', 'Best Features', 'Beginner-Friendly']), `icon` (string: emoji or icon identifier). Renders as a prominent card with a "★ Quick Pick" header, the recommendation name, description, link button, and tag badges. Scoped CSS using existing design tokens (--accent-*, --radius-*, --space-*, --vp-c-brand-1). Must NOT have any global style leakage. Must NOT depend on any non-standard library.
  Parallelization: Wave 1 | Blocked by: — | Blocks: 5
  References: .vitepress/theme/components/DifficultyBadge.vue (45 lines — closest pattern for badge styling), .vitepress/theme/custom.css:1-134 (design tokens), .vitepress/theme/components/ (47 existing component examples)
  Acceptance criteria (agent-executable): `grep -c "defineProps" .vitepress/theme/components/QuickPick.vue` exits 0 AND `grep -c "scoped" .vitepress/theme/components/QuickPick.vue` exits 0
  QA scenarios: happy - render in a test markdown page via `::: quick-pick recommendation="Google Flights" ...`, verify card renders with header, name, description, link, tags. failure - missing props gracefully handles undefined. Evidence .omo/evidence/task-1-smart-resource-hubs.md
  Commit: Y | feat(components): add QuickPick recommendation hero card

- [ ] 2. Build ComparisonTable.vue
  What to do / Must NOT do: Create `.vitepress/theme/components/ComparisonTable.vue` — a responsive side-by-side comparison table for comparing tools/options. Props: `columns` (array of {label: string}), `rows` (array of {feature: string, values: string[]} — each value corresponds to a column). Renders as a clean table with header row, feature column on the left, and value columns. Must be fully responsive — on mobile (<640px) collapses to stacked "label: value" per row pattern. Scoped CSS only. Must NOT use external table libraries.
  Parallelization: Wave 1 | Blocked by: — | Blocks: 5
  References: .vitepress/theme/custom.css:1-134 (design tokens), .vitepress/theme/index.js:44-110 (existing inline table label injection pattern via data-label), travel.md:30-88 (existing strength-chart pattern as comparison reference)
  Acceptance criteria (agent-executable): `grep -c "defineProps" .vitepress/theme/components/ComparisonTable.vue` exits 0
  QA scenarios: happy - 3-column comparison renders correctly at desktop and mobile widths. failure - empty columns/rows renders gracefully (empty state). Evidence .omo/evidence/task-2-smart-resource-hubs.md
  Commit: Y | feat(components): add ComparisonTable for side-by-side tool comparisons

- [ ] 3. Build ProsCons.vue
  What to do / Must NOT do: Create `.vitepress/theme/components/ProsCons.vue` — a structured pros/cons card with a verdict badge. Props: `pros` (array of string: advantages), `cons` (array of string: disadvantages), `verdict` (string: overall recommendation), `rating` (number: 1-5). Layout: two-column (pros left/green, cons right/red) on desktop, stacked on mobile. Verdict at the bottom with rating stars. Scoped CSS using --accent-green and --accent-red tokens. Must NOT modify any existing styles.
  Parallelization: Wave 1 | Blocked by: — | Blocks: 5
  References: .vitepress/theme/custom.css:73-82 (--accent-red, --accent-green tokens), .vitepress/theme/components/DifficultyBadge.vue (verdict badge pattern)
  Acceptance criteria (agent-executable): `grep -c "defineProps" .vitepress/theme/components/ProsCons.vue` exits 0
  QA scenarios: happy - card renders with pros column, cons column, verdict, and 5-star rating. failure - empty pros/cons arrays render single-column layout gracefully. Evidence .omo/evidence/task-3-smart-resource-hubs.md
  Commit: Y | feat(components): add ProsCons card with verdict and rating

- [ ] 4. Build RankCard.vue
  What to do / Must NOT do: Create `.vitepress/theme/components/RankCard.vue` — a numbered ranking card for ordered tool lists. Props: `rank` (number: 1-based), `title` (string: tool name), `description` (string: one-line), `difficulty` (string: 'beginner' | 'intermediate' | 'advanced' — passes through to DifficultyBadge if present), `price` (string: $-signs or 'Free'), `link` (string: URL), `tags` (array of string). Renders as a card with a large rank number on the left, tool info in center, tags/badges on the right. Scoped CSS. Must NOT have position: absolute or fixed for the rank number (use flex layout).
  Parallelization: Wave 1 | Blocked by: — | Blocks: 5
  References: .vitepress/theme/components/DifficultyBadge.vue (badge pattern, $price tag could follow same style), travel.md:30-88 (strength-row pattern for comparison)
  Acceptance criteria (agent-executable): `grep -c "defineProps" .vitepress/theme/components/RankCard.vue` exits 0
  QA scenarios: happy - renders rank #1-5 with all props. failure - missing difficulty or price renders without badge gracefully. Evidence .omo/evidence/task-4-smart-resource-hubs.md
  Commit: Y | feat(components): add RankCard for numbered tool rankings

- [ ] 5. Register components in index.js
  What to do / Must NOT do: Add import and app.component(...) entries in `.vitepress/theme/index.js` for all 4 new components: QuickPick, ComparisonTable, ProsCons, RankCard. Follow the exact existing pattern (import at top, app.component in enhanceApp). Must NOT disrupt any existing registrations. Must NOT rename existing components.
  Parallelization: Wave 1 | Blocked by: 1, 2, 3, 4 | Blocks: 6
  References: .vitepress/theme/index.js:84-109 (all 23 existing component registrations — exact pattern to follow)
  Acceptance criteria (agent-executable): `grep -c "app.component('QuickPick'" .vitepress/theme/index.js` exits 0 AND `grep -c "app.component('ComparisonTable'" .vitepress/theme/index.js` exits 0 AND `grep -c "app.component('ProsCons'" .vitepress/theme/index.js` exits 0 AND `grep -c "app.component('RankCard'" .vitepress/theme/index.js` exits 0
  QA scenarios: happy - `git diff` shows 8 new lines (4 imports + 4 registrations) only. failure - registration typo (component name mismatch with import). Evidence .omo/evidence/task-5-smart-resource-hubs.md
  Commit: Y | feat(components): register QuickPick, ComparisonTable, ProsCons, RankCard globally

- [ ] 6. Convert travel.md to hub format
  What to do / Must NOT do: Restructure `/Users/cameroncenteno/my-docs/travel.md` (492 lines) to use new hub components throughout. For each of the 12 sections, replace flat text with structured hub elements following these rules:
    - **Flight Planning & Booking** (3 tools: Google Flights, Skyscanner, Skiplagged): Add `<ComparisonTable>` comparing features, `<RankCard>` list ranked #1-3, `<QuickPick>` for best overall
    - **Train & Ground Transport** (2 tools: Seat61, Station View): Add `<QuickPick>` + `<ProsCons>` for each
    - **Maps & Navigation** (6 tools: Google Maps, Apple Maps, Waze, Bing Maps, OsmAnd, CoMaps): Add `<ComparisonTable>` (2-3 rows: offline, privacy, navigation quality), `<RankCard>` list ranked
    - **Accommodation** (2 tools: CozyCozy, Trustroots): Add `<QuickPick>` + `<ProsCons>`
    - **Passport, Visa & Entry** (keep step-card checklist as-is, it's already structured well)
    - **Weather & Environment** (4 tools: Windy, Ventusky, Tropical Tidbits, XWeather): Add `<RankCard>` list
    - **Destination Inspiration** (5 tools: Atlas Obscura, UNESCO, Roadside America, Wikivoyage, Wikitravel): Add `<ComparisonTable>` + `<RankCard>`
    - **Cultural & Etiquette** (1 tool: Cultural Atlas): Keep as-is (single resource)
    - **Special Interest Travel** (multiple sub-sections): Add `<QuickPick>` per sub-category
    - **Essential Tools** (1 tool: eSIMDB): Keep as-is (single resource, tip block already present)
    - **Overland Speed Matrix** (keep as-is — strength-chart is well-structured comparison)
    - **Credits & Resources** (keep as-is — sources-grid already uses source-card pattern)
    - Must NOT delete any tool recommendations. Must NOT change anchor IDs. Must NOT remove BackLinks. Must NOT break the hero/intro section (only reformat the body). Must NOT remove or change the scoped CSS for strength-chart, steps-grid, sources-grid, or mobile breakpoint. Must NOT add new dependencies.
  Parallelization: Wave 1 | Blocked by: 5 | Blocks: 7
  References: travel.md (full file 492 lines — scoped CSS 251-490, 12 content sections + hero + sources + BackLinks), shopping-resources.md (267 lines — current flat list pattern to avoid), all 4 new component files
  Acceptance criteria (agent-executable): `git diff --stat travel.md` shows changes AND `bash -c 'grep -c "QuickPick\|ComparisonTable\|ProsCons\|RankCard" travel.md'` exits 0 (at least one of each component used)
  QA scenarios: happy - `npx vitepress build` succeeds, travel.md renders with hub components. failure - component prop type mismatches cause build warnings. Evidence .omo/evidence/task-6-smart-resource-hubs.md
  Commit: Y | feat(guides): convert travel.md to smart hub format with rankings, comparisons, and recommendations

- [ ] 7. Write conversion playbook
  What to do / Must NOT do: Create `.omo/playbooks/hub-conversion.md` documenting the conversion pattern so other guides can be converted. Must cover: (1) New component reference (QuickPick, ComparisonTable, ProsCons, RankCard — with prop signatures), (2) Conversion checklist (identify tools per section → determine comparison axes → rank by relevance → add pros/cons → add quick pick), (3) Example: how travel.md sections were converted, (4) CSS notes (scoped vs global, design token usage), (5) Test checklist (build succeeds, components render, responsive at 640px). Must NOT include implementation instructions for components (they already exist).
  Parallelization: Wave 1 | Blocked by: 6 | Blocks: F1-F4
  References: travel.md (post-conversion — the reference example), all 4 components' prop signatures
  Acceptance criteria (agent-executable): `wc -l .omo/playbooks/hub-conversion.md` >= 30 (reasonable minimum for a useful playbook)
  QA scenarios: happy - playbook contains all 5 required sections. failure - missing prop signatures or checklist. Evidence .omo/evidence/task-7-smart-resource-hubs.md
  Commit: Y | docs: add hub conversion playbook for future guide migrations

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.
- [ ] F1. Plan compliance audit — verify todos 1-7 completed as specified, no scope creep
- [ ] F2. Build verification — `npx vitepress build` succeeds with zero errors/warnings
- [ ] F3. Component rendering — open travel.md in dev server, visually confirm QuickPick, ComparisonTable, ProsCons, RankCard all render correctly at desktop and 640px mobile widths
- [ ] F4. Scope fidelity — confirm no other guides modified, no homepage changes, no config changes, all existing travel.md content preserved

## Commit strategy
- Todo 1-7 each commit independently with conventional commit format
- Commit order: components → index.js → travel.md → playbook
- Final squash optional, but independent commits preserve audit trail

## Success criteria
- travel.md renders with at least one QuickPick, one ComparisonTable, one ProsCons, and one RankCard component
- All existing tool recommendations present
- `npx vitepress build` succeeds with zero errors
- No changes outside scope (guides/components/index.js/playbook)
- Conversion playbook is ready for future guide migrations
- All 7 todos committed with clear messages
