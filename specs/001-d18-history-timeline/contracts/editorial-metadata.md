# Contract: Editorial metadata (`editorial/*.yaml`)

Owner-edited files. Their schemas and release rules are defined in
[data-model.md](../data-model.md#eventeditorial-editorialeventsyaml) (EventEditorial,
SiteConfig, EditorialAudit). This contract fixes the author-facing rules.

## `editorial/events.yaml`

- Top-level keys are event ids exactly as printed by the build (`pnpm build:draft` lists
  events without titles, with their ids).
- Initial file: generated once (AI-drafted `title` for all 108 events, marked for review). It
  is then maintained by hand and never regenerated automatically.
- Unknown keys → build error listing them (`OrphanedEditorialEntry`).
- `image` block allowed only for events with a `Kép URL`.
- `highlight.verified: true` is the author's statement that the text is a checked excerpt or
  transcription; unverified highlights are not rendered.
- Never put internal research PDF names or paths here; `sourceUrl` must be a public
  `https://` archive record.

## `editorial/site.yaml`

- Holds hero, era intros and headings, building address, Impresszum and the article list. The
  site URL is not stored here; set the `SITE_URL` environment variable for release builds.
- Empty strings mean "not yet supplied" and show up in the missing-item report. Placeholders
  such as "TODO" or example e-mail addresses are rejected by the audit as missing.

## Compatibility

- Adding optional fields is backward compatible.
- Renaming or removing fields requires updating the schema, this contract and the data
  model together.
