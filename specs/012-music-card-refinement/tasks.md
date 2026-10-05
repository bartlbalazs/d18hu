---

description: "Task list for the music card refinement"
---

# Tasks: Music card refinement

**Input**: Design documents from `/specs/012-music-card-refinement/`

**Prerequisites**: plan.md, spec.md, research.md (R1–R16), data-model.md, contracts/site-pages.md, quickstart.md

**Tests**: The plan asks for unit tests of the recording line, the phrase map, the media schema and the audit, and for site tests of the built markup (contracts/site-pages.md). Visual checks follow quickstart.md in headless Chromium.

**Run tools with Node 22 through Corepack**: `pnpm` is `corepack pnpm`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**:
  - US1: the card reads as a timeline event
  - US2: the recording line
  - US3: the sources fold away
  - US4: the archive image
  - US5: a quieter button and a matching player

---

## Phase 1: Setup

- [X] T001 Create the folder `src/assets/music/` and move in the image files the owner supplies, renamed to match `^[a-z0-9][a-z0-9._-]*\.(jpe?g|png|webp)$`. If no files have arrived yet, create the folder with an empty `.gitkeep` and continue. US4's content task (T026) waits for the files.

---

## Phase 2: Foundational

There are no shared blocking prerequisites. Each story touches `MusicEntry.astro` and `timeline.css` in its own block, so the stories run in order, not in parallel.

---

## Phase 3: User Story 1 — The card reads as a timeline event (P1) 🎯 MVP

**Goal**:
- the year sits in the date column
- the node is the shared size
- the surface is paper-alt with fine rules
- the type follows the event style
- the kicker has no year

**Independent test**: quickstart scenarios 1–3 at 1280, 1100, 768 and 360 px.

- [X] T002 [US1] Update the site test in `tests/site/output.test.ts` (the `music layer` describe block):
  - Each card starts with `<p class="event__date"><time datetime="<year>"><year></time></p>`, followed by `span.event__node` and `article.event__body.music`.
  - The `.music__kicker` contains „Mit hallgatott Budapest?” and no digits.
  - Replace the order check's `'Mit hallgatott Budapest? ·'` with `'class="music__kicker'`.
  - Run it and confirm it fails.
- [X] T003 [US1] In `src/components/MusicEntry.astro`:
  - Add `<p class="event__date"><time datetime={String(entry.year)}>{entry.year}</time></p>` as the first child of the `li`.
  - Change the kicker to `<p class="music__kicker kicker"><span class="music__kicker-icon" set:html={icons.music} />Mit hallgatott Budapest?</p>`, with no year.
  - Wrap everything inside the article in `<div class="music__layout">`. A container can't query its own size, so the article is the size container and this wrapper carries any layout that depends on the article's width (US3, US4).
  - Update the component comment to say the year sits in the date column like every event.
- [X] T004 [US1] Rewrite the card part of the music block in `src/styles/timeline.css` (research R1, R2):
  - Remove the `.event--music .event__node` size, margin and `grid-row` overrides, and the `.music { grid-row: 1 }` and `@media (min-width: 760px)` music column rules. Keep the node colours: `border-color: var(--d18-sand); background: var(--d18-paper); color: var(--d18-walnut)`.
  - Card: `.music { container: music / inline-size; max-width: 46rem; padding: 1.1rem 1.25rem; background: var(--d18-paper-alt); border-block: 1px solid var(--d18-rule); }` with no side border, no radius and no `font-size`.
  - Kicker: `.music__kicker { display: flex; align-items: center; gap: 0.45rem; }`, and the icon in `--d18-walnut` at 0.95em.
  - Title: `.music__title` takes the `.event__title` declarations, `margin-top: 0.3rem; font-size: clamp(1.45rem, 4vw, 1.75rem); font-weight: 500`.
  - Credit: `.music__credit { margin-top: 0.15rem; font-weight: 600; color: var(--d18-walnut); }`.
  - Note: `.music__text { margin-top: 0.6rem; max-width: 62ch; color: #3f3934; }`.
  - Highlight: keep the 011 outline and the `music-highlight` keyframe as they are.
  - Use only tokens from `src/styles/tokens.css`, or `#3f3934`, which is already used in this file.
- [X] T005 [US1] Run `pnpm build:draft && pnpm test:site` and make the T002 checks pass. Then run quickstart scenarios 1–3 with puppeteer at the four widths: compare `getBoundingClientRect().left` and the computed font of each music `.event__date` with its neighbour event's date (within 2 px), and take screenshots into the scratchpad.

