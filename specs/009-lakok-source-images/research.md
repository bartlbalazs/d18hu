# Research: Lakók source images

## R1 – What is taken from the package

- **Decision**: Copy only the 14 image files into `src/assets/pages/lakok/`, keeping their package names (for example `18-armandola-hangverseny-1902.png`). Copy each record's `caption`, `alt`, `credit` and `source_url` into `src/lib/lakok/figures.ts` by hand. Do not commit `kepjegyzek.json`, the guide or `attekinto.jpg`.
- **Rationale**: FR-002 rules out copying `rights_category` and the guide's rights and display notes. Hand-copying only the published fields leaves nothing else to filter out. Keeping the file names makes each image easy to trace to the package, and the names also feed the existing `data-stat-image` statistic.
- **Alternatives**:
  - Reading `kepjegyzek.json` at build time. Rejected: the rights field would then sit in the repository.
  - Renaming the files. Rejected: the numbers would no longer match the package.

## R2 – Width classes

- **Decision**: Use four classes, each a maximum width that sits inside the guide's range:

  | Class | Max width | Images |
  |---|---|---|
  | `lakok-figure--narrow` | 25rem (400 px) | 18, 13 |
  | `lakok-figure--medium` | 30rem (480 px) | 16, 04, 21, 12 |
  | `lakok-figure--wide` | 38.75rem (620 px) | 17, 07, 08, 09, 14 |
  | none | the column, 44rem (704 px) | 19, 20, 15 |

  Figures are left-aligned, like the Névadó portrait.

  Images wider than 3.5 : 1 (07, 08, 09, 19 and 20) also get `lakok-figure--strip`. This class moves the zoom button below the image, right-aligned, instead of over it. On a phone these strips are only about 50 px tall, so the overlaid 44 px button hid part of their text ("Dem-binszki" in 07). This was found during the T016 manual check.
- **Rationale**: The project uses modifier classes, not inline styles (`story__opening--portrait`). Four sizes cover all the guide's ranges. For 19, 20 and 15 (620–680 px), the 704 px column is close enough.
- **Alternatives**: A per-image `max-width` through a style attribute or a CSS custom property. Rejected: it would be the site's only inline style, for no visible gain.

## R3 – Responsive sizes

- **Decision**: `figureProps()` works out `widths` and `sizes` from the class width W and the source width N:
  - `widths` = the distinct values of `min(N, 360)`, `min(N, W)` and `min(N, 2W)`
  - `sizes` = `(min-width: W+2·gutter) Wpx, 100vw`

  No image is cropped (no `crop` prop). Scans use `kind: 'document'`. The photos (13, 14) and the portrait (16) use `photo`. Quality is left at Astro's default, because small print needs it more than the façade photo does.
- **Rationale**: This matches the façade and Névadó pattern, and it never upscales a source: the strips are only 760–788 px wide. The `document` kind already letterboxes on a paper tone and caps the height at 80svh.

## R4 – Loading and the initial-weight budget

- **Decision**: All 14 images keep `EvidenceFigure`'s default `loading="lazy"`, `decoding="async"` and explicit `width`/`height`. The first one (18) is far below the fold: after the method paragraph, the first band heading, a closed name list and three paragraphs. Lighthouse CI's `total-byte-weight` check confirms that Chrome's lazy-load margin doesn't pull it in.
- **Fallback**: If the Lighthouse check fails, give image 18 a smaller first `srcset` entry. The image stays where it is.

## R5 – The two pairs

- **Decision**: Each pair goes in a `<div class="lakok-figure-pair">`. It is a grid with a 1.375rem (22 px) gap and holds two `EvidenceFigure`s, each with its own caption and viewer link.
  - **Szellő**: each figure uses the new optional `label` prop: "Cikkkezdet, 377. oldal" and "Zárórész, 379. oldal". The label is shown as `<span class="evidence__label">` before the caption.
  - **Petrovits**: the catalogue captions already begin with "1902–1903:" and "1922–1923:", so these images get no label. A label would repeat the caption (see commit 0c97e7e).
- **Rationale**: Two figures keep each part's own alt text, credit and source link (FR-002). A visible gap and label show that the two clips come from separate pages (FR-006).
- **Alternatives**: One figure holding two images. Rejected: one caption can't hold two credits, and the viewer would need gallery grouping.

## R6 – Captions on the dark 1944 band

- **Decision**: In `story.css`, add `--d18-muted: var(--era-3-ink)` to `.lakok-band--3`. Links in band 3 are already light.
- **Rationale**: `.evidence figcaption` uses `--d18-muted`. The light bands already redefine it as `--era-muted` for contrast, but band 3 has no override, so its captions would fail AA.

## R7 – Print

- **Decision**: In `story.css`'s existing `@media print` block:
  - `.lakok .evidence { break-inside: avoid }`
  - `.lakok .evidence img { max-height: 12cm; width: auto }`
  - `.lakok .evidence__zoom { display: none }`
- **Rationale**: This meets the spec's half-page limit (12 cm is under half of an A4 page) and keeps the caption with its image.

## R8 – Source link label and missing-data guard

- **Decision**: Every image shows its catalogue credit word for word, followed by a link labelled "eredeti forrás" to `source_url`. In `figures.ts`, `caption`, `alt`, `credit` and `source` are required fields, so `astro check` (which `site:publish` runs) fails if one is missing. The site tests also check every figure on the page for a credit and an `https:` source link (FR-010).
- **Rationale**: The credits already name the collection, so a uniform label avoids repeating it. A type check plus a test covers FR-010 without a separate release-mode audit.
