# Contract: published pages and navigation

These are the public, crawlable surfaces this feature changes. Tests in `tests/site/output.test.ts` enforce them.

## URLs

| Path | Status after this feature |
|---|---|
| `/lakok/` | New, 200, in `sitemap.xml`, audited by Lighthouse CI |
| `/`, `/epitok/`, `/nevado/`, `/impresszum/` | Unchanged apart from the navigation |

## Navigation (every page)

- The header `nav[aria-label="Fő navigáció"]` page links come after the four era links, in the order `/epitok/`, `/lakok/`, `/nevado/`, `/impresszum/`.
- The footer `nav[aria-label="Lábléc"]` links appear in the same order.
- On `/lakok/`, the Lakók header link has `aria-current="page"`.
- At every width from 320 px to 1920 px, the header doesn't overflow sideways (research R7).

## `/lakok/` guarantees

- It passes the existing every-page checks: one `h1`, `lang="hu"`, a title of 60 characters or fewer, a description of 50–160 characters, a canonical link, and the OG and Twitter tags.
- `og:type` is `article`. The JSON-LD `@graph` holds `WebSite`, `BreadcrumbList` and `Article`.
- There is no `<img>` and no `figure.evidence` (FR-007a). Superseded by feature 008: exactly one eager `figure.evidence` (the façade photo) after the lead, and the JSON-LD also holds an `ImageObject`.
- It has exactly 3 `<details class="name-list">` elements. None has the `open` attribute, and each starts with a `<summary>` whose text ends with "(67 bejegyzés)", "(35 bejegyzés)" or "(107 bejegyzés)", in that order.
- The table body row counts are 67, 35 and 107, in page order.
- There is an `h2` with the text "1944–1945: csillagos ház".
- The `id="forras-N"` entries run from 1 to 27. Every `href="#forras-N"` has a matching id, and every id from 1 to 27 is linked at least once.
- No `href` contains `utm_`. No link points to `https://www.dembinszky18.hu/` absolutely; internal links are relative.
- After the source list, there is a `mailto:` link to the impresszum contact address.
- Without JavaScript, every list opens and closes (native `details`). With JavaScript, printing opens all lists and restores their state afterwards.
