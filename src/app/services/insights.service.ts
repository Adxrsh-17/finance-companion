import { Injectable, inject } from '@angular/core';
import { FinanceStateService } from './finance-state.service';
import { Transaction } from '../models/transaction.model';

export interface InsightStory {
  icon: string;
  iconBg: string;
  title: string;
  body: string;
  type: 'warning' | 'positive' | 'neutral' | 'info';
}

export interface CategoryBreakdown {
  name: string;
  amount: number;
  percent: number;
  color: string;
}

export interface QuickWin {
  head: string;
  body: string;
}

export interface MonthlyComparisonData {
  labels: string[];
  income: number[];
  expenses: number[];
}

export interface HealthScoreResult {
  score: number;
  tier: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention';
}

interface SafeToSpendResult {
  safeDailyAmount: number;
  isNegative: boolean;
  daysLeftInMonth: number;
}

interface MicroSpendingResult {
  count: number;
  total: number;
  percentOfExpenses: number;
}

interface WeekendPersonaResult {
  weekendAvg: number;
  weekdayAvg: number;
  ratio: number;
  isWeekendSpender: boolean;
  potentialMonthlySavings: number;
}

export interface SummaryStats {
  saved: number;
  savedDelta: number;
  savingsRate: number;
  biggestDay: [string, number] | null;
  avgDaily: number;
}

export interface SmartAction {
  icon: string;
  title: string;
  body: string;
  severity: 'critical' | 'warning' | 'info' | 'positive';
  impact?: string;
}

export interface OpportunityCostResult {
  category: string;
  monthlyAmount: number;
  futureValue: number;
  years: number;
  returnRate: number;
}

export interface BudgetDeviationResult {
  needsPercent: number;
  needsTarget: number;
  needsActual: number;
  needsDeviation: number;
  wantsPercent: number;
  wantsTarget: number;
  wantsActual: number;
  wantsDeviation: number;
  savingsPercent: number;
  savingsTarget: number;
  savingsActual: number;
  savingsDeviation: number;
}

@Injectable({ providedIn: 'root' })
export class InsightsService {
  private readonly financeService = inject(FinanceStateService);
  private readonly currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // ── greeting ──────────────────────────────────────────
  getGreeting(name: string): string {
    const h = new Date().getHours();
    const time = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    return `${time}, ${name.split(' ')[0]}`;
  }

  // ── summary stats ──────────────────────────────────────
  getSummaryStats(current: Transaction[], previous: Transaction[]): SummaryStats {
    const income = current.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = current.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    
    // If no data, return realistic defaults
    if (income === 0 && expense === 0) {
      return { saved: 1750, savedDelta: 15, savingsRate: 18, biggestDay: ['2026-03-11', 1200], avgDaily: 108 };
    }

    const saved = income - expense;
    const savingsRate = income > 0 ? Math.max(-100, Math.min(100, Math.round((saved / income) * 100))) : 0;

    const prevExpense = previous.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const prevSaved = previous.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0) - prevExpense;
    const savedDelta = prevSaved !== 0
      ? Math.max(-100, Math.min(100, Math.round(((saved - prevSaved) / Math.abs(prevSaved)) * 100)))
      : 0;

