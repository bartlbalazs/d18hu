# Data Model: Timeline update from the October 2026 research

No new entity types or schema fields are added. The feature adds data to the existing entities described in [001 data model](../001-d18-history-timeline/data-model.md).

## Timeline row (`input/timeline.md`)

| Field | Rule in this feature |
|---|---|
| Dátum | Label from [contracts/new-events.md](contracts/new-events.md), in the existing abbreviated style (see [research R3](research.md#r3-date-labels)) |
| Sáv | `D18`, `D18 • személy` or `Környék` only (no new Magyarország/Világ rows) |
| Esemény és jelentőség | Hungarian, 2–6 sentences. Facts, then the source's limits (FR-004, [R10](research.md#r10-text-rules-for-uncertain-events)) |
| Bizonyosság | `Igazolt`, `Valószínű` or `Feltételezés`, by the weakest-link rule |
| Külső forrás | The `https://` links listed per event in the contract |
| Kép URL | `assets/events/forrasok/…png`, or `—` for N5, N15, N24, N28 (and N9 if the book page has no picture) |
| Cikkötlet | From the research, shortened |

**Placement**: in the era of the start date, in chronological order. On equal dates, the new row goes after existing rows.

**Id**: derived from the date plus the first four words (see [R2](research.md#r2-event-ids-when-existing-rows-change)).

## Event editorial entry (`editorial/events.yaml`)

| Field | Rule |
|---|---|
| key | The id the build prints for the row |
| title | From the contract; ≤ 60 characters; no `titleNeedsReview` (the owner reviews titles in this feature's review) |
| image | Only for rows with a `Kép URL`; all of `alt`, `caption`, `credit`, `license`, `sourceUrl`, `sourceLabel`, `depictsHouse: false`, `kind: document` ([R7](research.md#r7-image-metadata)) |

## Changed entities

| Item | Change |
|---|---|
| Existing rows M1, M2, M5 | Text extended after the original opening; M1 certainty changes to Igazolt |
| Existing row M6 | New date `1944. jún.–júl.`, new opening and Igazolt certainty; editorial key re-keyed; new image |
| Existing 1924 Drescher row (M3) | Removed; its editorial key is deleted |
| 1889 street-naming row | `Kép URL` → `assets/events/budapest_1903.jpg`; image block added |
| 1901 permit row | `Kép URL` → `assets/events/1901-04-20-hasznalhatasi-engedely.png`; image block replaced |
| Open questions table, "missing links" paragraph | Rows on Spitz inheritance, the 1954 register and Plan/Flam updated (not published; editorial record) |
| Music item 1968 (Illés) | `description`: „mire a timeline elér 1968-hoz” → „mire krónikánk 1968-hoz ér” |
| `src/pages/index.astro` meta description | "108 esemény" → "175 esemény" |

## Validation

- The build fails on unknown editorial keys, malformed rows, or a `Kép URL` that is missing from the manifest. These are the existing checks.
- Event count after the change: **175**. New events per era: 1873–1913: 1, 1914–1938: 22, 1939–1945: 7, 1946–1968: 4.
