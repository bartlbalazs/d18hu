import type { ConsentState } from '../statistics/consent.ts';
import type { Category } from './types.ts';

// Defined with the consent key, so the statistics script can remove it without loading this module.
export { SCOPE_STORAGE_KEY } from '../statistics/consent.ts';

/** How far the timeline looks from the house. Each scope also shows every narrower one. */
export const SCOPES = ['house', 'area', 'hungary', 'world'] as const satisfies readonly Category[];
export type Scope = (typeof SCOPES)[number];

export const DEFAULT_SCOPE: Scope = 'area';

// Kept here rather than derived from CATEGORY_DISPLAY, so the browser script doesn't pull in the icon set.
export const SCOPE_LABELS: Record<Scope, string> = {
  house: 'Ház',
  area: 'Környék',
  hungary: 'Magyarország',
  world: 'Világ',
};

export function categoriesFor(scope: Scope): Category[] {
  return SCOPES.slice(0, SCOPES.indexOf(scope) + 1);
}

/** The scope names the widest category it shows, so a category's own scope is the narrowest that includes it. */
export function narrowestScopeFor(category: Category): Scope {
  return category;
}

export function scopeCounts(events: { category: Category }[]): Record<Scope, number> {
  return Object.fromEntries(
    SCOPES.map((scope) => {
      const shown = categoriesFor(scope);
      return [scope, events.filter((event) => shown.includes(event.category)).length];
    }),
  ) as Record<Scope, number>;
}

export function parseStoredScope(value: string | null): Scope | undefined {
  return SCOPES.find((scope) => scope === value);
}

/** A stored scope counts only with consent; otherwise every visit starts at the default. */
export function initialScope({ consent, stored }: { consent: ConsentState; stored: string | null }): Scope {
  return (consent === 'granted' && parseStoredScope(stored)) || DEFAULT_SCOPE;
}
