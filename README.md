# D18 — Dembinszky utca 18. history timeline

A static, Hungarian-language website telling the history of the condominium building at
Dembinszky utca 18., Budapest, from 1873 to 1968. It is one long narrative timeline: an opening
section, a legend, four full-height era openers and every event from the research file, plus
two story pages, `/epitok/` (the builders) and `/nevado/` (the street's namesake), and
`/impresszum/` (legal notice).

The site is plain HTML generated at build time with [Astro](https://astro.build/). It works
without JavaScript; the only script is an optional zoomable image viewer
([PhotoSwipe](https://photoswipe.com/)). It was specified and built with
[GitHub Spec Kit](https://github.com/github/spec-kit): see `specs/001-d18-history-timeline/` and
`specs/002-epitok-nevado-pages/`.

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
| `pnpm images:fetch` | Downloads new or changed `Kép URL` images (or copies local ones from `assets/`) into `src/assets/archive/` (commit the result) |
| `pnpm images:check` | Reports whether the original archive image URLs still respond |
| `pnpm fonts:subset` | Regenerates the subset web fonts in `src/fonts/` (commit the result) |

Regular builds never touch the network: archive images and fonts are committed.

## Editing the content

The timeline content lives in four places, and you never need to touch the code to change it.
The two story pages are the exception (see [Story pages](#story-pages)).

| File | What it holds |
|---|---|
| `input/timeline.md` | The research timeline: four era tables, one row per event. Dates and descriptions are published word for word. |
| `editorial/events.yaml` | Per-event extras, keyed by event id: title, image caption/alt/credit/licence, document highlight |
| `editorial/site.yaml` | Opening texts, era intros and headings, building address, Impresszum |
| `assets/facade4.png` | Present-day facade photo at the top of the page |

Workflow: run `scripts/start-local.sh`, edit a file, reload the browser (restart the script if a
change does not show up). To rebuild the static site in `dist/`, run `pnpm build:draft`, then
`pnpm test:site` to check it; `scripts/start-local.sh --preview` does the build and serves it.
The build stops with a clear message if something is malformed, and prints the missing items.

### Add or change an event

1. Add a row to the right era table in `input/timeline.md`, in date order. Every row needs all
   seven columns; write `—` for an empty cell:

   ```markdown
   | 1912. máj. 3. | D18 | Mi történt, és miért fontos. | Valószínű | [Forrás neve](https://…) | — | Cikkötlet |
   ```

   - **Sáv** (lane): `D18`, `D18 • személy`, `Környék`, `Magyarország` or `Világ`
   - **Bizonyosság** (certainty): `Igazolt`, `Valószínű`, `Feltételezés`, or `—` for background events
   - Descriptions may use `**bold**`, `*italic*` and `[links](https://…)`
   - Everything after the fourth era (e.g. "Nyitott kérdések…") is never published
2. Run `pnpm build:draft`. The new event appears in the missing-items list with its id (the date
   plus the first four words, e.g. `1912-maj-3-mi-tortent-es-miert`).
3. Give it a title in `editorial/events.yaml` under that id:

   ```yaml
   1912-maj-3-mi-tortent-es-miert:
     title: Rövid, beszédes cím
   ```

Changing a row's date or first four words changes its id: the build then stops and names the
`events.yaml` entry to rename. Editing the rest of the description is safe.

### Add an image to an event

1. In the row's **Kép URL** column, put either
   - the direct image-file URL (not the archive page), or
   - a local file (JPEG, PNG or WebP) you copied into `assets/`, e.g. `assets/events/kapu-1903.jpg`
     (path from the repository root; use a name without spaces).
2. Run `pnpm images:fetch`. It downloads or copies the image into `src/assets/archive/`; commit
   the result (and the file in `assets/`). Run it again after replacing a local file.
3. Describe it in `editorial/events.yaml`:

   ```yaml
   1912-maj-3-mi-tortent-es-miert:
     title: Rövid, beszédes cím
     image:
       alt: What the picture shows, for screen readers
       caption: The caption shown under the image
       credit: Fortepan / donor name
       license: CC BY-SA 3.0
       sourceUrl: https://fortepan.hu/hu/photos/?id=…   # optional for your own photos
       sourceLabel: Fortepan …
       depictsHouse: false   # true only if it provably shows no. 18
       kind: photo           # or: document
   ```

### Add a document highlight

A short quoted line from a source, shown as a card under the event. It stays hidden until you
have checked it against the original and set `verified: true`:

```yaml
  highlight:
    kind: transcription   # or: excerpt
    label: Korabeli hirdetés · Eperjesi Lapok, 1903
    text: Budapest, VII., Dembinszky-utca 18.
    verified: true
```

### Site texts

`editorial/site.yaml` holds the opening section (`hero`), the text on each era opener (`eras`:
`intro`, `eventsHeading`, and `backgroundYear`, the large number in the background), the address
used for search engines (`building`) and the Impresszum. Empty strings count as missing; never
fill the Impresszum with placeholder data. To replace the facade photo, overwrite
`assets/facade4.png` and update `hero.photo` (alt, caption, credit).

### Story pages

`/epitok/` and `/nevado/` are written by hand in `src/pages/epitok/index.astro` and
`src/pages/nevado/index.astro`, so each can have its own layout (opening image, pull quotes,
record excerpts, numbered sources). Their first versions were transcribed from the drafts in
`input/epitok.md` and `input/nevado.md`; the build never reads those drafts, so edit the
`.astro` files to change a story page. The Névadó portrait is committed in `src/assets/pages/`.

### Layout and design

The look is code, not content: components in `src/components/`, styles in `src/styles/`
(colours and fonts in `tokens.css`).

### Before the first release

Run `pnpm build:draft` to see the current list. At the time of writing it contains:

1. **Review the 108 AI-drafted event titles** in `editorial/events.yaml`; delete each
   `titleNeedsReview: true` line once a title is approved.
2. **Image credits and licences**: check each archive record (Fortepan asks for the donor's
   name) and fill `credit` and `license`; add the facade photo credit in `editorial/site.yaml`.
3. **Document highlight**: check the 1903 Maulner advertisement transcription against the
   original, then set `verified: true` (unverified highlights are never shown).
4. **Final address**: build with `SITE_URL=https://… pnpm build:release`.

## Project layout

```text
input/timeline.md        research source (read-only for the build)
input/epitok.md, nevado.md  drafts the story pages were transcribed from (not read by the build)
editorial/               owner-maintained YAML (titles, captions, credits, site texts)
assets/facade4.png       hero photo
scripts/                 image download/check and font subsetting
src/lib/                 pure logic: parser, ids, dates, editorial checks, SEO helpers
src/components/          Astro components (header, hero, legend, era opener, event, figure)
src/pages/               /, /epitok/, /nevado/, /impresszum/, sitemap, robots, manifest, icons
src/assets/archive/      downloaded archive images + manifest.json (committed)
src/assets/pages/        story page images (committed)
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
