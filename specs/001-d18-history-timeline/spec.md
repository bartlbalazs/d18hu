# Feature Specification: Dembinszky utca 18. History Timeline

**Feature Branch**: `001-d18-history-timeline`

**Created**: 2026-09-28

**Status**: Draft

**Input**: User description: "i have my specs written inside the /home/bartlbalazs/git/d18/user_spec folder. i also have a mock up there. that is what i want to implement"

**Source documents** (authoritative detail; this spec summarizes and makes them testable):

- `user_spec/initial_spec.md` — product, content and design decisions (Hungarian).
- `user_spec/mockup.png` — visual mockup (shows 17 sample events; the live site shows all).
- `input/timeline.md` — research timeline; its event content takes precedence over this spec.
- `assets/facade.png` — present-day facade photo for the opening section.

## Clarifications

### Session 2026-09-28

- Q: Two self-hosted font families conflict with constitution Principle IV (max one). → A:
  Amend the constitution to allow two families, subset to the characters needed for Hungarian
  (constitution v1.1.0).
- Q: Where is the facade photo? → A: `assets/facade.png`.
- Q: Fix the 6-cell separator rows in the four era tables of `input/timeline.md`? → A: Yes;
  fixed to 7 cells (no row content changed).
- Q: Where do event titles come from, and are descriptions shown verbatim? → A: Descriptions
  are shown verbatim from the timeline file (inline emphasis kept); titles are drafted once by
  AI into a separate editorial file keyed by event id and reviewed/edited there by the owner.
- Q: How does each event get a permanent id? → A: Derived deterministically from the event's
  content (date label + opening words of the description, e.g. `1903-12-27-maulner-...`), so
  adding/reordering rows changes nothing; if editorial entries no longer match any event, the
  build stops and lists them for re-linking.
- Q: Are downloaded archive images committed or fetched on every build? → A: Downloaded once
  and committed to the repository; fetched only when a new or changed `Kép URL` appears, so
  regular builds run offline. A separate check can verify the original URLs.
- Q: Does the build still produce a site when editorial data is missing? → A: Two modes: a
  preview build always completes, lists missing items and marks pages as a draft (not
  indexable); a release build refuses to complete while anything required is missing.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read the full history of the house (Priority: P1)

A visitor (resident, prospective buyer, local-history enthusiast) opens the site and scrolls
through a single vertical, narrative timeline of Dembinszky utca 18. from 1873 to 1968. They
see an opening section with the house's name, a short subtitle, a present-day facade photo
and the 1873–1968 span, then four full-screen era openers, each followed by that era's events
in original source order. Each event shows its date exactly as written, its type (house, area,
Hungary, world), a title, a description with all original caveats, a certainty mark when one
exists, and public external source links.

**Why this priority**: This is the product. Without it there is no site.

**Independent Test**: Load the home page on desktop and mobile; count 108 events distributed
across four eras in source order; compare several events word-for-word against
`input/timeline.md`.

**Acceptance Scenarios**:

1. **Given** the timeline source with 108 event rows, **When** the site is built, **Then** all
   108 events appear, each in its correct era and in the same order as the source.
2. **Given** an event whose lane is `D18 • személy`, **When** it is displayed, **Then** it shows
   the "A ház" category plus a visible "Személy" sub-label.
3. **Given** an event with date label "1945. jan. 15. vagy 17.", **When** it is displayed,
   **Then** the label is shown exactly as written, not normalized to a single exact date.
4. **Given** an event with certainty `—`, **When** it is displayed, **Then** no certainty icon,
   label or empty placeholder appears.
5. **Given** a `Környék` event with a certainty value, **When** it is displayed, **Then** the
   certainty mark is shown (certainty is not limited to house events).
6. **Given** JavaScript is disabled, **When** the page loads, **Then** all content is readable.

---

### User Story 2 - Jump between eras on any device (Priority: P1)

A visitor wants to go directly to a specific period (e.g., 1939–1945) without scrolling the
whole page, on desktop or phone, with mouse, touch or keyboard.

**Why this priority**: The page is long (108 events); era navigation is essential usability
and an explicit acceptance criterion.

**Independent Test**: From the top of the page, reach each of the four eras via the header
navigation on a 320 px wide screen and on desktop, using keyboard only and with JavaScript off.

