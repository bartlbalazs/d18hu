---

description: "Task list for publishing the site on Firebase Hosting"
---

# Tasks: Publishing the site on Firebase Hosting

**Input**: Design documents from `/specs/003-firebase-publishing/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/hosting.md](contracts/hosting.md), [quickstart.md](quickstart.md)

**Tests**: The plan asks for one site test, for `dist/404.html`. Everything else is checked against the live site with `pnpm verify:live` and the curl checks in quickstart.md.

**Organization**: tasks are grouped by user story, so each story can be built and checked on its own.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on an unfinished task).
- **[Story]**: the user story the task belongs to (US1, US2, US3).

Run every command as `source ~/.nvm/nvm.sh && nvm use && corepack pnpm …` from the repository root.

---

## Phase 1: Setup

**Purpose**: add the pinned Firebase CLI and the files it expects.

- [X] T001 Add `firebase-tools` as an exact-pinned devDependency with `corepack pnpm add -D --save-exact firebase-tools@15.30.2`, which updates `package.json` and `pnpm-lock.yaml` (R1).
  - First confirm with `corepack pnpm view firebase-tools time --json` that 15.30.2 is still the newest release at least 7 days old. If a newer one qualifies, use that and update the version in plan.md and research.md R1.
  - Never lower or bypass `minimumReleaseAge` in `pnpm-workspace.yaml`.
  - If pnpm reports ignored build scripts, don't approve them; the CLI works without them.
- [X] T002 [P] Add `.firebase/` (the CLI's deploy cache) under "Build output and tooling" in `.gitignore`.
- [X] T003 [P] Create `.firebaserc` with `{"projects": {"default": "dembinszky18"}}` (R6, data model "Hosting project").

---

## Phase 2: Foundational

**Purpose**: let a page opt out of indexing. The 404 page (US2) needs this, and the draft guard (US1) has to tell it apart from draft output.

- [X] T004 Add an optional `noindex?: boolean` prop to `src/layouts/Base.astro` and pass it to `SeoHead`.
- [X] T005 In `src/components/SeoHead.astro`, add a `noindex?: boolean` prop.
  - Output `<meta name="robots" content="noindex, nofollow" />` when `isDraft || noindex`.
  - When `noindex` is set, leave out `<link rel="canonical">` and `og:url`. The contract says the 404 page "has no canonical link to itself".
  - Pages without the prop must render exactly as before.

**Checkpoint**: `pnpm check` passes, and `pnpm build:release` output for the four pages is unchanged.

---

## Phase 3: User Story 1 - The owner publishes the finished site (Priority: P1) 🎯 MVP

**Goal**: one command, `pnpm site:publish`, that checks everything and deploys the release build to the owner's Firebase project.

**Independent test**:
- Run `pnpm site:publish` from a clean tree. The site then answers at `https://dembinszky18.web.app/` with all 4 pages, images, fonts, sitemap and robots.txt.
- The three negative checks in quickstart.md each stop before deploying.

- [X] T006 [US1] Create `firebase.json` with `{"hosting": {"public": "dist", "trailingSlash": true, "ignore": ["**/.*"]}}` (R2).
  - No `rewrites`, no `redirects`, no `cleanUrls`.
  - Headers are added in US2 and US3.
- [X] T007 [US1] Create `scripts/publish.sh`, executable, with `set -euo pipefail`, in the style of `scripts/start-local.sh` (R7, contract "`pnpm site:publish`").
  - Define `PROJECT` as `default` from `.firebaserc`, read with `node -e`, and `ACCOUNT=bartlbalazs@gmail.com`.
  - Step 1: if `git status --porcelain` prints anything, exit 1 with `uncommitted changes`.
  - Step 2: run `pnpm check`, `pnpm test`, `pnpm build:release` and `pnpm test:site`. If any fails, exit 1 with `release checks failed`.
  - Step 3: the draft guard.
    - Exit 1 with `draft output in dist/` if any `dist/**/*.html` contains `draft-banner`.
    - Also exit 1 if any HTML file other than `dist/404.html` contains `name="robots" content="noindex`.
  - Step 4: check the account.
    - If `pnpm exec firebase login:list` doesn't list `$ACCOUNT`, exit 1 with `not logged in as bartlbalazs@gmail.com`.
    - Also print the hint `run: pnpm exec firebase login`.
  - Step 5: run `pnpm exec firebase deploy --only hosting --project "$PROJECT" --account "$ACCOUNT" --non-interactive -m "$(git log -1 --format='%h %s')"`.
  - Step 6: print `https://www.dembinszky18.hu/`, `https://$PROJECT.web.app/` and `https://console.firebase.google.com/project/$PROJECT/hosting/sites`.
