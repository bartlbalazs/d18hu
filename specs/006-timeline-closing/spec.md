# Feature Specification: Closing section after the 1968 timeline

**Feature Branch**: `006-timeline-closing`

**Created**: 2026-09-29

**Status**: Draft

**Input**: User description (Hungarian, summarised): "1968 utáni timeline-záró szakasz". After the last, 1968 timeline item, the historical timeline should visually end. Then a small caesura: a larger vertical gap and a short, thin, understated horizontal line in the site's colours, not running the full content width. Below it, a short closing block (text given verbatim below), in which the word „írjon” links to the Impresszum. The block gets no background, frame, icon, year or separate call-to-action button. The caesura and the larger gap signal that the documented timeline has ended, while the house's story of course continues.

## Clarifications

### Session 2026-09-29

- Q: Where should the closing block and its short line sit horizontally? → A: Centred. The short line is in the middle of the page, and the heading and text are centred in a narrow reading column.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The reader sees where the documented history ends (Priority: P1)

A visitor scrolls through the last era (1946–1968). After the last event, the timeline clearly stops. After a noticeably larger gap, a short, thin line marks a pause, and a short closing text follows.

**Why this priority**: Today the timeline simply runs into the footer. Without a clear ending, readers can't tell whether the chronology is complete or was cut off.

**Independent Test**: Open the home page at 320, 768 and 1280 px width and scroll past the last event. The timeline's axis ends at the last event, and the gap, the line and the closing block follow in that order.

**Acceptance Scenarios**:

1. **Given** the home page, **When** the reader reaches the last event of the 1946–1968 era, **Then** the timeline's vertical axis and markers end there and don't continue below it.
2. **Given** the end of the timeline, **When** the reader scrolls on, **Then** they see a larger vertical gap than between events, then a short, thin horizontal line narrower than the content column, then the closing block.
3. **Given** the closing block, **When** it is displayed, **Then** it has no background, frame, icon, year, or button. It reads as ordinary text on the page.

---

### User Story 2 - The reader is invited to share their own memories (Priority: P1)

A former or current resident reads that later decades are documented mainly by the people who lived here, and follows the link to the Impresszum to get in touch.

**Why this priority**: The owner wants to collect photos, documents and stories about the decades after 1968, for which few public sources exist.

**Independent Test**: Click „írjon” in the closing block. The Impresszum page opens.

**Acceptance Scenarios**:

1. **Given** the closing block, **When** it is displayed, **Then** it shows the heading and the two paragraphs exactly as in FR-004.
2. **Given** the closing block, **When** the reader activates „írjon”, **Then** the Impresszum page (`/impresszum/`) opens.
3. **Given** a keyboard or screen-reader user, **When** they reach the closing block, **Then** the heading is announced as a heading, and the link reads as „írjon” in the context of its sentence.

### Edge Cases

- **JavaScript disabled:** the block and the link work the same, since they are plain page content.
- **Narrow screens (320 px):** the line stays short and centred. It never causes sideways scrolling, and the centred text wraps normally.
- **The era highlight in the menu (spec 004):** while the closing block is on screen, the last era (1946–1968) stays the highlighted one. The block isn't an era.
- **Analytics (spec 005):** „írjon” is an internal link, so it isn't reported as an archive-source click.
- **Later events after 1968:** if the timeline gains later events, the closing block stays after the last event, whatever its year. It is tied to the end of the timeline, not to 1968 specifically.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The timeline's visual elements (axis line and event markers) MUST end at the last event and not extend below it.
- **FR-002**: After the last event there MUST be a vertical gap clearly larger than the spacing between two events (at least twice as large), followed by a short, thin horizontal line.
- **FR-003**: The line MUST be understated: at most 2 CSS px thick, in one of the site's existing muted colours, and clearly shorter than the content width. It MUST be horizontally centred on the page. It is decorative, so screen readers MUST NOT announce it.
- **FR-004**: Below the line, a closing block MUST show this text verbatim:
  - Heading: „A történet folytatódik”
  - Paragraph 1: „A hatvanas évek után jóval kevesebb nyilvános forrás maradt fenn. Az újabb évtizedek történeteit ezért leginkább azok őrzik, akik a házban éltek vagy ma is itt laknak.”
  - Paragraph 2: „Ha Ön vagy családtagja lakott itt, esetleg van régi fényképe, dokumentuma vagy története a házról, írjon.”
- **FR-005**: In paragraph 2, only the word „írjon” MUST be a link, and it MUST point to the Impresszum page (`/impresszum/`). The final full stop is not part of the link.
- **FR-006**: The closing block MUST NOT have its own background, border, frame, icon, year or date label, or button-styled call to action. Its typography MUST match the site's existing heading and body text styles.
- **FR-007**: The heading MUST fit the page's heading hierarchy (at the same level as the era sections' headings or one level above), so the page keeps one `h1` and a logical order.
- **FR-008**: The heading and both paragraphs MUST be centred, in a narrow reading column (no wider than the timeline's event text), so centred lines stay short enough to read. The block MUST be readable and usable from 320 px to ≥ 1920 px, and meet the constitution's contrast, text-size and touch-target rules.
- **FR-009**: The block MUST appear only on the home page, once, after the timeline and before the footer.

### Key Entities

- **Closing block**: a heading and two paragraphs of fixed Hungarian text, with one internal link. It is static site text, not a timeline event.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On the home page at 320, 768 and 1280 px, the timeline axis ends at the last event in 100% of checks, and no timeline marker appears below it.
- **SC-002**: The gap between the last event and the line is at least twice the gap between two consecutive events.
- **SC-003**: The line is at most 2 px thick and at most 25% of the content width at 768 px and wider, and at most 40% at 320 px. Its centre and the block's text centre are within 1 px of the content column's centre.
- **SC-004**: The heading and both paragraphs match FR-004 character for character, and the only link in the block points to `/impresszum/`.
- **SC-005**: The home page still meets every constitution principle II threshold (Lighthouse mobile Performance, Accessibility and Best Practices ≥ 95, SEO 100), and HTML validation reports no errors.

## Assumptions

- The text is fixed and written by the owner. It may live in the site's editorial texts, like the other opening and era texts, so it can be edited without touching code.
- „Impresszum oldal” means the Impresszum page itself. That page already shows the contact e-mail and a similar invitation to send corrections, memories, photos and documents.
- No new images, icons or scripts are needed.
