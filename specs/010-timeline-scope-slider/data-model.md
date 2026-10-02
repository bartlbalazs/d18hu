# Data model: Timeline scope slider

## Scope (`src/lib/timeline/scope.ts`)

| Value | Step | Label on the slider | Categories shown |
|---|---|---|---|
| `house` | 0 | Ház | house |
| `area` | 1 | Környék | house, area |
| `hungary` | 2 | Magyarország | house, area, hungary |
| `world` | 3 | Világ | house, area, hungary, world |

The constants and functions are:
- `SCOPES`: the four values, in order.
- `DEFAULT_SCOPE = 'area'`
- `SCOPE_STORAGE_KEY = 'd18-idovonal'`
- `SCOPE_LABELS`: the slider labels. They come from `CATEGORY_DISPLAY`, except that `house` is shortened to "Ház".
- `categoriesFor(scope)`: the categories in the last column of the table above.
- `narrowestScopeFor(category)`: the scope with the same index as the category (house → `house`, world → `world`).
- `scopeCounts(events)`: for one era's events, returns `Record<Scope, number>` (cumulative).
- `parseStoredScope(value)`: returns a `Scope` if the value is valid, otherwise `undefined`.
- `initialScope({ consent, stored })`: returns the stored scope only when consent is `granted` and the stored value is valid; otherwise `DEFAULT_SCOPE`. The module script uses it, and the inline script mirrors the same rule.

## Expected counts

The site tests check these against `input/timeline.md`. They are not hard-coded on the page.

| Era | house | area | hungary | world |
|---|---|---|---|---|
| 1873–1913 | 19 | 35 | 38 | 40 |
| 1914–1938 | 15 | 30 | 36 | 43 |
| 1939–1945 | 8 | 10 | 21 | 27 |
| 1946–1968 | 2 | 13 | 19 | 25 |
| **Total** | **44** | **88** | **114** | **135** |

## State transitions

```text
page load ── consent granted & valid stored value ──▶ stored scope
          └─ otherwise ───────────────────────────▶ area
          then: hash targets a hidden event ──▶ widen to narrowestScopeFor(category)

change (slider, tick label, hash) ──▶ set data-scope, keep reading position, announce
                                   └─ consent granted ──▶ store
consent: granted ──▶ store current scope
consent: withdrawn ──▶ remove d18-idovonal (statistics.ts, any page)
```
