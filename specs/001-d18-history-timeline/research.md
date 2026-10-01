# Research: Dembinszky utca 18. History Timeline

**Date**: 2026-09-28 · **Release-age cutoff** (constitution, 7 days): published on or before 2026-09-21

All versions below were checked against the npm / PyPI registries on 2026-09-28. Where the
newest release was younger than 7 days, the newest *eligible* release is chosen.

## R1. Site generator

- **Decision**: Astro **7.3.3** (2026-09-16), static output (`output: 'static'`), no UI
  framework integrations, no client-side hydration.
- **Rationale**: Astro produces plain HTML and ships zero JS by default. It has built-in
  typed content collections (custom loaders plus a YAML `file()` loader) and build-time image
  optimisation (`astro:assets` + sharp). These cover the parser, editorial data and image
  needs without extra dependencies. It is the owner's stated preference.
- **Alternatives considered**: Eleventy (fine, but image pipeline and typed schemas need extra
  plugins); hand-written HTML (108 events would be duplicated by hand, violating the source
  spec's "no manually duplicated event HTML"); Astro 7.3.5 (latest, only 4 days old).

## R2. Runtime and package manager

- **Decision**: Node.js **22 LTS** (22.23.2, already installed via nvm), pinned in `.nvmrc`
  and `engines`. pnpm **11.27.1** (2026-09-20), pinned via `packageManager`.
- **Rationale**: Astro 7, Vitest 5, html-validate 11 and linkinator 8 require Node ≥ 22.12.
  The machine's default Node 20.20.2 is end-of-life (April 2026) and too old. pnpm enforces
  the 7-day release-age gate natively (`minimumReleaseAge: 10080` minutes in
  `pnpm-workspace.yaml`). The npm version bundled with Node 22 has no equivalent gate, and
  pnpm's lockfile is strict by default.
- **Alternatives considered**: npm with a manual `--before` date (not enforced for
  collaborators); Node 24 LTS (fine, but not installed; can switch later with no code
  changes); pnpm 12.8.1 (released today).

## R3. Timeline source parsing

- **Decision**: unified **11.0.5** + remark-parse **11.0.0** + remark-gfm **4.0.1**. The
  parser walks the mdast tree: `heading(depth 2)` → era; the next `table` → event rows. It
  stops at the heading "Amit egyelőre nem viszünk fel házeseményként". Cells are handled as
  follows:
  - **Description**: kept as inline mdast (text / strong / emphasis / link / inlineCode). It
    is rendered by a small, whitelisting HTML serializer; any other node type fails the build.
  - **Sources**: taken from `link` nodes. Leftover text other than separators (`;`, `,`, `/`,
    whitespace) fails the build.
  - **`Kép URL`**: GFM parses it as a link, and its URL is used.
  - **`—`**: becomes `null`.
- **Rationale**: This is the GFM-aware parsing the source spec asks for. Table rows keep their
  column alignment even when a cell contains `|`-free markdown. It is the same markdown stack
  Astro uses internally, so there are no surprises in inline formatting.
- **Alternatives considered**: splitting rows on `|` (explicitly rejected by the source spec);
  remark-rehype + rehype-stringify for description HTML (2 extra dependencies to render 4
  inline node types).

## R4. Permanent event ids (Clarification Q2)

- **Decision**: `id = slug(dateLabel) + "-" + slug(first 4 words of plain-text description)`.
  - **Slug rules**: lower-case; Hungarian accents folded (á→a, é→e, í→i, ó/ö/ő→o, ú/ü/ű→u);
    non-alphanumerics → `-`; repeats collapsed.
  - **Example**: `1903-dec-27-mautner-adolf-es-tarsai`.
  - **Failures**: a duplicate id fails the build (`DuplicateEventId`), and so does an
    editorial key that matches no event (`OrphanedEditorialEntry`).
- **Rationale**: The id is readable in URLs and anchors. It does not depend on row position,
  so inserting or reordering rows doesn't affect it. Four words disambiguate the same-year
  rows in the current data. Checked on 2026-09-28 against all 108 rows: no collisions,
  longest id 78 characters. A parser test locks this in.
- **Alternatives considered**: a content hash (not human-readable); row position (breaks on
  insert); an explicit ID column (rejected by the owner).

## R5. Editorial metadata storage (Clarification Q1)

- **Decision**: two YAML files in `editorial/`, loaded through Astro's built-in `file()`
  loader with zod schemas (zod ships with Astro):
  - `editorial/events.yaml`: per-event title, image alt/caption/credit/licence, and an optional
    document highlight.
  - `editorial/site.yaml`: hero texts, era intros, sub-headings and decorative years,
    hero/facade credit, Impresszum, building address/geo, articles. The site URL comes from
    the `SITE_URL` environment variable only.
  - Both files are read with the `yaml` package (2.9.1) and validated with zod from
    `astro/zod`, outside Astro's content collections, so plain Node scripts and tests use the
    same loader.
- **Rationale**: YAML is the easiest structured format for a non-developer to edit (the
  constitution says content SHOULD be editable by non-developers). No extra dependency is
  needed.
- **Alternatives considered**: JSON (harder to hand-edit Hungarian prose); front-matter
  Markdown per event (108 files; heavy).

## R6. Image pipeline (Clarification Q3)

- **Decision**:
  - **`pnpm images:fetch`** (a Node script) downloads each `Kép URL` that isn't yet in
    `src/assets/archive/manifest.json`.
    - It checks for HTTP 200 and an `image/*` content type.
    - It uses sharp to confirm the file decodes and to read its width and height.
    - It saves the file as `<collection>-<archiveId>-<sha256(url)[0..8]>.<ext>` (e.g.
      `fortepan-82508-1a2b3c4d.jpg`) and records it in the manifest. Files are committed to
      git.
  - **`pnpm images:check`**: HEAD/GET check of all original URLs, report only, run on demand.
  - **At build time**: Astro `getImage()` makes responsive AVIF/WebP previews (480/800/1200
    px) and one large WebP for the lightbox (long edge ≤ 2400 px; the current Fortepan files are
    1600 px, and images are never upscaled). Everything is served
    locally.
- **Rationale**: Regular builds run offline. The dedupe and naming rules follow FR-022, and
  broken URLs are caught at fetch time with the event id. sharp is already required by Astro,
  so it is declared as a direct dependency at the same version (**0.35.4**, 2026-08-26).
- **Alternatives considered**: remote images via Astro's `image.domains` (hotlink at build
  time, needs network on every build); `file-type`/`image-size` (sharp already provides
  this).

