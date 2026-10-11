---

description: "Task list for the timeline update from the October 2026 research"
---

# Tasks: Timeline update from the October 2026 research

**Input**: Design documents from `/specs/014-timeline-research-update/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/new-events.md, quickstart.md

**Tests**: No new automated tests are requested. The existing unit and site suites, HTML validation, link checks and Lighthouse are run in the final phase.

**Sources**: The research files are `/home/bartlbalazs/Downloads/timeline_update/events_patch.md` (P) and `/home/bartlbalazs/Downloads/timeline_update/uhereczky_d18_kutatas.md` (U). Every event's date label, lane, certainty, source rows, image page and title are fixed in [contracts/new-events.md](contracts/new-events.md). Base each event's Hungarian text on its research row(s), and keep every limit the research states (FR-004). Never use dembinszky18.hu as a source.

**Scratch work**: Downloads, rendered pages and crop scripts go in the session scratchpad, never in the repository. Pass downloaded paths to scripts as arguments, and run Node from the repository root.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 = agreed list, US2 = new stories on the timeline, US3 = source images, US4 = three fixes to existing items

---

## Phase 1: Setup

- [X] T001 Create the folder `assets/events/forrasok/` for the new crops (research R6).
- [X] T002 [P] Copy `src/assets/pages/epulet/06-hasznalhatasi-engedely-1901.png` to `assets/events/1901-04-20-hasznalhatasi-engedely.png`, byte for byte (research R8).
- [X] T003 [P] Load the `claude-in-chrome` skill and open `https://library.hungaricana.hu/hu/view/FszekCimNevTarak_20_00_1920/?pg=443` (the N2 page) in the owner's Chrome. Find out how a full-resolution page image can be saved to the scratchpad. Try these in order:
  1. Read the viewer's page-image URL from the DOM and fetch it outside the browser.
  2. Use the extension's own capture at full zoom.
  3. If neither yields a legible file, fall back to the owner saving pages into `~/Downloads/timeline_update/pages/`.

  Record the working method in one line under research R5 in `specs/014-timeline-research-update/research.md`.

---

## Phase 2: Foundational

**⚠️ Must be complete before the user stories.**

- [X] T004 Run `pnpm build:draft` and `pnpm test` on the unchanged tree, and note any pre-existing failure. Later failures must not be confused with existing ones.

---

## Phase 3: User Story 1 – The agreed list is what gets published (Priority: P1) 🎯

**Goal**: Only the approved triage reaches the timeline.

**Independent Test**: Every candidate row in both research files maps to exactly one outcome in spec.md, and the timeline matches the list (the final check is T047).

- [X] T005 [US1] Cross-check `specs/014-timeline-research-update/spec.md` § Agreed triage against both research files: 83 P rows, 8 U rows and the U§6 court case. Every row must appear exactly once: as a new event (N1–N34), merged into one, a change (M1–M6), or dropped. Fix any gap in the spec and tell the owner before continuing.

**Checkpoint**: The triage is complete and approved; the content work can start.

---

## Phase 4: User Story 2 – Read the new stories on the timeline (Priority: P1)

**Goal**: 34 new rows and changes M1, M2, M3, M5 and M6 are in `input/timeline.md`, each with a title in `editorial/events.yaml`.

**Independent Test**: `pnpm build:draft` lists no event without a title and no orphaned key. Each new event appears in its era with the contract's date, lane and certainty, and its text claims nothing beyond its sources.

**Row rules for every task in this phase** (data-model.md):

- `Sáv`: "`D18`, `D18 • személy` or `Környék` only"
- `Esemény és jelentőség`: "Hungarian, 2–6 sentences. Facts, then the source's limits"
- `Bizonyosság`: "`Igazolt`, `Valószínű` or `Feltételezés`, by the weakest-link rule"
- `Külső forrás`: all `https://` links of the contract's source rows, as Markdown links separated by `, `
- `Kép URL`: `—` for now (set in US3)
- `Cikkötlet`: the research's idea, shortened
- **Placement**: "in the era of the start date, in chronological order. On equal dates, the new row goes after existing rows."
- **Style**: Bold the key names on first mention, as existing rows do. Valószínű and Feltételezés rows say in one sentence what is documented and what is inferred (research R10).

