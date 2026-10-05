# Quickstart: Music card refinement

## Prerequisites

- Node 22 through nvm and pnpm through Corepack, as in 011. In this environment the wrapper is `scratchpad/p.sh`.
- Headless Chromium (`/snap/bin/chromium`) with puppeteer-core from `node_modules`, for the screenshot and DOM checks. Alternatively, a desktop browser with DevTools.
- Serve the build with `python3 -m http.server 4329 -d dist --bind 127.0.0.1`.

## Automated checks

```sh
pnpm test                      # unit: recordingLines, phrase map, media schema, audit
pnpm build:draft && pnpm test:site
pnpm build:release             # must pass: every media block has alt, credit and licence
pnpm lighthouse                # SC-007 on /
```

Expected results:
- every test passes
- html-validate and linkinator are clean
- Lighthouse on `/`: performance ≥ 95, the other three scores 100, CLS ≤ 0.05

The markup checks are listed in [contracts/site-pages.md](contracts/site-pages.md).

## Manual scenarios: all cards

1. **Date column (SC-001)**: at 1280, 1100, 768 and 360 px, compare the left edge and font of the 1901, 1935 and 1968 years with the neighbouring event dates. They differ by at most 2 px and use the same face and size. Each music node has the same diameter as the other nodes and sits on the axis.
2. **Card look (SC-002)**: the card has no dashed frame. It has a paper-alt surface with fine top and bottom rules. In the computed styles, every colour on the card and its children is one of the `tokens.css` values.
3. **Order and kicker (US1)**: the card shows ♫ „MIT HALLGATOTT BUDAPEST?” (no year), then the title in the event title type, the credit, the note, the recording line, „▷ Meghallgatom” and „Források · N”.
4. **Recording lines (SC-003)**: all eight match the research R4 table. No snake_case code is visible anywhere on the page. With `details` closed, the word „YouTube” is not visible on any card while JS runs.
5. **Sources (SC-004)**:
   - every card loads closed
   - a click opens and closes it; so do Tab, then Enter and Space
   - the open panel shows the links, then the long recording note
   - with JS disabled, it still opens and closes
6. **Text-only width (FR-014)**: on a card without an image, the text uses the card width, up to the 62ch note measure. There is no empty box.
7. **Button (US5)**: hovering and focusing „Meghallgatom” gives only a lighter fill and a slightly stronger border, with no lift. While playing, the card reads „♫ Most szól”; when paused, „▷ Folytatás”, in the quieter deep-paper state. The button width does not change between states.
8. **Player (FR-023)**: play 1901. The player shows ♫, „1901” in the date serif, „· Mit hallgatott Budapest?”, the title, the credit „Fráter Lóránd”, then „Felvétel: Fráter Lóránd”. The video is unchanged.
9. **Playback regression (SC-008)**: run 011 quickstart scenarios 1–18. All of them still pass; scenario 1 now reads „▷ Meghallgatom” and has no year in the kicker.
10. **Reduced motion**: emulate `prefers-reduced-motion: reduce`. Button, summary and chevron changes are instant.
11. **Print**: in print preview, every card's sources are open, and no button, chevron or player is printed.

## Manual scenarios: cards with the owner's images

Run these on the cards that have a `media` block; the examples use 1901.

12. **Split layout (US4.1, US4.3)**: at 1280 px, the 1901 card has its text on the left (about 64%) and the image on the right (about 36%), reaching the card's right edge. The image's left edge fades into the surface with no hard line. The note column is about 58–66 characters wide.
13. **Treatment (US4.2, SC-005)**: the image is mostly grey, faintly warm, a little soft, and veiled, with no vignette or texture. Every other card is unchanged, and cards with images differ from those without only by the image box and the credit in the panel.
14. **Stacked layout (US4.5)**: at 900 px (card under 38 rem) and at 360 px, the image sits between the credit and the note as a full-width 16:7 band whose bottom edge fades out. It takes clearly less than half the viewport height.
15. **Focus point (US4.4)**: on each portrait, the face stays in view in both layouts. Changing `position` and rebuilding moves the crop.
16. **Loading and markup (SC-006, US4.8)**:
    - DevTools Network: the image is not requested at load and is fetched as AVIF or WebP when the card nears the viewport
    - Lighthouse CLS is still ≤ 0.05
    - the `img` has `loading="lazy"`, `width`, `height` and the alt text
    - the image is not inside a link
    - the panel shows the credit and the licence
    - the JSON-LD has an `ImageObject` with `url` ending in `/#zene-1901-oszi-rozsa-feher-oszi-rozsa`
