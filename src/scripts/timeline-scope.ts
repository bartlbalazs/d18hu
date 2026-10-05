// Progressive enhancement only: the inline script in ScopeSlider.astro has already set the starting scope,
// and CSS does the hiding. This script moves the slider, keeps the reader's place, widens for links and,
// with statistics consent, remembers the setting.
import { CONSENT_STORAGE_KEY, resolveConsent, type ConsentState } from '../lib/statistics/consent.ts';
import {
  DEFAULT_SCOPE,
  SCOPE_LABELS,
  SCOPE_STORAGE_KEY,
  SCOPES,
  narrowestScopeFor,
  parseStoredScope,
  type Scope,
} from '../lib/timeline/scope.ts';
import type { Category } from '../lib/timeline/types.ts';

const panel = document.getElementById('ido-latomezo');
const range = panel?.querySelector<HTMLInputElement>('.scope__range');

if (panel && range) {
  const root = document.documentElement;
  const status = panel.querySelector<HTMLElement>('[data-scope-status]');
  const events = [...document.querySelectorAll<HTMLElement>('.event')];
  // Music cards are timeline rows too, but not events: they don't count in the announcement.
  const historyEvents = events.filter((event) => !event.classList.contains('event--music'));
  const isRendered = (element: Element) => element.getClientRects().length > 0;
  const headerLine = () => parseFloat(getComputedStyle(root).getPropertyValue('--header-height')) + 8;

  let current: Scope = parseStoredScope(root.dataset.scope ?? null) ?? DEFAULT_SCOPE;

  let consent: ConsentState;
  try {
    consent = resolveConsent(localStorage.getItem(CONSENT_STORAGE_KEY), {
      gpc: navigator.globalPrivacyControl,
      dnt: navigator.doNotTrack,
    });
  } catch {
    consent = 'denied';
  }

  // Removal on withdrawal is done by statistics.ts, which runs on every page.
  const store = () => {
    if (consent !== 'granted') return;
    try {
      localStorage.setItem(SCOPE_STORAGE_KEY, current);
    } catch {
      // Storage became unavailable: the setting still applies to this page.
    }
  };

  const syncRange = () => {
    range.value = String(SCOPES.indexOf(current));
    range.setAttribute('aria-valuetext', SCOPE_LABELS[current]);
  };

  // The first event still below the sticky header is what the reader is looking at.
  const readingAnchor = () => {
    const line = headerLine();
    const anchor = events.find((event) => isRendered(event) && event.getBoundingClientRect().bottom > line);
    return anchor ? { anchor, top: anchor.getBoundingClientRect().top } : undefined;
  };

  const restore = (reading: ReturnType<typeof readingAnchor>) => {
    if (!reading) return;
    if (isRendered(reading.anchor)) {
      window.scrollBy({ top: reading.anchor.getBoundingClientRect().top - reading.top, behavior: 'instant' });
      return;
    }
    const index = events.indexOf(reading.anchor);
    const nearest =
      events.slice(index + 1).find(isRendered) ?? events.slice(0, index).reverse().find(isRendered);
    if (nearest) window.scrollBy({ top: nearest.getBoundingClientRect().top - headerLine(), behavior: 'instant' });
  };

  const apply = (scope: Scope, { announce = false } = {}) => {
    if (scope === current) return;
    const reading = readingAnchor();
    current = scope;
    root.dataset.scope = scope;
    restore(reading);
    syncRange();
    store();
    scheduleVisibility();
    if (announce && status) status.textContent = `${SCOPE_LABELS[scope]}: ${historyEvents.filter(isRendered).length} esemény`;
  };

  range.addEventListener('input', () => apply(SCOPES[Number(range.value)], { announce: true }));

  panel.querySelector('.scope__ticks')?.addEventListener('click', (event) => {
    const tick = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-scope-step]') : null;
    if (tick) apply(SCOPES[Number(tick.dataset.scopeStep)], { announce: true });
  });

  // The browser can't scroll to a hidden event, so widen just enough to show it, then scroll.
  const revealLinkedEvent = () => {
    const target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
    const event = target?.closest<HTMLElement>('.event');
    if (!target || !event || isRendered(event)) return;
    const needed = narrowestScopeFor(event.dataset.category as Category);
    if (SCOPES.indexOf(needed) > SCOPES.indexOf(current)) {
      current = needed;
      root.dataset.scope = needed;
      syncRange();
      store();
    }
    target.scrollIntoView();
  };

  document.addEventListener('d18:consent', (event) => {
    consent = (event as CustomEvent<ConsentState>).detail;
    store();
  });

  // Wide: the panel shows while an era's events fill its height, so it steps aside over the chapter openers
  // and stops before the closing. Narrow: the round button shows while the timeline is on screen.
  const toggle = document.querySelector<HTMLElement>('.scope-toggle');
  const sections = [...document.querySelectorAll<HTMLElement>('.era-events')];
  const wide = window.matchMedia('(min-width: 1100px)');
  const toggleArea = parseFloat(getComputedStyle(root).fontSize) * 5;
  let frameRequested = false;

  const updateVisibility = () => {
    frameRequested = false;
    if (sections.length === 0) return;
    if (wide.matches) {
      const { top, bottom } = panel.getBoundingClientRect();
      const covered = sections.some((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= top && rect.bottom >= bottom;
      });
      panel.dataset.visible = String(covered);
      toggle?.removeAttribute('data-visible');
    } else {
      const onScreen =
        sections[0].getBoundingClientRect().top < innerHeight &&
        sections[sections.length - 1].getBoundingClientRect().bottom > innerHeight - toggleArea;
      toggle?.setAttribute('data-visible', String(onScreen));
      panel.removeAttribute('data-visible');
    }
  };

  const scheduleVisibility = () => {
    if (frameRequested) return;
    frameRequested = true;
    requestAnimationFrame(updateVisibility);
  };

  // From 1100px the panel is always open beside the timeline; don't leave it stuck in the top layer.
  wide.addEventListener('change', () => {
    if (wide.matches && panel.matches(':popover-open')) panel.hidePopover();
    scheduleVisibility();
  });
  window.addEventListener('scroll', scheduleVisibility, { passive: true });
  window.addEventListener('resize', scheduleVisibility);
  window.addEventListener('load', scheduleVisibility);

  syncRange();
  revealLinkedEvent();
  window.addEventListener('hashchange', revealLinkedEvent);
  updateVisibility();
}
