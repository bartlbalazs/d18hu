---

description: "Task list for the Épület page"
---

# Tasks: Épület page

**Input**: Design documents from `/specs/013-epulet-page/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/site-pages.md, quickstart.md

**Tests**: FR-014 requires the site output checks to cover the new page and the new menu order. SC-006 and SC-007 need automated checks, and research R6 needs parser unit tests. These test tasks are included.

**Wording**: The Hungarian texts for the timeline rows, event titles and Építők postscript are in [data-model.md](data-model.md). Use them verbatim, unless the owner changed them in review.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 = read the page, US2 = document figures, US3 = site look and era bands, US4 = one authorship story (Építők + corrected timeline rows), US5 = new timeline events

---

## Phase 1: Setup (source material)

- [X] T001 [P] Copy `/home/bartlbalazs/Downloads/epulet/d18_epulet.md` to `input/epulet.md`. Change only the reference `kepek/4.jpg` to `kepek/4.png`, in the figure and in source 2, because the file is a PNG. The build never reads this file.
- [X] T002 [P] Create `src/assets/pages/epulet/` and copy the 11 images that need no cleaning, renamed as in [data-model.md § Épület figures](data-model.md#épület-figures-srclibepuletfigurests):
  - `2.png` → `02-homlokzat-zaradek-1899.png`
  - `3.png` → `03-metszet-1899.png`
  - `4.png` → `04-homlokzat-1899.png`
  - `5a.jpg` → `05a-mellinger-belyegzo.jpg`
  - `5b.jpg` → `05b-closettek.jpg`
  - `6.png` → `06-hasznalhatasi-engedely-1901.png`
  - `7.png` → `07-erkely-1901.png`
  - `8.jpg` → `08-helyreallitas-1948.jpg`
  - `9.jpg` → `09-zaradek-1956.jpg`
  - `10.png` → `10-fuggofolyoso-leiras-1969.png`
  - `11.png` → `11-fuggofolyoso-alaprajz-1969.png`
- [X] T003 [P] Clean `1.jpg` into `src/assets/pages/epulet/01-jovahagyas-markus-1899.jpg` (research R2). Run a one-off Node command from the repository root, passing the downloaded path as an argument. It uses the existing `sharp`: `sharp(input).rotate().resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 90 }).toFile(output)`, without `withMetadata`. Then check with `sharp(output).metadata()` that the result is 1800 × 2400, has no `exif`, and has orientation absent or 1. Never copy the original `1.jpg` into the repository.

---

## Phase 2: Foundational (shared story-page code, navigation, timeline source links)

**⚠️ Must be complete before any user story.** After this phase, Lakók looks and tests exactly as before.

### Shared figure code and classes (research R3)

- [X] T004 Create `src/lib/images/story-figures.ts`:
  - Move the `LakokFigure` type from `src/lib/lakok/figures.ts`, renamed `StoryFigure`. Make `source` optional, add an optional `id: string`, and keep `label?` and `size: 'narrow' | 'medium' | 'wide' | 'column'`.
  - Move `displayWidths` and `figureProps` unchanged, except that the size and strip classes become `story-figure--${size}` and `story-figure--strip`. `figureProps` passes `id` through.
  - Keep the comment that the widths must match the `story-figure--*` rules in `story.css`.
- [X] T005 Update `src/lib/lakok/figures.ts` to hold data only:
  - Import `StoryFigure` from `../images/story-figures.ts`, and use `satisfies Record<string, StoryFigure>`.
  - Delete the moved type, `displayWidths` and `figureProps`.
  - In `src/pages/lakok/index.astro`, import `figureProps` from `../../lib/images/story-figures.ts`.
- [X] T006 [P] In `src/components/EvidenceFigure.astro`, add an optional `id?: string` prop, rendered as `id={id}` on the `<figure>`. The output is unchanged when the prop is absent.
- [X] T007 Rename the classes in `src/styles/story.css` (all rules, including the `@media` block near line 328): `lakok-band` → `story-band` (with `--1…--4`), `lakok-figure--*` → `story-figure--*`, `lakok-figure-pair` → `story-figure-pair`. Apply the same rename in `src/pages/lakok/index.astro`. Keep `lakok-note` and the `.lakok` article class as they are, because only Lakók uses them.
- [X] T008 In `tests/site/output.test.ts`, replace every `lakok-band` with `story-band` and every `lakok-figure-pair` with `story-figure-pair`. Then run `pnpm build:draft && pnpm test:site`. All existing tests must pass unchanged otherwise.

### Navigation and site lists

- [X] T009 [P] In `src/components/SiteHeader.astro`, set `pages` to Épület `/epulet/`, Építők `/epitok/`, Lakók `/lakok/`, Névadó `/nevado/`, Impresszum `/impresszum/`, in that order.
- [X] T010 [P] In `src/components/SiteFooter.astro`, insert `<li><a href="/epulet/">Épület</a></li>` before the Építők item.
- [X] T011 [P] In `src/pages/sitemap.xml.ts`, set the paths to `['/', '/epulet/', '/epitok/', '/lakok/', '/nevado/', '/impresszum/']`.
- [X] T012 [P] Add `http://localhost/epulet/` before `http://localhost/epitok/` in `lighthouserc.json`. Add `https://www.dembinszky18.hu/epulet/` before the Építők URL in `lighthouserc.live.json`.
- [X] T013 Update `tests/site/output.test.ts` for the menu order:
  - Add `'epulet/index.html'` to `PAGES` after `'index.html'`.
  - Rename the menu test to "…as Épület, Építők, Lakók, Névadó, Impresszum", with `expected = ['/epulet/', '/epitok/', '/lakok/', '/nevado/', '/impresszum/']`.
  - In the sitemap test, also expect `/epulet\/<\/loc>`.
  - In "site menu", expect `links` to have length 9, and `links.slice(4)` to equal the same five paths.
  - In "marks the current page", also expect `read('epulet/index.html')` to match `/<a href="\/epulet\/" aria-current="page"/`.

