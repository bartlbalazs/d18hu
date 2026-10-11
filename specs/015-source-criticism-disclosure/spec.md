# Feature Specification: Source criticism split from the timeline story

**Feature Branch**: `master` (direct)

**Created**: 2026-10-12

**Status**: Draft

**Input**: User description: "/home/bartlbalazs/Downloads/d18_timeline_forraskritika_spec.md containts the new features spec"

**Source brief**: `d18_timeline_forraskritika_spec.md` (Hungarian, owner-supplied). It asks for an editorial and card-UI refactor of the home-page timeline. On cards where the story is mixed with detailed source criticism, the story stays visible and the research apparatus moves into a closed-by-default section labelled „Forráskritika és pontosítások”. No research finding, date, name variant, uncertainty or source link may be lost.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read a card's story without wading through the evidence (Priority: P1)

A visitor scrolls the timeline. On a card that used to mix the story with identification arguments, document-type limits and conflicting readings, they now see a short, lively story of 2–4 sentences. The story still says, briefly, whatever limit they need to avoid a misreading, for example that only an address is documented, or that the person's identity is inferred. The visitor understands what happened, when, why it matters and exactly how it relates to Dembinszky utca 18, without opening anything.

**Why this priority**: This is the point of the refactor. Long, evidence-heavy cards slow reading and hide the story. On its own this story already delivers value, once every affected card has a defensible short text and the detail is kept somewhere.

**Independent Test**: Read the visible text of every changed card with the disclosure closed. Each one must be true on its own and claim no stronger link to the house than the evidence allows.

**Acceptance Scenarios**:

