# Data Model: Dembinszky utca 18. History Timeline

Three inputs are merged at build time into typed collections. None of them is modified by the
build.

```text
input/timeline.md ──parse──▶ TimelineEvent[] ◀──join by id── editorial/events.yaml
                                   │                              (EventEditorial)
src/assets/archive/manifest.json ──┘ (ArchiveImage, by originalUrl)
editorial/site.yaml ──▶ SiteConfig (eras, hero, impresszum, building)
```

## Era

| Field | Type | Source | Rules |
|---|---|---|---|
| `id` | `'1873-1913' \| '1914-1938' \| '1939-1945' \| '1946-1968'` | H2 heading, trailing year range | Must be exactly these four, in this order |
| `number` | `1..4` | position | — |
| `title` | string | H2 heading text without the year range | e.g. "A város és a ház megszületése" |
| `intro` | string | `site.yaml` `eras[id].intro` | 1–2 sentences; missing → editorial item |
| `eventsHeading` | string | `site.yaml` `eras[id].eventsHeading` | e.g. "A ház előtti várostól a lakókig"; missing → editorial item |
| `tone` | `'light' \| 'warm' \| 'dark' \| 'stone'` | fixed by era number | Maps to the opener colours in FR-009 |
| `events` | `TimelineEvent[]` | table under the heading | Source order |

## TimelineEvent

| Field | Type | Rules |
|---|---|---|
| `id` | string | Content-derived (research R4). Unique. Used as the anchor `#<id>` and the editorial key |
| `era` | Era id | — |
| `sourceIndex` | integer, 1-based | Position across the whole file. The only sort key |
| `dateLabel` | string | `Dátum` cell as plain text (emphasis markers removed), verbatim wording |
| `dateLabelHtml` | string | Same cell through the inline renderer, so e.g. `15. **vagy** 17.` keeps its bold "vagy" |
| `sortStart` | ISO partial date \| undefined | Derived only from unambiguous patterns (see below) |
| `sortEnd` | ISO partial date \| undefined | Only for explicit ranges "A – B" where both ends derive |
| `sourceLane` | `'D18' \| 'D18 • személy' \| 'Környék' \| 'Magyarország' \| 'Világ'` | Any other value → build error |
| `category` | `'house' \| 'area' \| 'hungary' \| 'world'` | `D18`,`D18 • személy`→house; `Környék`→area; `Magyarország`→hungary; `Világ`→world |
| `personSubtype` | boolean | true iff lane is `D18 • személy` |
| `title` | string \| undefined | From `EventEditorial.title`; missing → editorial item |
| `descriptionHtml` | string | Whitelisted inline render of the `Esemény és jelentőség` cell (text, strong, emphasis, link, inlineCode). Any other node → build error |
| `descriptionText` | string | Plain text (for meta and alt fallbacks in reports only) |
| `confidence` | `'verified' \| 'probable' \| 'hypothesis' \| null` | `Igazolt`/`Valószínű`/`Feltételezés`/`—`; other → build error |
| `sources` | `{label, url}[]` | Links in `Külső forrás`. `—` → `[]`. Non-separator leftover text → build error. URL must be `https:` |
| `originalImageUrl` | string \| undefined | `Kép URL` cell; `—` → undefined. Must be `https:` |
| `image` | `ArchiveImage & EventImageEditorial` \| undefined | Present iff `originalImageUrl`; manifest entry missing → build error |
| `highlight` | `DocumentHighlight` \| undefined | From editorial |
| `articleIdea` | string \| undefined | `Cikkötlet` cell. Never rendered or linked (FR-019) |
| `variant` | `'compact' \| 'image' \| 'document'` | `document` if `highlight`; else `image` if `image`; else `compact` |
| `raw` | `string[7]` | Original cell text, kept for audit/tests |

**Date derivation** (`sortStart`), in order, first match wins. Anything else gives
`undefined`:

| Pattern (examples) | Result |
|---|---|
| `YYYY. <hu-month-abbr>. D.` exactly ("1903. dec. 27.") | `YYYY-MM-DD` |
| `YYYY. <hu-month-abbr>.` exactly ("1956. okt.") | `YYYY-MM` |
| `YYYY` exactly ("1889") | `YYYY` |
| `YYYY–YYYY` or `YYYY – YYYY` ("1901–1902") | start `YYYY`, end `YYYY` |
| `<day or month pattern> – <day or month pattern>` ("1944. dec. 24. – 1945. febr. 13.") | start and end from each side |
| contains `körül`, `vagy`, `/`, `után`, `előtt`, `pontos … nélkül`, `közölt` | `undefined` (label is the truth) |

Current data (2026-09-28): 36 day, 15 month, 35 year, 6 year-range and 16 other labels
(the "other" ones, like `1925. ősz` or `1944. jún. vége`, get no derived date; one day-range
derives both ends).

