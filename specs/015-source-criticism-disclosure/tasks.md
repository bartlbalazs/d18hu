---

description: "Task list for the source-criticism split on timeline cards"
---

# Tasks: Source criticism split from the timeline story

**Input**: Design documents from `specs/015-source-criticism-disclosure/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Required by FR-023 (snapshot comparison, no disclosure without notes, closed initial state, keyboard operation, several open at once). They use the existing Vitest projects. Keyboard and multi-open are guaranteed by the native element and are covered by markup assertions plus the manual quickstart checks.

**Organization**: Tasks are grouped by user story. US2 (the disclosure) is built before US1 (the rewrite), so no text is moved into notes before the notes can be shown.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

Commands assume Node 22 on PATH: `export PATH=$HOME/.nvm/versions/node/v22.23.2/bin:$PATH`. Run pnpm as `corepack pnpm <script>`. Commit as bartlbalazs@gmail.com, and only when the owner asks.

---

## Phase 1: Setup (baseline before any change)

**Purpose**: Freeze the pre-refactor state (FR-021) and record the page weight (R9).

- [X] T001 Create `scripts/timeline-snapshot.ts`, following the style of `scripts/check-image-urls.ts`: a short header comment, imports from `src/lib/…`, no new dependency. It has two modes:
  - **`write <file>`**:
    - parse `input/timeline.md` with `parseTimeline`;
    - read `editorial/events.yaml` with `yaml` (no zod);
    - write JSON in the shape in `specs/015-source-criticism-disclosure/data-model.md` § TimelineSnapshot:
      - `createdFrom` (the output of `git rev-parse HEAD`);
      - `counts.total`, `counts.byEra`, and `counts.byScope` from `scopeCounts` in `src/lib/timeline/scope.ts`;
      - for each event: id, era, sourceIndex, dateLabel, sourceLane, category, personSubtype, confidence, originalImageUrl, title, the full image block (alt, caption, credit, license, sourceUrl, sourceLabel, kind, depictsHouse), the ordered sources, and `descriptionMarkdown` (`raw[2]`).
  - **`check <file>`**: rebuild the same structure, compare every field except `descriptionMarkdown` and `createdFrom`, and print one line per difference (`<id> <field>: <old> → <new>`, plus id additions and removals and count changes). Finish with `N differences` and exit 1 if N > 0.
- [X] T002 Run `node scripts/timeline-snapshot.ts write specs/015-source-criticism-disclosure/baseline/timeline-snapshot.json` on the clean tree at 3a8f9b3. Confirm it holds 175 events, with era counts 45/64/35/31, and that `check` against itself reports `0 differences`.
- [X] T003 [P] Run `corepack pnpm build:draft` and record the raw, gzip and brotli byte sizes of `dist/index.html` in a "Baseline" section of a new `specs/015-source-criticism-disclosure/report.md`. Measure brotli with `node -e` and `zlib.brotliCompressSync`; the expected value is about 78 KB.

**Checkpoint**: Baseline committed-ready. No content file has changed yet.

---

## Phase 2: Foundational (content model and rendering)

**Purpose**: The `sourceCriticism` field exists, is validated and renders to safe HTML. Both stories depend on it.

- [X] T004 [P] In `src/lib/timeline/inline-html.ts`:
  - Add an options argument to `renderInlineHtml`/`renderNode`: `{ allowSitePaths?: boolean }`. When it is true, a link may be an `https://` URL or a site path (`isSitePath`). Site paths render without `rel="noopener noreferrer"`.
  - Add the exported function `renderInlineMarkdown(text: string, options?)`. It parses `text` with `unified().use(remarkParse).use(remarkGfm)` and requires the root to have **exactly one** child of type `paragraph`; otherwise it throws `InlineRenderError('must be a single paragraph of inline Markdown')`. It returns `renderInlineHtml(paragraph.children, options)`.
  - Raw HTML other than a bare `<br>` keeps throwing.
