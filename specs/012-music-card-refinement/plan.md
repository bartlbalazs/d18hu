# Implementation Plan: Music card refinement

**Branch**: `master` (direct) | **Date**: 2026-10-05 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/012-music-card-refinement/spec.md`

## Summary

The eight „Mit hallgatott Budapest?” cards from 011 are restyled and restructured. Playback is untouched.

- **Timeline position**: `MusicEntry.astro` gains the same `p.event__date` as `TimelineEvent.astro`, and the music-specific grid overrides are dropped. The year then sits in the date column at every width, and the node returns to the shared 38 px size (R1).
- **Card**: the dashed frame becomes a `--d18-paper-alt` surface with `--d18-rule` top and bottom rules. The title uses the event title style. The kicker loses the year (R2).
- **Recording line**: `music.ts` derives one or two short lines from the existing recording fields through a Hungarian phrase map. An unmapped `recording_relation` stops the build (R3, R4).
- **Sources**: a native `<details>` „Források · N” holds the source links, the long recording note and the image credit. It works without JS. Print opens it through CSS, with a small `beforeprint` fallback (R5, R6).
- **Image**: an optional `media` block in `editorial/music.yaml` points to a file in `src/assets/music/`. It is rendered with `astro:assets` `<Picture>` (AVIF/WebP, lazy, fixed size) and given one shared CSS treatment: filter, paper veil, and a left mask fade. A container query on the card switches between the side-by-side and the stacked layout at 38 rem of card width (R7–R11). Release builds require alt, credit and licence. JSON-LD gains an `ImageObject` per music image (R12).
- **Button and player**: the button becomes a lighter outline „▷ Meghallgatom”. The player takes the card's serif year, title and credit styles and also shows the credit (R13, R14).

Per Clarification 1, the owner supplies the image files. Each one goes into `src/assets/music/` with a `media` block in `editorial/music.yaml`, so the site tests and the quickstart check real images.

## Technical Context

**Language/Version**: TypeScript 6.0.3, Node ≥ 22.18 < 23

**Primary Dependencies**: Astro 7.3.3 (`astro:assets` `<Picture>`, already used by `EvidenceFigure.astro`), yaml 2.9.1, `astro/zod`, lucide-static 1.47.0. No new dependencies.

**Storage**: Content in `editorial/music.yaml`. Optional image files in `src/assets/music/`, processed at build time.

**Testing**:
- Vitest `unit`: the recording line, the phrase map, the `media` schema and the audit
- Vitest `site`: the built markup ([contracts/site-pages.md](contracts/site-pages.md))
- html-validate, linkinator and Lighthouse CI
- Manual browser checks in [quickstart.md](quickstart.md), using headless Chromium as in 011

**Target Platform**: Static files on Firebase Hosting, for evergreen and mobile browsers. Container queries, `mask-image` (with the `-webkit-` prefix for older Safari) and `<details>` are available in all of them.

**Project Type**: Static website (Astro SSG)

**Performance Goals**: Constitution II on `/`, with and without a music image. CLS stays ≤ 0.05: the image box takes its size from the text column or a fixed aspect ratio, never from the image (R9).

**Constraints**:
- Only existing palette tokens. No new accent colour (FR-005).
- One card markup for all songs (FR-025).
- No YouTube image on cards (011 FR-004 kept).
- Playback logic unchanged. In `music-player.ts`, only the card symbol (▶ → ▷) and the player's new credit field change.
- No inline styles except the per-image focus point. That one is a CSS custom property in a `style` attribute, which the site's policy allows (R10).

**Scale/Scope**: 8 cards; up to 8 owner-supplied images. About 10 touched files: `MusicEntry.astro`, `MusicPlayer.astro`, `music.ts`, `schema.ts`, `audit.ts`, `index.astro`, `timeline.css`, `music-player.ts`, tests and README. No new component; the card stays one file.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | How |
|---|---|---|
| I. Static HTML First | ✅ | The year, recording line, image and sources are static HTML. The sources disclosure is native `<details>`, so it opens without JS (R5). |
| II. Performance Budget | ✅ | Each image: `<Picture>` with AVIF/WebP and a JPEG fallback, `srcset`/`sizes`, explicit `width`/`height`, `loading="lazy"`, and a box sized independently of the image, so there is no layout shift (R9). About 1 KB more CSS. |
| III. Mobile-First | ✅ | The stacked order is the default. The split layout is added by a container query at 38 rem of card width (R8). The summary and the button stay ≥ 44 px tall. |
| IV. Minimalism | ⚠️ Inherited | No new dependency or library. New JS is under 0.3 KB gzipped: the print fallback, the image-error fallback and the player credit field (R6, R11, R14). The site-wide JS total stays over the 20 KB cap, as already recorded in 011's Complexity Tracking. |
| V. Metadata | ✅ | Each music image gets alt text and an `ImageObject` with caption, credit, licence and source (R12). Music entries stay out of `Event` JSON-LD. The year is a `<time datetime>`. |
| Quality gates | ✅ | Site tests follow [contracts/site-pages.md](contracts/site-pages.md). The quickstart covers 360, 768, 1100 and 1280 px, with and without an image. |

**Post-design re-check**: no new violations.
- 011's Complexity Tracking already records the JS overrun; this feature adds under 0.3 KB to it.
- `src/lib/seo/jsonld.ts` `imageNode` gains an optional `license`. Event images do not pass one yet. Adding it to them is a follow-up, out of scope here.

## Project Structure

### Documentation (this feature)

```text
specs/012-music-card-refinement/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── site-pages.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
editorial/music.yaml                 # optional media block per item
src/assets/music/                    # owner-supplied music images
src/lib/editorial/schema.ts          # musicMediaSchema; musicEditorialItemSchema.media
src/lib/editorial/audit.ts           # media alt / credit / licence checks for release
src/lib/timeline/music.ts            # RECORDING_RELATIONS, recordingLines(), media on MusicEntry
src/lib/images/music-images.ts       # new: glob of src/assets/music, like archive-images.ts
src/lib/seo/jsonld.ts                # imageNode: optional license
src/components/MusicEntry.astro      # date column, new order, media, details
src/components/MusicPlayer.astro     # credit field
src/scripts/music-player.ts          # ▷ symbol, credit field; image-error and beforeprint fallbacks
src/pages/index.astro                # ImageObject nodes for music images
src/styles/timeline.css              # music card and player blocks rewritten
tests/unit/music.test.ts
tests/unit/editorial.test.ts
tests/site/output.test.ts
README.md                            # "Add or change a song": media, relations, phrases
```

**Structure Decision**: Same single Astro project as 011. Music image lookup gets its own small module next to `archive-images.ts`. Archive images come through `manifest.json` and the fetch script; music images are added by hand (R7).

## Complexity Tracking

No new violations. The site-wide JS overrun is inherited from 011 and recorded there; this feature adds under 0.3 KB gzipped to it.