**Checkpoint**: the cards sit on the timeline like events. The sources and recording note still show the 011 layout.

---

## Phase 4: User Story 2 — A short, human recording line (P1)

**Goal**: „Felvétel: <artist>, <year>” plus a short second line. No codes.

**Independent test**: quickstart scenario 4. The unit tests match the R4 table.

- [X] T006 [P] [US2] Add unit tests in `tests/unit/music.test.ts`:
  - `recordingLines` returns exactly the eight rows of the research R4 table, built from the matching `editorial/music.yaml` fields. Load the file the way the site test does, or build items inline.
  - `recording_year` wins over the song year.
  - A non-`periodYear` relation without `recording_year` has no year.
  - `recording_label` without a catalogue number gives just the label.
  - `buildMusicEntries` throws `/has no Hungarian phrase/` for `recording_relation: 'unknown_relation'`, naming the anchor.
  - `recording` is `undefined` when the item has no `youtube_url`.
- [X] T007 [US2] In `src/lib/timeline/music.ts`:
  - Export `RECORDING_RELATIONS: Record<string, { phrase: string; periodYear: boolean }>` with the six rows of research R3, verbatim:
    - `period_recording` → „korabeli felvétel”, true
    - `period_recording_reissue` → „korabeli felvétel újrakiadása”, true
    - `author_period_recording` → „gramofonfelvétel a szerző előadásában”, true
    - `archival_film_recording` → „archív filmfelvétel”, false
    - `later_recording` → „későbbi felvétel”, false
    - `hungaroton_reissue` → „Hungaroton-újrakiadás”, false
  - Export `recordingLines(item: MusicEditorialItem): { primary: string; secondary?: string }` per data-model.md:
    - `primary` = `Felvétel: <artist>[, <year>]`
    - `secondary` = the non-empty parts of [`<label> <catalog>`, `<phrase>[, <release year>]`] joined by ` · `
  - In `buildMusicEntries`, push the problem `<anchor>: recording_relation "<value>" has no Hungarian phrase in RECORDING_RELATIONS` when the relation is missing from the table.
  - Add `recording?: { primary: string; secondary?: string }` to `MusicEntry`, set only when `youtubeId` is non-empty.
- [X] T008 [US2] In `src/components/MusicEntry.astro`:
  - Replace the `p.music__recording` that showed `recordingNote` with `{entry.recording && <p class="music__recording">{entry.recording.primary}{entry.recording.secondary && <span class="music__recording-detail">{entry.recording.secondary}</span>}</p>}`.
  - Place it after `p.music__text`.
  - Do not render `recordingNote` in the card body; US3 moves it into the panel.
- [X] T009 [US2] In `src/styles/timeline.css`:
  - `.music__recording { margin-top: 0.6rem; color: var(--d18-muted); font-size: 0.875rem; line-height: 1.45; }`
  - `.music__recording-detail { display: block; }`
- [X] T010 [US2] In `tests/site/output.test.ts`:
  - Replace the recording-note assertion: the `p.music__recording` text equals `recording.primary + recording.secondary`, with `&#39;` unescaped.
  - No card body contains any `RECORDING_RELATIONS` key.
  - The `recordingNote` text does not appear outside `details.music__sources`. Until US3 lands, assert it does not appear at all.
  - Run `pnpm test`, then `pnpm build:draft && pnpm test:site`.

**Checkpoint**: the recording lines match R4. The long note is gone from the card body.

---

## Phase 5: User Story 3 — Sources fold away (P1)

**Goal**: „Források · N ˅” as a native disclosure, holding the links, the recording note and the image credit. It works without JS and prints open.

**Independent test**: quickstart scenarios 5 and 11.

- [X] T011 [US3] In `src/components/MusicEntry.astro`:
  - Remove the open `p.event__sources` from the body.
  - After `p.music__actions`, render `details.music__sources`, only when the entry has sources, a recording note or media:
    - `<summary class="music__sources-toggle">Források{entry.sources.length > 0 && ` · ${entry.sources.length}`}</summary>`
    - then the existing `p.event__sources` markup, unchanged (the visually hidden „Forrás:” and the links with `icons.externalLink`)
    - then `{entry.recordingNote && <p class="music__recording-note">{entry.recordingNote}</p>}`
    - and a slot for the `p.music__media-credit` that US4 fills
  - Inside `div.music__layout`, wrap `p.music__actions` and `details` in `div.music__footer`, so the summary sits on the button's row on wide cards.
