# Research: Publishing the site on Firebase Hosting

## R1. Where the Firebase CLI comes from

- **Decision**: Add `firebase-tools` as an exact-pinned devDependency, recorded in `pnpm-lock.yaml`. The publishing command runs it through `pnpm exec firebase`.
  - The pnpm `minimumReleaseAge: 10080` gate in `pnpm-workspace.yaml` picks the newest release that is at least 7 days old. On 2026-09-29 that is 15.30.2 (published 2026-09-17). 15.31.0 and 15.32.0 are newer than 7 days and are skipped.
- **Rationale**: The supply-chain rules require every tool to be pinned, locked and subject to the 7-day release age.
  - The global CLI on the owner's machine (15.15.0) is not pinned to anything, and its version would drift between machines.
  - The package is only a build-time tool and ships nothing to visitors, so principle IV's runtime budgets are not affected.
- **Alternatives considered**:
  - Rely on the globally installed CLI. Rejected: it is not pinned and not locked.
  - Call the Firebase Hosting REST API from a custom script. Rejected: it would mean reimplementing uploads, hashing and version finalisation for no gain.

## R2. Hosting configuration (`firebase.json`)

- **Decision**:
  - `"public": "dist"` and `"trailingSlash": true`. Firebase then redirects `/epitok` to `/epitok/` with a 301, matching Astro's `trailingSlash: 'always'` and `build.format: 'directory'`.
  - `cleanUrls` stays unset. Every page is a directory with an `index.html`.
  - No rewrites. Unknown paths fall through to `dist/404.html`, which Firebase serves with status 404 automatically.
- **Rationale**: This matches the URLs the site already uses in its canonical links and sitemap (FR-004, FR-005) and needs no server logic.
- **Alternatives considered**: a catch-all rewrite to `index.html`. Rejected: it is a single-page-app pattern, and it would return 200 for unknown URLs, which breaks FR-005 and principle V.

## R3. Caching and compression (FR-006)

- **Decision**:
  - `/_astro/**` holds every image, font and script, and all of them have content hashes in their names. These get `Cache-Control: public, max-age=31536000, immutable`.
  - The HTML, `sitemap.xml`, `robots.txt`, `site.webmanifest` and the unhashed icons (`favicon.svg`, `apple-touch-icon.png`, `icon-*.png`) get `Cache-Control: no-cache`, so the browser revalidates them with the ETag on every visit.
- **Rationale**: Returning visitors get assets from their cache, while text changes appear immediately.
  - Firebase compresses responses with gzip or Brotli on its own, so compression needs no configuration.
  - Firebase purges its CDN cache on every deploy, so `no-cache` HTML is fresh straight after a publish.
- **Alternatives considered**: Firebase's default one-hour caching. Rejected: it keeps HTML stale for up to an hour and gives hashed assets far less than a year.

## R4. Security headers (FR-007)

- **Decision**: On `**`, send:
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- **Rationale**: These cover FR-007 and Lighthouse Best Practices at no runtime cost.
  - A full Content-Security-Policy is left out. The pages inline their stylesheets (`inlineStylesheets: 'always'`) and their JSON-LD, so a strict CSP would need a hash per page. That's a separate hardening task and not needed for the spec.
- **Alternatives considered**: `preload` in HSTS. Rejected for now: preload-list submission is hard to undo, so the owner should decide on it after the domain has been live for a while.

## R5. Custom domain and redirects (FR-003, FR-012)

- **Decision**:
  - Connect both `www.dembinszky18.hu` and `dembinszky18.hu` in the Firebase console under Hosting → Add custom domain.
  - `www` serves the site.
  - The apex domain is added with the console's "Redirect to www.dembinszky18.hu" option, which gives a 301 that keeps the path.
  - The console shows the DNS records (an ownership TXT record and the A/CNAME records). The owner enters them at the registrar, and the README records the exact values once the console shows them.
  - Firebase issues and renews the certificates automatically, and redirects `http://` to `https://` itself.
- **Rationale**: Firebase does the whole domain setup, including certificates, with no code. Redirecting the apex domain in the console keeps `firebase.json` independent of the domain.
- **Alternatives considered**: a `redirects` rule in `firebase.json` that matches the host. Rejected: Firebase redirects can't match on the hostname.

## R6. Account and project safety (FR-009)

- **Decision**:
  - `.firebaserc` names the project as the `default` alias. The proposed ID is `dembinszky18`, with `dembinszky18-hu` as the fallback if the ID is taken; the owner creates the project in the console.
  - The publishing command always passes `--project <id>` and `--account bartlbalazs@gmail.com`, and it runs `--non-interactive`.
  - If that account isn't logged in, the CLI stops before uploading, and the command tells the owner to run `pnpm exec firebase login`.
- **Rationale**: Two explicit flags make it impossible to publish with, or into, the work account, whichever account the CLI last used.
- **Alternatives considered**: `firebase use` state alone. Rejected: that state is per-machine and invisible, and it relies on whichever account is currently active.

## R7. The publishing command (FR-001, FR-002, FR-008)

- **Decision**: `scripts/publish.sh`, exposed as `pnpm site:publish`. The names `pnpm publish` and `pnpm deploy` are built-in pnpm commands, so they can't be used. The script runs these steps and stops at the first failure:
  1. Refuse if the working tree has uncommitted changes, so that every published version corresponds to a commit.
  2. Run `pnpm check`, `pnpm test`, `pnpm build:release` and `pnpm test:site`.
  3. Refuse if `dist/` contains the draft banner or `noindex`. This is a second guard beyond the release build.
  4. Run `firebase deploy --only hosting --project … --account … --non-interactive -m "<short commit hash> <subject>"`.
  5. Print the live URL and the Firebase console release-history link.
- **Rationale**:
  - A single command covers FR-002.
  - Firebase versions are atomic: files upload first and the new version goes live in one switch. Every version is kept in the release history, where the console's "Roll back" restores a previous one in about a minute, which covers FR-008 and SC-005.
  - The commit message on each version makes the release history readable.
- **Alternatives considered**:
  - A `predeploy` hook in `firebase.json`. Rejected: it runs the build inside the CLI, where the clean-tree check and clear failure messages are harder to express.
  - A Node script. Rejected: the other scripts in `scripts/` that orchestrate commands (`start-local.sh`) are bash, and bash is enough here.

## R8. The 404 page (FR-005)

- **Decision**: Add `src/pages/404.astro`, which Astro builds to `dist/404.html`.
  - It uses the site layout, `h1` "Az oldal nem található" and a link to the home page.
  - It is marked `noindex`, and `sitemap.xml` doesn't list it.
- **Rationale**: Firebase serves `404.html` for unknown paths with status 404. The page uses the site's design, as the spec requires.
- **Alternatives considered**: Firebase's default English 404 page. Rejected: it's in English and doesn't use the site's design.

## R9. Verifying the live site (SC-002, SC-003, SC-004)

- **Decision**:
  - Add `pnpm verify:live`, which runs linkinator against `https://www.dembinszky18.hu/` with `--recurse --check-fragments` and skips external links, then runs Lighthouse CI with a second config, `lighthouserc.live.json`, that lists the four live URLs and uses the same assertions as `lighthouserc.json`.
  - Redirect checks are `curl -sI` calls documented in `quickstart.md`.
- **Rationale**: This reuses the pinned tools already in the repo, with no new dependency.
- **Alternatives considered**: an uptime or monitoring service. Rejected: out of scope, and it would add a third party.
