---

description: "Task list for the Lakók page"
---

# Tasks: Lakók page

**Input**: Design documents from `/specs/007-lakok-page/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/site-pages.md, quickstart.md

**Tests**: FR-010 requires the site output checks to cover the new page and menu order, so site test tasks are included, in `tests/site/output.test.ts`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 = read the page, US2 = collapsible name lists, US3 = era bands and site look

---

## Phase 1: Setup

- [X] T001 [P] In `src/lib/seo/jsonld.ts`, make `imageUrl` optional in `articleNode()`'s argument type. Spread `image` into the result only when `imageUrl` is given, so an `Article` without an image has no `image` key. The Építők and Névadó calls stay unchanged.

---

## Phase 2: Foundational (menu, sitemap, audits)

- [X] T002 In `src/components/SiteHeader.astro`, set the `pages` list to Építők `/epitok/`, Lakók `/lakok/`, Névadó `/nevado/` and Impresszum `/impresszum/`, in that order.
- [X] T003 [P] In `src/components/SiteFooter.astro`, insert `<li><a href="/lakok/">Lakók</a></li>` between the Építők and Névadó items.
- [X] T004 [P] In `src/pages/sitemap.xml.ts`, set the paths to `['/', '/epitok/', '/lakok/', '/nevado/', '/impresszum/']`.
- [X] T005 [P] In `lighthouserc.json`, add `http://localhost/lakok/` after `http://localhost/epitok/`.
- [X] T006 Update `tests/site/output.test.ts` for the new page and menu order:
  - Set `PAGES` to `['index.html', 'epitok/index.html', 'lakok/index.html', 'nevado/index.html', 'impresszum/index.html']`.
  - In the "every page" menu test, rename it to "Építők, Lakók, Névadó, Impresszum" and set `expected` to `['/epitok/', '/lakok/', '/nevado/', '/impresszum/']`.
  - In the sitemap test, also expect `/lakok/<\/loc>`.
  - In the "site menu" test, expect `links` to have length 8, and `links.slice(4)` to equal `['/epitok/', '/lakok/', '/nevado/', '/impresszum/']`.
  - In "marks the current page in the menu", also expect `read('lakok/index.html')` to match `/<a href="\/lakok\/" aria-current="page"/`.

**Checkpoint**: The menu, sitemap and audits point to `/lakok/`. The tests fail until the page exists.

---

## Phase 3: User Story 1 – Read who lived in the house (P1) 🎯 MVP

**Goal**: A visitor reads the full Lakók story at `/lakok/`, with working source markers and the correction note.

**Independent Test**: Open `/lakok/` from the menu. Every section of `input/lakok.md` appears in order with its wording, the 1944–1945 section has its own heading, every `[N]` marker jumps to its source, and the correction note closes the page.

- [X] T007 [US1] Add a `describe('Lakók page', …)` block to `tests/site/output.test.ts` that reads `lakok/index.html` and asserts:
  - It contains `<meta property="og:type" content="article"`, and `jsonLdTypes(html)` contains `WebSite`, `BreadcrumbList` and `Article` but not `ImageObject`.
  - It has no `<img` and no `<figure class="evidence` (FR-007a).
  - It has an `h2` whose text is "1944–1945: csillagos ház".
  - The `id="forras-N"` values equal 1–27 in order. The set of `href="#forras-N"` values equals that same set, so every marker resolves and every source is cited.
  - It contains no `utm_` and no `href="https://www.dembinszky18.hu`.
  - The `<tbody>` row counts, in page order, are `[67, 35, 107]`.
  - It has a `mailto:` link that comes after `id="forras-27"`.
