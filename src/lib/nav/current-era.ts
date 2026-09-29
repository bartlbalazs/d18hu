/**
 * The era being read: the last era opener whose top has reached the reading line just below the
 * sticky header, or null while the visitor is still above the first era.
 * `openerTops` are viewport positions in document order, so they are ascending.
 */
export function currentEraIndex(openerTops: number[], readingLine: number): number | null {
  let current: number | null = null;
  for (const [index, top] of openerTops.entries()) {
    if (top <= readingLine) current = index;
  }
  return current;
}
