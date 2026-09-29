# Implementation Plan: Mobile-friendly top menu

**Branch**: `004-mobile-navigation` (work continues on the current git branch, `001-d18-history-timeline`) | **Date**: 2026-09-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/004-mobile-navigation/spec.md`

## Summary

On screens narrower than 900 px, the header becomes one row: the brand plus a **Menü** button. The button opens a native HTML popover panel listing the 4 eras under "Korszakok" and the 3 story pages under "Oldalak". It works without JavaScript: Escape, tapping outside and focus return all come from the browser.

From 900 px up, the same panel is styled as today's single row. The layout doesn't change there, and the button is hidden.

A small vanilla script adds three enhancements:
- It closes the panel after a link is chosen.
- It closes the panel when the width crosses 900 px.
- On the home page it highlights the era being read, with `aria-current="location"`. A pure, unit-tested function picks the era from the positions of the era openers.

## Technical Context

**Language/Version**: TypeScript 6.0.3 and Astro 7.3.3 (existing), plus CSS. Node 22 via `.nvmrc`.

**Primary Dependencies**: none new.
- The HTML Popover API is Baseline 2024.
- `@starting-style` is used only for the optional transition.

**Storage**: N/A

**Testing**:
- Vitest unit tests for `currentEraIndex`.
- Site tests in `tests/site/output.test.ts` for the menu markup.
- `html-validate`, linkinator and Lighthouse (existing).
- Manual checks in [quickstart.md](quickstart.md).

**Target Platform**: current mobile and desktop browsers. Browsers without popover support get the list inline.

**Project Type**: static website.

**Performance Goals**: principle II thresholds unchanged. Scrolling stays at 60 fps, with at most 4 rect reads per animation frame.

**Constraints**:
- Works without JavaScript.
- Touch targets ≥ 44 px.
- The header is ≤ 61 px when closed, down from 113 px on phones.
- The desktop header is unchanged.
- The site-wide JavaScript cap is already exceeded by PhotoSwipe (see Complexity Tracking).

**Scale/Scope**: 1 component, 2 stylesheets, 1 new script and 1 new pure function, on 5 pages (4 content pages and the 404 page).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. Static HTML First | ✅ Pass | The menu is static HTML. Opening, closing, Escape and focus return are native popover behaviour, so the menu works with JavaScript disabled ([R1](research.md#r1-how-the-small-screen-menu-opens-without-javascript-fr-002-fr-006-fr-007)). |
| II. Performance Budget | ✅ Pass | About 1 KB more JavaScript, loaded as a module and not render-blocking. A shorter header means less layout. Lighthouse runs on every page. |
| III. Mobile-First | ✅ Pass | This feature is the fix for principle III: no hidden sideways scrolling. The styles are written mobile-first with 44 px targets, and the menu is fully usable by touch, keyboard and screen readers. |
| IV. Minimalism | ⚠️ Justified | No library is added, only vanilla code. The site-wide JavaScript total grows from about 23.4 KB to about 24.0 KB against the 20 KB cap, which PhotoSwipe already exceeded with a justification. See Complexity Tracking. |
| V. Rich Metadata | ✅ Pass | `nav` landmark, labelled lists, `aria-current`. No change to SEO metadata. |
| Quality Gates | ✅ Pass | Site tests, HTML validation, link check, unit tests and Lighthouse on every changed page. |

Post-design re-check: same result. The only deviation is the IV item, recorded below.

## Project Structure

### Documentation (this feature)

```text
specs/004-mobile-navigation/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/site-menu.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
src/components/SiteHeader.astro   # Menü button, popover panel, two labelled groups
src/styles/base.css               # mobile-first header, panel and highlight styles; ≥ 900 px row override
src/styles/tokens.css             # --header-height: 61px at all widths
src/scripts/site-menu.ts          # new: close on link / breakpoint, era highlight
src/lib/nav/current-era.ts        # new: pure currentEraIndex()
src/layouts/Base.astro            # loads site-menu.ts
tests/unit/current-era.test.ts    # new
tests/site/output.test.ts         # menu markup assertions
README.md                         # Layout and design: how the menu works
```

**Structure Decision**: this is a single project. The pure logic goes in `src/lib/` next to the other helpers, and the browser script in `src/scripts/` next to `lightbox.ts`.

## Complexity Tracking

| Violation | Why needed | Simpler alternative rejected because |
|---|---|---|
| Site-wide JavaScript about 24.0 KB against a 20 KB cap (principle IV). The new code adds 590 bytes gzipped (measured) to the existing PhotoSwipe overrun. | The owner asked for the era highlight, which needs a script to reflect scroll position onto the menu. Closing the panel after a link also needs a few lines. | There is no CSS-only way to set a state on the menu from the scroll position. Leaving the highlight out was the owner's earlier default, and they have now asked for it. The menu itself needs no script. |
