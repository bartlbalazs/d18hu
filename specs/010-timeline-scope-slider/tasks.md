---

description: "Task list for the timeline scope slider"
---

# Tasks: Timeline scope slider

**Input**: Design documents from `/specs/010-timeline-scope-slider/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/site-pages.md, quickstart.md

**Tests**: The plan asks for unit tests of the pure scope logic and for site tests of the built markup (contracts/site-pages.md), so those tasks are included. Browser behaviour is checked by hand from quickstart.md, because the project has no browser test runner.

**Run tools with Node 22 through Corepack**: `pnpm` is `corepack pnpm`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**:
  - US1 = cumulative zoom
  - US2 = default and remembered setting
  - US3 = the control travels with the reader
  - US4 = Jelmagyarázat text

---

## Phase 1: Setup

No setup is needed. There are no new dependencies or folders beyond the files created below.

---

## Phase 2: Foundational (scope logic)

- [X] T001 Create `src/lib/timeline/scope.ts` (data-model.md):
  - `export const SCOPES = ['house', 'area', 'hungary', 'world'] as const` and `export type Scope = (typeof SCOPES)[number]`
  - `DEFAULT_SCOPE: Scope = 'area'` and `SCOPE_STORAGE_KEY = 'd18-idovonal'`
  - `SCOPE_LABELS: Record<Scope, string>`, built from `CATEGORY_DISPLAY` in `src/lib/icons.ts`, with `house` set to `'Ház'`
  - `categoriesFor(scope)`: returns `SCOPES.slice(0, index + 1)` as `Category[]`
  - `narrowestScopeFor(category: Category): Scope`
  - `scopeCounts(events: { category: Category }[]): Record<Scope, number>` (cumulative)
  - `parseStoredScope(value: string | null): Scope | undefined`
  - `initialScope({ consent, stored }: { consent: ConsentState; stored: string | null }): Scope`: returns the parsed stored value only when `consent === 'granted'`, otherwise `DEFAULT_SCOPE`
  - Import `Category` from `./types.ts` and `ConsentState` from `../statistics/consent.ts`. The category order in `Category` matches `SCOPES`, so a scope value is also the name of the widest category it shows.
- [X] T002 [P] Create `tests/unit/scope.test.ts` with these tests:
  - the order of `SCOPES`
  - `categoriesFor` for all four scopes (house → `['house']` … world → all four)
  - `narrowestScopeFor` for each category
  - `scopeCounts` on a small fixture, for example 2 house, 1 area and 3 world events, giving `{ house: 2, area: 3, hungary: 3, world: 6 }`
  - `parseStoredScope` rejecting `null`, `''`, `'budapest'` and `'World'`
  - `initialScope` returning the stored value only for `granted` and `area` for `denied`, `ask` and invalid values
  - `SCOPE_LABELS` equal to `{ house: 'Ház', area: 'Környék', hungary: 'Magyarország', world: 'Világ' }`

**Checkpoint**: `pnpm test` and `pnpm check` pass.

---

## Phase 3: User Story 1 – Zoom the story out from the house (P1) 🎯 MVP

**Goal**: A working cumulative slider, placed in the page flow after the Jelmagyarázat. Events, era counts and the axis end follow the setting. Without JS, everything shows.

**Independent Test**: In `/`, setting Ház, Környék, Magyarország and Világ shows 45, 88, 114 and 135 events, and each era count matches data-model.md.

- [X] T003 [US1] In `tests/site/output.test.ts`, add `describe('timeline scope', …)` covering contracts/site-pages.md "Home page → Markup". It asserts:
  - 135 `data-event-id` elements are still there.
  - One `id="ido-latomezo"` exists. It sits after `id="jelmagyarazat"` and before the first `class="era-opener`, and it contains the question, the range input (`min="0" max="3" step="1" value="1"`, `aria-valuetext="Környék"`, `aria-labelledby` pointing at the question's id), the four tick labels in order, the explanation and one `aria-live="polite"`.
  - Each tick label contains the same SVG markup as the matching `legend__icon--<category>` in the Jelmagyarázat.
  - The `[data-scope-count]` spans: each era section `esemenyek-<era>` holds four of them, and their numbers equal `scopeCounts` of that era's events, parsed from `input/timeline.md` with `parseTimeline`.
  - An inline script containing `dataset.scope` appears before the first `class="era-opener`.
  - Other pages have no `ido-latomezo`, no `data-scope-count` and no `dataset.scope`.

  Run it and see it fail.
