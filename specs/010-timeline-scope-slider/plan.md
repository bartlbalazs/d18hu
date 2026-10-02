# Implementation Plan: Timeline scope slider

**Branch**: `master` (direct) | **Date**: 2026-10-02 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/010-timeline-scope-slider/spec.md`

## Summary

The home page timeline gets a four-step cumulative slider: Ház · Környék · Magyarország · Világ. It starts at Környék, or at the remembered setting when the visitor has accepted cookies.

The setting is one attribute on `<html>`, `data-scope`. A tiny inline script sets it before the timeline is painted, and CSS does everything that must not flash:
- hiding events
- choosing which pre-rendered era count shows
- ending the last era's axis at the last visible event
- narrowing the timeline column on wide screens
- showing the current icon in the round button

Without JavaScript there is no `data-scope`, so every event shows and the slider stays hidden.

A small module script handles everything else:
- the control itself (a native range input with icon labels)
- storage after consent
- the screen-reader announcement
- keeping the reading position
- widening for links to hidden events
- when the panel or round button is shown

On narrow screens the panel is a native popover, so it closes on a tap outside or Escape at no extra cost, like the site menu.

The statistics script gains a consent event, and it deletes the stored setting on withdrawal. The consent notice, the Impresszum data-handling section and the Jelmagyarázat each get a short text addition.

## Technical Context

**Language/Version**: TypeScript 6.0.3, Node ≥ 22.18 < 23

**Primary Dependencies**: Astro 7.3.3, lucide-static 1.47.0 for the four category icons already used in `src/lib/icons.ts`. No new dependencies.

**Storage**: `localStorage` key `d18-idovonal`. It holds one of `house`, `area`, `hungary` or `world`, and is written only while the consent key `d18-statisztika` is `granted` and no browser privacy signal applies (research R5).

**Testing**:
- Vitest `unit` for the pure scope logic in `src/lib/timeline/scope.ts`
- Vitest `site` for the built markup
- html-validate, linkinator and Lighthouse CI on `/`
- Manual browser checks in [quickstart.md](quickstart.md) for the behaviour, since the project has no browser test runner

**Target Platform**: Static files on Firebase Hosting, for evergreen and mobile browsers. Popover, `:has()` and `:nth-last-child(… of S)` are all in the last two versions of every target browser.

**Project Type**: Static website (Astro SSG)

**Performance Goals**: Constitution II. The home page keeps its current Lighthouse scores, CLS ≤ 0.05 and LCP ≤ 2.5 s. Nothing moves when the script starts, because the layout depends only on `data-scope`, which is set before first paint (R2).

**Constraints**:
- No events are removed from the HTML or the JSON-LD (FR-009).
- No inline styles.
- The panel never covers event text, chapter openers, the closing section or the footer.

**Scale/Scope**: 135 events in 4 eras. 1 new component, 1 new script, 1 new lib module, about 8 touched files.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | How |
|---|---|---|
| I. Static HTML First | ✅ | All 135 events stay in the static HTML. Without JS, `data-scope` is never set, so all of them show, the pre-rendered counts show the full totals and the slider stays hidden (FR-010). |
| II. Performance Budget | ✅ | No new images or fonts. About 1.9 KB of new JS, measured (R9). The inline script is under 400 bytes and runs before the timeline is parsed, so there is no layout shift and no flash (R2). |
| III. Mobile-First | ✅ | The round button is 3.25rem (52 px). The panel works from 320 px. The range input supports keyboard, touch and screen readers natively, and announces its value by name through `aria-valuetext` (R3). |
| IV. Minimalism | ⚠️ Justified | Vanilla code only, no library. The site-wide JS total goes from about 25.8 KB to about 27.7 KB (measured) against the 20 KB cap. PhotoSwipe already exceeds the cap with a recorded justification (see Complexity Tracking). |
| V. Metadata | ✅ | Title, description, JSON-LD and sitemap are unchanged. Hidden events stay in the markup and keep their `id`s, so `/#<event-id>` links still work (FR-011). |
| Quality gates | ✅ | The site tests follow [contracts/site-pages.md](contracts/site-pages.md). Unit tests cover the scope logic ([data-model.md](data-model.md)). The 320, 768 and 1280 px checks are extended to 1099, 1100 and 1600 px (SC-005). |

**Post-design re-check**: no new violations. Two items need care:
- The consent notice also sits fixed at the bottom of narrow screens, so the round button hides while the notice is open (R7).
- The last era's axis is drawn per row and ends at `:last-child`, which would point at a hidden event. It switches to `:nth-last-child(1 of …)` per scope (R2).

## Project Structure

### Documentation (this feature)

```text
specs/010-timeline-scope-slider/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/site-pages.md
├── checklists/requirements.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── lib/timeline/scope.ts            # NEW – scope order, categories per scope, counts, storage parsing
├── components/ScopeSlider.astro     # NEW – inline scope script, side panel / popover, round button
├── scripts/timeline-scope.ts        # NEW – control, storage after consent, announcements, reading position, visibility
├── components/Legend.astro          # + closing group describing the slider (FR-013)
├── pages/index.astro                # + ScopeSlider, per-scope era counts
├── scripts/statistics.ts            # + 'd18:consent' event; deletes the stored scope on withdrawal
├── layouts/Base.astro               # consent notice wording (FR-019)
├── pages/impresszum/index.astro     # data-handling wording (FR-019)
└── styles/timeline.css              # scope rules, wide layout from 1100 px, panel, round button, print
tests/unit/scope.test.ts             # NEW
tests/site/output.test.ts            # timeline scope contract
README.md                            # timeline section: the slider, its storage key and consent rule
```

**Structure Decision**: This keeps the single Astro project. The scope logic is pure and lives in `src/lib/timeline/`, next to the parser, so it can be unit-tested and imported by the component, the script and the statistics script. The slider is a component because it holds both markup and the inline script, which needs the constants from `scope.ts` through `define:vars`. Its styles go in `timeline.css`, which already holds everything for the home page.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| Site-wide JavaScript about 27.7 KB against a 20 KB cap (principle IV). Measured gzipped: `timeline-scope.ts` 1,445 B, the inline scope script about 300 B, and a shared 176 B consent chunk. This adds about 1.9 KB to the existing PhotoSwipe overrun. | The owner asked for a slider that travels with the reader, remembers the setting after consent and keeps the reading position. These need a script. Everything that can be CSS is CSS (R2). | A CSS-only control (radio buttons with `:has()`) can't remember the setting, keep the reading position, widen for a link or fade over the chapter openers. Those are FR-011, FR-016 and FR-017. |
