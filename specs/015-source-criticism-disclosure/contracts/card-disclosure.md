# Contract: the „Forráskritika és pontosítások” disclosure on an event card

## Markup (rendered only when `sourceCriticismHtml` exists)

```html
<article class="event__body" …>
  <p class="event__meta kicker">…</p>
  <h4 class="event__title" …>…</h4>
  <p class="event__text">…shortened description…</p>
  <!-- optional blockquote.document-highlight, optional figure (unchanged) -->
  <details class="event__criticism">
    <summary class="event__criticism-toggle">
      Forráskritika és pontosítások<span class="visually-hidden"> – {title or date label}</span>
    </summary>
    <div class="event__criticism-body">
      <p>…paragraph 1…</p>
      <p>…paragraph 2…</p>
    </div>
  </details>
  <p class="event__sources">…unchanged…</p>
</article>
```

Invariants checked by the site tests:
- At most one `details.event__criticism` per event card, and exactly one when the event has notes.
- No `open` and no `name` attribute.
- The visible summary text is exactly `Forráskritika és pontosítások`.
- `p.event__sources` is never inside the disclosure and comes after it.
- Cards without notes contain no `event__criticism`.
- The number of disclosures equals the number of events with `sourceCriticism`.

## Behaviour

| Interaction | Result |
|---|---|
| Page load | Closed |
| Click, tap, or Enter/Space on the focused summary | Toggles this card only |
| Opening a second card | Both stay open |
| Scope slider change | The state is kept; a hidden card keeps its state for when it reappears |
| Toggle | No programmatic scroll; only the card's own height changes |
| JavaScript off | Works the same |
| Print | All notes are printed open; the chevron is hidden |

## Styling

- **Summary:**
  - full card width, `min-height: 44px`;
  - walnut text, 600 weight, about 0.94 rem;
  - a 1px top rule in the card's existing border colour;
  - a chevron drawn in CSS, pointing down when closed and rotated when open;
  - no browser marker.
- **Colour states:** hover, ink; focus-visible, the site's focus ring. No warning or error colours, and no icon.
- **Body:** card text size, muted ink, `max-width: 62ch`, paragraph spacing as in `.event__text`. Links use the site's link style.
- **Transitions:** colour and rotation only, under `prefers-reduced-motion: no-preference`. There is no height animation.
- **Mobile:** no overflow at 320 px. The sticky slider never covers the toggle, because it's in normal flow inside the card.
