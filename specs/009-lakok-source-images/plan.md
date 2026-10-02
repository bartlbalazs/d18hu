# Implementation Plan: Lakók source images

**Branch**: `009-lakok-source-images` | **Date**: 2026-10-02 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/009-lakok-source-images/spec.md`

## Summary

The Lakók page gets 14 source images at 12 places: the guide's 13 main images and spare 09. The images go in `src/assets/pages/lakok/`. Their captions, alt texts, credits and source links go in a typed data module, so the page itself stays readable. Every image uses the existing `EvidenceFigure`, so it gets the same frame, caption, credit line and viewer as the façade photo.

`EvidenceFigure` gains two small additions:
- an optional `label`, used for the Szellő pair's page labels
- the ability to skip cropping, which it already does when `crop` is left out

The page gets:
- four width classes taken from the guide's display widths
- a wrapper for the two pairs of images
- a caption colour fix for the dark 1944 band
- a print rule that keeps each image under half a page

The facade stays the only eager image. Every new image is lazy-loaded and keeps its space while it loads. The structured data and the page text don't change.

## Technical Context

**Language/Version**: TypeScript 6.0.3, Node ≥ 22.18 < 23

**Primary Dependencies**: Astro 7.3.3, with `astro:assets` and sharp 0.35.4 for resizing, and PhotoSwipe 5.4.4 for the existing viewer. No new dependencies.

**Storage**: The 14 source files are committed in `src/assets/pages/lakok/`. The package's `kepjegyzek.json`, guide and `attekinto.jpg` are not committed (research R1).

**Testing**: Vitest `site` project, html-validate, linkinator `--check-fragments`, and Lighthouse CI on `/lakok/`

**Target Platform**: Static files on Firebase Hosting, for evergreen and mobile browsers

**Project Type**: Static website (Astro SSG)

**Performance Goals**: Constitution II. Lighthouse mobile 100 on all four categories, as now. Initial image weight stays the same, because no new image loads before the visitor scrolls. LCP stays the façade photo. CLS ≤ 0.05.

**Constraints**:
- Images are not cropped or retouched.
- The guide's rights categories, licence notes and display notes are not copied into code, data or docs.
- No inline styles; widths come from classes.
- No new JavaScript.

**Scale/Scope**: 14 images (about 10 MB of sources), 1 page, about 6 touched files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | How |
|---|---|---|
| I. Static HTML First | ✅ | Each image is a pre-rendered `<figure>` with a `<picture>`, `<img alt>` and `<figcaption>`. The zoom link opens the full-size file even without JavaScript. |
| II. Performance Budget | ✅ | Every image is `srcset`/`sizes` AVIF and WebP with a JPEG fallback. Each has explicit `width` and `height` and is `loading="lazy"`; only the façade stays eager. No widths are wider than the source (R3). The Lighthouse `total-byte-weight` gate (512 000 B) checks the initial view (R4). |
| III. Mobile-First | ✅ | Width classes are maximums, so each figure shrinks to the column below them. The zoom button is 44 × 44 px. Small print can be read in the viewer (SC-005). |
| IV. Minimalism | ✅ | No dependencies and no new scripts. About 40 lines of CSS and one data module. |
| V. Metadata | ✅ | The structured data is unchanged (FR-011); the façade stays the article image. Every image has Hungarian alt text. |
| Quality gates | ✅ | The site tests follow [contracts/site-pages.md](contracts/site-pages.md). html-validate and linkinator cover the new markup and the full-size links. |

**Post-design re-check**: no violations. One item needs care: `.evidence figcaption` uses `--d18-muted`, which is unreadable on the dark era 3 band, so band 3 redefines it (R6).

## Project Structure

### Documentation (this feature)

```text
specs/009-lakok-source-images/
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
├── assets/pages/lakok/          # NEW – the 14 source files, package file names kept
├── lib/lakok/figures.ts         # NEW – typed caption/alt/credit/source/size data + figureProps()
├── components/EvidenceFigure.astro  # + optional `label`
├── pages/lakok/index.astro      # 12 figure places (two of them pairs)
└── styles/story.css             # width classes, pair wrapper, band-3 caption colour, print rule
tests/site/output.test.ts        # Lakók contract: 15 figures, placement, credits, no spares
README.md                        # story pages: where the Lakók images and their captions live
```

**Structure Decision**: This keeps the existing single Astro project. Story page images already live in `src/assets/pages/` (the Névadó portrait), so the Lakók set goes in its own subfolder there. The 14 caption records go in `src/lib/lakok/figures.ts` rather than the page's frontmatter. Fourteen 5-field records would push the 466-line page's text far down the file.

## Complexity Tracking

No violations.
