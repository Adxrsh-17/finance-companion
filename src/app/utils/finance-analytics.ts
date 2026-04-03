import type { Transaction } from '../models/transaction.model';
import type { DateRange, PeriodSummary } from '../models/time-range.model';
import { eachDayInclusive } from './date-range';

export function filterTransactionsInRange(
  txs: Transaction[],
  range: DateRange,
): Transaction[] {
  return txs.filter((t) => t.date >= range.start && t.date <= range.end);
}

export function summarizeTransactions(txs: Transaction[]): PeriodSummary {
  const income = txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  return { income, expense, totalBalance: income - expense };
}

export function pctChange(current: number, previous: number): number | null {
  if (previous === 0) {
    return current === 0 ? 0 : null;
  }
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

/** Cumulative net balance by day within range */
export function cumulativeBalanceByDay(
  txs: Transaction[],
  range: DateRange,
): { labels: string[]; data: number[] } {
  const days = eachDayInclusive(range.start, range.end);
  const inRange = filterTransactionsInRange(txs, range).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  let cum = 0;
  const data = days.map((day) => {
    const net = inRange
      .filter((t) => t.date === day)
      .reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0);
    cum += net;
    return cum;
  });
  return { labels: days, data };
}

/** Daily income and expense totals for grouped bar chart */
export function incomeExpenseByDay(
  txs: Transaction[],
  range: DateRange,
): { labels: string[]; income: number[]; expense: number[] } {
  const days = eachDayInclusive(range.start, range.end);
  const inRange = filterTransactionsInRange(txs, range);
  const income = days.map((day) =>
    inRange
      .filter((t) => t.date === day && t.type === 'income')
      .reduce((s, t) => s + t.amount, 0),
  );
  const expense = days.map((day) =>
    inRange
      .filter((t) => t.date === day && t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0),
  );
  return { labels: days, income, expense };
}

/** When many days, bucket by week label (start date of week) */
export function incomeExpenseByWeek(
  txs: Transaction[],
  range: DateRange,
): { labels: string[]; income: number[]; expense: number[] } {
  const inRange = filterTransactionsInRange(txs, range);
  const weekMap = new Map<string, { income: number; expense: number }>();

  for (const t of inRange) {
    const d = new Date(
      Number(t.date.slice(0, 4)),
      Number(t.date.slice(5, 7)) - 1,
      Number(t.date.slice(8, 10)),
    );
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    const key = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
    const cur = weekMap.get(key) ?? { income: 0, expense: 0 };
    if (t.type === 'income') {
      cur.income += t.amount;
    } else {
      cur.expense += t.amount;
    }
    weekMap.set(key, cur);
  }

  const labels = [...weekMap.keys()].sort();
  return {
    labels,
    income: labels.map((k) => weekMap.get(k)!.income),
    expense: labels.map((k) => weekMap.get(k)!.expense),
  };
}

export function expenseByCategory(
  txs: Transaction[],
  range: DateRange,
): { labels: string[]; data: number[] } {
  const map = new Map<string, number>();
  for (const t of filterTransactionsInRange(txs, range)) {
    if (t.type !== 'expense') continue;
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
  }
  const entries = [...map.entries()].sort((a, b) => b[1] - a[1]);
  return {
    labels: entries.map((e) => e[0]),
    data: entries.map((e) => e[1]),
  };
}

/** Sparkline: last N daily values for metric */
export function sparklineSeries(
  txs: Transaction[],
  range: DateRange,
  metric: 'balance' | 'income' | 'expense',
  maxPoints = 14,
): number[] {
  const days = eachDayInclusive(range.start, range.end);
  const slice = days.length > maxPoints ? days.slice(-maxPoints) : days;
  if (metric === 'balance') {
    const { data } = cumulativeBalanceByDay(txs, {
      start: slice[0] ?? range.start,
      end: slice[slice.length - 1] ?? range.end,
    });
    return data;
  }
  if (metric === 'income') {
    return slice.map((day) =>
      txs
        .filter((t) => t.date === day && t.type === 'income')
        .reduce((s, t) => s + t.amount, 0),
    );
  }
  return slice.map((day) =>
    txs
      .filter((t) => t.date === day && t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0),
  );
}

export function sparklinePath(values: number[], w: number, h: number): string {
  if (values.length === 0) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const n = values.length;
  if (n === 1) {
    const y = h - ((values[0]! - min) / span) * (h - 4) - 2;
    return `M0,${y.toFixed(1)} L${w},${y.toFixed(1)}`;
  }
  const step = w / (n - 1);
  return values
    .map((v, i) => {
      const x = i * step;
      const y = h - ((v - min) / span) * (h - 4) - 2;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}
