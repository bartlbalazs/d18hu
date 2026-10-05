---

description: "Task list for the timeline music layer"
---

# Tasks: Timeline music layer

**Input**: Design documents from `/specs/011-timeline-music-layer/`

**Prerequisites**: plan.md, spec.md, research.md (R1–R17), data-model.md, contracts/site-pages.md, quickstart.md

**Tests**: The plan asks for unit tests of the pure music logic, the audit and the statistics mapping, and for site tests of the built markup (contracts/site-pages.md). Browser behaviour is checked by hand from quickstart.md, because the project has no browser test runner.

**Run tools with Node 22 through Corepack**: `pnpm` is `corepack pnpm`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**:
  - US1 = recognisable music cards
  - US2 = play without leaving the page
  - US3 = switch songs and close
  - US4 = jump back to the card
  - US5 = player on a phone

---

## Phase 1: Setup

- [X] T001 [P] Create `editorial/music.yaml` with the eight songs from spec.md, as a YAML list in year order. Each item has `type: music`, `year`, `title` and `artist`; set `composer` where known.
  - Each `description` is a drafted 2–4 sentence note following FR-029: the song's own reason, no generic filler, no claim about residents of no. 18. Each draft carries `descriptionNeedsReview: true`.
  - Leave `youtube_url: ''` unless a recording has been chosen and checked by hand.
  - Where the spec names a composer (Fráter Lóránd, Kacsóh Pongrác, Kálmán Imre, Zerkovitz Béla), put that name in `composer`, and put a placeholder-free performer in `artist` only if known. Otherwise use the composer's name there, with a YAML comment `# előadó: a választott felvétel szerint` for the owner.
  - For 1935: `artist: Kalmár Pál`, `composer: Seress Rezső`.
  - For 1916, the note says it refers to the Budapest premiere (spec: "több évhez kapcsolódó dal").
- [X] T002 [P] Add the lucide icons `Music`, `Play`, `Pause`, `ArrowUp` and `X` to `src/lib/icons.ts`, imported from `lucide-static` and wrapped with the existing `decorative()`. Export them as `icons.music`, `icons.play`, `icons.pause`, `icons.arrowUp` and `icons.close`.

---

## Phase 2: Foundational (content pipeline)

**⚠️ No story work can begin until this phase is complete.**

- [X] T003 Add `musicEditorialSchema` to `src/lib/editorial/schema.ts`. It is `z.array(z.strictObject({ … }))` with:
  - `type: z.literal('music').default('music')`
  - `year: z.number().int().min(1873).max(1968)`
  - `title: z.string().min(1)` and `artist: z.string().min(1)`
  - `composer: z.string().optional()`
  - `description: z.string().default('')`
  - `descriptionNeedsReview: z.boolean().optional()`
  - `youtube_url: z.string().default('')`, which must be `''` or match `httpsUrl`
  - `youtube_id: z.string().optional()`
  - `sources: z.array(z.strictObject({ title: z.string(), url: httpsUrl })).default([])`

  Export the types `MusicEditorial` and `MusicEditorialItem`. The object stays strict, so `image_url`, `image_alt`, `thumbnail`, `cover` and other unknown keys fail validation (FR-027).
