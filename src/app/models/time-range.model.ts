/** Global reporting period for dashboard + insights + optional table scope */
export type TimeRangePreset = '7d' | 'month' | 'year' | 'custom';

export interface DateRange {
  /** YYYY-MM-DD inclusive */
  start: string;
  /** YYYY-MM-DD inclusive */
  end: string;
}

export interface PeriodSummary {
  income: number;
  expense: number;
  totalBalance: number;
}

export interface PeriodComparisonPct {
  balance: number | null;
  income: number | null;
  expense: number | null;
}
