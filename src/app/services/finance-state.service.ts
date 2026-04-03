import { Injectable, computed, effect, signal } from '@angular/core';
import type {
  SortDirection,
  SortField,
  Transaction,
  TransactionType,
  UserRole,
} from '../models/transaction.model';
import type { DateRange, PeriodComparisonPct, TimeRangePreset } from '../models/time-range.model';
import { MOCK_TRANSACTIONS } from '../data/mock-transactions';
import { computeReportRange, previousPeriodRange, todayYMD } from '../utils/date-range';
import {
  expenseByCategory,
  filterTransactionsInRange,
  incomeExpenseByDay,
  incomeExpenseByWeek,
  pctChange,
  summarizeTransactions,
} from '../utils/finance-analytics';

const TX_KEY = 'finance-dashboard-transactions';
const ROLE_KEY = 'finance-dashboard-role';
const THEME_KEY = 'finance-dashboard-theme';
const PRESET_KEY = 'finance-dashboard-preset';
const CUSTOM_M_KEY = 'finance-dashboard-cm';
const CUSTOM_Y_KEY = 'finance-dashboard-cy';
const TX_SCOPE_KEY = 'finance-dashboard-tx-scope';

function parseStoredTransactions(raw: string | null): Transaction[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed as Transaction[];
  } catch {
    return null;
  }
}

function loadPreset(): TimeRangePreset {
  const v = localStorage.getItem(PRESET_KEY);
  if (v === '7d' || v === 'month' || v === 'year' || v === 'custom') return v;
  return '7d';
}

function loadCustomMonth(): number {
  const n = Number(localStorage.getItem(CUSTOM_M_KEY));
  if (n >= 1 && n <= 12) return n;
  return new Date().getMonth() + 1;
}

function loadCustomYear(): number {
  const n = Number(localStorage.getItem(CUSTOM_Y_KEY));
  if (n >= 2000 && n <= 2100) return n;
  return new Date().getFullYear();
}

function loadTxScope(): 'report' | 'all' {
  return localStorage.getItem(TX_SCOPE_KEY) === 'all' ? 'all' : 'report';
}

@Injectable({ providedIn: 'root' })
export class FinanceStateService {
  private readonly _transactions = signal<Transaction[]>(this.loadTransactions());
  readonly transactions = this._transactions.asReadonly();

  private readonly _role = signal<UserRole>(this.loadRole());
  readonly role = this._role.asReadonly();

  readonly isAdmin = computed(() => this._role() === 'admin');

  readonly isDark = signal<boolean>(this.loadTheme());

  /** Global reporting period */
  readonly timeRangePreset = signal<TimeRangePreset>(loadPreset());
  readonly customMonth = signal<number>(loadCustomMonth());
  readonly customYear = signal<number>(loadCustomYear());

  /** Transactions table: filter by same period vs all time */
  readonly transactionsDateScope = signal<'report' | 'all'>(loadTxScope());

  readonly searchQuery = signal('');
  readonly categoryFilter = signal<string>('all');
  readonly typeFilter = signal<'all' | TransactionType>('all');
  readonly sortField = signal<SortField>('date');
  readonly sortDirection = signal<SortDirection>('desc');

  readonly reportRange = computed(() =>
    computeReportRange(
      this.timeRangePreset(),
      new Date(),
      this.customMonth(),
      this.customYear(),
    ),
  );

  readonly previousRange = computed(() =>
    previousPeriodRange(
      this.timeRangePreset(),
      this.reportRange(),
      this.customMonth(),
      this.customYear(),
    ),
  );

  readonly transactionsInReportRange = computed(() =>
    filterTransactionsInRange(this._transactions(), this.reportRange()),
  );

  readonly transactionsInPreviousRange = computed(() =>
    filterTransactionsInRange(this._transactions(), this.previousRange()),
  );

  readonly periodSummary = computed(() =>
    summarizeTransactions(this.transactionsInReportRange()),
  );

  readonly previousPeriodSummary = computed(() =>
    summarizeTransactions(this.transactionsInPreviousRange()),
  );

  readonly periodComparison = computed((): PeriodComparisonPct => {
    const cur = this.periodSummary();
    const prev = this.previousPeriodSummary();
    return {
      balance: pctChange(cur.totalBalance, prev.totalBalance),
      income: pctChange(cur.income, prev.income),
      expense: pctChange(cur.expense, prev.expense),
    };
  });

  readonly expenseByCategoryInPeriod = computed(() =>
    expenseByCategory(this._transactions(), this.reportRange()),
  );

  readonly categories = computed(() => {
    const set = new Set<string>();
    for (const t of this._transactions()) {
      set.add(t.category);
    }
    return [...set].sort((a, b) => a.localeCompare(b));
  });

  readonly filteredTransactions = computed(() => {
    let list = [...this._transactions()];
    if (this.transactionsDateScope() === 'report') {
      const r = this.reportRange();
      list = list.filter((t) => t.date >= r.start && t.date <= r.end);
    }
    const q = this.searchQuery().trim().toLowerCase();
    if (q) {
      list = list.filter(
        (t) =>
          t.category.toLowerCase().includes(q) ||
          (t.note?.toLowerCase().includes(q) ?? false) ||
          String(t.amount).includes(q) ||
          t.type.includes(q),
      );
    }
    const cat = this.categoryFilter();
    if (cat !== 'all') {
      list = list.filter((t) => t.category === cat);
    }
    const ty = this.typeFilter();
    if (ty !== 'all') {
      list = list.filter((t) => t.type === ty);
    }
    const field = this.sortField();
    const dir = this.sortDirection();
    list.sort((a, b) => {
      let cmp = 0;
      if (field === 'date') {
        cmp = a.date.localeCompare(b.date);
      } else if (field === 'amount') {
        cmp = a.amount - b.amount;
      } else {
        cmp = a.category.localeCompare(b.category);
      }
      return dir === 'asc' ? cmp : -cmp;
    });
    return list;
  });

