# Research: Timeline music layer

All Technical Context unknowns are resolved below. The decisions build on the existing scope slider (`specs/010-timeline-scope-slider/`) and the consent handling in `src/scripts/statistics.ts`.

## R1. Where music entries live

**Decision**: A new file, `editorial/music.yaml`, holds a list of songs. It is validated by a new `musicEditorialSchema` in `src/lib/editorial/schema.ts`. `loadSiteData()` reads it, and a new pure module, `src/lib/timeline/music.ts`, turns each entry into a `MusicEntry` and places it in an era.

**Rationale**: The research file `input/timeline.md` is published word for word and holds only researched events. Songs are editorial content with their own fields. A separate YAML file keeps both editable without code (FR-031), like `events.yaml`. Each list item keeps the shape from the request (`type: music`, `year`, `title`, `artist`, …).

**Alternatives considered**:
- Rows in `input/timeline.md`: rejected. Its seven columns don't fit the fields, and the research file would mix in non-research content.
- An `events.yaml` section: rejected, because that file is keyed by event id and every key must match a timeline row.

## R2. Schema: required, optional and forbidden fields

**Decision**: `z.strictObject` with:
- `type: 'music'`, optional (it defaults to music)
- `year`: an integer from 1873 to 1968
- `title` and `artist`: required non-empty strings
- `composer`: optional
- `description`: a string, defaulting to empty
- `descriptionNeedsReview`: an optional boolean
- `youtube_url`: a string, defaulting to empty
- `youtube_id`: optional
- `sources`: an optional list of `{ title, url }`, where `url` is https

Because the object is strict, `image_url`, `image_alt`, `thumbnail`, `cover` or any other unknown key stops the build (FR-027).

An empty `description` or `youtube_url`, or a `descriptionNeedsReview: true`, becomes a missing editorial item. A draft build lists it, and a release build fails on it (FR-028). This works through `auditEditorial`, with a new `scope: 'music'`.

**Rationale**: This matches the existing editorial pattern: structural errors throw in every mode, and missing content blocks only releases. `descriptionNeedsReview` mirrors `titleNeedsReview`, so AI-drafted notes can't ship unreviewed (FR-029).

## R3. Video id from the URL

**Decision**: `youtubeIdFrom(url)` in `music.ts` accepts these forms, and only on the `youtube.com`, `m.youtube.com`, `music.youtube.com`, `youtu.be` and `youtube-nocookie.com` hosts:
- `https://www.youtube.com/watch?v=ID`
- `https://youtu.be/ID`
- `/embed/ID`
- `/shorts/ID`
- `/live/ID`

The id must match `^[A-Za-z0-9_-]{11}$`. If `youtube_id` is given, it must equal the derived id. A mismatch, an unrecognised URL or a duplicate id stops the build with the entry's anchor. Nothing is fetched.

**Rationale**: FR-028. Regular builds never touch the network (README).

## R4. Placement in the timeline

**Decision**: The era is the one whose span contains `year`. A year outside every era is a build error.

Within the era, the card goes after the last event whose start year (`sortStart`, or the first four digits of `dateLabel` when `sortStart` is missing) is less than or equal to `year`. If no event qualifies, it goes first. Two songs in the same year keep their file order.

`Era` gains `items: (TimelineEvent | MusicEntry)[]` for rendering. `era.events` stays events only, so the era counts and JSON-LD don't change (FR-008).

**Rationale**: This matches the spec's placement assumption. Events within an era are in source (date) order, so a single scan works.

## R5. Markup: a timeline row, not an event

**Decision**: A music card is an `<li class="event event--music" id="zene-…" data-music-id="zene-…" data-category="area">` inside the era's `<ol class="timeline">`, rendered by a new `MusicEntry.astro` component.

It reuses the row grid: the axis line comes from `.event::before`, and the node holds the shared note icon (lucide `music`). It has no date column. The year is in the card's kicker, as the spec's order requires: „Mit hallgatott Budapest? · 1935”.

It has **no** `data-event-id`, so:
- the site tests' event list and counts stay exact
- statistics source clicks don't treat it as an event
- the JSON-LD stays events only

The card's heading is an `h4` with the title. The performer is a `p`, and the composer, when given, is in a smaller line: „Szerző: Seress Rezső”. Sources are listed as on events.

**Rationale**: As a timeline row, the card shares the axis and the reading position logic. A separate `.event--music` class lets the card be lighter (FR-006) without touching the event variants.

## R6. Scope slider: music rides with Környék

**Decision**: The scope CSS in `timeline.css` adds `.event--music` wherever Környék is hidden or listed:
- it is hidden at `house`
- it is included in the `:nth-last-child(1 of …)` axis-end lists for `area` and `hungary`

`data-category="area"` lets `revealLinkedEvent()` in `timeline-scope.ts` widen to Környék for a `#zene-…` link, with no code change. The scope announcement counts only non-music rows: `.event:not(.event--music)`.

