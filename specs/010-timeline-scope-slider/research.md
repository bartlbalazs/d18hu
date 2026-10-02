# Research: Timeline scope slider

## R1 – One attribute carries the setting

- **Decision**: The current scope is `document.documentElement.dataset.scope`, one of `house`, `area`, `hungary` or `world`. All display rules key off `html[data-scope="…"]`.
- **Rationale**: One source of truth that CSS can read keeps the script small. Hiding events, counts, axis end, column width and the round button's icon then all follow without extra JS. If the attribute is missing, nothing is hidden, which is the no-JS behaviour (FR-010).
- **Alternatives**:
  - Toggling the `hidden` attribute on each event. Rejected: it needs JS before paint for 135 elements and flashes.
  - Removing events from the DOM. Rejected: FR-009.

## R2 – No flash: an inline script plus CSS-only effects

- **Decision**:
  - `ScopeSlider.astro` renders `<script is:inline define:vars={…}>` as the first element of the home page's content. It reads the consent key and the scope key inside `try`. It uses the stored scope only if consent is `granted`, no GPC or DNT signal is set and the value is valid; otherwise it uses `area`. Then it sets `data-scope`. The script runs before the timeline below it is parsed.
  - These follow from `data-scope` in CSS:
    1. **Events**: `.event` rows outside the scope are `display: none`.
    2. **Counts**: each era kicker has four pre-rendered count spans (`data-scope-count`), and only the one matching the scope shows. Without `data-scope`, the `world` span (the full total) shows.
    3. **Axis end**: in `.timeline--ends`, the short axis ends at `.event:nth-last-child(1 of <visible categories>)` instead of `:last-child`.
    4. **Column width**: the narrower column from 1100 px applies only when `html[data-scope]` is set, so it is in place on the first paint.
    5. **Button icon**: the round button holds all four icons, and the one matching the scope shows.
- **Rationale**: The module script runs after parsing. Anything it alone did would show the wrong state first (SC-002) or shift the layout (SC-004). The site has no Content-Security-Policy header (`firebase.json`), so an inline script is allowed. `define:vars` brings the keys and the scope list in from `scope.ts`, so nothing is duplicated by hand.
- **Alternatives**:
  - A `<head>` slot in `Base.astro`. Rejected: it changes every page for a home-page-only need. A body script before the timeline is just as early for everything it affects.
  - Rendering at Környék and widening in JS. Rejected: returning visitors would see a flash.

## R3 – The control: a native range input

- **Decision**:
  - An `<input type="range" min="0" max="3" step="1">`, labelled by the question "Milyen messzire nézzünk a háztól?". Its `aria-valuetext` is the setting's name ("Környék").
  - Below the track, four tick labels each show an icon and a name. They are plain spans: a click on a span sets that step, and they are `aria-hidden` because the input already exposes the same information.
  - A visually hidden `aria-live="polite"` line announces "<name>: <n> esemény" after a change (Edge Cases).
- **Rationale**: A range input already gives arrow keys, Home, End, Page Up and Down, dragging, touch and a screen-reader role. Radio buttons would need extra code for Home and End and don't read as a scale.
- **Alternatives**:
  - Radio buttons. Rejected for the reasons above.
  - A custom ARIA slider. Rejected: more code for the same behaviour.

## R4 – Placement

- **Decision**: One panel element, placed in the DOM after the Jelmagyarázat and before the first chapter opener, so the tab order is logical.
  - **Wide (≥ 1100 px)**:
    - The panel is `position: fixed`, right-aligned to the timeline area and just below the sticky header (`top: calc(var(--header-height) + 1rem)`), about 16rem wide.
    - `.era-events` sections narrow by the panel width plus a gap and shift left, so the timeline column and the panel together stay centred within the 1060 px reading width plus the panel. The chapter openers, hero, Jelmagyarázat and closing are unchanged.
  - **Narrow (< 1100 px)**:
    - The panel gets `popover="auto"` and opens from a round button (`popovertarget`) fixed in the lower right corner.
    - Popover gives light dismiss (a tap outside), Escape and toggling on the button natively (FR-006).
    - On wide screens the CSS shows the panel whether or not the popover is open. Crossing to wide closes an open popover, as the site menu does at 900 px.
