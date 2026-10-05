# Feature Specification: Timeline music layer

**Feature Branch**: `master` (direct)

**Created**: 2026-10-05

**Status**: Draft

**Input**: User description: "Timeline zenei réteg – feature specifikáció" — a separate, rarely appearing music layer on the home page timeline, "♫ Mit hallgatott Budapest?", showing about eight popular songs that Budapest could hear between 1901 and 1968. Every music entry uses one fixed card with the same note icon and no per-song image. Its main button, „▶ Meghallgatom”, plays the song in one shared sticky player at the bottom of the screen, which always shows the song's year, title and performer, and offers „↑ Ugrás a dalhoz”, an optional „YouTube ↗” link and a close button. Playback happens only after an explicit click, the video service loads only then, and only one player exists on the page. The full description (38 sections, including the data model, the eight initial songs, the narrative arc from magyar nóta to beat, accessibility labels, error fallback, deep-link anchors and optional analytics events) is the source of this spec.

The eight initial songs, by era of the home page timeline:

| Era | Year | Song | Named in the request |
|---|---|---|---|
| 1873–1913 | 1901 | Őszi rózsa, fehér őszi rózsa | Fráter Lóránd |
| 1873–1913 | 1904 | Egy rózsaszál szebben beszél | Kacsóh Pongrác |
| 1914–1938 | 1916 | Hajmási Péter, Hajmási Pál | Kálmán Imre |
| 1914–1938 | 1926 | Van a Bajza utca sarkán | Zerkovitz Béla |
| 1914–1938 | 1935 | Szomorú vasárnap | Kalmár Pál / Seress Rezső |
| 1939–1945 | 1942 | Valahol Oroszországban | Karády Katalin |
| 1946–1968 | 1959 | Pancsoló kislány | Kovács Eszti |
| 1946–1968 | 1968 | Amikor én még kissrác voltam | Illés |

## Clarifications

### Session 2026-10-05

- Q: What counts as consent for loading the video embed, given that Principle IV allows no third-party requests without consent? → A: Pressing „Meghallgatom” is the consent for that one embed. The constitution is amended to allow it, and the Impresszum says so.
- Q: At which scope-slider settings should the music cards show? → A: From Környék up. They are part of the Környék step, visible at the default setting and hidden at Ház.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Recognise a music stop in the timeline (Priority: P1)

A visitor scrolling the timeline meets a small, quiet card headed „♫ MIT HALLGATOTT BUDAPEST? · 1935”, with the song title, the performer and a two-to-four sentence note on why the song mattered. At the second such card they recognise it at once as a music stop, a short cultural detour, not an event of the house.

**Why this priority**: The cards carry the content and the narrative arc on their own, even before anything plays. They are the part every visitor sees.

**Independent Test**: Open the home page with the music cards present but playback not yet built, and check that every card has the same look and the required information in the required order.

**Acceptance Scenarios**:

1. **Given** the home page, **Then** each music entry appears as its own timeline entry in year order within its era, not inside an era opener.
2. **Given** any music card, **Then** it shows, in this order: the note icon, „Mit hallgatott Budapest?”, the year, the song title, the performer, the short note, and the „▶ Meghallgatom” button.
3. **Given** two different music cards, **Then** they differ only in their text: icon, background, border, width, spacing, heading levels, year position, category label, note typography, button and its hover, focus and playing states are identical.
4. **Given** any music card, **Then** it shows no picture of any kind: no portrait, record or score cover, video thumbnail, film still or per-song illustration.
5. **Given** a music card next to a house event, **Then** the music card is visibly lighter in weight than the main history cards and cannot be mistaken for one.
6. **Given** the Jelmagyarázat, **Then** it explains in one short passage that „♫ Mit hallgatott Budapest?” entries show what the city could hear at the time, not what the residents of no. 18 are known to have listened to.

---

### User Story 2 - Play a song without leaving the page (Priority: P1)