- [X] T004 Create `src/lib/timeline/music.ts` (data-model.md "MusicEntry", research R3/R4):
  - **`export type MusicEntry`**: `kind: 'music'`, `anchor`, `era: EraId`, `year`, `title`, `artist`, `composer?`, `description`, `descriptionNeedsReview`, `sources: SourceLink[]` (from `{title,url}` → `{label,url}`), `youtubeUrl`, `youtubeId`.
  - **`youtubeIdFrom(url): string | undefined`**:
    - accepted hosts: `youtube.com`, `www.youtube.com`, `m.youtube.com`, `music.youtube.com`, `youtu.be`, `www.youtube-nocookie.com` and `youtube-nocookie.com`
    - accepted forms: `watch?v=`, `youtu.be/<id>`, `/embed/<id>`, `/shorts/<id>`, `/live/<id>`
    - the id must match `^[A-Za-z0-9_-]{11}$`
  - **`musicAnchor(year, title)`**: returns `zene-${year}-${slug}`, with the slug built by the slug helper from `src/lib/timeline/ids.ts`. Export one from there if it's private. Example: `zene-1935-szomoru-vasarnap`.
  - **`eraForYear(year)`**: uses the spans encoded in `ERA_IDS` (`'1873-1913'` → 1873–1913, …). It throws for a year outside every era.
  - **`buildMusicEntries(items)`**: maps the items. It throws one `Error` listing every problem by anchor: an unrecognised non-empty `youtube_url`, a `youtube_id` that differs from the derived id, a duplicate anchor or a duplicate video id.
  - **`mergeIntoEra(events, music)`**:
    - returns `(TimelineEvent | MusicEntry)[]`
    - inserts each entry after the last event whose start year is ≤ the entry's year, or first if none qualifies
    - the start year is `Number(sortStart.slice(0, 4))`, or the first `\d{4}` in `dateLabel` when `sortStart` is missing
    - entries with equal years keep their input order
- [X] T005 [P] Write `tests/unit/music.test.ts` against contracts/site-pages.md "Library contract":
  - `youtubeIdFrom` for each accepted URL form, plus rejection of other hosts, bad ids and `youtube.com/channel/...`
  - `musicAnchor(1935, 'Szomorú vasárnap')` → `zene-1935-szomoru-vasarnap`
  - `eraForYear` for 1901, 1916, 1942 and 1968, and throwing for 1872 and 1969
  - `buildMusicEntries` throwing on an id mismatch, a duplicate anchor and a duplicate id
  - `mergeIntoEra` placement: before all events, between events, after all events, the same year as an event (goes after it), two songs in one year (file order) and an event without `sortStart`
  - a schema test that `image_url`, `thumbnail` and `cover` are rejected
- [X] T006 Extend `src/lib/editorial/audit.ts`:
  - `MissingItem['scope']` gains `'music'`
  - `auditEditorial(events, site, music: MusicEntry[] = [])` adds, per entry with `id: entry.anchor`:
    - `field: 'description'`, `message: 'no note'`, when `isMissingValue(description)`
    - `message: 'AI-drafted note not yet reviewed'`, when `descriptionNeedsReview`
    - `field: 'youtube_url'`, `message: 'no recording'`, when `isMissingValue(youtubeUrl)`
  - `formatMissingItems` prints `music <anchor>` for this scope
- [X] T007 [P] Add music audit cases to `tests/unit/editorial.test.ts`: an empty note, a note needing review, an empty recording, and a complete entry with no items.
- [X] T008 Update `src/lib/site-data.ts`:
  - `MUSIC_EDITORIAL_PATH = 'editorial/music.yaml'`
  - parse it with `musicEditorialSchema` (a missing or empty file means `[]`)
  - `music = buildMusicEntries(...)`
  - pass `music` to `auditEditorial`
  - `Era` gains `items: (TimelineEvent | MusicEntry)[]`, built with `mergeIntoEra(eraEvents, music.filter(m => m.era === era.id))`
  - `SiteData` gains `music: MusicEntry[]`
  - `era.events` stays events only (FR-008)

**Checkpoint**: `pnpm test` and `pnpm build:draft` pass. The draft build lists eight `music zene-…` items: notes to review and recordings.

---

## Phase 3: User Story 1 – Recognise a music stop (Priority: P1) 🎯 MVP

**Goal**: Eight identical, image-free cards in the timeline, riding with Környék, plus the Jelmagyarázat note.

**Independent Test**: quickstart 1, 2 and 14. `pnpm test:site` passes the "Cards" and "Jelmagyarázat" parts of contracts/site-pages.md.

