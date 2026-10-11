// Saves or checks a snapshot of every timeline event's metadata, for editorial passes that may only
// change description wording (run: node scripts/timeline-snapshot.ts write|check <file>).
// Descriptions are stored for reference but never compared; everything else must match exactly.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { parseTimeline } from '../src/lib/timeline/parse.ts';
import { scopeCounts } from '../src/lib/timeline/scope.ts';
import { ERA_IDS } from '../src/lib/timeline/types.ts';

type EditorialEntry = { title?: string; image?: Record<string, unknown> };

const IMAGE_FIELDS = ['alt', 'caption', 'credit', 'license', 'sourceUrl', 'sourceLabel', 'kind', 'depictsHouse'];
const UNCOMPARED_FIELDS = new Set(['descriptionMarkdown']);

function takeSnapshot() {
  const { events } = parseTimeline(readFileSync('input/timeline.md', 'utf8'));
  const editorial = (parseYaml(readFileSync('editorial/events.yaml', 'utf8')) ?? {}) as Record<string, EditorialEntry>;
  return {
    createdFrom: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
    counts: {
      total: events.length,
      byEra: Object.fromEntries(ERA_IDS.map((era) => [era, events.filter((event) => event.era === era).length])),
      byScope: scopeCounts(events),
    },
    events: events.map((event) => {
      const entry = editorial[event.id] ?? {};
      return {
        id: event.id,
        era: event.era,
        sourceIndex: event.sourceIndex,
        dateLabel: event.dateLabel,
        sourceLane: event.sourceLane,
        category: event.category,
        personSubtype: event.personSubtype,
        confidence: event.confidence,
        originalImageUrl: event.originalImageUrl ?? null,
        title: entry.title ?? null,
        image: entry.image ? Object.fromEntries(IMAGE_FIELDS.map((field) => [field, entry.image?.[field] ?? null])) : null,
        sources: event.sources,
        descriptionMarkdown: event.raw[2],
      };
    }),
  };
}

type Snapshot = ReturnType<typeof takeSnapshot>;

function compare(saved: Snapshot, current: Snapshot): string[] {
  const differences: string[] = [];
  const show = (value: unknown) => JSON.stringify(value);
  for (const key of ['total', 'byEra', 'byScope'] as const) {
    if (show(saved.counts[key]) !== show(current.counts[key])) {
      differences.push(`counts.${key}: ${show(saved.counts[key])} → ${show(current.counts[key])}`);
    }
  }
  const currentById = new Map(current.events.map((event) => [event.id, event]));
  const savedIds = new Set(saved.events.map((event) => event.id));
  for (const event of saved.events) {
    const now = currentById.get(event.id);
    if (!now) {
      differences.push(`${event.id}: removed (or its id changed)`);
      continue;
    }
    for (const [field, value] of Object.entries(event)) {
      if (UNCOMPARED_FIELDS.has(field)) continue;
      const nowValue = now[field as keyof typeof now];
      if (show(value) !== show(nowValue)) differences.push(`${event.id} ${field}: ${show(value)} → ${show(nowValue)}`);
    }
  }
  for (const event of current.events) {
    if (!savedIds.has(event.id)) differences.push(`${event.id}: added (or its id changed)`);
  }
  return differences;
}

const [mode, file] = process.argv.slice(2);
if ((mode !== 'write' && mode !== 'check') || !file) {
  console.error('usage: node scripts/timeline-snapshot.ts write|check <file>');
  process.exit(2);
}

if (mode === 'write') {
  mkdirSync(dirname(file), { recursive: true });
  const snapshot = takeSnapshot();
  writeFileSync(file, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`wrote ${snapshot.events.length} events to ${file}`);
} else {
  const differences = compare(JSON.parse(readFileSync(file, 'utf8')) as Snapshot, takeSnapshot());
  for (const line of differences) console.log(line);
  console.log(`${differences.length} differences`);
  if (differences.length > 0) process.exit(1);
}
