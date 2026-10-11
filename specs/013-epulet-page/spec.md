# Feature Specification: Épület page

**Feature Branch**: `013-epulet-page`

**Created**: 2026-10-11

**Status**: Implemented

**Input**: User description: "write the "Épület" cikk using the materials in /home/bartlbalazs/Downloads/epulet. In the Menü the order should be Épület Építők Lakók Névadó Impresszum"

The material package holds the article draft (`d18_epulet.md`, 11 numbered sources) and the 12 images it uses: author's photos of the 1899 and later plan documents, the 1901 occupancy permit, the 1901 balcony plan, the 1948 restoration title block, the 1956 approval clause and the 1969 gallery-replacement description and plan.

## Clarifications

### Session 2026-10-11

- Q: The draft says the signed Mellinger plan and the 1901 occupancy permit have been found, while the Építők page and the timeline still say they have not. Should this feature update those texts? → A: Yes. Update the timeline to match the findings, and add a new paragraph at the end of the Építők article that points to the Épület page's findings as the answer to its open question.
- Q: Should the other dated documents in the draft also become timeline events? → A: Yes, add the new events too.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read how the building was made and changed (Priority: P1)

A visitor wants to know the story of the building itself. They choose "Épület" in the main navigation, the first of the page links, and read one long story page. It runs from the 1899 plot purchase, Márkus Géza's plans and the auction, through Mellinger Artúr's signed floor plan, the 1901 occupancy permit and balcony plan, to the Spitz ownership, the 1948 restoration, the 1956 flat division and the 1969 gallery replacement, and ends with a closing summary and the numbered source list.

**Why this priority**: This is the page itself. Without it, nothing else in the feature has value.

**Independent Test**: Open the site, choose "Épület" in the navigation, and confirm the page shows the full text of the draft, with its headings, sub-headings, emphasis, inline links, numbered markers and source list, readable on a phone and on a desktop.

**Acceptance Scenarios**:

1. **Given** any page of the site, **When** the visitor opens the main navigation, **Then** the page links read Épület, Építők, Lakók, Névadó, Impresszum, in that order, in the header, the Menü panel and the footer.
2. **Given** the Épület page, **When** the visitor reads it from top to bottom, **Then** every section of the draft appears in the same order and wording, with the heading levels preserved (the two sub-sections under "Mellinger a tervlapon" stay sub-sections).
3. **Given** a source marker such as [8] or a range such as [1–3], **When** the visitor activates it, **Then** they land on the matching numbered entry under "Források és továbbolvasás". In a range, both of its end numbers link to their entries.
4. **Given** the text links to the Építők and Lakók articles, **When** the visitor follows such a link, **Then** it opens the site's own page, not an absolute link to the live domain.

---

### User Story 2 - See the documents the story is built on (Priority: P1)

The article's argument rests on plan sheets and permits. Next to each claim, the visitor sees the photographed document: the approval clauses, the 1899 section and elevation, Mellinger's stamp, the shared toilets on the floor plan, the occupancy permit, the balcony plan, the 1948 title block, the 1956 clause and the 1969 description and plan. They can open each one larger to read the handwriting.

**Why this priority**: The draft places 12 images, and the authorship argument is only convincing when the reader can see the stamp and the signatures.

**Independent Test**: Open `/epulet/` and check that each of the 12 images appears at the place the draft puts it, with its caption and credit, and opens larger in the site's image viewer.

**Acceptance Scenarios**:

