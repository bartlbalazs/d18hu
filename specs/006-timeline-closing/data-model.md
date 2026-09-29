# Data model: Closing section

There is no data model: this feature adds no content data, editorial fields or state.

## Closing block (static text)

| Part | Value (verbatim) | Rule |
|---|---|---|
| Heading (`h2`) | „A történet folytatódik” | exactly once, on the home page only |
| Paragraph 1 | „A hatvanas évek után jóval kevesebb nyilvános forrás maradt fenn. Az újabb évtizedek történeteit ezért leginkább azok őrzik, akik a házban éltek vagy ma is itt laknak.” | plain text |
| Paragraph 2 | „Ha Ön vagy családtagja lakott itt, esetleg van régi fényképe, dokumentuma vagy története a házról, írjon.” | only „írjon” is a link, to `/impresszum/`, and the final full stop is outside the link |

Position: after the last `section.era-events`, inside `<main>`, and before the footer.
