# Contract: built site output

These are the observable promises the built `dist/` makes after this feature. `tests/site/output.test.ts`, html-validate and linkinator check them. The checks marked *(new)* are added by this feature; the others are existing checks whose expected values change.

## All pages

- `PAGES` includes `epulet/index.html`. It is valid HTML and has one `h1`, a canonical URL, OG/Twitter tags and JSON-LD like every page.
- The header page links, in the Menü popover and in the one-row header, read exactly `/epulet/`, `/epitok/`, `/lakok/`, `/nevado/`, `/impresszum/`.
- The footer links read the same five, in the same order.
- On `/epulet/`, the Épület link carries `aria-current="page"`.
- `sitemap.xml` contains `/epulet/`.

## `/epulet/` *(new)*

- `<title>` is `Épület – Dembinszky utca 18.` (≤ 60 characters), and the meta description is 50–160 characters.
- JSON-LD includes `Article` with `@id` `…/epulet/#article`, a `BreadcrumbList` with 2 items, and 13 `ImageObject` nodes.
- Exactly 13 `<figure class="evidence`. The first is eager-loaded, and the others are `loading="lazy"`. Every figure has a non-empty `alt` and a `<figcaption>` containing `Fotó: a szerző` (the opening photo uses its own credit).
- Figure ids `kep-1`, `kep-2`, `kep-3`, `kep-4`, `kep-5a`, `kep-5b`, `kep-6` … `kep-11` exist.
- h2 ids are, in order: `telek`, `rajzasztal`, `arveres`, `mellinger`, `hasznalatba-vetel`, `erkely`, `spitz-nev`, `helyreallitas`, `lakasmegosztas`, `gang`, `osszegzes`, `forrasok`. There are two h3 under `mellinger`.
- Band classes: six `story-band--1` sections, one `story-band--2` and three `story-band--4`, in the order given in data-model.md.
- The source list has 11 `<li id="forras-1…11">`. Every `href="#forras-N"` and `href="#kep-…"` resolves (linkinator `--check-fragments`).
- Internal links to `/epitok/` and `/lakok/` are relative. No `href` contains `dembinszky18.hu`.
- No outbound link has `utm_` or other tracking parameters.

## `/epitok/`

- The last paragraph of the article is `<p class="story__postscript">` and contains `href="/epulet/"`. *(new)*
- All earlier paragraphs are unchanged. The existing Építők test (one figure) still passes.

## `/lakok/`

- The class rename only: `story-band`, `story-figure`, `story-figure-pair` replace `lakok-band`, `lakok-figure`, `lakok-figure-pair`. Counts and order are unchanged.

## Home timeline

- `data-event-id` count = parsed events (existing check), which is now 7 higher than before.
- The events `1899-apr-15-…`, `1899-maj-18-jovahagyjak-markus-geza-epitkezesenek`, `1899-jul-…`, `1900-szept-29-…`, `1901-apr-20-a-vii-keruleti-eloljarosag`, `1901-jul-2-…`, `1942-…`, `1948-…` (the D18 one) and `1956-aug-22-…` exist with `data-category="house"`. *(new)*
- Site-relative source links render as `<a href="/epulet/#…">` without `rel` and without the external-link icon. *(new)*
- Every `href="/page/#id"` on any built page resolves to an element with that id on the target page (linkinator only checks same-page fragments). *(new)*
- The rendered home page contains none of: `tervlapja nem került elő`, `aláírt tervlap nem került elő`, `valószínű tervező`, `csak egy későbbi közlésben szerepel`. *(new, SC-007)*

## Source images *(new)*

- Every file in `src/assets/pages/epulet/` has no EXIF block, and its orientation is absent or 1 (read with sharp). *(SC-006)*

## Unit (`tests/unit/parse.test.ts`) *(new)*

- A source cell with `[Épület](/epulet/#erkely)` parses to `{ label: 'Épület', url: '/epulet/#erkely' }`.
- Source cells with `//example.com/x`, `http://example.com` or `epulet/` (no leading slash) are rejected with a parse error naming the cell.
- A description cell with a site-relative link is still rejected (https-only there).
