# Implementation Plan: Timeline music layer

**Branch**: `master` (direct) | **Date**: 2026-10-05 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/011-timeline-music-layer/spec.md`

## Summary

Eight songs from `editorial/music.yaml` appear in the home page timeline as identical, image-free cards headed „♫ Mit hallgatott Budapest? · <year>”.

At build time:
- each song is validated
- its YouTube id is derived from its URL
- its anchor (`zene-<year>-<slug>`) is built
- it is placed in the era containing its year, after that era's last event of the same or an earlier year

Each card is a timeline row (`li.event.event--music`) that shares the axis. It is not an event, so the counts, JSON-LD and site tests stay events only. It rides with the scope slider's Környék step through three extra CSS selectors.

A small module script (`music-player.ts`) creates one `youtube-nocookie.com` iframe on the first „Meghallgatom” press, and controls it with the embed's postMessage commands. It loads no YouTube API script. The script keeps the cards and the sticky player in sync (Meghallgatom, Most szól, Folytatás). It also handles switching songs in the same iframe, jumping back to the card, closing, the fallback for unplayable videos, and the bottom space.

Without JavaScript each card shows a plain „YouTube ↗” link in place of the button, chosen by CSS under the existing `html[data-scope]` signal so nothing shifts. Optional statistics events go through the existing consent-gated `statistics.ts`. The Jelmagyarázat, the Impresszum and the README get short additions.

**Owner attention**: YouTube's embed rules require a player viewport of at least 200 × 200 px with nothing covering it (research R9). So the narrow-screen player is about 340 px tall, less compact than in the request. The year, title and performer still lead through size and order.

## Technical Context

**Language/Version**: TypeScript 6.0.3, Node ≥ 22.18 < 23

**Primary Dependencies**: Astro 7.3.3, yaml 2.9.1 and `astro/zod` (already used for editorial files), lucide-static 1.47.0 (adds the `music`, `play`, `pause`, `arrow-up` and `x` icons). No new dependencies.

**Storage**: Content in `editorial/music.yaml`. Nothing is stored in the browser. The player state lives only in the page.

**Testing**:
- Vitest `unit` for `src/lib/timeline/music.ts`, the music audit and the statistics mapping
- Vitest `site` for the built markup ([contracts/site-pages.md](contracts/site-pages.md))
- html-validate, linkinator and Lighthouse CI
- Manual browser scenarios in [quickstart.md](quickstart.md), since the project has no browser test runner

**Target Platform**: Static files on Firebase Hosting, for evergreen and mobile browsers. `ResizeObserver`, `postMessage` and the iframe `allow` attribute are available in all of them.

**Project Type**: Static website (Astro SSG)

**Performance Goals**: Constitution II on `/`, with no song started. There are no YouTube requests on load. There is no layout shift on load or when the player opens: it is fixed, and the page gains bottom space only at the end.

**Constraints**:
- At most one iframe.
- No overlays on the iframe, and a minimum 200 × 200 px video viewport (R9).
- The word „YouTube” appears only on the player's link, the fallback and the no-JS link.
- Music is not in the event counts or the JSON-LD.
- No inline styles: CSS variables are set on `<html>`.

**Scale/Scope**: 8 music entries and 135 events in 4 eras. 2 new components (`MusicEntry.astro`, `MusicPlayer.astro`), 1 new script, 1 new lib module, about 12 touched files.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | How |
|---|---|---|
| I. Static HTML First | ✅ | Cards are static HTML with all their text. Without JS, the CSS shows a plain „YouTube ↗” link instead of the button, and there is no player (R7). |
| II. Performance Budget | ✅ | No images. One SVG icon reused. No third-party request before a press. About 2.4 KB of new JS gzipped (R16), deferred and idle until a press. The fixed player adds no layout shift; the bottom space comes after the content. |
| III. Mobile-First | ✅ | Full-width player on narrow screens, with ≥ 44 px controls (R14). It works from 320 px: the 200 px video viewport fits within 320 − 2 × gutter wide. Keyboard and screen reader support per R14. |
| IV. Minimalism | ⚠️ Justified | Vanilla code, no library, no YouTube API script (R8). The embed follows the v1.4.0 exception: the privacy-enhanced domain, only after a press, one at a time, disclosed in the Impresszum. The site-wide JS goes from about 27.7 KB to about 30 KB against the 20 KB cap (see Complexity Tracking). |
| V. Metadata | ✅ | Title, description and sitemap are unchanged. Music cards are not emitted as `Event` JSON-LD (FR-008). Each card has a stable anchor, and linkinator checks the fragments. |
| Quality gates | ✅ | Site tests follow [contracts/site-pages.md](contracts/site-pages.md). The 320, 768 and 1280 px checks cover the player (quickstart 11, 12). |

**Post-design re-check**: no new violations. Two items need care:
- The consent notice also sits fixed at the bottom of the screen. Both now feed one `padding-bottom` sum through CSS variables, so `statistics.ts` stops writing `body.style.paddingBottom` (R12).
- The 200 × 200 px minimum (R9) makes the narrow-screen player larger than the request's "kompakt". This follows the provider's terms; the owner should confirm it's acceptable.

## Project Structure

### Documentation (this feature)

```text
specs/011-timeline-music-layer/
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
editorial/music.yaml                  # NEW – the eight songs (notes and recordings filled editorially)
src/lib/timeline/music.ts             # NEW – URL → id, anchors, era by year, placement, entry building
src/lib/editorial/schema.ts           # + musicEditorialSchema (strict; no image fields)
src/lib/editorial/audit.ts            # + scope 'music': empty note, note needing review, empty recording
src/lib/site-data.ts                  # reads music.yaml; Era gains items (events + music)
src/lib/icons.ts                      # + music, play, pause, arrowUp, close icons
src/components/MusicEntry.astro       # NEW – the one card design
src/components/MusicPlayer.astro      # NEW – hidden player shell + module script import
src/scripts/music-player.ts           # NEW – iframe on first press, postMessage, states, jump, close, layout vars, d18:music events
src/pages/index.astro                 # renders era.items; adds MusicPlayer
src/components/Legend.astro           # + „Mit hallgatott Budapest?” group; slider text notes music from Környék
src/scripts/timeline-scope.ts         # announcement counts only non-music rows
src/scripts/statistics.ts             # --consent-notice-height instead of inline padding; forwards d18:music
src/lib/statistics/events.ts          # skips player links; musicStatisticsEvent
src/pages/impresszum/index.astro      # data-handling paragraph on the embed (R17)
src/styles/timeline.css               # card, player, scope selectors for .event--music, bottom space, print
tests/unit/music.test.ts              # NEW
tests/unit/editorial.test.ts          # music audit cases
tests/unit/statistics.test.ts         # player link skip, music events
tests/site/output.test.ts             # music contract
README.md                             # "Add or change a song" section; music layer in Layout and design
```

**Structure Decision**: This keeps the single Astro project. The music logic is pure and sits in `src/lib/timeline/` next to `scope.ts` and the parser, so it is unit-tested without a build. The card and the player are separate components: the card repeats eight times, while the player is a page-level singleton. Their styles go in `timeline.css`, which already holds the home-page timeline and slider. The behaviour is one module script, imported only by the player component on the home page.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| Site-wide JavaScript about 30 KB against a 20 KB cap (principle IV). Measured gzipped: `music-player.ts` 2,303 B, plus about 0.2 KB in `statistics.ts`, added to the existing PhotoSwipe and slider overrun. | In-page playback with one shared player, card and player state sync, switching songs, jump back, error fallback and bottom space all need a script. Play/pause sync talks to the embed through postMessage, which is cheaper than the provider's API script. | Plain links to YouTube need no script, but they leave the page. That breaks FR-011 and FR-012 and the feature's purpose. YouTube's own iframe per card would mean eight embeds, against FR-012 and FR-023. |
| The narrow-screen player is about 340 px tall, not "kompakt" (spec FR-013). | YouTube's Required Minimum Functionality rules: at least a 200 × 200 px player viewport, with no overlays. | A thumbnail-sized or hidden player would break the provider's terms, and could be treated as audio-only playback. |
