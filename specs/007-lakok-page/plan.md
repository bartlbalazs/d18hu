# Implementation Plan: Lakók page

**Branch**: `007-lakok-page` | **Date**: 2026-10-01 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/007-lakok-page/spec.md`

## Summary

This feature adds a third story page, "Lakók", at `/lakok/`, between Építők and Névadó in the header and footer. The text of `input/lakok.md` is transcribed by hand into an Astro page, the same way as the other two story pages. Its periods sit in full-width bands that reuse the home timeline's era tones: 1902–1904 uses era 1, 1922 uses era 2, the new "1944–1945: csillagos ház" section uses the dark era 3 tone, and 1954 uses era 4.

The three name tables sit in native `<details>` blocks that are closed when the page loads. They need no JavaScript to work, apart from a small print helper that opens them while printing.

The page uses numbered, anchor-linked source markers (27 sources) and ends with a correction and removal note that uses the impresszum's contact address. It has no images in this iteration.

Shared code changes:
- the navigation
- the sitemap
- the Lighthouse URL list
- `articleNode()` accepting an article without an image
- the site tests
- the README

## Technical Context

**Language/Version**: TypeScript 6.0.3, Node ≥ 22.18 < 23

**Primary Dependencies**: Astro 7.3.3 (existing). No new dependencies.

**Storage**: Files in the repository. The new page is `src/pages/lakok/index.astro`, and `input/lakok.md` is committed as its draft, like the other drafts.

**Testing**: Vitest (`unit` and `site` projects), html-validate, linkinator with `--check-fragments`, and Lighthouse CI

**Target Platform**: Static files on Firebase Hosting, for evergreen and mobile browsers

**Project Type**: Static website (Astro SSG)

**Performance Goals**: Constitution II. Lighthouse mobile ≥ 95/95/95 with SEO = 100, LCP ≤ 2.0 s, CLS ≤ 0.05, initial weight ≤ 500 KB. The page is text only. Its HTML is about 60 KB raw, with 209 table rows, which is well under 100 KB compressed.

**Constraints**:
- No build-time reading of `input/lakok.md`.
- No external runtime requests.
- No images.
- The lists must work without JavaScript.
- New JavaScript must stay under 1 KB.

**Scale/Scope**: 1 new page (410 lines of draft text, 3 tables, 27 sources) and about 10 touched files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | How |
|---|---|---|
| I. Static HTML First | ✅ | The page is pre-rendered `.astro` markup using `article`, `section`, `details`/`summary` and `table` with `th scope`. There is one `h1`, and headings follow the draft, plus one new `h2` (FR-006a). The lists work natively without JavaScript. |
| II. Performance Budget | ✅ | Text only, with no images and no new fonts; every character in the draft is inside the existing font subsets (checked). Styles go in `story.css`, which only the story pages load. Lighthouse CI gains `/lakok/`. |
| III. Mobile-First | ✅ | Bands are full-width with the existing `.story` reading column inside. The 3-column table scrolls inside its own keyboard-focusable frame below about 30rem. Each summary is at least 44 px tall. The header row is re-checked with four page links (research R7). |
| IV. Minimalism | ✅ | No dependencies. The only JavaScript is a print helper of a few hundred bytes (R3). The page contains no third-party requests. |
| V. Metadata | ✅ | Unique title and description, canonical link, OG `article`, Twitter tags, and JSON-LD for `WebSite`, `BreadcrumbList` and `Article`, with no `ImageObject` because there is no image. The page goes in the sitemap. |
| Quality gates | ✅ | Site tests are extended according to [contracts/site-pages.md](contracts/site-pages.md). html-validate and linkinator fragment checks cover the markup and every source marker. |

The post-design re-check found no violations.

## Project Structure

### Documentation (this feature)

```text
specs/007-lakok-page/
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
input/lakok.md                    # commit the draft (not read by the build)
src/
├── pages/
│   ├── lakok/index.astro         # NEW – hand-written from input/lakok.md
│   └── sitemap.xml.ts            # + /lakok/
├── components/
│   ├── SiteHeader.astro          # pages: Építők, Lakók, Névadó, Impresszum
│   └── SiteFooter.astro          # same order
├── lib/seo/jsonld.ts             # articleNode: imageUrl optional
├── scripts/print-details.ts      # NEW – open <details> for printing, restore afterwards
└── styles/
    ├── story.css                 # + era bands, name lists, tables, correction note
    └── base.css                  # inline-menu breakpoint, only if R7 finds an overflow
lighthouserc.json                 # + /lakok/
tests/site/output.test.ts         # page list, nav order, Lakók contract
README.md                         # pages, drafts, layout
```

**Structure Decision**: This keeps the existing single Astro project. Lakók is a folder route next to `epitok/` and `nevado/`. The band, list and table styles go in `story.css` under `lakok`-scoped class names, so the other story pages can reuse them later without picking anything up now.

## Complexity Tracking

No violations.
