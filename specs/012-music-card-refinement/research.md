# Research: Music card refinement

Clarification 1 resolved the spec's only open question: the owner supplies the image files. Each decision below has its rationale and the alternatives considered.

## R1. The year in the date column

- **Decision**: `MusicEntry.astro` renders `<p class="event__date"><time datetime="1901">1901</time></p>` first in the `li`, exactly as `TimelineEvent.astro` does. The music-only overrides are removed: the node's `grid-row: 1`, its 30 px size and 4 px margin, and the body's `grid-row: 1`. The shared rules then place the date in column 1 on desktop and in row 1 above the body on mobile. The node keeps its music colours: walnut icon on paper, sand border.
- **Rationale**: Sharing the class and grid rules is the only way to guarantee "same typeface, size and position within 2 px" (SC-001) without duplicating values. FR-002 asks for the shared node size, so the 011 shrink goes.
- **Alternatives**: a music-only year element styled to match. Rejected: it would drift from the event dates.

## R2. Card surface and type

- **Decision**:
  - `.music`: `background: var(--d18-paper-alt)`, `border-block: 1px solid var(--d18-rule)`, no side borders, no radius, padding about `1.1rem 1.25rem`, `max-width: 46rem` (the `.event__body` width, up from 34 rem).
  - Kicker: the existing `.kicker` style plus a small `♫` (the shared `icons.music` SVG, `aria-hidden`) and no year.
  - Title: `.music__title` takes the `.event__title` declarations (Cormorant 500, `clamp(1.45rem, 4vw, 1.75rem)`).
  - Credit: Source Sans 600 at 1rem, `--d18-walnut`.
  - Note: the body size, 1.0625rem, in `#3f3934` (already used for national and world event text), with the inherited line height of 1.6 and `max-width: 62ch`. The card drops 011's smaller 0.9375rem base size, so the note matches the event text.
- **Rationale**: Every value is an existing token or an existing declaration (FR-004, FR-005, SC-002). The request's suggested hexes map onto the tokens:
  - bg-soft → paper-alt
  - rule → `--d18-rule`
  - accent → walnut
  - muted → `--d18-muted`
  
  The 46 rem width is what lets the 38 rem split happen on desktop.
- **Alternatives**:
  - New `--music-*` tokens. Rejected: the spec forbids new colours, and aliases add nothing.
  - A borderless card. Rejected: on the paper-alt surface, the rules echo the event rows' top border.

## R3. Recording phrases

- **Decision**: `RECORDING_RELATIONS` in `music.ts` maps each relation in use to a phrase and a `periodYear` flag:

  | relation | phrase | periodYear |
  |---|---|---|
  | `period_recording` | korabeli felvétel | yes |
  | `period_recording_reissue` | korabeli felvétel újrakiadása | yes |
  | `author_period_recording` | gramofonfelvétel a szerző előadásában | yes |
  | `archival_film_recording` | archív filmfelvétel | no |
  | `later_recording` | későbbi felvétel | no |
  | `hungaroton_reissue` | Hungaroton-újrakiadás | no |

  `buildMusicEntries` adds a problem, and so fails the build, for any relation not in the map, naming the anchor (FR-010).
- **Rationale**: The schema allows any snake_case relation, so the guard belongs where entries are built, next to the other content checks. The phrases are short, lowercase, Hungarian noun phrases that follow a „·”.
- **Alternatives**:
  - A Zod enum. Rejected: it would reject new relations with a less helpful message, and this way the phrase and the check stay in one table.
  - Phrases in the YAML. Rejected: the owner's metadata is used verbatim, and the phrases are presentation.

## R4. The recording line

