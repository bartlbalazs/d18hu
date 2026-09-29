# Quickstart: validating the mobile menu

## Automated

```sh
nvm use
corepack pnpm check
corepack pnpm test                      # includes currentEraIndex unit tests
corepack pnpm build:release
corepack pnpm test:site                 # menu markup, groups, order, aria-current, HTML validity, links
CHROME_PATH=/snap/bin/chromium corepack pnpm lighthouse   # principle II thresholds (SC-003)
```

All of these must exit with code 0.

## Manual: small screens (US1, US2)

Run `scripts/start-local.sh --preview`, then use the browser's device toolbar at 320, 360, 390 and 430 px width.

| Step | Expected |
|---|---|
| Load `/` | Header is one row: "D18 …" on the left, **Menü** on the right, about 61 px tall (SC-005) |
| Tap Menü | Panel below the header lists **Korszakok** (4 eras) and **Oldalak** (Építők, Névadó, Impresszum) |
| Tap Névadó | Névadó opens in 2 taps (SC-001), and it is underlined in the panel when reopened |
| On `/`, open Menü and tap 1939–1945 | Panel closes and the era heading is visible below the header |
| Open Menü, press Escape | Panel closes and focus is on Menü |
| Open Menü, tap outside it | Panel closes |
| Browser zoom to 200% at 360 px | No clipped or overlapping menu text (SC-004) |
| Rotate or resize past 900 px with the panel open | Panel closes, desktop row shows |

## Manual: no JavaScript (FR-006, SC-002)

Disable JavaScript in DevTools, then repeat the steps above.

- Every destination must still open.
- After an era link the panel stays open until you close it with Menü, Escape or a tap outside.
- No era is ever highlighted.

## Manual: screen reader (US2)

Use Orca, or TalkBack on a phone.

- Menü is announced as a button with its collapsed or expanded state.
- The groups are announced as "Korszakok" and "Oldalak" lists.
- Scrolling the timeline announces nothing.

## Manual: era highlight (US4, SC-006)

On `/`, at 1280 px and at 360 px (with Menü open), check the highlight while scrolling slowly from the top to the bottom.

| Position | Highlighted |
|---|---|
| Opening section / legend | none |
| Each era opener and its events | that era only, with a dot and bold text, no underline |
| Press End | 1946–1968 |
| Press Home | none |
| Open `/#korszak-1914-1938` | 1914–1938 |

On `/epitok/`, no era is highlighted.

## Desktop unchanged (US3)

At 1280 px, compare the header with the live site: same single row, no Menü button.