**Acceptance Scenarios**:

1. **Given** the page on a desktop screen, **When** the visitor activates any of the four era
   links in the header, **Then** the page scrolls to that era's opener.
2. **Given** a phone-width screen, **When** the visitor opens the collapsible menu, **Then** all
   four era links plus "Írások" and "Impresszum" are available; none are hidden.
3. **Given** keyboard-only use with JavaScript disabled, **When** the visitor tabs through the
   navigation, **Then** every link is reachable, visibly focused and working.
4. **Given** the visitor scrolls down, **When** the header leaves the viewport, **Then** it
   scrolls away with the page (it never sticks or overlays the timeline).
5. **Given** an era opener, **When** the visitor activates its "Tovább az eseményekhez" link,
   **Then** the view moves to that era's first event.

---

### User Story 3 - View and enlarge historical images (Priority: P2)

A visitor reading an event that has an image sees a responsive preview inside the event, with
an always-visible caption and a separate text link to the archive source. They activate the
image to open a large, zoomable, screen-fitted view, close it (button, Escape, or gesture),
and return to the same event.

**Why this priority**: Images are the main visual evidence, but the timeline is valuable even
without them.

**Independent Test**: For each event with a filled `Kép URL`, verify the preview, caption,
source link and enlarged view; verify the full image opens as a plain link with JavaScript off;
verify events with `—` have no image box.

**Acceptance Scenarios**:

1. **Given** an event with a filled `Kép URL`, **When** the page loads, **Then** a preview served
   from the site's own storage appears after the event text, with a visible caption beneath it.
2. **Given** the visitor activates the preview, **When** the enlarged view opens, **Then** it fits
   the screen, supports pinch/zoom on touch devices, closes via a clear button or Escape, shows
   no "previous/next" controls for a single image, and returns focus to the same event.
3. **Given** JavaScript is disabled, **When** the visitor activates the preview, **Then** the
   full-size locally served image opens directly.
4. **Given** a document scan (advertisement, list), **When** it is previewed, **Then** the whole
   page is visible, uncropped, so dates, names and house numbers remain legible.
