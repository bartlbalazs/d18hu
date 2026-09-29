# Implementation Plan: Építők and Névadó pages

**Branch**: `002-epitok-nevado-pages` | **Date**: 2026-09-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-epitok-nevado-pages/spec.md`

## Summary

This feature replaces the empty "Írások" page and menu item with two long-form story pages, "Építők" and "Névadó". Impresszum stays last in the menu. The text in `input/epitok.md` and `input/nevado.md` is transcribed by hand into two Astro pages, with no Markdown pipeline, so each page can have its own look.

Each page opens with an image. Építők reuses the façade photo, and Névadó uses a committed copy of the Rodakowski portrait. Each page ends with a source list: Építők keeps its inline links and adds a deduplicated "Források" list, while Névadó uses numbered, anchor-linked markers. Shared code changes are limited to navigation, the sitemap, an `ogType` pass-through, an `Article` JSON-LD helper, and removing the `articles` config.

## Technical Context

**Language/Version**: TypeScript 6.0.3, Node ≥ 22.18 < 23

**Primary Dependencies**: Astro 7.3.3 (existing); sharp for the one-off portrait resize (existing). No new dependencies.

**Storage**: Files in the repository. The pages live in `src/pages/`, the portrait in `src/assets/pages/`.

**Testing**: Vitest (`unit` and `site` projects), html-validate, linkinator with `--check-fragments`, and Lighthouse CI

**Target Platform**: Static files on any static host, for evergreen and mobile browsers

**Project Type**: Static website (Astro SSG)

**Performance Goals**: Constitution II. Lighthouse mobile ≥ 95/95/95 with SEO = 100, LCP ≤ 2.0 s, CLS ≤ 0.05, initial weight ≤ 500 KB.

**Constraints**:
- No build-time reading of `input/epitok.md` or `input/nevado.md`.
- No external runtime requests.
- JavaScript only for the existing lightbox progressive enhancement.

**Scale/Scope**: 2 new pages (about 217 and 108 lines of draft text), 1 removed page, and about 10 touched files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | How |
|---|---|---|
| I. Static HTML First | ✅ | The pages are pre-rendered `.astro` files using semantic `article`, `section` and `figure` elements. There is one `h1`, and headings follow the draft hierarchy. |
| II. Performance Budget | ✅ | Text only, plus one eager, responsive AVIF/WebP opening image each. Page CSS goes in a separate `story.css` that only these pages load. Lighthouse CI gains both URLs. |
| III. Mobile-First | ✅ | Reuses the `.page` reading column, and the new styles are written mobile-first with `clamp()`. Pages are checked at 320, 768 and 1280 px. |
| IV. Minimalism | ✅ | No new dependencies and no new JavaScript. The portrait is self-hosted, not hot-linked. |
| V. Metadata | ✅ | Unique title and description, canonical, OG with `og:type=article`, Twitter tags, and JSON-LD for `WebSite`, `BreadcrumbList`, `Article` and `ImageObject`. Both pages go in the sitemap, and `/irasok/` comes out. |
| Quality gates | ✅ | The site test page list is updated, and new contract assertions are added ([contracts/site-pages.md](contracts/site-pages.md)). |

The post-design re-check found no violations and no Complexity Tracking entries.

## Project Structure

### Documentation (this feature)

```text
specs/002-epitok-nevado-pages/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/site-pages.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── pages/
│   ├── epitok/index.astro        # NEW – hand-written from input/epitok.md
│   ├── nevado/index.astro        # NEW – hand-written from input/nevado.md
│   ├── irasok/                   # DELETE
│   └── sitemap.xml.ts            # /irasok/ → /epitok/, /nevado/; drop articles
├── assets/pages/
│   └── dembinszky-rodakowski.jpg # NEW – committed, 1600 px long edge
├── components/
│   ├── SiteHeader.astro          # pages: Építők, Névadó, Impresszum
│   └── SiteFooter.astro          # same order
├── layouts/Base.astro            # pass ogType through to SeoHead
├── lib/
│   ├── seo/jsonld.ts             # + articleNode()
│   └── editorial/schema.ts       # − articles / articleSchema
└── styles/
    ├── story.css                 # NEW – story page styles
    └── base.css                  # − .article-list, comment update

editorial/site.yaml               # − articles
lighthouserc.json                 # /irasok/ → /epitok/, /nevado/
tests/site/output.test.ts         # page list + nav order, anchors, no utm_, no /irasok/
README.md                         # pages, content workflow, structure
```

**Structure Decision**: This keeps the existing single Astro project. Story pages sit next to `impresszum/` as folder routes. Both pages import `../../scripts/lightbox.ts` so their opening figures zoom the way the timeline's do.

## Complexity Tracking

No violations.
