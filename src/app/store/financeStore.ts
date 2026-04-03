import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Transaction, DateRange, getDateRange, filterTransactionsByDateRange, calculateTotals, generateTimeSeries, getCategoryDistribution, getMonthlyComparison } from '../utils/dataLoader';

interface FinanceState {
  // Raw data
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  
  // Filtering
  dateRangePreset: string;
  customMonth: string;
  customYear: string;
  currentRange: DateRange;
  
  // Filtered data
  filteredTransactions: Transaction[];
  
  // Computed data
  totals: {
    income: number;
    expense: number;
    balance: number;
    transactionCount: number;
  };
  timeSeries: Array<{ date: string; balance: number; income: number; expense: number }>;
  categoryDistribution: Array<{ category: string; value: number; percentage: number }>;
  monthlyComparison: Array<{ month: string; income: number; expense: number }>;
  
  // UI state
  sidebarCollapsed: boolean;
  darkMode: boolean;
  userRole: 'viewer' | 'admin';
}

interface FinanceActions {
  // Data loading
  setTransactions: (transactions: Transaction[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Filtering
  setDateRangePreset: (preset: string) => void;
  setCustomMonth: (month: string) => void;
  setCustomYear: (year: string) => void;
  applyDateFilter: () => void;
  
  // UI state
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  setUserRole: (role: 'viewer' | 'admin') => void;
  
  // Computed data refresh
  refreshComputedData: () => void;
}

export const useFinanceStore = create<FinanceState & FinanceActions>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    transactions: [],
    isLoading: false,
    error: null,
    
    dateRangePreset: '7d',
    customMonth: new Date().getMonth().toString(),
    customYear: new Date().getFullYear().toString(),
    currentRange: getDateRange('7d'),
    
    filteredTransactions: [],
    
    totals: {
      income: 0,
      expense: 0,
      balance: 0,
      transactionCount: 0
    },
    timeSeries: [],
    categoryDistribution: [],
    monthlyComparison: [],
    
    sidebarCollapsed: false,
    darkMode: false,
    userRole: 'admin',
    
    // Actions
    setTransactions: (transactions: Transaction[]) => {
      set({ transactions, error: null });
      get().applyDateFilter();
    },
    
    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },
    
    setError: (error: string | null) => {
      set({ error, isLoading: false });
    },
    
    setDateRangePreset: (preset: string) => {
      set({ dateRangePreset: preset });
      get().applyDateFilter();
    },
    
    setCustomMonth: (month: string) => {
      set({ customMonth: month });
      if (get().dateRangePreset === 'custom') {
        get().applyDateFilter();
      }
    },
    
    setCustomYear: (year: string) => {
      set({ customYear: year });
      if (get().dateRangePreset === 'custom') {
        get().applyDateFilter();
      }
    },
    
    applyDateFilter: () => {
      const { dateRangePreset, customMonth, customYear, transactions } = get();
      
      let range: DateRange;
      if (dateRangePreset === 'custom') {
        // Custom range based on month/year selection
        const year = parseInt(customYear);
        const month = parseInt(customMonth);
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0); // Last day of month
        range = {
          start: startDate,
          end: endDate
        };
      } else {
        range = getDateRange(dateRangePreset);
      }
      
      const filtered = filterTransactionsByDateRange(transactions, range);
      
      set({
        currentRange: range,
        filteredTransactions: filtered
      });
      
      get().refreshComputedData();
    },
    
    toggleSidebar: () => {
      set(state => ({ sidebarCollapsed: !state.sidebarCollapsed }));
    },
    
    toggleDarkMode: () => {
      set(state => ({ darkMode: !state.darkMode }));
    },
    
    setUserRole: (role: 'viewer' | 'admin') => {
      set({ userRole: role });
    },
    
    refreshComputedData: () => {
      const { filteredTransactions } = get();
      
      const totals = calculateTotals(filteredTransactions);
      const timeSeries = generateTimeSeries(filteredTransactions);
      const categoryDistribution = getCategoryDistribution(filteredTransactions);
      const monthlyComparison = getMonthlyComparison(filteredTransactions);
      
      set({
        totals,
        timeSeries,
        categoryDistribution,
        monthlyComparison
      });
    }
  }))
);

// Subscribe to dark mode changes and apply to document
useFinanceStore.subscribe(
  (state) => state.darkMode,
  (darkMode) => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  {
    fireImmediately: true
  }
);

// Initialize dark mode from system preference
if (typeof window !== 'undefined') {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (isDarkMode) {
    useFinanceStore.setState({ darkMode: true });
  }
}
