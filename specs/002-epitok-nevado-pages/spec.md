# Feature Specification: Építők and Névadó pages

**Feature Branch**: `002-epitok-nevado-pages`

**Created**: 2026-09-29

**Status**: Draft

**Input**: User description: "i wan to remove the menu item "írások". instead of that i want a menu item "Építők" and right after it another one "Névadó". the content of those pages are in md files in the input folder. epitok.md and nevado.md. the pages should be generated from this content, but not by the script. this is needed because the visuals can be varying, etc, so i dont want to have a script to autogenerate it, but i already have the intended content in those files."

## Clarifications

### Session 2026-09-29

- Q: How should Építők show its sources, given the draft uses inline bracketed links while Névadó uses numbered markers? → A: Keep the inline links as in the draft, and also add a "Források" list at the end.
- Q: Should the Építők page have images, and if so, which ones? → A: One opening image of the façade, reused from the site's existing archive images.
- Q: Should the new pages be linked from anywhere other than the menu? → A: No, menu links only (header and footer).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read who built the house (Priority: P1)

A visitor wants to know who commissioned and designed Dembinszky utca 18. They choose "Építők" in the main navigation and read one long story page: Spitz János Ferenc, Mellinger Artúr, their possible family link, and why the Hübner–Kalix attribution is doubtful.

**Why this priority**: The builders are the site's biggest open historical question, and this page replaces the menu slot that "Írások" held.

**Independent Test**: Open the site, choose "Építők" in the navigation, and confirm the page shows the full text of `input/epitok.md` with its headings, emphasis and source links, laid out for easy reading on a phone and on a desktop.

**Acceptance Scenarios**:

1. **Given** any page of the site, **When** the visitor opens the main navigation, **Then** "Építők" is listed where "Írások" used to be, and "Írások" is gone.
2. **Given** the visitor is on the Építők page, **When** they read it from top to bottom, **Then** every section of `input/epitok.md` appears in the same order and wording, with the heading levels preserved.
3. **Given** the Építők page, **When** the visitor follows an inline source link, **Then** it opens the cited external document.
4. **Given** the end of the Építők page, **When** the visitor reaches it, **Then** a "Források" list names each cited source once.

---

### User Story 2 - Read about the street's namesake (Priority: P1)

A visitor wants to know who the street is named after. They choose "Névadó", which comes right after "Építők" in the navigation, and read about Dembinszky Henrik's life. The page opens with the Rodakowski portrait and its caption, and ends with a numbered source list that the in-text markers point to.

**Why this priority**: Adding this page was explicitly requested alongside Építők, and the street name is the most obvious question new visitors have.

**Independent Test**: Choose "Névadó" in the navigation, and confirm the page shows the text of `input/nevado.md`, the suggested opening portrait with its caption, and a numbered source list that the in-text markers link to.

**Acceptance Scenarios**:

1. **Given** the main navigation, **When** the visitor looks at it, **Then** "Névadó" appears immediately after "Építők", and "Impresszum" is the last item.
2. **Given** the Névadó page, **When** it loads, **Then** the Rodakowski portrait of Dembinszky Henrik is shown as the opening image, captioned with the caption text from `input/nevado.md`.
3. **Given** a source marker such as [3] in the text, **When** the visitor activates it, **Then** they land on the matching numbered entry under "Források és továbbolvasás".
4. **Given** the Névadó page, **When** the visitor reads it, **Then** the editorial note "Javasolt nyitókép" is not printed as a section; its image and caption are used as the opening image instead.

---

### User Story 3 - Pages designed individually, not templated (Priority: P2)

The site owner wants each story page to have its own visual treatment, such as pull quotes, highlighted names, a portrait or section dividers. The pages are hand-authored from the Markdown drafts rather than converted by a generic Markdown-to-page script, so their layouts can differ.

**Why this priority**: This is the owner's stated reason for the approach. It matters for the long-term shape of the site but does not block visitors from reading the content.

**Independent Test**: Review how the pages are produced. No build step reads `input/epitok.md` or `input/nevado.md`, and editing either Markdown file does not change the published pages.

**Acceptance Scenarios**:

1. **Given** the built site, **When** `input/epitok.md` or `input/nevado.md` is edited and the site is rebuilt, **Then** the published pages do not change.
2. **Given** the two pages, **When** compared side by side, **Then** each can have layout elements the other lacks, such as an opening portrait on Névadó only, without either one being forced into a shared article template.