17. **Release gate (FR-019)**: temporarily remove one image's `license` and run `pnpm build:release`. The build fails, naming `music zene-1901-… media.license`. Set `alt: kép` and it fails with „image alt is generic”.
18. **Load failure (edge case)**: block the image URL in DevTools and reload. The card falls back to the text-only layout, with no broken-image icon.
19. **Missing file**: temporarily set `src: nincs-ilyen.jpg`. `pnpm build:draft` fails with a message naming the file.

Undo the temporary changes from 17 and 19.

## Results (2026-10-05)

Run in headless Chromium against the local build. The image scenarios used a temporary fixture: a Fortepan portrait already in the repo, added to the 1901 card with alt, credit, licence, source and `position: 50% 30%`. It was removed afterwards. The owner's images are not in yet (T026).

- **Automated**:
  - 148 unit tests and 76 site tests pass
  - html-validate and linkinator (494 links) are clean
  - `astro check` reports 0 errors
  - `build:release` passes, with and without the fixture
- **Scenario 1**: at 1280, 1100, 900, 768 and 360 px, every music year is 0 px from the neighbouring event date, in the same face and size (Cormorant 20.8 px). Every node is 38 px and on the axis.
- **Scenario 2**: the cards have solid top and bottom rules and no side border. The computed colours are only `--d18-ink`, `--d18-paper-alt`, `--d18-rule`, `--d18-muted`, `--d18-walnut` and `#3f3934`.
- **Scenario 5**: Enter opens the sources, Space closes them, and a click opens them. Without JS, a click opens them and the „YouTube ↗” link shows.
- **Scenario 11**: `beforeprint` opens all 8 panels and `afterprint` closes them. In print media, all 8 source lists are visible.
- **Scenarios 7–9**:
  - no YouTube request on load
  - play: one iframe, the card reads „♫ Most szól”
  - the player shows „1942 · Mit hallgatott Budapest?” in Cormorant, the title, „Karády Katalin” and „Felvétel: Karády Katalin”
  - pause: the card reads „▷ Folytatás”
  - close: no iframe, and the card reads „▷ Meghallgatom”
  - checked at 1280 and 360 px
- **Scenario 10**: with reduced motion, the button's transition duration is 0s.
- **Scenarios 12–14 (fixture)**:
  - at 1280 px (card content about 655 px), the image is on the right at 234 × 454 px, the text column is 417 px wide, and the left edge fades in
  - at 1100, 900 and 768 px (card content under 38 rem), the image is a stacked 16:7 band under the credit
  - at 360 px, the band is 278 × 122 px
- **Scenario 16**:
  - the image is not requested at load at 1280 px, and is fetched as AVIF on scrolling near it
  - at the smaller widths, Chromium already fetched it on load, since the 1901 card falls within Chromium's own lazy-load distance there
  - Lighthouse on `/` with the fixture: 98 / 100 / 100 / 100, LCP 2.1 s, CLS 0.001. The other pages score 99–100.
- **Scenario 17**: without `license` and with `alt: Kép`, `build:release` stops with „media.alt image alt is generic” and „media.license image license missing” for `music zene-1901-…`.
- **Scenario 18**: with the image request blocked, the box is hidden and the card falls back to the text-only layout.
- **Scenario 19**: with `src: nincs-ilyen.jpg`, `build:draft` stops with „music image nincs-ilyen.jpg is named in editorial/music.yaml but not in src/assets/music/”.
- **Size**: the music player chunk is 2.46 KB gzipped, up from about 2.3 KB. The print helper is a separate small chunk, now also loaded on `/`.
- **Not tested**:
  - the owner's real images (T026)
  - iOS Safari
  - a real print dialog: tested through the print events and print media emulation
  - live statistics

### With the owner's images (2026-10-05)

- **Files**: the eight images from the owner's package are in `src/assets/music/` (1.8 MB in total). Changes made to them:
  - underscores in the names became hyphens
  - the 1942 PNG became a JPEG; its alpha channel was fully opaque
  - the two Fortepan scans (6351 and 5768 px) were downscaled to 1600 px, so they now carry `modifications`
  - the package's metadata is kept as `src/assets/music/sources.yaml`
- **Focus points**: the owner's values suited the tall desktop column, but cropped the faces out of the 16:7 band on phones. The vertical values were retuned per image; the horizontal values are the owner's. The desktop column shows almost the full image height, so it is unaffected.
- **Results**: 148 unit tests and 83 site tests pass, and so does `build:release`. Lighthouse on `/`: 98 / 100 / 100 / 100, LCP 2.1 s, CLS 0.001, 206 KiB transferred on load.