### Site-relative timeline source links (research R6)

- [X] T014 In `src/lib/timeline/inline-html.ts`, add `assertSourceUrl(url)`. It accepts `assertHttpsUrl` URLs or a site-relative path matching `/^\/(?!\/)[^\s]*$/`, and otherwise throws `InlineRenderError('source link must be an https:// URL or a site path starting with "/", got "…"')`. In `src/lib/timeline/parse.ts`, `parseSources` uses `assertSourceUrl`. The description links and `parseImageUrl` keep `assertHttpsUrl`.
- [X] T015 [P] In `tests/unit/parse.test.ts`, add tests that follow the existing fixture style:
  - A source cell `[Épület](/epulet/#erkely)` parses to `{ label: 'Épület', url: '/epulet/#erkely' }`.
  - Source cells with `[x](//example.com/a)`, `[x](http://example.com)` or `[x](epulet/)` throw.
  - A description containing `[x](/epulet/)` still throws.
- [X] T016 In `src/components/TimelineEvent.astro`, render a source whose `url` starts with `/` as `<a href={source.url}>{source.label}</a>`, without `rel` and without `icons.externalLink`. External sources render as before.

**Checkpoint**: `pnpm test` passes. Menu tests fail only because `/epulet/` does not exist yet.

---

## Phase 3: User Story 1 – Read how the building was made and changed (P1) 🎯 MVP

**Goal**: A visitor opens Épület from the menu and reads the whole draft, with working source markers.

**Independent Test**: The quickstart, step 3, items 1, 2 and 4 (markers only).

