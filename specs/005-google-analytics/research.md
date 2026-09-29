# Research: Visitor statistics with Google Analytics

## R1. Reconciling with the constitution (FR-002)

- **Decision**: Amend principle IV through `/speckit-constitution`, version 1.1.0 → 1.2.0 (MINOR, materially expanding guidance). **Done on 2026-09-29.** The analytics bullet now reads:

  > No third-party trackers, ad scripts, social embeds, or external CDNs at runtime, with one exception: a single analytics service MAY be used if it loads, sets cookies or sends data only after the visitor's explicit consent, refusing is as easy as accepting, and it never delays the first view. Without consent the site MUST make no third-party requests. The consent notice and its script count towards the 20 KB JavaScript budget. The service's own script, loaded only after consent, does not, but pages MUST still meet principle II after consent.

- **Rationale**: The owner chose this on 2026-09-29 (spec Clarifications, Q1). The constitution requires amendments to go through `/speckit-constitution` with a Sync Impact Report, so the plan doesn't edit it directly.
- **Alternatives considered**:
  - A cookieless, privacy-friendly service (Plausible, GoatCounter), which fits today's principle IV. The owner asked for Google Analytics.
  - Recording a permanent violation in Complexity Tracking. Rejected: the constitution states that it supersedes plans, so a rule that is knowingly broken on every page belongs in the constitution itself.

## R2. How Google Analytics is loaded (FR-003, FR-011)

