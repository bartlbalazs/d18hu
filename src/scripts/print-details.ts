// Closed disclosures (the Lakók name lists, the music cards' sources, the events' source criticism) would print
// as their summary line only, so open them for printing and close the same ones again afterwards. CSS covers
// browsers with ::details-content.
let openedForPrint: HTMLDetailsElement[] = [];

window.addEventListener('beforeprint', () => {
  openedForPrint = [...document.querySelectorAll<HTMLDetailsElement>(
    'details.name-list:not([open]), details.music__sources:not([open]), details.event__criticism:not([open])',
  )];
  for (const list of openedForPrint) list.open = true;
});

window.addEventListener('afterprint', () => {
  for (const list of openedForPrint) list.open = false;
  openedForPrint = [];
});