5. **Given** an image that does not prove it depicts no. 18 (e.g., Fortepan #82508), **When** it
   is displayed, **Then** its caption states what it shows and that it is not proven to be the
   house.

---

### User Story 4 - Understand event types and certainty (Priority: P2)

A visitor wants to know what the icons mean: event type (large icon on the timeline axis) and
claim certainty (small icon with word in the metadata row), and that certainty refers to the
specific claim, not every detail.

**Why this priority**: The research's credibility depends on readers understanding certainty
levels correctly.

**Independent Test**: Read the legend without hovering; verify each of the four categories and
three certainty levels is explained in text.

**Acceptance Scenarios**:

1. **Given** the page, **When** the visitor reaches the legend, **Then** it explains the four
   categories (A ház, Környék, Magyarország, Világ) and three certainty levels (Igazolt,
   Valószínű, Feltételezés) in visible text that doesn't require hovering.
2. **Given** any event, **When** it is displayed, **Then** its type and certainty are also shown
   as readable words, not only as icon or colour.
3. **Given** the "Magyarország" category, **When** its icon is shown, **Then** it is a monochrome
   flag outline, not a country map or coat of arms.

---

### User Story 5 - Reach Writings and Legal Notice pages (Priority: P3)

A visitor uses the header "Írások" link to see an index of published articles, and the
"Impresszum" link (header and footer) to see legal, authorship and contact information.

**Why this priority**: Required navigation targets with no dead links, but minimal content at
first launch.

**Independent Test**: Follow both links from the header and the Impresszum link from the
footer; each reaches a distinct, working page.

**Acceptance Scenarios**:

1. **Given** no articles are published yet, **When** the visitor opens "Írások", **Then** they
   see an index page stating that no articles have been published yet; no links point to
   non-existent article pages.
2. **Given** the footer, **When** the visitor activates "Impresszum", **Then** the legal notice
   page opens.
3. **Given** the site's `Cikkötlet` (article idea) values, **When** the site is built, **Then** no
   article pages or links are generated from them.

---

### User Story 6 - Find and share the site via search and social media (Priority: P3)

Someone searches for "Dembinszky utca 18" or shares the page on social media; search engines
and link previews show an accurate title, description and image and understand that the page
describes a specific building, its location and its historical events.

**Why this priority**: Required by the project constitution; increases reach, but is secondary
to content.

**Independent Test**: Run structured-data and social-preview validators on each page; all
required metadata is present and valid.

**Acceptance Scenarios**:

1. **Given** any page, **When** it is inspected, **Then** it has a unique title and description,
   canonical link, language declaration, social preview tags and valid structured data
   describing the website, breadcrumbs and (on the timeline page) the building and its events.
2. **Given** the site, **When** crawled, **Then** a sitemap and robots file are present and list
   every public page.

---

### Edge Cases

- **Malformed source tables**: if a future edit of `input/timeline.md` breaks a table (e.g., a
  separator row with fewer cells than the header, as originally in all four era tables), or
  a row has the wrong number of cells, the conversion MUST fail loudly with the era and row.
  It MUST NOT silently drop rows or shift columns.
- **Orphaned editorial data**: if a timeline row's date label or opening words are edited, its
  id changes; any editorial entry (title, caption, credit) whose id no longer matches an event
  MUST stop the build with a list of the orphaned ids, so nothing detaches silently.
- **Non-event section**: "Amit egyelőre nem viszünk fel házeseményként" is a table but is
  not an era and MUST NOT appear as events.
- **Approximate and multi-valued dates**: labels like "1901 körül", "1904. júl. 1. / júl. 10.",
  "1944. dec. 24. – 1945. febr. 13.", "1945 után, pontos év nélkül" are displayed verbatim and
  never shown as invented exact dates. Order is the source order, not a computed sort.
- **Proportional spacing**: the axis MUST NOT imply real-time proportional gaps between events.
- **`—` values**: in source, certainty, image or article-idea fields they produce no visible
  element (no empty "Forrás" button, broken image or empty certainty mark).
- **Unreachable or invalid new image URL** (HTTP error, HTML error page instead of image,
  unreadable dimensions): the download step fails with a clear error naming the event and the URL; the site never
  shows a broken image or silently hotlinks the remote file.
- **Duplicate image URLs** are downloaded once; rebuilding with unchanged content creates no
  duplicate files.
- **Archive offline**: regular builds use the committed images and succeed. Only adding a new or
  changed `Kép URL` requires the archive to be reachable.
- **Removed `Kép URL`**: the no-longer-referenced stored image is reported, so it can be deleted.
- **Missing image caption, alt text or credit**: listed as a missing editorial item (see
  FR-039). The site does not invent what an image depicts from its file name.
- **Internal research PDFs / research-block references** in source text: MUST NOT appear on the
  public site as names, paths or links.
- **Narrow screens (320–360 px), enlarged text, long Hungarian date labels**: no clipped text,
  no horizontal scrolling, no hidden navigation.
- **Reduced motion preference**: no content is lost; motion is minimal anyway.
- **Missing Impresszum data**: the page exists in preview builds with a visible draft notice;
  a release build fails. Invented names or e-mail addresses are never used as filler.

## Requirements *(mandatory)*

### Functional Requirements

**Page structure & navigation**

- **FR-001**: The home page MUST present, in order: header, opening section, and four era
  openers each followed by that era's events, plus a legend and a footer.
- **FR-002**: The header MUST contain the house name / home link ("D18"), links to the four
  eras, "Írások" and "Impresszum", and MUST scroll with the page (never fixed or sticky).
- **FR-003**: On narrow screens the navigation MAY collapse, but MUST keep all links reachable
  by touch and keyboard and MUST work without JavaScript. No link may be hidden only by
  styling.
- **FR-004**: Each era MUST have a stable anchor so that it can be linked to directly.
- **FR-005**: The footer MUST link to "Impresszum".
- **FR-005a**: Each event MUST have a permanent, human-readable id derived only from its own
  content (date label + opening words of its description), used both as its page anchor and
  as the key for its editorial metadata. Inserting, removing or reordering other rows MUST NOT
  change any existing id. Two events producing the same id MUST stop the build.

**Opening section**

- **FR-006**: The opening section MUST show the title "Dembinszky utca 18.", a short subtitle,
  the present-day facade photo captioned as a present-day photo (never implying c. 1901), and
  the 1873–1968 span.
- **FR-007**: On desktop the opening section MUST use two columns (text left, vertical photo
  crop right); on small screens a single column short enough that the first era is reachable
  without excessive scrolling. The original photo MUST be openable separately.

**Era openers**

- **FR-008**: Exactly four era openers MUST exist, each at least one screen tall (growing if
  content requires), showing chapter number, year range, title, a one-to-two-sentence
  introduction and a "Tovább az eseményekhez" link:
  - 01 · 1873–1913 · A város és a ház megszületése
  - 02 · 1914–1938 · Háború, forradalmak és két világháború közötti hétköznapok
  - 03 · 1939–1945 · Világháború, üldözés és Budapest ostroma
  - 04 · 1946–1968 · Újjáépítés, államszocializmus, forradalom és fényképek
- **FR-009**: Each era opener MUST use its own muted background tone (as in the source
  document's colour list); the third era MUST be a dark, restrained surface with light text and
  no dramatic effects. Decorative large year numerals or facade details MUST stay behind the
  text.

**Events**

- **FR-010**: The site MUST display all events from `input/timeline.md` (currently 108), each
  in its era and in original source order.
- **FR-011**: Source lanes MUST map to four public categories: `D18` and `D18 • személy` →
  "A ház" (the latter with an extra "Személy" label); `Környék` → "Környék"; `Magyarország` →
  "Magyarország"; `Világ` → "Világ". Each category MUST show both an icon on the timeline axis
  and a readable category name.
- **FR-012**: House events MUST have the strongest visual emphasis (subtle sand-toned
  background). Hungary and World events are visually quieter but still clearly readable.
- **FR-013**: Certainty values MUST be shown as a small icon plus the word ("Igazolt",
  "Valószínű", "Feltételezés") in the event's metadata row. `—` shows nothing. Certainty
  applies to events of any lane.
- **FR-014**: Each event MUST show the date label verbatim, a title, and the description
  exactly as written in the "Esemény és jelentőség" column (inline bold/italic preserved; no
  rewording), so every claim and caveat (e.g., "valószínű", "nem bizonyított", "vagy") stays
  intact. Titles come from the editorial metadata (not the research file). An event without an
  editorial title is a missing editorial item (see FR-039).
- **FR-015**: Events MUST support three display variants: compact text event; image event
  (image after text, with caption and image source); document highlight (a restrained,
  print-like quotation or transcription block, used only for verified excerpts).
- **FR-016**: External source links from the `Külső forrás` column MUST be shown as text links
  naming the source; `—` produces no link. External links that open in a new window MUST be
  protected against tab hijacking.
- **FR-017**: The published site MUST NOT contain internal research PDF names, paths or links.
- **FR-018**: Content restrictions from the source spec MUST be honoured: no Hübner–Kalix
  attribution event; Mellinger shown as "probable", not "verified"; the Spitz–Mellinger kinship
  shown only as a hypothesis; no "protected house / Miletits / 300 people" house event;
  nearby bomb damage not presented as a hit on no. 18; the 1963 photo not dated to a specific
  day or labelled as May Day.
- **FR-019**: `Cikkötlet` values MUST be kept as editorial metadata only and never generate
  public pages or links.

**Images**

- **FR-020**: Every filled `Kép URL` MUST be downloaded at build time into the site's own
  assets. The site MUST serve both preview and full-size versions locally, and MUST keep the
  original URL in the processed data for auditing. The source Markdown MUST remain unchanged.
- **FR-021**: Image downloads MUST verify a successful response, real image content and
  dimensions. Failures MUST stop the build with the event identifier and URL.
- **FR-022**: Downloaded file names MUST be deterministic and collision-free. The same URL is
  downloaded only once, and unchanged rebuilds create no duplicates. Downloaded originals MUST
  be stored in the repository; they are fetched only for new or changed `Kép URL` values, so
  a regular build needs no network access. A separate, on-demand check MUST verify that the
  original image URLs are still reachable, and report any that are not, without breaking
  regular builds.
- **FR-023**: Each image MUST have meaningful alt text, known width/height, and a visible
  caption under the preview stating what it shows and, where relevant, what it supports or
  does not prove. Credit and licence data MUST come from separate editorial metadata tied to
  the event, not from the file name. Missing caption, alt or credit data is a missing
  editorial item (see FR-039).
- **FR-024**: Image previews MUST link to the locally served full-size image (works without
  JavaScript); with JavaScript, activation opens an accessible, zoomable, screen-fitted viewer
  (close button, Escape, touch zoom, no prev/next for a single image, focus returns to the
  event). The caption MUST remain readable outside the viewer.
- **FR-025**: Document images MUST be shown uncropped; photos may fill the content column.
- **FR-026**: The first on-screen photo MAY load immediately; images further down MUST load
  lazily, and full resolution MUST load only when opened.
- **FR-027**: No generated or substitute "period" images may replace missing historical images.

**Legend, other pages, metadata**

- **FR-028**: A short, visible legend MUST explain the four categories and three certainty
  levels, including that certainty applies to the specific claim (e.g., a verified memoir may
  still have an uncertain exact day). Tooltips MAY supplement but not replace it.
- **FR-029**: `/irasok/` MUST list only actually published articles and show an explicit empty
  state when there are none.
- **FR-030**: `/impresszum/` MUST exist and be reachable from header and footer; it MUST contain
  only real operator/author/contact data supplied by the owner.
- **FR-031**: Every page MUST carry the metadata required by the constitution (Principle V),
  including structured data for the building (address, location) and its historical events,
  plus sitemap and robots files.

**Visual design & accessibility**

- **FR-032**: The visual style MUST follow a restrained local-history publication aesthetic,
  inspired by the facade and 19th–20th-century Budapest print. It MUST NOT use neon colours,
  app-like rounded card floods, heavy antique-paper textures, animated parallax, fake
  historical props, or persecution-related symbols as decoration.
- **FR-033**: The palette MUST use the muted design colours listed in the source spec (paper
  `#F5F1E8`, alt `#EEE6D9`, deep `#E7DDCC`, rule `#D2C3B1`, sand `#A88968`, walnut `#594535`,
  ink `#292521`, muted `#675D53`, slate `#5B6260`) and era-opener tones (`#EEE6D9`, `#E5DBC9`,
  `#443B33`, `#D7D4C9`). All text/background pairs MUST meet WCAG AA contrast (values may be
  adjusted to comply).
- **FR-034**: Typography MUST pair a serif display face with full Hungarian accent support
  (Cormorant Garamond or similar) for headings, years and event titles with a readable
  sans-serif (Source Sans 3 or similar) for body, navigation and metadata. No text may be
  smaller than 12 px. Both families are self-hosted, limited to the characters needed for
  Hungarian text (as permitted by constitution v1.1.0, Principle IV).
- **FR-035**: On desktop, event rows MUST use a date column (~145 px), axis column (~38 px) and
  flexible content column within a reading width of about 1060 px. On mobile, the date moves
  above the content, the axis continues on the left, and rows become a single column.
- **FR-036**: The site MUST use semantic page structure (one main heading, logical heading
  hierarchy, lists, machine-readable dates), visible focus indicators, readable labels beside
  every icon (decorative icons hidden from assistive technology), and must be fully keyboard
  operable, including the image viewer.
- **FR-037**: The site MUST be written in Hungarian (`hu`).

**Future-proofing**

- **FR-038**: Event data MUST be structured separately from presentation (category, era,
  certainty as fields) so that category/era filtering can be added later without rewriting
  content. No filter or search UI is shown in this release.

**Build modes**

- **FR-039**: The build MUST offer two modes:
  - **Preview**: always completes; prints a list of every missing editorial item (event
    titles, image alt/caption/credit/licence, facade photo credit, Impresszum data), shows a
    visible "draft" notice on every page, and marks all pages as not to be indexed by search
    engines.
  - **Release**: refuses to complete while any missing editorial item exists, listing them.
    Its output has no draft notice and is fully indexable.
  Structural errors (malformed tables, duplicate or orphaned ids, failed image downloads) stop
  both modes.

### Key Entities

- **Era**: one of four fixed chapters (id = year range, number, title, intro text, opener
  tone). Holds an ordered list of events.
- **Timeline Event**: permanent content-derived id (anchor and editorial key, see FR-005a), era, source index (original position), verbatim date
  label, optional sort start/end (only when derivable, never invented), source lane, public
  category, person sub-label flag, title, description, certainty (verified / probable /
  hypothesis / none), source links (label + URL), optional image, optional article idea
  (editorial only), display variant (compact / image / document highlight). Keeps the raw
  source row until the conversion is verified.
- **Event Image (Media)**: local preview and full-size paths, original remote URL, alt text,
  caption, archive source URL, attribution/credit, licence, width, height, "depicts the house"
  flag. At most one primary image per event in this release.
- **Editorial Metadata**: owner-reviewed event titles, captions, alt text, credits, licences
  and verified document excerpts keyed by event id. It is kept separate from the research
  source, which is never modified by the build.
- **Page**: home/timeline, Írások (article index), Impresszum. Each has title, description,
  canonical URL and structured data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the source timeline's events (currently 108) appear in the correct era
  and order. The certainty counts shown (17 Igazolt, 29 Valószínű, 1 Feltételezés, 61 unmarked)
  and category counts match the source exactly.
- **SC-002**: A visitor can reach any of the four eras from the top of the page in at most two
  interactions, on a 320 px phone and on desktop, with keyboard only and without JavaScript.
- **SC-003**: 0 broken images, 0 empty image boxes, 0 empty source buttons, 0 empty certainty
  marks, and 0 links to internal research PDFs or non-existent pages in the published site.
- **SC-004**: 100% of displayed images have visible captions, meaningful alt text and credit,
  and 100% of image files are served from the site itself.
- **SC-005**: Every page meets the constitution's mobile performance and quality budgets
  (initial content visible within 2 seconds on a mid-range phone over 4G; top performance,
  accessibility and SEO audit scores).
- **SC-006**: No text is clipped and no horizontal scrolling occurs at 320, 360, 768 and
  1280 px widths or at 200% text zoom.
- **SC-007**: A reader shown the legend can correctly state what "Valószínű" means and that
  certainty applies to a specific claim (reviewer walkthrough with at least 3 test readers).
- **SC-008**: All pages pass structured-data and social-preview validation without errors.
- **SC-009**: At least one captioned image event and one document highlight are present.
- **SC-010**: With any single editorial item removed, a release build fails and names that
  item; a preview build of the same content completes and every page shows the draft notice
  and is marked not indexable.

## Assumptions

- `input/timeline.md` is the current version of the research file referred to as
  `D18_timeline_1873-1968(2).md` in the source spec. Its event content prevails over this spec
  and over sample texts in the mockup.
- The mockup is the visual reference for layout, tone and proportions. Its 17 sample events and
  headings like "Válogatott események" ("selected events") do not limit scope: all events are
  shown, and wording follows the source.
- Mockup per-era sub-headings (e.g., "A ház előtti várostól a lakókig", "Nevek egy házszám
  mögött", "A csillagos ház és a pince", "A fényképen felbukkanó ház") are used as the
  heading above each era's event list.
- Event titles are drafted once by AI from the "Esemény és jelentőség" text into the editorial
  metadata. They are not regenerated on each build and must be reviewed by the owner before
  publication.
- The first document highlight is the 1903 Maulner advertisement address transcription
  ("Budapest, VII., Dembinszky-utca 18."), as in the mockup, shown as a clearly labelled
  transcription until a lawfully usable scan is available.
- The present-day facade photo (hero image) is `assets/facade.png` (784 × 1476 px). Its
  publication rights and credit must still be confirmed by the owner before release.
- **Dependency**: captions, alt texts and credits for the five filled Fortepan images (#82508,
  #157067, #18543, #148696, #97493) must be supplied or verified against the archive record.
  The #82508 credit is already known: Fortepan / Budapest Főváros Levéltára, Klösz György,
  HU.BFL.XV.19.d.1.07.184.
- The real Impresszum data and publication rights/credits for all images block only a release
  build (FR-039); preview builds work without them. Rights clearance itself is the owner's
  responsibility; the site records credit and licence as supplied.
- Final domain/route and hosting are undecided (the site may become part of
  `dembinszky18.hu`); canonical URLs use a configurable base address.
- The source spec's technology suggestions (static site generator, lightbox component, icon
  set, HTML/CSS reference layouts) are preferences to evaluate in `/speckit-plan` against the
  constitution. They are not requirements of this spec.
- Hungarian only for this release; no multilingual support.
- Out of scope: filtering/search UI, article pages, resident submissions, events after 1968.
