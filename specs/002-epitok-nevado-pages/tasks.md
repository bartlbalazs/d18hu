---

description: "Task list for the Építők and Névadó pages"
---

# Tasks: Építők and Névadó pages

**Input**: Design documents from `/specs/002-epitok-nevado-pages/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/site-pages.md, quickstart.md

**Tests**: FR-010 requires the existing site output checks to be updated, so the site test tasks are included, in `tests/site/output.test.ts`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 = Építők, US2 = Névadó, US3 = hand-authored, not generated

---

## Phase 1: Setup

- [X] T001 Download the Commons original of `RodakowskiHenryk.PortretGeneralaHenrykaDembinskiego.1852.jpg`, found through `https://commons.wikimedia.org/wiki/Special:FilePath/RodakowskiHenryk.PortretGeneralaHenrykaDembinskiego.1852.jpg`, into the scratchpad. Resize it with sharp to 1600 px on the long edge as JPEG quality 85, then save it as `src/assets/pages/dembinszky-rodakowski.jpg`.
- [X] T002 [P] Create `src/styles/story.css` with mobile-first story-page styles. It needs a reading column that extends `.page`, a lead paragraph, an opening `figure.evidence` full column width, `h2`/`h3` spacing, a `.story-highlight` pull-quote, a `.sources` list, and `overflow-wrap: anywhere` on headings. Use `clamp()` and tokens from `src/styles/tokens.css`.

---

## Phase 2: Foundational (blocks both story pages)

- [X] T003 [P] Add `ogType?: 'website' | 'article'` to the Props in `src/layouts/Base.astro` and pass it through to `<SeoHead>`.
- [X] T004 [P] Add `articleNode(site, { headline, description, path, imageUrl, datePublished? })` to `src/lib/seo/jsonld.ts`. It returns an `Article` with `@id` `<path>#article`, `inLanguage: 'hu'`, `mainEntityOfPage`, `image`, and `isPartOf` → `/#website`.
- [X] T005 Replace the `pages` list in `src/components/SiteHeader.astro` with Építők `/epitok/`, Névadó `/nevado/`, and Impresszum `/impresszum/`, in that order.
- [X] T006 [P] Replace the footer links in `src/components/SiteFooter.astro` with the same three links in the same order: Építők, Névadó, Impresszum.
- [X] T007 Delete `src/pages/irasok/`. Remove `articleSchema` and `articles` from `src/lib/editorial/schema.ts`, and the `articles` key and its comment from `editorial/site.yaml`. Remove the `.article-list` rules from `src/styles/base.css` and change the "Simple text pages (Írások, Impresszum)" comment to name Impresszum only.
- [X] T008 Set the path list in `src/pages/sitemap.xml.ts` to `['/', '/epitok/', '/nevado/', '/impresszum/']`, with no articles.
- [X] T009 [P] Replace `http://localhost/irasok/` in `lighthouserc.json` with `http://localhost/epitok/` and `http://localhost/nevado/`.
- [X] T010 In `tests/site/output.test.ts`, change the page list in "every page" to `['index.html', 'epitok/index.html', 'nevado/index.html', 'impresszum/index.html']`. Add three tests:
  - For every page, the header and footer page links appear in the order `/epitok/`, `/nevado/`, `/impresszum/`.
  - No file in `dist/` contains `href="/irasok/"`, and `dist/irasok/` does not exist.
  - The sitemap lists `/epitok/` and `/nevado/` and does not list `/irasok/`.

**Checkpoint**: The menu and sitemap point to the new URLs, and Írások is gone.

---

## Phase 3: User Story 1 – Építők (P1) 🎯 MVP

**Goal**: A visitor reads the full builders story at `/epitok/`.

**Independent Test**: Open `/epitok/` from the menu. The façade photo appears first. Every section of `input/epitok.md` follows in order, and a "Források" list with 3 entries closes the page.

- [X] T011 [US1] In `tests/site/output.test.ts`, add tests for `epitok/index.html`:
  - `og:type` is `article`.
  - The JSON-LD contains `Article` and `ImageObject`.
  - There is exactly one `figure class="evidence` and it is loaded eagerly.
  - No `utm_` appears.
  - A `.sources` list has 3 distinct `https` links.
- [X] T012 [US1] Create `src/pages/epitok/index.astro`, transcribing `input/epitok.md` by hand into semantic HTML inside `<Base ogType="article">` and an `<article>`.
  - Use `h1` "Építők". Render the italic intro as the lead paragraph. Keep all 7 `h2` sections and their 5 `h3` sub-sections, verbatim with the draft's wording, `<strong>` and `<em>`.
  - Keep the inline source links, but remove `?utm_source=chatgpt.com` from them.
  - Open with an `EvidenceFigure` of `assets/facade.png`, eager, using `hero.photo` alt, caption and credit from `loadSiteData().site`.
  - Set a few of the draft's own short paragraphs apart as `.story-highlight` accents, without duplicating any text. Render the 1911 and 1916 register excerpts as `.ledger` lists.
  - End with `<section class="sources"><h2>Források</h2>` listing bp16.hu, filmarchiv.hu and kultura.hu once each, with descriptive titles.
  - Set the title to "Építők – Dembinszky utca 18.", with a description of 50–160 characters. JSON-LD is `websiteNode`, `breadcrumbNode` (home → Építők), `articleNode` and `imageNode`.
  - Import `../../styles/story.css` and `../../scripts/lightbox.ts`.