- **Decision**: `recordingLines(entry)` returns `{ primary, secondary? }`:
  - `primary` = „Felvétel: ” + `recording_artist` + („, ” + year), where year = `recording_year`, or else the song's year when the relation has `periodYear`, or else nothing.
  - `secondary` = the non-empty parts of [`recording_label` + „ ” + `recording_catalog_number`, phrase + („, ” + `recording_release_year`)] joined with „ · ”.

  `recording_source` is not shown: in the current data it repeats what the phrase and the note already say (for example „János vitéz (1938), hangosfilm” next to „archív filmfelvétel”). The two lines are rendered as one `p.music__recording`, with the secondary line in its own `span` that is a block, so they wrap independently.

  Result for the current data:

  | year | primary | secondary |
  |---|---|---|
  | 1901 | Felvétel: Fráter Lóránd, 1914 | Columbia E 972 · gramofonfelvétel a szerző előadásában |
  | 1904 | Felvétel: Palló Imre, Kiss Ferenc, 1938 | archív filmfelvétel |
  | 1916 | Felvétel: Honthy Hanna, Feleki Kamill és Homm Pál | későbbi felvétel |
  | 1926 | Felvétel: Udvardy Tibor és Petress Zsuzsa | későbbi felvétel |
  | 1935 | Felvétel: Kalmár Pál, 1935 | korabeli felvétel újrakiadása |
  | 1942 | Felvétel: Karády Katalin, 1942 | korabeli felvétel |
  | 1959 | Felvétel: Kovács Eszti | Hungaroton-újrakiadás, 1993 |
  | 1968 | Felvétel: Illés, 1968 | korabeli felvétel |

- **Rationale**: This meets FR-009 and SC-003: at most two short lines and no codes. It is derived, so no new editorial field is needed. The line is shown only when the card has a recording (`youtubeId`), as in 011.
- **Alternatives**: showing `recording_source` as a third part. Rejected: duplication and line length. The comma inside the 1904 artist list is acceptable; „1938” is unambiguous as the last part.

## R5. Sources disclosure

- **Decision**:
  - `<details class="music__sources">` with `<summary>`: „Források · N”. N = `entry.sources.length`; with N = 0 the label is just „Források”. A CSS chevron rotates on `[open]`, as in `.name-list`.
  - Inside, in this order:
    1. `p.event__sources` with the links, using the existing class and style
    2. `p.music__recording-note` with the long recording note
    3. `p.music__media-credit` with caption · credit · licence · source link, when there is an image
  - The `details` is omitted when all three are empty.
  - Summary: `min-height: 44px`, walnut text, the kicker-free label style of the button row (0.9375rem, 600). It sits on the same row as the button: `.music__actions` becomes a flex row with wrapping, and the `details` follows it, so the open list drops below both.
- **Rationale**: Native `<details>` gives pointer, Enter and Space, no-JS behaviour and the expanded state to assistive technology for free (FR-012, SC-004). The links keep `.event__sources`, so the statistics click handling and the link style are unchanged (FR-013).
- **Alternatives**: a JS accordion with `aria-expanded`. Rejected: it fails without JS and costs script.

## R6. Printing the sources open

- **Decision**: In `@media print`: `.music__sources::details-content { content-visibility: visible; display: block }` and the summary chevron hidden. In addition, the existing `src/scripts/print-details.ts`, which already opens the Lakók name lists, also opens closed music `details` on `beforeprint` and closes the same ones on `afterprint`. The home page now loads it.
- **Rationale**: `::details-content` covers current Chromium and Firefox. The listener covers Safari and older engines. Both are no-ops outside printing.
- **Alternatives**: always-open details in print via JS only. Rejected: printing from a no-JS context would lose the sources in Chromium, where the CSS works.

## R7. Where images live and how the YAML names them

- **Decision**:
  - Files go in `src/assets/music/` .
  - `media.src` is a bare file name in that directory (`^[a-z0-9][a-z0-9._-]*\.(jpe?g|png|webp)$`), for example `frater-lorand.jpg`.
  - The new `src/lib/images/music-images.ts` globs the directory eagerly, like `archive-images.ts`, and `musicImageMetadata(file)` throws when the file is missing. A typo therefore fails every build, draft or release.
- **Rationale**: Event images come in through the manifest and the fetch script from their original URLs. Music images are hand-picked and added by the owner, so a separate directory keeps them out of the manifest's integrity checks. `astro:assets` needs files under `src/` to resize them. The request's `/images/music/…` site path cannot be resized, so `src` names a file instead (spec Assumption).
- **Alternatives**:
  - Reuse `src/assets/archive/` and the manifest. Rejected: the manifest records fetched originals with hashes; hand-added files would break its contract.
  - `public/images/music/`. Rejected: no responsive formats (Principle II).

## R8. Layout switch by card width

