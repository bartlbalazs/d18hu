# Implementation Plan: Visitor statistics with Google Analytics

**Branch**: `005-google-analytics` (work continues on the current git branch, `001-d18-history-timeline`) | **Date**: 2026-09-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/005-google-analytics/spec.md`

## Summary

The owner's Google Analytics 4 property counts page views and 3 reading events, only for visitors who say yes.

- **Constitution principle IV was amended** (1.1.0 → 1.2.0, 2026-09-29) to allow one consent-gated analytics service ([R1](research.md#r1-reconciling-with-the-constitution-fr-002)).
- **Release builds with a measurement ID** in `editorial/site.yaml` get three pieces of static markup:
  - a hidden Hungarian consent notice
  - a "Statisztika beállításai" button in the footer
  - an Adatkezelés section on the Impresszum
- **A small vanilla module** does the rest, and only on the live hostname:
  - It shows the notice, stores the choice in `localStorage`, and honours GPC and DNT.
  - Only after consent, it injects Google's gtag.js (Consent Mode basic, with advertising denied).
  - It reports the 3 events from one delegated click listener.
- **Draft builds, builds without the ID, and every other host** get no analytics at all.
- **No secret exists in this design.** The measurement ID is public by nature.

## Technical Context

**Language/Version**: TypeScript 6.0.3 and Astro 7.3.3 (existing), plus CSS. Node 22 via `.nvmrc`.

**Primary Dependencies**: none new in the repository. At runtime, Google's gtag.js is loaded from `www.googletagmanager.com`, only after consent.

**Storage**: the visitor's `localStorage` (`d18-statisztika`). Google Analytics cookies are set only after consent.

**Testing**:
- Vitest unit tests for `resolveConsent` and `statisticsEventFor`.
- Site tests in `tests/site/output.test.ts` for the markup with and without analytics.
- `html-validate`, linkinator and Lighthouse (existing).
- Scratchpad puppeteer checks with Google requests aborted ([quickstart](quickstart.md)).

**Target Platform**: current mobile and desktop browsers. Without JavaScript nothing changes.

**Project Type**: static website on Firebase Hosting.

**Performance Goals**: principle II thresholds on every page, both before a choice and after accepting.

**Constraints**:
- 0 requests to Google before consent.
- No secrets in the repo.
- Refusing is as easy as accepting.
- The notice never blocks reading.
- Touch targets ≥ 44 px.

**Scale/Scope**:
- 1 new module and 2 pure functions.
- 5 components or pages touched: `Base.astro`, `SiteFooter.astro`, `EvidenceFigure.astro`, `TimelineEvent.astro` and the Impresszum page.
- The editorial schema, and CSS in `base.css`.
- 5 pages (4 content pages and the 404 page).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. Static HTML First | ✅ Pass | All text is static HTML. Without JavaScript the notice and settings buttons stay `hidden`, and pages are unchanged. |
| II. Performance Budget | ✅ Pass | 1,774 bytes gzipped of inlined module (measured), plus about 1 KB of HTML and CSS per page. gtag.js loads only after consent, after `load` and idle ([R2](research.md#r2-how-google-analytics-is-loaded-fr-003-fr-011)). Before a choice, every page meets the thresholds. After consent the home page's TBT is borderline, see [R8](research.md#r8-code-organisation-and-budget-principle-iv). |
| III. Mobile-First | ✅ Pass | The notice is a non-modal bottom panel from 320 px up, with 44 px buttons. It is usable with a keyboard and screen readers. |
| IV. Minimalism | ⚠️ Justified | Constitution 1.2.0 allows one analytics service that loads, sets cookies and sends data only after explicit consent, with refusal as easy as acceptance and no delay to the first view. This design meets each condition ([R2](research.md#r2-how-google-analytics-is-loaded-fr-003-fr-011), [R4](research.md#r4-the-consent-record-fr-004-key-entity-consent-choice), [R5](research.md#r5-the-notice-and-the-settings-link-fr-004-fr-005-sc-003)). gtag.js is exempt from the 20 KB cap, but the consent module counts towards it, so the existing overrun grows. See Complexity Tracking. |
| V. Rich Metadata | ✅ Pass | No change to SEO metadata. The Impresszum gains an `h2` section, and the heading order stays valid. |
| Quality Gates | ✅ Pass | HTML validation, link check, site and unit tests, and Lighthouse on every page. |

Post-design re-check against constitution 1.2.0: all principles pass. The only deviation is the site-wide JavaScript cap, recorded below.

## Project Structure

### Documentation (this feature)

```text
specs/005-google-analytics/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/statistics.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
editorial/site.yaml                   # optional analytics.measurementId
src/lib/editorial/schema.ts           # analytics: { measurementId?: /^G-[A-Z0-9]+$/ }
src/lib/site-data.ts                  # expose analytics { enabled, measurementId, siteHost }
src/lib/statistics/consent.ts         # new: resolveConsent()
src/lib/statistics/events.ts          # new: statisticsEventFor()
src/scripts/statistics.ts             # new: notice, storage, gtag loader, withdrawal, event listener
src/layouts/Base.astro                # notice markup + module, only when enabled
src/components/SiteFooter.astro       # Statisztika beállításai button, only when enabled
src/components/EvidenceFigure.astro   # data-stat-image on the zoom link
src/pages/impresszum/index.astro      # Adatkezelés section, only when enabled
src/styles/base.css                   # .consent panel, .footer-link
tests/unit/statistics.test.ts         # new
tests/site/output.test.ts             # markup with and without analytics
README.md                             # GA property setup, admin switches, on/off
```

**Structure Decision**: this is a single project. Pure logic goes in `src/lib/statistics/`, browser glue in `src/scripts/`, as in spec 004.

## Complexity Tracking

| Violation | Why needed | Simpler alternative rejected because |
|---|---|---|
| Site-wide JavaScript about 25.8 KB against a 20 KB cap. The new module adds 1,774 bytes gzipped (measured) to the existing PhotoSwipe overrun. | Consent handling legally needs script: storing the choice, loading only after it, and withdrawal. | There is no way to gate a third-party script on consent without JavaScript. Everything still works without it. |
