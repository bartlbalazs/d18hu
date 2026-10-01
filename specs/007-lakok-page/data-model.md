# Data Model: Lakók page

The feature adds no stored data. The entities below describe the content structure of the hand-written page.

## Story page: Lakók

| Field | Value |
|---|---|
| Path | `/lakok/` |
| `h1` | Lakók |
| `<title>` (≤ 60) | Lakók – Dembinszky utca 18. |
| Meta description (50–160) | Written from the lead paragraph |
| Lead | The first draft paragraph, styled as `.story__lead`, followed by the method paragraph as body text |
| Opening image | None (FR-007a) |
| JSON-LD | WebSite, BreadcrumbList, Article (without `image`) |
| `og:type` | article |

## Period section

| `h2` | Band | Contains |
|---|---|---|
| A kezdetek: színpad, műhely, hivatal, 1902–1904 | 1 | intro, name list "early", 7 portraits (`h3`), closing paragraphs |
| 1922: vasút, sajtó és autóvállalkozás | 2 | intro, name list "1922", 6 portraits, the bridging paragraph that ends "…üldöztetés és ostrom is elérte a házat." |
| 1944–1945: csillagos ház *(new heading, FR-006a)* | 3 (dark) | the paragraph starting "A Dembinszky utca 18. szerepel a *Fővárosi Közlöny*…", with its two inline links and markers [26] [27] |
| 1954: gépek és munkanormák | 4 | intro, name list "1954", 6 portraits, closing paragraph |
| Egy cím, változó megélhetések | none | two closing paragraphs |

Validation rules:
- There is exactly one `h1`. Draft `##` headings become `h2`, and `###` headings become `h3`.
- Each band is a `section` labelled by its `h2` (`aria-labelledby`).
- Text keeps the draft's wording. The only new text is the 1944–1945 heading, two list labels and the correction note.

## Name list

| id | `h3` above it | Summary label | Columns | Rows | Notes inside the list |
|---|---|---|---|---|---|
| `nevsor-1902` | A két korai évfolyam névsora | A két korai évfolyam névsorának megnyitása (67 bejegyzés) | Név · 1902–1903: foglalkozás / státusz · 1903–1904: foglalkozás / státusz | 67 | the "—" legend |
| `nevsor-1922` | Az 1922–1923-as évfolyam névsora | Az 1922–1923-as évfolyam névsorának megnyitása (35 bejegyzés) | Név · Foglalkozás / státusz | 35 | none |
| `nevsor-1954` | Az 1954-es választói névjegyzék házbeli listája | A teljes 1954-es választói névsor megnyitása (107 bejegyzés) | Név · Foglalkozás / státusz | 107 | the birth-name and asterisk note (before the table); *Névjavítások* and *Lehetséges foglalkozás-feloldások* (after the table) |

Validation rules:
- The list is a `details` element with no `open` attribute, and its first child is a `summary`.
- The table has a `caption` and `th scope="col"` headers. The row count must equal the stated entry count.
- Cell text matches the draft exactly, including "—", "?" and "*".
- In 1954 name cells, a birth name sits on a second line within the same cell.

## Resident portrait

An `h3` and one or more paragraphs with source markers, from the draft's `###` sub-sections (other than the list headings). There are 19 in all: 7 in 1902–1904, 6 in 1922 and 6 in 1954.

## Source entry

- `number`: 1–27, rendered as `<li id="forras-{number}">` in an `<ol>` under `h2#forrasok` "Források és továbbolvasás". The "Névsori megjegyzések" paragraph comes before the list.
- `title`: the link text. `url`: an absolute https URL, except entry 13, which links to `/epitok/`. `note`: the text after the link.
- Some entries hold two links, such as 12 and 17.

Markers: `[N]`, `[N, M]` and `[N–M]` render as `<sup>` with one `<a href="#forras-K">` per linked number. Both ends of a range are linked. Every marker must resolve, and every entry from 1 to 27 must have at least one marker.

## Correction note

A paragraph after the source list that invites people to ask for a correction or removal. It holds a `mailto:` link built from `site.impresszum.contactEmail`.

## Navigation item

This is the ordered page list in `SiteHeader.astro` (`pages`) and `SiteFooter.astro`:

1. Építők → `/epitok/`
2. Lakók → `/lakok/` *(new)*
3. Névadó → `/nevado/`
4. Impresszum → `/impresszum/` (always last)

On `/lakok/`, the Lakók link gets `aria-current="page"`.