Month abbreviations: jan, febr, márc, ápr, máj, jún, júl, aug, szept, okt, nov, dec. The
display always uses `dateLabel`; `sortStart` only feeds `<time datetime>` and JSON-LD.

## ArchiveImage (`src/assets/archive/manifest.json`)

| Field | Type | Rules |
|---|---|---|
| `originalUrl` | string | Key. Exactly as in `Kép URL` |
| `file` | string | `<collection>-<archiveId>-<hash8>.<ext>`, e.g. `fortepan-82508-1a2b3c4d.jpg`; `img-<hash8>.<ext>` when no archive id is recognisable |
| `sha256` | string | Of file bytes. Identical content under a new URL → reuse the file |
| `width`, `height` | integer | Read by sharp from the file |
| `contentType` | string | `image/jpeg` \| `image/png` \| `image/webp` |
| `fetchedAt` | ISO datetime | — |

Lifecycle: `new Kép URL` → *fetch* (validate: HTTP 200, `image/*`, sharp decodes) → *stored
+ manifest entry* → used by builds offline. A `Kép URL` removed from the source makes its
entry *unreferenced*, which `images:fetch` reports.

## EventEditorial (`editorial/events.yaml`)

Keyed by event `id`. All fields optional in the schema; *required-for-release* rules are
enforced by the audit (below).

```yaml
1903-dec-27-maulner-adolf-es-tarsai:
  title: Karbidot hirdetnek a 18-as címről
  highlight:
    kind: transcription            # transcription | excerpt
    label: Korabeli hirdetés · Eperjesi Lapok, 1903
    text: Budapest, VII., Dembinszky-utca 18.
    verified: true                 # must be true to render
1963-...:
  title: A Dembinszky 18 újra fényképen
  image:
    alt: …
    caption: …                     # what it shows / what it does (not) prove
    credit: Fortepan / <donor>
    license: CC BY-SA 3.0
    sourceUrl: https://fortepan.hu/hu/photos/?id=148696
    depictsHouse: true
    kind: photo                    # photo | document  (document → uncropped)
```

**Validation**
- Every key must match an existing event id, otherwise `OrphanedEditorialEntry` (fails both
  modes).
- A `highlight` is rendered only when `verified: true`.
- `image` data on an event without a `Kép URL` fails the build (`OrphanedEditorialEntry`).

## SiteConfig (`editorial/site.yaml`)

```yaml
siteUrl: https://dembinszky18.hu        # release: required (or SITE_URL env)
building:
  name: Dembinszky utca 18.
  streetAddress: Dembinszky utca 18.
  postalCode: ""                        # release: required
  addressLocality: Budapest
  addressRegion: VII. kerület (Erzsébetváros)
  geo: { latitude: null, longitude: null }   # optional
hero:
  subtitle: Egy erzsébetvárosi bérház, az emberei és a körülötte változó világ.
  photo: { alt: …, caption: "A ház mai homlokzata", credit: "" }   # credit: release-required
eras:
  1873-1913: { intro: …, eventsHeading: A ház előtti várostól a lakókig }
  # … one entry per era
impresszum:                             # all release-required, never invented
  operator: ""
  author: ""
  contactEmail: ""
  copyrightNotice: ""
articles: []                            # published /irasok/ entries: {slug, title, date, summary}
```

## EditorialAudit (derived; drives build modes)

`audit(events, site) → MissingItem[]`, where `MissingItem = { scope, id?, field, message }`.
A missing item is any of the following:

- an event without `title`
- an image event without `alt`, `caption`, `credit` or `license`
- a missing hero photo `alt`, `caption` or `credit`
- an era without `intro` or `eventsHeading`
- an empty `impresszum.*` field
- an empty `building.postalCode`
- no `siteUrl` (release)

Empty strings count as missing, and so do placeholder values (`TODO`, `TBD`, `…`,
`example.com` / `example.org` addresses).

- **Draft mode**: the report is printed, the pages are flagged as a draft, and the build
  succeeds.
- **Release mode**: a non-empty report fails the build (`MissingEditorialItems`).

## Structural errors (fail in both modes)

| Error | Trigger |
|---|---|
| `TimelineParseError` | Missing/extra era, table column count ≠ 7, unknown lane/confidence, disallowed inline node, non-link text in sources, non-https URL |
| `DuplicateEventId` | Two events derive the same id |
| `OrphanedEditorialEntry` | Editorial key without event, or image editorial without `Kép URL` |
| `MissingArchiveImage` | `Kép URL` present but no manifest entry / file (run `pnpm images:fetch`) |
| `ImageFetchError` (fetch script only) | Non-200, non-image content type, undecodable file — reports event id + URL |

Each error message includes the era, source row number (`sourceIndex`) and/or event id.