1. **Given** the 1929 gearbox event (Uhereczky's patent filing), **When** the card is read closed, **Then** it says the filing was an application, not a granted patent or a finished device, and that the applicant's identity with the 1924 D18 Uhereczky is likely but not proven.
2. **Given** the 1937 Wágner Ferenc III/3 event, **When** the card is read closed, **Then** it says the record documents the III/3 address for 1937, not for earlier or later years.
3. **Given** a card about a garage, workshop or crime that happened elsewhere, **When** the card is read closed, **Then** it says the action did not take place at Dembinszky 18.
4. **Given** a card about an accusation, police case, first-instance or non-final judgment, **When** the card is read closed, **Then** it does not present the person as proven guilty.
5. **Given** a short, clear card such as a period advertisement whose address, date and evidential weight are already plain, **When** the visitor reads it, **Then** its text is unchanged and it has no disclosure.

---

### User Story 2 - Open the research detail on demand (Priority: P1)

A curious reader or researcher wants to know why a claim is only likely, or which sources disagree. On the cards that have such material, they open „Forráskritika és pontosítások” and read 1–3 short paragraphs, or a longer structured text, covering conflicting readings, identification arguments, the limits of each document type, court-case stages and negative results. The card's source links stay where they always were. They can open several cards at once, by mouse, touch or keyboard, and the page doesn't jump.

**Why this priority**: Without the disclosure, the shortening in Story 1 would lose research. The two stories ship together, but the disclosure can be tested on its own by adding notes to a single card.

**Independent Test**: Give one card notes and check its closed state, open/close by mouse, Enter, Space and touch, opening a second card, the scroll position, screen-reader name and state, and that the source links are reachable while it is closed.

**Acceptance Scenarios**:

1. **Given** a card with notes, **When** the page loads, **Then** the disclosure is closed and shows the label „Forráskritika és pontosítások” with a small downward chevron.
2. **Given** a closed disclosure, **When** the visitor clicks or taps it, or focuses it and presses Enter or Space, **Then** it opens, the chevron turns, and the viewport doesn't scroll to a different place.
3. **Given** one card is open, **When** the visitor opens a second card, **Then** both stay open, and no other card opens or closes.
4. **Given** a card without notes, **When** it is rendered, **Then** no disclosure control, empty heading or placeholder appears.
5. **Given** a card with notes, **When** the disclosure is closed, **Then** the card's source links are visible and usable without opening it.
6. **Given** a screen-reader user, **When** they reach the control, **Then** it is announced with its name and its expanded or collapsed state.
7. **Given** JavaScript is disabled, **When** the visitor uses the disclosure, **Then** it still opens and closes.

---

### User Story 3 - Nothing else about the timeline changes (Priority: P2)

A returning visitor uses the scope slider (Ház / Környék / Magyarország / Világ), the certainty badges, the "A ház · Személy" labels, images and lightbox, music cards, links to specific events and the other pages exactly as before. The owner can confirm this against a snapshot taken before the refactor.

**Why this priority**: The brief makes preservation a hard requirement. It is a guard on Stories 1–2, not new value.

**Independent Test**: Take a snapshot of every event's identity and metadata before the change, rebuild afterwards, and compare them.

**Acceptance Scenarios**:

1. **Given** the pre-refactor snapshot, **When** the refactored site is built, **Then** the event count per era and at each of the four slider positions is identical.
2. **Given** the snapshot, **When** it is compared after the refactor, **Then** each event has the same identifier and anchor, date, title, scope, certainty, image path, caption, credit, licence and ordered set of source URLs. The only exceptions are corrections itemised in the report.
3. **Given** an open disclosure, **When** the visitor moves the slider and the event stays visible, **Then** the disclosure stays open. If the existing rendering makes that disproportionately hard, it may close, but the page must not jump, and the behaviour is documented.
4. **Given** the visitor prints the page, **When** the print preview is shown, **Then** the source-criticism text of every card is included.

---

### Edge Cases

- **A shortened opening would change the event's anchor.** Event links must keep working. The rewrite must not change any event's permanent identifier or anchor.
- **The story can't be told truthfully without the limit.** The limit stays visible in a short form, and the full reasoning goes in the disclosure. The visible caution is not repeated word for word inside.
- **A card is long because it tells several stories, not because of evidence.** Long story content is not moved into the disclosure, and events are not split in this feature. The card may stay long, and this is noted in the report.
- **A card that falls between the two kinds.** Accuracy and keeping the data take priority over shortness. The card may stay longer, and this is noted in the report.
- **Conflicting date readings** (e.g. Rintche Márton, where the volume index and the printed issue header differ). The visible date must not claim certainty the sources lack. Any change to a date label is a documented correction, not a silent edit.
- **Factual or certainty inconsistencies found during the review.** Wording that calls someone a "lakó" when only a business or mailing address is known, or a badge that overstates the evidence, is fixed or flagged and listed in the report. Such wording is never repeated in new text.
- **Music cards.** These change only if one really contains a separable source-criticism passage, and only without disturbing the music card's existing look. Otherwise they are untouched.
- **An image caption depends on wording removed from the description.** The caption must still mean the right thing when read next to the shortened description. Captions themselves are not changed.

## Requirements *(mandatory)*

### Functional Requirements

**Content model**

- **FR-001**: An event MUST be able to carry an optional source-criticism text of zero or more paragraphs, stored with the event's other content in the existing content files and delivered with the page, not loaded later.
- **FR-002**: Source-criticism paragraphs MUST support the same inline link and emphasis formatting that event descriptions already allow, and nothing that the site cannot render safely.
- **FR-003**: Source links, certainty, images, captions and attributions MUST stay in their existing separate fields. None of them may move into the source-criticism text.

**Editorial rewrite**

- **FR-004**: Every timeline event MUST be reviewed, not only the examples in the brief. Each event either gets a rewritten visible description plus source criticism, or is deliberately left unchanged.
- **FR-005**: A rewritten visible description MUST answer who, what, when, why it is interesting and how it relates to Dembinszky 18. It should usually be 2–4 sentences, about 40–90 Hungarian words. This is a guideline, not a hard cut.
- **FR-006**: The visible description MUST keep, in short form, any limit without which the main claim would mislead. These limits are:
  - only an address link is proven, not residence;
  - the person's identity is inferred;
  - the action happened elsewhere;
  - the document records a plan, proposal or filing, not completion, approval or a grant;
  - the case is an accusation, police matter, or a first-instance or non-final judgment;
  - the date or relationship is too uncertain to state plainly.
- **FR-007**: The source-criticism text MUST hold the detailed evidence:
  - conflicting dates, names and readings;
  - identification arguments, including what is missing;
  - the limits of each document type;
  - the viewpoint of press, advertising and official notices;
  - court-case stages;
  - illegible or missing details;
  - research chronology;
  - negative results.

  It MUST NOT be used to hide an interesting historical fact simply because the card is long.
- **FR-008**: For every changed event, a claim-by-claim reconciliation with the original text MUST show that nothing is lost and nothing is strengthened. Each removed detail is either in the source criticism or deliberately redundant because it appears unchanged elsewhere. Source-critical limits MUST never be deleted, even when they look repetitive.
- **FR-009**: The rewrite MUST be editorial, one record at a time. Any bulk helper used must be followed by an itemised check of every record it changed.
- **FR-010**: Events whose text is already short and clear MUST stay unchanged and get no disclosure.
- **FR-011**: The following events MUST be reviewed specifically, starting from their latest repository text:
  - **Uhereczky thread:**
    - 1924 mechanical contractor and shoemaker;
    - 1924 Paris tandem;
    - 1929 small car;
    - 1929 electric gearbox;
    - 1930–1949 garage.
  - **Róthmüller:** 1932–1938 Róthmüller at the fairs, and 1940–1944 the Róthmüller brothers.
  - **Wágner and Földes:** 1937 Wágner III/3, and Földes Szeréna's three days.
  - **Court cases:** the 1919 Kiss János and Nagy György prosecution catalogue entries, and the 1930 Hernád utca demonstration.
  - **Advertisements and addresses:** 1928 Rintche Márton, the car businesses in the house, Strandfürdő Rt. and Kálix Ödön's address.
  - **Other:**
    - 1939 three young researchers;
    - the letter to a rabbi's widow;
    - Márkus József's scientific works.

**Card UI**

- **FR-012**: A card with source criticism MUST show it in a disclosure labelled exactly „Forráskritika és pontosítások”. The disclosure MUST be closed by default, sit after the description and image and before the source links (or directly under the description if that fits the card better), and never hide the source links.
- **FR-013**: A card without source criticism MUST render no disclosure, heading or placeholder.
- **FR-014**: The control MUST work by mouse, touch and keyboard (Tab to focus, Enter and Space to toggle), expose its name and expanded state to assistive technology, and work with JavaScript disabled.
- **FR-015**: Each card's disclosure MUST open and close on its own, and several MUST be able to stay open at once.
- **FR-016**: Opening or closing MUST NOT move the scroll position beyond the card growing or shrinking.
- **FR-017**: The control MUST use the site's existing typography, colours, spacing and radii, with a small chevron that turns when open. It MUST NOT look like a warning or error. On mobile it MUST be full-width within the card, meet the 44 px touch-target minimum, not overflow the card and not be covered by the slider.
- **FR-018**: Any open/close animation MUST respect the reduced-motion preference, and no new package may be added for it.
- **FR-019**: When the page is printed, all source-criticism text MUST be included.
- **FR-020**: An open disclosure SHOULD stay open when the scope slider changes and its event stays visible. If it closes instead, the page MUST NOT jump, and the behaviour MUST be documented.

**Preservation and verification**

- **FR-021**: Before any content changes, a snapshot MUST be recorded of every event's:
  - identifier;
  - date;
  - title;
  - scope;
  - certainty;
  - image path;
  - caption;
  - source URLs;
  - event counts per era and per slider position.

  This snapshot is used for regression checks.
- **FR-022**: The following MUST NOT change, except for itemised, justified corrections:
  - event count, order and era placement;
  - slider logic and its default;
  - certainty labels;
  - "A ház · Személy" labels;
  - dates, titles, identifiers and anchors;
  - images, crops, captions, credits and licences;
  - source links and their order;
  - the other pages (Épület, Építők, Lakók, Névadó);
  - SEO metadata, the main responsive layout and link-sharing structure.
- **FR-023**: Automated tests MUST cover:
  - the snapshot comparison;
  - that there is no disclosure without notes;
  - the closed initial state;
  - keyboard operation;
  - several disclosures open at once.

  The tests use the project's existing test tooling.
- **FR-024**: At the end, the implementer MUST deliver a short report with:
  - the files changed and the content model added;
  - how many cards received source criticism, how many were left untouched and how many descriptions were rewritten;
  - 3–5 before/after examples;
  - the inconsistencies found, and whether each was fixed or flagged;
  - the tests run, their results, and anything left unchecked.

### Key Entities

- **Timeline event**: an existing dated entry with a title, scope, optional "A ház · Személy" label, certainty, description, optional image (with caption, credit and licence) and source links. It gains one optional attribute, the source-criticism paragraphs.
- **Source-criticism note**: an ordered list of short paragraphs with inline links and emphasis, attached to one event. It has no identity of its own and is absent rather than empty.
- **Pre-refactor snapshot**: a record of every event's identity and metadata, plus counts per era and per slider position. It is the baseline for regression checks.
- **Refactor report**: the owner-facing summary required by FR-024.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Event counts per era and at each of the four slider positions match the snapshot exactly (0 differences).
- **SC-002**: 100% of events match the snapshot on identifier, date, title, scope, certainty, image path, caption and source-URL set. The only exceptions are corrections listed in the report.
- **SC-003**: On every card that gets source criticism, the visible description is shorter than before. At least 80% of these are within 2–4 sentences or 90 words; the rest are listed in the report with a reason.
- **SC-004**: All the brief's mandatory review examples (FR-011) are handled: each is either rewritten with the visible limit stated in the brief's table, or left unchanged with a reason in the report.
- **SC-005**: 0 cards without notes show a disclosure, and 0 disclosures start open.
- **SC-006**: A keyboard-only user can open and close any disclosure. A screen reader announces its name and state.
- **SC-007**: No horizontal scroll, and no overflowing or broken cards, at 320, 768 and 1280 px.
- **SC-008**: The home page still meets every performance, accessibility, best-practice and SEO threshold of the site's quality gates. HTML validation and link checks pass.
- **SC-009**: The claim-by-claim reconciliation for each changed event finds no lost or strengthened claim.

## Assumptions

- **No questions for the owner.** The brief tells the implementer not to ask for editorial decisions on clearly separable passages. Borderline cases favour accuracy and keeping the data, and they are recorded in the report rather than asked about.
- **Latest repository text.** The brief's sample texts and titles show the editorial direction only. The current timeline content in the repository, as updated on 2026-10-11, is the authority, including the later facts about Wágner Ferenc's earlier convictions.
- **The site's own disclosure pattern.** The site already uses native disclosure elements for the Lakók name lists and the music-card sources. The new control follows that pattern, so it works without JavaScript and needs no new dependency.
- **Print.** The site already has print styles for the timeline. They are extended so that source criticism appears in print.
- **No splitting.** Splitting events is out of scope. So are a redesign, a new menu, new filters and any restructuring of the timeline.
- **Corrections.** A factual or certainty correction found during the review is made only when the evidence is clear. It is always listed in the report as a deliberate exception to the snapshot.
- **Branch and commits.** Work happens on `master`, like the previous feature. Nothing is committed until the owner asks.
