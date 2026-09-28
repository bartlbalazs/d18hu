# Quickstart & Validation: Dembinszky utca 18. History Timeline

Proves the feature end-to-end. Commands are defined in [contracts/build-cli.md](contracts/build-cli.md).

## Prerequisites

- Node 22 LTS: `nvm use` (reads `.nvmrc`)
- pnpm via Corepack: `corepack enable` (version from `packageManager`)
- `uv` (only for `pnpm fonts:subset`)
- Chrome/Chromium (only for `pnpm lighthouse`)

## Setup

```sh
nvm use
corepack enable
pnpm install --frozen-lockfile
pnpm images:fetch        # only needed when a Kép URL was added/changed; images are committed
```

## Scenario 1 — Data integrity (US1, SC-001)

```sh
pnpm test
```

Expected: the parser yields **108** events. The per-era split and source order match
`input/timeline.md`. Lanes are D18 21, D18 • személy 12, Környék 14, Magyarország 28, Világ 33,
giving categories house 33, area 14, hungary 28, world 33. Certainty is 17 verified, 29
probable, 1 hypothesis and 61 none. All ids are unique. Deliberately broken fixtures (6-cell
separator, unknown lane, duplicate id, orphaned editorial key) each fail with the documented
error.

## Scenario 2 — Draft build and the missing-item report (FR-039, SC-010)

```sh
pnpm build:draft
pnpm build:release       # expected to FAIL until editorial data is complete
```

- **Draft:** the build succeeds and prints the missing-item report. Every page has the draft
  banner and `noindex`, and `dist/robots.txt` contains `Disallow: /`.
- **Release:** the build exits 1 with the same list. With all items filled and `SITE_URL`
  set, it succeeds without the banner or `noindex`.

## Scenario 3 — Output checks (SC-003, SC-004, SC-008)

```sh
pnpm build:draft && pnpm test:site
```

- **Counts:** 108 `[data-event-id]` elements, and 47 `.confidence` marks (17 + 29 + 1).
- **Images:** 5 event figures, plus the hero, with visible `figcaption`. No `img` or `a[data-pswp-width]` points
  off-site.
- **Nothing that shouldn't be there:** no links to non-existent pages or internal research
  PDFs, and no empty source or certainty elements.
- **Validation:** html-validate reports 0 errors. JSON-LD blocks parse, and each has `@type`
  among `WebSite`, `BreadcrumbList`, `ApartmentComplex`, `ItemList`, `Event` and
  `ImageObject`.

## Scenario 4 — Navigation without JavaScript (US2, SC-002)

1. Run `pnpm preview` and open the site with JavaScript disabled.
2. At 320 px width, open the `<details>` menu. All 4 eras, Írások and Impresszum should be
   listed.
3. Tab through the menu with the keyboard. Each link should show a visible focus ring and jump
   to its era opener. "Tovább az eseményekhez" should jump to that era's first event.
4. Scroll down. The header should scroll away and never overlay the content.

## Scenario 5 — Images and viewer (US3)

1. With JavaScript on, activate the 1963 Fortepan image. The viewer should open fit to the
   screen, with no prev/next controls. Escape should close it, and focus should return to the
   same event.
2. On a touch device (or in emulation), pinch-zoom should work.
3. With JavaScript off, activating the image should open the local full-size file.
4. Events with `Kép URL = —` should have no figure.

## Scenario 6 — Legend and icons (US4)

The legend explains four categories and three certainty levels, including the rule that
certainty applies to a specific claim, as visible text. The Hungary icon is a monochrome flag
outline. The "Dénes Mari" event shows its date label with "vagy".

## Scenario 7 — Responsive layout and performance (SC-005, SC-006)

```sh
pnpm lighthouse
```

- **Lighthouse (mobile):** Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95 and
  SEO = 100. LCP ≤ 2.0 s, CLS ≤ 0.05, TBT ≤ 100 ms. Initial page weight ≤ 500 KB, and fonts
  ≤ 150 KB.
- **Manual check at 320, 360, 768 and 1280 px, and at 200% text zoom:** no horizontal
  scrolling, no clipped text, and the date appears above the content on mobile.

## Scenario 8 — Offline rebuild (Clarification Q3)

Disconnect the network and run `pnpm build:draft`. It should succeed and use the committed
images. `pnpm images:check`, run online, should report the reachability of all 5 original URLs.
