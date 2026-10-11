# Data Model: Épület page

No new data formats are introduced. The feature adds records to existing ones: a hand-authored page, a figure table in TypeScript, rows in `input/timeline.md`, and entries in `editorial/events.yaml`.

## Story figure (`src/lib/images/story-figures.ts`, shared)

Moved from `src/lib/lakok/figures.ts` and renamed `StoryFigure` (research R3). The fields are unchanged.

| Field | Type | Rule |
|---|---|---|
| `image` | `ImageMetadata` | Imported from `src/assets/pages/<page>/` |
| `alt` | string | Describes what the document shows, not what it proves |
| `caption` | string | Taken verbatim from the draft, without the trailing "Fotó: a szerző." |
| `credit` | string | `Fotó: a szerző` for every Épület figure |
| `source` | `{ label, url }` | Optional, because Épület figures have no online original (the type is widened from required) |
| `kind` | `'photo' \| 'document'` | `document` for the 12 Épület document figures |
| `size` | `'narrow' \| 'medium' \| 'wide' \| 'column'` | Display width class |
| `label` | string | Optional |
| `id` | string | Optional, new. It is the anchor that source entries link to (`kep-…`) |

`figureProps(figure)` keeps its behaviour: it never upscales and never crops, strips get the moved zoom button, and the classes become `story-figure--*`.

## Épület figures (`src/lib/epulet/figures.ts`)

| Key | File in `src/assets/pages/epulet/` | From | Size | Anchor | Placed after |
|---|---|---|---|---|---|
| `approvalSignature1899` | `01-jovahagyas-markus-1899.jpg` | `1.jpg`, cleaned (R2) | medium | `kep-1` | 1st ¶ of "Márkus háza a rajzasztalon" |
| `elevationClause1899` | `02-homlokzat-zaradek-1899.png` | `2.png` | medium | `kep-2` | the previous figure |
| `section1899` | `03-metszet-1899.png` | `3.png` | medium | `kep-3` | ¶ "A ház földszintből és három emeletből…" |
| `elevation1899` | `04-homlokzat-1899.png` | `4.png` (the draft says `4.jpg`) | wide | `kep-4` | ¶ "A terven a díszítés még szabályos rendbe…" |
| `mellingerStamp` | `05a-mellinger-belyegzo.jpg` | `5a.jpg` | column | `kep-5a` | last ¶ before "Lakások az eredeti alaprajzon" |
| `sharedToilets` | `05b-closettek.jpg` | `5b.jpg` | column | `kep-5b` | ¶ "Az alaprajzon ábrázolt kisebb…" |
| `occupancyPermit1901` | `06-hasznalhatasi-engedely-1901.png` | `6.png` | medium | `kep-6` | ¶ "Egy kézzel beírt feltétel…" |
| `balconyPlan1901` | `07-erkely-1901.png` | `7.png` | column | `kep-7` | ¶ "Az új erkély az első emeleti lakásnak…" |
| `restorationTitle1948` | `08-helyreallitas-1948.jpg` | `8.jpg` | column | `kep-8` | ¶ "Az 1942-es címtár és az 1948-as terv között…" |
| `approval1956` | `09-zaradek-1956.jpg` | `9.jpg` | narrow | `kep-9` | ¶ "Egy lakás megosztása…" |
| `galleryDescription1969` | `10-fuggofolyoso-leiras-1969.png` | `10.png` | medium | `kep-10` | ¶ "Ez szerkezeti beavatkozás volt…" |
| `galleryPlan1969` | `11-fuggofolyoso-alaprajz-1969.png` | `11.png` | column | `kep-11` | ¶ "A tervező erre is adott választ…" |

Plus the opening figure: `assets/facade4.png`, eager, cropped to 4:3 like Lakók, with an alt text describing the wavy roofline and the window frames with faces.

The page has 13 `<figure class="evidence">` elements: the opening photo and the 12 document images. The site test asserts 13.

## Page sections (`src/pages/epulet/index.astro`)

| id | Heading (h2 unless noted) | Band |
|---|---|---|
| — | h1 "Épület" + lead (4 ¶) + opening figure | none |
| `telek` | A telek gazdát cserél | 1 |
| `rajzasztal` | Márkus háza a rajzasztalon | 1 |
| `arveres` | Árverés az építkezés idején | 1 |
| `mellinger` | Mellinger a tervlapon (h3 `alaprajz` "Lakások az eredeti alaprajzon", h3 `homlokzat` "A homlokzat másik arca") | 1 |
| `hasznalatba-vetel` | Használatba vétel 1901 tavaszán | 1 |
| `erkely` | Erkély a kapu fölött | 1 |
| `spitz-nev` | A Spitz név megmarad | 2 |
| `helyreallitas` | Helyreállítás egy első emeleti lakásban | 4 |
| `lakasmegosztas` | Több lakás a régi falak között | 4 |
| `gang` | A gang új lemezeket kap | 4 |
| `osszegzes` | Az első tervtől a mai házig | none |
| `forrasok` | Források és továbbolvasás (11 `<li id="forras-N">`) | none |

