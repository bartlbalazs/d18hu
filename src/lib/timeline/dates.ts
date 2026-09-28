const MONTHS: Record<string, string> = {
  jan: '01',
  febr: '02',
  márc: '03',
  ápr: '04',
  máj: '05',
  jún: '06',
  júl: '07',
  aug: '08',
  szept: '09',
  okt: '10',
  nov: '11',
  dec: '12',
};

const MONTH_PATTERN = Object.keys(MONTHS).join('|');
const DAY = new RegExp(`^(\\d{4})\\. (${MONTH_PATTERN})\\. (\\d{1,2})\\.$`);
const MONTH = new RegExp(`^(\\d{4})\\. (${MONTH_PATTERN})\\.$`);
const YEAR = /^(\d{4})$/;
const RANGE_SEPARATOR = /\s*–\s*|\s+-\s+|(?<=\d{4})-(?=\d{4}$)/;

/** Labels with these words are approximate or ambiguous: the label itself is the only truth. */
const UNCERTAIN = /körül|vagy|\/|után|előtt|nélkül|közölt/;

export type DerivedDates = { sortStart?: string; sortEnd?: string };

function deriveSingle(label: string): string | undefined {
  let match = DAY.exec(label);
  if (match) return `${match[1]}-${MONTHS[match[2]]}-${match[3].padStart(2, '0')}`;
  match = MONTH.exec(label);
  if (match) return `${match[1]}-${MONTHS[match[2]]}`;
  match = YEAR.exec(label);
  if (match) return match[1];
  return undefined;
}

/** Derives ISO partial dates only from unambiguous labels; never invents a day or month. */
export function deriveDates(dateLabel: string): DerivedDates {
  const label = dateLabel.trim();
  if (UNCERTAIN.test(label)) return {};

  const single = deriveSingle(label);
  if (single) return { sortStart: single };

  const parts = label.split(RANGE_SEPARATOR);
  if (parts.length === 2) {
    const start = deriveSingle(parts[0]);
    const end = deriveSingle(parts[1]);
    if (start && end) return { sortStart: start, sortEnd: end };
  }
  return {};
}