The visitor presses „▶ Meghallgatom” on the 1935 card. A player slides up at the bottom of the screen and the song starts. The card now reads „♫ Most szól”. The player shows „♫ 1935 · MIT HALLGATOTT BUDAPEST?”, „Szomorú vasárnap”, „Kalmár Pál”, the video picture, and the controls ⏸, „↑ Ugrás a dalhoz”, „YouTube ↗” and ×.

**Why this priority**: Hearing the era is the purpose of the feature.

**Independent Test**: Press „Meghallgatom” on any card and check that the song plays in the page, the player appears with the right year, title and performer, and the page address does not change to another site.

**Acceptance Scenarios**:

1. **Given** no song has been started, **Then** no player is visible and nothing from the video service has been loaded.
2. **Given** a music card, **When** the visitor presses „▶ Meghallgatom”, **Then** the song starts in the player at the bottom of the screen, no new tab opens, and the visitor stays at the same place on the page.
3. **Given** a song is playing, **Then** its card's button reads „♫ Most szól”; **When** the visitor pauses from the player or from the card, **Then** the card reads „▶ Folytatás”, and pressing it resumes the song.
4. **Given** the player is visible, **Then** it always shows the note icon, the year (as the most prominent item), the category, the title, the performer, play/pause, „↑ Ugrás a dalhoz” and ×. The video picture is smaller in visual weight than the year, title and performer.
5. **Given** the player is visible, **Then** it also offers „YouTube ↗”, which opens the original video in a new tab. The word „YouTube” appears nowhere else in the music layer except the error fallback.
6. **Given** the visitor scrolls on to the 1960s while the 1935 song plays, **Then** the player still shows 1935, so the visitor knows where the song belongs.

---

### User Story 3 - Switch songs and close the player (Priority: P1)

While the 1935 song plays, the visitor presses „Meghallgatom” on the 1959 card. The 1935 song stops, the same player loads the 1959 song and updates its year, title and performer, the 1935 card returns to „▶ Meghallgatom” and the 1959 card reads „♫ Most szól”. When the visitor presses ×, the music stops, the player disappears and every card returns to „▶ Meghallgatom”.

**Why this priority**: Without this, two songs could play over each other, or a song could not be stopped.

**Independent Test**: Start two songs one after the other, then close the player, and check the cards and the player at each step.

**Acceptance Scenarios**:

1. **Given** a song is playing, **When** the visitor starts another song, **Then** only the new song plays, there is still exactly one player on the page, and only the new card shows „♫ Most szól”.
2. **Given** the player is visible, **When** the visitor presses ×, **Then** playback stops, the player disappears, the extra space at the bottom of the page is removed, and all cards show „▶ Meghallgatom”.
3. **Given** the player was closed, **When** the visitor presses „Meghallgatom” again, **Then** the player reappears with that song.

---

### User Story 4 - Jump back to the song's card (Priority: P2)

Far down the page, the visitor wants to reread why the playing song mattered. They press „↑ Ugrás a dalhoz” in the player. The page scrolls smoothly back to the card, and the card is briefly and gently highlighted.

**Why this priority**: It ties the player back to its place in history, but the feature works without it.

**Independent Test**: Start a song, scroll far away, press „↑ Ugrás a dalhoz” and check where the page stops.

**Acceptance Scenarios**:

1. **Given** a song is playing and its card is off screen, **When** the visitor presses „↑ Ugrás a dalhoz”, **Then** the page scrolls to that card, the card is not hidden under the site header or the player, and it is briefly highlighted.
2. **Given** every music card, **Then** it has its own stable address on the page, built from its year and title (for example `#zene-1935-szomoru-vasarnap`), and opening that address scrolls to the card.

---

### User Story 5 - Use the player on a phone (Priority: P2)

On a phone the player is a compact, full-width panel at the bottom: „♫ 1935”, the title in at most two lines, the performer, a small video area, and ⏸, „↑ Idővonal” and ×, each easy to hit with a thumb.

