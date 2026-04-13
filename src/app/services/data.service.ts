import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Transaction {
  id: string;
  date: string; // Changed from Date to string
  amount: number;
  category: string;
  type: 'income' | 'expense';
  description: string;
  status: 'completed' | 'pending' | 'failed';
  merchant?: string;
  reference?: string;
}

export type UserRole = 'administrator' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  lastLogin: Date;
}

export interface Permission {
  resource: string;
  actions: ('read' | 'write' | 'delete' | 'admin')[];
}

interface BackendBootstrapResponse {
  users: Array<Omit<User, 'lastLogin'> & { lastLogin: string }>;
  currentUserId?: string;
  transactions: Transaction[];
  permissions?: Permission[];
}

export const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Business', 'Rental', 'Other Income'],
  expense: ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Education', 'Travel', 'Insurance', 'Other']
};

export const MERCHANTS = {
  'Food & Dining': ['Starbucks', 'McDonald\'s', 'Chipotle', 'Local Restaurant', 'Pizza Hut', 'Subway'],
  'Transportation': ['Uber', 'Lyft', 'Gas Station', 'Public Transport', 'Taxi', 'Car Rental'],
  'Shopping': ['Amazon', 'Walmart', 'Target', 'Best Buy', 'Apple Store', 'Nike'],
  'Entertainment': ['Netflix', 'Spotify', 'Disney+', 'Movie Theater', 'Concert', 'Gaming'],
  'Bills & Utilities': ['Electric Company', 'Water Department', 'Internet Provider', 'Phone Company', 'Gas Company', 'Rent'],
  'Healthcare': ['Hospital', 'Pharmacy', 'Doctor Visit', 'Dental', 'Insurance', 'Gym'],
  'Education': ['University', 'Online Course', 'Books', 'Tuition', 'Certification', 'Training'],
  'Travel': ['Airline', 'Hotel', 'Car Rental', 'Restaurant', 'Tourism', 'Travel Agency'],
  'Insurance': ['Car Insurance', 'Health Insurance', 'Life Insurance', 'Home Insurance', 'Travel Insurance'],
  'Other': ['ATM Withdrawal', 'Bank Fee', 'Transfer', 'Gift', 'Donation', 'Miscellaneous']
};

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly http = inject(HttpClient);
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  private readonly transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  private readonly usersSubject = new BehaviorSubject<User[]>([]);
  private readonly permissionsSubject = new BehaviorSubject<Permission[]>([]);

  // Public signals for reactive usage
  public readonly currentUser$ = this.currentUserSubject.asObservable();
  public readonly transactions$ = this.transactionsSubject.asObservable();
  public readonly allUsers$ = this.usersSubject.asObservable();
  public readonly permissions$ = this.permissionsSubject.asObservable();

  // Signal properties for internal use
  private readonly users = signal<User[]>([]);
  private readonly transactions = signal<Transaction[]>([]);
  private readonly permissions = signal<Permission[]>([]);
  private readonly currentUser = signal<User | null>(null);

  constructor() {
    this.initializeData();
  }

  public initializeData() {
    if (environment.apiBaseUrl.trim()) {
      this.loadBootstrapDataFromApi();
      return;
    }

    this.initializeMockData();
  }

  public refreshFromBackend() {
    if (!environment.apiBaseUrl.trim()) {
      return;
    }
    this.loadBootstrapDataFromApi();
  }

  private loadBootstrapDataFromApi() {
    this.http
      .get<BackendBootstrapResponse>(`${environment.apiBaseUrl.replace(/\/$/, '')}/bootstrap`)
      .pipe(catchError(() => of(null)))
      .subscribe((bootstrap) => {
        if (!bootstrap?.users?.length || !bootstrap?.transactions?.length) {
          this.initializeMockData();
          return;
        }

        const users: User[] = bootstrap.users.map((user) => ({
          ...user,
          lastLogin: new Date(user.lastLogin),
        }));

        const transactions = [...bootstrap.transactions].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        const currentUser =
          users.find((user) => user.id === bootstrap.currentUserId) ?? users[0] ?? null;

        this.users.set(users);
        this.usersSubject.next(users);

        this.transactions.set(transactions);
        this.transactionsSubject.next(transactions);

        this.currentUser.set(currentUser);
        this.currentUserSubject.next(currentUser);

        if (bootstrap.permissions?.length) {
          this.permissions.set(bootstrap.permissions);
          this.permissionsSubject.next(bootstrap.permissions);
        } else if (currentUser) {
          this.updatePermissions(currentUser.role);
        }
      });
  }

  private initializeMockData() {
    // Generate sample users - ONLY 2 ROLES
    const sampleUsers: User[] = [
      {
        id: '1',
        name: 'Adarsh Pradeep',
        email: 'adarsh@wealthgrid.com',
        role: 'administrator' as UserRole,
        avatar: 'AP',
        department: 'IT',
        lastLogin: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@wealthgrid.com',
        role: 'user' as UserRole,
        avatar: 'SJ',
        department: 'Finance',
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      }
    ];

    this.users.set(sampleUsers);
    this.currentUserSubject.next(sampleUsers[0]); // Set first user as current
    this.usersSubject.next(sampleUsers);
    this.generateTransactions();
  }

  private generateTransactions() {
    const transactions: Transaction[] = [];
    const now = new Date();
    
    // Generate 6 months of realistic transaction data
    for (let month = 0; month < 6; month++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - month, 1);
      
      // Generate income transactions (salary, freelance, etc.)
      this.generateIncomeTransactions(transactions, monthDate);
      
      // Generate expense transactions
      this.generateExpenseTransactions(transactions, monthDate);
    }

    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    this.transactions.set(transactions);
    this.transactionsSubject.next(transactions);
  }

  private generateIncomeTransactions(transactions: Transaction[], monthDate: Date) {
    // Salary (monthly)
    transactions.push({
      id: this.generateId(),
      date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).toISOString().split('T')[0], // First day of month
      amount: Math.floor(Math.random() * 3000) + 4000, // $4000-$7000
      category: 'Salary',
      type: 'income',
      description: 'Monthly Salary',
      status: 'completed',
      merchant: 'Wealth Grid Inc.',
      reference: `SAL-${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`
    });

    // Random freelance income (30% chance)
    if (Math.random() > 0.7) {
      transactions.push({
        id: this.generateId(),
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        amount: Math.floor(Math.random() * 1500) + 500, // $500-$2000
        category: 'Freelance',
        type: 'income',
        description: 'Freelance Project Payment',
        status: 'completed',
        merchant: 'Client Project',
        reference: `FR-${this.generateId().slice(0, 8)}`
      });
    }

    // Investment income (20% chance)
    if (Math.random() > 0.8) {
      transactions.push({
        id: this.generateId(),
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        amount: Math.floor(Math.random() * 800) + 200, // $200-$1000
        category: 'Investment',
        type: 'income',
        description: 'Investment Returns',
        status: 'completed',
        merchant: 'Investment Account',
        reference: `INV-${this.generateId().slice(0, 8)}`
      });
    }
  }

  private generateExpenseTransactions(transactions: Transaction[], monthDate: Date) {
    const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
    
    // Generate daily expenses
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
      
      // Skip weekends for some categories
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      // Generate 1-4 transactions per day
      const numTransactions = Math.floor(Math.random() * 4) + 1;
      
      for (let i = 0; i < numTransactions; i++) {
        const category = this.getRandomExpenseCategory();
        const merchant = this.getRandomMerchant(category);
        const amount = this.getRandomAmount(category);
        
        // Skip some transactions on weekends
        if (isWeekend && ['Bills & Utilities', 'Education'].includes(category)) {
          continue;
        }
        
        transactions.push({
          id: this.generateId(),
          date: new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Random time during day
          amount,
          category,
          type: 'expense',
          description: `${category} - ${merchant}`,
          status: this.getRandomStatus(),
          merchant,
          reference: `TXN-${this.generateId().slice(0, 8)}`
        });
      }
    }
  }

  private getRandomExpenseCategory(): string {
    const categories = Object.values(CATEGORIES.expense);
    return categories[Math.floor(Math.random() * categories.length)];
  }

  private getRandomMerchant(category: string): string {
    const merchants = MERCHANTS[category as keyof typeof MERCHANTS] || ['Unknown Merchant'];
    return merchants[Math.floor(Math.random() * merchants.length)];
  }

  private getRandomAmount(category: string): number {
    const ranges: Record<string, [number, number]> = {
      'Food & Dining': [8, 150],
      'Transportation': [5, 100],
      'Shopping': [20, 500],
      'Entertainment': [10, 200],
      'Bills & Utilities': [50, 800],
      'Healthcare': [20, 500],
      'Education': [50, 1000],
      'Travel': [100, 2000],
      'Insurance': [100, 500],
      'Other': [5, 200]
    };

    const [min, max] = ranges[category] || [5, 100];
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getRandomStatus(): 'completed' | 'pending' | 'failed' {
    const statuses: ('completed' | 'pending' | 'failed')[] = ['completed', 'completed', 'completed', 'pending'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  // Period helper methods
  getPeriodTransactions(days: number): { current: Transaction[], previous: Transaction[] } {
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - days);
    const prevStart = new Date(start);
    prevStart.setDate(prevStart.getDate() - days);
    
    const all = this.transactions();
    return {
      current: all.filter(t => {
        const txDate = new Date(t.date);
        return txDate >= start && txDate <= now;
      }),
      previous: all.filter(t => {
        const txDate = new Date(t.date);
        return txDate >= prevStart && txDate < start;
      })
    };
  }

  // Get all-time balance
  getAllTimeBalance(): { income: number, expense: number } {
    const all = this.transactions();
    const income = all.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = all.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expense };
  }

  private generateId(): string {
    return 'tx_' + Math.random().toString(36).substr(2, 9);
  }

  // User management
  setCurrentUser(user: User) {
    this.currentUser.set(user);
    this.currentUserSubject.next(user);
    this.updatePermissions(user.role);
  }

  clearCurrentUser() {
    this.currentUser.set(null);
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  getAllUsers(): User[] {
    return this.users();
  }

  switchUser(userId: string) {
    const user = this.users().find(u => u.id === userId);
    if (user) {
      this.setCurrentUser(user);
    }
  }

  // RBAC Permissions
  private updatePermissions(role: UserRole) {
    const permissions: Permission[] = [];
    
    switch (role) {
      case 'administrator':
        // Admin has full access to everything
        permissions.push(
          { resource: 'dashboard', actions: ['read'] },
          { resource: 'transactions', actions: ['read', 'write', 'delete'] },
          { resource: 'insights', actions: ['read'] },
          { resource: 'users', actions: ['admin'] }
        );
        break;
      case 'user':
        // User has read-only access
        permissions.push(
          { resource: 'dashboard', actions: ['read'] },
          { resource: 'transactions', actions: ['read'] },
          { resource: 'insights', actions: ['read'] }
        );
        break;
    }
    
    this.permissions.set(permissions);
    this.permissionsSubject.next(permissions);
  }

  hasPermission(resource: string, action: string): boolean {
    const userPermissions = this.permissions();
    const permission = userPermissions.find(p => p.resource === resource);
    return permission ? permission.actions.includes(action as any) : false;
  }

  canRead(resource: string): boolean {
    return this.hasPermission(resource, 'read');
  }

  canWrite(resource: string): boolean {
    return this.hasPermission(resource, 'write');
  }

  canDelete(resource: string): boolean {
    return this.hasPermission(resource, 'delete');
  }

  canAdmin(resource: string): boolean {
    return this.hasPermission(resource, 'admin');
  }

  // Transaction management
  getTransactions(): Transaction[] {
    return this.transactions();
  }

  getTransactionsByDateRange(startDate: Date, endDate: Date): Transaction[] {
    return this.transactions().filter(t => 
      new Date(t.date) >= startDate && new Date(t.date) <= endDate
    );
  }

  addTransaction(transaction: Omit<Transaction, 'id'>): boolean {
    if (!this.canWrite('transactions')) {
      return false;
    }

    const newTransaction: Transaction = {
      ...transaction,
      id: this.generateId()
    };

    const updatedTransactions = [newTransaction, ...this.transactions()];
    this.transactions.set(updatedTransactions);
    this.transactionsSubject.next(updatedTransactions);
    return true;
  }

  updateTransaction(id: string, updates: Partial<Transaction>): boolean {
    if (!this.canWrite('transactions')) {
      return false;
    }

    const updatedTransactions = this.transactions().map(t => 
      t.id === id ? { ...t, ...updates } : t
    );
    this.transactions.set(updatedTransactions);
    this.transactionsSubject.next(updatedTransactions);
    return true;
  }

  deleteTransaction(id: string): boolean {
    if (!this.canDelete('transactions')) {
      return false;
    }

    const updatedTransactions = this.transactions().filter(t => t.id !== id);
    this.transactions.set(updatedTransactions);
    this.transactionsSubject.next(updatedTransactions);
    return true;
  }

  // Analytics data
  getSummaryData(dateRange: { start: Date; end: Date }) {
    const transactions = this.getTransactionsByDateRange(dateRange.start, dateRange.end);
    
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expense;
    const transactionCount = transactions.length;

    return { income, expense, balance, transactionCount };
  }

  getCategoryData(dateRange: { start: Date; end: Date }) {
    const transactions = this.getTransactionsByDateRange(dateRange.start, dateRange.end)
      .filter(t => t.type === 'expense');

    const categoryTotals = new Map<string, number>();
    transactions.forEach(t => {
      const current = categoryTotals.get(t.category) || 0;
      categoryTotals.set(t.category, current + t.amount);
    });

    return Array.from(categoryTotals.entries()).map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / transactions.reduce((sum, t) => sum + t.amount, 0)) * 100
    }));
  }

  getMonthlyData(dateRange: { start: Date; end: Date }) {
    const transactions = this.getTransactionsByDateRange(dateRange.start, dateRange.end);
    const monthlyData = new Map<string, { income: number; expense: number }>();

    transactions.forEach(t => {
      const monthKey = new Date(t.date).toISOString().slice(0, 7); // YYYY-MM
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

    return Array.from(monthlyData.entries()).map(([month, data]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      ...data
    }));
  }
}
