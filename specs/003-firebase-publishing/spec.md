# Feature Specification: Publishing the site on Firebase Hosting

**Feature Branch**: `003-firebase-publishing`

**Created**: 2026-09-29

**Status**: Draft

**Input**: User description: "i want to publish this page. preferably to firebase"

## Clarifications

### Session 2026-09-29

- Q: How should publishing be started? → A: The owner runs one command on their own machine. There is no automatic publishing from GitHub.
- Q: Which Google account should own the Firebase project? → A: The owner's personal Google account (bartlbalazs@gmail.com), never the work account.
- Q: Is `dembinszky18.hu` registered, and does the owner control its DNS? → A: Yes, it is registered and the owner can edit its DNS.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The owner publishes the finished site (Priority: P1)

The owner has a site that passes every release check. They run one documented publishing step, and a few minutes later the current version of the site is live on the internet for anyone to visit.

**Why this priority**: Nothing else in this feature matters until the site is reachable by the public.

**Independent Test**: Run the publishing step from a clean checkout. Then open the published home page, Építők, Névadó and Impresszum from a phone on mobile data. Each loads and matches the local release build.

**Acceptance Scenarios**:

1. **Given** the release build passes, **When** the owner runs the publishing step, **Then** every page, image, font, the sitemap and robots.txt are reachable at the public address within 5 minutes.
2. **Given** editorial data is missing or a release check fails, **When** the owner runs the publishing step, **Then** nothing is published and the owner sees which check failed.
3. **Given** a published version, **When** the owner publishes a new one, **Then** visitors see the new version without an outage, and the previous version can be restored in one step.

---

### User Story 2 - Visitors reach the site at its own address (Priority: P1)

A visitor types `dembinszky18.hu` or `www.dembinszky18.hu`, or follows a shared link, and lands on the site over a secure connection.

**Why this priority**: The site's canonical links, sitemap and social previews all use `https://www.dembinszky18.hu/`. If that address doesn't serve the site, search engines and shared links point to nothing.

**Independent Test**: Open `http://dembinszky18.hu`, `https://dembinszky18.hu` and `http://www.dembinszky18.hu/epitok/`. Each ends at the matching `https://www.dembinszky18.hu/…` page with a valid certificate.

**Acceptance Scenarios**:

1. **Given** the site is published, **When** a visitor opens `https://www.dembinszky18.hu/`, **Then** the home page loads with a valid certificate and no browser warning.
2. **Given** the site is published, **When** a visitor opens the bare domain or any `http://` address, **Then** they are permanently redirected to the same page under `https://www.dembinszky18.hu/`.
3. **Given** a visitor opens a page that does not exist, such as `/irasok/`, **When** the response arrives, **Then** it is a "not found" response with a Hungarian page that links back to the home page.

---

### User Story 3 - The published site stays fast (Priority: P2)

A visitor on a phone gets the published site as fast as the local release build.

**Why this priority**: The performance budget is a non-negotiable principle. Hosting settings such as compression and caching decide whether the live site meets it.

**Independent Test**: Run Lighthouse against the published pages and compare the scores to the local release build.

**Acceptance Scenarios**:

1. **Given** the site is published, **When** Lighthouse mobile runs against each published page, **Then** every principle II threshold is met.
2. **Given** a returning visitor, **When** they reopen a page, **Then** images, fonts and other fingerprinted files come from their browser cache, while the HTML is always fresh.

### Edge Cases

- A publish is interrupted halfway, for example by a lost connection. Visitors keep seeing the previous complete version, never a mix of old and new files.
- The owner publishes from a machine where they aren't logged in to the hosting account, or are logged in with the wrong account. The step stops before publishing anything and says which account is expected.
- The custom domain isn't connected yet, or its certificate is still being issued. The site is still reachable at the host's default address, so the owner can check it before DNS is ready.
- Draft output (the "Piszkozat" banner and `noindex`) is never published.
- Search engines have not seen the site before. The live robots.txt allows crawling and points to the live sitemap.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The publishing step MUST publish only the output of a passing release build. It MUST refuse to run on a draft build or on a build with failing checks.
- **FR-002**: Publishing MUST be started by the owner running a single command on their own machine. That command builds the release, runs the release checks and publishes only if they pass. Automatic publishing from a code repository is out of scope.
- **FR-003**: The site MUST be served at `https://www.dembinszky18.hu/` with a valid certificate. The bare domain and all `http://` addresses MUST redirect permanently to it, keeping the path.
- **FR-004**: The site MUST keep its current URLs, with trailing slashes (`/epitok/`, `/nevado/`, `/impresszum/`). An address without the trailing slash MUST redirect to the one with it.
- **FR-005**: Unknown addresses MUST return a "not found" status with a Hungarian page in the site's design that links back to the home page.
- **FR-006**: Responses MUST be compressed. Fingerprinted files (images, fonts, scripts, styles) MUST be cacheable for at least one year. HTML, the sitemap and robots.txt MUST be revalidated on every visit.
- **FR-007**: Responses MUST carry basic security headers: HTTPS enforced for future visits (HSTS), no MIME sniffing, no framing by other sites, and a referrer policy.
- **FR-008**: Each publish MUST be atomic: visitors see either the whole previous version or the whole new one. The owner MUST be able to restore a previous version.
- **FR-009**: The hosting project MUST belong to the owner's personal Google account (bartlbalazs@gmail.com). The publishing command MUST target that project explicitly, so it can never publish with, or into, a work account.
- **FR-010**: The site MUST remain plain static files deployable to any static host, so moving to another host later needs no content changes.
- **FR-011**: The README MUST describe the first-time setup (account, project, domain) and the routine publishing step, including how to restore a previous version.
- **FR-012**: Going live MUST include connecting `dembinszky18.hu` and `www.dembinszky18.hu` to the host. The owner controls the domain's DNS, and the README MUST list the exact records to enter at the registrar.

### Key Entities

- **Published version**: one complete, immutable copy of the release build that the host serves. It has a time and can be restored.
- **Public address**: `https://www.dembinszky18.hu/`, the single canonical origin. Other addresses redirect to it.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: After the one-time setup, the owner can publish a new version in under 5 minutes with a single documented step.
- **SC-002**: All 4 pages and 100% of the internal links, images and fonts respond successfully on the published site. A link check against the live address reports 0 broken links.
- **SC-003**: Every published page meets the principle II thresholds in a Lighthouse mobile run: Performance, Accessibility and Best Practices ≥ 95, SEO = 100.
- **SC-004**: 100% of the tested variant addresses (bare domain, `http://`, missing trailing slash) end at the canonical `https://www.dembinszky18.hu/…` page in a single permanent redirect.
- **SC-005**: Restoring the previous version takes under 2 minutes.
- **SC-006**: Hosting costs nothing at the site's expected traffic of a local-history site, which is well under the host's free allowance.

## Assumptions

- The owner prefers Firebase Hosting. It serves static files, supports custom domains with automatic certificates, and has a free tier that fits this site. No other Firebase product (database, functions, authentication, analytics) is used.
- Site analytics are out of scope. Adding them would need a separate decision under constitution principle IV (cookieless, ≤ 5 KB).
- `https://www.dembinszky18.hu/` is the canonical address, as decided earlier and already built into the site.
- The owner will name the registrar when adding the DNS records. The records themselves are the same whichever registrar it is.
- The Firebase command-line tool is already installed on the owner's machine. Any version pinned in the project follows the pinning and 7-day release-age rules.
- Preview links for checking a version before it goes live are useful but optional. The host's default address covers the check before the domain is connected.