Source markers follow the Lakók rules: `[1–2]` links 1 and 2, and `[1–3]` links 1 and 3. Each section id above is also a target for timeline source links.

Metadata: title `Épület – Dembinszky utca 18.`, a description of 50–160 characters, path `/epulet/`, and JSON-LD `WebSite`, `BreadcrumbList` (Dembinszky utca 18. › Épület), `Article` (image = opening), and one `ImageObject` per figure (credit `Fotó: a szerző`).

## Navigation

The `pages` array in `SiteHeader.astro` and the footer list become: `/epulet/` Épület, `/epitok/` Építők, `/lakok/` Lakók, `/nevado/` Névadó, `/impresszum/` Impresszum. The sitemap gains `/epulet/`.

## Építők postscript

The draft wording is for the owner to review. It goes after `<p class="story__closing">` as `<p class="story__postscript">`:

> Ez a tervlap azóta előkerült. A ház módosított emeleti alaprajzán Mellinger Artúr bélyegzője és aláírása áll; a telekkönyvből kiderül, hogyan szerezte vissza a telket árverésen Spitz János Ferenc és felesége, a VII. kerületi elöljáróság 1901. április 20-i használhatási engedélye pedig Spitzet nevezi meg háztulajdonosként. A fellelt iratok alapján a szerzőségi kérdés nagy valószínűséggel lezárható Mellinger Artúr javára. A részleteket az [Épület](/epulet/) cikk mutatja be.

## Timeline rows (`input/timeline.md`)

All rows use the lane `D18`. Columns: Dátum | Sáv | Leírás | Bizonyosság | Külső forrás | Kép URL | Cikkötlet. The wording below is a draft for owner review. `TK` stands for `[Telekkönyv, 16504. sz. betét](https://archives.hungaricana.hu/hu/lear/Telekkonyv/31064/view/?image=0&pg=0)`.

### Corrected rows