- [X] T004 [US1] Create `src/components/ScopeSlider.astro`. Props: none. Import `SCOPES`, `SCOPE_LABELS`, `DEFAULT_SCOPE`, `SCOPE_STORAGE_KEY` and `CATEGORY_DISPLAY`, and `CONSENT_STORAGE_KEY`. Render:
  1. **The inline script**: `<script is:inline define:vars={{ consentKey: CONSENT_STORAGE_KEY, scopeKey: SCOPE_STORAGE_KEY, scopes: SCOPES, fallback: DEFAULT_SCOPE }}>`. Inside `try`, read both keys. Use the stored scope only if consent is `'granted'`, `navigator.globalPrivacyControl !== true`, `navigator.doNotTrack !== '1'` and `scopes` includes the value. Otherwise, and in `catch`, use `fallback`. Then set `document.documentElement.dataset.scope`. Keep it under 400 bytes minified (research R2).
  2. **The panel**: `<aside class="scope" id="ido-latomezo" popover="auto" aria-labelledby="ido-latomezo-kerdes">` containing:
     - `<p class="scope__question" id="ido-latomezo-kerdes">Milyen messzire nézzünk a háztól?</p>`
     - `<input class="scope__range" type="range" min="0" max="3" step="1" value="1" aria-labelledby="ido-latomezo-kerdes" aria-valuetext="Környék">`
     - `<div class="scope__ticks" aria-hidden="true">` with one `<span class="scope__tick scope__tick--<scope>" data-scope-step="<index>">` per scope, holding `CATEGORY_DISPLAY[scope].icon` (via `set:html`) and `SCOPE_LABELS[scope]`
     - `<p class="scope__help">A csúszka tágítja a történet látómezejét: a háztól egészen a világ eseményeiig.</p>`
     - `<p class="visually-hidden" aria-live="polite" data-scope-status></p>`
  3. **The round button**: `<button type="button" class="scope-toggle" popovertarget="ido-latomezo" aria-label="Milyen messzire nézzünk a háztól?">`, containing four `<span class="scope-toggle__icon scope-toggle__icon--<scope>">` with the category icons.
  4. **The script**: `<script>import '../scripts/timeline-scope.ts';</script>`
- [X] T005 [US1] In `src/pages/index.astro`:
  - Render `<ScopeSlider />` between `<Legend />` and the eras loop.
  - Replace the kicker text `Kronológia · {era.events.length} esemény` with `Kronológia · ` followed by four `<span data-scope-count={scope}>{counts[scope]}</span>` (counts = `scopeCounts(era.events)`) and ` esemény`.
- [X] T006 [P] [US1] In `src/styles/timeline.css`, add a "Timeline scope" section with:
  - **Hiding events**:
    - `html[data-scope="house"] .event:not(.event--house)`
    - `html[data-scope="area"] :is(.event--hungary, .event--world)`
    - `html[data-scope="hungary"] .event--world`

    Each gets `{ display: none; }`.
  - **Counts**: `[data-scope-count]` gets `display: none`. Show `html:not([data-scope]) [data-scope-count="world"]` and `html[data-scope="<s>"] [data-scope-count="<s>"]` for each of the four scopes, as `display: inline`.
  - **Axis end**: for house, area and hungary, `html[data-scope="<s>"] .timeline--ends .event:nth-last-child(1 of <visible category classes>)::before` gets the same `bottom: auto; height: calc(1.1rem + var(--axis-col) / 2)` as `:last-child`. The rows after it are hidden, so the existing `:last-child` rule needs no change.
  - **Hidden without JS**: `.scope, .scope-toggle { display: none; }`. Show them only under `html[data-scope]`.
  - **In-flow panel styles for now**: a bordered card (`--d18-rule`, `--d18-paper-alt`), with the question in `--font-display`, the range input at full width with `accent-color: var(--d18-walnut)`, and the ticks as a 4-column grid under the track, each icon above its label at 0.8125rem. `.scope-toggle` stays `display: none` until US3.
  - **Print**: `@media print { .scope, .scope-toggle { display: none !important; } }`
