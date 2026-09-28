# Contract: Timeline source (`input/timeline.md`)

The research file is owned by the historian. The build reads it and never writes to it. This
contract states what the parser accepts; anything else fails the build with
`TimelineParseError` (era, row number, reason).

## Document structure

1. Any preamble before the first era heading (title, legend paragraphs) is ignored.
2. Exactly **four** era sections, in this order, each a level-2 heading ending with its
   year range:
   `## <title>, 1873–1913`, `…, 1914–1938`, `…, 1939–1945`, `…, 1946–1968`
   (en dash `–`; a hyphen `-` is accepted).
3. Each era section contains exactly one GFM table with this header, in this order:
   `| Dátum | Sáv | Esemény és jelentőség | Bizonyosság | Külső forrás | Kép URL | Cikkötlet |`
   and a separator row with **7** cells.
4. Parsing stops at the first level-2 heading after the fourth era (e.g.
   `## Nyitott kérdések és vitatott állítások`), whatever its text. Nothing from that section
   or later is published.

## Cells

| Column | Accepted values | `—` means |
|---|---|---|
| Dátum | Any non-empty text; inline bold/italic allowed | — (not allowed) |
| Sáv | `D18`, `D18 • személy`, `Környék`, `Magyarország`, `Világ` | — (not allowed) |
| Esemény és jelentőség | Text with inline bold, italic, code, links | — (not allowed) |
| Bizonyosság | `Igazolt`, `Valószínű`, `Feltételezés`, `—` | no certainty mark |
| Külső forrás | One or more Markdown links `[label](https://…)`, separated by `;` `,` `/` or spaces | no source link |
| Kép URL | One direct `https://` image file URL (not a collection landing page), or a repository path to a JPEG/PNG/WebP under `assets/` (e.g. `assets/events/kapu.jpg`) | no image |
| Cikkötlet | Any text (editorial only, never published) | none |

`—` is U+2014 EM DASH. An empty cell is treated like `—` only in optional columns.

## Guarantees to the author

- Adding, removing or reordering rows never changes other events' ids.
- Editing a row's date or the first four words of its description changes **that** event's id;
  the build then lists the now-orphaned editorial entries so they can be re-keyed.
- Wording in the date and description cells is published exactly as written.
