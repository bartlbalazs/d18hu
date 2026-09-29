# Research: Építők and Névadó pages

## R1. How the pages are produced

- **Decision**: Two hand-written Astro pages, `src/pages/epitok/index.astro` and `src/pages/nevado/index.astro`. The text of `input/epitok.md` and `input/nevado.md` is transcribed into semantic HTML once. Nothing imports, parses or globs the Markdown files at build time.
- **Rationale**: FR-007 and the owner's wish for per-page visuals. An `.astro` page lets each page use its own markup (pull quotes, portrait, highlighted names) while still sharing `Base.astro` for header, footer and metadata.
- **Alternatives considered**:
  - An Astro content collection or `.md` pages. Rejected because that is exactly the generic pipeline the owner ruled out.
  - An MDX page with custom components. Rejected because it adds a dependency (Constitution IV) and still keeps a Markdown-shaped layout.

## R2. Façade image on Építők (FR-003b)

- **Decision**: Reuse `assets/facade.png` through `EvidenceFigure`, with `hero.photo.alt`, `caption` and `credit` from `editorial/site.yaml`.
- **Rationale**: This is the only image that shows the façade the text opens with ("Arcok, emberalakokra és állatokra emlékeztető motívumok…"). It is already committed and credited, and Astro already produces AVIF/WebP variants for it.
- **Alternatives considered**: Fortepan 148696 (1963), which only shows the house at the edge of a street scene, so the ornament the text describes isn't visible.

## R3. Névadó portrait (FR-006)

- **Decision**: Download the Commons file named in the "Javasolt nyitókép" note once, and scale it to 1600 px on the long edge. Commit it as `src/assets/pages/dembinszky-rodakowski.jpg` and import it directly in the page. Credit it as "Henryk Rodakowski, 1852 · Krakkói Nemzeti Múzeum · közkincs", with the source link pointing to the Commons file page.
- **Rationale**: `scripts/fetch-images.ts` is tied to the `Kép URL` column of `input/timeline.md`, and the portrait is not a timeline image. Regular builds must stay offline, and a committed, pre-scaled file keeps the repository small. The original is 2686 × 3500 px.
- **Alternatives considered**:
  - Adding a timeline row just to fetch the portrait. Rejected because it pollutes the timeline.
  - Hot-linking Commons. Rejected because it is an external runtime request (Constitution IV).

## R4. Source lists

- **Névadó**: Each `[n]` marker becomes `<sup><a href="#forras-n" id="hivatkozas-n-k">[n]</a></sup>`, where `k` counts repeated uses of the same source so every id stays unique. The list becomes an `<ol>` whose items carry `id="forras-n"`. There are no back-links, to keep it simple, and the anchors are checked by linkinator's `--check-fragments`.
- **Építők** (clarification 1): The inline "([bp16.hu](…))" links stay in the text. A final `<section>` titled "Források" lists each distinct URL once. That gives 3 entries: bp16.hu (cited twice), filmarchiv.hu and kultura.hu. Each entry has a short descriptive title taken from the surrounding text.
- **Tracking parameters** (FR-009): Remove `?utm_source=chatgpt.com` from all 4 Építők URLs by hand. A site test asserts that no `utm_` appears in the built pages.

## R5. Metadata

- **Decision**:
  - Add an `ogType` prop to `Base.astro` and pass it through to `SeoHead`, which already accepts it. Both pages use `article`.
  - Add an `articleNode(site, { headline, description, path, imageUrl, datePublished })` helper to `src/lib/seo/jsonld.ts`. Each page emits `WebSite`, `BreadcrumbList` and `Article`, plus an `ImageObject` for its opening image.
  - `og:image` stays the shared façade crop. SeoHead has a single image source today, and a per-page image isn't required.
- **Rationale**: This covers Constitution V with the smallest change to shared code.

## R6. Styles

- **Decision**: A new `src/styles/story.css`, imported only by the two story pages. It holds the reading column, lead paragraph, pull-quote, highlighted-fact and source-list styles. The `.article-list` rules and the "Írások" comment are removed from `base.css`.
- **Rationale**: The home page doesn't load CSS it never uses. Astro bundles page-level imports per route.

## R7. Removing Írások

- **Decision**:
  - Delete `src/pages/irasok/`.
  - Remove `articles` from `src/lib/editorial/schema.ts` and `editorial/site.yaml`.
  - Replace `/irasok/` with `/epitok/` and `/nevado/` in the sitemap, `lighthouserc.json`, the site test, the README, and the header and footer navigation.
  - Add no redirect.
- **Rationale**: The article list was always empty, and the spec's assumptions exclude a redirect.

## R8. Checking that the content is complete (SC-002)

- **Decision**: The quickstart includes a one-off check that compares the `##`/`###` headings and the link URLs in `input/*.md` with the built HTML. This is not a permanent test, because the pages are meant to drift from the drafts once they are edited by hand.