- [X] T007 [US1] Create `src/scripts/timeline-scope.ts`. It's progressive enhancement: return early if `#ido-latomezo` or the range input is missing. It must:
  - Read the current scope from `document.documentElement.dataset.scope`, falling back to `DEFAULT_SCOPE`, and set the range `value` and `aria-valuetext` to match.
  - Provide `apply(scope, { announce })`:
    1. Keep the reading position (research R6). Before the change, find the first `.event` whose `getBoundingClientRect().bottom` is greater than the header bottom (the computed `--header-height` plus 8px) and note its top.
    2. Set `dataset.scope`.
    3. If the anchor is still rendered (`offsetParent !== null` or `getClientRects().length > 0`), call `scrollBy({ top: newTop - oldTop, behavior: 'instant' })`. Otherwise scroll to the next rendered `.event` in document order, or else the previous one, so its top sits at the header line.
    4. Update `value` and `aria-valuetext`.
    5. If `announce` is set, write `` `${SCOPE_LABELS[scope]}: ${n} esemény` `` into `[data-scope-status]`, where `n` is the number of rendered `.event` elements.
  - Listen for `input` on the range: `apply(SCOPES[Number(value)], { announce: true })`.
  - Listen for `click` on `.scope__ticks`: take the closest `[data-scope-step]` and apply its scope.
  - Widen for links (FR-011), on load and on `hashchange`: if `location.hash` names an element inside an `.event` that isn't rendered, apply `narrowestScopeFor(event.dataset.category)`, only if that is wider than the current scope. Then call `target.scrollIntoView()`.

**Checkpoint**: `pnpm build:release && pnpm test:site` passes T003. Manually (quickstart 2–5 and 9–10), the four settings give 45, 88, 114 and 135 events with the right counts, the last era's axis ends at its last visible event, there's no slider and the full counts show without JS, and the printout follows the setting.

---

## Phase 4: User Story 2 – A first visit starts at Környék, a returning visitor where they left off (P1)

**Goal**: Környék by default without a flash. The setting is remembered only with cookie consent and deleted on withdrawal.

**Independent Test**: A fresh window opens at Környék. After accepting cookies, choosing Világ and reloading, it opens at Világ. After withdrawing, it opens at Környék again and `d18-idovonal` is gone.

- [X] T008 [US2] In `src/scripts/statistics.ts`:
  - At the end of `choose()`, dispatch `document.dispatchEvent(new CustomEvent('d18:consent', { detail: choice }))`.
  - In `withdraw()`, inside `try`, call `localStorage.removeItem(SCOPE_STORAGE_KEY)`, imported from `../lib/timeline/scope.ts`.

  Add a one-line comment saying why the scope key is removed here: withdrawal can happen on any page.
- [X] T009 [US2] In `src/scripts/timeline-scope.ts`, add storage:
  - Work out the consent with `resolveConsent(localStorage.getItem(CONSENT_STORAGE_KEY), { gpc: navigator.globalPrivacyControl, dnt: navigator.doNotTrack })`, inside `try` (an `Error` counts as `denied`).
  - In `apply()`, write `SCOPE_STORAGE_KEY` when consent is `granted`, inside `try`.
  - On the `d18:consent` event, update the consent. If it's `granted`, store the current scope right away (FR-018).
  - Don't remove the key here, because `statistics.ts` does that.
