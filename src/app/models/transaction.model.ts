export type TransactionType = 'income' | 'expense';

export type UserRole = 'viewer' | 'admin';

export type SortField = 'date' | 'amount' | 'category';

export type SortDirection = 'asc' | 'desc';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
  note?: string;
}