## R7. Image viewer

- **Decision**: PhotoSwipe **5.4.4** (2024-05-24, MIT).
  - Only the lightbox module (about 5 KB gz) is loaded, and only on pages with images.
  - The core (16.4 KB gz) is loaded on first activation via `pswpModule: () =>
    import('photoswipe')`.
  - The CSS (2.4 KB gz) is imported as a string by the lazily loaded core and injected on
    first use, so it is not part of the page's inline styles.
  - The markup baseline is `<a href="full.webp" data-pswp-width data-pswp-height><img …></a>`.
- **Rationale**: It provides accessible pinch-zoom, Escape to close, focus return and no
  prev/next for a single image, all of which FR-024 requires. Writing an equivalent viewer
  (touch zoom, pan, inertia, focus trap) is significant, risky work.
- **Constitution impact**: total JS ≈ 23 KB gz site-wide (measured: core + CSS 18.2 KB, lightbox
  5.2 KB), against a 20 KB cap. It is also a
  "UI library". Both are justified in the plan's Complexity Tracking. The eagerly loaded JS is
  5.2 KB.
- **Alternatives considered**: native `<dialog>` plus browser zoom (poor pinch-zoom inside a
  fixed overlay on iOS; the document scans need real zoom); GLightbox (larger, less
  maintained).

## R8. Icons

- **Decision**: lucide-static **1.47.0** (2026-09-17, ISC). SVG strings are imported at build
  time and inlined with `aria-hidden="true"`, so there is no runtime cost. Icon names checked
  in 1.47.0:
  - **Category icons**: `house`, `map-pin`, `flag`, `earth` (the current name of the former
    `globe-2`).
  - **Certainty icons**: `circle-check`, `circle-dot`, `circle-help`.
  - **UI icons**: `menu`, `external-link`, `zoom-in`.
- **Alternatives considered**: lucide-static 1.48.0 (4 days old); hand-drawn SVGs
  (unnecessary).

## R9. Fonts (constitution v1.1.0, Principle IV)

- **Decision**: take the WOFF2 files from @fontsource/cormorant-garamond **5.3.0** and
  @fontsource/source-sans-3 **5.3.0** (OFL-1.1) as dev-only sources.
  - Serve their `latin` subset as-is.
  - Create a tiny `hu` supplement (Ő ő Ű ű) from the `latin-ext` file, once, with fonttools
    **4.65.0** + brotli **1.2.0** via `uvx`. The output is committed to `src/fonts/`.
  - Each face gets two `@font-face` rules with `unicode-range`.
  - **Styles**: Cormorant Garamond 500 and 500 italic; Source Sans 3 400 and 600. Headings use
    500; there is no 600 display weight, to save one file.
  - **Tighter subset (implementation)**: the `latin` files are also cut down to basic Latin,
    Latin-1, general punctuation and €, with only the kern/liga/lnum/pnum/tnum features.