- [X] T010 [US2] In `src/layouts/Base.astro`, add the consent-notice sentence from contracts/site-pages.md to the notice paragraph, before the "Részletek" link: "Ha hozzájárul, azt is megjegyezzük a böngészőjében, milyen messzire állította az idővonal csúszkáját." (FR-019)
- [X] T011 [P] [US2] In `src/pages/impresszum/index.astro`, `#adatkezeles`:
  - Add to the opening paragraph that with consent the timeline setting is also stored in the visitor's browser.
  - Add, after the "Sütik" pair, `<dt>Idővonal-beállítás</dt><dd>`, followed by the text from contracts/site-pages.md (FR-019).
- [X] T012 [US2] In `tests/site/output.test.ts`, add:
  - In `statistics`: every page with the consent notice contains "megjegyezzük a böngészőjében".
  - In `impresszum page`: `#adatkezeles` contains "Idővonal-beállítás" and "d18-idovonal".

**Checkpoint**: Quickstart 1 and 8 pass, with no flash on a throttled reload.

---

## Phase 5: User Story 3 – The control travels with the reader (P2)

**Goal**: On wide screens, a fixed side panel beside a narrower timeline that fades over the chapter openers. On narrow screens, a round button in the lower right that opens the panel as a popover.

**Independent Test**: Quickstart 6 and 7 pass at 360, 768, 1099, 1100, 1280 and 1600 px.

- [X] T013 [US3] In `src/styles/timeline.css`, in the Timeline scope section, add custom properties on `:root`: `--scope-panel: 16rem; --scope-gap: 2rem;`.
  - **Below 1100 px**:
    - `html[data-scope] .scope-toggle`: `position: fixed; right: var(--gutter); bottom: var(--gutter); z-index: 9;` at 3.25rem × 3.25rem with `border-radius: 50%`, the walnut background, paper-coloured icons, a shadow and a visible focus ring.
    - Only `.scope-toggle__icon--<s>` matching `html[data-scope="<s>"]` shows.
    - `.scope:popover-open`: positioned fixed above the button (`inset: auto var(--gutter) calc(var(--gutter) + 4rem) auto; margin: 0; width: min(20rem, 100vw - 2 * var(--gutter))`).
    - `.scope:not(:popover-open)` stays hidden.
  - **From 1100 px**:
    - `html[data-scope] .era-events`: `width: min(100% - 2 * var(--gutter) - var(--scope-panel) - var(--scope-gap), var(--reading-width) - var(--scope-panel) - var(--scope-gap)); margin-inline: max(var(--gutter), (100% - var(--reading-width)) / 2) auto;`
    - `html[data-scope] .scope`: `display: block; position: fixed; top: calc(var(--header-height) + 1rem); right: max(var(--gutter), (100vw - var(--reading-width)) / 2); width: var(--scope-panel); margin: 0; inset-inline-start: auto;` This overrides the popover UA styles.
    - `.scope-toggle` is hidden.
  - **Visibility**: `.scope[data-visible="false"]` and `.scope-toggle[data-visible="false"]` get `opacity: 0; visibility: hidden;`, with `transition: opacity 200ms, visibility 200ms` inside `@media (prefers-reduced-motion: no-preference)`.
  - **Overlaps**: `html:has(#fomenu:popover-open, .pswp--open, #statisztika:not([hidden])) .scope-toggle { visibility: hidden; }` (research R7).
- [X] T014 [US3] In `src/scripts/timeline-scope.ts`, add the visibility logic (research R7), rAF-throttled on scroll, resize and load, following `src/scripts/site-menu.ts`:
  - **Wide** (`matchMedia('(min-width: 1100px)')`): the panel's `data-visible` is `true` while some `.era-events` rect has `top <= panelTop && bottom >= panelBottom`.
  - **Narrow**: the round button's `data-visible` is `true` while the first `.era-events` top is less than `innerHeight` and the last `.era-events` bottom is greater than `innerHeight - 5rem` (in px).
  - Set the element that isn't in use to `data-visible="false"`.
  - On a change to wide, call `hidePopover()` if the panel is `:popover-open`.
  - Run once at start, so the first state is right before the first scroll.