- [X] T008 [US1] Add `"site:publish": "bash scripts/publish.sh"` to `scripts` in `package.json`.
- [ ] T009 [US1] Manual, by the owner: create the Firebase project in the console as bartlbalazs@gmail.com (quickstart steps 1–3).
  - Use `dembinszky18`, or `dembinszky18-hu` if that ID is taken.
  - If the ID differs, update `.firebaserc`.
- [ ] T010 [US1] Manual, by the owner: run `pnpm exec firebase login`, then `pnpm site:publish` (quickstart steps 4–5). Check the three negative cases in quickstart.md "Negative checks".

**Checkpoint**: the site is live at `https://<project-id>.web.app/`, and each release shows `<hash> <subject>` in the console's release history.

---

## Phase 4: User Story 2 - Visitors reach the site at its own address (Priority: P1)

**Goal**: `https://www.dembinszky18.hu/` serves the site with a valid certificate, other addresses redirect to it, unknown paths get a Hungarian 404, and security headers are sent.

**Independent test**: all `curl` checks in quickstart.md "Redirect and header checks" give the expected result (SC-004).

- [X] T011 [P] [US2] Create `src/pages/404.astro` (R8, contract "`404.html`").
  - Use `Base` with:
    - `title="Az oldal nem található – Dembinszky utca 18."` (≤ 60 characters)
    - a 50–160 character Hungarian `description`
    - `path="/404.html"`
    - `noindex`
    - `jsonLd={[websiteNode(siteUrl, site)]}`
  - The body has exactly one `<h1>Az oldal nem található</h1>`, a short sentence, and a link `<a href="/">` to the home page.
  - Don't add it to the `paths` list in `src/pages/sitemap.xml.ts`.
- [X] T012 [P] [US2] Add a `describe('404 page')` block to `tests/site/output.test.ts`. It asserts that `dist/404.html`:
  - has one `h1` containing "Az oldal nem található"
  - contains `href="/"`
  - contains `name="robots" content="noindex`
  - has no `rel="canonical"`
  - isn't listed in `sitemap.xml`

  Keep `PAGES` unchanged: the 404 page is deliberately not a full-metadata page.
- [X] T013 [US2] Add the security header group to `firebase.json` under `hosting.headers` (R4, contract "Response headers"). Use `{"source": "**", "headers": [...]}` with `Strict-Transport-Security: max-age=31536000; includeSubDomains`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin` and `Permissions-Policy: camera=(), microphone=(), geolocation=()`. No `preload`.
- [ ] T014 [US2] Manual, by the owner: in the Firebase console, go to Hosting → Add custom domain (R5, quickstart steps 6–7).
  - Add `www.dembinszky18.hu`.
  - Add `dembinszky18.hu` with "Redirect to www.dembinszky18.hu".
  - Enter the records the console shows at the registrar, and wait for "Connected".
- [X] T015 [US2] Record the exact DNS records from T014 (the TXT ownership record plus the A/CNAME records per host) in the README's Publishing section, in `README.md`. Until the owner provides them, leave the table rows as clearly marked TODOs so they aren't forgotten (FR-012).

**Checkpoint**: the redirects answer 301, unknown paths answer 404 with the Hungarian page, and the security headers are present.

---

## Phase 5: User Story 3 - The published site stays fast (Priority: P2)

**Goal**: long caching for hashed assets, fresh HTML, and a repeatable Lighthouse check of the live pages.

**Independent test**: `pnpm verify:live` exits 0. `curl -sI` on an `/_astro/…` file shows `public, max-age=31536000, immutable`, and on `/` shows `no-cache`.

- [X] T016 [US3] Add the caching header groups to `firebase.json` after the security group (R3, contract "Caching").
  - `{"source": "/_astro/**", …}` sets `Cache-Control: public, max-age=31536000, immutable`.
  - `{"source": "**/*.@(html|xml|txt|webmanifest|svg)", …}` sets `Cache-Control: no-cache`.
  - `{"source": "/@(apple-touch-icon|icon-192|icon-512).png", …}` sets `Cache-Control: no-cache`.
  - Directory URLs such as `/epitok/` serve `index.html`, so check that the HTML rule matches them. If it doesn't, add `{"source": "**/", …}` with `no-cache`.
- [X] T017 [P] [US3] Create `lighthouserc.live.json` (R9) from `lighthouserc.json`, with these differences:
  - No `staticDistDir`.
  - `url` lists `https://www.dembinszky18.hu/`, `…/epitok/`, `…/nevado/` and `…/impresszum/`.
  - No `skipAudits` for `is-crawlable`: the live site must be crawlable.
  - The `assert` and `upload` blocks stay identical.
