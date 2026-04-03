import type { DateRange, TimeRangePreset } from '../models/time-range.model';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** Today in local calendar as YYYY-MM-DD */
export function todayYMD(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function ymd(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function daysInMonth(year: number, month1: number): number {
  return new Date(year, month1, 0).getDate();
}

/** Inclusive range from preset (local dates) */
export function computeReportRange(
  preset: TimeRangePreset,
  ref: Date,
  customMonth: number,
  customYear: number,
): DateRange {
  const y = ref.getFullYear();
  const m = ref.getMonth() + 1;
  const d = ref.getDate();

  if (preset === '7d') {
    const end = new Date(y, m - 1, d);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    return { start: ymd(start), end: ymd(end) };
  }

  if (preset === 'month') {
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m - 1, daysInMonth(y, m));
    return { start: ymd(start), end: ymd(end) };
  }

  if (preset === 'year') {
    const start = new Date(y, 0, 1);
    const end = new Date(y, 11, 31);
    return { start: ymd(start), end: ymd(end) };
  }

  // custom month/year
  const cm = Math.min(12, Math.max(1, customMonth));
  const cy = customYear;
  const start = new Date(cy, cm - 1, 1);
  const end = new Date(cy, cm - 1, daysInMonth(cy, cm));
  return { start: ymd(start), end: ymd(end) };
}

export function previousPeriodRange(
  preset: TimeRangePreset,
  current: DateRange,
  customMonth: number,
  customYear: number,
): DateRange {
  if (preset === '7d') {
    const end = new Date(
      Number(current.start.slice(0, 4)),
      Number(current.start.slice(5, 7)) - 1,
      Number(current.start.slice(8, 10)),
    );
    end.setDate(end.getDate() - 1);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    return { start: ymd(start), end: ymd(end) };
  }

  if (preset === 'month') {
    const parts = current.start.split('-').map(Number);
    const y = parts[0]!;
    const mo = parts[1]!;
    const prev = new Date(y, mo - 2, 1);
    const py = prev.getFullYear();
    const pm = prev.getMonth() + 1;
    const start = new Date(py, pm - 1, 1);
    const end = new Date(py, pm - 1, daysInMonth(py, pm));
    return { start: ymd(start), end: ymd(end) };
  }

  if (preset === 'year') {
    const y = Number(current.start.slice(0, 4)) - 1;
    const start = new Date(y, 0, 1);
    const end = new Date(y, 11, 31);
    return { start: ymd(start), end: ymd(end) };
  }

  // custom → previous calendar month
  let cm = customMonth - 1;
  let cy = customYear;
  if (cm < 1) {
    cm = 12;
    cy -= 1;
  }
  const start = new Date(cy, cm - 1, 1);
  const end = new Date(cy, cm - 1, daysInMonth(cy, cm));
  return { start: ymd(start), end: ymd(end) };
}

export function eachDayInclusive(start: string, end: string): string[] {
  const out: string[] = [];
  const a = new Date(
    Number(start.slice(0, 4)),
    Number(start.slice(5, 7)) - 1,
    Number(start.slice(8, 10)),
  );
  const b = new Date(
    Number(end.slice(0, 4)),
    Number(end.slice(5, 7)) - 1,
    Number(end.slice(8, 10)),
  );
  if (a > b) return [];
  for (let d = new Date(a); d <= b; d.setDate(d.getDate() + 1)) {
    out.push(ymd(new Date(d)));
  }
  return out;
}