- [X] T008 [US1] Create `src/pages/lakok/index.astro`. Model the frontmatter on `src/pages/nevado/index.astro`, but with no image imports:
  - `path = '/lakok/'` and `title = 'Lakók – Dembinszky utca 18.'`.
  - A Hungarian `description` of 50–160 characters, written from the lead ("Zongoratanárnő és színésznő…").
  - The JSON-LD has `websiteNode`, `breadcrumbNode` (`site.building.name` → `/`, `Lakók` → `path`) and `articleNode` without `imageUrl`.
  - Import `../../styles/story.css`.

  Inside `<Base … ogType="article"><article class="lakok">`:
  - A first `<header class="container story">` with `<p class="kicker">Dembinszky utca 18.</p>`, `<h1>Lakók</h1>`, the first draft paragraph as `<p class="story__lead">`, and the method paragraph as a normal `<p>`, keeping its `*Budapesti Czim- és Lakásjegyzék*` as `<em>` and its `[1–4]` marker.
  - Every `##` section in later tasks is a `<section class="lakok-band lakok-band--N" aria-labelledby="…">` wrapping a `<div class="container story">`. Sections without a band use `class="lakok-band"`.
  - Marker rule (research R5) for all tasks: `[N]` → `<sup>[<a href="#forras-N">N</a>]</sup>`. `[N, M]` → one `<sup>` with a link per number, separated by ", ". `[N–M]` → `<sup>[<a href="#forras-N">N</a>–<a href="#forras-M">M</a>]</sup>`. Mixed markers such as `[1–2, 8]` combine both rules.
  - External links get `rel="noopener noreferrer"`. Draft `*…*` becomes `<em>`, and `**…**` becomes `<strong>`.
- [X] T009 [US1] In `src/pages/lakok/index.astro`, transcribe draft lines 7–127 as `<section class="lakok-band lakok-band--1" aria-labelledby="kezdetek">` with `<h2 id="kezdetek">A kezdetek: színpad, műhely, hivatal, 1902–1904</h2>`.
  - Add the intro paragraph.
  - Add `<h3>A két korai évfolyam névsora</h3>`, then the "—" legend paragraph.
  - Add the table, inside `<div class="name-list__frame" role="region" aria-label="A két korai évfolyam névsora" tabindex="0">`. It has a `<caption>`, a `<thead>` with the three `th scope="col"` labels as in the draft, and a `<tbody>` with all 67 rows verbatim.
  - Add the bridging paragraph (draft line 85) and the 7 `h3` portraits: Armandola, Almássy, Kramer, Rothauser, Mautner, Sztankovits, Szellő.
  - Add the closing Spitz paragraph. The `*Építők*` mention links to `/epitok/`.
