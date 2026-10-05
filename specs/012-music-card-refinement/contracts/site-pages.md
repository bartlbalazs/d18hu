# Contract: built pages (music card refinement)

This replaces the **Cards** section of [011's contract](../011-timeline-music-layer/contracts/site-pages.md). The player-shell, „Unchanged”, Jelmagyarázat and Impresszum sections of 011 still apply, with the additions below. Markup names are the contract; styling is checked in the quickstart.

## Home page (`dist/index.html`)

### Cards

- Each card is still an `li.event.event--music` with an `id` equal to its `data-music-id`, `data-category="area"`, no `data-event-id`, and the 011 placement and count.
- Its children, in order:
  1. `p.event__date` > `time[datetime="<year>"]` with the text `<year>`
  2. `span.event__node` with the note icon
  3. `article.event__body.music`, with the class `music--with-media` only when the entry has `media`
- Inside the article, in this order. Optional parts are skipped:
  1. `p.music__kicker.kicker`: an `aria-hidden` note icon and the text „Mit hallgatott Budapest?”, with **no** digits
  2. `h4.music__title`
  3. `p.music__credit`
  4. `div.music__media`, only with media (see below)
  5. `p.music__text`
  6. `p.music__recording`, only with a recording: the text equals `recording.primary`, then `span.music__recording-detail` equal to `recording.secondary`
  7. `p.music__actions`: the 011 button and no-JS link
  8. `details.music__sources`, without the `open` attribute:
     - `summary`: „Források · N”, where N is the number of source links, or „Források” when N = 0
     - then the `p.event__sources` links
     - `p.music__recording-note` when there is a recording note
     - `p.music__media-credit` when there is media
- The card body outside `details`:
  - contains no `recording_relation` value
  - contains no `recording_note` text
  - contains the word „YouTube” only in `a.music__external`
- The button:
  - shows „▷ Meghallgatom”: the ▷ in the `aria-hidden` `span.music__play-symbol`
  - its accessible name is „Meghallgatom – <title>”
  - it carries the 011 `data-music-*` attributes plus `data-music-credit="<credit>"`
- Without media: the card has no `<img>`, `<picture>` or `srcset`, and no `ytimg.com` or `youtube.com` image URL (011 kept).
- All eight cards are identical once text and attribute values are removed. Two cards that differ only in having media differ only by the `music--with-media` class, the `div.music__media` and the `p.music__media-credit`.

### Media (whenever a card has `music--with-media`)

- `div.music__media` has `style="--music-image-position: <position>"` when a position is set, and holds one `<picture>`:
  - `<source>` elements for AVIF and WebP, each with a `srcset`
  - an `img` with `loading="lazy"`, `decoding="async"`, numeric `width` and `height`, and `sizes`
  - `alt` equal to `media.alt`, or `alt=""` when `decorative`
- There is no `a` around the image and no `figcaption`.
- `p.music__media-credit` contains the credit and the licence, plus a link to `source_url` when one is set.
- JSON-LD contains an `ImageObject` with `url` ending in `/#<anchor>`, plus `creditText`, `license` and `acquireLicensePage` when they are set.

### Player shell (addition to 011)

- `p.music-player__credit[data-music-player-credit]` sits between `.music-player__title` and `.music-player__artist`.

## Library contract (`src/lib/timeline/music.ts`, unit tests)

| Function | Contract |
|---|---|
| `recordingLines(item)` | Returns the eight rows of research R4 for the current data. Uses `recording_year`; for a `periodYear` relation it falls back to the song year; otherwise it shows no year |
| `buildMusicEntries(raw)` | Also throws, naming the anchor, for a `recording_relation` missing from `RECORDING_RELATIONS`. It sets `recording` only with a `youtubeId`, and `media` only with a `media` block |
| `musicMediaSchema` | Accepts the data-model example. Rejects a path or uppercase in `src`, an extension other than jpg/jpeg/png/webp, a `position` not of the form `NN% NN%`, an `http:` `source_url`, and unknown keys |
| `auditEditorial(…, music)` | Reports `media.alt` (missing or generic, unless `decorative`), `media.credit` and `media.license` |
| `musicImageMetadata(file)` | Returns the image for a file in `src/assets/music/` and throws for any other |
