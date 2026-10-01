# Feature Specification: Lakók page

**Feature Branch**: `007-lakok-page`

**Created**: 2026-10-01

**Status**: Draft

**Input**: User description: "i want to create a new page: Lakók. the content is from /home/bartlbalazs/git/d18/input/lakok.md in the menu the order should me Építők Lakók Névadó. on the Lakók page there are multiple tables with names. those ones should be collapsible. the page should resemble the other pages of the homepare. the sections of the article can have slightly different background colors, it can reuse the main timeline colors. make it look good and fitting for the design of the whole page."

## Clarifications

### Session 2026-10-01

- Q: The 1954 list and portraits name people born 1926–1936 who may be alive; how should the page handle this? → A: Publish as drafted, and add a short end-of-page note offering correction or removal on request, via the impresszum contact.
- Q: How should the 1944 yellow-star house passage be shown? → A: As its own section with a new heading, "1944–1945: csillagos ház", in the dark 1939–1945 tone, at the same position and with the same wording.
- Q: Should the Lakók page use any images? → A: Not in this iteration. The variety comes from the era tones, typography and the lists; the owner will add images in a later iteration.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read who lived in the house (Priority: P1)

A visitor wants to know who lived at Dembinszky utca 18. They choose "Lakók" in the main navigation, between "Építők" and "Névadó", and read one long story page. It covers the early residents of 1902–1904, the 1922 residents, the 1944–1945 yellow-star house section, the 1954 voters, and the closing reflection. Each period has short portraits of selected residents, with numbered source markers that lead to the source list at the end.

**Why this priority**: This is the page itself. Without it, nothing else in the feature has value.

**Independent Test**: Open the site, choose "Lakók" in the navigation, and confirm the page shows the full text of `input/lakok.md`, with its headings, emphasis, inline links, numbered markers and source list. The page should be easy to read on a phone and on a desktop.

**Acceptance Scenarios**:

1. **Given** any page of the site, **When** the visitor opens the main navigation, **Then** the page links read Építők, Lakók, Névadó, Impresszum, in that order, in both the header and the footer.
2. **Given** the Lakók page, **When** the visitor reads it from top to bottom, **Then** every section of `input/lakok.md` appears in the same order and wording, with the heading levels preserved.
3. **Given** a source marker such as [7] or a range such as [1–4], **When** the visitor activates it, **Then** they land on the matching numbered entry under "Források és továbbolvasás". In a range, both of its end numbers link to their entries.
4. **Given** the text mentions the *Építők* article and the source list links to it, **When** the visitor follows that link, **Then** it opens the site's own Építők page.

---

### User Story 2 - Browse the full name lists without losing the story (Priority: P1)

The page holds three full name lists: the two early directory years side by side (67 names), the 1922–1923 directory (35 names) and the 1954 voter list (107 names). A visitor reading the story should not have to scroll past a long table. Each list is closed by default and opens when the visitor wants it. A visitor looking for a specific name can open a list and scan it.

**Why this priority**: The owner asked for this explicitly. Without it, the 107-row list alone would bury the 1954 portraits.

**Independent Test**: Load the Lakók page and confirm all three lists are closed, and that each closed list shows a label naming the list and its entry count. Open and close each one with a tap, a click and the keyboard, and check that the page works without JavaScript.

**Acceptance Scenarios**:

1. **Given** the page has just loaded, **When** the visitor reaches a name list, **Then** it is closed and shows a label with the list's name and number of entries, such as "A teljes 1954-es választói névsor megnyitása (107 bejegyzés)".
2. **Given** a closed list, **When** the visitor taps it, clicks it, or presses Enter or Space on it, **Then** the full table opens in place. Doing the same again closes it.
3. **Given** JavaScript is disabled, **When** the visitor uses a list, **Then** it still opens and closes.
4. **Given** an open table on a 320 px wide screen, **When** the visitor reads it, **Then** every name and occupation can be read without the page scrolling sideways. A three-column table may scroll inside its own frame.
5. **Given** a screen reader user, **When** they reach a list, **Then** it is announced as an expandable control with its label and current state, and an open table is announced as a table with column headers.
6. **Given** the notes that belong to a list (the "—" legend, the birth-name note, the name corrections), **When** the list is closed, **Then** a note needed to read the table is inside the list. The paragraphs that continue the story stay outside it.

---

### User Story 3 - A page that feels like part of the timeline (Priority: P2)

The page should look like a sibling of Építők and Névadó, using the same typography, header, footer, reading width, figures and source list. It also borrows the home timeline's sense of time. Each period section has a soft background tone matching the timeline era it belongs to, so a visitor who knows the timeline recognises the decades by colour.

**Why this priority**: The owner asked for this. It makes the page look good and fit the site, but visitors can read the content without it.

**Independent Test**: Compare the Lakók page with the Építők and Névadó pages and the home timeline at 320 px, 768 px and 1280 px. Check that the period sections use the matching era tones, that the text contrast is fine on every tone, and that nothing looks out of place.

**Acceptance Scenarios**:

1. **Given** the Lakók page, **When** compared with Építők and Névadó, **Then** the header, footer, title style, body text, reading width, links and source list look the same.
2. **Given** the period sections, **When** the visitor scrolls, **Then** each one has a background matching its timeline era. 1902–1904 uses the 1873–1913 tone, 1922 uses the 1914–1938 tone, the "1944–1945: csillagos ház" section uses the dark 1939–1945 tone, and 1954 uses the 1946–1968 tone. The lead, the closing section and the source list keep the page's normal background.
3. **Given** any tone, **When** text, links and the list controls are checked, **Then** they meet the WCAG AA contrast ratio.
4. **Given** a visitor who prefers reduced motion, **When** they open or close a list, **Then** nothing animates.