- **Decision**:
  - `.music` gets `container: music / inline-size`.
  - The default (stacked) order follows the DOM: kicker, title, credit, media, note, recording, actions, sources.
  - `@container music (min-width: 38rem)` applies only to cards with `.music--with-media`. It makes the card a two-column grid, `grid-template-columns: minmax(0, 64fr) minmax(0, 36fr)`, with an explicit `grid-template-rows: repeat(7, auto) 1fr`. Every child goes in column 1 except `.music__media`, which takes `grid-column: 2; grid-row: 1 / -1`.
  - The card's horizontal padding is removed on the image side, so the image reaches the card edge, and the column gap is about 1.5 rem.
- **Rationale**:
  - It depends on the card's actual width, as the spec's "tablet" and "760–1000 px" edge cases ask. With the 46 rem card, the split appears from about 1000 px viewport width.
  - At the 38 rem threshold, 64% of the content width leaves about 23–30 rem for the note, roughly 58–66 characters of Source Sans at the 17 px body size (FR-008).
  - Cards without an image keep the single column (FR-014).
- **Alternatives**: a viewport media query. Rejected: the date column and gutters make viewport width a poor proxy for card width.

## R9. Image box, crop and loading

- **Decision**:
  - Markup: `<div class="music__media" style="--music-image-position: 50% 35%">` holding `<Picture>`, with `formats={['avif','webp']}`, `fallbackFormat="jpg"`, `widths={[480, 800, 1200]}`, `sizes="(min-width: 1000px) 420px, 92vw"`, `loading="lazy"`, `decoding="async"` and the source's own width and height.
  - Stacked: the box has `aspect-ratio: 16 / 7` and full card width (negative inline margins equal to the card padding), with a block margin of about 0.9 rem.
  - Split: the box is `position: relative; min-height: 18rem` in its grid cell, and the `img` is `position: absolute; inset: 0; width: 100%; height: 100%`.
  - In both cases: `object-fit: cover` and `object-position: var(--music-image-position, 50% 50%)`.
- **Rationale**: The box size never depends on the image, so there is no layout shift (SC-007). One source set serves both crops; the 420 px slot covers the split column's cover crop at 2× density for a 3:2 source. Lazy loading meets SC-006, since all cards sit far below the hero.
- **Alternatives**:
  - Build-time crops per layout with `fit: cover`. Rejected: two crops double the files, and CSS `object-position` already keeps the editor's focus point (FR-017).
  - Reusing `EvidenceFigure.astro`. Rejected: its zoom link and visible figcaption contradict FR-024 and the discreet-credit rule.

## R10. The shared image treatment

- **Decision**: These are the request's values, tuned only where the palette needs it:
  - `img`: `filter: grayscale(0.7) sepia(0.12) contrast(0.92) brightness(1.03)`, `opacity: 0.84`.
  - Split layout: a mask on the image, `linear-gradient(to right, transparent 0%, rgb(0 0 0 / 0.25) 12%, rgb(0 0 0 / 0.75) 32%, #000 48%)`, with both `-webkit-mask-image` and `mask-image`.
  - Stacked layout: the same gradient running `to top`, so the bottom edge fades into the note below.
  - `.music__media::after`: a veil `background: rgb(238 230 217 / 0.12)`, the paper-alt colour, with `pointer-events: none`.
  - The focus point is the only per-card value: one custom property in a `style` attribute (`no-inline-style` is off in `.htmlvalidate.json`).
- **Rationale**: One class gives all eight cards the same treatment (FR-016, FR-025). The mask shows the card's own surface, so text → whitespace → image needs no extra gradient element.
- **Alternatives**:
  - Processing the treatment into the files with sharp at build time. Rejected: it fixes the look per file, and CSS keeps one dial for all.
  - Background images instead of `<img>`. Rejected: no `srcset`, lazy loading or alt text.

## R11. Image load failure

- **Decision**: A capture-phase `error` listener on `document` checks whether the failed target is inside a `.music__media`. If so, it sets `hidden` on that box and removes `.music--with-media` from the card, which falls back to the text-only layout. That is about 120 bytes in `music-player.ts`, the module already loaded on the home page.
- **Rationale**: The build guarantees the file exists (R7), so this covers only a network failure. Without JS, the browser shows the alt text inside the veiled box, which is acceptable.
- **Alternatives**: an inline `onerror` attribute. Rejected: inline handlers are avoided across the site.

## R12. Credit, licence, alt text and JSON-LD

