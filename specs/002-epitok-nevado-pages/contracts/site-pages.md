# Contract: published pages and navigation

These are the public, crawlable surfaces this feature changes. Tests in `tests/site/output.test.ts` enforce them.

## URLs

| Path | Status after this feature |
|---|---|
| `/epitok/` | New, 200, in `sitemap.xml` |
| `/nevado/` | New, 200, in `sitemap.xml` |
| `/irasok/` | Removed: not built, not in the sitemap, not linked anywhere |
| `/`, `/impresszum/` | Unchanged apart from the navigation |

## Navigation (every page)

- The header `nav[aria-label="Fő navigáció"]` page links appear in the order `/epitok/`, `/nevado/`, `/impresszum/`, after the era links.
- The footer `nav[aria-label="Lábléc"]` links appear in the order `/epitok/`, `/nevado/`, `/impresszum/`.
- No `href="/irasok/"` appears anywhere in `dist/`.

## Per-page guarantees (`/epitok/`, `/nevado/`)

- Every page meets the existing checks: one `h1`, `lang="hu"`, a title of 60 characters or fewer, a description of 50–160 characters, a canonical link, and the OG and Twitter tags.
- `og:type` is `article`.
- The JSON-LD `@graph` contains `WebSite`, `BreadcrumbList`, `Article` and `ImageObject`.
- There is one opening `figure.evidence`, loaded eagerly.
- No `href` contains `utm_`.
- `/nevado/`: every `href="#forras-N"` has a matching `id="forras-N"`, and N runs from 1 to 13.
- `/epitok/`: a "Források" section lists 3 distinct external links.
