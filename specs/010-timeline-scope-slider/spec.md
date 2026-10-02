# Feature Specification: Timeline scope slider

**Feature Branch**: `master` (direct)

**Created**: 2026-10-02

**Status**: Implemented

**Input**: User description: "i want to add a filter for the timeline" — a cumulative slider labelled "Milyen messzire nézzünk a háztól?" with four settings, Ház · Környék · Magyarország · Világ, each setting including the previous ones. The default is Környék. Its description goes at the end of the Jelmagyarázat. The control travels with the page but never sits higher than the start of the timeline. On wide screens it is always open and carries a short explanation. On narrow screens it shrinks to a small circle in a lower corner and opens on click. It reuses the four category icons from the Jelmagyarázat with the same meaning.

The home page timeline has 135 events in four categories, shown with the same four icons and labels as the Jelmagyarázat: A ház (house), Környék (area), Magyarország (hungary) and Világ (world). Events per era:

| Era | Ház | Környék | Magyarország | Világ |
|---|---|---|---|---|
| 1873–1913 | 19 | 16 | 3 | 2 |
| 1914–1938 | 15 | 15 | 6 | 7 |
| 1939–1945 | 8 | 2 | 11 | 6 |
| 1946–1968 | 3 | 10 | 6 | 6 |
| **Visible at this setting** | **45** | **88** | **114** | **135** |

Every era still has at least two events at the narrowest setting.

## Clarifications

### Session 2026-10-02

- Q: On wide screens, where should the always-open slider sit while the timeline scrolls past? → A: A side panel to the right of the timeline column. It starts level with the first era, stays in view just below the site header while scrolling, and stops at the end of the timeline.
- Q: What should happen at laptop widths (about 1100–1400 px), where a side panel doesn't fit beside the full 1060 px timeline column? → A: From 1100 px up, the timeline column narrows to make room for the side panel. Below 1100 px, the round button is used.
- Q: What should the side panel do while it scrolls past the full-width chapter openers between eras? → A: It steps aside: the panel fades out while a chapter opener fills the screen and comes back when the next era's events start. The chapter openers keep their current layout.
- Q: Should the timeline remember the visitor's last setting on a later visit? → A: Only if the visitor has accepted cookies in the site's existing consent notice. Then the last setting is stored in their browser and used on the next visit. Without acceptance, every page load starts at Környék and nothing is stored. A link to a hidden event still widens the view (FR-011).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Zoom the story out from the house (Priority: P1)

A visitor scrolling the timeline moves the slider from Ház to Világ. The timeline widens step by step: first only the house and its people, then the neighbourhood, then Hungarian history, then world events. Each setting includes everything the narrower ones show.

**Why this priority**: This is the feature itself: the visitor zooms out from Dembinszky utca 18. It works on its own without the special placement rules.

**Independent Test**: Open the home page, set each of the four positions in turn and count the visible events.

**Acceptance Scenarios**:

1. **Given** the slider is at Ház, **Then** only "A ház" events are visible, including the "Személy" rows.
2. **Given** the slider is at Környék, **Then** "A ház" and "Környék" events are visible.
3. **Given** the slider is at Magyarország, **Then** "A ház", "Környék" and "Magyarország" events are visible.
4. **Given** the slider is at Világ, **Then** all 135 events are visible.
5. **Given** any setting, **Then** each era's "Kronológia · N esemény" count shows the number of events visible in that era, and the timeline line stays continuous with no gaps where hidden events were.
6. **Given** any setting, **Then** the visible events stay in their original date order.

---

### User Story 2 - A first visit starts at Környék, a returning visitor where they left off (Priority: P1)

A first-time visitor sees the house together with its neighbourhood, so the page is rich enough to explain why the house is interesting, without the full national and world history at once.

**Why this priority**: The default decides what most visitors ever see.

**Independent Test**: Open the home page in a fresh browser and check the slider position and the visible events.

**Acceptance Scenarios**:

1. **Given** a first visit, or a later visit without accepted cookies, **When** the page loads, **Then** the slider is at Környék and Magyarország and Világ events are hidden.
2. **Given** a visitor who accepted cookies and last chose Világ, **When** they open the home page again, **Then** the slider is at Világ.
3. **Given** a page load, **Then** hidden events do not flash visible first and then disappear.

---

### User Story 3 - The control travels with the reader (Priority: P2)

While reading a long timeline, the visitor can reach the slider without scrolling back. The slider never covers the page's opening (hero) or the Jelmagyarázat.

**Why this priority**: Without it, the slider is only usable at one spot on a very long page.

**Independent Test**: Scroll from the top of the home page to the closing section on a wide screen and on a phone-size screen.

**Acceptance Scenarios**:

1. **Given** a wide screen, **When** the visitor scrolls above the start of the timeline, **Then** the slider is not shown above the hero or the Jelmagyarázat.
2. **Given** a wide screen, **When** the timeline is in view, **Then** the slider stays in view as a side panel to the right of the timeline column, just below the site header, fully open, with the question, the four labelled positions with their icons, and the short explanation. It does not cover event text.
3. **Given** a narrow screen, **When** the timeline is in view, **Then** a small round button with an icon sits in a lower corner of the screen.
4. **Given** a narrow screen, **When** the visitor taps the round button, **Then** the full slider opens. When they tap outside it, press Escape or tap the button again, it closes back to the circle.
5. **Given** a narrow screen, **When** the circle is closed, **Then** its icon shows the current setting, so the visitor can tell how far the view reaches without opening it.
6. **Given** a wide screen, **When** a chapter opener between eras fills the screen, **Then** the side panel fades out, and it comes back when that era's events start.
7. **Given** any screen, **When** the visitor scrolls past the end of the timeline into the closing section, **Then** the slider does not cover the closing text or the footer.