- [X] T012 [US3] In `src/styles/timeline.css`, following `.name-list` in `story.css`:
  - `.music__footer { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 0.25rem 1.25rem; margin-top: 0.75rem; }`
  - `.music__actions { margin: 0; }`
  - `.music__sources { flex: 1 1 100%; }`
  - From 30rem of card width, `.music__sources { flex: 0 1 auto; }`, through `@container music (min-width: 30rem)`. The container comes from T004.
  - `.music__sources[open] { flex-basis: 100%; }`
  - The summary: `display: inline-flex; align-items: center; gap: 0.45rem; min-height: 44px; list-style: none; cursor: pointer; color: var(--d18-walnut); font-size: 0.9375rem; font-weight: 600`, with the `::-webkit-details-marker` hidden.
  - A `::after` chevron, 0.45rem with 1.5px borders, rotated 45deg (down) and -135deg when `[open]` (up).
  - `:hover` color `var(--d18-ink)`, and a `:focus-visible` outline matching the site's focus style.
  - `.music__recording-note { margin-top: 0.5rem; color: var(--d18-muted); font-size: 0.875rem; max-width: 62ch; }`
  - Transitions (color 120ms, rotate 120ms) only under `@media (prefers-reduced-motion: no-preference)`.
  - In the existing `@media print` block: `.music__sources::details-content { content-visibility: visible; display: block; }` and `.music__sources-toggle::after { display: none; }`.
- [X] T013 [US3] In `src/scripts/print-details.ts` (the existing helper for the Lakók name lists; loaded on the home page from `src/pages/index.astro`). Done there rather than in `src/scripts/music-player.ts`:
  - On `beforeprint`, collect every `details.music__sources:not([open])`, set `open` on each, and keep the list.
  - On `afterprint`, remove `open` from the same elements (research R6).
  - Keep it to a few lines; the code should explain itself without a comment.
- [X] T014 [US3] In `tests/site/output.test.ts`:
  - Each card with sources has exactly one `<details class="music__sources">`, without `open`.
  - Its summary text is `Források · <sources.length>`.
  - It contains every source URL, and the `recordingNote` when it is non-empty.
  - No source URL appears outside the details.
  - Tighten the T010 assertion: the note appears only inside the details.
  - Remove `event__sources` from the regex that strips parts before the structure comparison, and add `music__footer`, so that comparison still holds.
  - Run `pnpm build:draft && pnpm test:site`, which includes html-validate and linkinator.
- [X] T015 [US3] Run quickstart scenario 5 with puppeteer:
  - click, then Enter and Space on a focused summary, checking `open`
  - with `page.setJavaScriptEnabled(false)`
  - scenario 11 through `page.emulateMediaType('print')`, checking that the links are visible

**Checkpoint**: the P1 stories are complete. Cards are shorter, and the sources work with and without JS.

---

## Phase 6: User Story 4 — An archive image that belongs to the page (P2)

**Goal**: an optional `media` image on the right of wide cards and as a 16:7 band on narrow ones. It has one shared treatment and a fade, is lazy and responsive, needs credit and licence for release, and is described in JSON-LD.

**Independent test**: quickstart scenarios 12–19 on the cards with images, and scenario 6 on a card without.

- [X] T016 [P] [US4] Add schema tests in `tests/unit/music.test.ts`:
  - Remove the 011 test that rejects `image_url`, `image_alt`, `thumbnail` and `cover`, but keep rejecting those four keys at the item level, since the item stays strict.
  - `musicMediaSchema` accepts the data-model.md example.
  - It rejects:
    - `src` values `music/a.jpg`, `A.jpg` and `a.gif`
    - `position` values `50%` and `center`
    - `source_url: 'http://x.hu'`
    - an unknown key
  - `buildMusicEntries` maps `media` to `MusicEntry.media` with `file`, trimmed strings, `decorative: false` and `position: '50% 50%'` by default.
- [X] T017 [P] [US4] Add audit tests in `tests/unit/editorial.test.ts` for a music entry with media:
  - an empty `credit` gives `media.credit` „image credit missing”
  - an empty `license` gives `media.license` „image license missing”
  - an empty `alt` gives „image alt missing”
  - `alt: 'Kép'` gives „image alt is generic”
  - `decorative: true` with an empty alt gives no alt item
