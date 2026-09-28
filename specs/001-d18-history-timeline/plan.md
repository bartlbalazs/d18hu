# Implementation Plan: Dembinszky utca 18. History Timeline

**Branch**: `001-d18-history-timeline` | **Date**: 2026-09-28 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-d18-history-timeline/spec.md`

## Summary

Build a static, Hungarian-language, single-page narrative timeline of Dembinszky utca 18.
(1873–1968). It has a hero, a legend, four full-height era openers and all 108 events, plus
`/irasok/` and `/impresszum/`.

**How it is built**
- Astro generates plain HTML at build time with no hydration.
- Events are parsed from `input/timeline.md` with a GFM-aware parser. Each event gets a
  content-derived id and is joined with owner-maintained YAML editorial data (titles,
  captions, credits).
- Archive images are downloaded once, committed, and optimised locally at build time.

**Scripts and modes**
- The only script is a lazily loaded PhotoSwipe viewer.
- There are two build modes:
  - **draft**: always builds and is marked noindex.
  - **release**: strict; fails while any editorial item is missing.

## Technical Context

**Language/Version**: TypeScript 6.0.3 on Node.js 22 LTS (22.23.2, `.nvmrc`)

**Primary Dependencies** (exact versions, all ≥ 7 days old; see [research.md](research.md)):
- **Build tools**: astro 7.3.3, sharp 0.35.4, pnpm 11.27.1
- **Parsing**: unified 11.0.5, remark-parse 11.0.0, remark-gfm 4.0.1
- **Front-end assets**: photoswipe 5.4.4, lucide-static 1.47.0
- **Dev only**:
  - Fonts: @fontsource/cormorant-garamond 5.3.0, @fontsource/source-sans-3 5.3.0
  - Tests and checks: vitest 5.0.1, html-validate 11.16.0, linkinator 8.1.0, @lhci/cli 0.15.1
  - Types: @astrojs/check 0.9.10
  - Fonts via uvx: fonttools 4.65.0, brotli 1.2.0

**Storage**: Files only.
- `input/timeline.md` (research source, read-only)
- `editorial/*.yaml` (owner metadata)
- `src/assets/archive/` (committed images + `manifest.json`)
- `assets/facade.png` (hero)

**Testing**:
- Vitest unit tests (parser, ids, dates, inline renderer, audit)
- Vitest output assertions over `dist/`
- html-validate and linkinator over the built site
- Lighthouse CI
- A manual responsive/keyboard walkthrough ([quickstart.md](quickstart.md))

**Target Platform**: Any static host (undecided). Supported browsers are the last 2 versions
of the evergreen browsers plus the iOS and Android defaults.

**Project Type**: Static website with a build-time content pipeline.

**Performance Goals**: Constitution Principle II applies.
- **Lighthouse mobile**: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO 100.
- **Load metrics**: LCP ≤ 2.0 s, CLS ≤ 0.05, TBT ≤ 100 ms.
- **Initial view**: HTML, CSS and JS ≤ 100 KB compressed; ≤ 500 KB in total.

**Constraints**:
- No framework and no hydration.
- Fonts ≤ 150 KB (estimated at about 115 KB).
- Must work without JavaScript.
- Offline builds.
- Header in normal flow.
- WCAG AA contrast.
- No off-site assets at runtime.

**Scale/Scope**:
- 3 pages, 4 eras, 108 events (the source is expected to grow).
- 5 archive images plus the hero; 1 verified document highlight at launch.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.* Constitution v1.1.0.

| Principle / Gate | Pre-research | Post-design | Evidence |
|---|---|---|---|
| I. Static HTML First | ✅ | ✅ | Astro static output. All content is in the HTML, semantic landmarks and heading levels are defined ([site-output](contracts/site-output.md)), and the build step outputs plain files |
| II. Performance Budget | ✅ | ✅ (to verify) | The hero is served as AVIF/WebP with `fetchpriority=high`. Other images are responsive and lazy, fonts come to about 115 KB, eager JS is 4.5 KB and HTML is about 15 KB gz. Enforced by `pnpm lighthouse` |
| III. Mobile-First Responsive | ✅ | ✅ | Mobile-first CSS with grid/flex/`clamp()`, a `<details>` menu, touch targets ≥ 44 px and body text ≥ 16 px. Checked at 320/360/768/1280 px |
| IV. Minimalism: frameworks, trackers, CDNs | ✅ | ✅ | No JS or CSS frameworks, no trackers, no CDNs. Icons are inlined at build time |
| IV. Minimalism: fonts | ✅ | ✅ | Two families (allowed since v1.1.0), subset for Hungarian, WOFF2, `swap`, about 115 KB (≤ 150) |
| IV. Minimalism: JS ≤ 20 KB, no UI libraries | ⚠️ | ⚠️ justified | PhotoSwipe totals about 20.9 KB gz and is a UI library. See Complexity Tracking |
| V. Metadata & Discoverability | ✅ | ✅ | `SeoHead`: title, description, canonical, OG/Twitter, JSON-LD (WebSite, BreadcrumbList, ApartmentComplex, Event, ImageObject), sitemap, robots, manifest |
| Tech constraints: pinning, lockfile, 7-day gate | ✅ | ✅ | Exact versions, `pnpm-lock.yaml`, `minimumReleaseAge: 10080`, Dependabot `cooldown: { default-days: 7 }`, uvx tools pinned |
| Quality gates 1–5 | ✅ | ✅ | `test:site` (HTML validation, metadata, links), `lighthouse`, manual viewport check, and this table |

**Result**: PASS. The one deviation is justified below.

## Project Structure

### Documentation (this feature)

```text
specs/001-d18-history-timeline/
├── plan.md              # This file
├── research.md          # Phase 0: decisions, versions, alternatives
├── data-model.md        # Phase 1: entities, validation, errors
├── quickstart.md        # Phase 1: validation scenarios
├── contracts/
│   ├── timeline-source.md     # what the parser accepts from input/timeline.md
│   ├── editorial-metadata.md  # owner-facing rules for editorial/*.yaml
│   ├── build-cli.md           # pnpm commands, modes, exit codes
│   └── site-output.md         # URLs, anchors, markup and JS guarantees
├── checklists/requirements.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
input/timeline.md                  # research source (read-only)
assets/facade.png                  # hero photo (owner-supplied)
editorial/
├── events.yaml                    # titles, image captions/credits, document highlights
└── site.yaml                      # hero, era intros, building, impresszum, articles, siteUrl
scripts/
├── fetch-images.ts                # pnpm images:fetch
├── check-image-urls.ts            # pnpm images:check
└── subset-fonts.sh                # pnpm fonts:subset (uvx pyftsubset)
src/
├── lib/
│   ├── timeline/parse.ts          # mdast → TimelineEvent[] (pure)
│   ├── timeline/ids.ts            # slug + id derivation
│   ├── timeline/dates.ts          # sortStart/sortEnd derivation
│   ├── timeline/inline-html.ts    # whitelisting inline renderer
│   ├── editorial/audit.ts         # MissingItem[] + structural checks (pure)
│   ├── build-mode.ts              # D18_BUILD_MODE, SITE_URL resolution
│   └── seo/jsonld.ts              # JSON-LD builders
├── content.config.ts              # timeline loader + editorial file() collections (zod)
├── assets/archive/                # committed images + manifest.json
├── fonts/                         # subset WOFF2 (committed)
├── components/
│   ├── SeoHead.astro  SiteHeader.astro  SiteFooter.astro  DraftBanner.astro
│   ├── Hero.astro  Legend.astro  EraOpener.astro  Timeline.astro  TimelineEvent.astro
│   └── EventTypeIcon.astro  ConfidenceMark.astro  EvidenceFigure.astro
│       DocumentHighlight.astro  SourceLinks.astro
├── layouts/Base.astro
├── pages/
│   ├── index.astro  irasok/index.astro  impresszum/index.astro
│   ├── sitemap.xml.ts  robots.txt.ts  site.webmanifest.ts
├── scripts/lightbox.ts            # PhotoSwipe init (only JS)
└── styles/ tokens.css  base.css  timeline.css
public/                            # favicons
tests/
├── unit/                          # parse, ids, dates, inline-html, audit (+ fixtures/)
└── site/                          # dist/ assertions
astro.config.mjs  package.json  pnpm-lock.yaml  pnpm-workspace.yaml  .npmrc  .nvmrc
tsconfig.json  .htmlvalidate.json  lighthouserc.json
.github/dependabot.yml             # if hosted on GitHub (cooldown 7 days)
```

**Structure Decision**: a single Astro project at the repository root.
- **Pure logic** (parsing, ids, dates, audit) lives in `src/lib/` without Astro imports, so
  Vitest can test it directly and `content.config.ts` and the scripts can reuse it.
- **Owner-editable data** lives in `input/` and `editorial/`, away from code.
- **Root README.md** is updated during implementation with setup, commands and the editorial
  workflow.

## Implementation Phases (for /speckit-tasks)

1. **Setup**: toolchain pinning (`.nvmrc`, `packageManager`, `pnpm-workspace.yaml` release
   age, `.npmrc`), Astro config, and the lint/test/validate configs.
2. **Data pipeline (P1)**: parser, ids, dates, inline renderer and audit, with unit tests and
   fixtures. This is the base for everything else.
3. **Editorial bootstrap**: generate `editorial/events.yaml` with AI-drafted titles for all
   108 ids, marked for owner review. Create `editorial/site.yaml` with era intros and headings
   from the mockup, and leave Impresszum fields empty.
4. **Images and fonts**: `images:fetch` (commits 5 images and the manifest), `images:check`,
   and the font subset.
5. **Timeline page (US1, US2, US4)**: layout, header/nav, hero, era openers, event variants,
   icons, legend and palette.
6. **Viewer (US3)**: figure markup, PhotoSwipe lightbox and a verified document highlight.
7. **Other pages and SEO (US5, US6)**: `/irasok/`, `/impresszum/`, SeoHead, JSON-LD,
   sitemap, robots, manifest, draft mode.
8. **Quality gates**: `test:site`, html-validate, linkinator, Lighthouse, a manual responsive
   pass, and the README update.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| PhotoSwipe, a UI library (Principle IV) | FR-024 requires an accessible, zoomable viewer: pinch-zoom, pan, Escape, focus return, no prev/next for a single image. The document scans need real zoom to be legible | A hand-written `<dialog>` viewer can't reliably pinch-zoom inside a fixed overlay on iOS Safari, and would need a custom focus trap and gesture code, which is more code and risk than a small, dependency-free, MIT library |
| JS about 20.9 KB gz site-wide, against a 20 KB cap (Principle IV) | The PhotoSwipe core (16.4 KB) plus the lightbox (4.5 KB) | Only 4.5 KB loads with the page, and the core loads on the first image activation. Content never depends on JS. Staying under 20 KB would mean dropping zoom, which the spec rejects |
