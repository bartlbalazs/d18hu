# Research: Timeline update from the October 2026 research

## R1. Where the new content goes

- **Decision**: Add the new events as rows in `input/timeline.md` and their titles and image metadata in `editorial/events.yaml`. Copy cropped images to `assets/events/forrasok/` and reference them from the row's `Kép URL`. `pnpm images:fetch` then copies them into `src/assets/archive/` and the manifest.
- **Rationale**: This is the existing pipeline ([timeline-source contract](../001-d18-history-timeline/contracts/timeline-source.md), [editorial contract](../001-d18-history-timeline/contracts/editorial-metadata.md)). The build stays offline, and `images:fetch` only copies local files, so no network is needed at build time.
- **Alternatives considered**: A separate data file for research events. Rejected: it would split one timeline into two sources and need parser changes.

## R2. Event ids when existing rows change

- **Finding**: An event's id is its date label plus the first four words of its description (`src/lib/timeline/ids.ts`). Changing either orphans its `editorial/events.yaml` entry, and the build fails listing the orphan.
- **Decision**: In M1, M2 and M5, keep the row's date and opening words, and add the new facts after them. In M6, the date and opening words change, because the old text is wrong (Plan → Flam). The old editorial key is renamed to the new id. In M3, the Drescher row is replaced by N5 and its editorial key is deleted.
- **Alternatives considered**: Keeping the wrong M6 opening to preserve the id. Rejected: the id would describe a misread name.

## R3. Date labels

- **Finding**: `deriveDates` produces a machine-readable date only from `YYYY`, `YYYY. hó.` and `YYYY. hó. D.` labels and ranges of two such labels. Anything else (e.g. `1931. okt. 1–3.`, `1940/41`) is published as written, without a derived date. Existing rows already use both kinds.
- **Decision**: Use the existing abbreviated style (`jan.`, `febr.`, `márc.`, `ápr.`, `máj.`, `jún.`, `júl.`, `aug.`, `szept.`, `okt.`, `nov.`, `dec.`). Use a derivable form where it loses nothing; otherwise keep the precise label. The labels are fixed in [contracts/new-events.md](contracts/new-events.md).

## R4. Era placement

- **Finding**: The parser places each row in the era section it is written in, and does not check its date against the era's range. "1945 után" already sits in 1939–1945.
- **Decision**: Place each row in the era of its start date, in chronological order within the section. N23 (1945–1954) goes at the end of 1939–1945. The resulting split is 1 / 22 / 7 / 4 new events. Every era keeps well over two events at the Ház setting (SC-006).

## R5. Getting source images

- **Finding**: Probed on 2026-10-11. EPA (`epa.oszk.hu`, `epa.hu`) and the Holocaust archive portal serve PDFs to scripts (HTTP 200/206). `library.hungaricana.hu` and `archives.hungaricana.hu` answer scripted requests with **403 Forbidden**, so their page images can't be downloaded by script. `pdftoppm` (Poppler) and `sharp` are available locally.
- **Decision**:
  - **PDF sources** (7 events plus M6): download the PDF to the session scratchpad, render the cited page with `pdftoppm` at 300 dpi, and crop the relevant entry. These are N1, N8, N12, N20, N22, N31 and N32, plus M6.
  - **Hungaricana sources** (23 events, N9 only if its page shows the car): open the cited page in the owner's Chrome through the browser automation (`claude-in-chrome`) and save the page image at full zoom into the session scratchpad, then crop locally. The owner chose this on 2026-10-11. Manual saving by the owner into `~/Downloads/timeline_update/pages/` is only the fallback for a page that can't be captured legibly that way.
  - **Capture method, checked 2026-10-11 (T003)**: the `claude-in-chrome` browser tools weren't available in the implementation session, so no Hungaricana page could be captured. The fallback applies: the owner saves the cited pages into `~/Downloads/timeline_update/pages/`, and the crops (T037–T040) are made from those files.
  - **Catalogue-only events** (N5, N15, N24, N28): no image, as agreed.
  - **N9** (small car): use the Zsuppán 1994 book page only if it shows the car. Otherwise there is no image; a modern website's photo is not a source document.
  - **N6** (Olympics): crop the NFI newsreel catalogue card that names Uhereczky. It is a cited source document, while a film frame isn't available as a still.
