# Data Model: Timeline music layer

## Music entry (content, `editorial/music.yaml`)

The file is one `music_timeline` object, validated by `musicEditorialSchema` (strict, so unknown keys are errors):

| Field | Rule |
|---|---|
| `schema_version` | `1` |
| `label` | exactly `Mit hallgatott Budapest?` (the card and player text is fixed by the spec) |
| `cta_label` | exactly `Meghallgatom` |
| `items` | the songs, in any order: the build sorts by era and year (research R4) |

Each item:

| Field | Type | Required | Rule |
|---|---|---|---|
| `type` | `music` | no | Defaults to `music`; any other value is an error |
| `year` | integer | yes | 1873–1968; the year the note is about |
| `slug`, `anchor_id` | string | no | Must equal `<year>-<slug(title)>` and `zene-<year>-<slug(title)>` |
| `title` | string | yes | Non-empty |
| `credit` | string | yes | The line under the title: performer, or composer · work |
| `composer`, `lyricist`, `work` | string | no | Kept as data; not shown on the card |
| `description` | string | for release | 2–4 sentences (FR-029). Empty → missing item |
| `descriptionNeedsReview` | boolean | no | `true` on unchecked notes. Missing item until removed |
| `playback_source` | `youtube` | no | Defaults to `youtube` |
| `youtube_url` | https string | for release | A recognised YouTube URL (R3). Empty → missing item |
| `youtube_id` | string | no | Must equal the id derived from `youtube_url` |
| `youtube_embed_url` | https string | no | Must equal `https://www.youtube-nocookie.com/embed/<id>` |
| `recording_artist` | string | yes | Who is heard; shown in the player and sent as the `artist` statistics parameter |
| `recording_relation` | snake_case string | yes | e.g. `period_recording`, `period_recording_reissue`, `author_period_recording`, `archival_film_recording`, `later_recording`, `modern_recording`, `hungaroton_reissue` |
| `recording_note` | string | no | Shown on the card above the button |
| `recording_year`, `recording_release_year` | integer | no | Recording details for editors; not shown |
| `recording_label`, `recording_catalog_number`, `recording_source` | string | no | Recording details for editors; not shown |
| `sources` | list of `{ title, url, purpose? }` | no | `url` is https; `purpose` is for editors, not shown |

Forbidden (because the objects are strict): `image_url`, `image_alt`, `thumbnail`, `cover` and any other key.

## MusicEntry (build-time, `src/lib/timeline/music.ts`)

| Field | Derived from |
|---|---|
| `kind: 'music'` | Constant. Tells it apart from `TimelineEvent` in `era.items` |
| `anchor` | `zene-<year>-<slug(title)>`, with the same slug rules as event ids (`src/lib/timeline/ids.ts`): lower case, accents stripped, words joined by `-`. Example: `zene-1935-szomoru-vasarnap` |
| `era` | The `EraId` whose span contains `year` |
| `year`, `title`, `credit`, `composer?`, `lyricist?`, `work?`, `description`, `sources` | Copied (`sources` mapped to `SourceLink { label, url }`) |
| `recordingArtist`, `recordingRelation`, `recordingNote` | From the `recording_*` fields |
| `youtubeUrl`, `youtubeId` | `youtube_url`, and the derived or checked id (R3). Empty in drafts when the URL is missing |

Build errors, in every mode, naming the entry:
- schema violation
- year outside every era
- an unrecognised URL
- an id mismatch
- a duplicate anchor or duplicate video id

Missing items, so draft builds list them and release builds fail: an empty `description`, a `descriptionNeedsReview` note, an empty `youtube_url`. They are reported as `scope: 'music'` with `id: anchor`.

A draft card with no `youtube_url` renders without the button and without the link.

## Era (extended)

`Era` in `src/lib/site-data.ts` gains `items: (TimelineEvent | MusicEntry)[]`: the events in their current order, with music entries inserted (R4). `era.events` and every count derived from it stay events only.

## Player state (browser, `src/scripts/music-player.ts`)

```text
idle ──press card──▶ loading ──onReady+playing──▶ playing ◀──play──▶ paused
                       │  ▲                           │                  │
                       │  └──press other card─────────┴──────────────────┘   (same iframe, new src)
                       ├──3 s ready, not playing──▶ paused   (R10)
                       └──onError / 5 s no answer──▶ failed  (R11)
any state ──×──▶ idle   (iframe removed, player hidden, bottom space removed)
```

| State | Card of the current song | Other cards | Player |
|---|---|---|---|
| idle | — | „▶ Meghallgatom” | hidden, no iframe |
| loading | „♫ Most szól”, `aria-busy` | „▶ Meghallgatom” | visible, year/title/performer filled |
| playing | „♫ Most szól” | „▶ Meghallgatom” | pause button |
| paused | „▶ Folytatás” | „▶ Meghallgatom” | play button |
| failed | „▶ Meghallgatom” | „▶ Meghallgatom” | fallback text + „YouTube ↗”, video area hidden |

The current song is read from the pressed card's `data-music-*` attributes (`year`, `title`, `artist` = the recording artist, `youtube-id`, `youtube-url`). The page holds no other client-side song data.
