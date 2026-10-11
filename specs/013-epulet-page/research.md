# Research: Épület page

All open points from the Technical Context are resolved here. No [NEEDS CLARIFICATION] remains.

## R1. Opening image

- **Decision**: Open the page with `assets/facade4.png`, the present-day façade photo used for the home page. It is already committed.
- **Rationale**: The draft's lead contrasts the street façade with the 1899 plan: the faces around the windows and the "szokatlan vonalú" roofline. facade4 shows both the wavy roofline and the window frames with mascarons. The Lakók page (facade6, the gate) and the Építők page (facade5, a detail) use other photos, so each story page keeps its own opening.
- **Alternatives considered**: Opening with the 1899 elevation (`4.png`) was rejected because it would show the plan before the reader meets the building it differs from. A new photo was rejected because none was supplied.

## R2. Cleaning the phone photo (`1.jpg`)

- **Finding**: `1.jpg` is 4000 × 3000 with EXIF orientation 6 (rotate 90°), GPS data and camera data. Astro's sharp service already auto-rotates and drops metadata in the images it generates, but the source file would be committed to the public repository with its GPS location.
- **Decision**: Before committing, create a cleaned copy once. It is rotated to upright, stripped of all metadata and scaled so its long edge is 2400 px, which is the viewer's maximum (`fullSizeImage`). The cleaning uses the existing `sharp` dependency, run on the downloaded file passed as a path argument. The other 12 images carry no EXIF data and are committed as delivered.
- **Verification**: A site test reads every source image in `src/assets/pages/epulet/` with sharp and expects no `exif` block and orientation 1 or none (SC-006).
- **Alternatives considered**: Relying on the build alone was rejected, because the location would still be in the git history.

## R3. Sharing the story-page building blocks

- **Finding**: Lakók has the era bands (`.lakok-band--1…4` in `story.css`) and the figure sizing helper (`figureProps` and `LakokFigure` in `src/lib/lakok/figures.ts`). Épület needs both.
- **Decision**: Generalise them, without changing how they look.
  - Move the `StoryFigure` type and `figureProps` to `src/lib/images/story-figures.ts`. `src/lib/lakok/figures.ts` keeps only its data, and the new `src/lib/epulet/figures.ts` holds the Épület data.
  - Rename the CSS classes `lakok-band*` to `story-band*` and `lakok-figure*` to `story-figure*`. Lakók and its site tests are updated in the same mechanical rename.
- **Rationale**: Using Lakók-named classes on the Épület page would mislead readers of the code. Copying the rules would duplicate about 80 lines of CSS that must stay in sync with the size table in TypeScript.
- **Alternatives considered**: Copy-paste per page was rejected, as was a shared component wrapper, which adds an abstraction the two pages don't need.

## R4. Era tones for the Épület sections

- **Decision**:

| Section | Band |
|---|---|
| Lead (with opening image) | normal background |
| A telek gazdát cserél … Erkély a kapu fölött (6 sections) | `story-band--1` (1873–1913) |
| A Spitz név megmarad | `story-band--2` (1914–1938) |
| Helyreállítás … A gang új lemezeket kap (3 sections) | `story-band--4` (1946–1968) |
| Az első tervtől a mai házig, Források | normal background |

- **Rationale**: This follows the spec (User Story 3, scenario 2). Neighbouring sections with the same tone form one continuous colour run, which reads as a single era. The dark era 3 band is not used, because no section is about 1939–1945; the Spitz section only mentions the persecution and points to Lakók.

## R5. Source references to images and internal links

- **Decision**: Each figure gets a stable id (`kep-1`, `kep-2`, … `kep-5a`, `kep-5b`, … `kep-11`). In the source list, the file names in the draft ("1.jpg") become anchor links to these ids, labelled in Hungarian ("1. kép"). `EvidenceFigure` gains an optional `id` prop. The absolute `https://www.dembinszky18.hu/epitok/` and `/lakok/` links become `/epitok/` and `/lakok/`.
- **Rationale**: FR-006 and the edge case on absolute links. `linkinator --check-fragments` then verifies every reference.

