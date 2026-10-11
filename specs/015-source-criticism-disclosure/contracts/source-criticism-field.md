# Contract: `sourceCriticism` in `editorial/events.yaml`

## Shape

```yaml
1929-uhereczky-ferenc-muszeresz-mester:      # existing event id key (illustrative)
  title: Elektromos sebességváltó, bejelentve
  sourceCriticism:
    - "A *Szabadalmi Közlöny* U. 765-ös száma a bejelentés alapszáma, nem a megadott szabadalom lajstromszáma. A közlemény nem igazolja, hogy oltalmat adtak, sem azt, hogy működő sebességváltó készült."
    - "Arra sincs bizonyíték, hogy a szerkezetet beépítették az Uhereczkynek tulajdonított kisautóba. A bejelentésben nincs Dembinszky utcai cím, ezért a személyazonosság következtetés."
  image: { … unchanged … }
```

## Author rules

1. Add the field only when the event has real source-critical material:
   - conflicting dates, names or readings;
   - identification arguments;
   - the limits of a document type;
   - the viewpoint of a press report, advertisement or official notice;
   - court-case stages;
   - illegible or missing data;
   - research chronology;
   - negative results.

   Don't add it to make a card shorter by hiding story content, and never add an empty or template note.
2. Write 1–3 short paragraphs, more only when the material demands it. Each list item is one paragraph.
3. Don't repeat the visible caution word for word. The visible text gives the short limit, and the note gives the reasoning.
4. Source links stay in the timeline row's `Külső forrás` cell. A note may link to a source inline, but must not replace or move any link from the Forrás cell.
5. Certainty stays in the `Bizonyosság` column, and images, captions and credits stay in `image`. None of them are restated as the note's job.
6. The visible description in `input/timeline.md` must keep its first four words, which form the event id ([R3](../research.md#r3-keeping-event-ids-and-anchors)).

## Build behaviour

| Input | Result |
|---|---|
| Field absent | No disclosure is rendered |
| `sourceCriticism: []` | Schema error: at least one paragraph is required |
| Empty or whitespace-only item | Schema error |
| An item with two Markdown blocks (blank line, list, heading) | Build error naming the event id and the item index |
| Raw HTML other than `<br>`, or a non-https/non-site-path link | Build error naming the event id and the item index |
| Key matches no event | Existing `OrphanedEditorialEntryError` |

## Compatibility

The field is optional and additive. The 001 editorial-metadata contract gains a line describing it.