  /** All-time summary (settings / export) */
  readonly summary = computed(() => summarizeTransactions(this._transactions()));

  /** Monthly expense totals by category (all time) — legacy insights helper */
  readonly expenseByCategory = computed(() => {
    const map = new Map<string, number>();
    for (const t of this._transactions()) {
      if (t.type !== 'expense') continue;
      map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
    }
    return map;
  });

  constructor() {
    this.applyThemeClass();
    effect(() => {
      localStorage.setItem(TX_KEY, JSON.stringify(this._transactions()));
    });
    effect(() => {
      localStorage.setItem(ROLE_KEY, this._role());
    });
    effect(() => {
      localStorage.setItem(THEME_KEY, this.isDark() ? 'dark' : 'light');
      this.applyThemeClass();
    });
    effect(() => {
      localStorage.setItem(PRESET_KEY, this.timeRangePreset());
    });
    effect(() => {
      localStorage.setItem(CUSTOM_M_KEY, String(this.customMonth()));
    });
    effect(() => {
      localStorage.setItem(CUSTOM_Y_KEY, String(this.customYear()));
    });
    effect(() => {
      localStorage.setItem(TX_SCOPE_KEY, this.transactionsDateScope());
    });
  }

  setTimeRangePreset(p: TimeRangePreset): void {
    this.timeRangePreset.set(p);
  }

  setCustomMonth(m: number): void {
    this.customMonth.set(Math.min(12, Math.max(1, m)));
  }

  setCustomYear(y: number): void {
    this.customYear.set(y);
  }

  setTransactionsDateScope(scope: 'report' | 'all'): void {
    this.transactionsDateScope.set(scope);
  }

  setRole(role: UserRole): void {
    this._role.set(role);
  }

  toggleDarkMode(): void {
    this.isDark.update((v) => !v);
  }

  setSearch(q: string): void {
    this.searchQuery.set(q);
  }

  setCategoryFilter(cat: string): void {
    this.categoryFilter.set(cat);
  }

  setTypeFilter(t: 'all' | TransactionType): void {
    this.typeFilter.set(t);
  }

  setSort(field: SortField, direction: SortDirection): void {
    this.sortField.set(field);
    this.sortDirection.set(direction);
  }

  toggleSort(field: SortField): void {
    if (this.sortField() === field) {
      this.sortDirection.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortField.set(field);
      this.sortDirection.set(field === 'date' ? 'desc' : 'asc');
    }
  }

  addTransaction(input: Omit<Transaction, 'id'>): void {
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `tx-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    this._transactions.update((list) => [...list, { ...input, id }]);
  }

  updateTransaction(id: string, patch: Partial<Omit<Transaction, 'id'>>): void {
    this._transactions.update((list) =>
      list.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    );
  }

  deleteTransaction(id: string): void {
    this._transactions.update((list) => list.filter((t) => t.id !== id));
  }

  resetToMockData(): void {
    this._transactions.set([...MOCK_TRANSACTIONS]);
  }

  exportJson(): string {
    return JSON.stringify(this._transactions(), null, 2);
  }

  exportCsv(): string {
    const rows = this._transactions();
    const header = ['id', 'date', 'amount', 'category', 'type', 'note'];
    const lines = [
      header.join(','),
      ...rows.map((t) =>
        [
          t.id,
          t.date,
          t.amount,
          `"${t.category.replace(/"/g, '""')}"`,
          t.type,
          `"${(t.note ?? '').replace(/"/g, '""')}"`,
        ].join(','),
      ),
    ];
    return lines.join('\n');
  }

  /** Grouped bar: daily buckets if ≤14 days in range, else weekly */
  barChartData(range: DateRange): { labels: string[]; income: number[]; expense: number[] } {
    const txs = this._transactions();
    const start = new Date(range.start);
    const end = new Date(range.end);
    const dayCount = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
    if (dayCount <= 14) {
      return incomeExpenseByDay(txs, range);
    }
    return incomeExpenseByWeek(txs, range);
  }

  mockApiDelay<T>(value: T, ms = 400): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(value), ms));
  }

  todayYMD(): string {
    return todayYMD();
  }

  private loadTransactions(): Transaction[] {
    const stored = parseStoredTransactions(localStorage.getItem(TX_KEY));
    if (stored && stored.length > 0) {
      return stored;
    }
    return [...MOCK_TRANSACTIONS];
  }

  private loadRole(): UserRole {
    const r = localStorage.getItem(ROLE_KEY);
    return r === 'admin' || r === 'viewer' ? r : 'viewer';
  }

  private loadTheme(): boolean {
    const t = localStorage.getItem(THEME_KEY);
    if (t === 'dark' || t === 'light') {
      return t === 'dark';
    }
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }

  private applyThemeClass(): void {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', this.isDark());
  }
}
