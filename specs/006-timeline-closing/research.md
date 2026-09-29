# Research: Closing section after the timeline

## R1. Ending the timeline axis at the last event (FR-001, SC-001)

- **Today**: the vertical axis is one `::before` on each `ol.timeline`, with `top: 0; bottom: 0`. So in the last era it runs through the whole last row, down to the bottom of the list, below the last marker.
- **Decision**: In the final era's list only, stop the axis at the centre of the last event's marker.
  - `index.astro` adds `timeline--ends` to the last era's `<ol>`.
  - In that list, the axis moves from the list to each row: `.timeline--ends .event::before` draws the row's segment.
  - The last row's segment ends at its marker's centre: `height: calc(padding-top + var(--axis-col) / 2)` instead of `bottom: 0`.
  - The other eras are unchanged, because an era opener follows each of them.
- **Rationale**:
  - Row segments are exact whatever the row's height, even with images or document highlights.
  - It needs no masking over the tinted house or neighbourhood rows, whose semi-transparent backgrounds would show a mask.
  - It is pure CSS, and the markup stays the same.
- **Alternatives considered**:
  - Covering the axis below the last marker with a paper-coloured patch. Rejected: it would show on tinted rows.
  - Measuring heights in JavaScript. Rejected by principle I, and unnecessary.

## R2. The short line (FR-002, FR-003, SC-002, SC-003)

- **Decision**: Draw the line as a `::before` of the closing section, not as an `<hr>`:
  - `display: block`, 1 px tall, `width: 4.5rem` (72 px)
  - `margin: 0 auto`, in `--d18-sand`, the site's warm muted accent
- **Why a pseudo-element**: `<hr>` is announced as a "separator" by several screen readers, and the spec says the line is decorative (FR-003). A pseudo-element is never announced.
- **Width**: a fixed 72 px is 25% of the content column at 320 px (288 px) and 10% at 768 px, so it is within SC-003 at every width. On a wide screen a percentage would make the line long.
- **Colour**: `--d18-rule`, the axis colour, is too faint for a single short line on paper. `--d18-sand` is already used for the notice border and accents, so it stays within the palette.
- **Spacing**: consecutive events are about 2.2 rem apart (1.1 rem padding on each side). The section gets `margin-top: 5rem`, and the era section already adds 1 rem below the list. So the pause is about 6 rem, more than twice the gap between events (SC-002). The line sits 2 rem above the heading.

## R3. Heading level and placement (FR-007, FR-009)

- **Decision**: One `<section class="container timeline-closing" aria-labelledby="tortenet-folytatodik">` on the home page, with an `<h2 id="tortenet-folytatodik">`.
  - It is placed after the eras loop in `src/pages/index.astro`, inside `<main>` and before the footer.
- **Rationale**:
  - The home page's structure is `h1` (hero), then `h2` for the legend and each era opener, then `h3`/`h4` inside. The closing block is a sibling of the eras, so `h2` keeps the order logical.
  - A labelled section makes it a landmark-like region that screen readers can jump to.
- **Menu highlight (spec 004)**: `currentEraIndex` picks the last era opener above the reading line. The closing block isn't an opener, so the highlight stays on 1946–1968, and no code changes.
- **Statistics (spec 005)**: „írjon” is a same-origin link, so `statisticsEventFor` returns `null`, and no code changes.

## R4. Where the text lives (FR-004, FR-005)

- **Decision**: Put the heading and paragraphs verbatim in a new component, `src/components/TimelineClosing.astro`. The one link is written in the markup: `<a href="/impresszum/">írjon</a>.`
- **Rationale**:
  - The text is fixed and needs an inline link. The editorial YAML files hold plain strings, so an inline link would need a markup convention and a Markdown renderer for 3 sentences.
  - The Impresszum and 404 texts already live in Astro templates the same way.
  - The file is plain, version-controlled text, and anyone can edit the Hungarian in it (constitution technical constraints: "SHOULD live in plain, version-controlled files").
- **Alternatives considered**: a `timelineClosing` entry in `editorial/site.yaml` with `[írjon](/impresszum/)` rendered by remark. Rejected: more moving parts, and the owner edits this text rarely.

## R5. Typography and width (FR-006, FR-008)

- **Decision**:
  - `.timeline-closing` has `text-align: center`.
  - The heading and paragraphs sit in `max-width: 36rem; margin-inline: auto`, narrower than the event text (`46rem`).
  - It has no background, border or icon.
  - The heading uses the existing display font, one size down from the era headings: `clamp(1.8rem, 5vw, 2.4rem)`. Text is the normal body size, `--d18-ink` on paper, which is AA contrast.
- **Rationale**: centred text is hard to read in long lines, so the column is narrower. The existing tokens keep it inside the site's look without new colours.
- **Budget**: about 0.4 KB of CSS inlined and about 0.4 KB of HTML on the home page. No JavaScript, images or fonts.
