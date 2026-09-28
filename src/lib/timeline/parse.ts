import type { PhrasingContent, Root, Table, TableCell } from 'mdast';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { deriveDates } from './dates.ts';
import { deriveEventId } from './ids.ts';
import { assertHttpsUrl, InlineRenderError, renderInlineHtml, toPlainText } from './inline-html.ts';
import {
  ERA_IDS,
  SOURCE_LANES,
  type Category,
  type Confidence,
  type EraId,
  type ParsedEra,
  type ParsedEvent,
  type ParsedTimeline,
  type SourceLane,
  type SourceLink,
} from './types.ts';

export const EXPECTED_COLUMNS = [
  'Dátum',
  'Sáv',
  'Esemény és jelentőség',
  'Bizonyosság',
  'Külső forrás',
  'Kép URL',
  'Cikkötlet',
] as const;

const EMPTY = '—';
/** A Kép URL may also name an image file committed under assets/, e.g. assets/events/1903.jpg. */
export const LOCAL_IMAGE_PATH = /^assets\/(?:[\w-][\w.-]*\/)*[\w-][\w.-]*\.(?:jpe?g|png|webp)$/i;

const CATEGORY_BY_LANE: Record<SourceLane, Category> = {
  D18: 'house',
  'D18 • személy': 'house',
  Környék: 'area',
  Magyarország: 'hungary',
  Világ: 'world',
};

const CONFIDENCE_BY_LABEL: Record<string, Confidence> = {
  Igazolt: 'verified',
  Valószínű: 'probable',
  Feltételezés: 'hypothesis',
  [EMPTY]: null,
};

export class TimelineParseError extends Error {
  constructor(message: string, location?: { era?: string; row?: number }) {
    const where = [location?.era && `era ${location.era}`, location?.row && `row ${location.row}`]
      .filter(Boolean)
      .join(', ');
    super(where ? `${where}: ${message}` : message);
    this.name = 'TimelineParseError';
  }
}

export class DuplicateEventIdError extends Error {
  constructor(id: string, rows: number[]) {
    super(`event id "${id}" is derived by rows ${rows.join(' and ')}; ids must be unique`);
    this.name = 'DuplicateEventIdError';
  }
}

type CurrentEra = ParsedEra & { hasTable: boolean };

export function parseTimeline(markdown: string): ParsedTimeline {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown) as Root;
  const eras: ParsedEra[] = [];
  const events: ParsedEvent[] = [];
  let currentEra: CurrentEra | undefined;

  const closeEra = () => {
    if (currentEra && !currentEra.hasTable) {
      throw new TimelineParseError(
        'no event table found (check that the separator row has 7 cells)',
        { era: currentEra.id },
      );
    }
  };

  for (const node of tree.children) {
    if (node.type === 'heading' && node.depth === 2) {
      // Sections after the last era (open questions, notes) are never published.
      if (eras.length === ERA_IDS.length) break;
      const headingText = toPlainText(node.children).trim();
      closeEra();
      currentEra = { ...parseEraHeading(headingText, eras.length), hasTable: false };
      eras.push({ id: currentEra.id, number: currentEra.number, title: currentEra.title });
    } else if (node.type === 'table') {
      if (!currentEra) throw new TimelineParseError('table found before the first era heading');
      if (currentEra.hasTable) {
        throw new TimelineParseError('more than one table in this era', { era: currentEra.id });
      }
      currentEra.hasTable = true;
      parseEraTable(node, currentEra.id, markdown, events);
    }
  }
  closeEra();

  if (eras.length !== ERA_IDS.length) {
    throw new TimelineParseError(`expected ${ERA_IDS.length} eras, found ${eras.length}`);
  }
  assertUniqueIds(events);
  return { eras, events };
}

function parseEraHeading(text: string, index: number): ParsedEra {
  const match = /^(.*?),\s*(\d{4})\s*[–-]\s*(\d{4})$/.exec(text);
  const expectedId = ERA_IDS[index];
  if (!match || `${match[2]}-${match[3]}` !== expectedId) {
    throw new TimelineParseError(
      `era heading "${text}" must end with the year range ${expectedId?.replace('-', '–') ?? '(no more eras expected)'}`,
    );
  }
  return { id: expectedId, number: index + 1, title: match[1].trim() };
}

function parseEraTable(table: Table, era: EraId, markdown: string, events: ParsedEvent[]): void {
  const [header, ...rows] = table.children;
  const headerTexts = header.children.map((cell) => toPlainText(cell.children).trim());
  if (headerTexts.join('|') !== EXPECTED_COLUMNS.join('|')) {
    throw new TimelineParseError(
      `table header must be "${EXPECTED_COLUMNS.join(' | ')}", got "${headerTexts.join(' | ')}"`,
      { era },
    );
  }

  for (const row of rows) {
    const sourceIndex = events.length + 1;
    const location = { era, row: sourceIndex };
    if (row.children.length !== EXPECTED_COLUMNS.length) {
      throw new TimelineParseError(
        `expected ${EXPECTED_COLUMNS.length} cells, found ${row.children.length}`,
        location,
      );
    }
    try {
      events.push(parseRow(row.children, era, sourceIndex, markdown));
    } catch (error) {
      if (error instanceof InlineRenderError || error instanceof TimelineParseError) {
        throw new TimelineParseError(error.message, location);
      }
      throw error;
    }
  }
}

