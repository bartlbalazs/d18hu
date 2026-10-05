# Feature Specification: Music card refinement

**Feature Branch**: `master` (direct)

**Created**: 2026-10-05

**Status**: Draft

**Input**: User description: "D18 – zenei timeline-kártyák vizuális finomítása" — rework the eight „Mit hallgatott Budapest?” cards from specs/011-timeline-music-layer so they read as real timeline events and as edited musical intermezzos in the site's cream–beige–taupe editorial look, not as streaming widgets. In short:
- the year moves into the timeline's date column
- the dashed frame is replaced by a soft background and fine rules
- each card can carry one archive image on the right, with one shared, subtle treatment and a soft fade into the card
- a short recording line replaces the long recording note
- a quieter „▷ Meghallgatom” button
- the sources fold into a „Források · N” disclosure
- the sticky player matches the card's typography

The playback logic, the YouTube provider, and the site palette stay as they are. The full description (33 sections, including CSS direction, mobile order, the `media` data block and 20 acceptance criteria) is the source of this spec.

This feature **supersedes** these parts of specs/011-timeline-music-layer:
- **FR-004**, "no image other than the shared note icon": an editorial archive image is now allowed
- **FR-027**, "MUST NOT carry image fields": one `media` block is now allowed
- **FR-003**'s year in the kicker: the year moves to the date column

Everything else in 011 stays in force: one card design, the CTA text, the click-to-load player, no YouTube image on cards, and the Környék step.

## Clarifications

### Session 2026-10-05

- Q: Which songs get an image in this feature, and who provides them? → A: The owner downloads and supplies the image files (option b). Songs without a supplied file use the text-only layout.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The music card reads as a timeline event (Priority: P1)

A visitor scrolling the timeline sees „1901” in the same place and type as every other event's date, the round note node on the axis, and to the right the card: „♫ MIT HALLGATOTT BUDAPEST?”, the song title, the credit, the note, a short recording line, „▷ Meghallgatom” and „Források · 2”. The card sits on a slightly different background with fine rules, without a dashed frame.

**Why this priority**: The year in the date column is the main structural fix, and the new hierarchy applies to all eight cards whether or not they have an image.

**Independent Test**: Open the home page at 1280 px and at 360 px, compare a music card with the event rows around it, and check the order of its content.

**Acceptance Scenarios**:

1. **Given** a music card at desktop width, **Then** its year appears in the left date column, in the same typeface, size, and vertical position as the dates of normal events, and its note node is on the same axis as the other nodes.
2. **Given** a music card at mobile width, **Then** the year appears above the content in the same position and type as other events' dates.
3. **Given** any music card, **Then** its content appears in this order: the category label with the note mark, the title, the credit, the note, the recording line, the „Meghallgatom” button, and the „Források · N” control. The category label no longer contains the year.
4. **Given** any music card, **Then** it has no full dashed or dotted frame. It is set apart by a background tone from the site palette and, at most, fine top and bottom rules.
5. **Given** the eight cards, **Then** they differ only in content. Layout, colours, rules, spacing, type, image treatment, and controls are identical.

---

### User Story 2 - A short, human recording line (Priority: P1)

Under the note, a visitor reads „Felvétel: Fráter Lóránd, 1914” and on a second line „Columbia E 972 · gramofonfelvétel”, rather than the editor's long recording note.

**Why this priority**: The long notes are the heaviest part of the current card. Two of them also say „YouTube” on the card, which 011 reserves for the player.

**Independent Test**: Read the recording line of each of the eight cards and check that the long note is not visible by default.

**Acceptance Scenarios**:

1. **Given** a card, **Then** its recording line reads „Felvétel: <recording artist>, <recording year>”, with the year omitted when it is unknown. A second short line appears when label, catalogue number, or a recording-type phrase is known.
2. **Given** a card, **Then** no internal code such as `later_recording` or `archival_film_recording` is visible. Each recording type appears only as a short Hungarian phrase, for example „későbbi felvétel” or „archív filmfelvétel”.
3. **Given** a card with a long recording note, **Then** the note is not shown in the card's main body. It is available in the opened „Források” panel.

---

### User Story 3 - Sources fold away (Priority: P1)

