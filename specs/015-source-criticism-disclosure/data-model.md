# Data model: Source criticism split from the timeline story

Only the changes are listed. The existing entities are defined in [001 data-model](../001-d18-history-timeline/data-model.md).

## EventEditorial (`editorial/events.yaml`), extended

| Field | Type | Rule |
|---|---|---|
| `sourceCriticism` | list of strings, optional | It is either left out or has **at least 1** item. Each item is trimmed, non-empty and **one** paragraph of inline Markdown: bold, emphasis, inline code, links to `https://` URLs or site paths, and a bare `<br>`. Raw HTML, headings, lists, block quotes and blank lines inside an item are build errors. The order is the reading order. |

Other rules:
- The field is allowed on any event, with or without an image or highlight.
- The orphan check works as before, so a key that matches no event id fails the build.
- The field is not part of the editorial audit: a missing note is never "missing data".

## TimelineEvent (assembled), extended

| Field | Type | Source |
|---|---|---|
| `sourceCriticismHtml` | `string[]`, optional | Each `sourceCriticism` item rendered to safe inline HTML. It is undefined when the YAML field is absent. |

All other fields are unchanged. `descriptionHtml` and `descriptionText` now hold the shortened visible text. Its first four id words are unchanged ([R3](research.md#r3-keeping-event-ids-and-anchors)).

## TimelineSnapshot (`specs/015-source-criticism-disclosure/baseline/timeline-snapshot.json`)

```text
{
  createdFrom: string            # git commit the snapshot was taken at
  counts: {
    total: number
    byEra:   { "1873-1913": n, … }
    byScope: { house: n, area: n, hungary: n, world: n }   # cumulative, as the slider shows them
  }
  events: [
    {
      id, era, sourceIndex, dateLabel, sourceLane, category, personSubtype, confidence,
      originalImageUrl | null,
      title | null,
      image | null: { alt, caption, credit, license, sourceUrl, sourceLabel, kind, depictsHouse },
      sources: [{ label, url }],          # ordered
      descriptionMarkdown                 # informational, excluded from the check
    }
  ]
}
```

`check` reports differences per event and field, and in the counts. It exits 1 if there are any. Every difference that is accepted must appear in `report.md` under the deliberate corrections.

## Reconciliation record (`reconciliation.md`), one entry per reviewed event

| Part | Content |
|---|---|
| Heading | `### <event id>`, then the date label and title |
| Decision | `unchanged` (with a reason) or `rewritten` |
| Before | The original description Markdown |
| After: visible | The new description Markdown |
| After: notes | The paragraphs of `sourceCriticism` |
| Claim table | One row per original claim: *visible* / *notes* / *redundant — where*. A final column confirms the claim is not strengthened. |
| Findings | An optional list of inconsistencies, each marked as fixed or flagged |

## State

A disclosure has two states, closed (initial) and open, and toggles independently per card. The state is not stored. Slider changes don't touch it.
