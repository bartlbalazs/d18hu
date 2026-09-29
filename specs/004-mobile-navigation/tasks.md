---

description: "Task list for the mobile-friendly top menu"
---

# Tasks: Mobile-friendly top menu

**Input**: Design documents from `/specs/004-mobile-navigation/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/site-menu.md](contracts/site-menu.md), [quickstart.md](quickstart.md)

**Tests**: the plan asks for these:
- unit tests for `currentEraIndex`
- site-output assertions for the menu markup
- the existing HTML validation, link and Lighthouse checks

**Organization**: tasks are grouped by user story. Run every command as `source ~/.nvm/nvm.sh && nvm use && corepack pnpm …` from the repository root.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on an unfinished task).
- **[Story]**: US1–US4 from spec.md.

---

## Phase 1: Setup

No setup is needed. There are no new dependencies, and the tooling is unchanged.

---

## Phase 2: Foundational

**Purpose**: the new header markup that every story builds on.

- [X] T001 Restructure `src/components/SiteHeader.astro` to match the markup in contracts/site-menu.md.
  - Inside `<nav aria-label="Fő navigáció">`, add `<button class="menu-button" type="button" popovertarget="fomenu">Menü</button>`, then `<div class="site-menu" id="fomenu" popover>`.
  - The `div` holds:
    - a `<p class="site-menu__heading" id="menu-korszakok">Korszakok</p>` followed by `<ul class="site-nav" aria-labelledby="menu-korszakok">` with the 4 era links
    - a `<p class="site-menu__heading" id="menu-oldalak">Oldalak</p>` followed by `<ul class="site-nav site-nav--pages" aria-labelledby="menu-oldalak">` with Építők, Névadó and Impresszum
  - Keep each link's current `href`, label, era `aria-label` and `aria-current="page"` logic.
  - Remove the old `site-nav__pages` class.
  - Data-model rule: "exactly 7 destinations. There are no additions, renames or reordering".
- [X] T002 Set `--header-height: 61px` at all widths in `src/styles/tokens.css`: drop the 113px default and the ≥ 900 px override, and update the comment. The header is now one row everywhere (R3).

**Checkpoint**: `pnpm build:draft && pnpm test:site` still passes. The existing nav-order test must hold, because the links are still inside the one `nav`.

---

## Phase 3: User Story 1 - Reach every page from the menu on a phone (Priority: P1) 🎯 MVP

**Goal**: below 900 px, the header is one row with the brand and a Menü button. The button opens a panel with every destination.

**Independent test**: at 360 px, open all 7 destinations from the top of any page with no sideways swiping (quickstart.md "Manual: small screens").

- [X] T003 [US1] Rewrite the header and nav styles in `src/styles/base.css`, mobile-first. Replace the old "Narrow screens: one row that scrolls sideways" block and its `@media (min-width: 900px)` block.
  - `.site-header__inner` is one row: `flex-wrap: nowrap`, brand left, nav right.
  - `.menu-button` is a ≥ 44 × 44 px text button, labelled "Menü", in `--font-text` at 0.9375rem. It uses the ink colour with a 1px `--d18-rule` border and the paper background. `:focus-visible` uses the global focus style. `[aria-expanded="true"]` / `:has(+ .site-menu:popover-open)` get a pressed look.
  - `.site-menu:popover-open` is a sheet below the header:
    - `position: fixed; inset: var(--header-height) 0 auto 0; margin: 0`
    - `max-height: calc(100dvh - var(--header-height)); overflow-y: auto`
    - full width, `background: var(--d18-paper)`, bottom border and shadow `--d18-rule`
    - padding `1rem var(--gutter) 1.5rem`
  - `::backdrop` is a light translucent ink, so outside taps are clearly "outside".
  - `.site-menu__heading` is a small uppercase kicker, like `.kicker`, with a gap above the second group.
  - Inside the panel, `.site-nav` is a vertical list. Links are block-level with `min-height: 44px` and `font-size: 1.0625rem`.
  - `.site-nav a[aria-current='page']` keeps the ink colour and underline.
  - Everything must fit at 320 px and at 200% text zoom (SC-004), with no `white-space: nowrap` overflow in the panel.
- [X] T004 [US1] Add the wide-screen override in the same file, `src/styles/base.css`, with `@media (min-width: 900px)`:
  - `.menu-button { display: none }`
  - `.site-menu, .site-menu:popover-open` override the browser popover styles: `display: flex; position: static; inset: auto; margin: 0; padding: 0; border: 0; background: none; box-shadow: none; overflow: visible; max-height: none; width: auto; color: inherit`, with `align-items: center`.
  - `.site-menu__heading` is visually hidden, using the same rules as `.visually-hidden`.
  - `.site-nav` is `display: flex; gap: 1.4rem`, with links in muted colour, `white-space: nowrap` and 0.9375rem, as today.
  - `.site-nav--pages { margin-left: 2rem }`, replacing `.site-nav__pages` (1.4rem gap + 0.6rem).
- [X] T005 [US1] Add the no-popover fallback to `src/styles/base.css` with `@supports not selector(:popover-open)`. `.menu-button` is `display: none`. On small screens, `.site-menu` is a static block under the brand (`.site-header__inner` wraps), so every destination stays reachable (R1).
- [X] T006 [P] [US1] Add a `describe('site menu')` block to `tests/site/output.test.ts` that checks each file in `PAGES` and `404.html`:
  - exactly one `popovertarget="fomenu"` button with the text `Menü`
  - one `id="fomenu"` element with the `popover` attribute
  - headings `Korszakok` and `Oldalak`, each referenced by an `aria-labelledby`
  - within "Fő navigáció", the non-`/` links in order: the 4 `/#korszak-…` links, then `/epitok/`, `/nevado/`, `/impresszum/`
  - no `aria-current="location"` in the built HTML
  - on `nevado/index.html`, `aria-current="page"` on the `/nevado/` link