---

### Edge Cases

- The draft already wraps the 1954 list in a collapsible block with its own label. The other two lists get labels in the same style, such as "A két korai évfolyam névsorának megnyitása (67 bejegyzés)".
- Some table cells keep the source's uncertain wording, with question marks or asterisks. These must appear exactly as in the draft, and the note below the 1954 table must still explain the asterisks.
- A visitor uses the browser's find-in-page to look for a name that sits in a closed list. Where the browser supports it, the list should open to show the match. Elsewhere, the closed label makes clear that names sit inside.
- When printed, all lists print open.
- Two links in the 1944 passage are inline links to the same documents as sources [26] and [27]. Both the inline links and the numbered markers stay.
- Long Hungarian compound words, headings and table cells must wrap without the page scrolling sideways at 320 px.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The header and footer navigation MUST show a "Lakók" item between "Építők" and "Névadó", so the page links read Építők, Lakók, Névadó, Impresszum.
- **FR-002**: The site MUST publish a Lakók page whose text is the full content of `input/lakok.md`: the lead paragraphs, all sections and sub-sections in order, emphasis, inline links, the three name tables with their notes, and the numbered "Források és továbbolvasás" list with its name notes.
- **FR-003**: Each numbered in-text source marker MUST link to its matching entry in the source list. A list of markers, such as [2, 17], links each number it names. A range, such as [1–4], links both of its end numbers.
- **FR-004**: Each of the three name tables MUST be in a collapsible block that is closed when the page loads and opens and closes by touch, mouse and keyboard, with or without JavaScript. Each closed block MUST show a label naming the list and its entry count.
- **FR-005**: The tables MUST keep the draft's columns, header labels, row order and cell text exactly, including "—", question marks and asterisks.
- **FR-006**: Each period section MUST have a background tone taken from the home timeline's matching era (see User Story 3, scenario 2). Text, links and controls MUST meet WCAG AA contrast on each tone.
- **FR-006a**: The 1944 yellow-star house passage MUST be its own section, at the same level as the period sections, headed "1944–1945: csillagos ház". It starts at the paragraph beginning "A Dembinszky utca 18. szerepel a *Fővárosi Közlöny*…" and keeps the draft's wording and position. The bridging sentence before it ("…A következő névsorig azonban üldöztetés és ostrom is elérte a házat.") closes the 1922 section.
- **FR-007**: The page MUST look like the existing story pages: the same header, footer, title and body typography, reading width and source-list style. It MUST stay a hand-authored page, not generated from `input/lakok.md` at build time, like Építők and Névadó.
- **FR-007a**: The page MUST contain no images in this iteration. *(Superseded by `specs/008-lakok-opening-image`, which adds the opening façade photo.)*
- **FR-008**: The page MUST meet the site constitution like every existing page. That means static HTML readable without JavaScript, the performance budget, a mobile-first layout, and full metadata: unique title and description, canonical URL `/lakok/`, Open Graph and Twitter tags, `Article` and `BreadcrumbList` structured data, and a sitemap entry.
- **FR-009**: Outbound source links MUST be published without tracking query parameters.
- **FR-009a**: The page MUST end, after the source list, with a short note inviting residents, relatives or anyone named to ask for a correction or removal. The note links to the contact given in the impresszum.
- **FR-010**: The README, the project layout notes and the site output checks MUST cover the new page and the new menu order.

### Key Entities

- **Story page**: A hand-authored long-form page with a title, lead, sections, inline links and a source list. Lakók is the third one, after Építők and Névadó.
- **Period section**: A part of the page tied to one timeline era. It has a heading, a background tone, story text, an optional name list and resident portraits.
- **Name list**: A collapsible full list from one source. It has a label with an entry count, a table with column headers, and its reading notes.
- **Resident portrait**: A short sub-section about one or two residents, with source markers.
- **Source entry**: A numbered reference with a title, a URL and a note, which the in-text markers point to.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: From any page, a visitor reaches the Lakók page in one tap or click from the main navigation.
- **SC-002**: All headings, paragraphs and links in `input/lakok.md` appear on the page, and the three tables hold 67, 35 and 107 rows. Section headings, link counts and row counts can be compared to check this.
- **SC-003**: With all lists closed, the page is at least a third shorter than with all lists open, on a 375 px wide screen.
- **SC-004**: The page meets the constitution's Lighthouse mobile thresholds: Performance, Accessibility and Best Practices ≥ 95, and SEO = 100.
- **SC-005**: The page renders without sideways page scrolling at 320 px, 768 px and 1280 px widths, with every list open.
- **SC-006**: The internal link check reports zero broken links, including every source marker.

## Assumptions

- The URL is `/lakok/`, following the site's Hungarian slug style.
- This iteration has no images, neither an opening image nor inline figures. The visual variety comes from the era tones, the collapsible lists and typography such as pull quotes. Images come in a later iteration, so the layout should leave room for a figure in a portrait without rework.
- The labels for the two lists that have none in the draft, and the 1944–1945 heading (FR-006a), are new editorial text; the labels follow the style of the 1954 label. Wording changes to the draft are otherwise limited to removing the raw collapsible markup.
- The names come from published archival directories and voter lists that the owner has checked. They are published as given in the draft, including birth names and the dates the portraits give. The correction and removal note (FR-009a) is the safeguard for people who may still be alive.
- As with Építők and Névadó, the page is reached only through the header and footer menus. Linking timeline events to residents is out of scope.
- `input/lakok.md` stays a draft that the build never reads. Later wording changes are made directly in the page.
