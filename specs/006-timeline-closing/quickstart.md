# Quickstart: validating the timeline closing

Run everything as `source ~/.nvm/nvm.sh && nvm use && corepack pnpm …`.

## 1. Static checks

Run `pnpm check && pnpm test && pnpm build:release && pnpm test:site`.

Expected:
- The site tests find the closing block once in `index.html`, after the last era section and before `</main>`, with the heading and paragraphs exactly as in [data-model.md](data-model.md).
- Its only link points to `/impresszum/`, and no other page contains it.
- html-validate and linkinator are clean.

## 2. In the browser (320, 768, 1280 px)

Run `pnpm preview`, then check with a scratchpad puppeteer script or by eye. Contract details are in [contracts/timeline-closing.md](contracts/timeline-closing.md).

Expected:
- **The axis**: in the final era, it ends at the centre of the last event's marker (SC-001). The other eras look as before.
- **The gap**: the gap from the last event's bottom edge to the line is ≥ 2× the gap between two events (SC-002).
- **The line**: 1 px tall, and ≤ 25% of the content width at ≥ 768 px (≤ 40% at 320 px). Its centre, and the text's centre, are within 1 px of the content column's centre (SC-003).
- **The layout**: no horizontal scroll at 320 px.
- **Focus**: Tab reaches „írjon”, and the focus ring is visible.
- **Menu highlight**: with the closing block on screen, the menu still highlights 1946–1968.

## 3. Budget

Run `pnpm lighthouse`. Expected: the home page meets every principle II threshold (SC-005).
