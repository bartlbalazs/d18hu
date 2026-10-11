# Research: Source criticism split from the timeline story

## R1. Where the notes are stored

- **Decision**: Add an optional `sourceCriticism` field to the event's entry in `editorial/events.yaml`. It is a YAML list with one string per paragraph.
- **Rationale**:
  - Each row of `input/timeline.md` is one table row with exactly 7 columns, so a cell can't hold paragraphs; only `<br>` works.
  - `events.yaml` already carries each event's editorial layer (title, image, highlight), keyed by event id.
  - The orphan check already fails the build if a key stops matching an event.
  - A YAML list is easy for a non-developer to read and edit.
- **Alternatives considered**:
  - An 8th column „Forráskritika” in `timeline.md`. Rejected: every table row and the column contract would change, and paragraphs would need `<br>` separators in an already very wide row.
  - A separate file per event. Rejected: it splits one event's editorial data across files.

## R2. Inline formatting in the notes

- **Finding**:
  - Descriptions allow bold, emphasis, inline code, https links and a bare `<br>` (`renderInlineHtml`).
  - Raw HTML is rejected.
  - Site-path links (`/epulet/#…`) are allowed only in the Forrás cell.
- **Decision**:
  - Each paragraph is parsed with the existing remark and GFM pipeline and must form exactly one Markdown paragraph. It is then rendered with `renderInlineHtml`, so the notes allow exactly what descriptions allow, and raw HTML other than `<br>` is a build error.
  - Headings, lists and multiple blocks in one string are rejected; a new paragraph is a new list item.
  - Site paths are additionally allowed in note links, so a note can point to the Épület or Lakók page. Internal links are verified by linkinator.
- **Rationale**: This keeps one inline renderer and one safety rule (FR-002). Some evidence lives on the site's own pages, and pointing there is legitimate.

## R3. Keeping event ids and anchors

- **Finding**: `deriveEventId` builds the id from the date label and the first four letter/digit words of the description. The id is the card's anchor, the editorial key and the statistics key.
- **Decision**:
  - A rewritten description MUST begin with the same four id words as before. The words may be re-punctuated but not replaced, and Markdown emphasis does not count.
  - Date labels are not edited. This includes `1928. okt. 20. – eltérő lapfejléc` (Rintche); its explanation moves into the notes and the label is flagged in the report.
  - The snapshot check fails on any id change.
- **Alternatives considered**: An explicit id override column or field. Rejected: it needs a parser and contract change. The four-word rule already worked for the 014 changes M1, M2 and M5.

## R4. Disclosure element and placement

- **Decision**: Use a native `<details class="event__criticism">` with `<summary>`, placed after the description, the document highlight and the figure, and before `p.event__sources`. It has no `open` attribute and no `name` attribute; `name` would make the disclosures mutually exclusive and break FR-015.
- **Rationale**:
  - The native element gives keyboard (Enter/Space), touch and screen-reader expanded state without JavaScript, which meets Principle I and FR-014.
  - The site already uses it for the Lakók name lists and the music card's „Források”.
  - Placing it before the sources keeps the links outside, visible while it is closed (FR-012). Placing it after the figure keeps captions attached to their image.
- **Accessible name**: The visible label is exactly „Forráskritika és pontosítások”. A visually hidden suffix `– {event title}` (or the date label when the event has no title) gives each control a distinct name in screen-reader element lists. This mirrors the music card's play button. The visible label stays contained in the accessible name (WCAG 2.5.3).
- **Alternatives considered**: A JS button with `aria-expanded`. Rejected: it adds script, and it does nothing without JavaScript.

## R5. Styling

- **Decision**: Reuse the music card toggle's visual language:
  - walnut, 600 weight, about 0.94 rem;
  - a CSS chevron that rotates when open;
  - `min-height: 44px`;
  - a colour transition only under `prefers-reduced-motion: no-preference`.

  The summary spans the card width and is set off from the text above by a thin top rule in the card's existing border colour. It doesn't look like an alert: no warning colours, icon or background fill. The body text is the card's body size in a muted ink with `max-width: 62ch`, and paragraphs are separated by the card's normal paragraph spacing.
- **Rationale**: The brief asks for no new visual language (FR-017), and the music toggle is already accepted on the same page.
- **Open/close animation**: None. Only the chevron rotation is transitioned. This needs no reduced-motion fallback beyond the existing pattern (FR-018).

## R6. Scope slider and scroll position

