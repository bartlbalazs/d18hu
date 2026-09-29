# Quickstart: validating the Építők and Névadó pages

## Prerequisites

- Run `pnpm install` from the lockfile.
- The portrait must be committed at `src/assets/pages/dembinszky-rodakowski.jpg`. See [research R3](research.md#r3-névadó-portrait-fr-006).

## Build and automated checks

```bash
pnpm check
pnpm test
pnpm build:draft
pnpm test:site      # site tests, html-validate, linkinator with fragment checks
pnpm lighthouse     # /, /epitok/, /nevado/, /impresszum/
```

Expected results: everything passes. `test:site` covers the [contract](contracts/site-pages.md). The fragment check in linkinator proves that every Névadó source marker resolves.

## One-off content completeness check (SC-002)

Every heading in the drafts must appear in the built page:

```bash
for page in epitok nevado; do
  grep -E '^#{2,3} ' input/$page.md | sed -E 's/^#+ //' | grep -v 'Javasolt nyitókép' |
    while read -r heading; do grep -qF "$heading" dist/$page/index.html || echo "MISSING [$page]: $heading"; done
done
```

Expected result: no output. Also compare the draft's link URLs, with `?utm_source=chatgpt.com` stripped, against `grep -o 'href="https[^"]*"' dist/<page>/index.html`. Every draft URL should be present.

## Manual checks

1. Run `pnpm dev` and open any page. The header ends with the links **Építők · Névadó · Impresszum**, and the footer shows the same order.
2. Open `/epitok/`. The façade photo comes first, the text follows the draft section by section, and a "Források" list with 3 entries closes the page.
3. Open `/nevado/`. The Rodakowski portrait and its caption open the page. Clicking [3] jumps to entry 3 of the source list. The "Javasolt nyitókép" text does not appear.
4. Check each page at widths of 320, 768 and 1280 px. There should be no horizontal scroll, and headings should wrap cleanly.
5. Open `/irasok/`. It should return a 404.
