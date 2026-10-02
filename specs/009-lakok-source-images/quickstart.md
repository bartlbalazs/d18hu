# Quickstart: validating the Lakók source images

## Prerequisites

- `pnpm install` has been run.
- The 14 files are copied from the package's `kepek/` folder into `src/assets/pages/lakok/` (see [data-model.md](data-model.md)).

## Automated checks

```sh
pnpm check                 # type check: every figure record has alt, caption, credit, source
pnpm test
pnpm build:release
pnpm test:site             # contract in contracts/site-pages.md, html-validate, internal links and fragments
pnpm lighthouse            # /lakok/ stays at 100/100/100/100 and under the 512 000 B initial weight
```

Expected: all pass, and Lighthouse reports no new image requests before scrolling.

## Manual checks (`pnpm preview`, open `/lakok/`)

1. **Placement**: Scroll through the four eras and compare each image's place with the table in [contracts/site-pages.md](contracts/site-pages.md).
2. **Pairs**: The Szellő clips show their two page labels with a visible gap between them. The Petrovits lines sit one under the other, their captions starting with the years.
3. **Viewer**: Tap any image. The full image opens, and on a 375 px phone the words of 07, 08 and 09 can be read when zoomed (SC-005). Closing it returns to the same place.
4. **Shapes**: 18 and 04 stay tall, 19 and 20 stay as strips, and 12 shows the whole page (FR-004, FR-007).
5. **Widths**: At 320, 768 and 1280 px, nothing scrolls sideways. On wide screens, 18 is narrower than 17.
6. **Dark band**: The 1944 caption and credit can be read on the dark background.
7. **No layout jump**: On a throttled connection, the text doesn't move while images load.
8. **Print preview**: Each image is under half a page, with its caption, and has no zoom button.
