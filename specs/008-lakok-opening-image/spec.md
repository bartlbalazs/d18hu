# Feature Specification: Lakók opening image

**Feature Branch**: `master` (direct)

**Created**: 2026-10-01

**Status**: Implemented

**Input**: User description: "for the lakók page i have an image to use somewhere the beginning. the placement is not decided yet. the image is assets/facade6.png advise how to place, then implement"

## Clarifications

### Session 2026-10-01

- Q: Should the photo stand on its own, or be a faded backdrop like era 1 on the home page? → A: On its own. It is the site's only picture of the whole street front, and a faded backdrop would hide the building and repeat the home page.
- Q: Where does the photo go? → A: After the lead and before the method paragraph, the same order as the Névadó portrait.
- Q: Whose photo is it? → A: Globetrotter19, 1 May 2022, CC BY-SA 3.0, from Wikimedia Commons ("Dembinszky Straße 18 und 20, 2022 Erzsébetváros.jpg"), cropped and retouched.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The page opens with the house itself (Priority: P1)

A visitor opens the Lakók page. Near the top, before the long lists and portraits begin, they see the whole street front of Dembinszky utca 18. They can link the people in the lists to the building they lived in.

**Why this priority**: This is the whole feature. Lakók is now the only story page without an opening image.

**Independent Test**: Open `/lakok/` on a phone and on a desktop. The façade photo appears at the agreed place in the opening, with a caption and credit. It can be enlarged, and the text around it reads as on Névadó.

**Acceptance Scenarios**:

1. **Given** a visitor on `/lakok/`, **When** the page loads, **Then** the façade photo shows after the lead and before the method paragraph, uncropped, with a caption and a credit line.
2. **Given** the photo is shown, **When** the visitor clicks or taps it, **Then** it opens enlarged in the same viewer the other pages use, and closes back to the same scroll position.
3. **Given** a screen reader user, **When** they reach the photo, **Then** it is announced with an alternative text that describes the façade.
4. **Given** a 320 px wide screen, **When** the page loads, **Then** the photo fits the column, and the page does not scroll sideways.

### Edge Cases

- The photo is tall (about 4 : 7). On a phone it must not push the lead out of the first screen. The lead stays above the photo.
- Slow connections: the photo is the page's largest element. It must load in modern compressed formats at the size the screen needs, and the page keeps its Lighthouse scores.
- Printing: the photo prints in the column at no more than half a page high.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Lakók page MUST show `assets/facade6.png` once, in the opening part of the page, before the first era section.
- **FR-002**: The photo MUST be placed after the lead and before the method paragraph, in a column narrower than the text, so the whole photo is about one screen high.
- **FR-003**: The photo MUST use the same figure treatment as the opening images on Építők and Névadó: frame, caption, credit line, and click to enlarge.
- **FR-004**: The photo MUST NOT be cropped; its full height is shown, scaled to the column.
- **FR-005**: The caption and credit MUST read "A Dembinszky utca 18. utcai homlokzata 2022-ben" and "Fotó: Globetrotter19, 2022, CC BY-SA 3.0, kivágás, utómunka", with a link to the Wikimedia Commons file page, as the licence requires.
- **FR-006**: The photo MUST have a Hungarian alternative text that describes the street front.
- **FR-007**: The page's structured data MUST name the photo as the article's image, as Névadó does.
- **FR-008**: The requirement of feature 007 that the page has no images (FR-007a) is replaced by this feature.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a 375 × 667 screen, the heading and the first line of the lead are visible without scrolling.
- **SC-002**: `/lakok/` keeps a Lighthouse score of 100 in performance, accessibility, best practices and SEO.
- **SC-003**: At every width from 320 px to 1920 px, the page has no sideways scroll.
- **SC-004**: The photo's caption and credit are complete before the release build accepts the page.

## Assumptions

- The page's other content, the era bands and the lists stay as they are.
- No other new images are added in this iteration.
- The shared social-card image (the cropped hero façade) stays as it is.