- [X] T005 [P] In `src/lib/editorial/schema.ts`, add the following to `eventEditorialSchema`, with a one-line comment that each item is one paragraph of inline Markdown, shown in the card's „Forráskritika és pontosítások” disclosure:

  ```ts
  sourceCriticism: z.array(z.string().trim().min(1)).min(1).optional()
  ```

  The data-model rule it implements: "either left out or has **at least 1** item. Each item is trimmed, non-empty and **one** paragraph of inline Markdown".
- [X] T006 In `src/lib/editorial/assemble.ts` (depends on T004 and T005):
  - Add `sourceCriticismHtml?: string[]` to `TimelineEvent`.
  - When `entry.sourceCriticism` is set, map each item through `renderInlineMarkdown(item, { allowSitePaths: true })`.
  - Wrap each failure in an error that names the event id and the 1-based item index, e.g. `editorial/events.yaml 1929-…: sourceCriticism[2]: must be a single paragraph…`.
- [X] T007 [P] Add `renderInlineMarkdown` cases to `tests/unit/dates-ids-inline.test.ts`:
  - it renders bold, emphasis, an https link with `rel`, a site-path link without `rel` (only with `allowSitePaths`), and `<br>`;
  - it rejects two paragraphs (a blank line), a list item, a heading, a `<span>`, and an `http://` link;
  - a site path is rejected without the option.
- [X] T008 [P] Add cases to `tests/unit/editorial.test.ts`:
  - the schema accepts an absent field and a list of 1 or more non-empty strings;
  - it rejects `[]`, `['']` and `['  ']`;
  - `assembleEvents` sets `sourceCriticismHtml` only for events that have the field;
  - a malformed item fails with the event id and the item index in the message.
- [X] T009 Run `corepack pnpm test` and `corepack pnpm check`; all must pass.

**Checkpoint**: The field is ready. Nothing is rendered yet, and the site output is unchanged.

---

## Phase 3: User Story 2 - Open the research detail on demand (Priority: P1)

**Goal**: A card with notes shows a closed, accessible „Forráskritika és pontosítások” disclosure. Cards without notes are unchanged.

**Independent Test**: With notes on the pilot card only:
- the disclosure starts closed;
- it toggles by mouse, Enter, Space and touch;
- a second card can be open at the same time;
- no scroll jump;
- the source links are visible while it is closed;
- it works with JavaScript off;
- it prints open.

### Tests for User Story 2

- [X] T010 [US2] Add a `describe('source-criticism disclosure')` block to `tests/site/output.test.ts`. It reads `editorial/events.yaml` via `yaml` and the event `<li>` blocks from `dist/index.html`. It asserts the invariants in `specs/015-source-criticism-disclosure/contracts/card-disclosure.md`:
  - the number of `details class="event__criticism"` equals the number of events with `sourceCriticism`;
  - each such event's `<li>` holds exactly one;
  - events without notes hold none;
  - no `event__criticism` details has an `open` or `name` attribute;
  - the summary's visible text (with the `visually-hidden` span removed) is exactly `Forráskritika és pontosítások`;
  - the paragraph count inside equals the YAML item count;
  - in each card, `<p class="event__sources">` comes after the closing `</details>` and is not inside it.

### Implementation for User Story 2

- [X] T011 [US2] In `src/components/TimelineEvent.astro`, after the `EvidenceFigure` block and before the `event.sources` block, render the following when `event.sourceCriticismHtml` is set:

  ```astro
  <details class="event__criticism">
    <summary class="event__criticism-toggle">Forráskritika és pontosítások<span class="visually-hidden"> – {event.title ?? event.dateLabel}</span></summary>
    <div class="event__criticism-body">{paragraphs as <p set:html>}</div>
  </details>
  ```

  Add no `open` or `name` attribute and no script. Add a one-line frontmatter comment pointing to `contracts/card-disclosure.md`.
