# Implementation Plan: Publishing the site on Firebase Hosting

**Branch**: `003-firebase-publishing` (work continues on the current git branch, `001-d18-history-timeline`) | **Date**: 2026-09-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/003-firebase-publishing/spec.md`

## Summary

The owner publishes the release build to Firebase Hosting with a single command, `pnpm site:publish`, run on their own machine. The command refuses to deploy unless the working tree is clean and every release check passes. It always targets the owner's personal account and the named project.

Hosting behaviour lives in `firebase.json`: trailing-slash redirects, a Hungarian `404.html`, long caching for hashed assets, `no-cache` for HTML, and security headers. The custom domains `www.dembinszky18.hu` (serves the site) and `dembinszky18.hu` (301 to www) are connected in the Firebase console, which also issues their certificates. `pnpm verify:live` checks links and Lighthouse on the live site.

## Technical Context

**Language/Version**: TypeScript 6.0.3 and Astro 7.3.3 (existing). Node 22 via `.nvmrc`. Bash for the publishing script.

**Primary Dependencies**: new devDependency `firebase-tools`, pinned exactly (15.30.2 under the 7-day gate, [R1](research.md#r1-where-the-firebase-cli-comes-from)). Existing: `linkinator` 8.1.0 and `@lhci/cli` 0.15.1 for live verification.

**Storage**: N/A. The release history is kept by Firebase.

**Testing**:
- A site test for `dist/404.html` in `tests/site/output.test.ts`.
- `pnpm verify:live` against production.
- The manual redirect and header checks in [quickstart.md](quickstart.md).

**Target Platform**: Firebase Hosting (Google CDN) on the free Spark plan.

**Project Type**: static website plus a deployment script.

**Performance Goals**: the live pages meet every principle II threshold (Lighthouse ≥ 95/95/95, SEO 100, LCP ≤ 2.0 s).

**Constraints**:
- No Firebase product other than Hosting.
- The output stays deployable to any static host (FR-010).
- The publishing command always passes `--account bartlbalazs@gmail.com`.

**Scale/Scope**: 4 pages, a 404 page and about 180 assets. Traffic is far below the free tier's 10 GB storage and 360 MB/day transfer.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. Static HTML First | ✅ Pass | Firebase serves `dist/` as files, with no functions and no rewrites. The new 404 page is static HTML. |
| II. Performance Budget | ✅ Pass | CDN, Brotli and immutable caching of hashed assets can only help. `verify:live` asserts the same thresholds as the local Lighthouse run. |
| III. Mobile-First | ✅ Pass | The 404 page reuses the site layout and styles. |
| IV. Minimalism | ✅ Pass, justified | `firebase-tools` is a build-time devDependency: pinned, locked, under the 7-day gate, and never shipped to visitors. There is no runtime JS, no analytics and no Firebase SDK. |
| V. Rich Metadata | ✅ Pass | Canonical links, sitemap and robots.txt already use `https://www.dembinszky18.hu/`. The 404 page gets title, description and `noindex` and stays out of the sitemap. |
| Technical Constraints | ✅ Pass | The output is still portable static files. `firebase.json` is additive configuration. |
| Quality Gates | ✅ Pass | `site:publish` runs the HTML validation, link checks and site tests before every deploy. `verify:live` covers Lighthouse on the changed pages. |

Post-design re-check: still passes, and no Complexity Tracking entries are needed.

## Project Structure

### Documentation (this feature)

```text
specs/003-firebase-publishing/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/hosting.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
firebase.json            # new: hosting config (public dir, trailing slash, headers)
.firebaserc              # new: default project alias → dembinszky18
lighthouserc.live.json   # new: Lighthouse assertions against the live URLs
scripts/publish.sh       # new: clean-tree check, release checks, draft guard, firebase deploy
src/pages/404.astro      # new: Hungarian not-found page (noindex)
src/layouts/Base.astro   # adds a noindex prop, passed to SeoHead
src/components/SeoHead.astro  # outputs robots noindex when asked, not only for drafts
package.json             # firebase-tools devDependency; site:publish and verify:live scripts
pnpm-lock.yaml           # updated lockfile
.gitignore               # .firebase/ (CLI deploy cache)
tests/site/output.test.ts # 404 page assertions
README.md                # Publishing section: setup, DNS records, routine publish, rollback
```

**Structure Decision**: this is a single project. Deployment config sits at the repository root, where the Firebase CLI expects it. The script lives in `scripts/` next to `start-local.sh`.

## Complexity Tracking

No constitution violations to justify.