---

### Edge Cases

- A visitor has bookmarked `/irasok/`. The page no longer exists and the site's normal not-found behaviour applies. It was never populated, because the article list was empty.
- Some source links in `input/epitok.md` carry a tracking suffix (`?utm_source=chatgpt.com`). The published links must point to the clean URL without it.
- Long Hungarian compound words and headings must wrap without horizontal scrolling at 320 px width.
- The footer navigation also lists "Írások" today. It must follow the same change as the header.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST remove the "Írások" item from the header and footer navigation and MUST no longer publish the Írások page.
- **FR-002**: The site MUST show an "Építők" navigation item in the position "Írások" held, and a "Névadó" item immediately after it. "Impresszum" MUST remain the last item, so the page links end in the order Építők, Névadó, Impresszum.
- **FR-003**: The site MUST publish an Építők page whose text is the full content of `input/epitok.md`: the lead paragraph, all sections and sub-sections in order, emphasis, and inline source links.
- **FR-003a**: The Építők page MUST end with a "Források" list that has one entry per distinct source cited inline. A source cited more than once, such as the bp16.hu document, is listed once. The inline links stay in the text as well.
- **FR-003b**: The Építők page MUST open with one image of the building's façade, chosen from the archive images the site already hosts. It carries the same caption, credit and licence as that image has elsewhere on the site. No other images are added to this page.
- **FR-004**: The site MUST publish a Névadó page whose text is the full content of `input/nevado.md`, including the numbered "Források és továbbolvasás" list.
- **FR-005**: On the Névadó page, each numbered in-text source marker MUST link to its matching entry in the source list.
- **FR-006**: The Névadó page MUST open with the Rodakowski portrait named in the "Javasolt nyitókép" note, using that note's caption. The note itself MUST NOT appear as page text.
- **FR-007**: Both pages MUST be authored by hand as page files. They MUST NOT be generated at build time from the Markdown files in `input/`, whether by a script or a Markdown pipeline.
- **FR-008**: Both pages MUST meet the site constitution, as every existing page does. That means static HTML readable without JavaScript, the performance budget, mobile-first layout, and full metadata: unique title and description, canonical URL, Open Graph and Twitter tags, `Article` and `BreadcrumbList` structured data, and inclusion in the sitemap.
- **FR-009**: Outbound source links MUST be published without tracking query parameters.
- **FR-010**: Project documentation, including the README, and the existing site output checks MUST be updated to reflect that Írások has been replaced by Építők and Névadó.

### Key Entities

- **Story page**: A hand-authored long-form page with a title, a lead paragraph, an opening image, sections, inline links and a source list. There are two instances: Építők and Névadó.
- **Source entry**: A numbered reference on the Névadó page, with a title, a URL and an optional note, that in-text markers point to.
- **Navigation item**: A label and a destination in the header and footer menus.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: From any page, a visitor reaches either new page in one tap or click from the main navigation.
- **SC-002**: 100% of the headings, paragraphs and links in each input file appear on the matching page. This can be checked by comparing section headings and link counts.
- **SC-003**: No page on the site links to `/irasok/`, and the internal link check reports zero broken links.
- **SC-004**: Both new pages meet the constitution's Lighthouse mobile thresholds: Performance, Accessibility and Best Practices ≥ 95, and SEO = 100.
- **SC-005**: Both pages render without horizontal scrolling at 320 px, 768 px and 1280 px widths.

## Assumptions

- "Not by the script" means no automatic Markdown-to-page conversion. The Markdown files are the source text that a person or agent turns into hand-written pages once. Later wording changes are made directly in the pages.
- The URLs follow the site's existing Hungarian slug style: `/epitok/` and `/nevado/`.
- No redirect is set up from `/irasok/`, because it never held any articles. The `articles` list in the editorial config and its supporting styles and docs are removed along with the page.
- The Rodakowski portrait is public domain on Wikimedia Commons, so it may be self-hosted and processed like the other archive images.
- Apart from its opening façade image, the Építők page's visual variety comes from typography and layout, such as pull quotes and highlighted key facts. No new images are sourced for it.
- `input/timeline.md` and the timeline pipeline are out of scope.
- The new pages are reached only through the header and footer menus. Links from the home page or from timeline events are out of scope.
