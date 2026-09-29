# Contract: Timeline closing markup and styles

## Built HTML (`dist/index.html` only)

```html
    …last <section class="container era-events" …> … </section>
<section class="container timeline-closing" aria-labelledby="tortenet-folytatodik">
  <h2 id="tortenet-folytatodik">A történet folytatódik</h2>
  <p>A hatvanas évek után jóval kevesebb nyilvános forrás maradt fenn. Az újabb évtizedek történeteit ezért leginkább azok őrzik, akik a házban éltek vagy ma is itt laknak.</p>
  <p>Ha Ön vagy családtagja lakott itt, esetleg van régi fényképe, dokumentuma vagy története a házról, <a href="/impresszum/">írjon</a>.</p>
</section>
</main>
```

- It has no `<hr>`, `<img>`, `<svg>`, `<button>`, or any year or `<time>`.
- `id="tortenet-folytatodik"` appears once, and no other page contains `timeline-closing`.

## Styles

| Selector | Contract |
|---|---|
| `ol.timeline.timeline--ends` | Only on the final era's list. Its own `::before` axis is not drawn. |
| `.timeline--ends .event::before` | The row's axis segment, at the same horizontal position as today's `.timeline::before` (mobile and ≥ 760 px). |
| `.timeline--ends .event:last-child::before` | Ends at the centre of that row's `.event__node`. Nothing of the axis is drawn below it. |
| `.timeline-closing` | `margin-top` ≥ 5 rem, `text-align: center`, no background, border or box-shadow. |
| `.timeline-closing::before` | 1 px × 4.5 rem, `--d18-sand`, centred, 2 rem above the heading. Decorative, so it has no content text. |
| `.timeline-closing > *` | `max-width: 36rem`, centred. |
