# Data Model: Építők and Névadó pages

The feature adds no stored data. The entities below describe the content structure of the hand-written pages.

## Story page

| Field | Építők | Névadó |
|---|---|---|
| Path | `/epitok/` | `/nevado/` |
| `h1` | Építők | Névadó |
| `<title>` (≤ 60) | Építők – Dembinszky utca 18. | Névadó – Dembinszky utca 18. |
| Meta description (50–160) | Written from the lead paragraph | Written from the lead paragraph |
| Lead | Italic intro paragraph of `epitok.md` | Italic intro paragraph of `nevado.md` |
| Opening image | `assets/facade.png` (alt/caption/credit from `hero.photo`) | `src/assets/pages/dembinszky-rodakowski.jpg` |
| Sections | 7 `h2` sections, 3 `h3` sub-sections under Spitz and 2 under Mellinger | 5 `h2` sections, then "Források és továbbolvasás" |
| Source list | "Források": 3 entries, one per distinct URL | "Források és továbbolvasás": 13 numbered entries |
| JSON-LD | WebSite, BreadcrumbList, Article, ImageObject | Same |
| `og:type` | article | article |

Validation rules:
- There is exactly one `h1`, and the heading levels follow the Markdown (`##` → `h2`, `###` → `h3`).
- The "Javasolt nyitókép" section is not rendered as text (FR-006).
- No link contains `utm_` (FR-009).

## Source entry

- `number` (Névadó only): 1–13, rendered as `id="forras-{number}"`.
- `title`: link text.
- `url`: absolute https URL with tracking parameters removed.
- `note`: optional text after the em dash.

In-text markers on Névadó link to `#forras-{number}`. Every marker must resolve, and every entry must be cited at least once. Some Névadó source entries hold two links; entry 11 is an example.

## Navigation item

This is the ordered list in `SiteHeader.astro` (`pages`) and `SiteFooter.astro`:

1. Építők → `/epitok/`
2. Névadó → `/nevado/`
3. Impresszum → `/impresszum/` (always last)

The era links stay before these items in the header. The current page gets `aria-current="page"`.

## Removed

- The `articles` field in the `site.yaml` schema, along with `articleSchema`.
- The `/irasok/` route.
