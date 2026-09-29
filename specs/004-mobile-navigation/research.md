# Research: Mobile-friendly top menu

## R1. How the small-screen menu opens without JavaScript (FR-002, FR-006, FR-007)

- **Decision**: Use the HTML Popover API.
  - A `<button popovertarget="fomenu">Menü</button>` opens `<div id="fomenu" popover>`, which holds the two groups.
  - It is declarative, so no script is needed to open or close it.
  - The browser provides these for free:
    - Escape and tapping outside close it (light dismiss).
    - Focus returns to the button when it closes.
    - The button exposes open or closed to screen readers (`aria-expanded` is implied for `popovertarget`).
    - The panel sits in the top layer above the sticky header and the timeline, with no z-index work.
- **Rationale**:
  - The Popover API is Baseline "newly available" since April 2024 (Chrome/Edge 114, Safari 17, Firefox 125). It is the current platform-native way to build a disclosure menu.
  - It meets FR-006 (works without JavaScript) and FR-007 (Escape closes and returns focus) with no code.
- **Fallback**: in browsers without popover support, `@supports not selector(:popover-open)` shows the list inline under the header and hides the button. Every destination stays reachable (FR-001), just without the compact header.
- **Alternatives considered**:
  - `<details>`/`<summary>`. It works without JavaScript, but Escape, closing on outside taps and focus return all need a script. It also can't be forced open on wide screens with CSS in every supported browser.
  - A checkbox hack. Rejected: it has the wrong semantics for screen readers.
  - A script-only toggle with `aria-expanded`. Rejected: the menu wouldn't work without JavaScript (FR-006).

## R2. One menu for both screen sizes (FR-002, FR-009)

- **Decision**: Keep a single `<nav aria-label="Fő navigáció">` holding the button and the popover panel, so the links exist only once in the HTML.
  - Below 900 px, the panel is a popover: hidden until opened, then shown as a full-width sheet under the header, capped at `100dvh − header height` and scrollable.
  - From 900 px up, CSS overrides the browser's popover styles for `.site-menu`: `display: flex`, `position: static`, no inset, border or background. The panel then renders as today's single row, and the button is `display: none`.
  - The group headings ("Korszakok", "Oldalak") are visually hidden on wide screens but still read by screen readers.
- **Rationale**: One set of links means the existing site tests, which check the nav order Építők, Névadó, Impresszum, still hold. It also keeps the desktop header unchanged (FR-009).
- **Alternatives considered**: separate mobile and desktop menus. Rejected: every link would appear twice, screen readers would meet two navigations, and the HTML would get heavier.

## R3. Header height (FR-008, SC-005)

- **Decision**: On small screens the header becomes one row: the brand on the left, the Menü button on the right. That's about 61 px, the same as desktop, instead of today's 113 px two-row header.
  - Update `--header-height` in `src/styles/tokens.css` to match, so anchor targets land below the header.
- **Rationale**: This meets SC-005, since the header is 52 px shorter than today, and it gives reading space back on phones.

## R4. Closing the panel after an era link (US1 scenario 3)

- **Decision**: A small progressive-enhancement script:
  - Calls `hidePopover()` when a link inside the panel is activated.
  - Also closes the panel when the viewport crosses 900 px (a `matchMedia` change), so it can't stay stuck in the top layer after a rotation or resize.
- **Without JavaScript**: the page still scrolls to the era, and the visitor closes the panel with the button, Escape, or a tap outside.
- **Rationale**: FR-006 allows a script to improve closing.
- **Alternatives considered**: `popovertargetaction="hide"` on every link. Rejected: it's only valid on buttons, not links.

## R5. Detecting the era being read (FR-012, SC-006)

- **Decision**: One passive `scroll` listener, throttled with `requestAnimationFrame`.
  - It reads the `top` of the 4 era openers (`#korszak-<id>`) with `getBoundingClientRect()`.
  - It picks the last opener whose top is at or above a reading line: the opener's `scroll-margin-top` (where an era link scrolls it to, header height + 1rem) plus 8 px. The browser can stop a fraction of a pixel short, so a line of exactly the scroll margin missed the era just jumped to.
  - If there is none, the visitor is in the opening section, so no era is highlighted.
  - It also runs once on load and on `hashchange`.
  - The choice is a pure function, `currentEraIndex(openerTops, readingLine)` in `src/lib/nav/current-era.ts`, unit-tested with Vitest.
- **Rationale**:
  - Four rect reads per animation frame cost almost nothing.
  - Unlike an `IntersectionObserver` with a thin root margin, it always picks the right era after a fast jump or a jump to the page end, because it looks at positions, not crossing events. That avoids flicker and missed transitions.
  - Each era's events follow its opener, not nested inside it, so "the last opener above the line" is exactly the era being read.
- **Alternatives considered**:
  - `IntersectionObserver` on the openers. It can miss crossings on jumps, and it needs extra state.
  - CSS scroll-driven animations. They can't set a state on a different element, the menu link.

## R6. How the highlight is exposed and styled (FR-004, FR-013, spec edge case "screen readers")

- **Decision**:
  - The script sets `aria-current="location"` on the highlighted era link and removes it from the others. `aria-current="page"` stays on the story-page links, as now.
  - **Styling**: current page keeps today's underline. The era highlight uses ink colour and a small filled dot, placed absolutely in the gap before the label so the desktop row never shifts while scrolling. In the panel it is also bold, since a vertical list can't shift. The difference doesn't rely on colour alone.
- **Rationale**:
  - `location` is the ARIA value meant for "current location within a context", while `page` marks the page itself.
  - Changing `aria-current` isn't announced on its own: screen readers read it only when the link is focused. So scrolling stays silent, as the spec requires.

## R7. JavaScript budget (Principle IV)

- **Decision**: One new module, `src/scripts/site-menu.ts`, loaded from `Base.astro` on every page. It holds the close-on-link and resize handling, and it runs the era highlight only if era openers exist on the page.
  - Measured size: 1,015 bytes minified, 590 bytes gzipped. Astro inlines a module this small into each page.
  - The site total goes from about 23.4 KB to about 24.0 KB, against the 20 KB cap. The eagerly loaded part goes from 5.2 KB to about 5.8 KB.
- **Rationale**:
  - The overrun is PhotoSwipe's, already justified in `specs/001-d18-history-timeline/plan.md`.
  - The owner asked for the era highlight, which needs a script. There is no CSS-only way to reflect scroll position onto another element.
  - Everything still works without it.
  - This is recorded in Complexity Tracking.
- **Note**: Astro inlines the module because it is under its inline limit. At 590 bytes that costs less than an extra request, so it is left as Astro builds it.

## R8. Motion (FR-011)

- **Decision**: The panel appears instantly when reduced motion is requested. Otherwise it gets a 150 ms opacity and translate transition, using `@starting-style` and `transition-behavior: allow-discrete`.
  - Browsers without these features just show the panel with no animation.
  - The smooth anchor scrolling already honours `prefers-reduced-motion` in `base.css`.
- **Rationale**: This is the current CSS-only way to animate popovers, and it degrades to no animation.
