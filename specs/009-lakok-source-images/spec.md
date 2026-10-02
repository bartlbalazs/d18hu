# Feature Specification: Lakók source images

**Feature Branch**: `master` (direct)

**Created**: 2026-10-02

**Status**: Implemented

**Input**: User description: "i want to add images to the lakok page. here are the images and the usage description: /home/bartlbalazs/Downloads/lakok-kepanyag"

The image package (version 2, 2 October 2026) has 21 images, a placement guide (`lakok_kepelhelyezesi_utmutato.md`), and a catalogue (`kepjegyzek.json`). The catalogue holds each image's size, caption, alt text, credit, source link and priority. The guide recommends 13 main images (priority "alap") at 11 places in the article. The other 8 are spares ("tartalék").

## Clarifications

### Session 2026-10-02

- Q: Should the guide's rights notes appear anywhere? → A: No. The page, the code and the project documents carry only each image's caption, credit line and source link. The guide's rights categories and licence comments are not copied over.
- Q: Should any of the 8 spare images be added as well? → A: Yes, one: 09 (Takács Eberhard Árpád's car firm and phone number), after the 2nd paragraph of his portrait. The other 7 spares stay out.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The portraits show the sources they are built on (Priority: P1)

A visitor reads a resident's portrait on the Lakók page. Next to the text they see the source it draws on: the concert review, the actor's portrait, the theatre notice, the Perfector advert, the teacher's own article, the society report, the two Petrovits directory lines or the Takács car-firm line. They can open each image larger and go to the original page.

**Why this priority**: These are most of the images (11 of 14), and they make the long text easier to read. The guide's main visual points are the actor's portrait and the Perfector advert.

**Independent Test**: Open `/lakok/` and read the 1902–1904 and 1922 eras. Each image from places 1–8 in the table below is at its place, with its caption, credit line and source link. Each one opens larger.

**Acceptance Scenarios**:

1. **Given** a visitor on `/lakok/`, **When** they reach a portrait in the table below, **Then** its image shows after the named paragraph, before the next subheading.
2. **Given** an image is shown, **When** the visitor clicks or taps it, **Then** the full-size image opens in the same viewer the page already uses, and closing it returns to the same scroll position.
3. **Given** an image is shown, **When** the visitor reads the caption, **Then** they see the guide's caption text and, below it in smaller type, the credit line with a link to the original page.
4. **Given** the Szellő Sándor pair, **When** it is shown, **Then** the two clips appear as one group with a visible label on each ("Cikkkezdet, 377. oldal" and "Zárórész, 379. oldal"), so it is clear they come from two different pages and are not one continuous article.
5. **Given** the Petrovits pair, **When** it is shown, **Then** the two directory lines appear one under the other in one group, labelled "1902–1903" and "1922–1923".
6. **Given** the Almássy Iza portrait and the cake-walk notice, **When** they are shown, **Then** the section's second paragraph stands between them.

---

### User Story 2 - The later eras get a document and two work photos (Priority: P2)

A visitor reaches the 1944 and 1954 eras. The 1944 section shows the whole list page that named the house a yellow-star house. The 1954 era shows a machinists' photo, a projection-booth photo and the time-study job grading. The captions say clearly that the photos show the trade, not the residents.

**Why this priority**: The images matter, but the later eras are already readable. These images add context rather than evidence about the residents.

**Independent Test**: Open the 1944 and 1954 eras. Images 9–12 in the table below are at their places, and each caption gives the warning from the guide.

**Acceptance Scenarios**:

1. **Given** the 1944 section, **When** it is shown, **Then** the whole list page appears unaltered as the only image in the section. Enlarging it lets the visitor read the Dembinszky utca entry at the bottom of the lower-left column.
2. **Given** the two 1954 photos, **When** a visitor reads their captions, **Then** each caption says the photo does not show the named resident or their workplace.
3. **Given** the machinists' photo, **When** it is shown, **Then** it is not placed directly under Lakatos Gézáné's name.

---

### User Story 3 - The page stays fast and accessible (Priority: P1)

A visitor on a phone with a slow connection opens Lakók. The page still opens quickly. The images load only as the visitor scrolls to them, fit the screen, and do not push the text while they load. A screen reader user hears an alt text for each image.

**Why this priority**: The project's performance budget cannot be broken. With 14 new images, the page could become much heavier.

**Independent Test**: Run the site's Lighthouse checks on `/lakok/`. Check the page at 320 px, 768 px and 1280 px.

**Acceptance Scenarios**:

1. **Given** a 320 px wide screen, **When** the page loads, **Then** every image fits the column and the page does not scroll sideways.
2. **Given** a screen reader user, **When** they reach an image, **Then** it is announced with the alt text from the catalogue.
3. **Given** a visitor scrolling, **When** images load, **Then** the text around them does not jump.

### Edge Cases

- **Small print**: The directory lines and newspaper clips have very small type. On a phone the visitor must be able to enlarge them and read the text.
- **Very different shapes**: The images range from wide strips (about 6 : 1) to tall pages (about 2 : 3). Each keeps its own shape. Tall images are not cropped into banners, and strips do not get tall frames.
- **The 1944 section has a single paragraph**: The guide says "after the first paragraph, before Dénes Mari's memory". On the page, the memory is part of that same paragraph. The image therefore goes after the section's only paragraph.
- **The 1944 list page**: It is shown whole. It must not be cropped or edited; it may only be resized for the screen.
- **Printing**: Each image prints in the column, at no more than half a page high, with its caption and credit.
- **Very large full-size files**: The viewer opens the large version. It must not slow down the first view of the page.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Lakók page MUST show the 13 main images and spare 09, 14 images in all, at these places:

  | # | Image(s) | Section | Place |
  |---|---|---|---|
  | 1 | 18 – Armandola concert review | Armandola Aranka | After the 2nd paragraph |
  | 2 | 16 – Almási Iza portrait | Almássy Iza | After the 1st paragraph |
  | 3 | 17 – Mici and the cake-walk | Almássy Iza | After the 2nd paragraph |
  | 4 | 04 – Perfector advert | Mautner Adolf | After the 2nd paragraph |
  | 5 | 19 + 20 – Szellő article start and end | Szellő Sándor | After the 2nd paragraph, as one group |
  | 6 | 21 – Graselly and the farmers' society | Graselly Miklós | After the 2nd paragraph |
  | 7 | 07 + 08 – Petrovits directory lines | Petrovits Róbert | After the 1st paragraph, as one group |
  | 8 | 09 – Takács car firm and phone number | Takács Eberhard Árpád | After the 2nd paragraph |
  | 9 | 12 – Yellow-star house list | 1944–1945 | After the section's paragraph |
  | 10 | 13 – Machinists at work, 1954 | 1954 | After the era's 1st paragraph, before the 1954 list subheading |
  | 11 | 14 – Projectionist in the booth | Ballák Magda | After the section's paragraph |
  | 12 | 15 – Time-study job grading | Horváth János | After the 2nd paragraph |

- **FR-002**: Each image MUST use the caption, alt text, credit line and source link from the catalogue, word for word. The catalogue's rights category, and the guide's rights and display notes, MUST NOT be copied into the page, the code or the project documents.
- **FR-003**: Each image MUST use the same figure treatment as the page's existing images: frame, caption, smaller credit line, link to the original source, and click or tap to enlarge.
- **FR-004**: Each image MUST keep its original shape. No image may be cropped on the page, and no texture, colouring or retouching may be added.
- **FR-005**: The display widths from the guide (for example 340–400 px for the concert review, 560–680 px for the projectionist photo) MUST set the image's width on wide screens. On narrow screens, images MUST shrink to the column.
- **FR-006**: The Szellő pair and the Petrovits pair MUST each show as one group. Each part MUST have its own visible label, and there MUST be visible space between the parts.
- **FR-007**: The 1944 list page MUST be the only image in its section, shown whole and unaltered.
- **FR-008**: Images below the opening MUST load only as the visitor nears them. They MUST reserve their space before they load.
- **FR-009**: Of the spare images, only 09 is added. The other 7 (01, 02, 03, 05, 06, 10, 11) MUST NOT be added in this feature. Image 09 is a directory strip like 07 and 08: it keeps its wide shape and is no wider than 620 px.
- **FR-010**: The release build MUST refuse the page if any new image is missing its caption, alt text, credit line or source link.
- **FR-011**: The opening façade photo and the article's image in the page's structured data MUST stay as they are.
- **FR-012**: The page's text MUST stay as it is. Only images are added.

### Key Entities

- **Source image**: one file from the package. It has a file, its size in pixels, a title, a caption, an alt text, a credit line, a source link, a rights category, a display width, and a place on the page.
- **Image group**: two source images shown together, each with its own label (Szellő start/end, Petrovits 1902/1922).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 14 images appear on `/lakok/` at the 12 places in FR-001, and none of the other 7 spares appear.
- **SC-002**: `/lakok/` keeps its Lighthouse mobile scores: performance 99 (measured both before and after this feature; the constitution requires ≥ 95), and 100 in accessibility, best practices and SEO.
- **SC-003**: Before the visitor scrolls, the page loads no more image data than it does today.
- **SC-004**: At every width from 320 px to 1920 px, the page has no sideways scroll.
- **SC-005**: On a 375 px wide phone, a visitor can enlarge any directory line or newspaper clip and read its words.
- **SC-006**: Every new image has a caption, alt text, credit line and working source link (14 of 14).

## Assumptions

- The guide's display widths are targets for wide screens, not fixed sizes.
- The rule in feature 008 that no other new images are added is replaced by this feature.
- The package's overview image (`attekinto.jpg`) is for planning only and is not published.
- The page's existing image viewer, figure style and credit format are reused. No new kind of component is introduced.
- The source files are added to the project's image assets. The page shows resized copies, and the viewer opens a large copy.