- [X] T012 [P] [US2] In `src/styles/timeline.css`, next to the `.music__sources-toggle` rules, add the following per contracts/card-disclosure.md § Styling, reusing the existing tokens:
  - **`.event__criticism`**: a top margin matching `.event__text` spacing, and a 1px top border in the card's existing border colour.
  - **`.event__criticism-toggle`**:
    - `display: flex`, `align-items: center`, `gap: 0.5rem`, `min-height: 44px`, full width;
    - `list-style: none`, walnut colour, `font-size: 0.9375rem`, `font-weight: 600`, `cursor: pointer`;
    - no `::-webkit-details-marker`;
    - a CSS chevron on `::after`, rotated when `[open]`, exactly like `.music__sources-toggle::after`;
    - ink colour on hover, and the site's focus-visible ring.
  - **`.event__criticism-body`**: card body size, `color: var(--d18-muted)` (or the card's muted ink), `max-width: 62ch`, and paragraph spacing as `.event__text`. Links inherit the site link style.
  - **Reduced motion**: add `.event__criticism-toggle` and its `::after` to the existing `@media (prefers-reduced-motion: no-preference)` transition list. Don't animate height.
  - **Colours**: no warning or error colours, and no background fill.
- [X] T013 [P] [US2] Add `, details.event__criticism:not([open])` to the selector in `src/scripts/print-details.ts`, and update its first comment line to list the new disclosure. In the `@media print` block of `src/styles/timeline.css`, add:
  - `.event__criticism::details-content { display: block; content-visibility: visible; }`;
  - `.event__criticism-toggle::after { display: none !important; }`.
- [X] T014 [US2] As a pilot, add `sourceCriticism` to `1929-apr-29-uhereczky-ferenc-budapesti-muszereszmester` in `editorial/events.yaml`, and shorten its description in `input/timeline.md`.
  - **Opening words:** keep the first four id words „Uhereczky Ferenc budapesti műszerészmester”.
  - **Content:** follow spec Example A, checked against the current row text.
  - **Reconciliation:** start `specs/015-source-criticism-disclosure/reconciliation.md` with the format header from data-model.md § Reconciliation record, and add this event's full entry (before, after, notes, claim table, no-strengthening check).
- [X] T015 [US2] Run:
  - `corepack pnpm test`;
  - `corepack pnpm build:draft && corepack pnpm test:site` (T010 must pass; html-validate and linkinator clean);
  - `node scripts/timeline-snapshot.ts check specs/015-source-criticism-disclosure/baseline/timeline-snapshot.json`, which must report `0 differences`.

  Then do quickstart §5 steps 2–6 by hand on the pilot card, plus one more card temporarily opened alongside it. Note the results in `specs/015-source-criticism-disclosure/report.md`.

**Checkpoint**: The disclosure works end to end on one card. This is the MVP slice.

---

## Phase 4: User Story 1 - Read a card's story without wading through the evidence (Priority: P1)

**Goal**: Every event is reviewed. Evidence-heavy cards get a short, self-standing visible text plus notes, and the clear cards stay untouched (FR-004 to FR-011).

**Independent Test**: Read every changed card closed. Each must be true alone and no stronger than the evidence, keep the visible limits from the brief's table, and be shorter than before. `reconciliation.md` shows no lost or strengthened claim.

**Rules for every task in this phase** (from research R3 and R10, and contracts/source-criticism-field.md):
- Work from the current repository text, the row's sources and the image caption.
- **Keep fixed:**
  - the description's first four id words;
  - the date label, lane, certainty, sources, image and caption.
- **Visible text:**
  - usually 2–4 sentences, about 40–90 words;
  - it keeps any limit needed to avoid a misreading (address only, inferred identity, elsewhere, plan/filing, accusation or non-final judgment, uncertain date);
  - use "lakó" only where residence is documented.
- **Notes:**
  - 1–3 paragraphs that don't repeat the visible caution word for word;
  - never park story content there.
- **Short and clear cards:** leave them unchanged with no notes, and add a one-line `unchanged` entry only for cards over 60 words.
- **Reconciliation:** add a full entry to `reconciliation.md` for each rewritten card.
- **Findings:** log each inconsistency (badge, "lakó" wording, date) under Findings, marked fixed or flagged. Fix only clear cases.
- **Process:** one event at a time, with no bulk text rewriting.

### FR-011 named events (do first)

- [X] T016 [US1] Rewrite the Uhereczky thread in `input/timeline.md` and `editorial/events.yaml`, and add reconciliation entries in `specs/015-source-criticism-disclosure/reconciliation.md`:
  - **`1924-egy-kozjegyzoi-alairashitelesitesi-ugyben`** (Mechanikai vállalkozó és cipészmester): residence and Uhereczky's identity are not proven. The notes cover the lakhely/telephely field, the two men's relation, the basis for identifying him with the athlete, and why III/5 can't be carried over to Uhereczky.
  - **`1924-jul-26-a-parizsi-olimpia-tandemversenyeben`**: the D18 link is likely, not proven. The notes cover the evidence for and gaps in identifying him with the 1924 contractor.
  - **`1929-autotorteneti-feldolgozasok-szerint-uhereczky`**: it is not proven that the D18 person built the car, or that it was built in the house. The notes cover the name variants in later accounts, the missing primary fair report, and the identity chain.
  - **`1930-1949-a-magyar-orszagos-tudosito`** (Az Uhereczky-garázs): the garage was **not** at D18, and the D18 link is only likely. The notes cover the permit proposal versus the building actually built, Grimm's name, and the Uhereczky identification.
  - **`1928-dec-1929-febr-az-automobil-motorsport-1928`** (Diamant-motorok): review it with the same identity rule.
- [X] T017 [US1] Rewrite the Wágner, Földes and Róthmüller cards, and add reconciliation entries:
  - **`1937-okt-12-31-wagner-ferenc-maganhivatalnok-1937`**: the III/3 address is proven for **1937** only. Follow spec Example B. The notes take the earlier convictions **as stated in the current repository text** (the 1908–1909 Pécs sentences and the 1924 Budapest sikkasztás conviction, not the brief's "1922"), the calculated release date versus an actual release, and the 1940 register giving only "Budapest". *Implementation note: the 1937 card itself dates the joint sikkasztás case 1922, matching the brief; only the 1933 previous-record column says 1924. Both cards' notes record the discrepancy.*
  - **`1931-okt-1-3-foldes-szerena-wagner-ferencnek`**: the visible text must not imply she lived at III/3.
  - **`1908-1909-wagner-ferenc-a-haz`**: review it. The visible text already says the acts did not happen in the flat; leave it unchanged if it is already clear.
  - **`1932-1938-az-1932-szeptember-21`** (Az I/8 későbbi lakója a vásárokon): the identity between the earlier press cases and the later I/8 resident is not fully proven, and the 1937 judgment must not be called final. The notes cover the press identification, the non-final 1937 judgment, and keeping Róna Jenő and Róna Miksa apart.
  - **`1940-maj-29-1944-a-magyar-orszagos-tudosito`** (Két kereskedő az I/8-ból): review it with the same rules.
- [X] T018 [US1] Rewrite the court and police cards, and add reconciliation entries:
  - **`1919-kiss-janos-a-dembinszky`** and **`1919-nagy-gyorgy-a-nagyszoloson`**: the catalogue entry and the charge prove neither the act, a final judgment nor membership. The notes cover the limits of the catalogue's "izgatás" heading, the missing outcome, and that there is no evidence linking the two men.
  - **`1930-szept-1-a-magyar-orszagos-tudosito`** (Tüntetés a Hernád utcai saroknál): the notes cover the viewpoint of the official statement.
  - **`1947-dec-1948-jan-a-magyar-orszagos-tudosito`** (Egy autófuvarozó csempészpere): visibly keep the case type, the fogház sentence, the separate currency-case acquittal, and that nothing links the haulier to the Olympian or the 1924 resident. The detail goes in the notes.
  - **`1932-nov-1934-marc-az-altalanos-kozvetito-bank`** (Bankper és halálhír): the court stages go in the notes.
- [X] T019 [US1] Rewrite the address and advertisement cards, and add reconciliation entries:
  - **`1928-okt-20-eltero-lapfejlec-az-uj-budapest-beszerzesi`** (Rintche): the date label is **not** edited (R3). The notes explain the volume index versus the printed header. Log the label in Findings as flagged.
  - **`1920-1929-takats-eberhard-arpad-es`** (Autós vállalkozók a házban): business address, not workshop or residence, unless the row documents more.
  - **`1923-ket-1923-as-fovarosi`** (Kálix Ödön).
  - **`1923-fennmaradtak-a-strandfurdo-reszvenytarsasag`**.
  - **`1925-osz-a-magyar-penzugy-a`** (Strandfürdő Rt.).
- [X] T020 [US1] Rewrite the remaining named cards, and add reconciliation entries:
  - **`1939-az-egyetemi-program-1939`** (Három fiatal kutató): the research did not take place at D18, and the move-in date is unknown. The notes cover institutional dates, the diploma serial number versus the date, and proposal or acceptance versus the actual appointment.
  - **`1931-aug-6-szept-3-ozv-schwartz-ignacne-egy`** (Levél egy rabbiözvegynek).
  - **`1937-okt-nov-markus-jozsef-agrarkutato-aki`** and **`1938-okt-1940-maj-18-markus-jozsef-1938-oktobereben`** (Márkus József).

### All other events, in era order

- [X] T021 [US1] Review every remaining event of era 1873–1913 (45 events) in `input/timeline.md` and `editorial/events.yaml`. Include at least `1904-jul-1-jul-10-a-julius-10-i` (95 words). Add rewritten or unchanged entries to `specs/015-source-criticism-disclosure/reconciliation.md` per the phase rules.
- [X] T022 [US1] Review every remaining event of era 1914–1938 (64 events, minus those done in T016–T020) in `input/timeline.md` and `editorial/events.yaml`. Include at least:
  - `1933-1938-kozjegyzoi-katalogusok-szerint-a` (102 words);
  - `1926-1927-1926-ban-300-millio` (90);
  - `1928-febr-28-reggel-hetkor-elindul-a` (73).

  Add reconciliation entries.
- [X] T023 [US1] Review every remaining event of era 1939–1945 (35 events) in `input/timeline.md` and `editorial/events.yaml`. Include at least:
  - `1942-1950-a-novum-szamolo-es` (97 words);
  - `1944-jun-jul-a-vii-keruletben-bejelentett` (77);
  - `1941-jul-9-a-debreczen-julius-10` (64).

  Add reconciliation entries.
- [X] T024 [US1] Review every remaining event of era 1946–1968 (31 events) in `input/timeline.md` and `editorial/events.yaml`. Include at least `1954-a-vii-keruleti-1954` (100 words). Add reconciliation entries.
- [X] T025 [US1] Review the music cards in `editorial/music.yaml` per research R11. If no card has a separable source-criticism passage, change nothing and record "music cards: unchanged" in `specs/015-source-criticism-disclosure/report.md`.
- [X] T026 [US1] Check every caption: for each rewritten event with an image, read its caption in `editorial/events.yaml` next to the new visible text. Captions are not edited. If one now reads wrongly, adjust the visible text instead, and record the check in `reconciliation.md`.
- [X] T027 [US1] Run `corepack pnpm test`, `node scripts/timeline-snapshot.ts check specs/015-source-criticism-disclosure/baseline/timeline-snapshot.json` and `corepack pnpm build:draft`. Fix any id change by restoring the four opening words. Any remaining snapshot difference must be a deliberate correction listed in `report.md`.

**Checkpoint**: The content is complete. Every changed card reads correctly closed, and every original claim is accounted for.

---

## Phase 5: User Story 3 - Nothing else about the timeline changes (Priority: P2)

**Goal**: Show that counts, ids, metadata, other pages and slider behaviour are unchanged (FR-022, SC-001, SC-002).

**Independent Test**: The snapshot check and the site tests pass, and manual quickstart §5 steps 4 and 8 pass.

- [X] T028 [US3] Run `corepack pnpm build:draft && corepack pnpm test:site`. Confirm that the existing assertions (every event once in source order, category counts, confidence count, source links) and the T010 block pass, and that html-validate and linkinator are clean.
- [X] T029 [US3] Run `git diff --stat 3a8f9b3 -- src/pages/ src/lib/epulet src/lib/lakok editorial/site.yaml` and confirm that no other page or site text changed (FR-022). The only expected source changes are the files listed in plan.md § Source Code.
- [X] T030 [US3] Do quickstart §5 steps 1–8 by hand on a draft build (`corepack pnpm preview`). Use 320, 768 and 1280 px, keyboard, the slider with an open card, JavaScript disabled, print preview, and the lightbox on a rewritten card with an image. Record the results in `specs/015-source-criticism-disclosure/report.md`.

---

## Phase 6: Polish and cross-cutting

- [X] T031 [P] Update `README.md`:
  - under "Editing the content", add a short "Add source criticism to an event" subsection: the `sourceCriticism` list in `editorial/events.yaml`, one paragraph per item, inline Markdown only, keep the description's first four words, and the label shown on the card;
  - under "Commands", add the `node scripts/timeline-snapshot.ts write|check <file>` usage;
  - add `specs/015-source-criticism-disclosure/` to the spec list.
- [X] T032 [P] Add one bullet to `specs/001-d18-history-timeline/contracts/editorial-metadata.md` § `editorial/events.yaml` describing the optional `sourceCriticism` field and linking to `specs/015-source-criticism-disclosure/contracts/source-criticism-field.md`.
- [X] T033 Run `corepack pnpm build:release && corepack pnpm lighthouse`. All thresholds must pass. Measure the brotli `dist/index.html` again. Growth over the T003 figure must be ≤ 3 KB; if it is more, tighten note wording without losing claims and re-measure.
- [X] T034 Finish `specs/015-source-criticism-disclosure/report.md` with the five FR-024 items:
  1. The files changed and the content model.
  2. The counts: cards with notes, cards untouched, descriptions rewritten, and how many are within 2–4 sentences or 90 words (SC-003 ≥ 80%), with the exceptions and reasons.
  3. 3–5 before/after examples, including the 1929 gearbox and 1937 Wágner III/3.
  4. The inconsistencies found, fixed or flagged, including the Rintche date label and the pre-existing page-weight overage.
  5. The tests run, their results and anything unchecked.

  Add the before and after page weight.
- [X] T035 Mark all tasks `[X]` in this file, and list anything left unchecked in report.md.

---

## Dependencies and Execution Order

- **Setup (T001–T003)**: must finish before any content edit. The baseline must be taken on the unmodified tree.
- **Foundational (T004–T009)**: depends on Setup. T004, T005, T007 and T008 can run in parallel; T006 needs T004 and T005.
- **US2 (T010–T015)**: depends on Foundational. T012 and T013 can run in parallel with T011.
- **US1 (T016–T027)**: depends on US2, so moved text is always visible behind the disclosure. Its tasks are sequential because they share `input/timeline.md`, `editorial/events.yaml` and `reconciliation.md`.
- **US3 (T028–T030)**: depends on US1.
- **Polish (T031–T035)**: T031 and T032 can run in parallel any time after T006. T033–T035 come last.

## Parallel examples

```text
Foundational:  T004 (inline-html.ts) ‖ T005 (schema.ts) ‖ T007 (inline tests) ‖ T008 (editorial tests)
US2:           T012 (timeline.css) ‖ T013 (print-details.ts + print CSS), alongside T011 (TimelineEvent.astro)
Polish:        T031 (README.md) ‖ T032 (editorial-metadata contract)
```

## Implementation Strategy

1. **MVP**: Phases 1–3. The baseline is taken, the field and disclosure work, and the 1929 gearbox pilot card is converted and verified. This is shippable on its own.
2. **Increment 1**: T016–T020, the FR-011 named cards, where misreadings are most likely. Run the T027 checks after each task.
3. **Increment 2**: T021–T026, the remaining events era by era.
4. **Close**: Phase 5 verification, then Phase 6 docs, Lighthouse and the report. Nothing is committed until the owner asks.
