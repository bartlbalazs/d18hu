# Quickstart: validating the Épület feature

## Prerequisites

- Node and pnpm as in the README (`nvm use`, `corepack enable`, `pnpm install --frozen-lockfile`)
- Chrome or Chromium with `CHROME_PATH` set, for step 5 only

## 1. Unit tests and type check

```sh
pnpm test
pnpm check
```

Expected: everything passes, including the new source-cell cases in `parse.test.ts` ([contract](contracts/site-pages.md#unit-testsunitparsetestts-new)).

## 2. Build and site checks

```sh
pnpm build:draft
pnpm test:site
```

Expected:

- The build prints no missing editorial items for the new or renamed event ids.
- The site tests, html-validate and linkinator all pass. That covers every check in [contracts/site-pages.md](contracts/site-pages.md): menu order, 13 figures, 11 sources, fragment links, no stale "nem került elő" wording, and clean EXIF.

## 3. Read the page

```sh
scripts/start-local.sh --preview
```

Open `http://localhost:4321/epulet/` and check:

1. The Menü (narrow window) and the header (wide window) list Épület, Építők, Lakók, Névadó, Impresszum.
2. The page text matches `input/epulet.md` section by section ([data-model.md](data-model.md#page-sections-srcpagesepuletindexastro)).
3. Each document image sits at its place, opens in the zoom viewer, and is legible when zoomed. The photo of the approval clause (kép 1) is upright.
4. Source markers jump to the source list. The "1. kép"-style references in sources 2–4 and 6–8 jump back to the figures.
5. The background tones change at "A telek gazdát cserél", "A Spitz név megmarad" and "Helyreállítás…", and return to normal at "Az első tervtől a mai házig".
6. `/epitok/` ends with the new postscript linking to `/epulet/`.
7. On the home page at the Ház scope step, the seven new events and the four corrected ones read as in [data-model.md](data-model.md#timeline-rows-inputtimelinemd). Their "Épület" source links land on the right section.

## 4. Layout widths

At 320, 768, 900, 1000 and 1280 px:

- There is no sideways page scroll on `/epulet/`.
- The header row at ≥ 900 px does not wrap with five page links (research R9). If it wraps, raise the breakpoint and re-run steps 2–3.

## 5. Lighthouse

```sh
pnpm lighthouse
```

Expected: `/epulet/` meets Performance, Accessibility and Best Practices ≥ 95 and SEO = 100, and `/lakok/` and `/epitok/` still do.

## 6. Release check

```sh
pnpm build:release
```

Expected: it succeeds. That means no editorial item is missing.
