# Implementation Plan: Épület page

**Branch**: `013-epulet-page` | **Date**: 2026-10-11 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/013-epulet-page/spec.md`

## Summary

This feature adds a fourth story page, "Épület", at `/epulet/`, first among the page links in the header, the Menü panel and the footer. The draft (`d18_epulet.md`) is copied to `input/epulet.md` and transcribed by hand into `src/pages/epulet/index.astro`, like the other story pages.

The page opens with the home page's façade photo (`facade4.png`) and has 12 document photos at the places the draft gives. They are committed to `src/assets/pages/epulet/`, and the phone photo is first rotated upright and stripped of its GPS and camera data. The period sections sit in the home timeline's era tones, there are 11 numbered sources, and the image references in the source list are anchors to the figures.

To reuse the Lakók era bands and figure sizing without duplication, those parts become shared story-page code (`story-band`, `story-figure`, `src/lib/images/story-figures.ts`).

Other changes:
- The Építők article gets a closing postscript that points to the new findings.
- On the timeline, four rows are corrected (the 1899 plan, the 1901 April 20 permit, "1901 körül", the 1960 death) and seven D18 events are added (1899 sale, 1899 mortgage, 1900 auction, 1901 balcony plan, 1942 owner, 1948 restoration, 1956 flat division).
- Timeline source cells may now link to site pages (`/epulet/#…`), so those links are checked by the link checker.
- Navigation, sitemap, Lighthouse URLs, tests and README are updated.

## Technical Context

**Language/Version**: TypeScript 6.0.3, Node ≥ 22.18 < 23

**Primary Dependencies**: Astro 7.3.3 and sharp 0.35.4, both existing. No new dependencies.

**Storage**: Files in the repository: `input/epulet.md` (draft, never read by the build), `src/pages/epulet/index.astro`, `src/lib/epulet/figures.ts`, `src/assets/pages/epulet/*` (12 images), `input/timeline.md`, `editorial/events.yaml`

**Testing**: Vitest (`unit` and `site`), html-validate, linkinator `--check-fragments`, Lighthouse CI

**Target Platform**: Static files on Firebase Hosting, for evergreen and mobile browsers

**Project Type**: Static website (Astro SSG)

**Performance Goals**: Constitution II: Lighthouse mobile ≥ 95/95/95 with SEO = 100, LCP ≤ 2.5 s, CLS ≤ 0.05, initial weight ≤ 500 KB.
- Only the opening photo loads eagerly, at the same widths and quality as Lakók. The 12 documents are lazy, with `srcset` and AVIF/WebP.
- The page HTML is about 45 KB raw.
- The timeline gains 7 text-only rows.

**Constraints**:
- No build-time reading of the draft.
- No runtime third-party requests.
- No new JavaScript: the existing lightbox script is reused.
- No GPS or camera metadata in the repository or the output.

**Scale/Scope**:
- 1 new page (~12 sections, 12 + 1 figures, 11 sources)
- 1 postscript on Építők
- 11 timeline rows (4 changed, 7 new), plus 3 open-question entries
- About 20 touched files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | How |
|---|---|---|
| I. Static HTML First | ✅ | Pre-rendered `.astro` page with `article`, `section`, `figure`/`figcaption` and one `h1`. The heading levels follow the draft (h2 sections, two h3). Without JavaScript the zoom links open the full image. |
| II. Performance Budget | ✅ | Only the opening image is eager; the 12 document images are lazy and responsive, in AVIF/WebP with a JPEG fallback, with explicit dimensions, never upscaled (`figureProps`). No new fonts: every character is in the existing subsets (R10). No new CSS file, since `story.css` gains only the postscript rule and the class rename. `/epulet/` is added to Lighthouse CI. |
| III. Mobile-First | ✅ | The existing story column and bands. Strips (`5b`, 3.2:1) get the moved zoom button. The header with five page links is checked at 900 px, and the breakpoint is raised if needed (R9). |
| IV. Minimalism | ✅ | No dependencies. No new script. Image cleaning is a one-time step with the existing sharp. The shared-code refactor removes duplication instead of adding an abstraction (R3). |
| V. Metadata | ✅ | Unique title and description, canonical link, OG `article`, Twitter tags, and JSON-LD for `WebSite`, `BreadcrumbList`, `Article` and one `ImageObject` per figure. Sitemap entry. The timeline's `Event` data gains the new house events automatically. |
| Quality gates | ✅ | The tests in [contracts/site-pages.md](contracts/site-pages.md) cover markup, links (including the new internal timeline links), metadata, EXIF and the removed contradictions. |

The post-design re-check found no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/013-epulet-page/
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
input/
├── epulet.md                         # new: the draft, for reference only
└── timeline.md                       # 4 rows corrected, 7 added, 3 open questions updated
editorial/events.yaml                 # titles for new events; 3 keys renamed; 2 titles changed
src/
├── assets/pages/epulet/              # new: 12 document photos (01-…-1899.jpg cleaned)
├── components/
│   ├── EvidenceFigure.astro          # optional id prop
│   ├── SiteHeader.astro              # Épület first
│   ├── SiteFooter.astro              # Épület first
│   └── TimelineEvent.astro           # internal source links: no rel, no external icon
├── lib/
│   ├── images/story-figures.ts       # new: StoryFigure type + figureProps (moved from lakok)
│   ├── lakok/figures.ts              # data only, imports the shared type
│   ├── epulet/figures.ts             # new: the 12 Épület figures
│   └── timeline/
│       ├── inline-html.ts            # source-link rule: https or site-relative
│       └── parse.ts                  # source cells use the new rule
├── pages/
│   ├── epulet/index.astro            # new page
│   ├── epitok/index.astro            # postscript paragraph
│   ├── lakok/index.astro             # class rename
│   └── sitemap.xml.ts                # /epulet/
└── styles/
    ├── story.css                     # lakok-* → story-*, .story__postscript
    └── base.css                      # header breakpoint, only if R9 requires it
tests/
├── unit/parse.test.ts                # source-link cases
└── site/output.test.ts               # /epulet/, nav order, Építők postscript, timeline, EXIF
lighthouserc.json, lighthouserc.live.json   # + /epulet/
README.md                             # pages, menu order, story-page files, timeline source links, spec list
```

**Structure Decision**: This is the existing single Astro project. The new page follows the Lakók pattern: a hand-authored page, a figure table in `src/lib/<page>/figures.ts`, and images in `src/assets/pages/<page>/`. The parts both pages use move to shared modules.

## Implementation notes

- **Order of work**:
  1. Shared refactor (R3), verified by unchanged Lakók tests.
  2. The images and the page.
  3. Navigation and metadata.
  4. Timeline parser change (R6).
  5. Timeline rows and `events.yaml`.
  6. Építők postscript.
  7. Tests, README, Lighthouse.
- **Image cleaning (R2)**: run once from the repository root with the downloaded path as an argument. The script reads the file, applies `.rotate()`, resizes the long edge to 2400 and writes JPEG quality 90 without `withMetadata`. Commit only the output.
- **Wording for owner review**: the timeline texts, the event titles and the Építők postscript in [data-model.md](data-model.md) are drafts. The 1899 April 22 date written on the elevation sheet is not used; the timeline uses the 18 May approval date that the draft gives.
- **Commits**: Conventional Commits, author `bartlbalazs@gmail.com`.

## Complexity Tracking

No constitution violations to justify.
