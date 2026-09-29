// Progressive enhancement only: without JS the Menü popover still opens and closes natively,
// and no era is highlighted.
import { currentEraIndex } from '../lib/nav/current-era.ts';

const menu = document.getElementById('fomenu');

if (menu && 'showPopover' in HTMLElement.prototype) {
  const isOpen = () => menu.matches(':popover-open');

  // An era link only scrolls the page, so close the panel that would otherwise cover it.
  menu.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a') && isOpen()) menu.hidePopover();
  });

  // From 900px the panel is the inline row; don't leave it stuck open in the top layer.
  window.matchMedia('(min-width: 900px)').addEventListener('change', () => {
    if (isOpen()) menu.hidePopover();
  });
}

const openers = [...document.querySelectorAll<HTMLElement>('.era-opener[id^="korszak-"]')];

if (menu && openers.length > 0) {
  const eraLinks = openers.map((opener) => menu.querySelector<HTMLAnchorElement>(`a[href="/#${opener.id}"]`));
  let frameRequested = false;

  const update = () => {
    frameRequested = false;
    // Where an era link scrolls an opener to (below the sticky header, by its scroll margin),
    // with a few pixels of slack because the browser can stop a fraction of a pixel short.
    const readingLine = parseFloat(getComputedStyle(openers[0]).scrollMarginTop) + 8;
    const current = currentEraIndex(
      openers.map((opener) => opener.getBoundingClientRect().top),
      readingLine,
    );
    eraLinks.forEach((link, index) => {
      if (!link) return;
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const scheduleUpdate = () => {
    if (frameRequested) return;
    frameRequested = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('hashchange', scheduleUpdate);
  window.addEventListener('load', scheduleUpdate);
  scheduleUpdate();
}
