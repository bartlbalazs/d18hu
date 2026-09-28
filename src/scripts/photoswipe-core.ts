// Loaded on first image activation only. The viewer CSS is injected here (not bundled into the
// page's inline styles), so it never costs anything on the first render.
import viewerCss from 'photoswipe/style.css?inline';

const style = document.createElement('style');
style.textContent = viewerCss;
document.head.append(style);

export { default } from 'photoswipe';