- [X] T017 [US1] Add a `describe('Épület page', …)` block to `tests/site/output.test.ts` that reads `epulet/index.html` and asserts:
  - `og:type` is `article`. `jsonLdTypes` contains `WebSite`, `BreadcrumbList`, `Article` and `ImageObject`, and the `Article` node's `@id` ends with `/epulet/#article`.
  - The `<h2 id="…">` ids, in page order, equal `['telek','rajzasztal','arveres','mellinger','hasznalatba-vetel','erkely','spitz-nev','helyreallitas','lakasmegosztas','gang','osszegzes','forrasok']`.
  - Exactly two `<h3`, with ids `alaprajz` and `homlokzat`, both between `id="mellinger"` and `id="hasznalatba-vetel"`.
  - The `id="forras-N"` values equal 1–11 in order, and the set of `href="#forras-N"` equals that same set.
  - The page contains `href="/epitok/"` and `href="/lakok/"` inside the article, and no `dembinszky18.hu` and no `utm_` anywhere in `<article`.
- [X] T018 [US1] Create `src/pages/epulet/index.astro`, modelled on `src/pages/lakok/index.astro`:
  - Frontmatter: `path = '/epulet/'`, `title = 'Épület – Dembinszky utca 18.'`, and a Hungarian `description` of 50–160 characters written from the lead.
  - JSON-LD:
    - `websiteNode`
    - `breadcrumbNode` (`site.building.name` `/` › `Épület` `/epulet/`)
    - `articleNode({ headline: 'Épület', … imageUrl })` with the opening image
    - `imageNode` for the opening photo
  - Markup: `<Base … ogType="article"><article class="epulet">`. The header holds `.container.story` with the kicker "Dembinszky utca 18.", `<h1>Épület</h1>`, the first lead paragraph as `story__lead`, and the next three lead paragraphs as `<p>`.
  - Then one `<section aria-labelledby="ID"><div class="container story">` per h2 in [data-model.md § Page sections](data-model.md#page-sections-srcpagesepuletindexastro). Use the draft's text verbatim, with `<em>`/`<strong>` where the draft has them; the two `###` headings become `<h3 id="alaprajz">` and `<h3 id="homlokzat">`.
  - Source markers become `<sup>[<a href="#forras-N">N</a>]</sup>`. For a range `[1–2]` or `[1–3]`, link both ends: `<a href="#forras-1">1</a>–<a href="#forras-3">3</a>`.
  - The draft's absolute links to `https://www.dembinszky18.hu/epitok/` and `/lakok/` become `/epitok/` and `/lakok/`.
  - The final section `forrasok` uses `class="container story sources"` and an `<ol>` with `<li id="forras-N">` for 1–11. Keep the bold labels as `<strong>`, and give outbound links `rel="noopener noreferrer"`.
  - Leave the image references in sources 2–4 and 6–8 as plain text for now; T023 turns them into anchors.
  - Load `../../scripts/lightbox.ts` in a `<script>` as Lakók does.
- [X] T019 [US1] Run `pnpm build:draft && pnpm test:site`. The T013 menu tests and the T017 tests pass, and html-validate and linkinator report no errors for `/epulet/`.

**Checkpoint**: The page is readable and reachable. It has no figures and no bands yet.

---

## Phase 4: User Story 2 – See the documents the story is built on (P1)

**Goal**: The opening photo and the 12 document photos sit at their places, zoomable, and the source list links to them.

**Independent Test**: The quickstart, step 3, items 3 and 4 (image references).

- [X] T020 [US2] Extend the Épület test block in `tests/site/output.test.ts`:
  - `count(html, /<figure class="evidence/g)` is 13. The first figure is `loading="eager"` and comes after `class="story__lead"`; the other 12 are lazy.
  - Figure ids `kep-1, kep-2, kep-3, kep-4, kep-5a, kep-5b, kep-6, kep-7, kep-8, kep-9, kep-10, kep-11` all exist, in that page order.
  - `count(html, /Fotó: a szerző/g)` is at least 12.
  - The JSON-LD has 13 `ImageObject` nodes.
  - Every `href="#kep-…"` in the `forrasok` section targets one of those ids, and sources 2, 3, 4, 6, 7 and 8 together link all 12.
- [X] T021 [US2] Add a test `describe('Épület source images', …)` in `tests/site/output.test.ts`. For each file in `src/assets/pages/epulet/`, `await sharp(path).metadata()` must have no `exif` and `orientation` undefined or 1 (SC-006). Import `sharp` at the top of the file.
- [X] T022 [P] [US2] Create `src/lib/epulet/figures.ts`, exporting `epuletFigures` (`satisfies Record<string, StoryFigure>`) with the 12 keys, files, sizes and ids from [data-model.md § Épület figures](data-model.md#épület-figures-srclibepuletfigurests). For each figure:
  - `caption` is the draft's italic caption without the trailing "Fotó: a szerző."
  - `credit` is `'Fotó: a szerző'`, `kind` is `'document'`, and there is no `source`.
  - `alt` is one Hungarian sentence describing what is visible on the sheet: text, stamp, drawing type.
- [X] T023 [US2] In `src/pages/epulet/index.astro`:
  - Add the opening figure after the lead's last paragraph, modelled on the Lakók opening. It uses `assets/facade4.png`, `class="story__opening"`, `widths={[400, 600, 784]}`, `sizes="(min-width: 760px) 704px, 100vw"`, `crop={{ aspectRatio: 4 / 3, position: 'bottom' }}`, `eager` and `quality={40}`, with a Hungarian alt describing the wavy roofline and the window frames with faces. Use `site.hero.photo.credit` from `loadSiteData()` as its credit (the same credit `Hero.astro` shows), plus `site.hero.photo` source fields if present.
  - Place `<EvidenceFigure {...figureProps(epuletFigures.X)} />` for each of the 12 figures at the "Placed after" positions in data-model.md.
  - Add one `imageNode` per document figure to `jsonLd`, with `contentUrl` from `fullSizeImage`, `credit: 'Fotó: a szerző'` and `path`.
  - In sources 2, 3, 4, 6, 7 and 8, replace each file name ("1.jpg" and so on) with `<a href="#kep-1">1. kép</a>`, and so on (`5a.jpg` → `#kep-5a` "5a. kép").
- [X] T024 [US2] Run `pnpm build:draft && pnpm test:site`. Then open `/epulet/` and check that kép 1 is upright, that each figure opens in the viewer, and that the 5b strip's zoom button doesn't cover the "Closettek" label at 320 px.

**Checkpoint**: The page shows every document.

---

## Phase 5: User Story 3 – A page that feels like part of the site (P2)

**Goal**: The era tones and a header that still fits with five page links.

**Independent Test**: The quickstart, step 3 item 5, and step 4.

- [X] T025 [US3] Extend the Épület test block in `tests/site/output.test.ts`. The `story-band--N` class of each `<section` that contains an h2 equals, in order, `[1,1,1,1,1,1,2,4,4,4]` for the first ten h2s. The `osszegzes` and `forrasok` sections carry `story-band` with no tone modifier, and the opening figure comes before the first `story-band`.
- [X] T026 [US3] In `src/pages/epulet/index.astro`, set the section classes as in research R4: `story-band story-band--1` for `telek` … `erkely`, `story-band story-band--2` for `spitz-nev`, `story-band story-band--4` for `helyreallitas` … `gang`, and plain `story-band` for `osszegzes` and `forrasok`.
- [X] T027 [US3] Measure the header in `pnpm preview` at 900 px and 1000 px wide (research R9). If the one-row header wraps or overflows with five page links, raise the `@media (min-width: 900px)` header breakpoint in `src/styles/base.css` and its README mention to the first width where it fits. Record the result in the commit message.
- [X] T028 [US3] Check `/epulet/` at 320, 768 and 1280 px for sideways scroll and contrast (captions and links on the era-1, era-2 and era-4 tones). Fix any issue only in `src/styles/story.css`.

**Checkpoint**: Épület matches the Lakók look.

---

## Phase 6: User Story 4 – The site tells one story about who designed the house (P2)

**Goal**: Építők ends with the answer, and the timeline no longer contradicts the findings.

**Independent Test**: The quickstart, step 3 items 6 and 7 (corrected rows).

- [X] T029 [US4] Add tests to `tests/site/output.test.ts`:
  - In `epitok/index.html`, the last `<p` inside `<article` has `class="story__postscript"` and contains `href="/epulet/"`, and it comes after `class="story__closing"`.
  - The home page `index.html` contains none of `tervlapja nem került elő`, `aláírt tervlap nem került elő`, `valószínű tervező`, `csak egy későbbi közlésben szerepel` (SC-007).
  - Elements with ids `1899-maj-18-jovahagyjak-markus-geza-epitkezesenek`, `1901-apr-20-a-vii-keruleti-eloljarosag`, `1901-korul-a-megvalosult-haz-tervlapja` and `1960-jan-25-ezen-a-napon-hal` exist.
  - `index.html` contains `href="/epulet/#hasznalatba-vetel"`.
- [X] T030 [P] [US4] In `src/pages/epitok/index.astro`, add `<p class="story__postscript">…</p>` after `<p class="story__closing">`, with the text from [data-model.md § Építők postscript](data-model.md#építők-postscript) and the link written as `<a href="/epulet/">Épület</a>`. Change nothing else in the file.
- [X] T031 [P] [US4] In `src/styles/story.css`, add `.story__postscript` with a `1px solid` top border in `var(--d18-rule)`, `padding-top: 1rem` and `margin-top: 2rem`. Text styles stay the same as body text.
- [X] T032 [US4] In `input/timeline.md`, rewrite the four rows in [data-model.md § Corrected rows](data-model.md#corrected-rows):
  - Row `| 1899 |` becomes `| 1899. máj. 18. |`, at the same position. It is already after 1898 and before 1900.
  - Row `| 1901. ápr. 20. – közölt dátum |` becomes `| 1901. ápr. 20. |`. Keep its `Kép URL` `assets/events/budapest_1903.jpg` and its Cikkötlet.
  - Row `| 1901 körül |`: the description starts "A megvalósult ház tervlapja," so the id is unchanged.
  - Row `| 1960. jan. 25. |`.

  Set the certainty and sources exactly as in the table.
- [X] T033 [US4] In `editorial/events.yaml`:
  - Rename the key `1899-egy-helytorteneti-feldolgozas-szerint` → `1899-maj-18-jovahagyjak-markus-geza-epitkezesenek`, with the title "Márkus Géza 1899-es terve".
  - Rename `1901-apr-20-kozolt-datum-a-heted7-szerint-ezen` → `1901-apr-20-a-vii-keruleti-eloljarosag`, with the title "A ház használhatási engedélye". Keep its `image` block unchanged.
  - Change the title of `1901-korul-a-megvalosult-haz-tervlapja` to "Mellinger Artúr, a ház tervezője".
  - Rename `1960-jan-25-a-haz-valoszinu-tervezojekent` → `1960-jan-25-ezen-a-napon-hal`, keeping its title.

  Run `pnpm build:draft`. If the derived ids differ from these, use the ids the build reports, and update T029 to match.
- [X] T034 [US4] In the unpublished "Nyitott kérdések és vitatott állítások" table at the end of `input/timeline.md`, delete the row "1901. április 20. mint bizonyított átadási nap". Narrow the "1931 utáni automatikus öröklés…" and "1945–1955: államosítás, konkrét tulajdonoscsere…" rows as described in [data-model.md § Open questions](data-model.md#open-questions-unpublished-after-the-fourth-era).
- [X] T035 [US4] Run `pnpm build:draft && pnpm test:site`. Everything passes, and the build lists no missing editorial items.

**Checkpoint**: No page contradicts the Épület findings.

---

## Phase 7: User Story 5 – Follow the building's milestones on the timeline (P3)

**Goal**: Seven new D18 events, in date order, with sources linking to the land register or directory and to the Épület sections.

**Independent Test**: The quickstart, step 3 item 7 (new rows).

- [X] T036 [US5] Add a test to `tests/site/output.test.ts`. On `index.html`, for each date prefix `1899-apr-15-`, `1899-jul-`, `1900-szept-29-`, `1901-jul-2-`, `1942-`, `1948-` and `1956-aug-22-`, a `data-event-id` starting with that prefix exists with `data-category="house"`. Select the `1942-` and `1948-` ids by the description's opening words in data-model.md, because other rows share those years. Each of these events' source links include one `href="/epulet/#…"`, except the 1899 April 15, 1899 July and 1900 events, which also link the land register. Use a regex on `id="…"` blocks or `parseTimeline`.
- [X] T037 [US5] In `input/timeline.md`, insert the seven rows from [data-model.md § New rows](data-model.md#new-rows) at their "Placed after" positions. Lane `D18`, certainty `Igazolt`, `Kép URL` `—`, Cikkötlet `—`. Expand `TK` to the full land-register link given there.
- [X] T038 [US5] Run `pnpm build:draft`. Add each newly reported missing id to `editorial/events.yaml` with the title from the data-model table, placed among the neighbouring dated entries. Re-run until no editorial item is missing.
- [X] T039 [US5] Run `pnpm build:draft && pnpm test:site`. The existing "every event exactly once, in source order", the era-count checks and the T036 test pass.

**Checkpoint**: All five stories are done.

---

## Phase 8: Polish & Cross-Cutting

- [X] T040 [P] Update `README.md`:
  - The intro names four story pages, with `/epulet/` (the building) first, and adds `specs/013-epulet-page/` to the spec list.
  - "Story pages" lists `src/pages/epulet/index.astro` and `input/epulet.md`. It names `src/assets/pages/epulet/` and `src/lib/epulet/figures.ts`, notes the shared `src/lib/images/story-figures.ts` and the `story-band`/`story-figure` classes, and mentions the Építők postscript.
  - "Add or change an event": the Külső forrás column may also hold site links such as `[Épület](/epulet/#erkely)`.
  - Update the header breakpoint text if T027 changed it.
- [X] T041 [P] Mark the spec status as Implemented in `specs/013-epulet-page/spec.md`.
- [X] T042 Run `pnpm test`, `pnpm check`, `pnpm build:draft && pnpm test:site` and `pnpm lighthouse`. `/epulet/`, `/epitok/` and `/lakok/` must meet ≥ 95/95/95 and SEO 100. Then run `pnpm build:release`, which must succeed.
- [X] T043 Walk through [quickstart.md](quickstart.md), steps 3–4, in a browser, including the Menü panel on a 375 px window.

---

## Dependencies & Execution Order

- **Setup (T001–T003)**: no dependencies; all three can run in parallel.
- **Foundational (T004–T016)**:
  - T004 → T005 → T007 → T008 run in that order. T006 can run in parallel.
  - T009–T012 can run in parallel; T013 comes after them.
  - T014 → T015 [P] and T016.
- **US1 (T017–T019)**: needs the foundational phase.
- **US2 (T020–T024)**: needs US1 (the page exists) and T002–T003 (the images).
- **US3 (T025–T028)**: needs US1. It can run alongside US2 except for shared edits to `src/pages/epulet/index.astro`, so do T026 after T023.
- **US4 (T029–T035)**: needs T014/T016 (internal source links) and US1 (the `/epulet/#…` anchors must exist for linkinator). T030 and T031 can run in parallel with T032–T034.
- **US5 (T036–T039)**: needs T014/T016 and US1. Do it after US4 to avoid conflicting edits to `input/timeline.md` and `editorial/events.yaml`.
- **Polish (T040–T043)**: after all stories.

## Parallel Examples

- **Setup**: T001, T002 and T003 together.
- **Foundational**: T006 alongside T004–T005; T009, T010, T011 and T012 together; T015 alongside T016.
- **US2**: T022 (figure data) while T020/T021 (tests) are written.
- **US4**: T030 + T031 (Építők) alongside T032–T034 (timeline).
- **Polish**: T040 and T041 together.

## Implementation Strategy

1. **MVP**: Setup, Foundational and US1 publish a readable Épület page, first in the menu.
2. US2 adds the documents, which carry the argument.
3. US3 adds the look.
4. US4 removes the contradictions on Építők and the timeline. Ship it in the same release as the page, so the site never disagrees with itself in production.
5. US5 enriches the timeline.

Commit after each phase, using Conventional Commits with the author `bartlbalazs@gmail.com`.