- **Decision**:
  - The `media` block (data-model.md) has `alt`, `caption`, `credit` and `license` as strings defaulting to `''`, `source_title`, `source_url` (https), `position` (`^\d{1,3}% \d{1,3}%$`) and `decorative` (boolean, default false).
  - `auditEditorial` adds `scope: 'music'` items for:
    - an empty `credit` or `license`
    - an empty `alt` unless `decorative`
    - a generic alt (`kép`, `fotó`, `image`, `music image`, `portré`, case-insensitive)
  - On the card, the credit appears only in the sources panel (R5). The `alt` goes on the `img`; `decorative: true` renders `alt=""`.
  - `index.astro` adds an `imageNode` per music image, with path `/#zene-…`, `caption` (or `alt` when the caption is empty), `credit`, `sourceUrl` and the new optional `license`.
- **Rationale**: This mirrors how event images are gated (FR-019) and described (FR-021, Principle V). The generic-alt check makes SC-006 testable.
- **Alternatives**: making the fields required in the schema. Rejected: draft builds must work while the owner is still collecting credits, the same policy as event images.

## R13. The button

- **Decision**:
  - `.music__play`: `min-height: 44px`, `padding: 0 0.9rem`, `border: 1px solid var(--d18-rule)`, transparent background, walnut text, weight 600.
  - On hover or focus-visible: `background: var(--d18-paper)` (lighter than the card surface) and `border-color: var(--d18-sand)`, with a 120 ms transition on background-color and border-color.
  - The playing and paused states keep their 011 meaning, but with a quieter look: `background: var(--d18-paper-deep)` and the walnut border, rather than the filled walnut.
  - The symbol becomes „▷” (U+25B7), changed in the static markup and in `cardLabel()` in `music-player.ts`. „♫” stays for „Most szól”.
  - `min-width: 15ch` stays, so the label changes cause no shift.
- **Rationale**: This is an outline button in palette tones with no filled bright state (FR-022). U+25B7 has no emoji presentation, so iOS will not turn it into a coloured emoji; U+25B6 can be. The cards still say „Most szól” and „Folytatás” (US5).
- **Alternatives**: an SVG play icon. Rejected: the script would have to swap icons, where it now swaps text, for no visible gain.

## R14. Player typography and the credit field

- **Decision**:
  - `.music-player__year` uses the date style: Cormorant 500, lining numerals, 1.3rem on narrow screens and 1.5rem from 760 px. The display font, weight and numerals are what tie it to the date column; the size stays compact.
  - `.music-player__title` uses Cormorant 500 at 1.25–1.45rem, two lines at most, as before.
  - A new `.music-player__credit` (`data-music-player-credit`) sits between the title and the artist, in Source Sans 600, walnut. `.music-player__artist` reads „Felvétel: <recording artist>” in muted 0.875rem.
  - The button gains `data-music-credit`, and `music-player.ts` fills one more field.
  - The video area, controls and behaviour are unchanged (FR-023).
- **Rationale**: The player now has the card's hierarchy: year, category, title, credit, and then who is heard.
- **Alternatives**: dropping the artist line. Rejected: the spec's Assumptions keep it, so the visitor knows whose recording plays.

## R15. Hover, motion and the highlight

- **Decision**:
  - The card itself gets no hover rule.
  - Transitions exist only on the button and the summary (background-color, border-color and color, 120 ms) and on the summary chevron's rotation. All of them sit under `@media (prefers-reduced-motion: no-preference)`.
  - The 011 jump highlight stays (outline plus a background fade), with its start colour now `--d18-paper-deep` on the paper-alt surface.
- **Rationale**: FR-024. `base.css` has no global transition reset (it only switches off smooth scrolling), so each transition is wrapped in the `no-preference` query.

## R16. Tests

- **Decision**:
  - Unit tests:
    - `recordingLines` for every row of the R4 table
    - the unknown-relation build error
    - the `media` schema (accepts a full block; rejects a bad `src`, bad `position` or http URL)
    - the audit cases from R12
  - Site tests, against the real content:
    - date-column markup
    - the new order
    - no year in the kicker
    - `details` with the right N and closed by default
    - the recording line equal to `recordingLines`
    - the long note only inside `details`
    - no `<img>` in any card without media
    - identical structure
    - for each card with media: the box, `<picture>`, lazy loading, alt, the position property, the credit in the panel and the `ImageObject`
- **Rationale**: The owner's images are real content, so the site tests check them directly. A card without media is checked for the text-only markup.
- **Alternatives**: a test-only fixture image. Rejected: the real images make it unnecessary.