**Checkpoint**: US1's acceptance scenarios 1, 2 and 4 pass in the preview at 320, 360, 390 and 430 px. With JavaScript disabled everything works, except that the panel stays open after an era link.

---

## Phase 4: User Story 2 - Keyboard, screen reader and no JavaScript (Priority: P1)

**Goal**: full keyboard and screen-reader use, and closing behaviour enhanced by a script.

**Independent test**: quickstart.md "Manual: no JavaScript" and "Manual: screen reader".

- [X] T007 [US2] Create `src/scripts/site-menu.ts`, a vanilla module with a top comment like `lightbox.ts` ("Progressive enhancement only: …"):
  - Look up `#fomenu`. If the element is missing, or `HTMLElement.prototype.showPopover` doesn't exist, return early.
  - A `click` listener on the panel: when the target is inside an `a`, call `menu.hidePopover()` if `menu.matches(':popover-open')`.
  - `window.matchMedia('(min-width: 900px)')` `change` listener: call `hidePopover()` if the panel is open.
- [X] T008 [US2] Load the script from `src/layouts/Base.astro` with a bundled `<script>import '../scripts/site-menu.ts';</script>` at the end of `<body>`, so it runs on every page.
- [X] T009 [US2] Verify, and fix in `src/components/SiteHeader.astro` or `src/styles/base.css` if needed:
  - Tab order is brand → Menü → links.
  - Enter or Space toggles the panel. Escape closes it with focus back on Menü.
  - The popover's `aria-expanded` is exposed in Chromium and Firefox DevTools' accessibility pane.
  - The panel has no focus trap: Tab past the last link moves on to the page.
  - Every focus style is visible.

**Checkpoint**: all US2 acceptance scenarios pass.

---

## Phase 5: User Story 3 - The desktop menu stays as it is (Priority: P2)

**Goal**: from 900 px up, the header looks and behaves as before.

**Independent test**: at 1280 px, the header matches the live site: one row, no Menü button.

- [X] T010 [US3] Build `pnpm build:release` and compare 1280 × 900 headless screenshots of the header against `https://dembinszky18.web.app/` for `/`, `/epitok/` and `/impresszum/`. Use `/snap/bin/chromium --headless=new --window-size=1280,900 --screenshot=…` and save them to the scratchpad, not the repo. Adjust the `@media (min-width: 900px)` rules in `src/styles/base.css` until the header matches, apart from the highlight added by US4.

---

## Phase 6: User Story 4 - See which era I am reading (Priority: P3)

**Goal**: on the home page, the era being read gets `aria-current="location"` and a distinct style.

**Independent test**: quickstart.md "Manual: era highlight". Scrolling top to bottom highlights none, then each era in turn, and End highlights 1946–1968.