function parseRow(cells: TableCell[], era: EraId, sourceIndex: number, markdown: string): ParsedEvent {
  const [dateCell, laneCell, descriptionCell, confidenceCell, sourcesCell, imageCell, ideaCell] =
    cells;

  const dateLabel = toPlainText(dateCell.children).trim();
  if (!dateLabel || dateLabel === EMPTY) throw new TimelineParseError('date is empty');

  const laneText = toPlainText(laneCell.children).trim();
  if (!(SOURCE_LANES as readonly string[]).includes(laneText)) {
    throw new TimelineParseError(`unknown Sáv value "${laneText}"`);
  }
  const sourceLane = laneText as SourceLane;

  const descriptionText = toPlainText(descriptionCell.children).trim();
  if (!descriptionText || descriptionText === EMPTY) {
    throw new TimelineParseError('description is empty');
  }

  const confidenceText = cellText(confidenceCell);
  if (!(confidenceText in CONFIDENCE_BY_LABEL)) {
    throw new TimelineParseError(`unknown Bizonyosság value "${confidenceText}"`);
  }

  const ideaText = cellText(ideaCell);

  return {
    id: deriveEventId(dateLabel, descriptionText),
    era,
    sourceIndex,
    dateLabel,
    dateLabelHtml: renderInlineHtml(trimPhrasing(dateCell.children)),
    ...deriveDates(dateLabel),
    sourceLane,
    category: CATEGORY_BY_LANE[sourceLane],
    personSubtype: sourceLane === 'D18 • személy',
    descriptionHtml: renderInlineHtml(trimPhrasing(descriptionCell.children)),
    descriptionText,
    confidence: CONFIDENCE_BY_LABEL[confidenceText],
    sources: parseSources(sourcesCell),
    originalImageUrl: parseImageUrl(imageCell),
    articleIdea: ideaText === EMPTY ? undefined : ideaText,
    raw: cells.map((cell) => rawCellText(cell, markdown)),
  };
}

/** Optional cells: an empty cell means the same as "—". */
function cellText(cell: TableCell): string {
  return toPlainText(cell.children).trim() || EMPTY;
}

function parseSources(cell: TableCell): SourceLink[] {
  if (cellText(cell) === EMPTY) return [];
  const sources: SourceLink[] = [];
  for (const node of cell.children) {
    if (node.type === 'link') {
      assertHttpsUrl(node.url);
      sources.push({ label: toPlainText(node.children).trim(), url: node.url });
    } else if (node.type !== 'text' || !/^[\s;,/]*$/.test(node.value)) {
      throw new TimelineParseError(
        `Külső forrás may only contain Markdown links, found "${toPlainText([node]).trim()}"`,
      );
    }
  }
  return sources;
}

function parseImageUrl(cell: TableCell): string | undefined {
  const text = cellText(cell);
  if (text === EMPTY) return undefined;
  const links = cell.children.filter((node) => node.type === 'link');
  const url = links.length === 1 && links[0].type === 'link' ? links[0].url : text;
  if (links.length > 1 || url !== text) {
    throw new TimelineParseError(`Kép URL must be a single image URL, got "${text}"`);
  }
  if (LOCAL_IMAGE_PATH.test(url)) return url;
  assertHttpsUrl(url);
  return url;
}

function trimPhrasing(nodes: PhrasingContent[]): PhrasingContent[] {
  if (nodes.length === 0) return nodes;
  const trimmed = [...nodes];
  const first = trimmed[0];
  if (first.type === 'text') trimmed[0] = { ...first, value: first.value.trimStart() };
  const lastIndex = trimmed.length - 1;
  const last = trimmed[lastIndex];
  if (last.type === 'text') trimmed[lastIndex] = { ...last, value: last.value.trimEnd() };
  return trimmed;
}

function rawCellText(cell: TableCell, markdown: string): string {
  const start = cell.position?.start.offset;
  const end = cell.position?.end.offset;
  if (start === undefined || end === undefined) return '';
  return markdown.slice(start, end).replace(/^\|/, '').replace(/\|$/, '').trim();
}

function assertUniqueIds(events: ParsedEvent[]): void {
  const rowsById = new Map<string, number[]>();
  for (const event of events) {
    rowsById.set(event.id, [...(rowsById.get(event.id) ?? []), event.sourceIndex]);
  }
  for (const [id, rows] of rowsById) {
    if (rows.length > 1) throw new DuplicateEventIdError(id, rows);
  }
}