- [X] T009 [US1] Create `src/components/MusicEntry.astro` (props `{ entry: MusicEntry }`, research R5/R7/R14). Render:
  - **the row**: `<li class="event event--music" id={anchor} data-music-id={anchor} data-category="area">`, with no `data-event-id` and no date column
  - **the node**: `<span class="event__node" set:html={icons.music} />`
  - **the body**: `<article class="event__body music" aria-labelledby={`${anchor}-cim`}>` containing:
    - `<p class="music__kicker kicker">Mit hallgatott Budapest? · <time datetime={year}>{year}</time></p>`
    - `<h4 class="music__title" id={`${anchor}-cim`}>{title}</h4>`
    - `<p class="music__artist">{artist}</p>`
    - when `composer` is set and differs from `artist`: `<p class="music__composer">Szerző: {composer}</p>`
    - `<p class="music__text">{description}</p>`
    - the sources as `p.event__sources`, as in `TimelineEvent.astro`
  - **the actions** (only when `youtubeId` is set): `<p class="music__actions">` with:
    - `<button type="button" class="music__play" data-music-year data-music-title data-music-artist data-music-youtube-id data-music-youtube-url aria-label={`${title} lejátszása`}><span class="music__play-label">▶ Meghallgatom</span></button>`
    - `<a class="music__external" href={youtubeUrl} rel="noopener noreferrer">YouTube <span aria-hidden="true">↗</span></a>`

  The card has no images.
