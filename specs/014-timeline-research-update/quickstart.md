# Quickstart: Validate the timeline update

## Prerequisites

- Node and pnpm as pinned in `package.json`, dependencies installed (`pnpm install --frozen-lockfile`).
- New crops committed under `assets/events/forrasok/`, plus `assets/events/1901-04-20-hasznalhatasi-engedely.png`.

## 1. Copy images into the archive

```sh
pnpm images:fetch
```

Expected: every new local `Kép URL` is copied into `src/assets/archive/` and the manifest. No network request is needed, because all new images are local files.

## 2. Build and test

```sh
pnpm test
pnpm build:draft
pnpm test:site
```

Expected:

- The build reports no orphaned editorial keys and no events without a title.
- The site test "contains every event of input/timeline.md exactly once" passes with 175 events.
- HTML validation and internal links pass.

## 3. Check content against the contract

For each row in [contracts/new-events.md](contracts/new-events.md), open the home page at `pnpm preview` and confirm:

1. The event is in the right era and position, with the contract's date label, lane and certainty.
2. Its sources open the cited pages. Spot-check at least one per host: EPA, Hungaricana library, Hungaricana archives, Öröklét, Olympedia.
3. Its text keeps the research's limits. In particular:
   - N12 must not claim the garage was at D18.
   - M1 must not claim a bath operated in the house.
   - N16 and N29 must mark the release dates as calculated and must not prove a III/3 residence for the wife.
   - N34 must say fogház, mention the separate acquittal, and state that the identity is unproven.
4. Its image is a crop of the cited page, where the entry is legible. Catalogue-only events (N5, N15, N24, N28) have no image.
5. With the scope slider at **Ház**, all new D18 and D18 • személy events show; N11, N20 and N22 hide.

## 4. Check the three fixes

- The 1968 Illés card description reads „mire krónikánk 1968-hoz ér”, and the music card description contains no "timeline".
- The 1889 „Nevet kap a Dembinszky utca” event shows the 1903 Homolka map with the new caption.
- The 1901 „A ház használhatási engedélye” event shows the permit, with the same alt text and caption as on `/epulet/#hasznalatba-vetel`.

## 5. Budget gates

```sh
pnpm build:release && pnpm lighthouse
```

Expected: home page Lighthouse mobile Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100. The new images are below the fold and lazy-loaded.
