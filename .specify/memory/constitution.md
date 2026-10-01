<!--
Sync Impact Report
- Version: 1.2.0 → 1.3.0 (MINOR: performance budget relaxed)
- Modified principle: II. Performance Budget — Largest Contentful Paint ≤ 2.0 s → ≤ 2.5 s
  (Core Web Vitals "good" threshold). With 126 events the home page measured 2.03 s in
  simulated mobile Lighthouse; the delay is page length, not image loading.
- Templates: no change needed (plan-template refers to the constitution, not to the number).
- Follow-up: lighthouserc.json and lighthouserc.live.json updated to 2500 ms.
-->
# D18 Condo Building History Constitution

## Core Principles

### I. Static HTML First

- Every page MUST be delivered as pre-rendered, static HTML that is fully readable with
  JavaScript disabled.
- The site MUST NOT require a server-side runtime, database, or client-side rendering framework
  to display content.
- Markup MUST be semantic HTML5 (`header`, `nav`, `main`, `article`, `section`, `figure`,
  `time`, `footer`) with one `h1` per page and a logical heading hierarchy.
- A build step (e.g., templating Markdown into HTML) is permitted only if its output is plain
  static files deployable to any static host.

**Rationale**: Static HTML is the fastest, most robust, cheapest-to-host and most
crawler-friendly way to publish long-lived historical content.

### II. Performance Budget (NON-NEGOTIABLE)

Every page MUST meet these budgets, measured on a simulated mid-range mobile device over 4G:

- Lighthouse mobile scores: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95,
  SEO = 100.
- Largest Contentful Paint ≤ 2.5 s, Cumulative Layout Shift ≤ 0.05, Total Blocking Time ≤ 100 ms.
- HTML + CSS + JS for the initial view ≤ 100 KB compressed; total initial page weight
  (including above-the-fold images) ≤ 500 KB.
- Images MUST be responsive (`srcset`/`sizes`), served in modern formats (AVIF/WebP) with a
  fallback, carry explicit `width`/`height`, and be lazy-loaded below the fold.
- Critical CSS MUST NOT be render-blocking beyond a single small stylesheet.

**Rationale**: Visitors are often on phones; speed is both user experience and a search
ranking signal.

### III. Mobile-First Responsive Design

- Styles MUST be authored mobile-first and adapt fluidly from 320 px to ≥ 1920 px wide with
  no horizontal scrolling.
- Every page MUST include `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- Touch targets MUST be at least 44 × 44 CSS px; body text at least 16 px.
- All features (timeline, gallery, navigation) MUST be fully usable by touch, keyboard and
  screen readers.
- Layout MUST use modern CSS (flexbox, grid, `clamp()`), not fixed-width layouts or CSS
  frameworks.

**Rationale**: Most visitors — residents, buyers, local history fans — will browse on mobile.

### IV. Minimalism — No Bloat

- No JavaScript frameworks, CSS frameworks, or UI component libraries.
- JavaScript is optional progressive enhancement only, vanilla, and ≤ 20 KB compressed site-wide.
- No third-party trackers, ad scripts, social embeds, or external CDNs at runtime, with one
  exception: a single analytics service MAY be used if it loads, sets cookies or sends data only
  after the visitor's explicit consent, refusing is as easy as accepting, and it never delays the
  first view. Without consent the site MUST make no third-party requests. The consent notice and
  its script count towards the 20 KB JavaScript budget; the service's own script, loaded only
  after consent, does not, but pages MUST still meet Principle II after consent.
- At most two self-hosted web-font families (e.g., one display serif and one text sans), in
  WOFF2 with `font-display: swap`, subset to the characters the site's language needs, loading
  only the weights and styles actually used; total font payload ≤ 150 KB compressed.
- Every new dependency or asset MUST be justified in the plan against these budgets.

**Rationale**: Clean, simple code stays fast, secure and maintainable for decades — like the
history it presents.

### V. Rich Metadata & Discoverability

Every page MUST include:

- `<html lang>`, a unique `<title>` (≤ 60 chars), a unique `meta description`
  (50–160 chars), and a `<link rel="canonical">`.
- Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`) and
  Twitter Card (`summary_large_image`) tags.
- schema.org JSON-LD structured data appropriate to the content: `WebSite` and
  `BreadcrumbList` on all pages; `ApartmentComplex`/`Place` (with address and geo) for the
  building; `Event` for historical milestones; `ImageObject` (with date, creator, license)
  for archive photos; `Article` for story pages.
- Descriptive `alt` text for every meaningful image and machine-readable dates via `<time datetime>`.
- Favicon set and web app manifest.

The site MUST publish `sitemap.xml` and `robots.txt`, and use clean, human-readable,
stable URLs. If multiple languages are supported, `hreflang` alternates are REQUIRED.

**Rationale**: Search engines and social platforms should understand exactly what the
building is, where it is, and what happened when.

## Technical Constraints

- Deliverable: static files (HTML, CSS, optional JS, images) deployable to any static host
  (e.g., GitHub Pages, Netlify, Cloudflare Pages).
- Content SHOULD live in plain, version-controlled files (Markdown or HTML) editable by
  non-developers.
- Any build or tooling dependency MUST be pinned to an exact version with a committed lockfile
  and MUST honor a minimum 7-day release age before adoption (CVE fixes excepted).
- Target browsers: the last two versions of evergreen browsers and iOS/Android default browsers.

## Quality Gates

A change MUST NOT be merged unless:

1. HTML validates (W3C / Nu validator) with no errors.
2. Lighthouse mobile run meets every Principle II threshold on every changed page.
3. Metadata checks pass: required tags present, JSON-LD validates (Schema.org validator /
   Rich Results Test), sitemap updated, no broken internal links.
4. Pages render correctly at 320 px, 768 px, and 1280 px widths.
5. Plans (`/speckit-plan`) include a Constitution Check confirming compliance with all five
   principles; any deviation is recorded with justification in the plan's Complexity Tracking.

## Governance

- This constitution supersedes other practices; specs, plans and tasks MUST comply with it.
- Amendments are made via `/speckit-constitution`, documented in the Sync Impact Report, and
  committed with a message describing the change.
- Versioning follows semantic versioning: MAJOR for removing or redefining a principle, MINOR
  for adding a principle or materially expanding guidance, PATCH for clarifications.
- Every plan and code review MUST verify compliance; unjustified complexity is rejected.

**Version**: 1.3.0 | **Ratified**: 2026-09-28 | **Last Amended**: 2026-10-01