**Why this priority**: Most visitors read on phones (constitution, Principle III).

**Independent Test**: Play a song at 360 px width and check the panel, the year, the title wrapping and the control sizes.

**Acceptance Scenarios**:

1. **Given** a narrow screen, **Then** the player spans the full width at the bottom, the year is always visible, and a long title wraps to at most two lines and is cut short after that.
2. **Given** a narrow screen, **Then** every player control is at least 44 × 44 px.
3. **Given** a wide screen, **Then** the player is a horizontal panel aligned to the page's content width, with the video area beside the year, title, performer and controls.

---

### Edge Cases

- **The video is deleted, private or cannot be embedded**: the player shows „Ez a felvétel jelenleg nem játszható le itt.” and a „YouTube ↗” link. The card's button does not stay in the „Most szól” state, and the rest of the timeline works as before.
- **The video service cannot be reached** (offline, blocked by the browser): the same fallback text appears; the page does not hang or show an empty box.
- **JavaScript is off or fails**: the music cards are still shown with all their text. The „Meghallgatom” button is not shown; in its place the card offers a plain „YouTube ↗” link to the recording, since that is honest external navigation. No player exists.
- **Scroll position and the player**: while the player is visible, the bottom of the page has extra space equal to the player's height, so the last event, the closing section and the footer can be scrolled fully into view above it.
- **Other floating parts**: the player does not cover the mobile menu, the image viewer or the consent notice. On narrow screens the timeline scope slider's round button moves up so it stays above the player and both remain usable.
- **Keyboard and screen-reader users**: every control is a real button or link reachable with Tab and usable with Enter or Space. Buttons announce what they do with the song's title or year, for example „Meghallgatom – Szomorú vasárnap”, „Szomorú vasárnap szüneteltetése”, „Ugrás a dalhoz – vissza az 1935-ös zenei bejegyzéshez”, „Zenelejátszó bezárása”. Where a button shows words, its name starts with them (WCAG 2.5.3). When the player opens, focus stays on the pressed card button; the change is announced politely (for example „Most szól: Szomorú vasárnap, 1935”). After × the focus returns to the card that was playing.
- **Reduced motion**: with reduced motion preferred, the player appears and disappears and „Ugrás a dalhoz” moves to the card without animation, and the highlight is a static change.
- **Printing**: the music cards print with their text; the player and the play buttons are not printed.
- **A song whose origin year differs from its Budapest moment** (for example „Hajmási Péter, Hajmási Pál” at its 1916 Budapest premiere): the card uses the year its note is about, and the note says briefly why, when that matters.
- **Scrolling past cards**: scrolling never starts, switches or stops a song.

## Requirements *(mandatory)*

### Functional Requirements

**Music cards**

- **FR-001**: The home page timeline MUST support music entries as a distinct kind of timeline entry, placed in year order within their era, separate from the era openers and from the house's events.
- **FR-002**: Every music entry MUST be rendered by one and the same card design, with no per-song variants of layout, colour or decoration.
- **FR-003**: Every music card MUST show, in this order: the shared note icon (♫ or an equivalent single note/score mark), the category „Mit hallgatott Budapest?”, the year, the song title, the performer, a short note, and the main button. Responsive layouts may rearrange the lines but MUST keep this order of information.
  *Superseded in part by specs/012-music-card-refinement: the year moves to the date column.*
- **FR-004**: Music cards MUST NOT show any image other than the shared note icon.
  *Superseded by specs/012-music-card-refinement: a card may carry one editorial archive image.*
- **FR-005**: The main button's label MUST be exactly „▶ Meghallgatom” in its resting state, „♫ Most szól” while its song plays, and „▶ Folytatás” while its song is paused. None of these labels may contain the word „YouTube”.
  *Superseded in part by specs/012-music-card-refinement: the play mark is the outline „▷”.*
