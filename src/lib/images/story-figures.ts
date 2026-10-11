import type { ImageMetadata } from 'astro';

/** A source image on a story page (Lakók, Épület), shown at its own shape inside the reading column. */
export type StoryFigure = {
  image: ImageMetadata;
  alt: string;
  caption: string;
  credit: string;
  source?: { label: string; url: string };
  kind: 'photo' | 'document';
  size: 'narrow' | 'medium' | 'wide' | 'column';
  /** Shown above the caption, e.g. to tell apart the two pages of a split article. */
  label?: string;
  /** Anchor for links to the figure, e.g. from the source list. */
  id?: string;
};

/** Largest display width of each size class in CSS px; must match the story-figure--* rules in story.css. */
const displayWidths: Record<StoryFigure['size'], number> = { narrow: 400, medium: 480, wide: 620, column: 704 };

/** EvidenceFigure props for a story figure: never wider than the source, never cropped. */
export function figureProps(figure: StoryFigure) {
  const { size, ...props } = figure;
  const displayWidth = displayWidths[size];
  const sourceWidth = figure.image.width;
  const candidateWidths = [360, displayWidth, 2 * displayWidth].map((width) => Math.min(sourceWidth, width));
  const widths = [...new Set(candidateWidths)].sort((a, b) => a - b);
  // On a phone a strip is only about 50px tall, so the zoom button would hide its text.
  const isStrip = figure.image.width / figure.image.height > 3.5;
  const classes = [size === 'column' ? undefined : `story-figure--${size}`, isStrip ? 'story-figure--strip' : undefined];
  return {
    ...props,
    widths,
    sizes: `(min-width: ${displayWidth + 80}px) ${displayWidth}px, 100vw`,
    class: classes.filter(Boolean).join(' ') || undefined,
  };
}