- [X] T011 [P] [US4] Create `src/lib/nav/current-era.ts` exporting `currentEraIndex(openerTops: number[], readingLine: number): number | null`. It returns the largest `i` with `openerTops[i] <= readingLine`, or `null` if there is none. `openerTops` is ascending, in document order.
- [X] T012 [P] [US4] Create `tests/unit/current-era.test.ts` with these cases:
  - every top below the line → `null`
  - the line exactly at an opener's top → that index
  - between openers 1 and 2 → `1`
  - all tops above the line (page end) → `3`
  - an empty array → `null`
- [X] T013 [US4] Extend `src/scripts/site-menu.ts` with the era highlight (R5, R6):
  - Collect `document.querySelectorAll('.era-opener[id^="korszak-"]')`. If there are none, stop.
  - Map each opener to its menu link `a[href="/#<id>"]` inside `#fomenu`.
  - `update()` reads each opener's `getBoundingClientRect().top` and computes the reading line as `parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) + 1`. It calls `currentEraIndex`, sets `aria-current="location"` on the matching link, and removes it from the other era links.
  - Schedule `update` with `requestAnimationFrame` from a passive `scroll` listener, with at most one frame pending. Also run it on `load`, `resize` and `hashchange`.
  - Never touch links that carry `aria-current="page"`.
- [X] T014 [US4] Style the highlight in `src/styles/base.css`: `.site-nav a[aria-current='location']` gets `color: var(--d18-ink); font-weight: 600; text-decoration: none`, plus a `::before` filled dot. The dot is 0.4em, round, `currentColor`, with `margin-right: 0.45em` and `vertical-align: middle`. The rule applies both in the row and in the panel (FR-013: "MUST NOT rely on colour alone").
- [X] T015 [US4] Add the reduced-motion-aware panel transition in `src/styles/base.css` (R8):
  - `.site-menu:popover-open` animates `opacity` 0→1 and `translate` 0 -0.5rem→0 over 150 ms.
  - Use `@starting-style` and `transition-behavior: allow-discrete` on `display` and `overlay`.
  - Wrap the transition in `@media (prefers-reduced-motion: no-preference)`.

**Checkpoint**: SC-006 passes, checking inside each of the 4 eras and in the opening section.

---

## Phase 7: Polish & cross-cutting concerns

- [X] T016 Measure the new script: `gzip -c dist/_astro/<site-menu chunk>.js | wc -c`. Put the measured size in place of the estimate in the plan.md Complexity Tracking row and in research.md R7.
- [X] T017 [P] Update `README.md` under "Layout and design":
  - Below 900 px the header shows a Menü button that opens a popover panel ("Korszakok", "Oldalak"). Wider screens show the single row.
  - `src/scripts/site-menu.ts` closes the panel after a link and highlights the era being read on the home page.
  - Everything works without JavaScript.
  - Also add `specs/004-mobile-navigation/` to the specs list in the intro.
- [X] T018 Run `pnpm check`, `pnpm test`, `pnpm build:release`, `pnpm test:site` and `CHROME_PATH=/snap/bin/chromium pnpm lighthouse`. All must pass, including the principle II thresholds on every page (SC-003).
- [X] T019 Walk through quickstart.md in full at 320, 360, 390 and 430 px, with and without JavaScript, and at 200% zoom. Record the result: 7 of 7 destinations reachable (SC-002), and Névadó reached in ≤ 2 taps (SC-001).

---

## Dependencies & execution order

- **Foundational (T001–T002)** blocks everything.
- **US1 (T003–T006)**:
  - T003 → T004 → T005 run in order, all in `base.css`.
  - T006 can run in parallel once T001 is done.
- **US2 (T007–T009)**: after US1. T008 needs T007.
- **US3 (T010)**: after T004.
- **US4 (T011–T015)**:
  - T011 and T012 run in parallel at any time after Foundational.
  - T013 needs T007 and T011.
  - T014 and T015 edit `base.css` after T005.
- **Polish (T016–T019)**: after the stories.

`src/styles/base.css` (T003, T004, T005, T014, T015) and `src/scripts/site-menu.ts` (T007, T013) are shared files, so the tasks that edit them run in sequence.

## Parallel examples

```text
After T001:  T006 (site test)  |  T011 (currentEraIndex)  |  T012 (unit test)
Polish:      T017 (README)  alongside T016
```

## Implementation strategy

1. **MVP**: Foundational plus US1 (T001–T006). This fixes the reported defect: every destination is reachable on phones, even without JavaScript.
2. **US2**: the script that closes the panel, plus the keyboard and screen-reader checks.
3. **US3**: confirm the desktop header is unchanged.
4. **US4**: the era highlight.
5. **Polish**: measure, document and validate.
