# Feature Specification: Mobile-friendly top menu

**Feature Branch**: `004-mobile-navigation`

**Created**: 2026-09-29

**Status**: Draft

**Input**: User description: "the top menu does not work wll on mobile devices, because the menu items after the eras are not visible. this should be fixed. the result should follow best practices and current trends"

## Clarifications

### Session 2026-09-29

- Q: Which pattern should the mobile menu use? → A: A "Menü" button that opens a panel with all items, grouped as "Korszakok" and "Oldalak". Only on small screens; wide screens keep today's one-row menu.
- Q: Should the menu show which era the visitor is reading? → A: Yes, it is in scope (User Story 4).

## Problem

On a phone, the top menu is a single row that scrolls sideways with no visible scrollbar. Only the four era links fit on the screen. The links after them (Építők, Névadó, Impresszum) are cut off at the right edge, and nothing hints that the row can be scrolled. So most mobile visitors never find the two story pages or the legal notice from the menu.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reach every page from the menu on a phone (Priority: P1)

A visitor on a phone wants to open the Építők, Névadó or Impresszum page, or jump to an era. They can see or reveal every menu item without guessing that something is hidden.

**Why this priority**: This is the reported defect. Two of the three story pages are effectively unreachable from the menu on phones.

**Independent Test**: On a 360 px wide phone screen, find and open each of the 7 menu destinations from the top of any page, without horizontal swiping.

**Acceptance Scenarios**:

1. **Given** any page on a 320–480 px wide screen, **When** the visitor looks at the header, **Then** every menu item is either visible, or there is an obvious, labelled control that reveals all of them.
2. **Given** the visitor opens the menu, **When** they choose Építők, Névadó or Impresszum, **Then** that page opens.
3. **Given** the visitor opens the menu, **When** they choose an era, **Then** the timeline scrolls to that era's opener with the heading visible below the sticky header, and the menu is closed.
4. **Given** the visitor is on Névadó, **When** they look at the menu, **Then** Névadó is marked as the current page.

---

### User Story 2 - Use the menu with a keyboard, a screen reader or no JavaScript (Priority: P1)

A visitor who uses a keyboard, a screen reader, or a browser with JavaScript turned off can reach and use every menu item.

**Why this priority**: The constitution requires every feature, navigation included, to work by touch, keyboard and screen reader, and without JavaScript.

**Independent Test**: With JavaScript disabled, and then with a screen reader, reach all 7 destinations on a phone-sized screen.

**Acceptance Scenarios**:

1. **Given** JavaScript is disabled, **When** the visitor uses the menu on a phone-sized screen, **Then** all 7 destinations can still be reached.
2. **Given** a keyboard user, **When** they Tab through the header, **Then** focus is always visible and reaches every destination in a logical order. If there is a menu control, Enter or Space opens it, and Escape closes it and returns focus to the control.
3. **Given** a screen reader user, **When** they reach the menu control, **Then** it announces its name ("Menü") and whether it is open or closed.

---

### User Story 3 - The desktop menu stays as it is (Priority: P2)

A visitor on a wide screen keeps seeing the full menu in one row, as now.

**Why this priority**: The desktop header already works. The fix must not make it worse.

**Independent Test**: At 1280 px, the header looks and behaves as before.

**Acceptance Scenarios**:

1. **Given** a screen at least 900 px wide, **When** any page loads, **Then** all menu items are visible in one row and no menu control is shown.

---

### User Story 4 - See which era I am reading (Priority: P3)

A visitor scrolling through the timeline on the home page sees which era they are in. The matching era is highlighted in the menu: in the one-row menu on wide screens, and in the panel when they open it on a phone.

**Why this priority**: It helps visitors find their way on a long page, but the menu works without it.

**Independent Test**: On the home page, scroll from 1873 to 1968. The highlighted era in the menu changes at each era opener.

**Acceptance Scenarios**:

1. **Given** the visitor is reading events from 1914–1938, **When** they look at the menu, **Then** "1914–1938" is highlighted and no other era is.
2. **Given** the visitor is above the first era, in the opening section, **When** they look at the menu, **Then** no era is highlighted.
3. **Given** the visitor scrolls on into the next era, **When** its opener reaches the top of the screen, **Then** the highlight moves to that era.
4. **Given** the visitor chooses an era in the menu, **When** the page has scrolled there, **Then** that era is highlighted.
5. **Given** JavaScript is disabled, or the visitor is on a story page, **When** they look at the menu, **Then** no era is highlighted and everything else works as usual.