| Old id → new id | Date label | Description | Certainty | Sources | Title in `events.yaml` |
|---|---|---|---|---|---|
| `1899-egy-helytorteneti-feldolgozas-szerint` → `1899-maj-18-jovahagyjak-markus-geza-epitkezesenek` | 1899. máj. 18. | Jóváhagyják **Márkus Géza** építkezésének terveit: pince, földszint, három emelet és magastető, a homlokzat közepén háromszögű oromzattal, az első emeleti ablakok fölött kagylódíszekkel. A homlokzati rajzot és a metszetet **Horváth Pál** építőmester írja alá. A ház végül nem ebben a formában épül fel. | Igazolt | [Épület](/epulet/#rajzasztal), [A mi Erzsébetvárosunk](https://mierzsebetvarosunk.blog.hu/2015/05/30/dembinszky_utca_18) | Márkus Géza 1899-es terve |
| `1901-apr-20-kozolt-datum-a-heted7-szerint-ezen` → `1901-apr-20-a-vii-keruleti-eloljarosag` | 1901. ápr. 20. | A VII. kerületi elöljáróság kiadja a ház használhatási engedélyét. Az irat **Spitz János Ferencet** nevezi meg háztulajdonosként, újonnan épült háromemeletes bérházról beszél, és kézírással megtiltja, hogy a pincehelyiségeket műhelyül vagy lakásul használják. | Igazolt | [Épület](/epulet/#hasznalatba-vetel), [Heted7, 9. oldal](https://www.facultas.hu/heted7-magazin/files/hetedhedhet_2016-07.pdf) | A ház használhatási engedélye (the image entry stays) |
| `1901-korul-a-megvalosult-haz-tervlapja` (unchanged) | 1901 körül | A megvalósult ház tervlapja, a módosított emeleti alaprajz **Mellinger Artúr** bélyegzőjét és aláírását viseli; mellette Horváth Pál építőmester neve áll. A telekkönyvvel és a használhatási engedéllyel együtt ez Mellinger tervezői szerepét igazolja. A mai homlokzat rajza nem került elő. | Igazolt | [Épület](/epulet/#mellinger), [Heted7](https://www.facultas.hu/heted7-magazin/files/hetedhedhet_2016-07.pdf) | Mellinger Artúr, a ház tervezője |
| `1960-jan-25-a-haz-valoszinu-tervezojekent` → `1960-jan-25-ezen-a-napon-hal` | 1960. jan. 25. | Ezen a napon hal meg **Mellinger Artúr**, a ház tervezője. Bélyegzője és aláírása a Dembinszky utca 18. módosított emeleti alaprajzán maradt fenn. | Valószínű (R8) | [Mellinger életútja](https://pestbuda.hu/cikk/20250622_finom_eleganciarol_tanuskodo_epuletek_150_eve_szuletett_mellinger_artur), [Épület](/epulet/#mellinger) | Meghal Mellinger Artúr |

### New rows

| Date label | Placed after | Description | Sources | Title |
|---|---|---|---|---|
| 1899. ápr. 15. | 1898. okt. 11. | **Márkus Géza** építész megveszi a telket Schuller Miksától, Kürzweil Herminától, **Spitz János Ferenctől** és **Schuller Laurától**. A 36 625 forint 50 krajcáros vételárból 32 625 forint 50 krajcár hátralékként az ingatlanon marad. | TK, [Épület](/epulet/#telek) | Márkus Géza megveszi a telket |
| 1899. júl. | 1899. máj. 18. | A **Pesti Magyar Kereskedelmi Bank** 80 000 forintos jelzáloghitelét jegyzik be a telekre, a korábbi követelések elé sorolva. Ősszel a végrehajtás, 1900 tavaszán az árverés elrendelése is bekerül a telekkönyvbe. | TK, [Épület](/epulet/#arveres) | Bankhitel, majd végrehajtás |
| 1900. szept. 29. | 1900. júl. 22. | Az árverésen **Spitz János Ferenc** és **Schuller Laura** fele-fele arányban 137 005 koronáért szerzi meg az ingatlant, amelynek másfél évvel korábban még eladói voltak. Tulajdonjogukat 1901. április 16-án jegyzik be. | TK, [Épület](/epulet/#arveres) | Árverés: Spitzék visszatérnek |
| 1901. júl. 2. | 1901–1902 | Terv készül **Spitz János Ferenc és neje** házára: nyitott erkély a kapu fölé, az első emelet középső nyílásához, „Mátrai féle szab. vasbeton” szerkezettel. Az erkély elkészültének napját nem ismerjük. | [Épület](/epulet/#erkely) | Erkély a kapu fölé |
| 1942 | 1941. júl. 4. | Az ingatlancímtár **özv. Spitz János Ferencnét** nevezi meg tulajdonosként, 26 448 pengő évi adóköteles bérjövedelemmel. Az 1931-es házjegyzék még Spitz János Ferencet, az 1933–1934-es címtár már özvegyi névalakot közöl. | [1942-es ingatlancímtár](https://library.hungaricana.hu/hu/view/FszekCimNevTarak_18_016_03/?pg=271), [Épület](/epulet/#spitz-nev) | Spitz János Ferenc özvegye a tulajdonos |
| 1948 | 1948 (Magyarország) | Helyreállítási terv készül az I. emelet 1. számú lakásához. Tervezője **Rajna Ernő** okleveles építészmérnök, építtetője **Jacobi Dénesné**, a háztulajdonos rovatban már **dr. Miletits Györgyné** neve áll. A tulajdonváltás idejét és jogcímét nem ismerjük. | [Épület](/epulet/#helyreallitas) | Helyreállítás az első emeleten |
| 1956. aug. 22. | 1955 | Jóváhagyják a ház lakásmegosztási tervanyagát, még a forradalom előtt. A nagyobb lakások kisebb egységekre bontásával új lakáshatárok jönnek létre; a létrejött lakások számát a záradék nem közli. | [Épület](/epulet/#lakasmegosztas) | Lakásmegosztás |

Each row: certainty `Igazolt`, `Kép URL` `—`, `Cikkötlet` `—`. New D18 events: 7 (8 dated events in spec User Story 5, one of which replaces the 1899 row).

### Open questions (unpublished, after the fourth era)

| Entry | Change |
|---|---|
| "1901. április 20. mint bizonyított átadási nap" | Removed: the permit answers it |
| "1931 utáni automatikus öröklés…" | Narrowed: the widow's name form appears from 1933–1934, and she is listed as owner in 1942. The mode and shares of the inheritance remain unknown |
| "1945–1955: államosítás, konkrét tulajdonoscsere…" | Narrowed: by 1948 dr. Miletits Györgyné is the owner. The date and title of the transfer and the nationalisation date remain unknown |

## Validation rules (enforced by build and tests)

- Every new or renamed event id has a `title` in `events.yaml`, and no orphaned keys remain (existing editorial audit).
- Source cells accept `https://` links and site-relative `/…` links only (R6).
- Rows stay in date order within their era (existing parser check).
