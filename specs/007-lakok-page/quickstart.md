# Quickstart: validating the Lakók page

## Prerequisites

- Run `pnpm install` from the lockfile, on Node 22.

## Build and automated checks

```bash
pnpm check
pnpm test
pnpm build:draft
pnpm test:site      # site tests, html-validate, linkinator with fragment checks
pnpm lighthouse     # /, /epitok/, /lakok/, /nevado/, /impresszum/
```

Expected results: everything passes. `test:site` covers the [contract](contracts/site-pages.md). The linkinator fragment check proves that every source marker resolves.

## One-off content completeness check (SC-002)

```bash
grep -E '^#{2,3} ' input/lakok.md | sed -E 's/^#+ //' |
  while read -r heading; do grep -qF "$heading" dist/lakok/index.html || echo "MISSING: $heading"; done
grep -oE 'https://[^) ]+' input/lakok.md | sed 's#https://www.dembinszky18.hu##' | sort -u |
  while read -r url; do grep -qF "href=\"${url//&/&amp;}\"" dist/lakok/index.html || echo "MISSING LINK: $url"; done
```

Expected result: no output. Headings render emphasis such as *Faustjának* as `<em>`, so a heading that contains emphasis needs a check by eye. Row counts are covered by the site test.

## Manual checks

1. Run `pnpm dev` and open any page. The header page links read **Építők · Lakók · Névadó · Impresszum**, and the footer shows the same order.
2. Open `/lakok/`. The title, lead and method text sit on the normal paper background. Scrolling down, the sections show the four era tones, with "1944–1945: csillagos ház" on the dark band. The closing section and sources are back on paper, followed by the correction note.
3. Each of the three lists is closed and shows its entry count.
   - Open and close each one by click, by touch (in device emulation), and with Tab then Enter or Space.
   - Repeat with JavaScript disabled.
4. At 320 px, open the early list. Its table scrolls inside its frame, and the page itself does not scroll sideways. Repeat at 768 and 1280 px.
5. With all lists closed, compare the page height with all lists open at 375 px. The closed page should be at least a third shorter (SC-003).
6. In Chrome, search the page for "Wépi" with the lists closed. The early list should open on the match.
7. Open the print preview. All three lists are printed open, and after the dialog closes they are closed again.
8. Click [26] in the 1944–1945 section. It lands on source 26, highlighted, and is not hidden under the sticky header. Click the end numbers of [19–20].
9. Check the header at 900, 960 and 1024 px. The one-row menu either fits or is replaced by the "Menü" button (research R7).
10. Run axe or the Lighthouse accessibility audit on `/lakok/`. It should report no contrast or `scrollable-region-focusable` failures on any band.