- **Rationale**: A fixed panel works across the separate era sections, which `position: sticky` can't do because each sticky element is confined to its parent section. The popover matches the site menu's existing pattern.
- **Alternatives**:
  - Sticky inside each era section. Rejected: it would need four copies of the control.
  - A wrapper grid around all eras. Rejected: the chapter openers must stay full width.

## R5 – Consent and storage

- **Decision**:
  - The stored scope is valid only while `resolveConsent(stored, signals)` returns `granted`. This is the existing rule, so blocked storage, GPC and DNT all count as no consent.
  - The module script writes `d18-idovonal` on every change while consent is `granted`.
  - `statistics.ts` dispatches `document` event `d18:consent` (detail `granted` or `denied`) from `choose()`. On `granted`, the scope script stores the current setting (FR-018). On withdrawal, `statistics.ts` itself removes `d18-idovonal`, so withdrawing from any page deletes it, not only on the home page.
  - The consent notice and the Impresszum page only exist in release builds on the site's own host. Elsewhere nothing is stored, which is correct, since consent can't be given there.
- **Rationale**: Reuses the tested consent function and keeps the two scripts independent. They share only an event name and a storage key.
- **Alternatives**: Having the scope script read consent on every change. That is kept as well, as a guard, but the event is what makes "store at the moment of acceptance" possible.

## R6 – Keeping the reading position and widening for links

- **Decision**:
  - **Reading position**: before a scope change, the script takes as its anchor the first visible event whose bottom is below the sticky header, and notes its `top`.
    - If the anchor stays visible after the change, the script scrolls by the difference in its `top`, with `behavior: 'instant'`.
    - If the anchor is hidden, the script scrolls to the next visible event in document order, or else the previous one, placed at the header line.
  - **Links to hidden events**: on load and on `hashchange`, if the target is an event outside the scope, the script widens to the narrowest scope that includes it (`narrowestScopeFor(category)`) and then scrolls it into view. It only ever widens.
- **Rationale**: Measuring after the change makes the correction exact, whatever the browser's own scroll anchoring did. The browser can't scroll to a `display: none` element, so the script does it.

## R7 – When the panel and the round button show

- **Decision**: A rAF-throttled scroll and resize handler (the `site-menu.ts` pattern) sets `data-visible` on the panel (wide) and on the round button (narrow).
  - **Wide**: visible while some `.era-events` section spans the panel's vertical band (section top ≤ panel top and section bottom ≥ panel bottom). This starts it level with the first era's events and fades it out over each chapter opener and before the closing (FR-007, FR-016).
  - **Narrow**: visible from when the first `.era-events` top enters the viewport until the last `.era-events` bottom rises above the button's area, so it never covers the closing or the footer.
  - **Fade**: when not visible, an element gets `opacity: 0; visibility: hidden`, which also takes it out of the tab order and the accessibility tree. There is an opacity transition, and none under `prefers-reduced-motion`.
  - **Overlaps**: CSS hides the round button while the site menu popover, the PhotoSwipe viewer (`.pswp--open`) or the consent notice is open (`html:has(…)`). The notice sits at the bottom of the screen on a first visit, so the button reappears once the visitor answers it.

## R8 – Print

- **Decision**: `@media print` hides the panel and the round button. Hidden events stay hidden, so the printout matches the current setting, and the count spans follow the same rule.

## R9 – JavaScript size

- **Measured** (gzip -9, release build):
  - `timeline-scope.ts`: 1,445 B, loaded on the home page only
  - the inline scope script: about 300 B
  - a 176 B chunk for `src/lib/statistics/consent.ts`, now shared by the statistics and scope scripts
- **Site-wide total**: about 25.8 KB rises to about 27.7 KB.
- **Side effect**: because `consent.ts` is now shared, Vite no longer inlines the statistics script. Each page loads it as a cached 1.85 KB module plus the 176 B chunk. This is no more bytes, only one small cached request more per page. Lighthouse confirms there's no score change.
- `SCOPE_STORAGE_KEY` lives in `consent.ts`, and `scope.ts` re-exports it, so the statistics script never loads the scope module.