The card ends with „Források · 2 ˅”. Pressing it opens the list of sources, in the site's usual source-link style, and the arrow turns to „˄”.

**Why this priority**: The bibliography is important but secondary. Folding it shortens every card.

**Independent Test**: Open and close the sources of a card with mouse and keyboard, and with JavaScript off.

**Acceptance Scenarios**:

1. **Given** a card with N sources, **Then** a closed control „Források · N” is shown, and the source links are hidden.
2. **Given** the control, **When** the visitor presses it with a pointer, Enter, or Space, **Then** the list opens, showing each source as a link, plus the recording note and the image credit when present. Pressing it again closes the list.
3. **Given** JavaScript is off, **Then** the control still opens and closes.
4. **Given** the page is printed, **Then** the sources are printed open.
5. **Given** a card with no sources, no recording note, and no image credit, **Then** no „Források” control is shown.

---

### User Story 4 - An archive image that belongs to the page (Priority: P2)

On a wide screen, the right third of the card shows a historical image: the composer's or performer's period portrait, a film still, a record label, or a score cover. It is toned down to match the site and fades in softly from the left. On a phone, the same image appears as a low panoramic band under the credit.

**Why this priority**: It delivers the visual richness the request asks for, but the card must work fully without it, and images arrive one by one.

**Independent Test**: Give one song a `media` block and leave another without. Compare both at 1280 px, 768 px, and 360 px.

**Acceptance Scenarios**:

1. **Given** a card with an image at desktop width, **Then** the text takes roughly 62–68% and the image roughly 32–38% of the card's content width. The image fills its area with cover cropping, and the note keeps a comfortable line length of about 58–66 characters.
2. **Given** any card image, **Then** it gets the same subtle treatment as every other music image: mostly desaturated, a faint warm tone, slightly lowered contrast and opacity, and a very light veil in the site's paper colour. No strong sepia, aged-paper texture, scratches, or vignette is added.
3. **Given** a card image at desktop width, **Then** its left edge fades gradually into the card background, with no hard vertical cut between text and image.
4. **Given** a card image with a focus point set by the editor, **Then** the crop keeps that point in view at every width.
5. **Given** a card image at mobile width, **Then** it appears as its own block between the credit and the note, full or nearly full card width, at a low panoramic ratio (about 16 : 7). It does not fill the viewport. It may fade vertically instead of from the left.
6. **Given** a card without an image, **Then** the text uses the full card width, and no placeholder, stock image, or YouTube thumbnail appears.
7. **Given** an image, **Then** it has meaningful alternative text, for example „Fráter Lóránd portréja”. Its caption and credit appear only discreetly or in the „Források” panel, never as long attribution text under the image.
8. **Given** the home page loads, **Then** music images below the first screen are not downloaded until they approach the viewport, and each one is served in a size and modern format suited to the screen.

---

### User Story 5 - A quieter button and a matching player (Priority: P2)

„▷ Meghallgatom” is an outline or text-style button in the site palette with a small play mark. When a song plays, the sticky player shows the same note mark, the same serif year, and the same title-over-credit hierarchy as the card, in the same beige and taupe family.

**Why this priority**: It completes the visual system. Playback already works.

**Independent Test**: Hover and focus the button, play a song, and compare the player's header with the card.

**Acceptance Scenarios**:

1. **Given** the button, **Then** its visible text is exactly „Meghallgatom” with a small outline play mark. It has no filled bright background, no gradient, and no large animation. On hover or focus, a very light beige or taupe background and a slightly stronger border appear.
2. **Given** a song plays, **Then** the button still shows „Most szól” and „Folytatás” as before, in the same restrained style.
3. **Given** the player is visible, **Then** it shows the same note mark, the year in the same serif style as the card's date column, the category, the title in the card's title type, and the credit in the card's credit type, followed by the recording artist. The video picture in the player stays as it is.
4. **Given** any card, **Then** only the button, the „Források” control, and the links inside are interactive. The card as a whole is not clickable and does not lift, scale, cast a strong shadow, or zoom its image on hover.

---

### Edge Cases