- [X] T010 [US1] Update `src/pages/index.astro` to render `era.items`, using `item.kind === 'music' ? <MusicEntry entry={item} /> : <TimelineEvent event={item} />`. The era counts keep using `era.events`.
- [X] T011 [US1] Add the card styles to `src/styles/timeline.css`, in a new "Music layer" block:
  - `.event--music` drops the date column and has a quieter body: no card shadow, a thin dashed or hairline border in an existing muted token, smaller padding and the body type size. `.event--music .event__node` is a smaller muted node.
  - `.music__kicker` uses the existing kicker style.
  - `.music__title` is one step below `.event__title`.
  - `.music__play` is at least 44 px tall, with `min-width` set in `ch` so its three labels don't shift the layout, and the existing focus ring.
  - Hover, focus and `[data-state="playing"]`/`[data-state="paused"]` styles are identical for every card.
  - `.music__external` is shown and `.music__play` hidden by default. Under `html[data-scope]` (set by `ScopeSlider.astro`'s inline script, so it means "JS runs"; add a comment saying so) it is the reverse.
- [X] T012 [US1] In the timeline scope block of `src/styles/timeline.css`, add `.event--music` to `html[data-scope="house"] .event:not(.event--house)`, which already hides it. Check that and leave it as is. Add `.event--music` to the `:nth-last-child(1 of …)` lists for `area` and `hungary`, so the axis ends correctly when a music card is last (research R6).
- [X] T013 [US1] In `src/scripts/timeline-scope.ts`, change the announced count to count only `.event:not(.event--music)` rows. Collect them once, next to `events`, and keep `events` for the reading anchor.
- [X] T014 [P] [US1] In `src/components/Legend.astro`, add a `legend__group` headed „Mit hallgatott Budapest?” before the scope group, with `icons.music` and the text from research R17. At the end of the scope group's paragraph, add that the zenei bejegyzések appear from Környék up.
- [X] T015 [US1] Extend `tests/site/output.test.ts` with the "Cards", "Unchanged" and "Jelmagyarázat" checks of contracts/site-pages.md:
  - the count equals the `editorial/music.yaml` length
  - ids are `zene-…`, unique and equal to `data-music-id`
  - each card is in its era's `ol`, in the expected position (`mergeIntoEra`)
  - the text order
  - no `img`, `picture`, `iframe`, `video`, `srcset` or `ytimg`
  - the button text is exactly „▶ Meghallgatom” without „YouTube”
  - the external link `href` matches
  - markup is identical across cards once text and attribute values are stripped
  - the `data-event-id` list is unchanged
  - era counts are unchanged
  - no JSON-LD node mentions a music title
  - the legend group exists

**Checkpoint**: The cards are visible and correct, and without JS they link out. This is the MVP.

---

## Phase 4: User Story 2 – Play a song without leaving the page (Priority: P1)

**Goal**: The first „Meghallgatom” press creates the one player and plays the song, with the card and the player in sync.

**Independent Test**: quickstart 1, 3, 4, 6, 8, 13 and 16.

- [X] T016 [US2] Create `src/components/MusicPlayer.astro`: one hidden shell, `<section class="music-player" data-music-player hidden aria-label="Zenelejátszó">`, containing:
  - `.music-player__info`:
    - `<p class="music-player__meta">` with `icons.music`, `<span class="music-player__year">`, ` · ` and `<span class="music-player__category">Mit hallgatott Budapest?</span>`
    - `<p class="music-player__title">`
    - `<p class="music-player__artist">`
  - `.music-player__video`, empty
  - `<p class="music-player__error" hidden>Ez a felvétel jelenleg nem játszható le itt.</p>`
  - `.music-player__controls`:
    - `<button type="button" class="music-player__toggle" data-music-toggle>` with the play and pause icons and a visually hidden label
    - `<button type="button" class="music-player__jump" data-music-jump>↑ <span class="music-player__jump-long">Ugrás a dalhoz</span><span class="music-player__jump-short">Timeline</span></button>`
    - `<a class="music-player__external" data-music-external target="_blank" rel="noopener noreferrer">YouTube <span aria-hidden="true">↗</span></a>`
    - `<button type="button" class="music-player__close" data-music-close aria-label="Zenelejátszó bezárása">` with `icons.close`
  - `<p class="visually-hidden" aria-live="polite" data-music-status>`
  - `<script>import '../scripts/music-player.ts';</script>`

  Add `<MusicPlayer />` to `src/pages/index.astro` after `<TimelineClosing />`.
- [X] T017 [US2] Create `src/scripts/music-player.ts`, with a header comment in the style of `timeline-scope.ts` (progressive enhancement; nothing loads before a press). Implement the state machine from data-model.md "Player state" (`idle | loading | playing | paused | failed`). It reads song data only from the pressed button's `data-music-*` attributes.
  - **Clicks**: one delegated `click` listener on `document` for `.music__play`.
    - A press on the current song toggles pause and play.
    - A press on another song loads it (US3).
    - A press in `idle` creates the player.
  - **`createIframe(id)`** (research R8):
    - `src`: `https://www.youtube-nocookie.com/embed/${id}?enablejsapi=1&autoplay=1&playsinline=1&rel=0&origin=${encodeURIComponent(location.origin)}`
    - `allow="autoplay; encrypted-media; picture-in-picture"`, `referrerpolicy="strict-origin-when-cross-origin"`, `title={`${title} (${year})`}`
    - it is appended to `.music-player__video`
    - it runs only from a click handler
  - **Protocol**: on `load`, post `{"event":"listening","id":1}` to `iframe.contentWindow` with target origin `https://www.youtube-nocookie.com`. Listen to `message` events from that origin only. Parse the JSON safely and handle:
    - `onReady`
    - `onStateChange` (1 playing, 2 paused, 0 ended → paused)
    - `infoDelivery.playerState`
    - `onError` codes 2, 5, 100, 101 and 150 → `failed`
  - **Commands**: `command(func, args = [])` posts `{"event":"command","func":func,"args":args}`. It is used for `playVideo` and `pauseVideo`.
  - **Timers** (research R10/R11):
    - 5 s without `onReady` after creating or loading → `failed`
    - 3 s after `onReady` without the playing state → `paused`
    - a later state message recovers from `failed` or `paused`
  - **Rendering** (`render()`):
    - the player's year, title, artist, the external link `href` (the song's `youtube_url`), and the toggle's `aria-label` (`${title} szüneteltetése` / `${title} lejátszása`)
    - the error paragraph and the video area visibility for `failed`
    - the current card's button: `data-state`, `.music__play-label` text („♫ Most szól” / „▶ Folytatás” / „▶ Meghallgatom”) and `aria-label` (`… szüneteltetése` / `… folytatása` / `… lejátszása`), plus `aria-busy` while loading
    - every other card is reset to „▶ Meghallgatom”
  - **Toggle**: `[data-music-toggle]` sends play or pause.
  - **Status**: it announces „Most szól: ${title}, ${year}” in `[data-music-status]` on play start.
  - **Focus**: it stays on the pressed card button. Never move focus into the iframe.
  - **Showing the player**: `player.hidden = false`. A `ResizeObserver` on the player sets `document.documentElement.style.setProperty('--music-player-height', …px)`; this is a CSS variable, not a layout inline style. It adds `music-player-visible` to `body`.
  - **Statistics**: it dispatches `document.dispatchEvent(new CustomEvent('d18:music', { detail: { name, params: { year, title, artist, youtube_id } } }))` for `music_play` (a first play or a resume from the card or toggle), `music_pause` and `music_open_youtube` (a click on `[data-music-external]`).
