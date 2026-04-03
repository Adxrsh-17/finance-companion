import Papa from 'papaparse';
import { subDays, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';

export interface Transaction {
  date: Date;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  description?: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export const loadCSV = async (file: File): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data = results.data.map((row: any) => ({
            date: new Date(row.date),
            amount: Number(row.amount),
            category: row.category || 'Other',
            type: (row.type?.toLowerCase() || 'expense') as 'income' | 'expense',
            description: row.description || ''
          }));
          resolve(data);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const getDateRange = (preset: string): DateRange => {
  const now = new Date();
  const end = endOfDay(now);
  
  switch (preset) {
    case '7d':
      return {
        start: startOfDay(subDays(now, 7)),
        end
      };
    case 'month':
      return {
        start: startOfDay(new Date(now.getFullYear(), now.getMonth(), 1)),
        end
      };
    case 'year':
      return {
        start: startOfDay(new Date(now.getFullYear(), 0, 1)),
        end
      };
    case 'custom':
      // Default to last 30 days for custom
      return {
        start: startOfDay(subDays(now, 30)),
        end
      };
    default:
      return {
        start: startOfDay(subDays(now, 7)),
        end
      };
  }
};

export const filterTransactionsByDateRange = (
  transactions: Transaction[],
  range: DateRange
): Transaction[] => {
  return transactions.filter(t => 
    isAfter(t.date, range.start) && 
    isBefore(t.date, range.end)
  );
};

export const groupByCategory = (transactions: Transaction[]): Record<string, Transaction[]> => {
  return transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(transaction);
    return acc;
  }, {} as Record<string, Transaction[]>);
};

export const calculateTotals = (transactions: Transaction[]) => {
  let income = 0;
  let expense = 0;

  transactions.forEach(t => {
    if (t.type === 'income') {
      income += t.amount;
    } else {
      expense += t.amount;
    }
  });

  return {
    income,
    expense,
    balance: income - expense,
    transactionCount: transactions.length
  };
};

export const generateTimeSeries = (transactions: Transaction[]): Array<{ date: string; balance: number; income: number; expense: number }> => {
  const sorted = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime());
  const timeSeries: Array<{ date: string; balance: number; income: number; expense: number }> = [];
  
  let runningBalance = 0;
  const dailyData = new Map<string, { income: number; expense: number }>();

  // Aggregate by day
  sorted.forEach(t => {
    const dateKey = t.date.toISOString().split('T')[0];
    if (!dailyData.has(dateKey)) {
      dailyData.set(dateKey, { income: 0, expense: 0 });
    }
    const dayData = dailyData.get(dateKey)!;
    if (t.type === 'income') {
      dayData.income += t.amount;
      runningBalance += t.amount;
    } else {
      dayData.expense += t.amount;
      runningBalance -= t.amount;
    }
  });

  // Convert to time series
  Array.from(dailyData.entries()).sort().forEach(([date, data]) => {
    timeSeries.push({
      date,
      balance: runningBalance,
      income: data.income,
      expense: data.expense
    });
  });

  return timeSeries;
};

export const getCategoryDistribution = (transactions: Transaction[]): Array<{ category: string; value: number; percentage: number }> => {
  const categoryTotals = new Map<string, number>();
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);

  transactions.forEach(t => {
    const current = categoryTotals.get(t.category) || 0;
    categoryTotals.set(t.category, current + t.amount);
  });

  return Array.from(categoryTotals.entries())
    .map(([category, value]) => ({
      category,
      value,
      percentage: total > 0 ? (value / total) * 100 : 0
    }))
    .sort((a, b) => b.value - a.value);
};

export const getMonthlyComparison = (transactions: Transaction[]): Array<{ month: string; income: number; expense: number }> => {
  const monthlyData = new Map<string, { income: number; expense: number }>();

  transactions.forEach(t => {
    const monthKey = t.date.toISOString().slice(0, 7); // YYYY-MM
    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, { income: 0, expense: 0 });
    }
    const data = monthlyData.get(monthKey)!;
    if (t.type === 'income') {
      data.income += t.amount;
    } else {
      data.expense += t.amount;
    }
  });

  return Array.from(monthlyData.entries())
    .map(([month, data]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      income: data.income,
      expense: data.expense
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
};
