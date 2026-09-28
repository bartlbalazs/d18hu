const ID_WORD_COUNT = 4;

/** Lower-case ASCII slug; Hungarian accents are folded (ő → o, ű → u). */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Permanent event id derived only from the event's own content, so inserting or reordering
 * other rows never changes it.
 */
export function deriveEventId(dateLabel: string, descriptionText: string): string {
  const openingWords = (descriptionText.match(/[\p{L}\p{N}]+/gu) ?? []).slice(0, ID_WORD_COUNT);
  return [slugify(dateLabel), slugify(openingWords.join(' '))].filter(Boolean).join('-');
}