1. **Given** the Épület page, **When** the visitor reaches the place the draft puts an image, **Then** the image shows there with the draft's caption, and its alt text describes what the document shows.
2. **Given** an image, **When** the visitor clicks or taps it, **Then** it opens full size in the same viewer the other story pages use, and closing it returns to the same scroll position.
3. **Given** the source list, **When** an entry names the images it covers (sources 2, 3, 4, 6, 7, 8), **Then** each image name links to its figure on the page instead of to a file.
4. **Given** the wide, short crops (Mellinger's stamp, the shared toilets), **When** they are shown on a 320 px screen, **Then** the stamp and the "Closettek" label stay legible or are one tap away in the viewer.

---

### User Story 3 - A page that feels like part of the site (Priority: P2)

The page should look like a sibling of Építők, Lakók and Névadó: the same header, footer, title style, reading width, figures and source list. Like Lakók, each period section has a soft background tone taken from the home timeline's matching era, so the decades are recognisable by colour.

**Why this priority**: It makes the page fit the site, but visitors can read the content without it.

**Independent Test**: Compare the Épület page with the other story pages and the home timeline at 320 px, 768 px and 1280 px.

**Acceptance Scenarios**:

1. **Given** the Épület page, **When** compared with the other story pages, **Then** the header, footer, title style, body text, reading width, figures, links and source list look the same.
2. **Given** the period sections, **When** the visitor scrolls, **Then** the sections from "A telek gazdát cserél" to "Erkély a kapu fölött" use the 1873–1913 tone, "A Spitz név megmarad" uses the 1914–1938 tone, and the sections from "Helyreállítás egy első emeleti lakásban" to "A gang új lemezeket kap" use the 1946–1968 tone. The lead, the closing section and the source list keep the page's normal background.
3. **Given** any tone, **When** text, links, captions and figures are checked, **Then** they meet the WCAG AA contrast ratio.

---

### User Story 4 - The site tells one story about who designed the house (Priority: P2)

A visitor who reads the Építők article or the home timeline after the Épület page should not be told that the plan Mellinger signed is still missing. The Építők article stays a record of how the question was investigated, but it now ends by saying the question has been answered and pointing to the Épület page. The timeline entries reflect what the newly found documents show.

**Why this priority**: Without it the site contradicts itself on its central question. It depends on the Épület page existing (User Story 1).

**Independent Test**: Read the end of the Építők article and the timeline entries for 1901 April 20, "1901 körül" and 1960 January 25, and confirm none of them says the signed plan or the original occupancy document is missing, and that the Építők ending links to `/epulet/`.

**Acceptance Scenarios**:

1. **Given** the Építők article, **When** the visitor reaches its end, **Then** after the current closing line there is a new paragraph saying the documents the article asked for have since been found, naming what they show (Mellinger's stamp and signature on the modified floor plan, and the 1901 April 20 occupancy permit naming Spitz János Ferenc as owner), stating that on this basis the authorship question can very probably be closed in Mellinger's favour, and linking to the Épület page for the details.
2. **Given** the Építők article, **When** the visitor reads the earlier sections, **Then** their wording is unchanged; they remain the account of the question before the documents were found.
3. **Given** the home timeline, **When** the visitor reads the 1901 April 20 entry, **Then** it describes the issue of the occupancy permit by the VII district authority as a documented fact, with the certainty "Igazolt" and the permit as its source, instead of a date known only from a later publication.
4. **Given** the home timeline, **When** the visitor reads the "1901 körül" and 1960 January 25 entries, **Then** they call Mellinger the designer documented by his signed floor plan, not the probable designer of a house whose plan has not been found, and the "1901 körül" entry carries the certainty "Igazolt".
5. **Given** an updated timeline entry, **When** its editorial title, image or caption existed before, **Then** they still belong to it after the update, and the title "Mellinger Artúr, a valószínű tervező" is changed to match the new finding.

---

### User Story 5 - Follow the building's own milestones on the timeline (Priority: P3)

A visitor scrolling the home timeline meets the building's documented milestones at their dates: the 1899 sale to Márkus Géza, the approved 1899 plans, the bank mortgage, the 1900 auction that returned the house to the Spitz couple, the 1901 balcony plan, the widow Spitz as owner in 1942, the 1948 restoration and the 1956 flat division. Each one points to the Épület page for the full story.

**Why this priority**: It enriches the timeline with facts the Épület page establishes, but the page and the corrections (User Stories 1–4) are useful without it.

**Independent Test**: Open the home timeline at the Ház scope step and check that each event in the table below appears in its era, in date order, with a title, the lane "D18", the certainty "Igazolt", and a source link.

| Date | Event | Era |
|---|---|---|
| 1899. ápr. 15. | Márkus Géza buys the plot from Schuller Miksa, Kürzweil Hermina, Spitz János Ferenc and Schuller Laura for 36 625 Ft 50 kr; 32 625 Ft 50 kr stays registered as unpaid purchase price owed to the sellers | 1873–1913 |
| 1899. máj. 18. | The plans for Márkus Géza's building are approved: a cellar, ground floor, three storeys and a central triangular gable; Horváth Pál signs as master builder. Replaces the existing undated "1899" Márkus row | 1873–1913 |
| 1899. júl. | The Pesti Magyar Kereskedelmi Bank's 80 000 Ft mortgage is registered on the property, ahead of the earlier claims | 1873–1913 |
| 1900. szept. 29. | At the auction Spitz János Ferenc and Schuller Laura buy the property for 137 005 korona, half each; their ownership is registered on 16 April 1901 | 1873–1913 |
| 1901. júl. 2. | A plan is drawn for an open balcony over the gate, built in the patented Mátrai reinforced-concrete system | 1873–1913 |
| 1942 | The property directory names the widow of Spitz János Ferenc as owner, with 26 448 pengő of taxable annual rental income | 1939–1945 |
| 1948 | A restoration plan is drawn for flat 1 on the first floor: designer Rajna Ernő, client Jacobi Dénesné, owner dr. Miletits Györgyné | 1946–1968 |
| 1956. aug. 22. | The flat-division plans for the house are approved, before the October revolution | 1946–1968 |

**Acceptance Scenarios**:

1. **Given** the home timeline, **When** the visitor reaches each date in the table, **Then** the event is there, in date order within its era, with an editorial title and the facts listed, worded in the timeline's style.
2. **Given** a new event, **When** the visitor follows its source, **Then** it leads to the digitised land register or directory page where the draft gives one, and otherwise to the matching section of the Épület page.
3. **Given** the era totals and the structured data, **When** the new events are added, **Then** they count like every other event.
4. **Given** the research timeline's unpublished open-question list, **When** a new event answers part of an entry (the post-1931 inheritance; the 1945–1955 ownership change), **Then** that entry is narrowed to what is still unknown.

---

### Edge Cases

- The draft refers to the 1899 elevation as `kepek/4.jpg`, but the package holds `4.png`. The page uses `4.png`.
- `1.jpg` is a phone photo that carries camera metadata, including GPS location, and an EXIF rotation flag. The published image must show upright and carry no location or camera metadata.
- The draft links to `https://www.dembinszky18.hu/epitok/` and `/lakok/` with the full domain; on the page these become site-internal links.
- The draft mentions "a Lakók cikk" in "A Spitz név megmarad" without a link; the wording stays as drafted.
- Long Hungarian compound words ("függőfolyosócsere", "használhatási"), headings and captions must wrap without sideways page scrolling at 320 px.
- When printed, figures print with their captions, and the source list prints in full.
- Changing a timeline row's date or first four words changes its event id. Any editorial entry under the old id must move to the new one, and no link to the old anchor may break.
- The 1969 gallery replacement falls after 1968, where the timeline and its last era end. It is not added to the timeline; the Épület page covers it.
- Two new events share a year with existing rows (1899 Márkus, 1942/1948 context rows). The 1899 row is replaced, not duplicated; the others sit beside the existing rows in date order.
- The research timeline's unpublished "Nyitott kérdések" list holds an entry about the 1901 April 20 date that the permit now answers; it is resolved or removed so the research file does not keep a closed question open.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The header, the Menü panel and the footer MUST show an "Épület" item first among the page links, so they read Épület, Építők, Lakók, Névadó, Impresszum.
- **FR-002**: The site MUST publish an Épület page at `/epulet/` whose text is the full content of the draft: the lead, all sections and sub-sections in order, emphasis, inline links and the numbered "Források és továbbolvasás" list.
- **FR-003**: Each numbered in-text source marker MUST link to its matching entry in the source list. A range, such as [1–2] or [1–3], links both of its end numbers.
- **FR-004**: The page MUST show the 12 images at the places the draft puts them, each with the draft's caption, a descriptive alt text, the credit "Fotó: a szerző", explicit dimensions, and the site's zoomable viewer.
- **FR-005**: Published images MUST be stripped of camera and location metadata and displayed in their correct orientation.
- **FR-006**: Image references in the source list MUST link to the matching figure on the page.
- **FR-007**: Each period section MUST have a background tone from the home timeline's matching era, as listed in User Story 3, scenario 2. Text, links and captions MUST meet WCAG AA contrast on each tone.
- **FR-008**: The page MUST look like the existing story pages and MUST be hand-authored, not generated from the draft at build time, like Építők, Lakók and Névadó.
- **FR-009**: The page MUST meet the site constitution like every existing page: static HTML readable without JavaScript, the performance budget, a mobile-first layout, and full metadata (unique title and description, canonical URL `/epulet/`, Open Graph and Twitter tags, `Article` and `BreadcrumbList` structured data, `ImageObject` data for the document photos, and a sitemap entry).
- **FR-010**: Outbound source links MUST be published without tracking query parameters.
- **FR-011**: The Építők article MUST end with one new paragraph, after its current closing line, that reports the findings of the Épület page as the answer to the article's open question, as described in User Story 4, scenario 1, and links to `/epulet/`. The rest of the article MUST stay unchanged.
- **FR-012**: The timeline entries that say the signed plan or the original occupancy document has not been found (1901 April 20, "1901 körül", 1960 January 25) MUST be rewritten to match the Épület findings, with updated certainty and sources, as described in User Story 4, scenarios 3–5. Their editorial titles, images and captions MUST stay attached, and the unpublished open-question entry on the 1901 date MUST be resolved.
- **FR-013**: The home timeline MUST gain the eight D18 events listed in User Story 5, each with the certainty "Igazolt", a source, and an editorial title, and the undated 1899 Márkus row MUST become the dated 1899 May 18 plan-approval event, keeping its editorial entry. Open-question entries the new events partly answer MUST be narrowed.
- **FR-014**: The README, the project layout notes and the site output checks MUST cover the new page and the new menu order.

### Key Entities

- **Story page**: A hand-authored long-form page with a title, lead, sections, inline links, figures and a source list. Épület is the fourth, and first in the menu.
- **Period section**: A part of the page tied to one timeline era, with a heading, a background tone and story text.
- **Document figure**: An author's photo of an archival document, with alt text, a caption, a credit and a zoomable full-size version, which source entries can point to.
- **Source entry**: A numbered reference with a title, optional URLs and a note, which in-text markers and image references point to.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: From any page, a visitor reaches the Épület page in one tap or click from the main navigation.
- **SC-002**: The lead, all 12 sections (including the source list) and 2 sub-sections, every paragraph, all inline links and all 11 source entries of the draft appear on the page; heading, link and figure counts (13 figures: the 12 document images plus the opening photo) can be compared to check this.
- **SC-003**: The page meets the constitution's Lighthouse mobile thresholds: Performance, Accessibility and Best Practices ≥ 95, and SEO = 100.
- **SC-004**: The page renders without sideways page scrolling at 320 px, 768 px and 1280 px.
- **SC-005**: The internal link check reports zero broken links, including every source marker and every image reference in the source list.
- **SC-006**: No published image contains GPS or camera metadata.
- **SC-007**: No page of the site still states that the plan signed by Mellinger or the original 1901 occupancy document has not been found; a text search of the built site confirms this.
- **SC-008**: The timeline shows all eight events from User Story 5, the build reports no missing editorial items, and the total D18 event count rises by seven (eight new, one replaced).

## Assumptions

- The URL is `/epulet/`, following the site's Hungarian slug style.
- The page title is "Épület", as in the draft. The draft is copied into `input/epulet.md` alongside the other story drafts; the build never reads it, and later wording changes are made in the page.
- The page opens with the present-day façade photo already used on the home page, since the lead sets the street façade against the 1899 plan. No other images are added beyond the 13 in the package.
- All 12 images are the author's own photos of archival documents, credited "Fotó: a szerző" as in the draft, with no separate licence line.
- The 1969 gallery-replacement section belongs to the 1946–1968 tone, the closest timeline era; the site does not add a new era.
- As with the other story pages, linking timeline events to the Épület page is out of scope.
- The timeline gets both the corrections (User Story 4) and the new events (User Story 5). Smaller register entries in the draft (the 1900 auction order, the 1903 deletion of the bank mortgage, the 1931 and 1933–1934 directory listings) are folded into the event texts rather than given their own rows.
- The new timeline events carry no images. The document photos are shown on the Épület page, which each event can point to.
- The 1969 gallery replacement stays off the timeline, because the timeline, its last era and the site's description end in 1968. Extending them is a separate decision.
- The new Építők paragraph and the rewritten timeline texts are new editorial wording, written in the voice of the existing text and reviewed by the owner before release.
