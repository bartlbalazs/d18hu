// Progressive enhancement only: without JS each music card links to the recording instead. Nothing is loaded
// from YouTube until a „Meghallgatom” press, which counts as consent to that one embed (constitution IV).
// The page holds at most one iframe, and another song is loaded into that same iframe. It is driven through
// the embed's postMessage commands, so no YouTube API script is loaded on top of it.

type Song = {
  year: string;
  title: string;
  credit: string;
  artist: string;
  youtubeId: string;
  youtubeUrl: string;
  button: HTMLButtonElement;
  card: HTMLElement;
};

type PlayerState = 'idle' | 'loading' | 'playing' | 'paused' | 'failed';

const EMBED_ORIGIN = 'https://www.youtube-nocookie.com';
const ANSWER_TIMEOUT_MS = 5000;
const START_TIMEOUT_MS = 3000;
const HANDSHAKE_INTERVAL_MS = 250;
const HIGHLIGHT_MS = 1600;
// The embed's own player states.
const YT_ENDED = 0;
const YT_PLAYING = 1;
const YT_PAUSED = 2;

const player = document.querySelector<HTMLElement>('[data-music-player]');

if (player) {
  const root = document.documentElement;
  const yearField = player.querySelector<HTMLElement>('[data-music-player-year]')!;
  const titleField = player.querySelector<HTMLElement>('[data-music-player-title]')!;
  const creditField = player.querySelector<HTMLElement>('[data-music-player-credit]')!;
  const artistField = player.querySelector<HTMLElement>('[data-music-player-artist]')!;
  const videoArea = player.querySelector<HTMLElement>('[data-music-player-video]')!;
  const errorText = player.querySelector<HTMLElement>('[data-music-player-error]')!;
  const toggleButton = player.querySelector<HTMLButtonElement>('[data-music-toggle]')!;
  const jumpButton = player.querySelector<HTMLButtonElement>('[data-music-jump]')!;
  const jumpTarget = jumpButton.querySelector<HTMLElement>('[data-music-jump-target]')!;
  const externalLink = player.querySelector<HTMLAnchorElement>('[data-music-external]')!;
  const closeButton = player.querySelector<HTMLButtonElement>('[data-music-close]')!;
  const status = player.querySelector<HTMLElement>('[data-music-status]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let state: PlayerState = 'idle';
  let current: Song | undefined;
  let iframe: HTMLIFrameElement | undefined;
  // Set by the loaded song's onReady. Until then, messages may still come from the previous song's page.
  let ready = false;
  let announcedFor: Song | undefined;
  let answerTimer: number | undefined;
  let startTimer: number | undefined;
  let handshakeTimer: number | undefined;
  let highlightTimer: number | undefined;

  const resizeObserver = new ResizeObserver(() => {
    root.style.setProperty('--music-player-height', `${player.offsetHeight}px`);
  });

  const songFrom = (button: HTMLButtonElement): Song => ({
    year: button.dataset.musicYear ?? '',
    title: button.dataset.musicTitle ?? '',
    credit: button.dataset.musicCredit ?? '',
    artist: button.dataset.musicArtist ?? '',
    youtubeId: button.dataset.musicYoutubeId ?? '',
    youtubeUrl: button.dataset.musicYoutubeUrl ?? '',
    button,
    card: button.closest<HTMLElement>('.event--music')!,
  });

  const track = (name: string) => {
    if (!current) return;
    const params = {
      year: current.year,
      title: current.title,
      artist: current.artist,
      youtube_id: current.youtubeId,
    };
    document.dispatchEvent(new CustomEvent('d18:music', { detail: { name, params } }));
  };

  const embedUrl = (id: string) =>
    `${EMBED_ORIGIN}/embed/${encodeURIComponent(id)}?enablejsapi=1&autoplay=1&playsinline=1&rel=0` +
    `&origin=${encodeURIComponent(location.origin)}`;

  const post = (message: object) => iframe?.contentWindow?.postMessage(JSON.stringify(message), EMBED_ORIGIN);

  const command = (func: string, args: unknown[] = []) => post({ event: 'command', func, args });

  // The embed starts sending its events once it has heard "listening"; repeat until it answers.
  const startHandshake = () => {
    window.clearInterval(handshakeTimer);
    const listen = () => post({ event: 'listening', id: 1, channel: 'widget' });
    listen();
    handshakeTimer = window.setInterval(
      () => (ready ? window.clearInterval(handshakeTimer) : listen()),
      HANDSHAKE_INTERVAL_MS,
    );
  };

  const clearTimers = () => {
    window.clearTimeout(answerTimer);
    window.clearTimeout(startTimer);
    window.clearInterval(handshakeTimer);
  };

  // No answer at all means the embed is blocked or unreachable.
  const waitForAnswer = () => {
    ready = false;
    window.clearTimeout(answerTimer);
    answerTimer = window.setTimeout(() => {
      if (!ready && current) setState('failed');
    }, ANSWER_TIMEOUT_MS);
  };

  // Some browsers (iOS Safari) refuse sound without a tap inside the frame: show it as paused, not playing.
  // Used for every start and resume, so the card never says „Most szól” while nothing plays.
  const waitForStart = () => {
    window.clearTimeout(startTimer);
    startTimer = window.setTimeout(() => {
      if (state === 'loading') setState('paused');
    }, START_TIMEOUT_MS);
  };

  // A new song reloads the one iframe rather than using loadVideoById: only a fresh load reliably reports
  // a recording that can't be embedded (onError), and it starts playing on its own.
  const loadIntoIframe = (song: Song) => {
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.addEventListener('load', startHandshake);
      videoArea.append(iframe);
    }
    iframe.title = `${song.title} (${song.year})`;
    iframe.src = embedUrl(song.youtubeId);
  };

  const showPlayer = () => {
    if (!player.hidden) return;
    player.hidden = false;
    document.body.classList.add('music-player-visible');
    resizeObserver.observe(player);
  };

  const hidePlayer = () => {
    player.hidden = true;
    document.body.classList.remove('music-player-visible');
    resizeObserver.disconnect();
    root.style.removeProperty('--music-player-height');
  };

  const yearSuffix = (year: string) => {
    const lastDigit = year.at(-1);
    const tens = year.slice(-2);
    if (lastDigit === '0') return ['10', '40', '50', '70', '90'].includes(tens) ? '-es' : '-as';
    if (lastDigit === '3' || lastDigit === '8') return '-as';
    if (lastDigit === '5') return '-ös';
    if (lastDigit === '6') return '-os';
    return '-es';
  };

  // The button's name is its visible label plus the song title (hidden text in MusicEntry.astro),
  // so speech input can use the words on screen.
  const cardLabel = (isCurrent: boolean) => {
    if (!isCurrent || state === 'idle' || state === 'failed') return { symbol: '▷', text: 'Meghallgatom' };
    if (state === 'paused') return { symbol: '▷', text: 'Folytatás', buttonState: 'paused' };
    return { symbol: '♫', text: 'Most szól', buttonState: 'playing' };
  };

  const renderCard = (button: HTMLButtonElement) => {
    const isCurrent = current?.button === button;
    const { symbol, text, buttonState } = cardLabel(isCurrent);
    const symbolElement = button.querySelector('.music__play-symbol');
    const labelElement = button.querySelector('.music__play-label');
    if (symbolElement) symbolElement.textContent = symbol;
    if (labelElement) labelElement.textContent = text;
    if (buttonState) button.dataset.state = buttonState;
    else delete button.dataset.state;
    if (isCurrent && state === 'loading') button.setAttribute('aria-busy', 'true');
    else button.removeAttribute('aria-busy');
  };

  const render = () => {
    for (const button of document.querySelectorAll<HTMLButtonElement>('.music__play')) renderCard(button);
    player.dataset.state = state;
    if (!current) return;
    yearField.textContent = current.year;
    titleField.textContent = current.title;
    creditField.textContent = current.credit;
    artistField.textContent = `Felvétel: ${current.artist}`;
    externalLink.href = current.youtubeUrl;
    const playing = state === 'playing' || state === 'loading';
    toggleButton.setAttribute('aria-label', `${current.title} ${playing ? 'szüneteltetése' : 'lejátszása'}`);
    jumpTarget.textContent = `– vissza az ${current.year}${yearSuffix(current.year)} zenei bejegyzéshez`;
    errorText.hidden = state !== 'failed';
    videoArea.hidden = state === 'failed';
    toggleButton.hidden = state === 'failed';
  };

  function setState(next: PlayerState) {
    state = next;
    if (next === 'failed') clearTimers();
    if (next === 'playing' && current && announcedFor !== current && status) {
      announcedFor = current;
      status.textContent = `Most szól: ${current.title}, ${current.year}`;
    }
    if (next === 'failed' && status) status.textContent = 'Ez a felvétel jelenleg nem játszható le itt.';
    render();
  }

  const start = (song: Song) => {
    // A retry of the same song after a failure is a new play, not a change of song.
    const switching = iframe !== undefined && current?.button !== song.button;
    current = song;
    announcedFor = undefined;
    loadIntoIframe(song);
    showPlayer();
    setState('loading');
    waitForAnswer();
    waitForStart();
    track(switching ? 'music_change' : 'music_play');
  };

  const play = () => {
    command('playVideo');
    setState('loading');
    waitForStart();
    track('music_play');
  };

  const pause = () => {
    command('pauseVideo');
    setState('paused');
    track('music_pause');
  };

  const close = () => {
    const last = current;
    command('pauseVideo');
    clearTimers();
    iframe?.remove();
    iframe = undefined;
    track('music_close');
    state = 'idle';
    current = undefined;
    if (status) status.textContent = '';
    render();
    hidePlayer();
    last?.button.focus({ preventScroll: true });
  };

  const jumpToCard = () => {
    if (!current) return;
    const { card } = current;
    // timeline-scope.ts widens the slider on hashchange when the card is hidden at the current setting.
    history.replaceState(null, '', `#${card.id}`);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    card.scrollIntoView({ block: 'start', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    card.classList.remove('music--highlight');
    void card.offsetWidth; // restarts the highlight animation on a repeated jump
    card.classList.add('music--highlight');
    window.clearTimeout(highlightTimer);
    highlightTimer = window.setTimeout(() => card.classList.remove('music--highlight'), HIGHLIGHT_MS);
    track('music_jump_to_timeline');
  };

  const onPlayerMessage = (event: MessageEvent) => {
    if (event.origin !== EMBED_ORIGIN || !iframe || event.source !== iframe.contentWindow) return;
    let message: { event?: string; info?: unknown };
    try {
      message = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
    } catch {
      return;
    }
    if (!message || typeof message !== 'object') return;

    const playerState =
      message.event === 'onStateChange'
        ? message.info
        : message.event === 'infoDelivery' && message.info && typeof message.info === 'object'
          ? (message.info as { playerState?: unknown }).playerState
          : undefined;

    if (message.event === 'onReady') {
      ready = true;
      window.clearTimeout(answerTimer);
    }
    if (message.event === 'onError') {
      setState('failed');
      return;
    }
    if (!ready) return;
    if (playerState === YT_PLAYING && state !== 'playing') {
      window.clearTimeout(startTimer);
      setState('playing');
    } else if ((playerState === YT_PAUSED || playerState === YT_ENDED) && state === 'playing') {
      setState('paused');
    }
  };

  document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('.music__play') : null;
    if (!button) return;
    if (current?.button === button && state !== 'failed') {
      if (state === 'playing' || state === 'loading') pause();
      else play();
      return;
    }
    start(songFrom(button));
  });

  toggleButton.addEventListener('click', () => {
    if (state === 'playing' || state === 'loading') pause();
    else play();
  });
  jumpButton.addEventListener('click', jumpToCard);
  closeButton.addEventListener('click', close);
  externalLink.addEventListener('click', () => {
    command('pauseVideo');
    if (state === 'playing') setState('paused');
    track('music_open_youtube');
  });
  window.addEventListener('message', onPlayerMessage);
}

// A music image that fails to load leaves the card in its text-only layout instead of a broken image.
document.addEventListener(
  'error',
  (event) => {
    const box = event.target instanceof HTMLImageElement ? event.target.closest<HTMLElement>('.music__media') : null;
    if (!box) return;
    box.hidden = true;
    box.closest('.music')?.classList.remove('music--with-media');
  },
  true,
);
