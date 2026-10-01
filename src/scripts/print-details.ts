// Closed name lists would print as their summary line only, so open them for printing
// and close the same ones again afterwards.
let openedForPrint: HTMLDetailsElement[] = [];

window.addEventListener('beforeprint', () => {
  openedForPrint = [...document.querySelectorAll<HTMLDetailsElement>('details.name-list:not([open])')];
  for (const list of openedForPrint) list.open = true;
});

window.addEventListener('afterprint', () => {
  for (const list of openedForPrint) list.open = false;
  openedForPrint = [];
});
