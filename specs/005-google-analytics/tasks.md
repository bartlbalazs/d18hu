---

description: "Task list for visitor statistics with Google Analytics"
---

# Tasks: Visitor statistics with Google Analytics

**Input**: Design documents from `/specs/005-google-analytics/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/statistics.md](contracts/statistics.md), [quickstart.md](quickstart.md)

**Tests**: the plan asks for these:
- unit tests for `resolveConsent` and `statisticsEventFor`
- site-output assertions for the markup, with and without analytics
- scratchpad puppeteer checks with Google requests aborted
- the existing HTML validation, link and Lighthouse checks

**Organization**: tasks are grouped by user story.
- Run every command as `source ~/.nvm/nvm.sh && nvm use && corepack pnpm …` from the repository root.
- Never commit a real or fake measurement ID other than the owner's own. For local checks, set `G-TEST000000` temporarily and revert it.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on an unfinished task).
- **[Story]**: US1–US3 from spec.md.

---

## Phase 1: Setup

- [X] T001 Amend constitution principle IV to 1.2.0 via `/speckit-constitution` in `.specify/memory/constitution.md` (done 2026-09-29). Remove the Sync Impact Report comment before committing.

No new dependencies are needed.

---

## Phase 2: Foundational

**Purpose**: the build-time switch and the consent logic that every story depends on.

- [X] T002 In `src/lib/editorial/schema.ts`, add an optional `analytics` object to `siteEditorialSchema`.
  - Shape: `z.strictObject({ measurementId: z.string().default('') }).default({ measurementId: '' })`.
  - The rule: "If present, it must match `^G-[A-Z0-9]+$` or the build fails. An empty string is treated as missing."
  - Do not add it to the editorial audit in `src/lib/editorial/audit.ts`, because a missing ID is not a missing item.
- [X] T003 In `editorial/site.yaml`, add `analytics:` with `measurementId: ''`.
  - Add a comment: the ID is public by design, set it only to the owner's property ID, and leave it empty to build without analytics.
- [X] T004 In `src/lib/site-data.ts`, add `analytics: { enabled: boolean; measurementId: string; siteHost: string }` to `SiteData`.
  - `enabled` is `mode === 'release' && measurementId !== ''`.
  - `siteHost` is `new URL(resolveSiteUrl()).hostname`, using `resolveSiteUrl` from `src/lib/build-mode.ts`.
- [X] T005 [P] Write unit tests for `resolveConsent` in `tests/unit/statistics.test.ts`, covering every row of the data-model table:
  - storage throws → `denied`
  - GPC `true` → `denied`
  - DNT `'1'` → `denied`
  - `"granted"` → `granted`
  - `"denied"` → `denied`
  - `null` or an unknown value → `ask`
  - a GPC signal overriding a stored `"granted"` → `denied`
- [X] T006 [P] Implement `resolveConsent(stored: string | null | Error, signals: { gpc?: boolean; dnt?: string | null }): 'granted' | 'denied' | 'ask'` in `src/lib/statistics/consent.ts`.
  - Export `CONSENT_STORAGE_KEY = 'd18-statisztika'`.
  - Make T005 pass.

**Checkpoint**: `pnpm check && pnpm test` passes, and `pnpm build:release` still produces an identical site, since the ID is empty.

---

## Phase 3: User Story 2 – Visitors decide about statistics (P1) 🎯 MVP

**Goal**: the consent notice, the remembered choice, the settings button and withdrawal. Page views load only after "Elfogadom".

**Independent test**: [quickstart](quickstart.md) §1, §3 and §4 (the notice, "Nem kérem", "Elfogadom", GPC, withdrawal and keyboard parts).

- [X] T007 [P] [US2] In `src/layouts/Base.astro`, when `analytics.enabled`, render the notice `<section class="consent" id="statisztika" …>` exactly as in contracts/statistics.md.
  - It carries `hidden`, `data-measurement-id` and `data-site-host`.
  - The heading `<h2 id="statisztika-cim" tabindex="-1">Látogatottsági statisztika</h2>`.
  - The text says the site would like to count visits with Google Analytics, using cookies, only with consent. It links "Részletek" to `/impresszum/#adatkezeles`.
  - An empty `<p data-consent-status>`.
  - Two `.consent__button` buttons, `data-consent="granted"` "Elfogadom" and `data-consent="denied"` "Nem kérem".
  - Place it after `<SiteFooter />`. Then add `<script>import '../scripts/statistics.ts';</script>`, also only when enabled.
- [X] T008 [P] [US2] In `src/components/SiteFooter.astro`, add an `analytics` boolean prop. When it is true, add `<li><button type="button" class="footer-link" data-consent-settings hidden>Statisztika beállításai</button></li>` to the footer list. Pass the prop from `src/layouts/Base.astro`.
- [X] T009 [P] [US2] In `src/styles/base.css`, add styles written mobile-first:
  - `.consent`: a fixed bottom panel (`inset: auto 0 0 0`), paper background, top border and shadow from `src/styles/tokens.css`, safe-area padding, and `max-height: 50dvh` with scrolling. It is non-modal: no backdrop, no focus trap.
  - `.consent__actions`: the two buttons side by side, wrapping at 320 px, both ≥ 44 px tall and styled identically.
  - `.footer-link`: a button that looks like the footer links, with a ≥ 44 px target.
  - Honour `prefers-reduced-motion` if you add any transition.