- **FR-006**: Music cards MUST be visually lighter than the main history cards, use the site's existing typefaces, and be recognisable as their own kind.
- **FR-007**: Each music card MUST have a stable anchor of the form `zene-<year>-<title slug>` (for example `zene-1935-szomoru-vasarnap`).
- **FR-008**: Music entries MUST NOT be counted in an era's „Kronológia · N esemény” count and MUST NOT be presented to search engines as historical events of the building.
- **FR-009**: The Jelmagyarázat MUST gain a short passage introducing „♫ Mit hallgatott Budapest?” as a cultural detour that represents the city's soundscape, not documented listening in the house.
- **FR-010**: Music cards MUST belong to the Környék step of the timeline scope slider: they are shown at Környék, Magyarország and Világ (so at the default setting) and hidden at Ház. A link to a music card's anchor while the slider is at Ház MUST widen the slider to Környék, as for hidden events.

**Playback and player**

- **FR-011**: Pressing „Meghallgatom” MUST play the song inside the page without navigating away or opening a tab.
- **FR-012**: The page MUST have at most one player and at most one embedded video at any time. Starting another song MUST stop the current one and load the new one into the same player.
- **FR-013**: The player MUST appear only after the visitor first starts a song, and MUST be fixed to the bottom of the screen: a horizontal panel aligned to the content width on wide screens, a compact full-width panel on narrow screens.
- **FR-014**: While visible, the player MUST always show the note icon, the year (most prominent), the category, the title (at most two lines on narrow screens), the performer, a play/pause button, „↑ Ugrás a dalhoz” (shortened to „↑ Idővonal” on narrow screens), and a close button (×). It MAY show the video picture, but smaller in visual weight than the year, title and performer.
- **FR-015**: The player SHOULD offer „YouTube ↗”, opening the original video in a new tab. This and the error fallback are the only places the word „YouTube” appears in the music layer.
- **FR-016**: The playing card and the player MUST stay in sync: play, pause and resume from either one update both.
- **FR-017**: „↑ Ugrás a dalhoz” MUST scroll smoothly to the current song's card, leave it clear of the site header and the player, and briefly highlight it.
- **FR-018**: Closing the player MUST stop playback, hide the player, remove the extra bottom space and return every card to „▶ Meghallgatom”.
- **FR-019**: While the player is visible, the page MUST have extra bottom space equal to the player's height, so the player never covers timeline content.
- **FR-020**: Music MUST start only after an explicit press of a play control. Scrolling, page load or reaching a card MUST NOT start, switch or stop a song.
- **FR-021**: If a recording cannot be played (deleted, private, not embeddable, unreachable), the player MUST show „Ez a felvétel jelenleg nem játszható le itt.” with a „YouTube ↗” link, and the card MUST return from „Most szól”.
- **FR-022**: All controls MUST be real buttons or links, usable by keyboard and screen reader, with labels naming the song or year as listed in Edge Cases. Touch targets MUST be at least 44 × 44 px.

**Loading and privacy**

- **FR-023**: On first page load there MUST be no embedded video, no video thumbnail and no request to the video service. The video integration MUST load only when the visitor first presses „Meghallgatom”.
- **FR-024**: Embedded playback MUST use the video service's privacy-enhanced mode (`youtube-nocookie.com`).
- **FR-025**: Pressing „Meghallgatom” MUST count as the visitor's explicit consent to load the video service for playback; it does not require or imply acceptance of the statistics consent notice. Nothing from the video service may load before that press. The constitution (Principle IV) MUST be amended to allow this click-to-load embed as a second exception, and the Impresszum's data-handling section MUST say that starting a song loads the recording from YouTube's privacy-enhanced service.
- **FR-026**: If the visitor has accepted statistics in the existing consent notice, the site MAY record these interactions with the song's year, title, performer and video id: play, pause, change of song, close, jump to the card, opening the video service. Without consent nothing is recorded.

