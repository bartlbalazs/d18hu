// Progressive enhancement only: without JS the notice and settings buttons stay hidden and nothing
// is measured. Google's tag is added only after the visitor accepts (Consent Mode "basic").
import { CONSENT_STORAGE_KEY, resolveConsent, type ConsentState } from '../lib/statistics/consent.ts';
import { statisticsEventFor } from '../lib/statistics/events.ts';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
  interface Navigator {
    globalPrivacyControl?: boolean;
  }
}

const notice = document.getElementById('statisztika');
const measurementId = notice?.dataset.measurementId;

if (notice && measurementId && location.hostname === notice.dataset.siteHost) {
  const heading = notice.querySelector<HTMLElement>('#statisztika-cim');
  const status = notice.querySelector<HTMLElement>('[data-consent-status]');
  const acceptButton = notice.querySelector<HTMLButtonElement>('[data-consent="granted"]');
  const settingsButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-consent-settings]')];
  const hasBrowserSignal = navigator.globalPrivacyControl === true || navigator.doNotTrack === '1';

  let storageAvailable = true;
  let stored: string | null | Error;
  try {
    stored = localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch (error) {
    storageAvailable = false;
    stored = error instanceof Error ? error : new Error(String(error));
  }

  let consent: ConsentState = resolveConsent(stored, {
    gpc: navigator.globalPrivacyControl,
    dnt: navigator.doNotTrack,
  });
  let tagLoaded = false;
  let settingsOpener: HTMLElement | undefined;

  const loadTag = () => {
    if (tagLoaded) return;
    tagLoaded = true;
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = function gtag() {
      // gtag.js expects the Arguments object itself, not an array.
      window.dataLayer!.push(arguments);
    };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 34128000, // 395 days
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.append(script);
  };

  const loadTagWhenIdle = () => {
    const start = () => ('requestIdleCallback' in window ? requestIdleCallback(loadTag) : setTimeout(loadTag, 1));
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
  };

  const deleteAnalyticsCookies = () => {
    const hostParts = location.hostname.split('.');
    const domains = ['', location.hostname, `.${location.hostname}`];
    if (hostParts.length > 2) domains.push(`.${hostParts.slice(1).join('.')}`);
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.split('=')[0].trim();
      if (name !== '_ga' && !name.startsWith('_ga_')) continue;
      for (const domain of domains) {
        const domainPart = domain ? `; domain=${domain}` : '';
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domainPart}`;
      }
    }
  };

  const withdraw = () => {
    (window as unknown as Record<string, boolean>)[`ga-disable-${measurementId}`] = true;
    window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
    deleteAnalyticsCookies();
  };

  // Space below the page, so the fixed notice never covers the end of the page or the footer.
  const showNotice = () => {
    notice.hidden = false;
    document.body.style.paddingBottom = `${notice.offsetHeight}px`;
  };

  const hideNotice = () => {
    const hadFocus = notice.contains(document.activeElement);
    notice.hidden = true;
    document.body.style.paddingBottom = '';
    // Return focus only to the settings button that reopened the notice, never scrolling the page:
    // after the first-visit notice, the reader stays where they are.
    if (hadFocus) settingsOpener?.focus({ preventScroll: true });
  };

  const choose = (choice: 'granted' | 'denied') => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    } catch {
      // Storage became unavailable: the choice still applies to this page.
    }
    const previous = consent;
    consent = choice;
    if (choice === 'granted') {
      if (tagLoaded) {
        delete (window as unknown as Record<string, boolean>)[`ga-disable-${measurementId}`];
        window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
      } else {
        loadTag();
      }
    } else if (previous === 'granted') {
      withdraw();
    }
    hideNotice();
  };

  const openSettings = (event: MouseEvent) => {
    settingsOpener = event.currentTarget instanceof HTMLElement ? event.currentTarget : undefined;
    if (status) {
      if (hasBrowserSignal) {
        status.textContent =
          'A böngészője kérte, hogy ne mérjük a látogatását, ezért a statisztika ki van kapcsolva.';
      } else {
        status.textContent = consent === 'granted' ? 'Jelenleg: engedélyezve' : 'Jelenleg: elutasítva';
      }
    }
    if (acceptButton) acceptButton.hidden = hasBrowserSignal;
    showNotice();
    heading?.focus({ preventScroll: true });
  };

  notice.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-consent]') : null;
    const choice = button?.dataset.consent;
    if (choice === 'granted' || choice === 'denied') choose(choice);
  });

  // Events queue in dataLayer until gtag.js arrives, so a click right after accepting still counts.
  document.addEventListener('click', (event) => {
    if (consent !== 'granted' || !window.gtag) return;
    const link = event.target instanceof Element ? event.target.closest('a') : null;
    if (!link) return;
    const isPlainClick = event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
    // A modified click opens the full-size image in a new tab instead of the zoom viewer.
    if (link.dataset.statImage && !isPlainClick) return;
    const reading = statisticsEventFor({
      href: link.href,
      dataset: link.dataset,
      inMenu: link.closest('#fomenu') !== null,
      inContent: link.closest('main') !== null,
      eventId: link.closest<HTMLElement>('[data-event-id]')?.dataset.eventId,
      pagePath: location.pathname,
      siteOrigin: location.origin,
    });
    if (reading) window.gtag('event', reading.name, reading.params);
  });

  if (storageAvailable) {
    for (const button of settingsButtons) {
      button.hidden = false;
      button.addEventListener('click', openSettings);
    }
  }

  if (consent === 'ask') showNotice();
  else if (consent === 'granted') loadTagWhenIdle();
}