## R6. Internal source links on the timeline

- **Finding**: `assertHttpsUrl` rejects anything except `https://` in the timeline's "Külső forrás" cells. `TimelineEvent.astro` renders every source with `rel="noopener noreferrer"` and an external-link icon. Most new events (and the corrected ones) have the Épület page as their only source.
- **Decision**: In the source cell only, also accept site-relative links that start with a single `/` (for example `/epulet/#erkely`). They render without `rel` and without the external icon. *Implementation finding*: `linkinator --check-fragments` only checks fragments on the page itself, so a site test now resolves every `href="/page/#id"` against the built target page. Description text and `Kép URL` keep the https-only rule. Unit tests in `parse.test.ts` cover both an accepted relative link and a rejected `//host` or `http://` link.
- **Alternatives considered**: Writing `https://www.dembinszky18.hu/epulet/#…` was rejected because the link checker skips `https://`, so a broken anchor would go unnoticed. It would also leave the site in local previews.

## R7. Event ids that change

- **Finding**: An id is the slug of the date label plus the first four words of the description. No code or page links to the four affected ids; only `editorial/events.yaml` uses them.
- **Decision**: Where natural Hungarian allows, keep the first four words, so "1901 körül" keeps "A megvalósult ház tervlapja". Otherwise rename the `events.yaml` key in the same change: 1899 → 1899. máj. 18., 1901. ápr. 20., and 1960. jan. 25. The build's existing check names any orphaned key. Old fragment URLs shared outside the site stop resolving to an event, but they still land on the home page. This is acceptable and matches how the site has always handled id changes.
- **Decision**: The 1901 April 20 event keeps its current image (Homolka's 1903 map) and title slot (FR-012). The permit photo stays on the Épület page, consistent with "no images on timeline events" for the new rows.

## R8. Certainty values

- **Decision**: The new events and the corrected 1901 rows use "Igazolt", because each rests on a contemporary document (land register, plan sheet, permit, directory). The 1960 death row stays "Valószínű". Its date comes from a later biography, and the legend reserves "Igazolt" for contemporary documents or first-hand memories. Only its wording about the plan changes.

## R9. Header width with five page links

- **Finding**: From 900 px the header shows the brand, four era links and the page links in one row (`base.css`, `@media (min-width: 900px)`). Adding "Épület" makes it about 60 px wider.
- **Result**: At 900 px the row lost its right gutter ("Impresszum" touched the edge). The breakpoint moved to 940 px, where the gutter matches the four-link header at 900 px.
- **Decision**: Measure at 900 px and 1000 px after the change. If the row wraps or overflows, raise the one-row breakpoint to the first width where it fits; below that the Menü button already handles it. The site tests already assert the link order; the width check is manual (quickstart step 4).

## R10. Fonts

- **Finding**: The draft uses only characters inside the existing subsets: Latin-1, including `§`, U+00A7; ő/ű/Ő; and `–„”` in U+2010–2027. No font change is needed.

## R11. The Építők postscript

- **Decision**: A new paragraph goes after `<p class="story__closing">`, styled as `story__postscript`: a thin top rule and a small top margin. That way it reads as a later addition rather than a replacement for the closing line. The earlier text stays word for word (FR-011). The proposed wording is in [data-model.md](data-model.md#építők-postscript).

## R12. Timeline text that still contradicts the findings

- **Finding**: The phrases to remove are "tervlapja nem került elő", "aláírt tervlap nem került elő", "valószínű tervező" and "csak egy későbbi közlésben szerepel". They appear in `input/timeline.md` rows 28, 29 and 156 and in the `events.yaml` title of `1901-korul-a-megvalosult-haz-tervlapja`.
- **Decision**: A site test asserts that none of these phrases appear in the built home page (SC-007). The earlier Építők sections are excluded by the user's decision to keep them unchanged, and the postscript then resolves them.