- [X] T018 [US2] Add the player styles to `src/styles/timeline.css` (research R9/R12):
  - **Position**: `.music-player` is `position: fixed; inset: auto 0 var(--consent-notice-height, 0px) 0; z-index: 8`, on the page background with a top border.
  - **Layout**: an inner grid aligned to `--reading-width` (or the page container width) on wide screens:
    - the video at 356 × 200 px on the left
    - the info lines, then the controls in one row
    - `.music-player__year` as the largest text, in the display face
  - **The iframe** fills `.music-player__video` at 100% × 100%. Nothing is positioned over it.
  - **Bottom space**: `body.music-player-visible { --music-player-pad: var(--music-player-height); }`. The `padding-bottom` sum itself lives in `base.css` (T019).
  - **Controls** are at least 44 × 44 px with the existing focus ring.
  - **`[hidden]`** wins over display rules.
  - **Print**: in `@media print`, hide `.music-player` and `.music__play` and `.music__external`.
- [X] T019 [US2] Update `src/scripts/statistics.ts`:
  - **Notice height**: in `showNotice`, replace `document.body.style.paddingBottom = …` with `document.documentElement.style.setProperty('--consent-notice-height', `${notice.offsetHeight}px`)`. In `hideNotice`, use `removeProperty('--consent-notice-height')`. The notice shows on every page (`src/layouts/Base.astro`), so put the `body { padding-bottom: calc(var(--consent-notice-height, 0px) + var(--music-player-pad, 0px)); }` rule in `src/styles/base.css`, not in `timeline.css`. T018 then only sets `--music-player-pad`.
  - **Music events**: add a `document.addEventListener('d18:music', …)` that calls `window.gtag('event', name, params)` only when `consent === 'granted' && window.gtag`. Validate `name` through `musicStatisticsEvent` from `src/lib/statistics/events.ts`.
- [X] T020 [P] [US2] Update `src/lib/statistics/events.ts`:
  - `ClickedLink` gains `inMusicPlayer: boolean`. `statisticsEventFor` returns `null` when it is true.
  - Add `MUSIC_EVENT_NAMES = ['music_play','music_pause','music_change','music_close','music_jump_to_timeline','music_open_youtube'] as const`.
  - Add `musicStatisticsEvent(detail: unknown): StatisticsEvent | null`. It accepts only those names, and string params `year`, `title`, `artist` and `youtube_id`.

  In `src/scripts/statistics.ts`'s click handler, pass `inMusicPlayer: link.closest('[data-music-player]') !== null`, and use `eventId: link.closest<HTMLElement>('[data-event-id], [data-music-id]')`, reading either `dataset.eventId` or `dataset.musicId`.
- [X] T021 [P] [US2] Extend `tests/unit/statistics.test.ts`:
  - a player link returns `null`
  - a card source link inside a music card reports the music id
  - `musicStatisticsEvent` accepts the six names and rejects unknown names and non-string params