- [X] T010 [US2] Implement `src/scripts/statistics.ts` per contracts/statistics.md "Behaviour", steps 1–4.
  - **Start-up**: read `#statisztika`. Exit unless `location.hostname === dataset.siteHost`.
  - **Resolving consent**: read storage inside try/catch, then call `resolveConsent` with `navigator.globalPrivacyControl` and `navigator.doNotTrack`.
  - **Showing controls**: in `ask`, un-hide the notice. In every state except "storage throws", un-hide the `[data-consent-settings]` buttons.
  - **Loading the tag**, in `loadTag()`, which runs once:
    - `window.dataLayer`, `gtag`
    - `gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'})`
    - `gtag('js', new Date())`
    - `gtag('config', id, {allow_google_signals:false, allow_ad_personalization_signals:false, cookie_expires:34128000})`
    - append `<script async src="https://www.googletagmanager.com/gtag/js?id=…">`
  - **When `loadTag()` runs**:
    - For a stored `granted`: after `load`, then `requestIdleCallback` with a `setTimeout` fallback.
    - On "Elfogadom": at once.
  - **Withdrawal** ("Nem kérem" after consent):
    - store `denied`
    - `window['ga-disable-'+id]=true`
    - `gtag('consent','update',{analytics_storage:'denied'})`
    - expire every `_ga` and `_ga_*` cookie for the host and for `.` plus its parent domain
  - **The settings button**:
    - Shows the notice.
    - Fills `[data-consent-status]` with "Jelenleg: engedélyezve", "Jelenleg: elutasítva", or "A böngészője kérte, hogy ne mérjük a látogatását, ezért a statisztika ki van kapcsolva." In the browser-signal case, it hides Elfogadom.
    - Focuses the heading.
  - **After any choice**: hide the notice. If focus was inside it, move focus to the footer settings button.
- [X] T011 [US2] In `src/pages/impresszum/index.astro`, when `analytics.enabled`, add `<h2 id="adatkezeles">Adatkezelés</h2>` with the content from research R9:
  - **Controller**: `impresszum.operator`.
  - **Processor**: Google Ireland Ltd., with possible transfer to Google LLC (USA) under the EU–US Data Privacy Framework.
  - **What is measured**: page views, device type, approximate location, referrer, and the 3 events. No IP addresses are stored and there is no advertising.
  - **Legal basis**: consent, GDPR Art. 6(1)(a).
  - **Retention**: 2 months for data. The cookies `_ga` and `_ga_…` last up to 13 months.
  - **Withdrawing**: a `<button type="button" class="footer-link" data-consent-settings hidden>Statisztika beállításai</button>`, and a note that the choice is kept only in the visitor's browser.
- [X] T012 [US2] In `tests/site/output.test.ts`, add a 'statistics' block. Read `editorial/site.yaml` to see whether `analytics.measurementId` is set.
  - **ID empty**: no page in `dist` contains `id="statisztika"`, `data-consent-settings`, `id="adatkezeles"` or `googletagmanager`.
  - **ID set** (release build):
    - Every page, including `404.html`, has exactly one `#statisztika` with `hidden` and `data-measurement-id` equal to the ID, and one footer `data-consent-settings` button.
    - The Impresszum has `#adatkezeles`.
    - No `<script src>` points to a non-local host.
- [X] T013 [US2] Run quickstart §1–§4 with `G-TEST000000` set temporarily in `editorial/site.yaml`, using a scratchpad puppeteer script with Google requests aborted. Revert the ID afterwards. Record the results.

**Checkpoint**: a compliant consent flow. With an ID set, consenting visitors are counted as page views (US1 scenarios 1–2).

---

## Phase 4: User Story 1 – The owner sees visitor statistics (P1)

**Goal**: the 3 reading events, plus the owner's property setup.

**Independent test**: quickstart §4 (the events part) and §6.

- [X] T014 [P] [US1] Extend `tests/unit/statistics.test.ts` with `statisticsEventFor` cases:
  - An external link in `<main>` inside an event → `archive_source_click` with `source_url` and `timeline_event` equal to the event id.
  - The same link on a story page → `timeline_event` equal to the page path.
  - A `data-stat-image` link → `image_zoom` with `image_name`.
  - A menu link `/#korszak-<id>` → `era_select` with `era: '<id>'`.
  - A menu link to `/nevado/` → `null`.
  - Any other link → `null`.
- [X] T015 [P] [US1] Implement `statisticsEventFor(link: { href: string; dataset: Record<string, string | undefined>; inMenu: boolean; eventId?: string; pagePath: string })` in `src/lib/statistics/events.ts`.
  - It returns `{ name, params } | null`, with exactly the 3 event names and parameters in data-model.md.
  - No other event or parameter is sent (FR-008).
