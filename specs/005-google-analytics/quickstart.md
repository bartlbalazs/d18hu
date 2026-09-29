# Quickstart: validating visitor statistics

## Prerequisites

- `source ~/.nvm/nvm.sh && nvm use`, then run commands through `corepack pnpm …`.
- The constitution is amended to 1.2.0 ([research R1](research.md#r1-reconciling-with-the-constitution-fr-002)).
- For sections 4–6: a GA4 property whose ID is set as `analytics.measurementId` in `editorial/site.yaml`. For sections 1–3, any well-formed `G-TEST000000` works.

## 1. Off by default

1. Remove the ID, then run `pnpm build:release && pnpm test:site`.
   - Expected: no page contains `consent`, `data-consent-settings`, `adatkezeles` or `googletagmanager`.
2. Run `pnpm build:draft` with the ID set.
   - Expected: the same.

## 2. Static checks with the ID set

Run `pnpm check && pnpm test && pnpm build:release && pnpm test:site`.

Expected:
- The unit tests for `resolveConsent` and `statisticsEventFor` pass.
- The site tests find the notice (hidden) and the footer settings button on every page, the Adatkezelés section on the Impresszum, and `data-stat-image` on every zoom link.
- html-validate and linkinator are clean.

## 3. Nothing before consent (SC-002)

1. Run `pnpm preview` on the release build.
2. In a scratchpad puppeteer script (as used for spec 004), open each page with an empty profile and record every request.
   - Expected: 0 requests to `*.google*.com`, and no `_ga*` cookies.
   - Expected: the notice is not shown, because the host doesn't match. The same goes for `dembinszky18.web.app` after a deploy.

## 4. Accepted path locally, without reaching Google

1. Run `SITE_URL=http://localhost:4321/ pnpm build:release && pnpm preview`.
2. In puppeteer, turn on request interception and **abort** every request to Google hosts, recording each one.

Expected:
- **First visit**: the notice is visible and 0 Google requests are recorded.
- **After "Nem kérem"**: 0 requests, and the notice is gone on the next page.
- **After "Elfogadom"**: a gtag.js request is recorded, and `dataLayer` holds the consent defaults and the config (`allow_google_signals: false`, …).
- **On the home page, events**: clicking a source link, a zoom link and a menu era adds exactly one `archive_source_click`, `image_zoom` and `era_select` entry to `dataLayer`, with the parameters from the [data model](data-model.md#statistics-event-sent-only-in-the-granted-state).
- **With a GPC signal** (`navigator.globalPrivacyControl = true` via `evaluateOnNewDocument`): no notice and no requests. The settings button shows the browser-signal text.
- **Withdrawal**: after "Statisztika beállításai" and then "Nem kérem", further clicks add no events.
- **Keyboard**: Tab reaches both buttons after the page content, and they are ≥ 44 px tall at 320 px width.

Afterwards, rebuild without `SITE_URL`: `pnpm build:release`.

## 5. Performance after consent

- Run `pnpm lighthouse` (no consent state).
  - Expected: the principle II thresholds hold on every page.
- With the local build from section 4 and consent granted, run Chrome DevTools Lighthouse (mobile) with "Clear storage" unchecked, blocking Google requests if you want to keep test hits out of the property.
  - Expected: Performance ≥ 95, TBT ≤ 100 ms, LCP ≤ 2.0 s.
- Measure the module's gzipped size and record it in plan.md.

## 6. Live (after `pnpm site:publish`)

1. In a private window on `https://www.dembinszky18.hu/`, accept, open Névadó, zoom a photo, follow a source and choose an era.
   - Expected: GA Real-time shows 2 page views and one of each event within 1 minute (SC-001, SC-006).
2. Refuse in a fresh private window.
   - Expected: the DevTools Network tab shows no Google requests.
3. Search the repository for secrets (SC-005): `git grep -nIE "(api[_-]?key|secret|private key|BEGIN [A-Z ]*PRIVATE)"`.
   - Expected: nothing except documentation text.
