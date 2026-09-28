import {
  ArrowDown,
  CircleCheck,
  CircleDot,
  CircleHelp,
  Earth,
  ExternalLink,
  Flag,
  House,
  MapPin,
  ZoomIn,
} from 'lucide-static';
import type { Category, Confidence } from './timeline/types.ts';

/** Lucide SVG markup prepared for inlining as decoration: sized by CSS, hidden from assistive tech. */
function decorative(svg: string): string {
  return svg
    .replace(/\s+/g, ' ')
    .replace(/class="[^"]*"/, 'class="icon" aria-hidden="true" focusable="false"')
    .replace(/ width="24" height="24"/, '')
    .trim();
}

export const icons = {
  arrowDown: decorative(ArrowDown),
  externalLink: decorative(ExternalLink),
  zoomIn: decorative(ZoomIn),
};

export const CATEGORY_DISPLAY: Record<Category, { label: string; icon: string }> = {
  house: { label: 'A ház', icon: decorative(House) },
  area: { label: 'Környék', icon: decorative(MapPin) },
  hungary: { label: 'Magyarország', icon: decorative(Flag) },
  world: { label: 'Világ', icon: decorative(Earth) },
};

export const CONFIDENCE_DISPLAY: Record<NonNullable<Confidence>, { label: string; icon: string; explanation: string }> = {
  verified: {
    label: 'Igazolt',
    icon: decorative(CircleCheck),
    explanation: 'Az állítás konkrét címét, eseményét vagy képét korabeli dokumentum, közvetlen digitális kép vagy azonosítható első kézből származó tanúságtétel támasztja alá.',
  },
  probable: {
    label: 'Valószínű',
    icon: decorative(CircleDot),
    explanation: 'Erős, de közvetett vagy ellenőrzésre szoruló adat.',
  },
  hypothesis: {
    label: 'Feltételezés',
    icon: decorative(CircleHelp),
    explanation: 'Munkahipotézis vagy egymásnak ellentmondó attribúció.',
  },
};