- [X] T016 [P] [US1] ~~In `src/components/TimelineEvent.astro`, add `data-stat-source` to each `event.sources` link.~~ Superseded: the story pages have many inline sources, so every external link inside `<main>` now counts as an archive source, and `src/components/TimelineEvent.astro` is unchanged.
- [X] T017 [P] [US1] In `src/components/EvidenceFigure.astro`:
  - ~~Add `data-stat-source` to the credit source link.~~ Superseded, see T016.
  - Add `data-stat-image={imageName}` to `a.evidence__link`. `imageName` is the base name of `image.src` without the build hash, query or extension: `src/assets/archive/<name>.jpg` becomes `<name>`.
- [X] T018 [US1] In `src/scripts/statistics.ts`, add one delegated `click` listener on `document`. It reports only in the `granted` state, and only for primary-button clicks without modifier keys on zoom links. Steps:
  1. Find `closest('a')`.
  2. Build the `statisticsEventFor` input: `inMenu` from `closest('#fomenu')`, and `eventId` from `closest('[data-event-id]')`.
  3. Call `gtag('event', name, params)`.
- [X] T019 [US1] In `tests/site/output.test.ts`:
  - Every `a.evidence__link` has a non-empty `data-stat-image` without a hash.
- [X] T020 [US1] Run the events part of `specs/005-google-analytics/quickstart.md` §4, and confirm exactly one `dataLayer` entry per click.

**Checkpoint**: all 3 events are reported for consenting visitors.

---

## Phase 5: User Story 3 – The site stays fast and readable (P2)

**Goal**: principle II holds before a choice and after consent.

**Independent test**: quickstart §5.

- [X] T021 [US3] Measure the gzipped size of the built statistics module, then update the estimates in `specs/005-google-analytics/plan.md` (Complexity Tracking) and in `specs/005-google-analytics/research.md` (R8).
- [ ] T022 [US3] Run `pnpm lighthouse` on a release build with the temporary ID. Then run the after-consent DevTools Lighthouse check from quickstart §5. Every page must have Performance ≥ 95, TBT ≤ 100 ms, LCP ≤ 2.0 s and CLS ≤ 0.05. Fix any regression in `src/scripts/statistics.ts` or `src/styles/base.css`.
  - **Result (2026-09-29)**:
    - Before a choice, with the notice showing: all pass (Performance 98–100, TBT ≤ 45 ms).
    - After consent: Performance ≥ 98 on every page. The home page's TBT was 12–156 ms over 9 runs (median 87), and 3 runs were over 100 ms. gtag.js adds about 50 ms on average, as two long tasks of about 55–70 ms.
    - **Open**: the owner decides whether to accept this or to delay loading the tag further.

---

## Phase 6: Polish & cross-cutting

- [X] T023 [P] In `README.md`, add a "Statistics (Google Analytics)" section. It covers:
  - **Creating the property**: GA4, with the personal account.
  - **Where the ID goes**: `editorial/site.yaml`. It is public, and there are no secrets.
  - **Turning analytics on or off**: set or empty the ID. Draft builds never include it.
  - **Admin switches** (FR-007):
    - data retention 2 months
    - Google signals off
    - data sharing off
    - granular location and device data off
    - enhanced measurement off
  - **Custom dimensions to register**: `source_url`, `timeline_event`, `image_name`, `era`.
  - **Checking it**: with Real-time.
  - Also update the project layout and scripts sentence.
- [X] T024 [P] Run the secret scan from `specs/005-google-analytics/quickstart.md` §6 (SC-005) over the working tree and the history. Report any hit.
- [X] T025 Run `pnpm check && pnpm test && pnpm build:release && pnpm test:site` with the ID empty in `editorial/site.yaml`, and confirm the output matches the "off" expectations.
- [ ] T026 Manual, owner: create the GA4 property and make the admin settings from `README.md`. Put the ID in `editorial/site.yaml`, commit, run `pnpm site:publish`, then run quickstart §6.

---

## Dependencies & execution order

- **Phase 2 before everything**: T002 → T003 → T004. T005 and T006 can run alongside them.
- **US2 (Phase 3)** depends on Phase 2.
  - T007, T008 and T009 can run in parallel.
  - T010 comes after T007 and T008.
  - T011 can run in parallel with T010.
  - T012 and T013 come last.
- **US1 (Phase 4)** depends on T010, since the listener lives in the same module and needs `gtag`.
  - T014, T015, T016 and T017 can run in parallel.
  - T018 comes after T015.
  - T019 comes after T016 and T017.
- **US3 (Phase 5)** comes after US1 and US2.
- **Polish (Phase 6)** comes last. T026 is the owner's step after the code is merged.

## Parallel examples

- **Phase 2**: T005 and T006, while T002 to T004 are in progress.
- **US2**: T007, T008 and T009 together.
- **US1**: T014, T015, T016 and T017 together.

## Implementation strategy

1. **MVP**: Phase 2 and US2. The consent flow alone is shippable, and page views are counted for consenting visitors.
2. **Then** US1's events, then the US3 measurements, then the README and the secret scan.
3. **Going live**: the site goes live with analytics only when the owner sets the real ID (T026). Until then, every release build stays analytics-free.
