# Research: Lakók page

## R1. How the page is produced

- **Decision**: A hand-written `src/pages/lakok/index.astro`. Its text is transcribed once from `input/lakok.md`, including the 209 table rows. Nothing reads the Markdown at build time.
- **Rationale**: This follows FR-007 and the approach set for Építők and Névadó (see `specs/002-epitok-nevado-pages/research.md` R1).
- **Alternatives considered**: Generating the table rows from the Markdown, or from a YAML or JSON file, at build time. Rejected because the owner ruled out generating story pages, and the tables are fixed archival transcriptions that won't change often. Rows go straight into the markup, with no data array, so the page stays readable as one document.

## R2. Era bands

- **Decision**: The article is a stack of full-width `<section class="lakok-band lakok-band--N">` elements, each holding a `.container.story` column. The bands set `background: var(--era-N)` from `tokens.css`.

  | Section | Band | Background | Text and links |
  |---|---|---|---|
  | Kicker, `h1`, lead, method paragraph | none | `--d18-paper` | as on the other story pages |
  | A kezdetek … 1902–1904 | 1 | `--era-1` | ink, walnut links, muted → `--era-muted` |
  | 1922: vasút, sajtó és autóvállalkozás | 2 | `--era-2` | same as band 1 |
  | 1944–1945: csillagos ház | 3 | `--era-3` | `--era-3-ink`, links and muted text `--era-3-muted` |
  | 1954: gépek és munkanormák | 4 | `--era-4` | same as band 1 |
  | Egy cím, változó megélhetések; sources; correction note | none | `--d18-paper` | as on the other story pages |

- **Contrast** (WCAG AA, computed): ink is at least 10.2:1 on every light band, walnut links at least 6.1:1, and `--era-muted` at least 6.0:1. `--d18-muted` drops to 4.33:1 on era 4, so it is replaced by `--era-muted` on the light bands. On the dark band, ink is 9.7:1 and links are 7.1:1.
- **Details**: Inside a band, the `h2`'s top rule is dropped, because the band edge already separates the sections. The bands get generous vertical padding. Source markers, `:target` highlights and focus outlines get per-band colours, so they stay visible on the dark band.
- **Rationale**: The bands share the timeline's colour language (spec User Story 3), and full-width bands read as chapters on a phone. A column-only background would look like a boxed card.
- **Alternatives considered**: The full-bleed `border-image` trick on the column. Rejected because it is harder to read and maintain than plain nested sections.

## R3. Collapsible name lists

- **Decision**: Use a native `<details class="name-list">` with no `open` attribute.
  - The `<summary>` holds the label and the entry count:
    - "A két korai évfolyam névsorának megnyitása (67 bejegyzés)"
    - "Az 1922–1923-as évfolyam névsorának megnyitása (35 bejegyzés)"
    - "A teljes 1954-es választói névsor megnyitása (107 bejegyzés)", taken from the draft
  - Inside the block come the reading note that belongs to the table, then a scroll frame `<section class="name-list__frame" aria-label="…" tabindex="0">` (a labelled section is a native region) holding a `<table>` with `<caption>` and `<th scope="col">`, then any notes that follow the table. The "—" legend moves inside the early list. For 1954, the birth-name note, the corrections and the possible occupations sit inside the block, as in the draft.
  - The `h3` above each block stays as the visible section heading.