- [X] T010 [US1] In `src/pages/lakok/index.astro`, transcribe draft lines 129–207 as the `lakok-band--2` section, `id="vasut-1922"`, with `<h2>1922: vasút, sajtó és autóvállalkozás</h2>`.
  - Add the intro.
  - Add `<h3>Az 1922–1923-as évfolyam névsora</h3>` and the 35-row two-column table in a `name-list__frame` with a caption.
  - Add the paragraph at draft line 173, then the 6 portraits: Graselly, Petrovits, Takács, Merényi, Hieronymi, Ádám.
  - Add the bridging paragraph ending "…üldöztetés és ostrom is elérte a házat."

  Then add a new `<section class="lakok-band lakok-band--3" aria-labelledby="csillagos-haz">` with `<h2 id="csillagos-haz">1944–1945: csillagos ház</h2>`. It holds the draft line-209 paragraph verbatim, with its two inline links (`csillagos házak` → rendelet1.pdf#page=3, `Dénes Mari` → csillagoshazak.hu/hazak/VII/dembinszky18) and markers [26] [27] (FR-006a).
- [X] T011 [US1] In `src/pages/lakok/index.astro`, transcribe draft lines 211–372 as the `lakok-band--4` section, `id="gepek-1954"`, with `<h2>1954: gépek és munkanormák</h2>`.
  - Add the intro.
  - Add `<h3>Az 1954-es választói névjegyzék házbeli listája</h3>`, then the birth-name and asterisk note.
  - Add the 107-row table in a `name-list__frame` with a caption. A name cell with `<br>` in the draft renders the birth name as `<br><span class="name-list__birth">…</span>`.
  - Add the *Névjavítások* and *Lehetséges foglalkozás-feloldások* notes, then the paragraph after `</details>`.
  - Add the 6 portraits: Lakatos, Kovács, Horváth, Lőwy, Felkai, Molnár. Then add the closing paragraph.
  - Do not reproduce the draft's raw `<details>` and `<summary>` lines here; US2 adds them.
- [X] T012 [US1] In `src/pages/lakok/index.astro`, add the final unbanded `<section class="lakok-band" aria-labelledby="megelhetesek">` with "Egy cím, változó megélhetések" and its two paragraphs. Then add `<section class="sources container story" aria-labelledby="forrasok">`:
  - `<h2 id="forrasok">Források és továbbolvasás</h2>`.
  - The *Névsori megjegyzések* paragraph.
  - An `<ol>` of 27 `<li id="forras-N">` items, transcribed from draft lines 384–410 as link plus note text. Entry 13 links to `/epitok/`, not the absolute URL. Entries 12 and 17 keep both of their links.
  - After the list, `<p class="lakok-note">`: "Ha Ön vagy családtagja szerepel a névsorokban, és javítást vagy törlést kér, írjon a <a href={`mailto:${site.impresszum.contactEmail}`}>…</a> címre." Take the address from `loadSiteData().site.impresszum`, and do not hard-code it (FR-009a).
- [X] T013 [US1] Run `pnpm check`, `pnpm build:draft` and `pnpm test:site`. Fix any html-validate, linkinator fragment or T006/T007 failures in `src/pages/lakok/index.astro`.

**Checkpoint**: `/lakok/` is complete, readable and fully linked. The tables are visible and open, with no collapsing yet.

---

## Phase 4: User Story 2 – Collapsible name lists (P1)

**Goal**: The three name lists are closed on load, open in place by touch, mouse and keyboard without JavaScript, and print open.

**Independent Test**: Load `/lakok/`. Three closed lists show their labels and counts. Each one opens and closes by click and by Enter or Space, also with JavaScript disabled. The print preview shows all lists open.

- [X] T014 [US2] In the `Lakók page` block of `tests/site/output.test.ts`, assert there are exactly 3 `<details class="name-list"` elements, that none has an `open` attribute, and that their `<summary>` texts end with `(67 bejegyzés)`, `(35 bejegyzés)` and `(107 bejegyzés)`, in that order.
- [X] T015 [US2] In `src/pages/lakok/index.astro`, wrap each list in `<details class="name-list" id="nevsor-1902|nevsor-1922|nevsor-1954">`. Each wrapper starts with `<summary>`, and the `h3` stays above the `details`. The summaries are:
  - "A két korai évfolyam névsorának megnyitása (67 bejegyzés)"
  - "Az 1922–1923-as évfolyam névsorának megnyitása (35 bejegyzés)"
  - "A teljes 1954-es választói névsor megnyitása (107 bejegyzés)"

  Inside each `details`, put the notes that belong to it (data-model "Name list"): the "—" legend in the early list; for 1954, the birth-name note before the table and the *Névjavítások* and *Lehetséges foglalkozás-feloldások* notes after it. The story paragraphs stay outside.
- [X] T016 [P] [US2] Create `src/scripts/print-details.ts`. On `beforeprint`, open every `details.name-list` that is not open and remember which ones. On `afterprint`, close those again. Use vanilla code with no dependencies, about 300 bytes. Import it from `src/pages/lakok/index.astro` in a `<script>` block, the same way Névadó imports `lightbox.ts`.
- [X] T017 [P] [US2] Add the name-list styles to `src/styles/story.css`, using tokens from `src/styles/tokens.css` and no animation (research R3, R4):
  - `.name-list` has a frame of `1px solid var(--d18-rule)` and a slightly lighter surface than its band.
  - `summary` has `list-style: none`, hides `::-webkit-details-marker`, has `min-height: 44px`, uses Source Sans 600, and has a CSS chevron that rotates on `[open]`, a hover colour and a `:focus-visible` ring.
  - `.name-list__frame` has `overflow-x: auto` and a visible focus outline.
  - The table is `width: 100%`, with `border-collapse: collapse` and zebra rows using `--house-row`. Cells use `overflow-wrap: anywhere`. `th` is left-aligned. `.name-list__birth` is muted and smaller. `caption` is visually styled as a small kicker.
  - `#nevsor-1902 table` has `min-width: 30rem`.
  - `@media print` drops the frame overflow, so tables print in full.

**Checkpoint**: The lists collapse, and the page at 375 px is at least a third shorter with them closed (SC-003).

---

## Phase 5: User Story 3 – A page that feels like part of the timeline (P2)

**Goal**: The period sections carry the matching era tones, and the page looks like a sibling of Építők and Névadó.

**Independent Test**: At 320, 768 and 1280 px, compare `/lakok/` with `/epitok/`, `/nevado/` and the home era openers. The bands use the era 1–4 tones in order, the 1944–1945 band is dark, contrast passes, and there is no sideways scroll.

- [X] T018 [US3] Add the band styles to `src/styles/story.css` (research R2):
  - `.lakok-band` has vertical padding of `clamp(2.5rem, 7vw, 4.5rem)`.
  - `.lakok-band--1` to `--4` set `background: var(--era-1…4)`.
  - On light bands, muted text uses `var(--era-muted)` instead of `--d18-muted`.
  - `.lakok-band--3` sets `color: var(--era-3-ink)`. Its links, `sup a`, and muted text use `var(--era-3-muted)`. Its focus ring stays visible, and `.name-list`, if any, is adapted.
  - Inside bands, `.story h2:first-child` drops the `border-top` and top padding.
  - `.lakok-note` matches `.sources` typography, with `margin-top: 2rem`.
  - `.lakok header.story` and the sources keep the paper background.
- [X] T019 [US3] Run `pnpm build:release` (or `pnpm dev`) and measure the header at 900, 960 and 1024 px (research R7). If the one-row menu overflows with four page links, change `@media (min-width: 900px)` in `src/styles/base.css` to the smallest width where it fits, rounded up to the next 20 px. Update any matching breakpoint comment there and in `src/scripts/site-menu.ts`, if that script hard-codes 900.
- [X] T020 [US3] Check `/lakok/` at 320, 768 and 1280 px with all lists open: no sideways page scroll, wrapped headings and cells, the early table scrolling inside its frame, and each band reading as a chapter. Run the Lighthouse accessibility audit on `/lakok/`, with no contrast or `scrollable-region-focusable` failures. Fix any problems in `src/styles/story.css`.

**Checkpoint**: The page visually matches the site, and its colour bands follow the timeline eras.

---

## Phase 6: Polish

- [X] T021 [P] Update `README.md`:
  - Line 6: three story pages (`/epitok/`, `/lakok/` for the residents, `/nevado/`).
  - "Story pages" section: add `src/pages/lakok/index.astro` and `input/lakok.md`, and mention the collapsible name lists and era bands.
  - Project layout: `input/epitok.md, lakok.md, nevado.md` and `src/pages/` with `/lakok/`.
  - Add `specs/007-lakok-page/` to the spec list on line 18.
  - Mention `src/scripts/print-details.ts` where the browser scripts are listed.
- [X] T022 Run the one-off completeness check in `specs/007-lakok-page/quickstart.md`, then `pnpm check`, `pnpm test`, `pnpm build:release`, `pnpm test:site` and `pnpm lighthouse`. All must pass, with `/lakok/` at ≥ 95/95/95 and SEO = 100.
- [X] T023 Walk through quickstart manual checks 1–10. Stage `input/lakok.md` together with the feature changes, so the draft is committed like `input/epitok.md` and `input/nevado.md`.

---

## Dependencies & Execution Order

- **Setup (T001)** → needed by T008.
- **Foundational (T002–T006)** → can start at once. T006 fails until US1 lands, which is expected.
- **US1 (T007–T013)** → T008 → T009 → T010 → T011 → T012 run in order in one file, then T013. This is the MVP.
- **US2 (T014–T017)** → needs the tables from US1. T016 and T017 run in parallel with each other, and T015 edits the page.
- **US3 (T018–T020)** → needs the band markup from US1. It is independent of US2, apart from T020's "lists open" check.
- **Polish (T021–T023)** → after all stories.

## Parallel Examples

- Foundational: T003, T004 and T005 together, alongside T001.
- US2: T016 (script) and T017 (styles) together, while T015 edits the page.
- US2 and US3 can proceed side by side once US1 is done: T017 and T018 both touch `story.css`, so run them one after the other or merge them carefully.

## Implementation Strategy

1. **MVP**: Setup, Foundational and US1. The page is published with all its content, in the menu, with open tables.
2. **Add US2**: the collapsible lists, the main readability win.
3. **Add US3**: era bands and visual polish, and the header breakpoint fix if needed.
4. **Polish**: docs and the full quality gate, then commit.
