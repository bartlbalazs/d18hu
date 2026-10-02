# Contract: built pages

## Home page (`dist/index.html`)

### Markup

- **No events removed**: all 135 `li.event` elements are still present, with their `data-category` (FR-009).
- **Inline script before the timeline**: one inline script runs before the first `.era-opener`. It sets `document.documentElement.dataset.scope`, and it reads `d18-statisztika` and `d18-idovonal` inside `try`.
- **The panel** (`#ido-latomezo`, inside `<main>`, between the Jelmagyarázat and the first chapter opener) has `popover="auto"` and contains:
  - the question "Milyen messzire nézzünk a háztól?", with an `id` that the range input's `aria-labelledby` points to
  - `input type="range"` with `min="0"`, `max="3"`, `step="1"`, `value="1"` and `aria-valuetext="Környék"`
  - four tick labels in order, Ház · Környék · Magyarország · Világ, each with the same SVG icon as the matching Jelmagyarázat category
  - the explanation "A csúszka tágítja a történet látómezejét: a háztól egészen a világ eseményeiig."
  - one `aria-live="polite"` element
- **The round button**: one `button` with `popovertarget="ido-latomezo"` and an accessible name, "Milyen messzire nézzünk a háztól?". It contains the four icons.
- **Era counts**: each era's kicker contains four `[data-scope-count]` spans (`house`, `area`, `hungary`, `world`). Their numbers equal that era's cumulative counts computed from `input/timeline.md` (see [data-model.md](../data-model.md)).
- **Jelmagyarázat**: it ends with a group headed "Milyen messzire nézzünk a háztól?". Proposed text, which the owner may edit:

  > Az idővonal mellett – keskeny képernyőn a jobb alsó sarokban lévő gombbal – beállíthatja, milyen messzire nézzünk a háztól. A négy fokozat: Ház, Környék, Magyarország, Világ. Minden fokozat az előzőt is tartalmazza, így a csúszka a háztól egészen a világ eseményeiig tágítja a történet látómezejét.

### CSS (checked in the built stylesheet)

- **Hiding events**: `html[data-scope="house"]`, `[data-scope="area"]` and `[data-scope="hungary"]` hide the `.event` rows outside the scope.
- **Hiding the controls**: without `html[data-scope]`, the panel and the round button are not displayed.
- **Print**: `@media print` hides the panel and the round button.

## Every page (`Base.astro`)

The consent notice text adds one sentence (FR-019). Proposed:

> Ha hozzájárul, azt is megjegyezzük a böngészőjében, milyen messzire állította az idővonal csúszkáját.

## Impresszum (`#adatkezeles`)

- **Opening paragraph**: one sentence is added, saying that with consent the timeline setting is also stored in the visitor's browser.
- **Stored data**: a new `dt`/`dd` pair. Proposed:

  > **Idővonal-beállítás** – Hozzájárulás esetén a böngészője megjegyzi, melyik fokozatot választotta az idővonal csúszkáján (d18-idovonal). Ez nem jut el hozzánk vagy a Google-hoz, és a hozzájárulás visszavonásakor töröljük.

## Other pages

They have no `#ido-latomezo`, no `[data-scope-count]` and no scope script.