- **Rationale**: This follows the agreed rule that only crops of the event's own sources are used (FR-008). Downloads go to the scratchpad, never into the repository; only the finished crops are committed.
- **Alternatives considered**: Hot-linking Hungaricana viewer images. Rejected: the constitution forbids runtime third-party requests, and the host blocks scripted access anyway.

## R6. Crop format and naming

- **Decision**: Use PNG for text documents, saved as `assets/events/forrasok/<date>_<N##>_<slug>.png`, e.g. `1916-04-23_N01_pogany-olaj.png`. This mirrors the existing `hirdetesek/` naming. A crop shows the relevant entry plus enough context to recognise the publication (masthead or column heading when it is near). The longer side is at least 1200 px. Over-large crops are reduced before committing, so the build's responsive variants stay within the image budget.
- **Rationale**: The existing clippings use this form. The build already produces AVIF/WebP variants with `srcset`.

## R7. Image metadata

- **Decision**: Every image gets `alt`, `caption`, `credit` (publication / archive, e.g. "Debreczeni Újság / OSZK – EPA"), `license: "felhasználási licenc nem ellenőrzött"` unless a licence is stated, `sourceUrl` (the cited page), `sourceLabel`, `depictsHouse: false` and `kind: document`. Captions say what the crop shows. They add a limit when the reader could over-read it, e.g. "a hirdetés üzleti címet igazol, nem műhelyt".
- **Rationale**: This matches the existing `hirdetesek` and Spitz entries in `editorial/events.yaml`.

## R8. The three fixes to existing items

- **Illés description** (`editorial/music.yaml`, last item): replace „mire a timeline elér 1968-hoz” with „mire krónikánk 1968-hoz ér”. „Krónika” fits the house-history register and avoids the anglicism; the fallback „idővonal” isn't needed. The other four "timeline" mentions are in `recording_note` fields. They are out of scope and listed as a follow-up.
- **1889 street naming**: set the row's `Kép URL` to `assets/events/budapest_1903.jpg`. Add an image block with the existing map alt and credit, and a caption saying the 1903 map shows the street fourteen years after the naming.
- **1901 permit**: copy `src/assets/pages/epulet/06-hasznalhatasi-engedely-1901.png` to `assets/events/1901-04-20-hasznalhatasi-engedely.png` and point the row's `Kép URL` at it. Replace the image block with the Épület page's alt text and caption (`src/lib/epulet/figures.ts`, `occupancyPermit1901`) and the credit "Fotó: a szerző".
  - **Alternative rejected**: widening `LOCAL_IMAGE_PATH` to accept `src/assets/pages/…`. A parser change for one image isn't worth it. The archive step copies the file anyway, so a copy under `assets/` costs no extra published bytes.

## R9. Counts and documentation

- **Finding**: `input/timeline.md` has 142 events today. The home page meta description still says "108 esemény", which is already stale. The era kickers compute their counts.
- **Decision**: After the update the timeline has 142 + 34 − 1 = **175** events. Update the meta description to "175 esemény"; its length stays within 50–160 characters. The README states only the 1873–1968 range, and the eras and range are unchanged. The README's content summary is updated only if it states an event count or lists event sources that this update changes.

## R10. Text rules for uncertain events

- **Decision**: Valószínű and Feltételezés events say in their own text what is documented and what is inferred, in one sentence, using the research's wording where possible. N34 also names the case type (árucsempészés), the sentence type (fogház) and the separate currency-case acquittal. It says the reports carry no personal data linking the haulier to the Olympian or the 1924 resident. Events in one thread (Wágner, Márkus, Uhereczky) each stand on their own.