- **No recording year**: a period recording without its own recording year shows the song's year. Any other recording without a year shows the artist alone („Felvétel: Kalmár Pál”).
- **Unknown recording type**: the build stops and names the song, so no code ever reaches the page. The fix is adding the Hungarian phrase for the new type.
- **Very long title or credit**: it wraps within the text column and never runs under the image.
- **Portrait versus landscape images**: both are cover-cropped into the same area. The editor's focus point decides what stays visible.
- **Image fails to load**: the area collapses to the text-only layout, or shows the plain card background. No broken-image icon is shown.
- **Reduced motion**: any fade or hover transition is instant.
- **Narrow desktop widths (760–1000 px)**: when the card is too narrow for a readable side-by-side split, the image moves under the credit as on mobile. This depends on the card's actual width, not the device type.
- **Scope slider at Ház**: cards stay hidden as before. A link to a card still widens the slider.
- **No JavaScript**: the year, image, recording line, and sources disclosure all work. Only the in-page button is replaced by the „YouTube ↗” link, as in 011.

## Requirements *(mandatory)*

### Functional Requirements

**Timeline position**

- **FR-001**: Each music card MUST show its year in the timeline's date column, in the same typeface, size, and position as other events' dates, at every width.
- **FR-002**: The music node MUST stay round, use the shared note mark, follow the same size rules as the other nodes, and take its colours from the existing brown and taupe palette. It MUST NOT glow or animate; hover and focus may change it only very slightly.
- **FR-003**: The category label MUST read „Mit hallgatott Budapest?” in the site's uppercase, letter-spaced, small sans-serif label style, with an optional small note mark. It MUST NOT contain the year and MUST NOT look like a badge.

**Card**

- **FR-004**: The card MUST NOT have a full dashed, dotted, or solid frame. It MUST use a background tone and, optionally, fine top and bottom rules, all from the existing palette tokens.
- **FR-005**: The card MUST NOT introduce a new accent colour. Red, burgundy, streaming-brand greens or reds, gradients, strong shadows, and large rounded corners are excluded.
- **FR-006**: Content order MUST be: category label, title, credit, (image on mobile), note, recording line, button, sources control.
- **FR-007**: The title MUST use the serif title style of normal timeline events. The credit MUST follow directly in a medium or semibold sans-serif, visibly secondary to the title.
- **FR-008**: The note MUST keep the normal timeline text size or larger, with a comfortable line height, and a line length of about 58–66 characters when an image is beside it.

**Recording line**

- **FR-009**: The card MUST show a short recording line: „Felvétel: <recording artist>, <year>”, plus an optional second line joining the label and catalogue number with a Hungarian recording-type phrase (for example „Columbia E 972 · gramofonfelvétel”, „archív filmfelvétel”, „Hungaroton-újrakiadás, 1993”).
- **FR-010**: Every recording type in the content MUST map to a Hungarian phrase. A type without a phrase MUST stop the build with a message naming the song.
- **FR-011**: The long recording note MUST NOT appear in the card body. It MUST appear inside the opened sources panel.

**Sources**

- **FR-012**: Sources MUST be behind a closed-by-default control labelled „Források · N”, where N is the number of source links, with a down or up arrow showing its state. It MUST open and close with pointer and keyboard, MUST work without JavaScript, and MUST print open.
- **FR-013**: The opened panel MUST list the source links in the site's existing source-link style, followed by the recording note and the image credit when present.

**Image**

- **FR-014**: A song MAY have one image. Without one, the card MUST use the full width with no placeholder, and MUST NOT fall back to any YouTube image.
- **FR-015**: On wide cards, the image MUST sit on the right, at about 32–38% of the content width, and fill its area with cover cropping. On narrow cards, it MUST appear as a separate low panoramic block (about 16 : 7) between the credit and the note.
- **FR-016**: All music images MUST share one subtle visual treatment (desaturation, a faint warm tone, slightly lowered contrast and opacity, a light paper-coloured veil) and MUST fade into the card background on their left edge on wide cards. They MAY fade vertically on narrow cards.
- **FR-017**: An editor MUST be able to set a focus point per image, which the crop keeps in view.
- **FR-018**: Every image MUST have meaningful alternative text. An image MAY use empty alternative text only if it is marked as purely decorative.
- **FR-019**: Each image MUST carry a credit and a licence, like the timeline's other archive images. A release build MUST fail while either is missing. The credit is shown only discreetly, or in the sources panel.
- **FR-020**: Images MUST be self-hosted and served responsively in modern formats with fixed dimensions. Images below the first screen MUST load lazily. The page MUST keep meeting the constitution's performance budget.
- **FR-021**: Images MUST be described to search engines as archive images, like the timeline's other images. The music entries themselves stay out of the event data, as in 011.