### Edge Cases

- **Very narrow screens (320 px) or large text settings (200% zoom):** every item stays reachable, and no text is clipped or overlaps.
- **Rotating the phone, or resizing the window while the menu is open:** the layout adapts, and nothing stays stuck open over the page.
- **An era link while the menu is open:** the page scrolls to the era, and the menu doesn't stay covering the content.
- **The open menu on a long page:** it doesn't cause the page behind it to jump or lose its scroll position.
- **Story pages:** era links on the story pages lead to the right era on the home page.
- **Fast scrolling or a jump to the page end:** the highlight settles on the era actually on screen, without flickering between eras.
- **Screen readers:** the highlight changes silently. A screen reader must not announce anything each time the visitor scrolls into a new era.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: On screens narrower than 900 px, all 7 menu destinations MUST be reachable from the header without horizontal scrolling or swiping: the four eras, Építők, Névadó and Impresszum.
- **FR-002**: On small screens (narrower than 900 px, where the full row doesn't fit), the header MUST show the brand and a "Menü" button. The button opens a panel listing all 7 destinations under two headings: "Korszakok" (the four eras) and "Oldalak" (Építők, Névadó, Impresszum). On wider screens the button MUST NOT appear, and the menu stays a single visible row.
- **FR-003**: The menu MUST keep the two kinds of destination visibly apart: the eras (places on the timeline) and the story pages (separate pages).
- **FR-004**: The current page MUST be marked in the menu, visually and for screen readers.
- **FR-005**: Every menu item and control MUST be at least 44 × 44 px to tap, with a visible keyboard focus style.
- **FR-006**: The menu MUST work without JavaScript. Any script may only improve it, for example closing the menu after an era link is chosen or when Escape is pressed.
- **FR-007**: Any menu control MUST have an accessible name in Hungarian and expose whether it is open or closed. When open, the menu MUST close with Escape and return focus to the control.
- **FR-008**: The header MUST stay sticky and no taller than it is now when the menu is closed, so it doesn't take more reading space on phones.
- **FR-009**: The desktop layout (≥ 900 px) MUST be unchanged.
- **FR-010**: The change MUST keep every page within the constitution's performance budget and the accessibility score.
- **FR-011**: Motion MUST respect the visitor's reduced-motion setting: no animation when reduced motion is requested.
- **FR-012**: On the home page, the menu MUST highlight the era whose section the visitor is currently reading, both in the wide-screen row and in the small-screen panel. At most one era is highlighted at a time, and none while the opening section is on screen.
- **FR-013**: The era highlight MUST look different from the current-page mark, so "you are here on the timeline" and "you are on this page" aren't confused. It MUST NOT rely on colour alone.
- **FR-014**: The era highlight is an enhancement. Without JavaScript the menu MUST work exactly as described in FR-001 to FR-011, just without the highlight. Page scrolling MUST stay smooth, with no noticeable jank.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a 360 px wide screen, a first-time visitor can find and open Névadó from the home page in 2 taps or fewer.
- **SC-002**: 7 of 7 menu destinations can be reached on phone-sized screens (320, 360, 390 and 430 px wide), with and without JavaScript.
- **SC-003**: Lighthouse mobile scores stay at the principle II thresholds on every page: Performance, Accessibility and Best Practices ≥ 95, SEO 100.
- **SC-004**: At 200% text zoom on a 360 px screen, no menu text is clipped and nothing overlaps.
- **SC-005**: With the menu closed, the sticky header is no taller on phones than it is today.
- **SC-006**: While scrolling the whole home page from top to bottom, the highlighted era matches the era on screen at 100% of the checked points: inside each of the 4 eras, and in the opening section, where none is highlighted.

## Assumptions

- "Mobile" means screens narrower than the existing 900 px breakpoint. The desktop header already shows every item and stays as it is.
- The menu keeps its 7 destinations and their labels. Adding, renaming or regrouping destinations is out of scope.
- Hungarian labels: the menu control is called "Menü", and the groups are "Korszakok" (eras) and "Oldalak" (pages).
- The footer menu already lists the story pages and needs no change.
- The era highlight needs a small script, which fits the constitution's limit of optional vanilla JavaScript (≤ 20 KB site-wide) as long as the menu works without it.
- "Best practices and current trends" means the patterns in widely used design systems, such as GOV.UK, Material and Apple HIG: a clearly labelled menu control, grouped items, a visible current page, no hidden scrolling, and full keyboard and screen-reader support.
