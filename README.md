# D18 — Dembinszky utca 18. history timeline

A static, Hungarian-language website telling the history of the condominium building at
Dembinszky utca 18., Budapest, from 1873 to 1968. It is one long narrative timeline: an opening
section, a legend, four full-height era openers and every event from the research file, plus
three story pages, `/epitok/` (the builders), `/lakok/` (the residents) and `/nevado/` (the
street's namesake), and `/impresszum/` (legal notice).

**Live site: <https://www.dembinszky18.hu/>**, deployed on
[Firebase Hosting](https://firebase.google.com/docs/hosting) (see [Publishing](#publishing)).

The site is plain HTML generated at build time with [Astro](https://astro.build/). It works
without JavaScript. Optional scripts add a zoomable image viewer
([PhotoSwipe](https://photoswipe.com/)), a small menu script that closes the Menü panel and
marks the era being read, a timeline scope slider, and consent-gated visitor statistics (see
[Statistics](#statistics-google-analytics)). It was specified and built with
[GitHub Spec Kit](https://github.com/github/spec-kit): see `specs/001-d18-history-timeline/`,
`specs/002-epitok-nevado-pages/`, `specs/003-firebase-publishing/`, `specs/004-mobile-navigation/`,
`specs/005-google-analytics/`, `specs/006-timeline-closing/`, `specs/007-lakok-page/`,
`specs/009-lakok-source-images/` and `specs/010-timeline-scope-slider/`.

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
| `pnpm build:release` | Builds the publishable site; **fails** while any editorial item is missing |
| `pnpm preview` | Serves the built `dist/` locally |
| `pnpm test` | Unit tests (timeline parser, ids, dates, timeline scope, editorial checks) |
| `pnpm test:site` | Run after a build: checks the output (event counts, local images, metadata), validates the HTML and checks internal links |
| `pnpm check` | Type check |
| `pnpm lighthouse` | Lighthouse mobile audit against the constitution's budgets (reports stay local in `.lighthouseci/`) |
| `pnpm site:publish` | Checks everything, builds the release and deploys it to Firebase Hosting (see [Publishing](#publishing)) |
| `pnpm verify:live` | Link check and Lighthouse audit against the live site |
| `pnpm images:fetch` | Downloads new or changed `Kép URL` images (or copies local ones from `assets/`) into `src/assets/archive/` (commit the result) |
| `pnpm images:check` | Reports whether the original archive image URLs still respond |
| `pnpm fonts:subset` | Regenerates the subset web fonts in `src/fonts/` (commit the result) |

Regular builds never touch the network: archive images and fonts are committed.

## Editing the content

The timeline content lives in four places, and you never need to touch the code to change it.
The three story pages are the exception (see [Story pages](#story-pages)).

| File | What it holds |
|---|---|
| `input/timeline.md` | The research timeline: four era tables, one row per event. Dates and descriptions are published word for word. |
| `editorial/events.yaml` | Per-event extras, keyed by event id: title, image caption/alt/credit/licence, document highlight |
| `editorial/site.yaml` | Opening texts, era intros and headings, building address, Impresszum, Google Analytics measurement ID |
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
   - Descriptions may use `**bold**`, `*italic*`, `[links](https://…)` and `<br>` to start a new line
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
used for search engines (`building`) and the Impresszum, including the hosting provider
(`hostingProvider`, `hostingAddress`, `hostingContactUrl`), which Hungarian law requires there. Empty strings count as missing; never
fill the Impresszum with placeholder data. To replace the facade photo, overwrite
`assets/facade4.png` and update `hero.photo` (alt, caption, credit, source link). The Építők
opening photo (`assets/facade5.png`) shows the same credit. The Lakók opening photo
(`assets/facade6.png`, another Globetrotter19 photo) has its caption and credit in
`src/pages/lakok/index.astro`.

### Story pages

`/epitok/`, `/lakok/` and `/nevado/` are written by hand in `src/pages/epitok/index.astro`,
`src/pages/lakok/index.astro` and `src/pages/nevado/index.astro`, so each can have its own layout
(opening image, pull quotes, record excerpts, numbered sources). Their first versions were
transcribed from the drafts in `input/epitok.md`, `input/lakok.md` and `input/nevado.md`; the
build never reads those drafts, so edit the `.astro` files to change a story page. Story page
images are committed in `src/assets/pages/`: the Névadó portrait, and the Lakók source images in
`src/assets/pages/lakok/`. The Lakók images' captions, alt texts, credits, source links and
display widths are in `src/lib/lakok/figures.ts`.

Lakók sets each period in a band with its home-timeline era colour, and the 1944–1945 section
in the dark era tone. Its three name lists are collapsible `<details>` blocks, closed on load;
`src/scripts/print-details.ts` opens them while the page is printed. It ends with a note
offering correction or removal, linked to the impresszum contact address.

### Layout and design

The look is code, not content: components in `src/components/`, styles in `src/styles/`
(colours and fonts in `tokens.css`).

The top menu (`src/components/SiteHeader.astro`) is one row from 900 px wide. On narrower
screens the header shows a **Menü** button that opens the same links as a panel, grouped as
"Korszakok" and "Oldalak". It is a native HTML popover, so it works without JavaScript.
`src/scripts/site-menu.ts` closes the panel after a link is chosen and, on the home page,
marks the era being read with a dot. The era is picked by `src/lib/nav/current-era.ts`.

The home page timeline has a slider, „Milyen messzire nézzünk a háztól?”, with four cumulative
steps: Ház, Környék, Magyarország and Világ. Each step also shows the narrower ones, and the page
opens at Környék. From 1100 px wide it is a panel beside a narrower timeline, hidden over the
chapter openers. Below 1100 px it opens from a round button in the lower right corner. A link to
a hidden event widens the view to show it. Without JavaScript every event shows and there is no
slider. The setting is remembered (`localStorage` key `d18-idovonal`) only after the visitor
accepts the statistics notice, and it is deleted when they withdraw. The logic is in
`src/lib/timeline/scope.ts`, the markup and the no-flash inline script in
`src/components/ScopeSlider.astro`, and the behaviour in `src/scripts/timeline-scope.ts`. The
Jelmagyarázat ends with a description of it, edited in `src/components/Legend.astro`.

After the last event, the timeline's axis stops and a short centred line and „A történet
folytatódik” close the page, inviting residents to write. Its text is edited in
`src/components/TimelineClosing.astro`.

### Publishing

`pnpm build:release` builds the site for `https://www.dembinszky18.hu/`; set `SITE_URL` to build
for another address, such as a staging copy. It refuses to run while any editorial item is
missing: new events or images show up in the `pnpm build:draft` list until their title is
reviewed and their alt text, caption, credit and licence are filled in.

Document highlights (the 1903 Mautner advertisement, the 1904 Tarcsai clipping) stay hidden
until their transcription is checked against the original and set to `verified: true`.

The site is hosted on Firebase Hosting, in the project named in `.firebaserc` and owned by the
owner's personal Google account (never a work account). `firebase.json` holds the hosting
settings: trailing-slash redirects, the `404.html` page, caching and security headers.
The Firebase CLI is a pinned devDependency, so always run it as `pnpm exec firebase`.

#### One-time setup

Creating the Firebase project and connecting the domain is described in
[docs/domain-setup.md](docs/domain-setup.md).

#### Routine publishing

```sh
pnpm site:publish   # commit first: refuses uncommitted changes
pnpm verify:live    # afterwards: live link check and Lighthouse
```

`site:publish` runs `check`, `test`, `build:release` and `test:site`, refuses draft output, and
deploys only when all of them pass and the CLI is logged in as the owner account set in
`scripts/publish.sh`. Each release is labelled with its commit.

#### Rollback

In the console, go to Hosting → Release history, open the previous release's ⋮ menu and
choose **Roll back**. It takes about a minute.

### Statistics (Google Analytics)

Visitor statistics go to a Google Analytics 4 property, and only for visitors who accept the
notice at the bottom of the page ("Elfogadom"). Before a choice, after "Nem kérem", with a
browser Do Not Track / Global Privacy Control signal, or without JavaScript, nothing is loaded
from Google and no cookie is set. "Statisztika beállításai" in the footer changes the choice; the
Impresszum explains the data processing (Adatkezelés). Accepting also lets the home page remember
the timeline slider setting in the browser; withdrawing deletes it.

Page views are counted, plus three events: `archive_source_click` (any external link in the page
content), `image_zoom` (a photo opened in the viewer) and `era_select` (an era chosen in the
menu). The code is `src/scripts/statistics.ts`, with the pure logic in `src/lib/statistics/`.

**Turning it on or off.** Set `analytics.measurementId` in `editorial/site.yaml` to the
property's measurement ID (`G-…`), or leave it empty to build without any analytics. The ID is
public by design (it is in every published page), so committing it is fine; there are no API keys
or other secrets. Draft builds and `pnpm dev` never include analytics, and the script only runs
on the site's own hostname (`www.dembinszky18.hu`), not on `dembinszky18.web.app` or local
previews.

**One-time setup**, with the owner's personal Google account:

1. At <https://analytics.google.com/>, create a property (time zone Hungary) with a Web data
   stream for `https://www.dembinszky18.hu`, and copy its measurement ID.
2. In the data stream, turn **Enhanced measurement** off, so only page views and the three
   events above are collected.
3. Admin → Data collection and modification → **Data retention**: 2 months. **Data collection**:
   Google signals off, granular location and device data off.
4. Admin → Account settings: turn all **data sharing** settings off.
5. Admin → Custom definitions: add event-scoped dimensions `source_url`, `timeline_event`,
   `image_name` and `era`, to see the event details in reports (Real-time shows them anyway).
6. Put the ID in `editorial/site.yaml`, commit, and run `pnpm site:publish`. Accept the notice on
   the live site and check that the visit shows up under Reports → Real-time.

## Project layout

```text
input/timeline.md        research source (read-only for the build)
input/epitok.md, lakok.md, nevado.md  drafts the story pages were transcribed from (not read by the build)
editorial/               owner-maintained YAML (titles, captions, credits, site texts)
assets/facade4.png       hero photo
scripts/                 image download/check, font subsetting, local start, publishing
src/lib/                 pure logic: parser, ids, dates, timeline scope, editorial checks, SEO helpers, statistics
src/lib/lakok/figures.ts captions, credits and sizes of the Lakók source images
src/scripts/             browser scripts: image viewer, menu, timeline scope slider, consent and statistics, print helper
src/components/          Astro components (header, hero, legend, scope slider, era opener, event, figure)
src/pages/               /, /epitok/, /lakok/, /nevado/, /impresszum/, 404, sitemap, robots, manifest, icons
src/assets/archive/      downloaded archive images + manifest.json (committed)
src/assets/pages/        story page images (committed); lakok/ holds the Lakók source images
src/fonts/               subset WOFF2 fonts + licences (committed)
tests/unit/, tests/site/ Vitest suites
specs/                   Spec Kit feature spec, plan, research, data model, contracts
.specify/, .claude/      Spec Kit configuration and commands
firebase.json, .firebaserc  Firebase Hosting settings and project
lighthouserc*.json       Lighthouse budgets for the local build and the live site
docs/                    one-time setup guides (domain and hosting)
```

## Principles and supply chain

The project constitution (`.specify/memory/constitution.md`) requires static HTML, a strict
mobile performance budget, a mobile-first layout, no bloat and rich metadata for search engines.
Its only runtime third-party exception is one analytics service that loads after consent.

All dependencies are pinned to exact versions with a committed `pnpm-lock.yaml`. pnpm refuses
packages published less than 7 days ago (`minimumReleaseAge` in `pnpm-workspace.yaml`), and
Dependabot uses the same 7-day cooldown (`.github/dependabot.yml`). The fonttools version used
for font subsetting is pinned in `scripts/subset-fonts.sh`.

## Spec Kit workflow

New features follow the same steps in Claude Code: `/speckit-specify` → `/speckit-clarify` →
`/speckit-plan` → `/speckit-tasks` → `/speckit-implement`. Spec Kit was initialised with
`specify-cli` v1.0.8 (commit `0cc9a6a1159471a3108b9bad718ba17006dd6039`).