- [X] T018 [US3] Add `"verify:live"` to `scripts` in `package.json`: `linkinator https://www.dembinszky18.hu/ --recurse --check-fragments --skip \"^(?!https://www\\.dembinszky18\\.hu/)\" && lhci autorun --config=lighthouserc.live.json`.
  - This runs against production, so it is not part of `test:site`.
- [ ] T019 [US3] Manual: after publishing, run `pnpm verify:live` and the header `curl` checks in quickstart.md. Record any threshold miss as a follow-up rather than lowering an assertion.

**Checkpoint**: every principle II threshold is met on the live pages (SC-003), and there are 0 broken links (SC-002).

---

## Phase 6: Polish & cross-cutting concerns

- [X] T020 Update `README.md` (FR-011):
  - Add `pnpm site:publish` and `pnpm verify:live` rows to the Commands table.
  - Extend the "Publishing" section with:
    - the one-time setup (personal account, project, `firebase login`, custom domains, DNS records table from T015)
    - routine publishing
    - rollback through Hosting → Release history → Roll back
  - Add `firebase.json`, `.firebaserc`, `lighthouserc.live.json`, `scripts/publish.sh` and `src/pages/404.astro` to "Project layout".
  - Mention `specs/003-firebase-publishing/` next to the other specs.
- [X] T021 Run `pnpm check`, `pnpm test`, `pnpm build:release` and `pnpm test:site`. Confirm that all pass, and that `dist/404.html` exists and isn't in `dist/sitemap.xml`.
- [X] T022 Run `pnpm build:draft`, then the draft guard from `scripts/publish.sh` against that output. Confirm that it refuses, then rebuild with `pnpm build:release`.

---

## Dependencies & execution order

- **Setup (T001–T003)**: no dependencies. T002 and T003 can run alongside T001.
- **Foundational (T004–T005)**: T005 depends on T004's prop. Blocks T011 and the draft-guard rule in T007.
- **US1 (T006–T010)**: after Setup and Foundational. T009 and T010 are the owner's manual steps and need T006–T008.
- **US2 (T011–T015)**: T011 and T012 need only Foundational. T013 edits `firebase.json` after T006. T014 needs a first deploy (T010). T015 needs T014's records.
- **US3 (T016–T019)**: T016 edits `firebase.json` after T013. T017 is independent. T018 follows T008 in `package.json`. T019 needs a live site.
- **Polish (T020–T022)**: after the stories. T020 takes the DNS records from T015 when they're available.

`firebase.json` (T006 → T013 → T016) and `package.json` (T001 → T008 → T018) are shared files, so the tasks that edit them run in sequence.

## Parallel examples

```text
Setup:   T002 (.gitignore)  |  T003 (.firebaserc)       alongside T001
US2:     T011 (404.astro)   |  T012 (site test)
US3:     T017 (lighthouserc.live.json)   alongside T016
```

## Implementation strategy

1. **MVP (US1)**: Setup, Foundational, then T006–T010. The site is live on `<project-id>.web.app` and publishing is safe and repeatable.
2. **US2**: add the 404 page and security headers, redeploy with `pnpm site:publish`, then connect the domains. Certificates can take up to 24 hours, so start T014 early.
3. **US3**: add the caching headers and live verification, redeploy, and run `pnpm verify:live`.
4. **Polish**: finish the README, including the DNS records, and run the full local checks.

The code tasks (T001–T008, T011–T013, T015–T018, T020–T022) can all be done before any manual step. The owner then does T009, T010, T014 and T019 in one sitting.
