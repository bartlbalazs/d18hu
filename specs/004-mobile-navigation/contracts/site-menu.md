# Contract: Site header menu

## Markup, on every page

```html
<header class="site-header">
  <div class="container site-header__inner">
    <a class="brand" href="/" aria-label="Dembinszky utca 18. – kezdőlap">…</a>
    <nav aria-label="Fő navigáció">
      <button class="menu-button" type="button" popovertarget="fomenu">Menü</button>
      <div class="site-menu" id="fomenu" popover>
        <p class="site-menu__heading" id="menu-korszakok">Korszakok</p>
        <ul class="site-nav" aria-labelledby="menu-korszakok">
          <li><a href="/#korszak-1873-1913" aria-label="1873–1913: …">1873–1913</a></li>
          … 4 era links, in timeline order
        </ul>
        <p class="site-menu__heading" id="menu-oldalak">Oldalak</p>
        <ul class="site-nav site-nav--pages" aria-labelledby="menu-oldalak">
          <li><a href="/epitok/">Építők</a></li>
          <li><a href="/nevado/">Névadó</a></li>
          <li><a href="/impresszum/">Impresszum</a></li>
        </ul>
      </div>
    </nav>
  </div>
</header>
```

- **Order.** Within `nav[aria-label="Fő navigáció"]`, the links excluding `/` are the 4 era links followed by `/epitok/`, `/nevado/`, `/impresszum/`.
- **Current page.** The link to the current page carries `aria-current="page"`. No link carries `aria-current="location"` in the built HTML; only the script sets it.
- **Tap size.** The button and every link are at least 44 × 44 CSS px.

## Behaviour by width

| | < 900 px | ≥ 900 px |
|---|---|---|
| Menü button | visible, right-aligned in the one-row header | `display: none` |
| Panel | hidden until opened; then a full-width sheet directly under the header, scrollable within `100dvh − header` | always shown inline as today's single row; headings visually hidden |
| Header height (closed) | ≈ 61 px, one row | unchanged, ≈ 61 px |
| No popover support | panel shown inline under the brand, button hidden | as above |

## Keyboard and screen reader

- **Keyboard order.** Tab order is brand → Menü → (when open) each link in order.
- **Opening and closing.** Enter or Space on Menü toggles the panel. Escape closes it and returns focus to Menü.
- **Menü button.** It is announced as a button named "Menü", with its expanded or collapsed state.
- **Groups.** Each group is announced as a list with its label, "Korszakok" or "Oldalak".
- **Era highlight.** Changes to the highlight are not announced.

## `src/scripts/site-menu.ts` (progressive enhancement)

- **Closing.** Activating a link inside an open panel calls `hidePopover()`. Crossing 900 px closes any open panel.
- **Where it runs.** The era highlight runs only when `#korszak-*` era openers exist, which is the home page only.
- **Reading line.** It is the first opener's `scroll-margin-top` + 8 px, where an era link scrolls the opener to, plus slack for sub-pixel stops.
- **Highlight.** On scroll (passive, one update per animation frame), on load and on `hashchange`, the script sets `aria-current="location"` on the link of `currentEraIndex(openerTops, readingLine)`, and on no link when the result is `null`. It removes the attribute from the other era links.
- **Without the script.** Everything above works except these two enhancements.

## `currentEraIndex(openerTops: number[], readingLine: number): number | null`

- It returns the largest `i` with `openerTops[i] <= readingLine`, or `null` if there is none.
- `openerTops` is in document order, so it is ascending.

## Styles

- **Current page (`aria-current="page"`):** ink colour and an underline, as today.
- **Era being read (`aria-current="location"`):** ink colour and a filled dot in the gap before the label, placed so the row doesn't shift. In the open panel it is also `font-weight: 600`.
- **No underline for the era highlight**, so the two states differ in more than colour.
- **Reduced motion:** with `prefers-reduced-motion: reduce` there is no panel transition.
