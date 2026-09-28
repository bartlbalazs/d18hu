# D18 — Dembinszky utca 18. history timeline

A static, Hungarian-language website telling the history of the condominium building at
Dembinszky utca 18., Budapest, from 1873 to 1968. It is one long narrative timeline: an opening
section, a legend, four full-height era openers and every event from the research file, plus
`/irasok/` (articles) and `/impresszum/` (legal notice).

The site is plain HTML generated at build time with [Astro](https://astro.build/). It works
without JavaScript; the only script is an optional zoomable image viewer
([PhotoSwipe](https://photoswipe.com/)). It was specified and built with
[GitHub Spec Kit](https://github.com/github/spec-kit): see `specs/001-d18-history-timeline/`.

## Requirements

- Node.js 22 LTS (`nvm use` reads `.nvmrc`)
- pnpm via Corepack (`corepack enable`; the version comes from `packageManager` in `package.json`)
- `uv`, only to regenerate fonts (`pnpm fonts:subset`)
- Chrome or Chromium, only for `pnpm lighthouse` (set `CHROME_PATH`)

## Quick start

```sh
scripts/start-local.sh             # dev server with live reload: http://localhost:4321
scripts/start-local.sh --preview   # production-like: builds dist/ (draft) and serves it
```

The script switches to the Node version in `.nvmrc` via nvm, runs the pinned pnpm through
Corepack, and installs dependencies when they are missing or the lockfile changed. Extra
arguments go to Astro, e.g. `scripts/start-local.sh --port 5000` or `--host` to open the site
from a phone on the same network. Stop it with Ctrl+C. A server still running from an earlier
start is stopped first, since Astro allows only one per project.

Manual equivalent:

```sh
nvm use
corepack enable
pnpm install --frozen-lockfile
pnpm dev                 # http://localhost:4321, draft mode
```

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Local development server (draft mode) |
| `pnpm build:draft` | Builds `dist/` even if editorial data is missing; prints the missing items, shows a draft banner and marks every page `noindex` |
| `pnpm build:release` | Builds the publishable site; **fails** while any editorial item is missing or `SITE_URL` is unset |
| `pnpm preview` | Serves the built `dist/` locally |
| `pnpm test` | Unit tests (timeline parser, ids, dates, editorial checks) |
| `pnpm test:site` | Run after a build: checks the output (event counts, local images, metadata), validates the HTML and checks internal links |
| `pnpm check` | Type check |
| `pnpm lighthouse` | Lighthouse mobile audit against the constitution's budgets (reports stay local in `.lighthouseci/`) |
| `pnpm images:fetch` | Downloads new or changed `Kép URL` images into `src/assets/archive/` (commit the result) |
| `pnpm images:check` | Reports whether the original archive image URLs still respond |
| `pnpm fonts:subset` | Regenerates the subset web fonts in `src/fonts/` (commit the result) |

Regular builds never touch the network: archive images and fonts are committed.

## Where the content lives

| File | Who edits it | What it holds |
|---|---|---|
| `input/timeline.md` | Historian | The research timeline: four era tables, one row per event. The build reads it and never changes it. Descriptions and dates are published word for word. |
| `editorial/events.yaml` | Owner | Per-event title, image caption/alt/credit/licence and verified document highlights, keyed by event id |
| `editorial/site.yaml` | Owner | Opening texts, era intros, building address, Impresszum, published articles |
| `assets/facade.png` | Owner | Present-day facade photo used at the top of the page |

Event ids are derived from each row's date and first four words (e.g.
`1903-dec-27-maulner-adolf-es-tarsai`), so adding or reordering rows never breaks them. If you
edit a row's date or opening words, the build stops and lists the editorial entries to re-key.

### Before the first release

Run `pnpm build:draft` to see the current list. At the time of writing it contains:

1. **Review the 108 AI-drafted event titles** in `editorial/events.yaml`; delete each
   `titleNeedsReview: true` line once a title is approved.
2. **Image credits and licences**: check each archive record (Fortepan asks for the donor's
   name) and fill `credit` and `license`; add the facade photo credit in `editorial/site.yaml`.
3. **Document highlight**: check the 1903 Maulner advertisement transcription against the
   original, then set `verified: true` (unverified highlights are never shown).
4. **Impresszum**: operator, author, contact e-mail and copyright notice (real data only).
5. **Building postal code** (and optionally geo coordinates) in `editorial/site.yaml`.
6. **Final address**: build with `SITE_URL=https://… pnpm build:release`.

## Project layout

```text
input/timeline.md        research source (read-only for the build)
editorial/               owner-maintained YAML (titles, captions, credits, site texts)
assets/facade.png        hero photo
scripts/                 image download/check and font subsetting
src/lib/                 pure logic: parser, ids, dates, editorial checks, SEO helpers
src/components/          Astro components (header, hero, legend, era opener, event, figure)
src/pages/               /, /irasok/, /impresszum/, sitemap, robots, manifest, icons
src/assets/archive/      downloaded archive images + manifest.json (committed)
src/fonts/               subset WOFF2 fonts + licences (committed)
tests/unit/, tests/site/ Vitest suites
specs/                   Spec Kit feature spec, plan, research, data model, contracts
.specify/, .claude/      Spec Kit configuration and commands
```

## Principles and supply chain

The project constitution (`.specify/memory/constitution.md`) requires static HTML, a strict
mobile performance budget, a mobile-first layout, no bloat and rich metadata for search engines.

All dependencies are pinned to exact versions with a committed `pnpm-lock.yaml`. pnpm refuses
packages published less than 7 days ago (`minimumReleaseAge` in `pnpm-workspace.yaml`), and
Dependabot uses the same 7-day cooldown (`.github/dependabot.yml`). The fonttools version used
for font subsetting is pinned in `scripts/subset-fonts.sh`.

## Spec Kit workflow

New features follow the same steps in Claude Code: `/speckit-specify` → `/speckit-clarify` →
`/speckit-plan` → `/speckit-tasks` → `/speckit-implement`. Spec Kit was initialised with
`specify-cli` v1.0.8 (commit `0cc9a6a1159471a3108b9bad718ba17006dd6039`).