**Content**

- **FR-027**: Each music entry MUST have a year, title, performer, note and recording address; it MAY have a composer and sources. It MUST NOT carry image fields.
  *Superseded by specs/012-music-card-refinement: one optional `media` block is allowed.*
- **FR-028**: The build MUST derive the video id from the recording address, or check a given id against it, and stop with a clear message on a mismatch or an unusable address. In draft builds, a missing recording address or note MUST be listed as a missing item; release builds MUST fail while one is missing, as with other editorial items.
- **FR-029**: Each note MUST be two to four sentences, give that song's own reason for being there (significance, change of era, how it spread, what made it a hit, or the Budapest milieu it evokes), avoid generic filler, and MUST NOT claim without evidence that residents of Dembinszky utca 18. listened to it.
- **FR-030**: The first release MUST contain the eight songs in the table above. Read in order, their notes MUST let the visitor sense the arc magyar nóta → operett → pesti városi sláger → gramofon and international spread → film and radio → single → television → beat, without a separate explanatory essay.
- **FR-031**: Music entries MUST be editable in a plain, version-controlled content file without touching code, and the README MUST describe how to add or change one.

### Out of scope

Playlists, next/previous buttons, shuffle, automatic song change, background music, autoplay, self-hosted audio, Spotify or other services, images on music cards, and per-song visual variants.

### Key Entities

- **Music entry**: one song placed on the timeline. Attributes: year (the year its note is about), title, performer, optional composer, note (2–4 sentences), recording address, video id (derived or checked), optional sources (title and address each), anchor (derived from year and title). No image attributes.
- **Player state**: which music entry is loaded (none or one) and whether it is playing, paused or failed. Determines the state of every card's button.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The home page shows exactly eight music cards, one per song in the table above, each in its era and in year order, and all eight are identical in layout when their text is ignored.
- **SC-002**: A visitor can start a song in one tap or click, and the song starts within 3 seconds on a typical 4G connection.
- **SC-003**: On first page load the browser makes zero requests to the video service and the page contains zero embedded videos; after any sequence of plays and song changes there is never more than one.
- **SC-004**: At any moment while the player is visible, the year of the loaded song is readable in it at 360 px, 768 px and 1280 px widths.
- **SC-005**: Every music-layer function (play, pause, resume, switch, jump to card, open externally, close) can be completed with the keyboard alone.
- **SC-006**: The home page keeps its current Lighthouse scores and every constitution budget (Principle II), with no new layout shift on first load and none when the player opens or closes; the site's own JavaScript stays within 20 KB compressed.
- **SC-007**: With the player open, the last event, the closing section and the footer can all be scrolled fully into view, uncovered, at 360 px and 1280 px widths.
- **SC-008**: A recording made unplayable shows the fallback message within 5 seconds of pressing „Meghallgatom”, and the rest of the page keeps working.

## Assumptions

- The music layer is on the home page timeline only; the other pages do not change, apart from the README, the Impresszum's data-handling section and the constitution amendment (FR-025).
- Where the request names a composer rather than a performer (Fráter Lóránd, Kacsóh Pongrác, Kálmán Imre, Zerkovitz Béla), that name is the composer, and the performer is the artist of the chosen recording, decided when the recording is picked. For „Szomorú vasárnap” the performer is Kalmár Pál and the composer Seress Rezső.
- The recordings, notes and sources are written and checked editorially; the spec does not fix which recording of each song is used. A period recording is preferred where one is available.
- A music card sits after the last event of its year in the same era, or, if its year has no event, between the events of the years around it.
- Without JavaScript the card's main button cannot work, so a plain external link replaces it (see Edge Cases). This follows the constitution's Static HTML First principle; it is the one case where the card names the video service.
- Analytics (FR-026) reuses the existing consent-gated statistics service and is optional for the first release.
- The video embed's consent (FR-025) is separate from the statistics consent notice, which is unchanged.
