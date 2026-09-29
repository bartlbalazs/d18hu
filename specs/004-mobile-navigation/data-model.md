# Data Model: Mobile-friendly top menu

This feature has no stored data. The menu is generated at build time from data the site already has.

## Menu destination

- **Era destinations**: the 4 eras from `loadSiteData().eras`, in timeline order.
  - `href`: `/#korszak-<era.id>`
  - Label: the era id with an en dash, e.g. `1914–1938`.
  - Accessible name: `<label>: <era.title>`.
  - Group: "Korszakok".
- **Page destinations**: Építők (`/epitok/`), Névadó (`/nevado/`) and Impresszum (`/impresszum/`), in that order. Group: "Oldalak".
- **Rule**: exactly 7 destinations. There are no additions, renames or reordering (spec assumption).

## Menu panel state (small screens only)

- **States**: `closed` → `open` → `closed`.
- **Opens** on the Menü button.
- **Closes** on:
  - the Menü button
  - Escape
  - a tap or click outside the panel
  - a link inside it (with JavaScript)
  - crossing the 900 px breakpoint (with JavaScript)
- **Rule**: from 900 px up, the panel is always shown as the inline row and has no open or closed state.

## Era highlight

- **Value**: the index of the era being read (0–3) or `none`.
- **Derived from** the viewport position of the 4 era openers: the last opener whose top is at or above the reading line (the opener's scroll margin, header height + 1rem, plus 8 px). If no opener qualifies, the value is `none`.
- **Shown as** `aria-current="location"` on exactly one era link, or on none.
- **Exists only** on the home page with JavaScript. Elsewhere the value is always `none`.
- **Rule**: it never coexists on the same link with `aria-current="page"`, since era links are never the current page.
