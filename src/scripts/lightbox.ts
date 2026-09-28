// Progressive enhancement only: without JS, each preview is a plain link to the local full-size image.
import PhotoSwipeLightbox from 'photoswipe/lightbox';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Every figure is its own gallery, so a single image never shows previous/next controls.
const lightbox = new PhotoSwipeLightbox({
  gallery: '.evidence',
  children: 'a[data-pswp-width]',
  pswpModule: () => import('./photoswipe-core.ts'),
  showHideAnimationType: reducedMotion ? 'none' : 'fade',
  bgOpacity: 0.92,
  closeTitle: 'Bezárás (Esc)',
  zoomTitle: 'Nagyítás',
  arrowPrevTitle: 'Előző',
  arrowNextTitle: 'Következő',
  errorMsg: 'A kép nem tölthető be.',
});
lightbox.init();
