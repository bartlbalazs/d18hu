import { describe, expect, it } from 'vitest';
import { currentEraIndex } from '../../src/lib/nav/current-era.ts';

describe('currentEraIndex', () => {
  const line = 62;

  it('is null while every era opener is still below the reading line', () => {
    expect(currentEraIndex([400, 3000, 6000, 9000], line)).toBeNull();
  });

  it('picks an opener whose top is exactly on the line', () => {
    expect(currentEraIndex([-2000, 62, 3000, 6000], line)).toBe(1);
  });

  it('picks the last opener above the line between two eras', () => {
    expect(currentEraIndex([-5000, -100, 900, 4000], line)).toBe(1);
  });

  it('picks the last era at the end of the page', () => {
    expect(currentEraIndex([-9000, -6000, -3000, -400], line)).toBe(3);
  });

  it('is null without era openers', () => {
    expect(currentEraIndex([], line)).toBeNull();
  });
});