**Checkpoint**: `/epitok/` is complete, and the US1 tests pass.

---

## Phase 4: User Story 2 – Névadó (P1)

**Goal**: A visitor reads about Dembinszky Henrik at `/nevado/`.

**Independent Test**: Open `/nevado/`. The Rodakowski portrait and its caption open the page, clicking [3] jumps to source 3, and the "Javasolt nyitókép" text does not appear.

- [X] T013 [US2] In `tests/site/output.test.ts`, add tests for `nevado/index.html`:
  - `og:type` is `article`.
  - The JSON-LD contains `Article` and `ImageObject`.
  - There is one eager opening figure.
  - Every `href="#forras-N"` has a matching `id="forras-N"`, and ids 1–13 all exist.
  - The page does not contain "Javasolt nyitókép".
  - No `utm_` appears.
- [X] T014 [US2] Create `src/pages/nevado/index.astro`, transcribing `input/nevado.md` by hand inside `<Base ogType="article">` and an `<article>`.
  - Use `h1` "Névadó". Render the italic intro as the lead paragraph, then the 5 `h2` sections verbatim.
  - Open with an `EvidenceFigure` of `src/assets/pages/dembinszky-rodakowski.jpg`, `kind="photo"`, eager. The caption is the "Képaláírás" text. The credit is "Henryk Rodakowski, 1852 · Krakkói Nemzeti Múzeum · közkincs", and the source is the Wikimedia Commons file page.
  - Do not render the "Javasolt nyitókép" section.
  - Render each `[n]` as `<sup><a href="#forras-n">[n]</a></sup>`.
  - End with `<section class="sources"><h2>Források és továbbolvasás</h2><ol>` holding 13 `<li id="forras-n">` entries, keeping each note text. Entry 11 has two links.
  - Set the title to "Névadó – Dembinszky utca 18.", with a description of 50–160 characters. JSON-LD is `websiteNode`, `breadcrumbNode` (home → Névadó), `articleNode` and `imageNode` for the portrait.
  - Import `../../styles/story.css` and `../../scripts/lightbox.ts`.

**Checkpoint**: `/nevado/` is complete, and the US2 tests pass.

---

## Phase 5: User Story 3 – Hand-authored, not generated (P2)

**Goal**: Editing the drafts in `input/` does not change the site.

**Independent Test**: No file under `src/`, `scripts/` or `astro.config.mjs` references `epitok.md` or `nevado.md`.

- [X] T015 [US3] Confirm with `grep -rn "epitok.md\|nevado.md" src scripts astro.config.mjs` that there are no hits. Also confirm that the pages use their own markup: only Névadó has the numbered markers, and only Építők has the ledger excerpts.

---

## Phase 6: Polish and validation

- [X] T016 [P] Update `README.md`:
  - The page list on line 6 becomes `/epitok/` and `/nevado/`.
  - Replace the `articles` paragraph around line 148 with a short note. It should say that the story pages are hand-written from the drafts in `input/epitok.md` and `input/nevado.md`, that the drafts are not read at build time, and that later edits are made in the `.astro` files.
  - The `src/pages/` line in the structure section lists the new routes.
  - Add `src/assets/pages/` (story-page images) to the structure.
- [X] T017 Run `pnpm check`, `pnpm test`, `pnpm build:draft` and `pnpm test:site`, and fix any failures.
- [X] T018 Run the one-off content completeness check from `quickstart.md` and fix any missing heading or link.
- [X] T019 Run `pnpm lighthouse` and confirm the Principle II thresholds are met on `/epitok/` and `/nevado/`.

---

## Dependencies & Execution Order

- Phase 1 comes first. T001 and T002 are independent of each other.
- Phase 2 depends on nothing in Phase 1, apart from T010 changing the test file. T005, T007 and T008 share nothing, but T007 must run before a build.
- US1 (T011–T012) needs T002, T003 and T004. US2 (T013–T014) needs T001–T004. US1 and US2 are independent of each other, except that T011 and T013 both edit `tests/site/output.test.ts` and must run one after the other.
- US3 (T015) runs after US1 and US2.
- Polish runs last. T016 can start any time after Phase 2.

## Parallel Example

```text
T002 story.css   ‖ T003 Base ogType ‖ T004 articleNode ‖ T006 footer ‖ T009 lighthouserc
T012 epitok page ‖ T014 nevado page   (after the foundation)
```

## Implementation Strategy

1. Complete Phases 1–2 so the menu, sitemap and tests point to the new pages.
2. Complete US1 (Építők), which is the MVP. It can ship on its own if the Névadó menu item is left out temporarily.
3. Complete US2 (Névadó), then the US3 check and the polish tasks.