- **Finding**:
  - The slider hides events with CSS only (`html[data-scope=…] .event…`), so the DOM, and therefore each disclosure's open state, is never rebuilt.
  - `timeline-scope.ts` keeps the reading anchor when the scope changes.
  - Native disclosure toggling never scrolls the page.
- **Decision**: No script change. An open disclosure stays open across slider changes, which meets FR-020 in its preferred form, and toggling never moves the viewport (FR-016).

## R7. Print

- **Finding**:
  - `print-details.ts` opens `details.name-list` and `details.music__sources` before printing and closes them afterwards.
  - `timeline.css` has a print rule using `::details-content` for browsers that support it.
- **Decision**: Add `details.event__criticism:not([open])` to the script's selector. Add the matching `::details-content { display: block; content-visibility: visible; }` print rule, and hide the chevron in print.

## R8. Pre-refactor snapshot and regression check

- **Decision**: Add `scripts/timeline-snapshot.ts` with two modes:

  - `write <file>`: parse `input/timeline.md`, read `editorial/events.yaml`, and write JSON with:
    - per event: id, era, sourceIndex, dateLabel, sourceLane, category, personSubtype, confidence, originalImageUrl, editorial title, the full image block (alt, caption, credit, license, sourceUrl, sourceLabel, kind, depictsHouse), the ordered source list, and the original description Markdown (`raw[2]`);
    - counts per era and per scope (`scopeCounts`).
  - `check <file>`: compare everything except the description and report each difference. It exits non-zero on any difference. Descriptions are excluded because they change on purpose; the old text stays in the snapshot for the reconciliation worksheet.

  The baseline is written once, before any content edit, to `specs/015-source-criticism-disclosure/baseline/timeline-snapshot.json` and committed.
- **Rationale**: The spec requires a regression check (FR-021, FR-023). A permanent unit-test fixture would break on every future legitimate timeline edit. A script with an explicit baseline file checks this refactor and stays reusable for later editorial passes.
- **Alternatives considered**:
  - Comparing built HTML. Rejected: it's noisy, because image hashes and markup change.
  - A vitest snapshot. Rejected for the same maintenance reason as the fixture.

## R9. Page weight

- **Finding** (2026-10-12, `dist/` of 3a8f9b3):
  - `index.html` is 744 KB raw, 114 KB gzip and 78 KB brotli.
  - All CSS and JS together are 26 KB brotli.
  - Firebase serves brotli.
  - The page was already slightly above the constitution's 100 KB initial-view line before this feature.
- **Decision**:
  - Notes reuse the existing text wherever possible, so moved sentences are not duplicated.
  - The markup per card is small: one `details`, one `summary` and the paragraphs.
  - The growth is capped at +3 KB brotli and measured before and after.
  - The existing overage is recorded in the plan's Complexity Tracking and the report as a follow-up, not fixed here.

## R10. Editorial method

- **Decision**:
  1. Write the snapshot first.
  2. Review all 175 events in era order, using the latest repository text, the source links and the image caption.
  3. Record each event in `reconciliation.md` as one of:
     - **unchanged** (with a one-line reason, for longer cards only);
     - **rewritten** (with old text, new visible text, notes, and a claim table mapping each original claim to visible, notes, or redundant-with-where, plus a "no strengthening" check).
  4. Apply the wording rules:
     - "lakó"/"lakott" only where residence is documented; otherwise use "címén szerepel" or "címként adja meg";
     - accusation, police case or first-instance stays visible as such, never as guilt;
     - a plan, filing or proposal is never described as built, granted or approved;
     - "elsewhere" is said visibly when the action happened elsewhere.
  5. Keep image captions as they are, and check each against the new visible text (spec edge case).
  6. Rewrite one event at a time. The only bulk step is the snapshot check.
- **Priority set**: The events named in FR-011 are handled first. Then come the remaining 32 descriptions over 60 words, then every other event in a quick pass.
- **Consistency findings**: Overstated badges, "lakó" for an address-only link and conflicting dates go into a findings list. They are fixed only when the evidence is clear. Every fix is listed in the report as a deliberate exception to the snapshot; a certainty change is a snapshot difference and must be listed.

## R11. Music cards

- **Finding**: Music cards already put sources and the recording note behind „Források”. Their description is a short song note and has no evidence apparatus.
- **Decision**: Check the music cards and expect no change. If one turns out to need a note, add it inside the existing „Források” panel as a paragraph, not as a second disclosure.
