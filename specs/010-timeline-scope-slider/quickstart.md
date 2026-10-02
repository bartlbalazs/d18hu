# Quickstart: validating the timeline scope slider

## Prerequisites

- `pnpm install` has been run.

## Automated checks

```sh
pnpm check
pnpm test                  # scope.test.ts: order, cumulative categories, counts, stored-value rules
pnpm build:release
pnpm test:site             # contract in contracts/site-pages.md, html-validate, internal links and fragments
pnpm lighthouse            # / keeps its scores; CLS ≤ 0.05
```

Expected: all pass. Record the gzipped size of the new home-page script in the plan's Complexity Tracking row.

## Manual checks (`pnpm preview`, open `/`)

1. **Default**: In a fresh private window the slider is at Környék, and 88 events show. Nothing flashes on a throttled reload (SC-002).
2. **Cumulative**: At Ház, Környék, Magyarország and Világ, the total is 45, 88, 114 and 135, and each era count matches [data-model.md](data-model.md) (SC-001). The last era's axis ends at its last visible event.
3. **Keyboard and screen reader**: Arrow keys, Home and End move the slider. The screen reader reads the setting by name and announces "<name>: <n> esemény".
4. **Reading position**: Mid-page, change the setting. The event at the top stays put. If it gets hidden, the view moves to the nearest visible event.
5. **Link to a hidden event**: Open `/#<id of a Világ event>` in a fresh window. The slider widens to Világ, and the event is in view.
6. **Wide (1100, 1280 and 1600 px)**:
   - The panel is to the right of the timeline and doesn't overlap it.
   - It appears with the first era's events and fades out over each chapter opener and before the closing.
   - The hero and the Jelmagyarázat are never covered.
7. **Narrow (360, 768 and 1099 px)**:
   - The round button sits in the lower right only while the timeline is on screen.
   - Its icon shows the current setting.
   - Tapping it opens the panel. A tap outside, Escape or the button closes it.
   - It is hidden while the menu, the image viewer or the consent notice is open.
8. **Consent** (on the live host, or with the notice enabled):
   - Accept, then choose Világ and reload: it opens at Világ.
   - Withdraw in the footer settings and reload: it opens at Környék, and `d18-idovonal` is gone from storage.
   - With GPC on, nothing is stored.
9. **No JavaScript**: All 135 events show, with the full counts and no slider.
10. **Print preview**: Only the current setting's events print, without the panel.
11. **Reduced motion**: The panel appears and disappears without a fade.
