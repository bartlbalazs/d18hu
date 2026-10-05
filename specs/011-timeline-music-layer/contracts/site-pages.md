# Contract: built pages (music layer)

These are the checks `tests/site/output.test.ts` makes on `dist/` after a build, plus the unit-tested library contract. Markup names are the contract; styling is not.

## Home page (`dist/index.html`)

### Cards

- Exactly one `li.event.event--music` per entry in `editorial/music.yaml`. With the first release that is **8**.
- Each card:
  - `id` equal to `data-music-id`, of the form `zene-<year>-<slug>`, unique on the page
  - `data-category="area"` and no `data-event-id`
  - placed inside the `ol.timeline` of the era whose span contains its year
  - placed after the last event of that era with a start year ≤ its year (R4)
- Text in this order inside the card: the note icon (`svg.icon` inside `.event__node`), `.music__kicker` reading „Mit hallgatott Budapest? · <year>”, `h4.music__title`, `.music__credit`, `.music__text`, optional sources, `.music__recording` (the recording note), then `.music__actions`.
- The play button's `data-music-artist` is the `recording_artist`, which the player shows.
- The card contains no `<img>`, `<picture>`, `<iframe>`, `<video>`, `srcset` or any `ytimg.com` / `youtube.com` image URL.
- `.music__actions` holds:
  - one `button.music__play[type=button]` showing „▶ Meghallgatom” (the ▶ in an `aria-hidden` span), with no „YouTube” anywhere in it, and `data-music-*` attributes for year, title, artist, youtube-id and youtube-url
    - its accessible name is the visible label plus visually hidden text: „Meghallgatom – <title>”
  - one `a.music__external` with `href` equal to the entry's `youtube_url` and text „YouTube ↗”. It is the no-JS fallback, hidden by CSS when JS runs.
- All eight cards produce identical markup apart from text, attributes carrying content, and `id`s. The test compares them with the text and attribute values removed.

### Player shell

- Exactly one `section.music-player[data-music-player][hidden]` with `aria-label="Zenelejátszó"`. It holds:
  - the note icon
  - `.music-player__year`, `.music-player__category`, `.music-player__title`, `.music-player__artist`
  - an empty `.music-player__video`
  - a play/pause button, a „↑ Ugrás a dalhoz” button (its hidden text names the card's year), an `a` „YouTube ↗” with `target="_blank"` and `rel="noopener noreferrer"`, and a × button `aria-label="Zenelejátszó bezárása"`
  - a polite live region
  - the fallback text „Ez a felvétel jelenleg nem játszható le itt.”, hidden
- The static HTML contains **no** `<iframe>`, no `youtube-nocookie.com/embed` URL other than as a string in the bundled script, and no `<script src>` pointing to any YouTube host.

### Unchanged

- The `data-event-id` list still equals the timeline's events in source order.
- Era counts (`[data-scope-count]`) still equal `scopeCounts(era.events)`, so music is not counted.
- JSON-LD has no node for any music entry.
- html-validate and linkinator pass, with `#zene-…` fragments resolving.

### Jelmagyarázat

- `.legend` contains a group headed „Mit hallgatott Budapest?” with the note icon. Its text says the entries do not mean the residents of no. 18 listened to the songs.

## Impresszum (`dist/impresszum/index.html`)

- The data-handling section mentions `youtube-nocookie.com` and that nothing loads before „Meghallgatom” is pressed.

## Library contract (`src/lib/timeline/music.ts`, unit tests)

| Function | Contract |
|---|---|
| `youtubeIdFrom(url)` | Returns the 11-character id for the URL forms in R3. Returns `undefined` for any other host, path or id shape |
| `musicAnchor(year, title)` | `zene-<year>-<slug>`. Example: (1935, „Szomorú vasárnap”) → `zene-1935-szomoru-vasarnap` |
| `eraForYear(year)` | 1901 → `1873-1913`, 1916 → `1914-1938`, 1942 → `1939-1945`, 1968 → `1946-1968`. Throws for 1872 or 1969 |
| `buildMusicEntries(raw)` | Throws on an id mismatch, a bad URL, a duplicate anchor or a duplicate video id. Returns entries with `era` and `youtubeId` set |
| `mergeIntoEra(events, music)` | Inserts each entry after the last event with a start year ≤ its year, or first if none. Keeps file order for equal years. Leaves the events in their order |
| `auditEditorial(…, music)` | Reports an empty description, `descriptionNeedsReview` and an empty `youtube_url` as `scope: 'music'` |
| `statisticsEventFor(link)` | Returns `null` for a link inside the music player. `musicStatisticsEvent` passes the six `music_*` names through with `year`, `title`, `artist` and `youtube_id` |

## Browser contract (manual, see quickstart)

| Trigger | Result |
|---|---|
| Page load | No request to any YouTube host. The player is hidden. |
| First „Meghallgatom” | One iframe to `https://www.youtube-nocookie.com/embed/<id>?enablejsapi=1&…`. The player is visible and `body.music-player-visible` is set. |
| Other card | Still one iframe. The previous card resets and the new card shows „♫ Most szól”. |
| × | No iframe. The player is hidden and every card reads „▶ Meghallgatom”. |
| Scrolling | Never creates, changes or removes the iframe. |
