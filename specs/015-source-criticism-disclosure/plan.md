# Implementation Plan: Source criticism split from the timeline story

**Branch**: `master` (direct) | **Date**: 2026-10-12 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/015-source-criticism-disclosure/spec.md`

## Summary

Timeline cards that mix the story with evidence get a short visible description. The detailed source criticism moves into a closed „Forráskritika és pontosítások” disclosure on the same card.

The notes are stored as an optional `sourceCriticism` list of inline-Markdown paragraphs on the event's entry in `editorial/events.yaml`. The card renders them in a native disclosure element placed between the image and the source links. It reuses the music card's toggle style and the existing print helper.

Event ids are derived from the description's first four words. Every rewritten description therefore keeps its opening words, so no anchor or editorial key changes.

A metadata snapshot is taken before any text changes and checked afterwards. Each event is reviewed by hand, with a claim-by-claim worksheet for every rewritten card.

## Technical Context

**Language/Version**: TypeScript 6.0.3 on Node 22 (existing); content in Markdown and YAML

**Primary Dependencies**: Astro 7.3.3, remark-parse 11.0.0 + remark-gfm 4.0.1, unified 11.0.5, yaml 2.9.1 (all existing; none added)

**Storage**: Files: `input/timeline.md` (visible descriptions), `editorial/events.yaml` (new `sourceCriticism` field)

**Testing**: Vitest unit and site tests, html-validate, linkinator, Lighthouse CI (existing), and a new snapshot check script

**Target Platform**: Static site on Firebase Hosting; evergreen browsers plus iOS/Android defaults

**Project Type**: Static website (single project)

**Performance Goals**: Home page Lighthouse mobile ≥ 95/95/95 with SEO 100, CLS ≤ 0.05. The brotli-compressed HTML grows by at most 3 KB ([R9](research.md#r9-page-weight)).

**Constraints**:
- Works without JavaScript.
- No new dependency and no new client script.
- The JS budget is unchanged: only one selector is added to `print-details.ts`.
- Event ids, anchors and all other metadata stay identical to the snapshot.

**Scale/Scope**: All 175 events are reviewed. About 35–50 get source criticism: the 32 descriptions over 60 words, plus shorter cards with separable evidence. Music cards are checked and expected to stay unchanged.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. Static HTML First | Pass | The notes are in the static HTML inside a native disclosure element, which opens and closes without JavaScript. |
| II. Performance Budget | Pass with a pre-existing deviation | The home page's HTML is already 78 KB brotli (114 KB gzip); with CSS and JS it is about 105 KB, just over the 100 KB initial-view line. This feature mostly moves text rather than adding it, and caps the growth at 3 KB brotli. The deviation is recorded below. |
| III. Mobile-First | Pass | The toggle is full width in the card and at least 44 px tall. It is keyboard and screen-reader operable natively, and is checked at 320/768/1280 px. |
| IV. Minimalism | Pass | No dependency and no new script. CSS reuses the music-source toggle rules, and print reuses `print-details.ts`. |
| V. Metadata | Pass | Titles, meta description, JSON-LD (Event uses title and date, not the description), canonical and sitemap are unchanged. |
| Technical constraints | Pass | The notes stay in a plain, version-controlled YAML file that a non-developer can edit. |

**Post-design re-check**: Still passes. The design adds:
- one optional schema field;
- one render step that reuses the existing inline renderer;
- one card block;
- about 30 lines of CSS;
- one print selector;
- a snapshot script that is a dev tool only.

## Project Structure

### Documentation (this feature)

```text
specs/015-source-criticism-disclosure/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── source-criticism-field.md   # editorial/events.yaml field rules
│   └── card-disclosure.md          # rendered markup, behaviour, styling
├── baseline/timeline-snapshot.json # written before any content change (FR-021)
├── reconciliation.md               # per-event claim mapping (FR-008)
├── report.md                       # final report (FR-024)
├── checklists/requirements.md
└── tasks.md                        # /speckit-tasks
```

### Source Code (repository root)

```text
src/lib/editorial/schema.ts         # sourceCriticism: optional non-empty list of non-empty strings
src/lib/editorial/assemble.ts       # renders paragraphs to sourceCriticismHtml
src/lib/timeline/inline-html.ts     # renderInlineMarkdown(text): one paragraph of inline Markdown → HTML
src/components/TimelineEvent.astro  # <details class="event__criticism"> between figure and sources
src/styles/timeline.css             # toggle and body styles, print rule
src/scripts/print-details.ts        # also opens details.event__criticism for printing
scripts/timeline-snapshot.ts        # write | check the metadata snapshot
input/timeline.md                   # rewritten visible descriptions (opening words kept)
editorial/events.yaml               # sourceCriticism entries
tests/unit/editorial.test.ts        # schema + rendering cases
tests/unit/dates-ids-inline.test.ts # inline Markdown paragraph rendering
tests/site/output.test.ts           # disclosure presence, closed state, placement, label
README.md                           # "Add source criticism to an event" + snapshot command
specs/001-d18-history-timeline/contracts/editorial-metadata.md  # document the new field
```

**Structure Decision**: This is the existing single static-site project. Code changes are confined to the editorial schema and assembly, the inline renderer, the event card, its styles and the print helper. Content changes are confined to `input/timeline.md` descriptions and `editorial/events.yaml`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| The home page is already above the 100 KB compressed initial-view line (HTML 78 KB plus CSS and JS 26 KB, brotli), measured 2026-10-12 before this feature | The page ships the whole timeline as static HTML (Principle I). This feature mostly relocates existing text and is capped at +3 KB brotli. | Loading the notes on demand would need client-side fetching and would break the no-JS rule. Dropping research text breaks the spec's no-data-loss rule. Reducing the existing overage is a separate task, flagged in the report. |