- **Size (measured)**: 62 KB in total, within the 150 KB cap. The Fontsource `latin` files
  as-is came to 108 KB, and the full `latin-ext` files would have been about 227 KB. Fonts
  were measured as the biggest factor in mobile LCP: 2.26 s with them, 1.4 s without.
- **Alternatives considered**: variable fonts (larger per file); the full latin-ext files
  (over budget); a Google Fonts CDN (violates self-hosting and no-CDN rules).

## R10. SEO and structured data

- **Decision**: a single `SeoHead` component emits the following (Principle V):
  - title, description, canonical and `lang="hu"`
  - Open Graph and Twitter tags; `og:image` is a 1200×630 crop of the facade generated at
    build time
  - favicon set and `site.webmanifest`
  - JSON-LD
- **JSON-LD by page**:
  - **Every page**: `WebSite`, `BreadcrumbList`.
  - **Timeline page**: `ApartmentComplex` (name, address, optional geo from `site.yaml`) with
    an `ItemList` of `Event` for the **house category** events. Their `startDate` is the
    derivable ISO partial date (`YYYY`, `YYYY-MM` or `YYYY-MM-DD`). Events without a
    derivable date are left out. Event nodes carry name, dates, place and URL; the descriptions
    stay on the page only, to keep the HTML small.
  - **Image events**: `ImageObject` with creator and licence.
  - **Pages under `/irasok/`**: `Article`, once articles exist.
- `sitemap.xml` and `robots.txt` are generated by Astro endpoints (3 pages, so no sitemap
  integration dependency is needed).
- **Rationale**: Background (Hungary/World) events are context, not the building's history,
  so marking them up as the building's events would mislead crawlers.
- **Alternatives considered**: @astrojs/sitemap (an unnecessary dependency for 3 URLs).

## R11. Build modes (Clarification Q4)

- **Decision**: the environment variable `D18_BUILD_MODE=draft|release` (default `draft`).
  - **`pnpm build:draft`**: prints the missing-item report, adds a draft banner and
    `<meta name="robots" content="noindex, nofollow">`, and makes `robots.txt` return
    `Disallow: /`.
  - **`pnpm build:release`**: throws `MissingEditorialItems` (non-zero exit) if the report is
    not empty.
  - **Structural errors fail both modes**: parse errors, duplicate or orphaned ids, and
    missing manifest entries for a `Kép URL`.
  - `SITE_URL` must be set explicitly for release.
- **Rationale**: This implements FR-039 with a single code path (the audit function is pure
  and unit-tested).

## R12. Testing and quality gates

- **Decision**:
  - **Unit tests**: Vitest **5.0.1** (2026-09-15) for the parser, ids, inline renderer, date
    derivation and editorial audit.
  - **Output tests**: Vitest assertions over `dist/` HTML for the counts in SC-001/SC-003 and
    for no remote `img` URLs or internal PDFs.
  - **HTML validation**: html-validate **11.16.0** (2026-09-15) over `dist/**/*.html`.
  - **Link check**: linkinator **8.1.0** over the built site, internal links only.
  - **Lighthouse**: @lhci/cli **0.15.1** (uses a locally installed Chrome) for the budgets in
    Principle II. It runs at 320/768/1280 px widths, together with a manual review of the
    responsive layout (see quickstart).
  - **Type checking**: TypeScript **6.0.3**, with `astro check` via @astrojs/check
    **0.9.10**, which does not support TypeScript 7.
- **Alternatives considered**: Playwright visual tests (heavy; can be added later);
  html-validate 11.16.1 and Vitest 5.0.2 (younger than 7 days).

## R13. Supply chain

- **Decision**:
  - Exact versions in `package.json`; `save-exact` in `.npmrc`; `pnpm-lock.yaml` committed.
  - `pnpm install --frozen-lockfile` in CI; `minimumReleaseAge: 10080` in
    `pnpm-workspace.yaml`.
  - If the repository is hosted on GitHub: `.github/dependabot.yml` with
    `cooldown: { default-days: 7 }` for the npm and github-actions ecosystems, and CI actions
    pinned by commit SHA.
  - Python tools run only through `uvx` with exact versions.

## Open items carried forward (not blocking the plan)

- Hosting, final domain and route (`SITE_URL`); the release build requires it.
- Owner-supplied editorial data: 108 titles to review, image alt/caption/credit, facade
  credit, Impresszum, and the building's postal code and geo coordinates. The release build
  lists everything still missing.