**Button and player**

- **FR-022**: The button MUST read exactly „Meghallgatom” (with „Most szól” and „Folytatás” while playing and paused, as in 011), with a small outline play mark. It MUST look like an outline or text button in the site palette: no filled bright background, and only a light background and border change on hover or focus.
- **FR-023**: The sticky player MUST use the same note mark, the same serif year style as the card's date column, and the same title and credit type as the card. Its playback behaviour, YouTube embed, and video picture MUST NOT change.

**Interaction and motion**

- **FR-024**: Only the button, the sources control, and links MAY be interactive. Hover effects MUST be limited to subtle colour, border, and opacity changes of about 120 ms, with no lift, scale, shadow, or image zoom. All transitions MUST be removed when the visitor prefers reduced motion.
- **FR-025**: All eight cards MUST be rendered by one card design. Only the year, title, credit, note, recording line, image, and sources may differ.

### Key Entities

- **Music entry**: from 011, extended with an optional **media** block.
- **Media**: one archive image for a song. Attributes:
  - the image file
  - alternative text
  - optional caption
  - credit and licence
  - source title and link
  - optional focus point (for example „50% 35%”)
  - an optional decorative flag
- **Recording line**: derived from the existing recording fields (artist, recording year, label, catalogue number, release year, type). Not stored separately.
- **Recording type phrase**: one short Hungarian phrase per recording type, kept with the code, for example:
  - `author_period_recording` → „gramofonfelvétel a szerző előadásában”
  - `archival_film_recording` → „archív filmfelvétel”
  - `later_recording` → „későbbi felvétel”
  - `hungaroton_reissue` → „Hungaroton-újrakiadás”

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At 360 px, 768 px, 1100 px, and 1280 px, the year of each of the eight music cards sits in the same horizontal position as the dates of the surrounding events, within 2 px.
- **SC-002**: No music card shows a dashed or dotted frame, and every colour on it is one of the site's existing palette values.
- **SC-003**: No card body shows an internal recording code. The word „YouTube” appears only in the no-JS link from 011, and in the sources panel when the recording note mentions it. Each card's recording line is at most two short lines.
- **SC-004**: Every card's sources are closed on load, and open and close by pointer, keyboard, and without JavaScript.
- **SC-005**: Comparing the eight cards with their text and images removed shows identical structure, with or without an image.
- **SC-006**: Every music image has non-generic alternative text, a credit, and a licence, and none is downloaded before it approaches the viewport.
- **SC-007**: The home page keeps its Lighthouse scores (performance ≥ 95; accessibility, best practices and SEO 100) and a layout shift of at most 0.05, with images present.
- **SC-008**: Every playback scenario of 011's quickstart still passes.

## Assumptions

- Images are archive files the owner adds to the repository, like the timeline's other local images, and they are processed at build time. Nothing is fetched at run time.
- The `media` block from the request gains `credit` and `license`, required for release, because constitution V requires credit and licence for archive images and the site already enforces them for event images. `src` names a local file rather than a site URL.
- „Felvétel: …, <year>” uses `recording_year` when given. Otherwise, for `period_recording`, `period_recording_reissue` and `author_period_recording`, it uses the song's year. Otherwise it shows no year.
- The credit line under the title stays the existing `credit` field. The player keeps showing the recording artist under the credit, so the visitor knows who is heard.
- The side-by-side split is used only when the card is wide enough for the 58–66 character note column beside the image (roughly 38 rem of card width). Narrower cards use the stacked mobile order.
- The CSS values in the request (filter strengths, mask stops, veil opacity, aspect ratio) are the starting point. The planning phase may tune them against the real palette and images.
- The owner supplies the image files (Clarification 1), with credit and licence for each. Any song without a file at release uses the text-only layout.