- **Decision**: Use Google's gtag.js (GA4), injected by our own script only after consent. This is Consent Mode's **basic** implementation: no Google tag exists on the page until the visitor accepts.
  - After consent, the script:
    1. Creates `dataLayer` and `gtag()`.
    2. Sets the consent defaults: `analytics_storage: granted`, and `ad_storage`, `ad_user_data`, `ad_personalization` all `denied`.
    3. Calls `gtag('js', …)` and `gtag('config', ID, …)` with the options listed in [R6](#r6-minimal-collection-fr-007).
    4. Appends `<script async src="https://www.googletagmanager.com/gtag/js?id=…">`.
  - For a returning visitor who accepted earlier, the injection waits for the `load` event and then `requestIdleCallback` (falling back to `setTimeout`). The tag therefore never competes with the page's own content, LCP or first input.
  - On the click of "Elfogadom", it loads at once.
- **Rationale**:
  - Basic mode is the only mode in which nothing reaches Google before consent. That is a literal requirement (FR-003, SC-002).
  - Deferring until after `load` keeps LCP and CLS unchanged. The tag's parse time is the only after-consent cost, and it is measured (see [quickstart](quickstart.md#5-performance-after-consent)).
- **Alternatives considered**:
  - Consent Mode **advanced**. It loads the tag before consent and sends cookieless pings. Rejected: that is a request to Google before consent.
  - Google Tag Manager. Rejected: an extra container download and a second place to configure things, for no benefit with 3 events.
  - Partytown, which runs the tag in a web worker. Rejected: a new dependency, and the tag is already off the critical path.
  - The Measurement Protocol. Rejected: it needs a server and an API secret, and the site has neither.

## R3. Where the measurement ID lives, and when analytics is on (FR-009, FR-010, FR-012)

- **Decision**:
  - **The ID**: an optional `analytics.measurementId` in `editorial/site.yaml`, validated as `^G-[A-Z0-9]+$` by `siteEditorialSchema`.
  - **When the ID is empty or missing**: the build has no analytics at all. There is no notice, no footer link, no script and no Adatkezelés section. It is not reported as a missing editorial item.
  - **Draft builds**: analytics is off, whatever the ID. This covers `pnpm dev`, which defaults to draft mode.
  - **At runtime**: the script is active only when `location.hostname` equals the hostname of the build's site URL (`resolveSiteUrl()`, which is `www.dembinszky18.hu` unless `SITE_URL` overrides it). That rules out `dembinszky18.web.app`, `astro preview`, the Firebase emulator and forks deployed elsewhere.
- **Rationale**:
  - The ID is public by design, since it appears in every page that loads the tag, so committing it leaks nothing. No secret exists anywhere in this design: gtag.js needs no API key or credential.
  - Keeping the ID in the committed editorial file makes every release build reproducible from the repo. `scripts/publish.sh` already refuses a dirty tree, and a forgotten environment variable would silently ship a site without statistics.
  - The hostname check stops test runs and other copies of the site from polluting the owner's reports.
- **Alternatives considered**:
  - An environment variable in a git-ignored `.env` file. It would work, but it is easy to lose between machines, and there is nothing to hide.
  - Hard-coding the production hostname. Rejected: a deliberate `SITE_URL` build is the only way to exercise the "accepted" path locally ([quickstart §4](quickstart.md#4-accepted-path-locally-without-reaching-google)).

## R4. The consent record (FR-004, key entity "Consent choice")

- **Decision**: `localStorage['d18-statisztika']` holds `"granted"` or `"denied"`. A missing value means the visitor hasn't chosen yet.
  - **Browser privacy signals**: when `navigator.globalPrivacyControl === true` or `navigator.doNotTrack === '1'`, the visitor is treated as having refused. No notice is shown and nothing is stored. The settings panel then explains that the browser's setting keeps statistics off, and offers no "accept" button.
  - **Storage not available**: if `localStorage` throws (blocked storage, some privacy modes), the visitor is also treated as having refused, and no notice is shown. This prevents a notice that comes back on every page (spec edge case "blockers").
  - **Withdrawal**, via "Nem kérem" in the settings panel, happens at once:
    1. Stores `denied`.
    2. Sets `window['ga-disable-<ID>'] = true`, which Google documents as the way to stop gtag sending.
    3. Updates consent to `analytics_storage: denied`.
    4. Deletes the `_ga` and `_ga_<container>` cookies for the host and the parent domain.
  - Nothing more is sent from that page, and the tag isn't loaded again on later pages.
- **Rationale**:
  - `localStorage` isn't sent with requests, and storing the visitor's own choice is strictly necessary, so it needs no consent itself.
  - A single string is enough. The spec asks for no expiry.
- **Alternatives considered**:
  - A first-party consent cookie. Rejected: it would be sent to the host on every request for no reason.
  - Re-asking after 12 months. Rejected for now: the spec doesn't ask for it, and it can be added later without changing the stored format.

## R5. The notice and the settings link (FR-004, FR-005, SC-003)

- **Decision**:
  - **Markup**: `Base.astro` renders the notice as static HTML with the `hidden` attribute, only in builds where analytics is on. It is a `<section class="consent" id="statisztika" aria-labelledby="statisztika-cim">` (see [contract](contracts/statistics.md)) holding:
    - a short Hungarian text,
    - a link to `/impresszum/#adatkezeles`,
    - two `<button>`s of the same class, "Elfogadom" and "Nem kérem".
  - **Placement**: the script un-hides it on a first visit as a fixed panel at the bottom of the viewport. It is not modal, doesn't trap focus and doesn't dim the page, so the visitor can keep reading. Being fixed, it causes no layout shift.
  - **Keyboard and screen readers**: it comes after the footer in the DOM. So a keyboard or screen-reader user meets it after the content, and it can be reached with the region's heading.
  - **Footer**: `SiteFooter` gains a `<button class="footer-link" type="button" data-consent-settings hidden>Statisztika beállításai</button>`. The script un-hides it, and a click re-shows the notice with the current choice stated. A button is used because it performs an action and goes nowhere. That makes it 1 click to open and 1 to choose (SC-003).
  - **Choosing**: after a choice the panel is hidden, and focus moves to the settings button if the panel had focus.
- **Rationale**:
  - Static markup keeps the Hungarian text in Astro, where it can be validated by `html-validate` and checked by the site tests.
  - `hidden` means visitors without JavaScript never see a notice that couldn't work (spec edge case).
  - Equal buttons meet FR-003.
  - 44 px targets and the existing ink/paper tokens meet principle III and the contrast rule.
- **Alternatives considered**:
  - A `<dialog>` opened with `showModal()`. Rejected: modal means blocking, which FR-005 forbids.
  - A top banner. Rejected: it would push the sticky header and content down, which causes CLS.
  - A notice built entirely in JavaScript. Rejected: the text would live outside the templates and the tests.

## R6. Minimal collection (FR-007)

- **In code**, the `gtag('config', …)` options:
  - `allow_google_signals: false`
  - `allow_ad_personalization_signals: false`
  - `cookie_expires: 34128000` (395 days, the 13-month ceiling EU regulators recommend, instead of the default 2 years)
  - `send_page_view: true`
- **In the Google Analytics admin**, done by the owner and listed in the README:
  - Data retention: **2 months** (the minimum).
  - Google signals: **off**.
  - Data sharing settings: all **off**.
  - Granular location and device data collection: **off** for all regions.
  - Enhanced measurement: **off**, so that only page views and our 3 events are collected (FR-008 "nothing else"). Otherwise it would add scroll, outbound-click, file-download (the full-size image links), form and history-change events.
- **IP addresses**: GA4 doesn't log or store IP addresses, and `anonymize_ip` is a no-op in GA4. So FR-007's "shortened IP" is met by the product itself, and the privacy notice says so.
- **Rationale**: these are all the switches that exist. The ones not reachable from the page are made explicit in the README, so FR-007 can be verified.

## R7. The 3 events (FR-008)

- **Decision**: The consent script handles the events itself, with a single delegated `click` listener on `document`. It reports only while consent is granted, and only these three events:

  | Event | Fires on | Parameters |
  |---|---|---|
  | `archive_source_click` | a click on an external `https:` link inside `<main>` | `source_url` (the link's href), `timeline_event` (the `data-event-id` of the enclosing event, or the page path on story pages) |
  | `image_zoom` | a click on `a.evidence__link` while the viewer is enhanced (primary button, no modifier keys) | `image_name` (from `data-stat-image`) |
  | `era_select` | a click on `#fomenu a[href^="/#korszak-"]` | `era` (the era id) |

- **Markup changes**:
  - Every external link inside `<main>` is an archive source: the timeline sources, the figure credits and the inline sources on the story pages. So no source link needs a marker, and new ones are counted automatically.
  - The zoom link gets `data-stat-image`: the archive file name without the build hash or extension, derived at build time from `image.src`.
- **Rationale**:
  - Listening for clicks means `lightbox.ts` and `site-menu.ts` stay unchanged.
  - A click on the zoom link is exactly what opens the viewer.
  - Data attributes make the tracked links explicit and testable in the built HTML.
  - Events pushed before gtag.js finishes loading wait in `dataLayer` and are sent when it arrives.
  - The parameters carry only site content, never visitor input (FR-008).
  - The owner registers the three parameters as event-scoped custom dimensions to see them in reports. Real-time shows them without registration.
- **Alternatives considered**:
  - PhotoSwipe's `beforeOpen` event. Rejected: it couples the two scripts for no gain.
  - Enhanced measurement's outbound clicks. Rejected: they don't say which timeline event a source belongs to, and they'd also count unrelated links.

## R8. Code organisation and budget (principle IV)

- **Decision**:
  - **Pure, unit-tested logic** in `src/lib/statistics/`:
    - `consent.ts`: `resolveConsent(stored, signals)` returns `'granted' | 'denied' | 'ask'`.
    - `events.ts`: `statisticsEventFor(link)` maps a clicked link's href and data attributes to an event, or `null`.
  - **The browser module** `src/scripts/statistics.ts` handles storage, the notice, loading and the listener. It is loaded from `Base.astro` only when analytics is on, and it receives the ID and hostname through `data-` attributes on the notice.
  - **Measured size**: 3,799 bytes minified, 1,774 bytes gzipped. Astro inlines it into each page. The site-wide JavaScript total goes from about 24.0 KB to about 25.8 KB against the 20 KB cap.
  - **gtag.js** (153 KB transferred, measured; third-party, loaded only after consent) falls under the amended principle IV exception. It is not in the initial view for anyone, and not at all for a visitor who hasn't consented.
  - **Measured after consent** (Lighthouse mobile, local build, 2026-09-29): every page scores Performance ≥ 98, and LCP and CLS are unchanged. gtag.js runs as two long tasks of about 55–70 ms after `load`.
    - On the home page, TBT over 9 runs was 12–156 ms (median 87), against 0–71 ms with consent refused. 3 of the 9 runs exceeded the 100 ms cap.
    - The other pages stayed at ≤ 11 ms.
    - This is Google's own script cost and can't be reduced from our side without delaying the tag further. It is an open decision for the owner (T022).
- **Rationale**: this follows the 004 pattern of pure logic in `src/lib/` and browser glue in `src/scripts/`.
- **CSP note**: `firebase.json` sets no Content-Security-Policy today. If one is added later, it must allow `https://www.googletagmanager.com` (script) and `https://*.google-analytics.com` (connect).

## R9. Privacy notice on the Impresszum (FR-006)

- **Decision**: Add a section `<h2 id="adatkezeles">Adatkezelés</h2>` to `src/pages/impresszum/index.astro`, rendered only when analytics is on. Its content:
  - **Controller**: the operator from `site.yaml`.
  - **Processor**: Google Ireland Ltd., with possible transfer to Google LLC in the USA under the EU–US Data Privacy Framework.
  - **What is measured**: page views, device type, approximate location, referrer, and the 3 events. There are no IP addresses and no advertising.
  - **Legal basis**: consent, GDPR Art. 6(1)(a).
  - **Retention**: 2 months for data, 13 months for cookies. The cookies are named (`_ga`, `_ga_…`).
  - **Withdrawing**: a button that opens the same settings panel. The site keeps its own record of the choice only in the visitor's browser.
- **Note**: the owner should review this text before release. It states facts about the setup, but it isn't legal advice.
