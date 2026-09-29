---

description: "Task list for the closing section after the timeline"
---

# Tasks: Closing section after the 1968 timeline

**Input**: Design documents from `/specs/006-timeline-closing/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/timeline-closing.md](contracts/timeline-closing.md), [quickstart.md](quickstart.md)

**Tests**: the plan asks for these:
- site-output assertions for the closing block
- a scratchpad puppeteer check of the axis end and the line geometry
- the existing HTML validation, link and Lighthouse checks

**Organization**: tasks are grouped by user story. Run every command as `source ~/.nvm/nvm.sh && nvm use && corepack pnpm …` from the repository root.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on an unfinished task).
- **[Story]**: US1–US2 from spec.md.

---

## Phase 1: Setup

No setup is needed. There are no new dependencies, and the tooling is unchanged.

## Phase 2: Foundational

- [X] T001 Create `src/components/TimelineClosing.astro` with the markup from contracts/timeline-closing.md:
  - `<section class="container timeline-closing" aria-labelledby="tortenet-folytatodik">`
  - `<h2 id="tortenet-folytatodik">A történet folytatódik</h2>`
  - the two paragraphs, verbatim from data-model.md

  Rules:
  - The rule for paragraph 2: "only „írjon” is a link, to `/impresszum/`, and the final full stop is outside the link". Write it as `…a házról, <a href="/impresszum/">írjon</a>.`
  - No `<hr>`, image, icon, button or year.
- [X] T002 In `src/pages/index.astro`:
  - Render `<TimelineClosing />` after the `eras.map(…)` block, inside `<Base>`.
  - Add the class `timeline--ends` to the final era's `<ol class="timeline">`: `class:list={['timeline', index === eras.length - 1 && 'timeline--ends']}`, with `index` from `eras.map((era, index) => …)`.

**Checkpoint**: `pnpm build:release` puts the block once in `dist/index.html`, after the last `era-events` section.

---

## Phase 3: User Story 1 – The reader sees where the documented history ends (P1) 🎯 MVP

**Goal**: the axis stops at the last marker, then a larger pause, the short centred line, and the undecorated centred block.

**Independent test**: [quickstart](quickstart.md) §2, the axis, gap, line and layout parts, at 320, 768 and 1280 px.

- [X] T003 [US1] In `src/styles/timeline.css`, end the final era's axis at its last marker (research R1):
  - `.timeline--ends::before { content: none; }`.
  - `.timeline--ends .event { position: relative; }`.
  - `.timeline--ends .event::before`: the same axis as `.timeline::before`, with `content: ''`, `position: absolute`, `top: 0`, `bottom: 0`, `width: 1px` and `background: var(--d18-rule)`. Put `left` at the same value as today, both mobile (`calc(var(--axis-col) / 2)`) and inside the `@media (min-width: 760px)` block. On wide screens `.event` has `padding-inline: 0.75rem` and `margin-inline: -0.75rem`, so offset the row's axis by `0.75rem`.
  - `.timeline--ends .event:last-child::before { bottom: auto; height: calc(1.1rem + var(--axis-col) / 2); }`, so it ends at the node's centre, given the row's `padding-block: 1.1rem`.
  - Make sure the axis is drawn under the node: `.event__node` already has `z-index: 1`.
- [X] T004 [US1] In `src/styles/timeline.css`, add the closing styles from contracts/timeline-closing.md:
  - `.timeline-closing { margin-top: 5rem; padding-bottom: 1rem; text-align: center; }`, with no background, border or box-shadow.
  - `.timeline-closing::before { content: ''; display: block; width: 4.5rem; height: 1px; margin: 0 auto 2rem; background: var(--d18-sand); }`.
  - `.timeline-closing > * { max-width: 36rem; margin-inline: auto; }`.
  - `.timeline-closing h2 { font-size: clamp(1.8rem, 5vw, 2.4rem); margin-bottom: 1rem; }`.
  - `.timeline-closing p + p { margin-top: 1rem; }`.
- [X] T005 [US1] In `tests/site/output.test.ts`, add a 'timeline closing' block:
  - `index.html` contains exactly one `<section class="container timeline-closing"`.
  - It comes after the last `id="esemenyek-1946-1968"` and before `</main>`.
  - It contains no `<hr`, `<img`, `<svg`, `<button` or `<time`, and no four-digit year.
  - The final era's `<ol` has `timeline--ends`, and only one list does.
  - No other page (`epitok`, `nevado`, `impresszum`, `404.html`) contains `timeline-closing`.
- [X] T006 [US1] Run quickstart §2 with a scratchpad puppeteer script on `pnpm preview` at 320, 768 and 1280 px. Measure:
  - **The axis end**: the last event's `::before` bottom equals the node's centre, ±1 px.
  - **The gap**: from the last event's bottom to the line, ≥ 2× the gap between two events.
  - **The line**: its thickness and width against the content width, and the line's and heading's centres against the container's centre, ±1 px.
  - **Scrolling**: `scrollWidth` at 320 px.
  - **The menu**: `aria-current="location"` stays on `/#korszak-1946-1968` with the block in view.

  Fix any failure in `src/styles/timeline.css`.

**Checkpoint**: the documented timeline visibly ends, and the pause and line follow.

---

## Phase 4: User Story 2 – The reader is invited to share their memories (P1)

**Goal**: the verbatim text, and a working „írjon” link.

**Independent test**: quickstart §1 and §2 (the focus part), and a click on „írjon” opens `/impresszum/`.

- [X] T007 [US2] Extend the 'timeline closing' block in `tests/site/output.test.ts`:
  - The heading is exactly `A történet folytatódik`.
  - Paragraph 1 is exactly the text in data-model.md.
  - Paragraph 2, with the tags removed, is exactly the text in data-model.md.
  - The block's only `href` is `/impresszum/`, and its link text is exactly `írjon`, followed by `</a>.`
- [X] T008 [US2] In the scratchpad puppeteer script from T006, Tab to „írjon” and check that it has a visible focus outline. Then click it and check that the URL becomes `/impresszum/`.

---

## Phase 5: Polish

- [X] T009 [P] In `README.md` (Layout and design), add one sentence: after the last event, a short centred line and „A történet folytatódik” close the timeline (`src/components/TimelineClosing.astro`), and the text is edited in that file.
- [X] T010 Run `pnpm check && pnpm test && pnpm build:release && pnpm test:site && pnpm lighthouse` (with `CHROME_PATH=/snap/bin/chromium`). The home page must meet every principle II threshold (SC-005).

---

## Dependencies & execution order

- T001 → T002 → US1 (T003 and T004 both touch `src/styles/timeline.css`, so they run in order, then T005 and T006).
- US2 (T007 and T008) depends only on T002, and can run alongside T003–T006.
- T009 can run at any time. T010 comes last.

## Parallel examples

- T005 (site tests) while T003 and T004 are being styled.
- T009 (README) alongside everything.

## Implementation strategy

- **MVP**: T001–T006. The block is shown, and the timeline visibly ends.
- **Then**: the verbatim-text and link checks (US2), the README, and the full quality gates.
