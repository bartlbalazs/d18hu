# Feature Specification: Visitor statistics with Google Analytics

**Feature Branch**: `005-google-analytics`

**Created**: 2026-09-29

**Status**: Draft

**Input**: User description: "i want to have the analytics in google analytics. bear in mind that i upload this repo to a public github thing, so do not commit any sensitive thing"

## Clarifications

### Session 2026-09-29

- Q: How should Google Analytics be reconciled with constitution principle IV? → A: Amend the constitution to allow Google Analytics only after the visitor's consent. Nothing is loaded or sent before that.
- Q: What should be measured? → A: Page views plus 3 reading events: clicks on archive-source links, image zooms, and era jumps from the menu.

## Context

The owner wants to know how many people visit the site, which pages they read and where they come from, and to see this in Google Analytics.

Two constraints shape this feature:

- **The repository is public on GitHub.** Nothing secret may be committed: no account passwords, API secrets or service keys.
- **The project constitution (principle IV) currently forbids this.** It says: "No third-party trackers … Analytics, if ever added, MUST be privacy-friendly, cookieless and ≤ 5 KB."
  - Google Analytics is a third-party service, sets cookies, and its script is far larger than 5 KB.
  - EU privacy law (GDPR and the ePrivacy rules, which apply to a Hungarian site) requires visitors' prior consent before such cookies are set.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The owner sees visitor statistics (Priority: P1)

The owner opens Google Analytics and sees:
- how many people visited the site, and on which days
- which pages they viewed
- what kind of device they used
- where they came from (search, social media, links)

**Why this priority**: This is what the owner asked for.

**Independent Test**: Visit the live site and allow statistics. The visit appears in Google Analytics' real-time report within a minute.

**Acceptance Scenarios**:

1. **Given** a visitor who allowed statistics, **When** they open the home page and then Névadó, **Then** Google Analytics shows both page views.
2. **Given** a normal day of traffic, **When** the owner opens the reports the next day, **Then** they see visitors, page views, devices and traffic sources for that day.
3. **Given** a visitor who allowed statistics, **When** they zoom into a photo, follow an archive-source link and choose an era in the menu, **Then** Google Analytics shows one event of each kind, naming the photo, the source and the era.

---

### User Story 2 - Visitors decide about statistics (Priority: P1)

A visitor gets a short, plain Hungarian notice that the site would like to count visits with Google Analytics. They can accept or refuse with equal ease, and can change their mind later.

**Why this priority**: The law requires it before any analytics cookie is set, and the owner is named in the Impresszum as the site's operator.

**Independent Test**: In a fresh private window, open the site and check that nothing is sent to Google before a choice is made. Refuse, and check that nothing is sent. Accept, and check that page views are sent.

**Acceptance Scenarios**:

1. **Given** a first visit, **When** the page loads, **Then** no statistics cookie is set and nothing is sent to Google until the visitor chooses.
2. **Given** the notice, **When** the visitor refuses, **Then** nothing is sent to Google, then or later, and the notice doesn't come back on later pages or visits.
3. **Given** the notice, **When** the visitor accepts, **Then** this and later page views are counted.
4. **Given** a visitor who chose earlier, **When** they use the "Statisztika beállításai" (statistics settings) link, **Then** they can change their choice, and a withdrawal takes effect immediately.
5. **Given** the notice is shown, **When** the visitor ignores it and just reads, **Then** the page stays fully readable and usable, and nothing is counted.

---

### User Story 3 - The site stays fast and readable (Priority: P2)

Visitors, including those who accept statistics, get the site as fast as before.

**Why this priority**: The performance budget is non-negotiable.

**Independent Test**: Run Lighthouse on every page, both before any choice and after accepting.

**Acceptance Scenarios**:

1. **Given** a first visit, **When** the page loads, **Then** no analytics code is downloaded until the visitor accepts.
2. **Given** any page, **When** Lighthouse mobile runs, **Then** every principle II threshold is still met.

### Edge Cases

