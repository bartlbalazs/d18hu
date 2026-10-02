# Contract: `/lakok/` images

This replaces the image clauses of `specs/007-lakok-page/contracts/site-pages.md` and of feature 008. Everything else in those contracts still holds. `tests/site/output.test.ts` enforces it.

## Figures

- The page has exactly 15 `figure.evidence` elements: the façade and the 14 source images.
- Only the façade figure has `loading="eager"`. The other 14 `<img>` elements have `loading="lazy"`, plus `width` and `height` attributes.
- Every figure has a non-empty `alt`, a `figcaption` and a `.evidence__credit` containing an `<a href="https://…">` source link. Every source image's link text is "eredeti forrás".
- Every figure's zoom link points to a file in `/_astro/`.
- The figures appear in this order relative to the headings:

  | Figure (file name stem) | After heading | Before heading |
  |---|---|---|
  | `18-armandola-hangverseny-1902` | Armandola Aranka | Almássy Iza |
  | `16-almasi-iza-portre-1900`, then `17-iza-cake-walk-1903` | Almássy Iza | Kramer Lipót A. |
  | `04-mautner-perfector-1899` | Mautner Adolf | Sztankovits Ödön |
  | `19-szello-cikkkezdet-1900`, then `20-szello-cikkvege-1900` | Szellő Sándor | `h2#vasut-1922` |
  | `21-graselly-lajosmizse-1911` | Graselly Miklós | Petrovits Róbert |
  | `07-petrovits-1902`, then `08-petrovits-1922` | Petrovits Róbert | Takács Eberhard Árpád |
  | `09-takacs-auto-1922` | Takács Eberhard Árpád | Dr. Merényi József |
  | `12-csillagos-hazak-1944` | `h2#csillagos-haz` | `h2#gepek-1954` |
  | `13-gepeszek-1954` | `h2#gepek-1954` | Az 1954-es választói névjegyzék házbeli listája |
  | `14-mozigepesz-1954` | Kovács Jánosné, Ballák Magda | Horváth János |
  | `15-idoelemzes-1949` | Horváth János | Lőwy Lipót Pálné, Beer Olga |

  The paragraph rule from spec FR-001 holds as well. For example, `16` comes after the first paragraph of its section and `17` after the second, with a `<p>` between them.
- The 1944 section (`section[aria-labelledby="csillagos-haz"]`) contains exactly one figure.
- The two pairs are each a `div.lakok-figure-pair` holding exactly two figures. The Szellő figures show "Cikkkezdet, 377. oldal" and "Zárórész, 379. oldal" in `.evidence__label`.
- None of these file name stems appears: `01-armandola-1902`, `02-almassy-iza-1902`, `03-rothauser-1902`, `05-szello-iskola-1914`, `06-spitz-1902`, `10-merenyi-1922`, `11-adam-szemfedel-1922`.

## Unchanged

- The JSON-LD `@graph` still holds `WebSite`, `BreadcrumbList`, `Article` and exactly one `ImageObject` (the façade).
- The page text, the name lists, the sources 1–27 and the correction note are unchanged.
