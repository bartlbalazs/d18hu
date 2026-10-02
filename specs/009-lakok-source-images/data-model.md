# Data model: Lakók source images

## LakokFigure (`src/lib/lakok/figures.ts`)

| Field | Type | Rule |
|---|---|---|
| `image` | `ImageMetadata` | Import from `src/assets/pages/lakok/<package file name>` |
| `alt` | `string` | Catalogue `alt`, word for word; required |
| `caption` | `string` | Catalogue `caption`, word for word; required |
| `credit` | `string` | Catalogue `credit`, word for word; required |
| `source` | `{ label: 'eredeti forrás'; url: string }` | `url` = catalogue `source_url`; required |
| `kind` | `'photo' \| 'document'` | `photo` for 13, 14 and 16; `document` for the rest |
| `size` | `'narrow' \| 'medium' \| 'wide' \| 'column'` | From research R2 |
| `label` | `string?` | Only 19 ("Cikkkezdet, 377. oldal") and 20 ("Zárórész, 379. oldal") |

The type has no field for rights, priority or display notes (FR-002).

`figureProps(figure)` returns the `EvidenceFigure` props: `image`, `alt`, `caption`, `credit`, `source`, `kind` and `label`, plus `class`, `widths` and `sizes`, which are worked out from `size` and the image width (R3). `class` also gets `lakok-figure--strip` when the image is wider than 3.5 : 1 (R2).

## The 14 records

| Key | File | Kind | Size | Place (spec FR-001) |
|---|---|---|---|---|
| `armandolaConcert` | 18-armandola-hangverseny-1902.png | document | narrow | 1 |
| `almasiPortrait` | 16-almasi-iza-portre-1900.png | photo | medium | 2 |
| `almasiCakeWalk` | 17-iza-cake-walk-1903.png | document | wide | 3 |
| `mautnerPerfector` | 04-mautner-perfector-1899.png | document | medium | 4 |
| `szelloStart` | 19-szello-cikkkezdet-1900.png | document | column | 5 (pair) |
| `szelloEnd` | 20-szello-cikkvege-1900.png | document | column | 5 (pair) |
| `grasellySociety` | 21-graselly-lajosmizse-1911.png | document | medium | 6 |
| `petrovits1902` | 07-petrovits-1902.png | document | wide | 7 (pair) |
| `petrovits1922` | 08-petrovits-1922.png | document | wide | 7 (pair) |
| `takacsCarFirm` | 09-takacs-auto-1922.png | document | wide | 8 |
| `yellowStarList` | 12-csillagos-hazak-1944.png | document | medium | 9 |
| `machinists1954` | 13-gepeszek-1954.jpg | photo | narrow | 10 |
| `projectionist1954` | 14-mozigepesz-1954.jpg | photo | wide | 11 |
| `timeStudyGrading` | 15-idoelemzes-1949.png | document | column | 12 |

## Image pair

A pair is markup only (`div.lakok-figure-pair` with two figures). It has no data type of its own.