- **JavaScript disabled:** no notice is shown and nothing is counted. The site works as before.
- **Ad or tracker blockers:** the site works normally, and the notice doesn't break or reappear endlessly.
- **Draft builds, local previews and test runs:** they must never send statistics.
- **Before the owner has set up the Google Analytics property:** the site builds and publishes without analytics and without a notice.
- **The browser's "Do Not Track" or Global Privacy Control signal:** it is treated as a refusal, and no notice is shown.
- **The 404 page:** it is counted like any other page when consent is given, so broken links show up in the reports.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST report page views to the owner's Google Analytics property, for visitors who have given consent.
- **FR-002**: Before this feature ships, constitution principle IV MUST be amended (through `/speckit-constitution`, as a MINOR version) to allow one consent-gated analytics service. The service may load, set cookies or send data only after the visitor's explicit consent. Without consent, the site MUST stay free of third-party requests, as it is today.
- **FR-003**: No analytics cookie MUST be set, and no request MUST be sent to Google, before the visitor gives consent. Refusing MUST be as easy as accepting: same prominence, one click.
- **FR-004**: The visitor's choice MUST be remembered, so the notice doesn't reappear on every page. Visitors MUST be able to change it from a link on every page.
- **FR-005**: The notice MUST NOT block reading. It is not a full-screen wall. It MUST be usable with a keyboard and screen readers, and meet the touch-target and contrast rules of the constitution.
- **FR-006**: The Impresszum MUST gain a short Hungarian privacy notice ("Adatkezelés"). It covers what is measured, by whom (Google, as processor), why, how long it is kept, and how to withdraw consent.
- **FR-007**: The statistics MUST be configured to collect as little as possible: shortened (anonymised) IP addresses, no advertising features, no personalised ads, no cross-site signals, and the shortest data retention Google Analytics allows.
- **FR-008**: What is measured MUST be page views plus exactly 3 reading events, and nothing else:
  - **Archive-source link clicked:** which source, by the link's address and the event it belongs to.
  - **Image opened in the zoom viewer:** which image.
  - **Era chosen in the menu:** which era.

  The events MUST NOT include any text a visitor typed, or any identifier of the visitor beyond what Google Analytics collects for a page view.
- **FR-009**: Nothing secret MUST be committed to the repository. The site's public measurement identifier is visible in every published page by design, so it isn't a secret. Anything that is a secret, such as account credentials or API secrets, MUST stay out of the repository and out of the build.
- **FR-010**: Only release builds of the live site MUST send statistics. Draft builds, local development, previews and test runs MUST NOT.
- **FR-011**: The analytics code MUST load only after consent, and MUST NOT delay the first view of any page.
- **FR-012**: The README MUST describe how to set up the Google Analytics property, and how to turn analytics on or off for a build.

### Key Entities

- **Consent choice**: accepted, refused or not yet given. Kept in the visitor's browser only, and changeable at any time.
- **Page view**: which page, when, the device type and the referrer. It is counted only for consenting visitors.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Within 1 minute of a consenting visit, it appears in Google Analytics' real-time report.
- **SC-002**: In 100% of checks before a choice or after a refusal, the browser shows 0 requests to Google and 0 analytics cookies.
- **SC-003**: A visitor can refuse or accept in 1 click, and change their choice in 2 clicks from any page.
- **SC-004**: Every page still meets the principle II thresholds (Performance, Accessibility and Best Practices ≥ 95, SEO 100), both before any choice and after accepting.
- **SC-005**: A search of the repository and its history finds 0 credentials, API secrets or private keys.
- **SC-006**: For a consenting visitor, each of the 3 reading events appears in Google Analytics' real-time report within 1 minute, with the photo, source or era it refers to.

## Assumptions

- The owner creates the Google Analytics property with the personal account (bartlbalazs@gmail.com), as with Firebase, and gives its measurement identifier to the build.
- Visitors are mostly in Hungary and the EU, so EU consent rules apply.
- Google Analytics reports are enough. No other dashboard is built.
- Consent is stored only in the visitor's own browser. The site has no server and keeps no records of its own.
- Statistics are counted only on the live address (`https://www.dembinszky18.hu/`), not on the Firebase default address.
