import { describe, expect, it } from 'vitest';
import { CATEGORY_DISPLAY } from '../../src/lib/icons.ts';
import {
  SCOPE_LABELS,
  SCOPES,
  categoriesFor,
  initialScope,
  narrowestScopeFor,
  parseStoredScope,
  scopeCounts,
} from '../../src/lib/timeline/scope.ts';

describe('timeline scope', () => {
  it('orders the scopes from the house outwards', () => {
    expect(SCOPES).toEqual(['house', 'area', 'hungary', 'world']);
  });

  it('shows each scope together with every narrower one', () => {
    expect(categoriesFor('house')).toEqual(['house']);
    expect(categoriesFor('area')).toEqual(['house', 'area']);
    expect(categoriesFor('hungary')).toEqual(['house', 'area', 'hungary']);
    expect(categoriesFor('world')).toEqual(['house', 'area', 'hungary', 'world']);
  });

  it('finds the narrowest scope that shows a category', () => {
    for (const category of SCOPES) expect(categoriesFor(narrowestScopeFor(category))).toContain(category);
    expect(narrowestScopeFor('house')).toBe('house');
    expect(narrowestScopeFor('world')).toBe('world');
  });

  it('counts events cumulatively', () => {
    const events = [
      { category: 'house' as const },
      { category: 'house' as const },
      { category: 'area' as const },
      { category: 'world' as const },
      { category: 'world' as const },
      { category: 'world' as const },
    ];
    expect(scopeCounts(events)).toEqual({ house: 2, area: 3, hungary: 3, world: 6 });
  });

  it('accepts only exact stored scope values', () => {
    for (const value of [null, '', 'budapest', 'World']) expect(parseStoredScope(value)).toBeUndefined();
    expect(parseStoredScope('hungary')).toBe('hungary');
  });

  it('uses a stored scope only with consent', () => {
    expect(initialScope({ consent: 'granted', stored: 'world' })).toBe('world');
    expect(initialScope({ consent: 'granted', stored: 'budapest' })).toBe('area');
    expect(initialScope({ consent: 'granted', stored: null })).toBe('area');
    expect(initialScope({ consent: 'denied', stored: 'world' })).toBe('area');
    expect(initialScope({ consent: 'ask', stored: 'world' })).toBe('area');
  });

  it('labels the scopes like the legend, with the house shortened', () => {
    expect(SCOPE_LABELS).toEqual({ house: 'Ház', area: 'Környék', hungary: 'Magyarország', world: 'Világ' });
    for (const scope of ['area', 'hungary', 'world'] as const) expect(SCOPE_LABELS[scope]).toBe(CATEGORY_DISPLAY[scope].label);
  });
});
