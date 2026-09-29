# Implementation Plan: Closing section after the 1968 timeline

**Branch**: `006-timeline-closing` (work continues on the current git branch, `001-d18-history-timeline`) | **Date**: 2026-09-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/006-timeline-closing/spec.md`

## Summary

After the last event of the final era, the timeline's axis stops at the last marker. After a larger pause, a short, thin, centred line in the site's sand colour follows, then the centred closing block „A történet folytatódik”.

- **The block**: a heading and two fixed paragraphs, in which „írjon” links to the Impresszum.
- **How it is built**: a new static Astro component plus CSS. There is no JavaScript, no new asset and no editorial data.

## Technical Context

**Language/Version**: Astro 7.3.3 and CSS (existing). Node 22 via `.nvmrc`.

**Primary Dependencies**: none new.

**Storage**: N/A

**Testing**:
- Site tests in `tests/site/output.test.ts`: the markup, the verbatim text and the link.
- `html-validate`, linkinator and Lighthouse (existing).
- A scratchpad puppeteer check of the axis end and the line geometry ([quickstart](quickstart.md)).

**Target Platform**: current mobile and desktop browsers, and without JavaScript.

**Project Type**: static website.

**Performance Goals**: principle II thresholds unchanged. The home page grows by about 0.8 KB of HTML and CSS.

**Constraints**:
- The text is verbatim.
- No background, frame, icon, year or button.
- Centred.
- The line is ≤ 2 px thick and ≤ 25% of the content width (≤ 40% at 320 px).

**Scale/Scope**: 1 new component, 1 page, 1 stylesheet and the site tests.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. Static HTML First | ✅ Pass | Plain static HTML with semantic `section`, `h2` and `p`, and one `h1` per page as before. |
| II. Performance Budget | ✅ Pass | About 0.8 KB, with no images, fonts or scripts, and no layout shift since nothing loads late. |
| III. Mobile-First | ✅ Pass | Fluid from 320 px. The line is a fixed 72 px, and the text column is capped at 36 rem. The link's focus ring comes from the existing styles. |
| IV. Minimalism | ✅ Pass | No dependency and no JavaScript. The line is a pseudo-element. |
| V. Rich Metadata | ✅ Pass | No metadata change. The heading order stays logical (`h2` as a sibling of the era headings). |
| Quality Gates | ✅ Pass | HTML validation, link check, site tests and Lighthouse on the home page. |

Post-design re-check: same result, with no deviations.

## Project Structure

### Documentation (this feature)

```text
specs/006-timeline-closing/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/timeline-closing.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
src/components/TimelineClosing.astro   # new: the closing section, text verbatim
src/pages/index.astro                  # render it after the eras; add timeline--ends to the last era's list
src/styles/timeline.css                # axis per row in .timeline--ends; .timeline-closing and its line
tests/site/output.test.ts              # closing block assertions
README.md                              # Layout and design: one sentence on the closing section
```

**Structure Decision**: this is a single project, and the new component sits beside the other timeline components.

## Complexity Tracking

No deviations.