**Rationale**: FR-010 (clarified as from Környék up). This reuses the existing mechanism, so nothing flashes.

## R7. "Meghallgatom" without JavaScript

**Decision**: Each card renders both:
- a `<button type="button" class="music__play">▶ Meghallgatom</button>`
- an `<a class="music__external" href="{youtube_url}">YouTube ↗</a>`

CSS shows the button only under `html[data-scope]`, which the scope slider's inline script sets before first paint, and the link otherwise. No script toggles them, so there is no layout shift.

**Rationale**: Constitution I and the spec's no-JS edge case. Reusing `data-scope` as the "JS is running" signal avoids a second inline script. A comment in the CSS records this dependency.

**Alternatives considered**: A `<noscript>` link plus a `hidden` button revealed by the module script. Rejected: the button would appear after load and shift the layout.

## R8. Embed mechanism: one iframe, postMessage, no API script

**Decision**: On the first „Meghallgatom” press, `music-player.ts` creates one iframe:

```text
https://www.youtube-nocookie.com/embed/{id}?enablejsapi=1&autoplay=1&playsinline=1&rel=0&origin={location.origin}
```

with:
- `allow="autoplay; encrypted-media; picture-in-picture"`
- `referrerpolicy="strict-origin-when-cross-origin"`
- a `title` naming the song

Playing another song loads it into the same iframe by setting a new `src`, so there is never a second iframe (FR-012). Play and pause go through the player's postMessage commands (`playVideo`, `pauseVideo`). State comes from the player's `onReady`, `onStateChange` and `onError` messages, after a `{"event":"listening"}` handshake. YouTube's own controls stay on (`controls` default).

**Rationale**:
- The official IFrame Player API script loads from `www.youtube.com`, a second, non-privacy-enhanced host. The constitution exception (v1.4.0) allows only the embed itself, and FR-023 says no unneeded API script. The postMessage protocol is what that script uses internally, so it costs about 1 KB of our own code instead of a third-party script.
- The referrer policy is required: YouTube rejects embeds without an HTTP Referer (error 153). The site's header already uses the same policy.
- Risk: the postMessage protocol isn't documented as a public API. If it ever stops answering, playback still works through YouTube's own controls in the visible player, and only our sync degrades. The quickstart checks it.

**Alternatives considered**:
- The IFrame API script: rejected (above).
- Switching with the `loadVideoById` command: tried first, and rejected during implementation. In Chromium the new song stayed "unstarted", and a recording that can't be embedded sent no `onError`, so the fallback never showed. A fresh `src` load in the same iframe starts on its own and reports errors reliably.

## R9. Player size: YouTube's minimum viewport

**Decision**: The video area is at least **200 × 200 px**, as YouTube's Required Minimum Functionality rules require. On wide screens it is 356 × 200 (16:9) at the start of the panel, with the year, title, performer and controls beside it. On narrow screens it is full width × 200 px under the text lines, with the controls in one row below.

Nothing is placed over the iframe. The player is never shrunk below that size or moved off screen while a song plays.

The year, title and performer keep visual priority through type size and position (first in reading order, the year largest), not by making the video tiny.

**Rationale**: The rules say embedded players must have a viewport of at least 200 × 200 px and must not be covered by overlays. A thumbnail-sized or hidden "audio-only" player would break the provider's terms. This makes the narrow-screen panel about 340 px tall: still one panel, but less compact than the request imagined. It is flagged in the plan for the owner.

## R10. Autoplay and mobile Safari

**Decision**: `autoplay=1` is set only on the iframe created by the press, and `playVideo` is sent only after a press. Nothing reacts to scrolling (FR-020).

If the player reports ready but not playing within 3 s, which happens when a browser such as iOS Safari refuses unmuted playback without a tap inside the frame, the state becomes **paused**: the card shows „▶ Folytatás” and the player shows its play button. The visitor can then start the song with the player's own big play button, which is visible.

**Rationale**: Chrome and Firefox let a cross-origin iframe with `allow="autoplay"` play after a press in the parent page. iOS doesn't reliably, and showing „Most szól” for silence would be wrong.

## R11. Errors and unreachable service

**Decision**:
- `onError` codes 2, 5, 100, 101 and 150 (invalid, deleted, private, not embeddable) switch the player to the fallback: „Ez a felvétel jelenleg nem játszható le itt.” plus „YouTube ↗”. The card returns to „▶ Meghallgatom”.
- If no `onReady` arrives within 5 s of creating the iframe or loading a song (blocked by an extension, offline), the same fallback shows (SC-008).
- If a later message arrives anyway, the player recovers.

## R12. Bottom space and other fixed parts

**Decision**: `music-player.ts` measures the player with a `ResizeObserver`, sets `--music-player-height` on `<html>`, and toggles `body.music-player-visible`.

