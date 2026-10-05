# Quickstart: validating the music layer

## Prerequisites

- Node and pnpm as in the README (`nvm use`, `corepack enable`, `pnpm install --frozen-lockfile`)
- `editorial/music.yaml` with the eight songs. For a release check, every song needs a reviewed `description` and a `youtube_url`.
- A desktop browser plus a phone (or the device emulator at 360 px). An iPhone with Safari, if available, for the autoplay check (research R10).

## Automated checks

```sh
pnpm test            # unit: music.ts (URL → id, anchors, eras, placement), audit, statistics
pnpm check           # types
pnpm build:draft     # lists music items still missing a note or recording
pnpm test:site       # built markup: contracts/site-pages.md
pnpm build:release   # must fail while a music item is missing; passes once all eight are complete
pnpm lighthouse      # constitution II budgets on / (with no song started)
```

Expected: everything passes. `build:draft` lists missing music items as `music zene-<year>-<slug>`.

## Manual scenarios

Run `scripts/start-local.sh --preview` and open `http://localhost:4321/`, with the browser's Network panel open and filtered to `youtube`.

1. **First load (SC-003)**: there are no YouTube requests, no iframe in the Elements panel, and no player. Eight music cards show at the default Környék setting, each with the note icon, „Mit hallgatott Budapest? · <year>”, title, performer, note and „▶ Meghallgatom”.
2. **Slider (FR-010)**: at Ház the music cards disappear, and they come back at Környék. Open `/#zene-1935-szomoru-vasarnap` with Ház stored: the slider widens to Környék and the page lands on the card.
3. **Play (US2)**: press „Meghallgatom” on 1935. Exactly one `youtube-nocookie.com/embed/…` iframe appears and the song plays. The card reads „♫ Most szól”. The player shows ♫, 1935 (largest), „Mit hallgatott Budapest?”, title, performer, the video, ⏸, „↑ Ugrás a dalhoz”, „YouTube ↗” and ×. The address bar doesn't change.
4. **Pause and resume**: press ⏸ in the player, and the card reads „▶ Folytatás”. Press the card, and the song resumes and both update.
5. **Switch (US3)**: press „Meghallgatom” on 1959. The 1935 song stops and there is still one iframe. The player shows 1959 and „Pancsoló kislány”. 1935 reads „▶ Meghallgatom” again.
6. **Year while scrolling**: scroll to the closing section. The player still shows 1959, and the closing text and footer can be scrolled fully above the player.
7. **Jump (US4)**: press „↑ Ugrás a dalhoz”. The page scrolls smoothly to the 1959 card, which is clear of the header and the player, and is briefly highlighted. The address shows `#zene-1959-pancsolo-kislany`.
8. **YouTube link**: „YouTube ↗” opens the video in a new tab, and the in-page song pauses, so two copies don't play at once.
9. **Close**: press ×. The audio stops, the iframe is gone, the player is gone, the bottom space is gone, every card reads „▶ Meghallgatom”, and focus is on the 1959 card's button.
10. **Keyboard (SC-005)**: repeat 3–9 with Tab, Enter and Space only. Every control has a visible focus ring and a screen reader announces „Most szól: …”.
11. **Narrow screen (US5)** at 360 px:
    - the player is full width with the year visible, a long title cut at two lines, and a 200 px tall video area (R9)
    - every control is ≥ 44 × 44 px
    - the scope slider's round button sits above the player
    - the consent notice (in a fresh profile) stays fully visible above or below the player, with nothing covered
12. **Wide screens** at 1100 and 1280 px: the player is aligned to the content width, and the scope side panel isn't covered.
13. **Errors (SC-008)**:
    - change one `youtube_url` to a deleted or unembeddable video, rebuild and press it: within 5 s the player shows „Ez a felvétel jelenleg nem játszható le itt.” and „YouTube ↗”
    - block `youtube-nocookie.com` in DevTools (request blocking): the same fallback appears, and the rest of the page works
14. **No JavaScript**: disable JS. The cards show their text and a „YouTube ↗” link in place of „Meghallgatom”. There is no player.
15. **Reduced motion**: with reduced motion emulated, the jump and the highlight don't animate.
16. **iOS Safari (R10)**: on the first press, either the song plays or the card shows „▶ Folytatás” within 3 s. A tap on the video then plays it, and the card switches to „♫ Most szól”.
17. **Statistics (FR-026)**: with statistics accepted on the live host, the DevTools Network panel shows `music_play`, `music_change`, `music_jump_to_timeline`, `music_open_youtube` and `music_close` hits, and no `archive_source_click` for the player's link. Without consent there are none.
18. **Print**: the cards print with their text, and no buttons or player are printed.

## Results (2026-10-05)

Headless Chromium 154 against the draft build, plus the automated checks:

- `pnpm test` (115), `pnpm check`, `pnpm test:site` (73, plus html-validate and linkinator) pass.
- `pnpm lighthouse`: `/` 99 / 100 / 100 / 100, LCP 2.0 s, CLS 0.001, TBT 0 ms, with no song started. The other pages are unchanged.
- JavaScript: `music-player.ts` is 2,303 B gzipped (after the review fixes); the site-wide total is about 30.0 KB.
- Passed: scenarios 1–7, 9, 10, 12, 14, and 11 for layout at 360 px. Also passed: 13 with blocked recordings (error 150 and an unknown id), which reach the fallback within 5 s.
  - At 1100 × 700, 1280 × 800 and 768 × 1000, neither the scope panel nor the round button reaches the player, and there is no horizontal scroll.
- During implementation, switching with `loadVideoById` left the new song unstarted and reported no embed error. Switching now reloads the same iframe (research R8).
- With the owner's updated `music.yaml`, 7 of 8 recordings play in the embed. 1959 (`sFcdFRV1OdE`, titled „Pancsoló kisgyerek” on YouTube) is blocked from embedding by its uploader (error 150), so that card shows the fallback with the „YouTube ↗” link. No embeddable Kovács Eszti upload has been found; the earlier candidates `emht2dDOKCs`, `EB0VldSw3w0`, `GHrGCf-aM-U` and `Ln8WUSI60QU` are blocked too.
- Not run here:
  - 8 (opening a new tab)
  - 11 with the consent notice: it only shows on the live host with a measurement ID
  - 15 (reduced motion)
  - 16 (iOS Safari)
  - 17 (live statistics)
  - 18 (print)

  Check these on a real device and on the live site.