- [X] T015 [US3] In `tests/site/output.test.ts`, add to `timeline scope`:
  - The round button has `popovertarget="ido-latomezo"` and a non-empty `aria-label`, and holds four `scope-toggle__icon--` spans.
  - The built CSS (read the `dist/_astro/*.css` linked from `index.html`) contains `min-width:1100px` and `:popover-open`.

**Checkpoint**: Quickstart 6 and 7 at all six widths, with no overlap of event text, chapter openers, closing or footer (SC-005).

---

## Phase 6: User Story 4 – The Jelmagyarázat explains the slider (P3)

**Goal**: The Jelmagyarázat ends with a description of the slider.

**Independent Test**: The end of the Jelmagyarázat reads as in contracts/site-pages.md.

- [X] T016 [US4] In `src/components/Legend.astro`, after the confidence group, add `<div class="legend__group legend__group--scope">`. It contains `<h3>Milyen messzire nézzünk a háztól?</h3>` and a `<p>` with the text from contracts/site-pages.md ("Az idővonal mellett – keskeny képernyőn a jobb alsó sarokban lévő gombbal – …"). In `src/styles/timeline.css`, make `.legend__group--scope` span both columns from 760 px (`grid-column: 1 / -1`).
- [X] T017 [US4] In `tests/site/output.test.ts`, assert that the Jelmagyarázat section's last `legend__group` contains "Milyen messzire nézzünk a háztól?" and "tágítja a történet látómezejét".

**Checkpoint**: `pnpm test:site` passes.

---

## Phase 7: Polish & Cross-Cutting

- [X] T018 [P] In `README.md`, describe the timeline slider in the home-page section:
  - the four cumulative steps and the Környék default
  - that the setting is stored (`d18-idovonal`) only after statistics consent, and deleted on withdrawal
  - where the code lives (`src/lib/timeline/scope.ts`, `src/components/ScopeSlider.astro`, `src/scripts/timeline-scope.ts`)

  Add spec 010 to the spec list.
- [X] T019 Measure the gzipped size of the new home-page script, and of the inline script, in `dist/` after `pnpm build:release`. Update the Complexity Tracking row in `specs/010-timeline-scope-slider/plan.md` and research R9 with the measured numbers.
- [X] T020 Run the full gate: `pnpm check`, `pnpm test`, `pnpm build:release`, `pnpm test:site` and `pnpm lighthouse`. `/` must keep its scores, with CLS ≤ 0.05 and LCP ≤ 2.5 s. Fix any failure.
- [X] T021 Run the manual quickstart checks 1–11 in `pnpm preview`, at 360, 768, 1099, 1100, 1280 and 1600 px, with a keyboard and with a screen reader. Fix any issue. Then set the spec status to Implemented in `specs/010-timeline-scope-slider/spec.md`.

---

## Dependencies & Execution Order

- **Phase 2** blocks everything. T002 can be written alongside T001.
- **US1 (Phase 3)** is the MVP. T003 comes first (failing test). T004 → T005, with T006 in parallel. T007 after T004.
- **US2** depends on US1's script (T007). T010 and T011 are text-only and could run at any time.
- **US3** depends on US1's markup and styles (T004 and T006).
- **US4** is independent of US2 and US3 and could follow Phase 2 directly.
- **Polish** comes after all stories.

## Parallel Examples

- Phase 2: T001 and T002.
- US1: T006 (CSS) while T004 and T005 are written.
- US2: T010 and T011 while T008 and T009 are written.
- After US1: US3 (T013–T015) and US4 (T016 and T017) on separate files, except that both touch `timeline.css` and `output.test.ts`. Do those edits one after the other.

## Implementation Strategy

1. **MVP**: Phase 2 and US1. The slider works in the page flow, the counts and axis are right, and the page works without JS. This can ship on its own.
2. **Then US2**: the default without a flash, and remembering after consent, with the wording changes.
3. **Then US3**: the travelling panel and the round button. This is the largest visual change, done last of the P1/P2 work so the core is already stable.
4. **Then US4 and the polish.**