- [X] T022 [P] [US2] Add the embed paragraph from research R17 to the data-handling section of `src/pages/impresszum/index.astro`, and a site test in `tests/site/output.test.ts` that the Impresszum mentions `youtube-nocookie.com`.
- [X] T023 [US2] Extend `tests/site/output.test.ts` with the "Player shell" checks of contracts/site-pages.md:
  - exactly one `section.music-player[data-music-player][hidden]` with all its controls and the fallback text
  - no `<iframe` anywhere in `dist/index.html`
  - no `<script src` pointing to a YouTube host

**Checkpoint**: A song plays in the page. Pause and resume stay in sync, and the fallback works.

---

## Phase 5: User Story 3 – Switch songs and close the player (Priority: P1)

**Goal**: One player handles every song, and × resets everything.

**Independent Test**: quickstart 5, 9 and 10.

- [X] T024 [US3] In `src/scripts/music-player.ts`, handle a press on a different card while not `idle`:
  - load the new song into the existing iframe by setting its `src` to the new embed URL. It is the same element, so there is still one iframe (research R8; `loadVideoById` was dropped because it left the song unstarted and didn't report embed errors)
  - set the new current song and `loading`, restart the 5 s timer, and render (the old card resets)
  - dispatch `music_change`
- [X] T025 [US3] In `src/scripts/music-player.ts`, make `[data-music-close]` do the following:
  - send `pauseVideo`, remove the iframe, clear the timers and set `idle`
  - render (all cards reset), set `player.hidden = true`, remove `music-player-visible` and `--music-player-height`, and disconnect the observer
  - focus the last current card's `.music__play` with `preventScroll: true`
  - dispatch `music_close`

  A later press recreates the iframe.

**Checkpoint**: Switching and closing work, and there is never more than one iframe.

---

## Phase 6: User Story 4 – Jump back to the song's card (Priority: P2)

**Goal**: „↑ Ugrás a dalhoz” returns to the card and briefly highlights it.

**Independent Test**: quickstart 7 and 15, plus quickstart 2 for a jump at Ház.

- [X] T026 [US4] In `src/scripts/music-player.ts`, `[data-music-jump]` does the following (research R13):
  - set the `aria-label` to `Visszaugrás az ${year}${suffix} zenei bejegyzéshez`, where `suffix` follows the spoken last number word:
    - by the last digit: 1, 2, 4, 7 and 9 → `-es`; 3 and 8 → `-as`; 5 → `-ös`; 6 → `-os`
    - for a last digit of 0, by the tens: 10, 40, 50, 70 and 90 → `-es`; 20, 30, 60 and 80 → `-as`; 00 → `-as`
    - expected: 1901 → `-es`, 1904 → `-es`, 1916 → `-os`, 1926 → `-os`, 1935 → `-ös`, 1942 → `-es`, 1959 → `-es`, 1968 → `-as`
    - set the label when a song loads, so it is ready before the button is focused
  - `history.replaceState(null, '', `#${anchor}`)`, then dispatch a `hashchange` event so `timeline-scope.ts` widens from Ház
  - `card.scrollIntoView({ block: 'start', behavior: reducedMotion ? 'auto' : 'smooth' })`
  - add `music--highlight` to the card for 1600 ms
  - dispatch `music_jump_to_timeline`
- [X] T027 [P] [US4] Add `.music--highlight` to `src/styles/timeline.css`: a soft background and outline fade using existing accent tokens, or a static outline under `prefers-reduced-motion: reduce`. Make sure the `.event--music` rows have `scroll-margin-top: calc(var(--header-height) + 1rem)`, as the base styles already give anchored elements; add it if they don't.

**Checkpoint**: The jump lands on the card and is announced with its year.

---

## Phase 7: User Story 5 – Use the player on a phone (Priority: P2)

**Goal**: A full-width narrow-screen player that keeps the year, wraps the title to two lines, uses ≥ 44 px controls and doesn't hide the scope button.

**Independent Test**: quickstart 11 and 12.

- [X] T028 [US5] In `src/styles/timeline.css`, author the narrow layout first (mobile-first) and the wide layout from the breakpoint the site already uses for the timeline column (`min-width: 760px`):
  - **Narrow**: the info lines first, then the video at `width: 100%; height: 200px` (research R9), then the controls row. `.music-player__title` uses `display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden`. `.music-player__jump-long` is hidden and `.music-player__jump-short` shown; the reverse on wide. `.music-player__year` never wraps away or truncates.
  - **Wide**: the 356 × 200 video beside the info and controls, aligned to the content width.
  - **Scope toggle**: `.scope-toggle` moves up by `var(--music-player-pad, 0px)` on narrow screens, so it stays above the player.
- [X] T029 [US5] Check the wide-screen scope side panel (from 1100 px) against the player at 1100 × 700 and 1280 × 800 viewports. If the panel's bottom can reach the player, cap its `max-height` with `- var(--music-player-pad, 0px)` in `src/styles/timeline.css`.

**Checkpoint**: Every story works at 320, 360, 768, 1100 and 1280 px.

---

## Phase 8: Polish & Cross-Cutting

- [X] T030 [P] Update `README.md`:
  - add an "Add or change a song" section under "Editing the content": the `editorial/music.yaml` fields from data-model.md, the forbidden image fields, `descriptionNeedsReview`, the URL forms, the anchor format and the note rules (2–4 sentences, no residents claim)
  - add `editorial/music.yaml` to the content table
  - add a "Layout and design" paragraph on the music cards and the player: the files, the click-to-load `youtube-nocookie.com` embed under constitution v1.4.0, the 200 × 200 px minimum and the `d18:music` statistics events
  - add `specs/011-timeline-music-layer/` to the spec list
  - mention the music layer in the opening description's list of optional scripts
- [X] T031 Run `pnpm test`, `pnpm check`, `pnpm build:draft` and `pnpm test:site`, and fix any failures. Measure the gzipped size of the built `music-player` chunk and the statistics delta, and update the numbers in the plan.md Complexity Tracking row if they differ from about 2.4 KB.
- [X] T032 Run `pnpm lighthouse` on the built site and confirm the constitution II budgets on `/` with no song started.
- [X] T033 Walk through quickstart.md scenarios 1–18 in a desktop browser and at 360 px. Record any deviation as a follow-up note in `specs/011-timeline-music-layer/quickstart.md` under a "Results" heading.

---

## Dependencies & Execution Order

- **Setup (T001–T002)**: independent of each other.
- **Foundational (T003–T008)**: T003 → T004 → T008. T006 needs T004. T005 needs T003 and T004. T007 needs T006. This phase blocks every story.
- **US1 (T009–T015)**: needs Phase 2 and T002. This is the MVP.
- **US2 (T016–T023)**: needs US1 (the cards carry the play buttons).
- **US3 (T024–T025)**: needs US2.
- **US4 (T026–T027)**: needs US2. It is independent of US3.
- **US5 (T028–T029)**: needs T018. It can run in parallel with US3 and US4.
- **Polish (T030–T033)**: after the stories wanted for release.

## Parallel Opportunities

- T001 ∥ T002
- T005 ∥ T006/T007, once T004 is done
- In US1: T014 ∥ T009–T013
- In US2: T020 ∥ T021 ∥ T022 ∥ T016–T018
- After US2: US3 ∥ US4 ∥ US5, with care, since US3 and US4 both edit `music-player.ts` and US4 and US5 both edit `timeline.css`. Run them one after another when one agent does both.
- T030 ∥ T031

## Implementation Strategy

1. **MVP** (Phases 1–3): the cards appear with their notes, ride with Környék and link out without JS. You can review the content and design now.
2. **Playback** (Phases 4–5): in-page player, switching and closing. This is the feature's core. Releasing needs the owner to fill every `youtube_url` and review every note: `build:release` stays blocked until then.
3. **Navigation and mobile** (Phases 6–7).
4. **Polish** (Phase 8): docs, budgets, the manual walkthrough.