- [X] T018 [US4] In `src/lib/editorial/schema.ts`:
  - Add `musicMediaSchema = z.strictObject({...})` with these fields:
    - `src: z.string().regex(/^[a-z0-9][a-z0-9._-]*\.(jpe?g|png|webp)$/)`
    - `alt: z.string().default('')`
    - `decorative: z.boolean().default(false)`
    - `caption: z.string().default('')`
    - `credit: z.string().default('')`
    - `license: z.string().default('')`
    - `source_title: z.string().optional()`
    - `source_url: httpsUrl.optional()`
    - `position: z.string().regex(/^\d{1,3}% \d{1,3}%$/).optional()`
  - Add `media: musicMediaSchema.optional()` to `musicEditorialItemSchema`.
  - Update its doc comment: one optional archive image is allowed, and any other image field is rejected.
- [X] T019 [US4] In `src/lib/timeline/music.ts`:
  - Add the type `MusicMedia = { file: string; alt: string; decorative: boolean; caption: string; credit: string; license: string; sourceTitle?: string; sourceUrl?: string; position: string }`.
  - Add `media?: MusicMedia` to `MusicEntry`, mapped from `item.media` in `buildMusicEntries`, with trimmed strings and `position` defaulting to `'50% 50%'`.
- [X] T020 [US4] In `src/lib/editorial/audit.ts`, for each `entry.media` (data-model.md "Audit"):
  - Add `{ scope: 'music', id: entry.anchor, field: 'media.credit', message: 'image credit missing' }` and the same for `license`, using `isMissingValue`.
  - Unless `decorative`: add `media.alt` „image alt missing” when it is missing, or „image alt is generic” when the trimmed lowercase alt is one of `kép`, `fotó`, `image`, `music image` or `portré`.
- [X] T021 [P] [US4] Create `src/lib/images/music-images.ts`, mirroring `archive-images.ts`:
  - `import.meta.glob<{ default: ImageMetadata }>('/src/assets/music/*.{jpg,jpeg,png,webp}', { eager: true })`
  - `musicImageMetadata(file)` returns the module default, or throws `music image <file> is named in editorial/music.yaml but not in src/assets/music/`.
- [X] T022 [US4] In `src/components/MusicEntry.astro` (research R9, R10, R12):
  - Add `music--with-media` to the article's class when `entry.media` is set.
  - After `p.music__credit`, render `div.music__media` with `style={`--music-image-position: ${entry.media.position}`}`, holding `<Picture src={musicImageMetadata(entry.media.file)} alt={entry.media.decorative ? '' : entry.media.alt} formats={['avif', 'webp']} fallbackFormat="jpg" widths={[480, 800, 1200]} sizes="(min-width: 1000px) 420px, 92vw" loading="lazy" decoding="async" />`.
  - Do not wrap it in a link, and add no figcaption.
  - In the details, after the recording note, render `p.music__media-credit`:
    - `caption`, when set
    - then `credit · license`
    - then, when `sourceUrl` is set, `<a href={sourceUrl} rel="noopener noreferrer">{sourceTitle ?? 'Képforrás'}<Fragment set:html={icons.externalLink} /></a>`
    - parts joined by ` · `
  - Treat the media as one more reason to render the details.
- [X] T023 [US4] Add the image styles to `src/styles/timeline.css` (research R8–R10):
  - **Stacked (default)**:
    - `.music__media { position: relative; margin: 0.9rem -1.25rem 0; aspect-ratio: 16 / 7; overflow: hidden; }`
    - `.music__media img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: var(--music-image-position, 50% 50%); filter: grayscale(0.7) sepia(0.12) contrast(0.92) brightness(1.03); opacity: 0.84; }`
    - the `to top` mask, with `-webkit-mask-image` and `mask-image`: `linear-gradient(to top, transparent 0%, rgb(0 0 0 / 0.25) 12%, rgb(0 0 0 / 0.75) 32%, #000 48%)`
    - `.music__media::after { content: ''; position: absolute; inset: 0; background: rgb(238 230 217 / 0.12); pointer-events: none; }`
  - **Split, `@container music (min-width: 38rem)`**: the article is the container, and the grid goes on its wrapper from T003.
    - the image reaches the card's right edge: on the wrapper, `margin-right: -1.25rem` (the article's own padding can't change inside its own query)
    - `.music--with-media > .music__layout { display: grid; grid-template-columns: minmax(0, 64fr) minmax(0, 36fr); grid-template-rows: repeat(7, auto) 1fr; column-gap: 1.5rem; }`
    - `.music__layout > * { grid-column: 1; }`
    - `.music__layout > .music__media { grid-column: 2; grid-row: 1 / -1; margin: -1.1rem 0; aspect-ratio: auto; min-height: 18rem; }`
    - `.music__media img { position: absolute; inset: 0; }`
    - the `to right` mask: `linear-gradient(to right, transparent 0%, rgb(0 0 0 / 0.25) 12%, rgb(0 0 0 / 0.75) 32%, #000 48%)`
  - `.music__media[hidden] { display: none; }`
  - `.music__media-credit` in the same style as `.music__recording-note`.
  - Print: `.music__media { break-inside: avoid; }`.