The consent notice today sets `body.style.paddingBottom` inline. `statistics.ts` changes to set `--consent-notice-height` instead. One CSS rule then adds both:

```text
body { padding-bottom: calc(var(--consent-notice-height, 0px) + var(--music-player-height, 0px)) }
```

with the player variable applied only under `.music-player-visible`. The player sits at `bottom: var(--consent-notice-height, 0px)`, so it never covers the notice.

On narrow screens the scope toggle moves up by `--music-player-height`. The mobile menu (top layer) and PhotoSwipe already stack above the player (player `z-index: 8`). The audio keeps playing under them.

**Rationale**: FR-019 and the edge cases. A single sum avoids two scripts fighting over one inline style.

## R13. Jump to the song

**Decision**: `scrollIntoView({ block: 'start', behavior })` on the card, with `behavior` `smooth` unless the visitor prefers reduced motion. The `.event` rows already have a `scroll-margin-top` for the header. The card then gets `.music--highlight` for 1.6 s, a soft background and outline animation, or a static outline under reduced motion. The URL hash is updated with `history.replaceState`, so the address can be shared without the browser jumping (FR-017, FR-007).

If the slider is at Ház when the jump is pressed, the jump first widens it. It does this by dispatching `hashchange` after `replaceState`, which `timeline-scope.ts` already handles.

## R14. Accessibility details

**Decision**:
- **Label wording**: the jump label's suffix follows the spoken last number word („1935-ös”, „1968-as”, „1916-os”).
- **Card button**: its visible text changes with the state. Its accessible name is that text plus the title, as visually hidden text: „Meghallgatom – Szomorú vasárnap”, „Most szól – …”, „Folytatás – …”. It gets a min-width so the three labels don't shift the layout.
  - The spec's example labels („Szomorú vasárnap lejátszása”) would replace the visible words. That fails WCAG 2.5.3 (Label in Name): a speech-input user saying „Meghallgatom” couldn't reach the button. The same goes for the jump button.
- **Player**: a `<section aria-label="Zenelejátszó">` holding:
  - a polite live region („Most szól: Szomorú vasárnap, 1935”)
  - play/pause (`aria-label` with the title)
  - „↑ Ugrás a dalhoz”, plus hidden text („– vissza az 1935-ös zenei bejegyzéshez”); on narrow screens the visible part is „↑ Timeline”
  - „YouTube ↗” (`rel="noopener noreferrer"`, `target="_blank"`)
  - × („Zenelejátszó bezárása”)
- **Focus**: it stays on the pressed card button. After ×, it returns to the last played card's button.
- **Size**: every control is at least 44 × 44 px (FR-022).

## R15. Statistics events

**Decision**: `music-player.ts` dispatches `d18:music` DOM events with `{ name, params: { year, title, artist, youtube_id } }`. The names are `music_play`, `music_pause`, `music_change`, `music_close`, `music_jump_to_timeline` and `music_open_youtube`.

`statistics.ts` forwards them to `gtag` only while consent is granted (FR-026). A click on the player's „YouTube ↗” link isn't also sent as `archive_source_click`: `statisticsEventFor` skips links inside `[data-music-player]`. The card's no-JS link and its sources stay ordinary archive-source clicks, attributed through `[data-music-id]`.

**Rationale**: The player stays independent of consent, and statistics stays the only code that talks to `gtag`.

## R16. JavaScript cost

**Estimate**: `music-player.ts` is about 2.2 KB gzipped (state machine, iframe and postMessage, layout variables, events). `statistics.ts` grows by about 0.2 KB. It loads as a module on the home page only, and does nothing until the first press.

The site-wide total goes from about 27.7 KB to about 30 KB, against the 20 KB cap. The plan's Complexity Tracking records this, as for the slider. The YouTube player's own scripts run inside its iframe and don't count (constitution v1.4.0).

## R17. Impresszum and Jelmagyarázat wording

**Decision**: The Impresszum's data-handling section gains a paragraph:

> „A nyitóoldal »Mit hallgatott Budapest?« bejegyzéseinél a »Meghallgatom« gomb megnyomása után a felvétel a YouTube adatvédelmi módban működő lejátszójából (youtube-nocookie.com) töltődik be; addig az oldal nem kapcsolódik a YouTube-hoz. A lejátszó a YouTube adatkezelési szabályai szerint működik.”

The Jelmagyarázat gains a small group of its own, headed „Mit hallgatott Budapest?” and placed before the slider group. It is not one of the story's scales, so it doesn't go in „A történet léptékei”. It shows the note icon and this text:

> „Mit hallgatott Budapest? – Rövid zenei kitérő: egy dal, amelyet a korszak Budapestje hallhatott. Nem azt jelenti, hogy a 18-as ház lakói bizonyosan ezt hallgatták.”

The scope description sentence notes that music entries show from Környék up. The final wording is reviewed by the owner during implementation.
