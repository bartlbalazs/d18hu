# Contract: Consent notice and statistics

This contract applies only to builds where analytics is enabled (see [data-model](../data-model.md#analytics-configuration-build-time)). In any other build, none of the markup below exists.

## Markup in the built HTML (every page, including 404)

```html
<section class="consent" id="statisztika" aria-labelledby="statisztika-cim" hidden
         data-measurement-id="G-…" data-site-host="www.dembinszky18.hu">
  <h2 id="statisztika-cim">Látogatottsági statisztika</h2>
  <p>…Google Analytics… <a href="/impresszum/#adatkezeles">Részletek</a></p>
  <p data-consent-status></p>                 <!-- filled in when reopened from settings -->
  <div class="consent__actions">
    <button type="button" class="consent__button" data-consent="granted">Elfogadom</button>
    <button type="button" class="consent__button" data-consent="denied">Nem kérem</button>
  </div>
</section>
```

- **Position**: after `<footer>` and before the module script, so it follows the content in reading order.
- **Settings button in the footer**: `<button type="button" class="footer-link" data-consent-settings hidden>Statisztika beállításai</button>`.
- **Impresszum**:
  - A section `#adatkezeles` with an `h2` "Adatkezelés".
  - Its own `data-consent-settings` button.
- **No `<script src>` in the static HTML** points to a third-party host. `googletagmanager.com` appears only as a string inside the statistics module.
- **Tracked links**:
  - Archive-source links need no marker: every external `https:` link inside `<main>` counts as one.
  - Every `a.evidence__link` has `data-stat-image="<name>"`.

## Behaviour

1. **Loading**: the module does nothing unless `location.hostname === data-site-host`.
2. **Deciding whether to show the notice**: it resolves consent per the [data model](../data-model.md#consent-choice-visitors-browser).
   - `ask`: remove `hidden` from the notice.
   - `granted`: after `load` and then idle, inject the tag as in [research R2](../research.md#r2-how-google-analytics-is-loaded-fr-003-fr-011).
   - In every state except "storage throws", remove `hidden` from the `data-consent-settings` buttons.
3. **A `data-consent` button**:
   - Stores the choice and hides the notice.
   - `granted`: loads the tag now, if it isn't loaded yet.
   - `denied`: runs the withdrawal steps in [research R4](../research.md#r4-the-consent-record-fr-004-key-entity-consent-choice).
4. **A `data-consent-settings` button**:
   - Shows the notice.
   - Fills `[data-consent-status]` with "Jelenleg: engedélyezve", "Jelenleg: elutasítva", or the browser-signal text. With a browser signal, the Elfogadom button is hidden.
   - Moves focus to the notice heading, which has `tabindex="-1"`.
5. **Events**: one delegated `click` listener on `document`. It reports only in the `granted` state, maps the link with `statisticsEventFor`, and calls `gtag('event', name, params)`.

## Network guarantees

| State | Requests to Google hosts | `_ga*` cookies |
|---|---|---|
| no JavaScript | 0 | none |
| `ask` (before choosing) | 0 | none |
| `denied` (including browser signal) | 0 | none, and deleted on withdrawal |
| `granted` | gtag.js, plus collect hits | `_ga`, `_ga_<container>`, max 395 days |
| wrong host (web.app, localhost, preview) | 0 | none |

## Pure functions (unit-tested)

- `resolveConsent(stored: string | null | Error, signals: { gpc?: boolean; dnt?: string | null }): 'granted' | 'denied' | 'ask'`
- `statisticsEventFor(link: { href: string; dataset: Record<string, string | undefined>; inMenu: boolean; inContent: boolean; eventId?: string; pagePath: string; siteOrigin: string }): { name: string; params: Record<string, string> } | null`
