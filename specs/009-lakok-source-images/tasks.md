---

description: "Task list for the Lakók source images"
---

# Tasks: Lakók source images

**Input**: Design documents from `/specs/009-lakok-source-images/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/site-pages.md, quickstart.md

**Tests**: The plan and the contract make `tests/site/output.test.ts` enforce placement, credits and loading (FR-010), so site test tasks are included.

**Source package**: `/home/bartlbalazs/Downloads/lakok-kepanyag/`. Image files are in `kepek/`, and the published fields are in `kepjegyzek.json`. Copy only `caption`, `alt`, `credit` and `source_url` from it. Never copy `rights_category`, `priority`, `display_note` or `placement`, and never mention rights or licences in code, comments or docs (spec Clarifications, FR-002).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 = portrait images (places 1–8), US2 = 1944 and 1954 images (places 9–12), US3 = speed, layout and accessibility

---

## Phase 1: Setup

- [X] T001 Copy these 14 files from `/home/bartlbalazs/Downloads/lakok-kepanyag/kepek/` into the new folder `src/assets/pages/lakok/`, keeping their names: `04-mautner-perfector-1899.png`, `07-petrovits-1902.png`, `08-petrovits-1922.png`, `09-takacs-auto-1922.png`, `12-csillagos-hazak-1944.png`, `13-gepeszek-1954.jpg`, `14-mozigepesz-1954.jpg`, `15-idoelemzes-1949.png`, `16-almasi-iza-portre-1900.png`, `17-iza-cake-walk-1903.png`, `18-armandola-hangverseny-1902.png`, `19-szello-cikkkezdet-1900.png`, `20-szello-cikkvege-1900.png`, `21-graselly-lajosmizse-1911.png`. Don't copy the spares 01, 02, 03, 05, 06, 10, 11, or `attekinto.jpg`, `kepjegyzek.json` or the guide.

---

## Phase 2: Foundational (data, component, shared styles)

- [X] T002 Create `src/lib/lakok/figures.ts` (research R1–R3, data-model.md):
  - Import the 14 images from `../../assets/pages/lakok/`.
  - Export `type LakokFigure = { image: ImageMetadata; alt: string; caption: string; credit: string; source: { label: 'eredeti forrás'; url: string }; kind: 'photo' | 'document'; size: 'narrow' | 'medium' | 'wide' | 'column'; label?: string }`. The type has no field for rights, priority or notes.
  - Export `lakokFigures`, a record with the 14 keys from data-model.md (`armandolaConcert` … `timeStudyGrading`). Give each its kind and size from the data-model table. Copy `alt`, `caption` and `credit` word for word from `kepjegyzek.json`. Set `source: { label: 'eredeti forrás', url: <source_url> }`.
  - Set `label: 'Cikkkezdet, 377. oldal'` on `szelloStart` and `label: 'Zárórész, 379. oldal'` on `szelloEnd`; no other record gets a label.
  - Export `figureProps(figure: LakokFigure)`. It returns `{ image, alt, caption, credit, source, kind, label, widths, sizes, class }`, where:
    - W = narrow 400, medium 480, wide 620, column 704
    - N = `image.width`
    - `widths` = the sorted distinct values of `[Math.min(N, 360), Math.min(N, W), Math.min(N, 2 * W)]`
    - `sizes` = `` `(min-width: ${W + 80}px) ${W}px, 100vw` ``
    - `class` = `lakok-figure--${size}` for every size except `column`, which gets `undefined`
- [X] T003 [P] In `src/components/EvidenceFigure.astro`, add an optional `label?: string` prop. When it is set, render `<span class="evidence__label">{label}</span>` as the first child of `<figcaption>`, before the caption text. Nothing changes for figures without a label.
- [X] T004 [P] In `src/styles/timeline.css`, next to `.evidence__credit`, add `.evidence__label { display: block; font-weight: 600; color: inherit; }`. Use `inherit` rather than `--d18-ink`, so the label stays readable on the dark era 3 band too.
- [X] T005 [P] In `src/styles/story.css`, after the Lakók band rules, add:
  - Width classes: `.story .lakok-figure--narrow { max-width: 25rem; }`, `.story .lakok-figure--medium { max-width: 30rem; }`, `.story .lakok-figure--wide { max-width: 38.75rem; }`.
  - Spacing for in-text figures: `.lakok-band .evidence { margin-block: 1.75rem; }`.
  - The pair: `.lakok-figure-pair { display: grid; gap: 1.375rem; margin-block: 1.75rem; }` and `.lakok-figure-pair .evidence { margin-block: 0; }`.

**Checkpoint**: `pnpm check` passes, and the page is unchanged because nothing uses the data yet.

---

## Phase 3: User Story 1 – The portraits show their sources (P1) 🎯 MVP

**Goal**: Places 1–8 of spec FR-001 show their images, captions, credits and source links, and open in the viewer.

**Independent Test**: In the 1902–1904 and 1922 bands of `/lakok/`, each of the 10 images is at its place, captioned and credited, and enlarges when tapped.

- [X] T006 [US1] In `tests/site/output.test.ts`, inside `describe('Lakók page', …)`, add a helper `const at = (stem: string) => html.indexOf(`data-stat-image="${stem}"`)`. Also add a helper that returns the index of an `<h3>` by its text (or of an `h2` by id). Then add the test "places the portrait images after their paragraphs". For each row of places 1–8 in `contracts/site-pages.md`, it asserts `at(stem) > 0`, after-heading < `at(stem)` < before-heading. It also asserts:
  - `at('16-almasi-iza-portre-1900') < at('17-iza-cake-walk-1903')`, with a `<p` between them
  - 19 before 20 and 07 before 08
  - each of those two pairs is inside one `<div class="lakok-figure-pair">` holding exactly 2 `<figure`
  - the page contains `Cikkkezdet, 377. oldal` and `Zárórész, 379. oldal` inside `class="evidence__label"`
- [X] T007 [US1] In `src/pages/lakok/index.astro`, import `{ lakokFigures, figureProps }` from `../../lib/lakok/figures.ts`. Then insert `<EvidenceFigure {...figureProps(lakokFigures.<key>)} />` at these places, changing no text:
  - `armandolaConcert`: after the 2nd `<p>` under "Armandola Aranka: zongoralecke és hangverseny"
  - `almasiPortrait`: after the 1st `<p>` under "Almássy Iza: Mici hercegnő és a cake-walk"
  - `almasiCakeWalk`: after the 2nd `<p>` under "Almássy Iza: Mici hercegnő és a cake-walk"
  - `mautnerPerfector`: after the 2nd `<p>` under "Mautner Adolf: fény és géperő egyetlen készülékből"
  - `<div class="lakok-figure-pair">` containing `szelloStart` then `szelloEnd`: after the 2nd `<p>` under "Szellő Sándor: mit ér a szépen elmondott vers?", before the Spitz János Ferencz paragraph
  - `grasellySociety`: after the 2nd `<p>` under "Graselly Miklós: az iskola és a gazdasági egyesület"
  - `<div class="lakok-figure-pair">` containing `petrovits1902` then `petrovits1922`: after the 1st `<p>` under "Petrovits Róbert: húsz év távolságából", before the "1922-ben Markovits Ágoston…" paragraph
  - `takacsCarFirm`: after the 2nd `<p>` under "Takács Eberhard Árpád: autóvállalat, telefonkapcsolattal"
- [X] T008 [US1] Run `pnpm build:draft`, then `pnpm vitest run --project site`. The T006 test passes.

**Checkpoint**: The MVP is done. The early eras carry their sources.

---

## Phase 4: User Story 2 – Document and work photos in the later eras (P2)

**Goal**: Places 9–12 show their images. The 1944 list page is whole and readable on the dark band.

**Independent Test**: The 1944 section has exactly one figure, and its caption can be read on the dark band. The two 1954 photos and the job grading sit at their places, and the photo captions say they don't show the residents.

- [X] T009 [US2] In `tests/site/output.test.ts`, add the test "places the 1944 and 1954 images", covering places 9–12 in `contracts/site-pages.md`. Use the same after-heading/before-heading checks as T006, plus:
  - the substring of `section[aria-labelledby="csillagos-haz"]` contains exactly 1 `<figure`
  - `at('13-gepeszek-1954')` < the index of `<h3>Az 1954-es választói névjegyzék házbeli listája</h3>`
- [X] T010 [US2] In `src/pages/lakok/index.astro`, insert, changing no text:
  - `yellowStarList`: after the only `<p>` in the `csillagos-haz` section
  - `machinists1954`: after the 1st `<p>` following `<h2 id="gepek-1954">`, before the "Az 1954-es választói névjegyzék házbeli listája" `h3`
  - `projectionist1954`: after the `<p>` under "Kovács Jánosné, Ballák Magda: a vetítés mögött"
  - `timeStudyGrading`: after the 2nd `<p>` under "Horváth János: a munka idejének mérője"
- [X] T011 [P] [US2] In `src/styles/story.css`, add `--d18-muted: var(--era-3-ink);` to the `.lakok-band--3` rule, so captions and credits can be read on the dark band (research R6).

**Checkpoint**: All 14 images are on the page.

---

## Phase 5: User Story 3 – Fast, readable on phones, accessible (P1)

**Goal**: No extra weight before scrolling, no layout shift, no sideways scroll, alt text everywhere, and printing that fits the page.

**Independent Test**: `pnpm lighthouse` keeps `/lakok/` at 100 on all four categories and under 512 000 B. The page has no sideways scroll at 320 px.

- [X] T012 [US3] In `tests/site/output.test.ts`, replace the Lakók test's `count(html, /<figure class="evidence/g)).toBe(1)` with `.toBe(15)`, and keep the façade-before-first-band check. Then add the test "loads, describes and credits every source image", which asserts:
  - exactly 1 `loading="eager"` in the page's `<img` tags; every other `<img` has `loading="lazy"`, `width=` and `height=`
  - each `<figure class="evidence` block has a non-empty `alt="…"`, a `class="evidence__credit"`, and an `<a href="https://` inside the credit
  - `eredeti forrás` appears 14 times
  - none of the 7 spare stems from `contracts/site-pages.md` occurs in `html`
  - `jsonLdTypes(html).filter((type) => type === 'ImageObject')` has length 1
- [X] T013 [P] [US3] In `src/styles/story.css`, inside the existing `@media print` block, add `.lakok .evidence { break-inside: avoid; }`, `.lakok .evidence img { max-height: 12cm; width: auto; }` and `.lakok .evidence__zoom { display: none; }` (research R7).
- [X] T014 [US3] Run `pnpm build:release`, `pnpm test:site` and `pnpm lighthouse`. If `total-byte-weight` or performance fails on `/lakok/`, apply research R4's fallback: remove the `Math.min(N, 2 * W)` entry for `narrow` figures in `figureProps()` in `src/lib/lakok/figures.ts`, then re-run.

---

## Phase 6: Polish

- [X] T015 [P] In `README.md`, "Story pages" section: replace "The Névadó portrait is committed in `src/assets/pages/`." with a sentence saying that the Névadó portrait and the Lakók source images (`src/assets/pages/lakok/`) are committed in `src/assets/pages/`, and that the Lakók images' captions, alt texts, credits and source links are in `src/lib/lakok/figures.ts`. In "Project layout", add `src/lib/lakok/figures.ts` with a one-line description. Don't mention rights or licences.
- [X] T016 Walk through the manual checks in `specs/009-lakok-source-images/quickstart.md` (`pnpm preview`, 320, 768 and 1280 px, the viewer on a 375 px phone, the dark band, print preview), and fix anything that fails.
- [X] T017 Run `pnpm check`, `pnpm test`, `pnpm build:release` and `pnpm test:site` one last time. Then set the spec's **Status** to `Implemented` in `specs/009-lakok-source-images/spec.md`.

---

## Dependencies

- T001 → T002 (the imports need the files)
- T002, T003, T004, T005 → US1, US2 and US3
- US1 (T006–T008) and US2 (T009–T011) each depend only on Phase 2. Both edit `src/pages/lakok/index.astro` and the test file, so run them one after the other.
- US3 (T012–T014) comes after US1 and US2, because it counts all 15 figures and audits the finished page.
- Polish comes last.

## Parallel examples

- Phase 2: T003 (component), T004 (`timeline.css`) and T005 (`story.css`) run together once T002 is started. T003–T005 don't depend on T002.
- US2: T011 (`story.css`) runs alongside T009 and T010.
- US3: T013 (print CSS) runs alongside T012.
- Polish: T015 runs alongside T016.

## Implementation strategy

1. **MVP**: Phase 1, Phase 2 and US1. The early eras get their 10 images; check with T008.
2. Add US2, giving all 14 images.
3. Run US3's audits and print rule, then publish only after T014 passes.
4. Finish with Polish (README and manual checks).