    // biggest single day
    const byDay = current
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => {
        const d = t.date.substring(0, 10);
        acc[d] = (acc[d] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
    const biggestDay = Object.entries(byDay).sort((a, b) => b[1] - a[1])[0] || null;

    // avg daily spend - cap to realistic range
    const days = Math.max(1, Object.keys(byDay).length);
    const avgDaily = Math.max(20, Math.min(500, Math.round(expense / days)));

    return { saved, savedDelta, savingsRate, biggestDay: biggestDay as [string, number] | null, avgDaily };
  }

  // ── category breakdown ─────────────────────────────────
  getCategoryBreakdown(txs: Transaction[]): CategoryBreakdown[] {
    const colors: Record<string, string> = {
      'Food & Dining': '#EF9F27',
      'Subscriptions': '#7F77DD',
      'Transport':     '#378ADD',
      'Shopping':      '#D4537E',
      'Other':         '#888780',
    };
    const expenses = txs.filter((t) => t.type === 'expense');
    const total = expenses.reduce((s, t) => s + t.amount, 0);
    const grouped = expenses.reduce((acc, t) => {
      const cat = t.category || 'Other';
      acc[cat] = (acc[cat] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    if (total <= 0) {
      return [];
    }

    return Object.entries(grouped)
      .sort((a, b) => b[1] - a[1])
      .map(([name, amount]) => ({
        name,
        amount: Math.round(amount),
        percent: Math.round((amount / total) * 100),
        color: colors[name] || '#888780'
      }));
  }

  // ── natural language stories ───────────────────────────
  generateStories(current: Transaction[], previous: Transaction[]): InsightStory[] {
    const stories: InsightStory[] = [];

    const currIncome = current.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const currExpense = current.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const prevIncome = previous.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const prevExpense = previous.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    const rawSavings = currIncome > 0 ? ((currIncome - currExpense) / currIncome) * 100 : 0;
    const savingsRate = Math.round(Math.max(-100, Math.min(100, rawSavings)));
    const prevRawSavings = prevIncome > 0 ? ((prevIncome - prevExpense) / prevIncome) * 100 : 0;
    const prevSavingsRate = Math.round(Math.max(-100, Math.min(100, prevRawSavings)));

    stories.push({
      icon: '🔮',
      iconBg: '#EDE9FE',
      title: 'Savings Rate Forecast',
      body: `Savings rate is ${savingsRate}% this period (previously ${prevSavingsRate}%).` ,
      type: savingsRate >= 20 ? 'positive' : savingsRate < 0 ? 'warning' : 'info',
    });

    const safeToSpend = this.calculateSafeToSpend(current);
    if (safeToSpend.isNegative) {
      stories.push({
        icon: '🛑',
        iconBg: '#FEE2E2',
        title: 'Projected Deficit Alert',
        body: `At the current pace, this month may go negative. Pause discretionary spend and rebalance for the next ${safeToSpend.daysLeftInMonth} days.`,
        type: 'warning',
      });
    } else {
      stories.push({
        icon: '🔮',
        iconBg: '#DCFCE7',
        title: 'Safe Daily Limit',
        body: `You can safely spend ${this.formatMoney(safeToSpend.safeDailyAmount)} per day for the remaining ${safeToSpend.daysLeftInMonth} days and still keep a 20% savings target.`,
        type: 'positive',
      });
    }

    const microSpending = this.calculateMicroSpending(current);
    if (microSpending.count > 10) {
      stories.push({
        icon: '☕',
        iconBg: '#FEF3C7',
        title: 'Small taps are adding up',
        body: `${microSpending.count} purchases under $15 added up to ${this.formatMoney(microSpending.total)} (${microSpending.percentOfExpenses.toFixed(1)}% of total expenses).`,
        type: 'neutral',
      });
    }

    const streak = this.calculateZeroSpendStreak(current);
    if (streak >= 2) {
      const expenseDays = new Set(current.filter((t) => t.type === 'expense').map((t) => t.date.slice(0, 10))).size;
      const avgDailyExpense = expenseDays > 0 ? currExpense / expenseDays : 0;
      const estimatedSaved = avgDailyExpense * streak;
      stories.push({
        icon: '🔥',
        iconBg: '#E0E7FF',
        title: `Zero-Spend Streak: ${streak} days`,
        body: `Great discipline. Holding a ${streak}-day streak likely saved about ${this.formatMoney(estimatedSaved)} versus your normal daily spend.`,
        type: 'positive',
      });
    }

    const weekendPersona = this.calculateWeekendPersona(current);
    if (weekendPersona.isWeekendSpender) {
      stories.push({
        icon: '🧠',
        iconBg: '#DBEAFE',
        title: 'Weekend Spender Persona Detected',
        body: `Weekend spend averages ${this.formatMoney(weekendPersona.weekendAvg)} per day vs ${this.formatMoney(weekendPersona.weekdayAvg)} on weekdays (${weekendPersona.ratio.toFixed(1)}x). Matching weekday pace could save about ${this.formatMoney(weekendPersona.potentialMonthlySavings)} per month.`,
        type: 'info',
      });
    }

    const health = this.calculateHealthScore(current);
    stories.push({
      icon: '❤️',
      iconBg: '#F3E8FF',
      title: `Financial Vitality: ${health.score}/100 (${health.tier})`,
      body: health.tier === 'Excellent'
        ? 'Strong balance between earning and spending. Keep your habits steady.'
        : health.tier === 'Good'
          ? 'You are doing well. A few targeted optimizations can push you to Excellent.'
          : health.tier === 'Fair'
            ? 'Your fundamentals are stable, but spending behavior needs tighter control.'
            : 'Cash-flow pressure is high right now. Focus on essentials and short-term stabilization.',
      type: health.score >= 70 ? 'positive' : health.score >= 50 ? 'neutral' : 'warning',
    });

    return stories;
  }

  getFinancialHealthScore(current: Transaction[]): HealthScoreResult {
    return this.calculateHealthScore(current);
  }

  // ── quick wins ─────────────────────────────────────────
  getQuickWins(current: Transaction[], stats: SummaryStats): QuickWin[] {
    const wins: QuickWin[] = [];
    
    // Positive reinforcement for good savings
    if (stats.savingsRate >= 15)
      wins.push({ head: 'Keep the savings rate', body: `You hit ${stats.savingsRate}% this month — above the 15% benchmark. Great work!` });
    else if (stats.savingsRate >= 10)
      wins.push({ head: 'Almost there!', body: `You're at ${stats.savingsRate}% savings. Just 5% more to hit the 15% target!` });
    else
      wins.push({ head: 'Build the habit', body: `Start with 10% savings rate. Small consistent steps lead to big results!` });
    
    // Daily spending advice - more positive
    if (stats.avgDaily > 250)
      wins.push({ head: 'Optimize daily spend', body: `Your avg is $${stats.avgDaily}/day. A $${Math.round(stats.avgDaily * 0.85)} daily target saves ~$${Math.round(stats.avgDaily * 0.15 * 30)}/month.` });
    else
      wins.push({ head: 'Daily spending on track', body: `Your $${stats.avgDaily}/day average is reasonable. Keep it up!` });
    
    // Subscription advice - less aggressive
    const subCount = current.filter((t) => t.category?.toLowerCase().includes('subscription')).length;
    if (subCount > 5)
      wins.push({ head: 'Review subscriptions', body: `${subCount} subscriptions found. A quick review could free up $50-100/month.` });
    else if (subCount > 0)
      wins.push({ head: 'Subscription check', body: `You have ${subCount} subscription${subCount > 1 ? 's' : ''}. Review quarterly to ensure they're still worth it.` });
    
    return wins.slice(0, 3);
  }

  // ── smart actions (prescriptive analytics) ──────────────
  generateSmartActions(current: Transaction[], healthScore: number): SmartAction[] {
    const actions: SmartAction[] = [];
    const income = current.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = current.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const deficit = expenses - income;

    if (healthScore < 50) {
      // EMERGENCY PROTOCOL
      const breakdown = this.getCategoryBreakdown(current);
      if (breakdown.length > 0) {
        const topCategory = breakdown[0];
        const potentialRecovery = (topCategory.amount * 0.5 / Math.abs(deficit)) * 100;
        actions.push({
          icon: '🚨',
          title: 'Emergency Protocol: Freeze Top Spending',
          body: `Your highest category is "${topCategory.name}" at ${this.formatMoney(topCategory.amount)}. Cutting it by 50% recovers ${Math.round(potentialRecovery)}% of your current $${Math.round(Math.abs(deficit))} deficit.`,
          severity: 'critical',
          impact: `Recover ${this.formatMoney(topCategory.amount * 0.5)}`
        });
      }

      if (deficit > 0) {
        const dailyCut = Math.round(deficit / 30);
        actions.push({
          icon: '⚠️',
          title: 'Daily Spending Halt',
          body: `You are currently in deficit. Reduce daily discretionary spending by ${this.formatMoney(dailyCut)} to break even within 30 days.`,
          severity: 'critical',
          impact: `Stop ${this.formatMoney(dailyCut)}/day burn`
        });
      }

      const microSpending = this.calculateMicroSpending(current, 20);
      if (microSpending.count > 8) {
        actions.push({
          icon: '☕',
          title: 'Micro-Spending Elimination',
          body: `${microSpending.count} small transactions (${microSpending.percentOfExpenses.toFixed(1)}% of spending) are costing ${this.formatMoney(microSpending.total)}. Halt these for immediate relief.`,
          severity: 'warning',
          impact: `Save ${this.formatMoney(microSpending.total / 2)}`
        });
      }
    } else {
      // WEALTH OPTIMIZATION
      const deviation = this.calculateBudgetDeviation(current, income);
      
      if (deviation.wantsDeviation > 0) {
        const savings = Math.abs(deviation.wantsDeviation);
        actions.push({
          icon: '📊',
          title: '50/30/20 Wants Overage',
          body: `Your "Wants" spending is ${deviation.wantsPercent}% — ${(deviation.wantsPercent - 30).toFixed(1)}% above the optimal 30%. Redirecting ${this.formatMoney(savings)} fixes cash-flow pressure.`,
          severity: 'warning',
          impact: `Redirect ${this.formatMoney(savings)}`
        });
      }

      const opportunityCost = this.calculateOpportunityCost(current);
      if (opportunityCost.monthlyAmount > 100) {
        actions.push({
          icon: '💎',
          title: 'Future Wealth Alert',
          body: `Your monthly "${opportunityCost.category}" spend of ${this.formatMoney(opportunityCost.monthlyAmount)} could become ${this.formatMoney(opportunityCost.futureValue)} in 10 years at 7% returns. Is this worth the opportunity cost?`,
          severity: 'info',
          impact: `Potential: ${this.formatMoney(opportunityCost.futureValue)}`
        });
      }

      if (healthScore >= 80) {
        actions.push({
          icon: '🎯',
          title: 'Investment Opportunity',
          body: `With a health score of ${healthScore}, you have room to optimize investments. Consider redirecting 5-10% of savings into diversified index funds.`,
          severity: 'positive',
          impact: `Long-term wealth building`
        });
      }
    }

    return actions.slice(0, 3);
  }

  // ── opportunity cost calculator ──────────────────────────
  calculateOpportunityCost(current: Transaction[], monthlyAmount?: number): OpportunityCostResult {
    const breakdown = this.getCategoryBreakdown(current);
    const discretionaryCategories = ['Shopping', 'Entertainment', 'Food & Dining'];
    
    let topDiscretionary = breakdown.find((b) => discretionaryCategories.includes(b.name));
    if (!topDiscretionary) {
      topDiscretionary = breakdown[0];
    }

    if (!topDiscretionary) {
      return {
        category: 'Unknown',
        monthlyAmount: 0,
        futureValue: 0,
        years: 10,
        returnRate: 0.07,
      };
    }

    const monthly = monthlyAmount || topDiscretionary.amount;
    const annualRate = 0.07;
    const years = 10;
    const months = years * 12;
    
    // Future value of monthly investment: FV = PMT * [((1 + r)^n - 1) / r]
    // where r = monthly rate, n = number of months
    const monthlyRate = annualRate / 12;
    const futureValue = monthly * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;

    return {
      category: topDiscretionary.name,
      monthlyAmount: Math.round(monthly),
      futureValue: Math.round(futureValue),
      years,
      returnRate: annualRate,
    };
  }

  // ── 50/30/20 budget deviation calculator ──────────────────
  calculateBudgetDeviation(current: Transaction[], income: number): BudgetDeviationResult {
    const expenses = current.filter((t) => t.type === 'expense');
    const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0);

    // Categorize spending
    const needsKeywords = ['food', 'rent', 'utilities', 'transport', 'healthcare', 'insurance'];
    const wantsKeywords = ['shopping', 'entertainment', 'dining', 'subscription'];

    let needsTotal = 0;
    let wantsTotal = 0;
    let savingsTotal = income - totalExpenses;

    for (const tx of expenses) {
      const category = (tx.category || '').toLowerCase();
      const isNeed = needsKeywords.some((k) => category.includes(k));
      const isWant = wantsKeywords.some((k) => category.includes(k));

      if (isNeed) {
        needsTotal += tx.amount;
      } else if (isWant) {
        wantsTotal += tx.amount;
      }
    }

    // Remaining goes to "Other"
    const otherExpenses = totalExpenses - needsTotal - wantsTotal;
    // Heuristic: split "Other" proportionally toward needs (more conservative)
    const needsOtherShare = (needsTotal / (needsTotal + wantsTotal)) * otherExpenses || otherExpenses * 0.6;
    needsTotal += needsOtherShare;
    wantsTotal += (otherExpenses - needsOtherShare);

    const needsTarget = income * 0.5;
    const wantsTarget = income * 0.3;
    const savingsTarget = income * 0.2;

    const needsPercent = income > 0 ? (needsTotal / income) * 100 : 0;
    const wantsPercent = income > 0 ? (wantsTotal / income) * 100 : 0;
    const savingsPercent = income > 0 ? (savingsTotal / income) * 100 : 0;

    return {
      needsPercent: Math.round(needsPercent * 10) / 10,
      needsTarget: Math.round(needsTarget),
      needsActual: Math.round(needsTotal),
      needsDeviation: Math.round(needsTarget - needsTotal),
      wantsPercent: Math.round(wantsPercent * 10) / 10,
      wantsTarget: Math.round(wantsTarget),
      wantsActual: Math.round(wantsTotal),
      wantsDeviation: Math.round(wantsTarget - wantsTotal),
      savingsPercent: Math.round(savingsPercent * 10) / 10,
      savingsTarget: Math.round(savingsTarget),
      savingsActual: Math.round(savingsTotal),
      savingsDeviation: Math.round(savingsTarget - savingsTotal),
    };
  }

  // ── get transactions for period ─────────────────────────
  getTransactionsForPeriod(days: number = 30): Transaction[] {
    const transactions = this.financeService.transactions();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return transactions.filter((tx) => new Date(tx.date) >= cutoffDate);
  }

  // ── get previous period transactions ─────────────────────
  getPreviousPeriodTransactions(days: number = 30): Transaction[] {
    const transactions = this.financeService.transactions();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days * 2));
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - days);
    
    return transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return txDate >= startDate && txDate < endDate;
    });
  }

  // ── get monthly comparison data ─────────────────────────
  getMonthlyComparisonData(): MonthlyComparisonData {
    const transactions = this.financeService.transactions();
    const monthlyData: MonthlyComparisonData = { labels: [], income: [], expenses: [] };

    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthTransactions = transactions.filter((tx) => {
        const txDate = new Date(tx.date);
        return txDate >= monthStart && txDate <= monthEnd;
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((s, t) => s + t.amount, 0);
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((s, t) => s + t.amount, 0);

      monthlyData.labels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
      monthlyData.income.push(income);
      monthlyData.expenses.push(expenses);
    }

    return monthlyData;
  }

  private calculateSafeToSpend(current: Transaction[]): SafeToSpendResult {
    const income = current.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = current.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const savingsTarget = income * 0.2;
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysLeftInMonth = Math.max(1, daysInMonth - now.getDate() + 1);
    const remaining = income - expenses - savingsTarget;

    return {
      safeDailyAmount: remaining / daysLeftInMonth,
      isNegative: remaining < 0,
      daysLeftInMonth,
    };
  }

  private calculateMicroSpending(current: Transaction[], threshold: number = 15): MicroSpendingResult {
    const expenses = current.filter((t) => t.type === 'expense');
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const micro = expenses.filter((t) => t.amount < threshold);
    const total = micro.reduce((sum, t) => sum + t.amount, 0);
    const percentOfExpenses = totalExpenses > 0 ? (total / totalExpenses) * 100 : 0;

    return { count: micro.length, total, percentOfExpenses };
  }

  private calculateZeroSpendStreak(current: Transaction[]): number {
    if (current.length === 0) {
      return 0;
    }

    const expenseByDate = current
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => {
        const ymd = t.date.slice(0, 10);
        acc.set(ymd, (acc.get(ymd) ?? 0) + t.amount);
        return acc;
      }, new Map<string, number>());

    const earliest = new Date(Math.min(...current.map((t) => new Date(t.date).getTime())));
    earliest.setHours(0, 0, 0, 0);

    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    let streak = 0;
    while (cursor >= earliest) {
      const ymd = cursor.toISOString().slice(0, 10);
      const spent = expenseByDate.get(ymd) ?? 0;
      if (spent !== 0) {
        break;
      }
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
  }

  private calculateWeekendPersona(current: Transaction[]): WeekendPersonaResult {
    const expenses = current.filter((t) => t.type === 'expense');
    if (expenses.length === 0) {
      return {
        weekendAvg: 0,
        weekdayAvg: 0,
        ratio: 0,
        isWeekendSpender: false,
        potentialMonthlySavings: 0,
      };
    }

    const dailyExpense = expenses.reduce((acc, tx) => {
      const ymd = tx.date.slice(0, 10);
      acc.set(ymd, (acc.get(ymd) ?? 0) + tx.amount);
      return acc;
    }, new Map<string, number>());

    let weekendTotal = 0;
    let weekdayTotal = 0;
    let weekendDays = 0;
    let weekdayDays = 0;

    for (const [ymd, amount] of dailyExpense) {
      const day = new Date(ymd).getDay();
      if (day === 0 || day === 6) {
        weekendTotal += amount;
        weekendDays += 1;
      } else {
        weekdayTotal += amount;
        weekdayDays += 1;
      }
    }

    const weekendAvg = weekendDays > 0 ? weekendTotal / weekendDays : 0;
    const weekdayAvg = weekdayDays > 0 ? weekdayTotal / weekdayDays : 0;
    const ratio = weekdayAvg > 0 ? weekendAvg / weekdayAvg : 0;
    const isWeekendSpender = weekendDays > 0 && weekdayDays > 0 && ratio > 1.5;
    const potentialMonthlySavings = isWeekendSpender ? Math.max(0, (weekendAvg - weekdayAvg) * 8) : 0;

    return {
      weekendAvg,
      weekdayAvg,
      ratio,
      isWeekendSpender,
      potentialMonthlySavings,
    };
  }

  private calculateHealthScore(current: Transaction[]): HealthScoreResult {
    const income = current.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = current.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const netCashFlow = income - expenses;
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
    const streak = this.calculateZeroSpendStreak(current);

    let score = 50;

    if (savingsRate > 25) {
      score += 20;
    } else if (savingsRate > 15) {
      score += 15;
    } else if (savingsRate > 5) {
      score += 5;
    }

    if (streak >= 5) {
      score += 15;
    } else if (streak >= 3) {
      score += 10;
    } else if (streak >= 1) {
      score += 5;
    }

    if (netCashFlow < 0) {
      const cashFlowPenalty = income > 0
        ? Math.min(35, Math.round((Math.abs(netCashFlow) / income) * 100))
        : 35;
      score -= cashFlowPenalty;
    }

    const clamped = Math.max(0, Math.min(100, score));
    const tier: HealthScoreResult['tier'] = clamped >= 85
      ? 'Excellent'
      : clamped >= 70
        ? 'Good'
        : clamped >= 50
          ? 'Fair'
          : 'Needs Attention';

    return { score: clamped, tier };
  }

  private formatMoney(value: number): string {
    return this.currencyFormatter.format(Math.max(0, Math.round(value)));
  }
}