---

### User Story 4 - The Jelmagyarázat explains the slider (Priority: P3)

A visitor reading the Jelmagyarázat learns that the slider exists and how it works before they reach the timeline.

**Independent Test**: Read the end of the Jelmagyarázat.

**Acceptance Scenarios**:

1. **Given** the Jelmagyarázat, **Then** its last part describes the slider: it widens the story's field of view from the house to world events and each setting includes the previous ones. It does not mention the starting setting.

---

### Edge Cases

- **A link points to a hidden event** (for example `/#<event-id>` from the Lakók page, the sitemap or a search result): the slider widens to the narrowest setting that shows that event, and the page scrolls to it.
- **JavaScript is off or fails**: all 135 events are shown and the slider is not shown. The Jelmagyarázat text still reads correctly.
- **Printing**: the printout shows the events of the current setting, and the slider itself is not printed.
- **Keyboard and screen-reader users**: the slider works with arrow keys, Home and End. It announces its name (the question) and the current setting by name, not by number. A change of setting is announced politely (for example "Környék: 88 esemény").
- **Reduced motion**: when the visitor prefers reduced motion, events appear and disappear without animation.
- **The setting changes while the visitor is mid-page**: the event at the top of the screen stays in place, so the visitor does not lose their reading position. If that event is hidden, the view moves to the nearest visible event.
- **The narrow-screen circle and other floating parts**: the circle does not overlap the mobile menu or the image viewer. It is hidden while either is open.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The home page timeline MUST have one slider with four positions in this order: Ház, Környék, Magyarország, Világ.
- **FR-002**: The slider MUST be cumulative. Ház shows "A ház" events, and each further position adds one more category: Környék, then Magyarország, then Világ.
- **FR-003**: Without accepted cookie consent, every page load MUST start at Környék and the setting MUST NOT be stored in the browser.
- **FR-017**: When the visitor has accepted cookies in the existing consent notice, the slider MUST store its current setting in the browser whenever it changes, and the next page load MUST start at the stored setting. A link to a hidden event still widens the view (FR-011).
- **FR-018**: When the visitor accepts cookies, the current setting MUST be stored at that moment. When they withdraw consent (from the footer's settings link), the stored setting MUST be deleted, and the next page load starts at Környék.
- **FR-019**: The consent notice and the data-handling section of the Impresszum page MUST say that accepting also lets the site remember the timeline setting in the browser.
- **FR-004**: The slider MUST be headed "Milyen messzire nézzünk a háztól?". Each position MUST show its label and the same icon the Jelmagyarázat uses for that category.
- **FR-005**: On wide screens (1100 px and wider) the slider MUST be a side panel to the right of the timeline column, always open, and show the short explanation "A csúszka tágítja a történet látómezejét: a háztól egészen a világ eseményeiig."
- **FR-016**: On wide screens the side panel MUST fade out while a chapter opener fills the screen and return when the next era's events start. The chapter openers MUST keep their current layout. With reduced motion, the panel hides and returns without a fade.
- **FR-015**: From 1100 px up, the timeline column MUST narrow so the side panel fits beside it without overlap. Below 1100 px the timeline keeps its current layout.
- **FR-006**: On narrow screens (below 1100 px) the slider MUST collapse into a small round button in a lower corner. The button MUST open the full slider, and the slider MUST close again by tapping outside it, pressing Escape or tapping the button. The button must be at least 44 × 44 px.
- **FR-007**: The slider MUST stay in view while the timeline is on screen, MUST NOT appear above the start of the timeline (on wide screens its top edge starts level with the first era), and MUST NOT cover the closing section or the footer.
- **FR-008**: Each era's event count MUST match the number of events visible in that era.
- **FR-009**: Hidden events MUST still be part of the page for search engines and structured data. Only their display changes.
- **FR-010**: Without JavaScript, all events MUST be shown and the slider MUST NOT be shown.
- **FR-011**: A link to a hidden event MUST widen the slider far enough to show it.
- **FR-012**: The slider MUST be usable by keyboard and screen reader as described in Edge Cases.
- **FR-013**: The Jelmagyarázat MUST end with a short description of the slider, as in User Story 4.
- **FR-014**: The slider MUST be on the home page only. Apart from the consent wording in FR-019, the other pages do not change.

### Key Entities

- **Scope setting**: one of the four ordered positions (Ház, Környék, Magyarország, Világ). Each maps to the timeline categories it shows: itself and all narrower ones.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The timeline shows exactly 45 events at Ház, 88 at Környék, 114 at Magyarország and 135 at Világ, and each era's count matches the era table above for every setting.
- **SC-002**: A first-time visitor sees the Környék setting, and a returning visitor who accepted cookies sees their last setting, in both cases with no visible flash of events that should be hidden.
- **SC-003**: A visitor can change the setting in one drag or tap on wide screens, and in two taps on narrow screens (open, choose).
- **SC-004**: The home page keeps its current Lighthouse scores (performance at or above its current value, accessibility, best practices and SEO at 100) and shows no new layout shift.
- **SC-005**: The slider never covers event text, the hero, the Jelmagyarázat, the closing section, the chapter openers or the footer at 360 px, 768 px, 1099 px, 1100 px, 1280 px and 1600 px widths.

## Assumptions

- "Milyen messzir" in the request is a typo for "Milyen messzire".
- The "Személy" rows belong to "A ház", as the Jelmagyarázat already says, so they are visible at every setting.
- The round button goes in the lower right corner, matching the common placement for floating controls. The slider labels use the existing category labels, except that "A ház" is shortened to "Ház" on the slider, as in the request.
- The slider changes only which events are displayed. The era openers, the era introductions and the closing section always show.