- **Keyboard and screen readers**: `summary` is natively focusable, toggles with Enter and Space, and is announced as an expandable control with its state. The table frame is focusable, so keyboard users can scroll it (this satisfies axe's `scrollable-region-focusable` rule).
- **Find in page**: Chromium-based browsers open a closed `<details>` when find-in-page matches text inside it. Other browsers rely on the label naming the list. No script is needed.
- **Print**: A `<details>` element cannot be opened with CSS in every browser. `src/scripts/print-details.ts` opens every closed `details` on `beforeprint` and closes the same ones on `afterprint`. It is about 300 bytes and loaded only by this page. Without JavaScript the lists print closed, which is acceptable progressive enhancement.
- **Motion**: Opening and closing are not animated, so reduced motion is honoured by default.
- **Summary look**: The summary uses Source Sans 600 with a custom chevron. The native marker is hidden and a rotated border chevron, `[open]`-aware, takes its place. The summary has at least 44 px of height, a ruled frame like `.ledger`, a hover colour and a visible focus ring.
- **Alternatives considered**: A JavaScript accordion with `aria-expanded`. Rejected because it duplicates the native behaviour and fails without JavaScript (Constitution I).

## R4. Tables

- **Decision**: Rows keep the draft's order and cell text exactly.
  - In the 1954 table, a birth name given after `<br>` in the draft renders as a second line, `<span class="name-list__birth">`, inside the same name cell.
  - Rows get zebra striping using `--house-row`, and numbers use `font-variant-numeric: lining-nums`.
  - The two-column tables fit at 320 px. The three-column early table gets `min-width: 30rem` inside its scroll frame, so the columns never squash below readable width.
  - Cells wrap with `overflow-wrap: anywhere` for long compound words.
- **Rationale**: This covers FR-005 and SC-005: the page never scrolls sideways, and only the frame does.

## R5. Source markers and list

- **Decision**: Follow the Névadó pattern. Each source in the list is `<li id="forras-N">`, for N from 1 to 27, and each marker is wrapped in `<sup>`.
  - A single number becomes `[<a href="#forras-N">N</a>]`.
  - A list such as `[2, 17]` gets one link per number inside one pair of brackets.
  - A range such as `[1–4]` links both end numbers, `[<a>1</a>–<a>4</a>]`, so sources cited only as a range end, such as 20 in [19–20], are still linked. The spec's FR-003 was updated to match.
  - Inline links in the text stay where they are, such as the two in the 1944–1945 section and the Építők link, which points to `/epitok/`. Source 13's absolute `https://www.dembinszky18.hu/epitok/` becomes the relative `/epitok/`, so the link checker can follow it.
  - The "Névsori megjegyzések" paragraph stays at the top of the sources section, as in the draft.
- **Tracking parameters**: the draft has none, and the site test still asserts that no link contains `utm_`.

## R6. Correction and removal note (FR-009a)

- **Decision**: A short closing paragraph, `<p class="lakok-note">`, after the source list. For example: "Ha Ön vagy családtagja szerepel a névsorokban, és javítást vagy törlést kér, írjon a [contact] címre." The address is `site.impresszum.contactEmail` from `editorial/site.yaml`, rendered as a `mailto:` link. It is not hard-coded, so the README and the page never repeat it by hand.
- **Rationale**: The address stays in one place, the same way the impresszum page reads it.

## R7. Four page links in the header

- **Decision**: From 900 px up, the header shows four era links and now four page links in one row. Estimated widths put that row at about 1000 px, so it may overflow between 900 px and about 1020 px. During implementation, measure the built header at 900, 960 and 1024 px. If it overflows, move the inline-menu media query in `base.css` to the smallest width where the row fits, rounded up to the next 20 px. Below that width, the existing popover menu is used.
- **Rationale**: Constitution III requires no horizontal scrolling. Moving the breakpoint is a one-line change, and it doesn't shorten the labels the spec fixes.
- **Alternatives considered**: Narrowing `.site-nav` gaps. Rejected unless the overflow is only a few pixels, because tighter gaps make the touch targets harder to hit.

## R8. Metadata

- **Decision**:
  - The title is "Lakók – Dembinszky utca 18." (27 characters).
  - The description is written from the lead and runs 50–160 characters.
  - `og:type` is `article`.
  - The JSON-LD holds `WebSite`, `BreadcrumbList` (Dembinszky utca 18. › Lakók) and `Article`.
  - `articleNode()` takes `imageUrl?` and omits `image` when it is absent. The shared `og:image` façade crop still serves social cards.
- **Rationale**: Schema.org `Article` doesn't require an image, and the page has none in this iteration (FR-007a). Inventing an `ImageObject` would contradict FR-007a.

## R9. Content completeness check (SC-002)

- **Decision**: As in feature 002, a one-off quickstart check compares the draft's `##` and `###` headings and its link URLs with the built HTML, and counts table rows (67, 35 and 107). It is not a permanent test, because the page is meant to drift from the draft as it is edited by hand. The permanent site test does assert the row counts and the 27 sources, because those are structural.