- [X] T024 [US4] In `src/scripts/music-player.ts`, outside the player guard, add a capture-phase `error` listener on `document` (research R11):
  - When `event.target` is an `HTMLImageElement` inside `.music__media`, set `hidden` on that box and remove `music--with-media` from the closest `.music`.
- [X] T025 [US4] Add an optional `license?: string` to the `imageNode` input in `src/lib/seo/jsonld.ts`, emitted as `license` when set. In `src/pages/index.astro`, add one `imageNode` per `music` entry with media:
  - `contentUrl` from `fullSizeImage(musicImageMetadata(file)).src`
  - `caption` (or `alt` when empty), `credit`, `license`, `sourceUrl`
  - `path: /#<anchor>`
  - Take `music` from `loadSiteData()`.
- [X] T026 [US4] Content (done with the owner's eight images; see the quickstart results): for each image the owner has supplied, add a `media` block to the matching item in `editorial/music.yaml` with the owner's `src`, `alt`, `caption`, `credit`, `license`, `source_title`, `source_url` and `position`. Leave every other field of the owner's metadata verbatim. Skip this task, and say so, if no files have arrived yet.
- [X] T027 [US4] In `tests/site/output.test.ts`:
  - For every card whose entry has `media`:
    - `music--with-media` is on the article
    - one `div.music__media` holds a `<picture>` with AVIF and WebP `<source srcset>`, and an `img` with `loading="lazy"`, `decoding="async"`, numeric `width` and `height`, and the expected `alt`
    - there is no `<a>` around it
    - the `--music-image-position` is set
    - the credit and licence appear inside the details
    - the JSON-LD has an `ImageObject` whose `url` ends with `/#<anchor>`
  - For every card without media: no `<img>`, `<picture>` or `srcset`.
  - Update the structure comparison per the contract: cards with and without media differ only by the class, the media box and the credit paragraph.
- [X] T028 [US4] Run `pnpm test`, `pnpm build:draft && pnpm test:site` and `pnpm build:release`. Then run quickstart scenarios 6 and 12–19 with puppeteer at 1280, 900 and 360 px:
  - take screenshots
  - check Network for lazy loading
  - block the image URL for scenario 18
  - for 17 and 19, make the temporary YAML edits and then revert them

**Checkpoint**: the images render with the shared treatment. A release build fails without credit or licence.

---

## Phase 7: User Story 5 — A quieter button and a matching player (P2)

**Goal**: an outline „▷ Meghallgatom”, and a player with the card's year, title and credit hierarchy.

**Independent test**: quickstart scenarios 7–9.

- [X] T029 [US5] In `src/components/MusicEntry.astro`:
  - Change the button's symbol span text from `▶` to `▷`.
  - Add `data-music-credit={entry.credit}` to the button.
- [X] T030 [US5] In `src/scripts/music-player.ts`:
  - In `cardLabel()`, replace both `'▶'` with `'▷'`.
  - Read `button.dataset.musicCredit` into the current song.
  - Fill a new `creditField` (`[data-music-player-credit]`) next to `titleField`.
  - Set `artistField` to `Felvétel: ${current.artist}`.
  - Change no state, timer or iframe logic.
- [X] T031 [US5] In `src/components/MusicPlayer.astro`, add `<p class="music-player__credit" data-music-player-credit></p>` between `.music-player__title` and `.music-player__artist`.
- [X] T032 [US5] In `src/styles/timeline.css` (research R13–R15):
  - **Button**:
    - `.music__play { border-color: var(--d18-rule); padding: 0 0.9rem; }`
    - `:is(:hover, :focus-visible)` gives `background: var(--d18-paper); border-color: var(--d18-sand)`
    - `[data-state="playing"]` and `[data-state="paused"]` give `background: var(--d18-paper-deep); border-color: var(--d18-walnut); color: var(--d18-walnut)`, no longer the filled walnut
    - a 120ms background-color and border-color transition under `@media (prefers-reduced-motion: no-preference)`
    - keep `min-width: 15ch`
  - **Player**:
    - `.music-player__year`: `font-family: var(--font-display); font-weight: 500; font-variant-numeric: lining-nums; font-size: 1.3rem`, and `1.5rem` from 760px, replacing the 1.75–2rem values
    - `.music-player__title`: Cormorant 500, `clamp(1.25rem, 3vw, 1.45rem)`, still clamped to two lines
    - `.music-player__credit`: `font-weight: 600; color: var(--d18-walnut); font-size: 0.9375rem`
    - `.music-player__artist`: `color: var(--d18-muted); font-size: 0.875rem`
    - the player background and borders in paper-alt and rule tokens, if they are not already
- [X] T033 [US5] In `tests/site/output.test.ts`:
  - Expect `<span class="music__play-symbol" aria-hidden="true">▷</span>` and `data-music-credit="<credit>"`.
  - The player shell contains `data-music-player-credit` between the title and the artist.
  - Run `pnpm build:draft && pnpm test:site`.
- [X] T034 [US5] Run quickstart scenarios 7–9 with puppeteer and the scratchpad scripts from 011 (`player-check.mjs`, `all-probe.mjs`, `rest.mjs`, `fail.mjs`):
  - all 011 playback scenarios still pass
  - the card reads „▷ Folytatás” when paused
  - the player shows the credit and „Felvétel: …”

**Checkpoint**: every story is complete.

---

## Phase 8: Polish & cross-cutting

- [X] T035 [P] In `README.md`, update "Add or change a song":
  - The `media` block, its fields and rules, from data-model.md, and that files go in `src/assets/music/`.
  - That release builds need `alt`, `credit` and `license`.
  - The `recording_relation` values and their Hungarian phrases, and that a new relation needs a row in `RECORDING_RELATIONS` in `src/lib/timeline/music.ts`.
  - That the long `recording_note` now shows in the „Források” panel.
  - Update the layout and design notes for the card (year in the date column, image treatment) and the project layout list (`src/assets/music/`, `src/lib/images/music-images.ts`).
- [X] T036 [P] In `specs/011-timeline-music-layer/spec.md`, add one line under FR-004, FR-027 and FR-003 saying they are superseded by specs/012-music-card-refinement for the image and the year. Change nothing else.
- [X] T037 Run quickstart scenario 10 (reduced motion) and confirm the page has no new console errors. Run `pnpm check` (astro check) and fix type errors.
- [X] T038 Run `pnpm build:release` and `pnpm lighthouse`. Confirm SC-007 (performance ≥ 95, the other three scores 100, CLS ≤ 0.05), and measure the gzipped size of the `music-player` chunk in `dist/_astro/` against 011's 2.3 KB, expecting under +0.3 KB. Record the results in a "Results" section at the end of `specs/012-music-card-refinement/quickstart.md`, including anything not tested (iOS Safari, live statistics).

---

## Dependencies & execution order

- **Setup (T001)**: first. T026 waits for the owner's files; every other task does not.
- **US1 → US2 → US3 → US4 → US5**, in sequence: all of them edit `MusicEntry.astro`, `timeline.css` and `output.test.ts`. US2 does not depend on US1's markup, but sharing files makes parallel work unsafe.
- **US3 before US4**: T022 puts the image credit into US3's details. T023 relies on the container and wrapper from T003 and T004.
- **US5** is independent of US4 and may run before it, if the images are late.
- **Polish** after the stories it documents.

### Parallel opportunities

- T006 (unit tests) alongside T002–T005.
- T016, T017 and T021 together, since they are different files, before T018–T020.
- T035 and T036 together.

## Implementation strategy

1. **MVP (US1)**: the year in the date column, the new surface and the type. On its own, it fixes the main structural complaint.
2. **US2 and US3**: complete the P1 hierarchy (recording line, folded sources). Shippable as text-only cards.
3. **US5**, then **US4** when the images arrive. Or US4 first, if the files are already there.
4. **Polish**: README, the 011 cross-reference, Lighthouse and the results.
