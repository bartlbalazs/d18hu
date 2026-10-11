# Quickstart: validating the source-criticism split

Run all commands from the repository root, with Node 22 on PATH:

```bash
export PATH=$HOME/.nvm/versions/node/v22.23.2/bin:$PATH
```

## 1. Baseline (before any content edit)

```bash
node scripts/timeline-snapshot.ts write specs/015-source-criticism-disclosure/baseline/timeline-snapshot.json
```

Expected: a file with 175 events, counts per era and per scope, and the commit it was taken at. Commit it before editing content.

Also note the page weight on a fresh `corepack pnpm build:draft`: the brotli size of `dist/index.html` (78 KB on 2026-10-12, [R9](research.md#r9-page-weight)).

## 2. Unit tests

```bash
corepack pnpm test
```

Expected: all pass, including the new cases for:
- the `sourceCriticism` schema (absent, one or more items, empty list, empty item);
- single-paragraph inline rendering (bold, emphasis, https link, site path, `<br>`);
- rejection of raw HTML, lists and multiple blocks.

## 3. Regression against the baseline

```bash
node scripts/timeline-snapshot.ts check specs/015-source-criticism-disclosure/baseline/timeline-snapshot.json
```

Expected: `0 differences` (SC-001, SC-002). Any difference must be listed in `report.md` as a deliberate correction.

## 4. Build and site tests

```bash
corepack pnpm build:draft && corepack pnpm test:site
```

Expected: everything passes, with the [card-disclosure contract](contracts/card-disclosure.md) invariants checked, html-validate clean, and linkinator finding no broken internal links or fragments.

## 5. Manual checks

1. **Width:** at 320, 768 and 1280 px there is no horizontal scroll, and the toggle stays inside each card (SC-007).
2. **Mouse and keyboard:** open a card's disclosure by mouse, then a second one by Tab + Enter, and close one with Space. Both work independently, the page doesn't jump, and the source links are visible while closed (SC-005, SC-006).
3. **Screen reader:** the control is read as "Forráskritika és pontosítások – {title}, összecsukva/kibontva".
4. **Scope slider:** with one disclosure open, move the slider to Ház and back to Világ. The card stays open, and the reading position is kept.
5. **No JavaScript:** disable JavaScript and reload. Disclosures still open and close.
6. **Print:** open the print preview. Every note is printed and no chevron shows.
7. **Content spot checks:**
   - one rewritten card per era;
   - the FR-011 cards (1929 gearbox, 1937 Wágner III/3, the Uhereczky garage, 1919 Kiss/Nagy, Rintche).

   Read each closed. The visible text alone must be true and no stronger than the evidence (SC-009), and each image caption must still read correctly next to the new text.
8. **Lightbox:** opening an image on a rewritten card still works.

## 6. Performance

```bash
corepack pnpm build:release && corepack pnpm lighthouse
```

Expected: the home page meets the thresholds (SC-008), and the brotli `index.html` grows by no more than 3 KB over the step-1 figure.

## 7. Report

`report.md` contains the five items of FR-024, plus the before/after page weight.
