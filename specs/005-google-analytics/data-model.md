# Data model: Visitor statistics

## Analytics configuration (build time)

| Field | Source | Rule |
|---|---|---|
| `measurementId` | `editorial/site.yaml` → `analytics.measurementId` | Optional. If present, it must match `^G-[A-Z0-9]+$` or the build fails. An empty string is treated as missing. |
| `enabled` | derived | `mode === 'release'` and `measurementId` is set. |
| `siteHost` | derived from `resolveSiteUrl()` | The hostname the script must be running on to be active. |

- **When `enabled` is false**, none of these reach the built HTML: the notice, the footer settings button, the Adatkezelés section, the statistics module, and any mention of `googletagmanager`.
- **A missing `measurementId`** is not an editorial audit item, since the site is complete without analytics.

## Consent choice (visitor's browser)

- **Storage**: `localStorage['d18-statisztika']`, with the value `"granted"` or `"denied"`. Nothing else is stored.
- `resolveConsent(stored, signals)` returns the effective state:

| Inputs | Effective state | Notice shown? |
|---|---|---|
| storage throws | `denied` | no |
| GPC `true` or DNT `'1'` | `denied` (not stored) | no. The settings panel explains the browser setting. |
| stored `"granted"` | `granted` | no |
| stored `"denied"` | `denied` | no |
| nothing stored, or an unknown value | `ask` | yes |

- **State transitions** (only on the visitor's action):

```text
ask ──Elfogadom──▶ granted ──(settings) Nem kérem──▶ denied
 │                    ▲                                  │
 └──Nem kérem──▶ denied ──(settings) Elfogadom───────────┘
```

- **`ask` → `granted`**: the tag loads at once.
- **`granted` → `denied`**: sending stops at once, and the `_ga*` cookies are deleted.
- **`denied` → `granted`**: the tag loads at once.

## Statistics event (sent only in the `granted` state)

| Name | Parameters | Value rules |
|---|---|---|
| `page_view` | sent automatically by `config` | the page's path and title, as Google Analytics sends them |
| `archive_source_click` (an external `https:` link in `<main>`) | `source_url`, `timeline_event` | `source_url` is the absolute https URL of the link. `timeline_event` is the enclosing `data-event-id`, or `location.pathname` on story pages. |
| `image_zoom` | `image_name` | the archive file's base name, with no hash or extension: `src/assets/archive/<name>.jpg` becomes `<name>` |
| `era_select` | `era` | the era id taken from `/#korszak-<id>` |

No other event or parameter is sent (FR-008).
