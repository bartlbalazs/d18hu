# Data model: Music card refinement

This extends [011's data model](../011-timeline-music-layer/data-model.md). Only what changes is listed.

## Editorial item (`editorial/music.yaml` → `music_timeline.items[]`)

One new optional field: `media`. All other fields, and the file's root, are unchanged. The owner's metadata stays verbatim; `media` is added per item only when an image is chosen. With Clarification 1, no item has one yet.

### `media` (strict object, optional)

| Field | Type | Rule |
|---|---|---|
| `src` | string | Required. A bare file name in `src/assets/music/`, matching `^[a-z0-9][a-z0-9._-]*\.(jpe?g\|png\|webp)$`. Every build fails if the file is missing (R7) |
| `alt` | string, default `''` | Release: non-empty and not generic (`kép`, `fotó`, `image`, `music image`, `portré`), unless `decorative` (R12) |
| `decorative` | boolean, default `false` | `true` renders `alt=""` and skips the alt checks |
| `caption` | string, default `''` | Optional. Shown in the sources panel and used as the `ImageObject` caption, with `alt` as the fallback |
| `credit` | string, default `''` | Release: non-empty |
| `license` | string, default `''` | Release: non-empty |
| `license_url` | https URL, optional | The licence text in the panel links here; also the `ImageObject.license` |
| `modifications` | string, optional | How the file differs from the source (CC BY-SA asks for it), shown after the licence |
| `source_title` | string, optional | The link text in the panel; „Képforrás” when only `source_url` is given |
| `source_url` | https URL, optional | Panel link and `ImageObject.acquireLicensePage` |
| `position` | string, optional | `^\d{1,3}% \d{1,3}%$`, e.g. `50% 35%`. Becomes `--music-image-position`; the default is `50% 50%` |

Example:

```yaml
    media:
      src: frater-lorand.jpg
      alt: Fráter Lóránd portréja
      caption: Fráter Lóránd az 1910-es években
      credit: Fortepan / Ismeretlen
      license: CC BY-SA 3.0
      source_title: Fortepan 12345
      source_url: https://fortepan.hu/hu/photos/?id=12345
      position: 50% 30%
```

## `MusicEntry` (`src/lib/timeline/music.ts`)

New fields, derived in `buildMusicEntries`:

| Field | Type | From |
|---|---|---|
| `recording` | `{ primary: string; secondary?: string } \| undefined` | `recordingLines()` (R4). `undefined` when there is no `youtubeId` |
| `media` | `MusicMedia \| undefined` | `item.media`, trimmed. Fields: `file`, `alt`, `decorative`, `caption`, `credit`, `license`, `sourceTitle?`, `sourceUrl?`, `position` |

The kept fields that this feature now uses differently:
- `recordingNote`: moves to the sources panel
- `credit`: also passed to the player

## `RECORDING_RELATIONS` (`src/lib/timeline/music.ts`)

`Record<string, { phrase: string; periodYear: boolean }>`, with the six rows of research R3.

Validation, in `buildMusicEntries`: a relation with no row adds the problem `<anchor>: recording_relation "<value>" has no Hungarian phrase in RECORDING_RELATIONS`, so the build fails.

## `recordingLines(entry)`

- **Input**: the item's `recording_artist`, `recording_relation`, `recording_year`, `recording_release_year`, `recording_label`, `recording_catalog_number` and the song `year`.
- **Output**:
  - `primary` = `Felvétel: <artist>[, <year>]`
    - `<year>` = `recording_year`, or else the song year when `periodYear`, or else omitted
  - `secondary` = the non-empty parts of [`<label> <catalog>`, `<phrase>[, <release year>]`], joined by ` · `
    - It is `undefined` only if both parts are empty, which cannot happen while every relation has a phrase.

## Audit (`auditEditorial`, release builds)

New `scope: 'music'` items when `entry.media` is set:

| field | message |
|---|---|
| `media.alt` | `image alt missing`, or `image alt is generic` (both skipped when `decorative`) |
| `media.credit` | `image credit missing` |
| `media.license` | `image license missing` |

## Card state

There is no new state. The `details` open/closed state is the browser's own; it is not stored, and it resets on reload. Playback states are those of 011.