### Era 1873–1913

- [X] T006 [US2] In `input/timeline.md`, era 1873–1913, add N27 (`1908–1909`, Wágner's Pécs sentences) after the 1908. júl. 21. rows. Say these are not events in the flat; III/3 is a 1937 fact.

### Era 1914–1938

- [X] T007 [US2] In `input/timeline.md`, add N1 (`1916–1929`) and N28 (`1916–1934`) after the 1916 Spitz row.
  - N1 keeps the limit "no oil factory in the house, no continuous residence".
  - N28 says that 1931. márc. 10. is the proclamation date, not a date of death or inheritance, and that the catalogues name no heirs.
- [X] T008 [US2] In `input/timeline.md`, add N2 (`1920–1928`), N3 (`1920–1929`) and N4 (`1923`) in date order after the 1920. jún. 4. row.
  - N2 adds the limit that the practice location, flat and continuity are unknown.
  - N3 adds the limit that the garage itself is not shown to be in the building.
  - N4 adds the limit that the lists prove an address only, not ownership or building of D18. It also points to the 1912 Kalix Dembinszky 17 row.
- [X] T009 [US2] In `input/timeline.md`, replace the existing 1924 row "A kereskedelmi és ipari címtár a Dembinszky 18-at adja meg **Drescher Lipót**…" with N5 (`1924`, Igazolt; M3). Keep that row's 1924 directory link as an extra source. N5 says:
  - the shared "Lakhely/telephely" field leaves open whether this was a flat or a business address;
  - the content of the declaration and any partnership are unknown;
  - Drescher's III/5 address does not transfer to Uhereczky;
  - the person is very likely the 1898-born cyclist, but this is not closed.
- [X] T010 [US2] Extend the existing 1924 Szalay row in `input/timeline.md` (M2). Keep its date and opening "Ugyanebben a címtárban **Szalay Ferenc**" and replace the "unknown occupation" clause with the P 1928 facts: wood and coal retailer, and the "Takáts és Szilágyi" architects. Add the two 1928 links as sources. Also state that the entry does not identify the house's designer.
- [X] T011 [US2] In `input/timeline.md`, add N6 (`1924. júl. 26.`, Valószínű) after the 1924 rows. The event is the Paris tandem with Grimm János, shared 4th place: the pair lost to the Dutch in the heat on 26 July and did not reach the three-team final. The Olympic fact is certain; the identity with the D18 resident is still to be closed. Use "többszörös magyar bajnok".
- [X] T012 [US2] Extend the existing `1925. ősz` Strandfürdő row in `input/timeline.md` (M1). Keep its date and opening. Add the 1924 directory entry and the 1926 bond naming Takáts as the company's representative, and change `Bizonyosság` to `Igazolt`. Keep "no bath operated in the house". Remove the now-outdated sentence about the conflicting district number only if the 1924 directory resolves it; otherwise keep it.
- [X] T013 [US2] In `input/timeline.md`, add N7 (`1926–1927`) after the 1926. szept. 29. row. Mention the 1903 167 000-korona lien and its 1924 deletion as background. Keep the limits: the loan purpose and the relation between the two loans are unknown, and 8% interest is as recorded.
- [X] T014 [US2] In `input/timeline.md`, add in date order after the 1928 rows: N8 (`1928. dec. – 1929. febr.`), N9 (`1929`, Feltételezés) and N10 (`1929. ápr. 29.`).
  - N8 gives the sales figures "a szaklap beszámolója szerint".
  - N9 says the original fair report was not found, no D18 production is shown, and Zsuppán 1994 names him "János".
  - N10 says U. 765 is an application number, not a granted patent, and that nothing shows the gearbox was built or used in the car.
- [X] T015 [US2] In `input/timeline.md`, add N11 (`1930. szept. 1.`, Környék) and N12 (`1930–1949`, Valószínű) after the 1929. nov. 15. row.
  - N11 notes that the reports reflect the authorities' view, and that they give no house number, so no D18 damage or participation is claimed.
  - N12 says the 1930 item was a recommendation for a permit, and that Grimm's identity with the Olympian is open. The garage was at Nefelejts utca 14, not at D18.
- [X] T016 [US2] In `input/timeline.md`, add after the 1931. febr. 15. and 1931 Kinszki rows, in date order:
  - N13 (`1931. aug. 6. – szept. 3.`): the 1931 amount and the flat number are unknown, and the 1932 and 1934 entries are probable.
  - N29 (`1931. okt. 1–3.`): "ügye elévült" is not an acquittal, and her III/3 residence is not proven.
- [X] T017 [US2] In `input/timeline.md`, add N30 (`1932–1938`, Valószínű), N14 (`1932. nov. – 1934. márc.`, Valószínű) and N15 (`1933–1938`) in date order.
  - N30 does not call the 1937 sentence final, and keeps Róna Jenő apart from Róna Miksa.
  - N14 says the 1932 sentence was not final, the death is "reported", and the address at the time of the trial is unproven.
  - N15 names the people and trades from the three merged P rows. It says the catalogues show only case type and address, not personal stories or shared work. It gives Juffe Etel's cemetery identity as probable.
- [X] T018 [US2] In `input/timeline.md`, add N16 (`1937. okt. 12–31.`) after the 1936 rows. It includes the 1922 joint case with Földes Szeréna and the 1940 sentence and Szolnok transfer, with:
  - the release dates marked as calculated;
  - no proven return to the flat;
  - the wife named as Földes Szerén/Szeréna;
  - the 1940 address given as "Budapest" only.
- [X] T019 [US2] In `input/timeline.md`, add N31 (`1937. okt.–nov.`), N32 (`1938. okt. – 1940. máj. 18.`) and N17 (`1938. nov.`): N31 after the 1936 rows, then N32 and N17 after the 1938. máj. row and before the 1938. nov. Magyarország row (strict date order with the existing rows).
  - N31 says the pig trial was not his own and that no D18 residence is shown for 1937.
  - N32 says the work was done elsewhere and that the address is a 1939 fact.
  - N17 says the price and buyer don't concern D18.

### Era 1939–1945

- [X] T020 [US2] In `input/timeline.md`, era 1939–1945, add N18 (`1939`), N33 (`1939. jún. 15. – 1940/41`) and N19 (`1940. máj. 29. – 1944`) in date order.
  - N18 covers Márkus's address change from Retek utca, Kloczol's milk tests and roles, and Winiczai's doctorate accepted on 20 April. It notes that the diploma numbers 25 and 19 are serial numbers, not days.
  - N33 keeps the 1940. dec. 21. MTI appointment as a separate state post.
  - N19 says the crime took place at Aba, and that I/8 is a later record address.
- [X] T021 [US2] In `input/timeline.md`, add N20 (`1941. júl. 9.`, Környék) after the 1941. júl. 4. row, and N21 (`1942–1950`) after the 1942 Spitz row.
  - N20 says the corner house hit is not identified as D18 and that no stop is shown to have been built. It does not merge this accident with the separate 16 July case.
  - N21 includes the 1948 Felkai declaration, with the Novum identity as probable. It also says that the reason and date of the change of owner are unknown, and that Friedman is not shown to be Felkai.
- [X] T022 [US2] Extend the existing 1942 özv. Spitz row in `input/timeline.md` (M5). Keep its date and opening, and add the 1933–1934 figures (271.30 négyszögöl, three storeys, 30 096 pengő taxable rental income) with their links. Say that rental income is not profit.
- [X] T023 [US2] Replace the existing 1944 "Plan Jakab" row in `input/timeline.md` with the M6 row:
  - date `1944. jún.–júl.`; Igazolt; the P 1944. június–július text and links;
  - Flam Jakab parquet workshop, item 545, among the workshops that could be closed;
  - the July letter does not prove automatic closure, and there is no proven continuity with Szöghy.
- [X] T024 [US2] In `input/timeline.md`, add N22 (`1944. nov. 9–16.`, Környék) after the 1944. okt. 15–16. row. It covers the vinegar purchase and the bomb at number **46**: twelve people rescued, which is not a death toll, and no D18 bomb damage. Add N23 (`1945–1954`) at the end of the era. Say its location in the building and any link to the Flam workshop are unknown.

### Era 1946–1968

- [X] T025 [US2] In `input/timeline.md`, era 1946–1968, add N24 (`1947`), N25 (`1947. jún. 30.`) and N34 (`1947. dec. – 1948. jan.`, Feltételezés) after the 1946 rows, in that order.
  - N24 says Taub's role (relative, witness or comrade) is unknown, and that Holczer did not necessarily live at D18.
  - N25 says P.O. Box 27/1 is not a camp, and that kinship and homecoming are unknown.
  - N34 names the goods-smuggling case and the two-month **fogház** sentence (reported 17 December, as final). It mentions the separate currency case with an acquittal reported on 22 January 1948, not yet final. It says the reports give no personal data, so it is unproven that the haulier is the Olympian or the 1924 resident.
- [X] T026 [US2] In `input/timeline.md`, add N26 (`1954`) after the 1953 rows. Include the 1950 phone-book names (Balázs, Fürst, Reiner) and their 1954 register entries. Note that "fogt." is probably a dental technician and the other abbreviation is unresolved. Add Felkai Andor (born 1926. dec. 31.) and the probable identity with Felkai [Friedman] Andor on the Bor list. Say this does not prove a D18 residence during the forced labour.

### Titles and the unpublished sections

- [X] T027 [US2] Run `pnpm build:draft` and copy the printed ids of new events without titles. In `editorial/events.yaml`, add each id in timeline order with the contract's title. Data-model rule: "≤ 60 characters; no `titleNeedsReview`". Delete the key of the removed 1924 Drescher row (M3). Rename the old "Plan Jakab" key to the M6 row's new id, with the title "Flam Jakab parkettás telephelye a jegyzéken". Re-run until the build reports no orphans and no missing titles.
- [X] T028 [US2] In `input/timeline.md` § Nyitott kérdések és vitatott állítások and the closing "A történet hiányzó láncszemei" paragraph:
  - Update the Spitz inheritance row with the 1931. márc. 10. proclamation, which still gives no inheritance date.
  - Update the 1945–1955 row, because the VII. kerület 1954 register page has been found.
  - Remove "1954-es választói névjegyzék VII. kerületi … lapja" from the missing links.
  - Do not add new published rows here.

**Checkpoint**: All 34 new rows and changes M1, M2, M3, M5 and M6 build cleanly; the timeline has 175 events.

---

## Phase 5: User Story 3 – See the source itself beside each new event (Priority: P2)

**Goal**: Each new event with a viewable source page shows a crop of it.

**Independent Test**: Events N5, N15, N24 and N28 (and N9 if its page has no picture of the car) have no image. Every other new event and M6 shows a legible crop of a page it cites.

**Crop rules** (research R6): PNG, "the longer side is at least 1200 px", at most 2400 px. Show the relevant entry plus the masthead or column heading when it is near. Save as `assets/events/forrasok/<date>_<N##>_<slug>.png`, e.g. `1916-04-23_N01_pogany-olaj.png`. Crop with a one-off Node script in the scratchpad that uses the project's `sharp` (`extract` then `resize` with `withoutEnlargement`). Render PDF pages with `pdftoppm -f <p> -l <p> -r 300 -png`.

### PDF sources (scriptable)

- [X] T029 [P] [US3] N1: Debreczeni Újság 1916/114, PDF p. 8, the Pogány oil ad → `assets/events/forrasok/1916-04-23_N01_pogany-olaj.png`
- [X] T030 [P] [US3] N8: Automobil–Motorsport 1929/3 (EPA02192 …1929_04_03.pdf), PDF p. 10, the Diamant ad with Hernád utca 4 → `assets/events/forrasok/1929-02_N08_diamant-hirdetes.png`
- [X] T031 [P] [US3] N12: Reggeli Ujság 1932. jan. 11. (EPA04471), PDF p. 12, the Uhereczky-garage hire-car ad → `assets/events/forrasok/1932-01-11_N12_uhereczky-garazs.png`
- [X] T032 [P] [US3] N20: Esti Kurir 1941/156 (epa.hu EPA04000), PDF p. 5, the residents' tram-stop letter → `assets/events/forrasok/1941-07-10_N20_villamosmegallo.png`
- [X] T033 [P] [US3] N22: Enigma 86 (EPA03329), PDF p. 93, the 16 November diary entry on number 46 → `assets/events/forrasok/1944-11-16_N22_wilde-naplo.png`
- [X] T034 [P] [US3] N31: Köztelek 1937. nov. 14. (EPA06067 …4268_4269.pdf), PDF p. 5, the article head with Márkus's name → `assets/events/forrasok/1937-11-14_N31_markus-baranyok.png`
- [X] T035 [P] [US3] N32: Köztelek 1939. nov. 26. (EPA06067 …4433.pdf), PDF p. 6, the Vitaminator passage or article head → `assets/events/forrasok/1939-11-26_N32_markus-vitaminator.png`
- [X] T036 [P] [US3] M6: holocaust.archivportal.hu file 1113, PDF p. 15, item 545 (Flam Jakab) with the list heading → `assets/events/forrasok/1944-06_M06_flam-jakab.png`

### Hungaricana sources (browser, method from T003)

- [X] T037 [US3] Capture and crop, era 1873–1938 part 1:
  - N27: Fogoly/20803, previous-record column → `1933_N27_wagner-elozmenyek.png`
  - N2: 1920 phone book, pg=443, Pogány Kálmán line → `1920-05_N02_pogany-kalman.png`
  - N3: 1920 phone book, pg=544, Takáts–Beszedits shared line → `1920_N03_takats-beszedits.png`
  - N4: BPSZKJ_1923, pg=64 → `1923-01-10_N04_kalix.png`
  - N6: NFIsnittkatalogus-3_Tarsadalom_35, pg=2997 → `1924-07_N06_hirado-karton.png`
  - N7: Telekkonyv 31064, pg=34, C.13–14 → `1926_N07_hitel-teherlap.png`

  All files go into `assets/events/forrasok/`.
- [X] T038 [US3] Capture and crop, era 1914–1938 part 2:
  - N9: SZTNH_Konyvek_0059, pg=47. Crop only if the page shows the car; otherwise record "no source image" and leave N9 without one.
  - N10: Szabadalmi Közlöny 1929, pg=530, U. 765 line → `1929-12-15_N10_szabadalmi-bejelentes.png`
  - N11: Nyírvidék 1930/09, pg=0 → `1930-09-02_N11_nyirvidek.png`
  - N13: OIÍ registry 1930–1933, pg=354 → `1931-08_N13_segelykerelem.png`
  - N29: Fogoly/177721, later entries → `1931-10_N29_foldes-szerena.png`

  All files go into `assets/events/forrasok/`.
- [X] T039 [US3] Capture and crop, era 1914–1938 part 3:
  - N30: Zalamegyei Újság 1937, pg=280 → `1937-09-11_N30_rothmuller.png`
  - N14: MOT 1932/11, pg=194 → `1932-11-30_N14_bankper.png`
  - N16: Fogoly/25009, address and sentence fields → `1937-10_N16_wagner-III-3.png`
  - N17: MOT 1938/12, pg=37 → `1938-12-03_N17_istvan-ut-11.png`

  All files go into `assets/events/forrasok/`.
- [X] T040 [US3] Capture and crop, eras 1939–1968:
  - N18: BME_Programja 1938–1940, pg=286 → `1939_N18_markus-cim.png`
  - N33: BME_Tajekoztatoja 1940–1941, pg=107 → `1940_N33_winiczai.png`
  - N19: Fogoly/68766 → `1941_N19_rothmuller-I-8.png`
  - N21: 1943 phone book ad, pg=140 → `1943_N21_novum.png`
  - N23: 1949 phone book ad, pg=495 → `1949_N23_szoghy.png`
  - N25: KulfBelfHirek 1947/06, pg=811 → `1947-06-30_N25_hadifogoly-uzenet.png`
  - N34: MOT 1947/12, pg=332 → `1947-12-17_N34_iteletek.png`
  - N26: 1954 register, pg=14 → `1954_N26_valasztoi-nevjegyzek.png`

  All files go into `assets/events/forrasok/`. If a page can't be captured legibly, list it for the owner (fallback in research R5).

  Done 2026-10-12 from the owner's browser captures (`~/Downloads/hungaricana_timeline_crops/`, with a crop report). 20 crops wired. No image: N6 (pg=2997 shows a 1924 Millenáris celebration card, not the Paris tandem), N9 (text-only page) and N11 (no legible single crop). Most crops are below the 1200 px target; none were upscaled.

### Wiring the images

- [X] T041 [US3] In `input/timeline.md`, set each cropped event's `Kép URL` to its `assets/events/forrasok/…png` path, including M6. Leave `—` for N5, N15, N24, N28 and any event without a crop.
- [X] T042 [US3] In `editorial/events.yaml`, add an `image` block to each event wired in T041 (research R7):
  - `alt`: what the crop shows;
  - `caption`: what it shows, plus any limit;
  - `credit`: publication or archive, e.g. "Debreczeni Újság / OSZK – Elektronikus Periodika Archívum (EPA)" or "… / Hungaricana";
  - `license: "felhasználási licenc nem ellenőrzött"`;
  - `sourceUrl`: the cropped page's link;
  - `sourceLabel`;
  - `depictsHouse: false`;
  - `kind: "document"`.
- [X] T043 [US3] Run `pnpm images:fetch`. Check that only local files were copied into `src/assets/archive/` and `src/assets/archive/manifest.json`, then run `pnpm build:draft`.

**Checkpoint**: About 29 new events and M6 show source crops.

---

## Phase 6: User Story 4 – Fixes to three existing items (Priority: P2)

**Goal**: The Illés wording is fixed, the 1889 event shows the map, and the 1901 event shows the permit.

**Independent Test**: The quickstart § 4 checks pass on the home page.

- [X] T044 [P] [US4] In `editorial/music.yaml`, in the last item (Amikor én még kissrác voltam), change „mire a timeline elér 1968-hoz” to „mire krónikánk 1968-hoz ér” in `description`. Leave the `recording_note` fields untouched.
- [X] T045 [US4] Open `assets/events/budapest_1903.jpg` and check that the Dembinszky utca name is legible on it.
  - In `input/timeline.md`, set the `1889` Környék row's (Nevet kap a Dembinszky utca) `Kép URL` to `assets/events/budapest_1903.jpg`.
  - In `editorial/events.yaml`, under `1889-a-korabbi-duloutbol-kialakitott`, add an image block. Copy the map's `alt`, `credit`, `license`, `depictsHouse: false` and `kind: document` from the current 1901 entry. Use the caption „Homolka József Budapest-térképe, 1903. A térkép tizennégy évvel a névadás után készült; a Dembinszky utca már szerepel rajta.” Drop the last half-sentence if the street name isn't legible.
- [X] T046 [US4] Depends on T002 and T045.
  - In `input/timeline.md`, set the `1901. ápr. 20.` row's `Kép URL` to `assets/events/1901-04-20-hasznalhatasi-engedely.png`.
  - In `editorial/events.yaml` under `1901-apr-20-a-vii-keruleti-eloljarosag`, replace the image block. Copy `alt` and `caption` verbatim from `occupancyPermit1901` in `src/lib/epulet/figures.ts`. Use `credit: "Fotó: a szerző"` and `depictsHouse: false`, `kind: document`, and set the licence the way other owner photos are recorded.
  - Run `pnpm images:fetch`.

**Checkpoint**: The three fixes are visible on the home page.

---

## Phase 7: Polish & cross-cutting

- [X] T047 Compare `input/timeline.md` with spec.md § Agreed triage (US1 final check):
  - 34 new events and M1, M2, M3, M5 and M6 are present;
  - no dropped row slipped in;
  - the total event count is 175.
- [X] T048 [P] In `src/pages/index.astro`, change "108 esemény" to "175 esemény" in the meta description, keeping it 50–160 characters (FR-013). Check `README.md` for any event count or source list this update makes wrong, and fix only that.
- [X] T049 Run `pnpm test`, `pnpm build:draft` and `pnpm test:site`. All must pass, including "contains every event of input/timeline.md exactly once".
- [ ] T050 Walk through quickstart § 3 and § 4 at `pnpm preview`:
  - every new event's place, label, certainty, sources and limits;
  - the scope slider at Ház (N11, N20 and N22 hidden);
  - widths of 320, 768 and 1280 px.
- [X] T051 Run `pnpm build:release && pnpm lighthouse`. The home page must meet Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100. If performance drops, reduce the largest crops (T029–T040) and repeat.
- [X] T052 Report to the owner:
  - any crop that fell back to manual saving;
  - whether N9 got an image;
  - the follow-up that four `recording_note` fields in `editorial/music.yaml` still say "timeline".

  Do not commit unless asked.

---

## Dependencies & Execution Order

- **Setup (T001–T003)** comes first. T003 must precede the Hungaricana crops (T037–T040).
- **Foundational (T004)** comes before any content edit.
- **US1 (T005)** gates US2 and US3.
- **US2 (T006–T028)**: every task edits `input/timeline.md`, so they run in sequence. T027 needs all row tasks; T028 can go anywhere after T026.
- **US3**: T029–T036 can run in parallel with each other and with US2, because they only write new image files. T037–T040 run in sequence in one browser. T041–T043 need US2 (rows exist) and all crops.
- **US4 (T044–T046)** is independent of US2 and US3, except that T046 needs T002 and edits the same files. T044 can run any time.
- **Polish (T047–T052)** comes after all stories.

## Parallel Example

```text
# While the US2 row writing goes on, render and crop the PDF sources:
T029 N1 Debreczeni Újság ad      T030 N8 Diamant ad
T031 N12 garage ad               T032 N20 Esti Kurir letter
T033 N22 Wilde diary             T034 N31 Köztelek 1937
T035 N32 Köztelek 1939           T036 M6 Flam Jakab list
# T044 (music wording) and T048 (meta description) touch other files and can run any time.
```

## Implementation Strategy

1. **MVP**: Setup, then US1, then US2. The new stories are published without images, which is already a complete, correct timeline update.
2. **Then US4**: three small visible fixes the owner asked for.
3. **Then US3**: the source crops, PDFs first, then Hungaricana in the browser.
4. **Polish**: counts, the full test suite, the quickstart walk-through and Lighthouse.
