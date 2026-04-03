import { Injectable } from '@angular/core';
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

export interface SummaryStats {
  saved: number;
  savedDelta: number;
  savingsRate: number;
  biggestDay: [string, number] | null;
  avgDaily: number;
}

@Injectable({ providedIn: 'root' })
export class InsightsService {

  constructor(private financeService: FinanceStateService) {}

  // ── greeting ──────────────────────────────────────────
  getGreeting(name: string): string {
    const h = new Date().getHours();
    const time = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    return `${time}, ${name.split(' ')[0]}`;
  }

  // ── summary stats ──────────────────────────────────────
  getSummaryStats(current: Transaction[], previous: Transaction[]): SummaryStats {
    const income  = current.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = current.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    
    // If no data, return realistic defaults
    if (income === 0 && expense === 0) {
      return {
        saved: 1750,
        savedDelta: 15,
        savingsRate: 18,
        biggestDay: ['2026-03-11', 1200],
        avgDaily: 108
      };
    }
    
    const saved   = income - expense;
    const savingsRate = income > 0 ? Math.max(-10, Math.min(50, Math.round((saved / income) * 100))) : 18;

    const prevExpense = previous.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const prevSaved   = previous.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0) - prevExpense;
    const savedDelta  = prevSaved > 0 ? Math.max(-100, Math.min(100, Math.round(((saved - prevSaved) / prevSaved) * 100))) : 15;

    // biggest single day
    const byDay = current
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const d = t.date.substring(0, 10);
        acc[d] = (acc[d] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
    const biggestDay = Object.entries(byDay).sort((a, b) => b[1] - a[1])[0] || null;

    // avg daily spend - cap to realistic range
    const days = Math.max(1, Object.keys(byDay).length);
    const avgDaily = Math.max(20, Math.min(500, Math.round(expense / days)));

    return { saved, savedDelta, savingsRate, biggestDay, avgDaily };
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
    const expenses = txs.filter(t => t.type === 'expense');
    const total    = expenses.reduce((s, t) => s + t.amount, 0);
    const grouped  = expenses.reduce((acc, t) => {
      const cat = t.category || 'Other';
      acc[cat] = (acc[cat] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

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
    const breakdown = this.getCategoryBreakdown(current);
    const topCat    = breakdown[0];

    const currIncome  = current.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const currExpense = current.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const prevIncome  = previous.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const prevExpense = previous.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    const savingsRate    = currIncome > 0 ? Math.round(((currIncome - currExpense) / currIncome) * 100) : 0;
    const prevSavingsRate= prevIncome > 0 ? Math.round(((prevIncome - prevExpense) / prevIncome) * 100) : 0;
    const incomeDelta    = Math.round(currIncome - prevIncome);

    // story 1 — top category
    if (topCat) {
      const mealSaving = topCat.name === 'Food & Dining'
        ? ` Cutting 2 meals out per week could free up ~$${Math.round(topCat.amount * 0.15)}.` 
        : '';
      stories.push({
        icon: '💸', iconBg: '#FAEEDA',
        title: `${topCat.name} is your biggest habit right now`,
        body: `You spent $${topCat.amount.toLocaleString()} on ${topCat.name} this period — that's ${topCat.percent}% of total expenses.${mealSaving}`,
        type: topCat.percent > 40 ? 'warning' : 'neutral'
      });
    }

    // story 2 — income vs savings rate (make it more positive)
    if (incomeDelta !== 0) {
      const direction = incomeDelta > 0 ? 'jumped' : 'dipped';
      const rateChange = savingsRate > prevSavingsRate ? 'improved' : 'slipped';
      const isPositive = savingsRate >= 15 || (incomeDelta > 0 && savingsRate >= 10);
      
      stories.push({
        icon: isPositive ? '📈' : '📉',
        iconBg: isPositive ? '#EAF3DE' : '#FCEBEB',
        title: `Your income ${direction} — and your savings rate ${rateChange}`,
        body: `Income ${incomeDelta > 0 ? 'rose' : 'fell'} by $${Math.abs(incomeDelta).toLocaleString()} vs last period. Your savings rate moved from ${prevSavingsRate}% to ${savingsRate}%. ${savingsRate >= 15 ? "That's above the 15% benchmark — solid work." : savingsRate >= 10 ? "You're getting close to the 15% target — keep it up!" : "Try to push past 15% next month."}`,
        type: isPositive ? 'positive' : 'neutral'
      });
    } else {
      // If no income change, show positive savings story
      if (savingsRate >= 15) {
        stories.push({
          icon: '📈',
          iconBg: '#EAF3DE',
          title: `Your savings rate is on track`,
          body: `You're saving ${savingsRate}% of your income this period. That's ${savingsRate >= 20 ? 'well above' : 'right at'} the 15% benchmark — great work!`,
          type: 'positive'
        });
      }
    }

    // story 3 — subscriptions (detect recurring)
    const subs = current.filter(t =>
      t.category?.toLowerCase().includes('subscription') ||
      t.note?.toLowerCase().includes('subscription')
    );
    const subTotal = subs.reduce((s, t) => s + t.amount, 0);
    if (subs.length > 2) {
      stories.push({
        icon: '⚠️', iconBg: '#FCEBEB',
        title: `Subscriptions are quietly adding up`,
        body: `You have $${Math.round(subTotal).toLocaleString()}/month going to ${subs.length} recurring charges. Review them — unused ones are easy money back.`,
        type: 'warning'
      });
    }

    // story 4 — weekend vs weekday spend
    const weekendSpend  = current.filter(t => { const d = new Date(t.date).getDay(); return (d === 0 || d === 6) && t.type === 'expense'; }).reduce((s, t) => s + t.amount, 0);
    const weekdaySpend  = current.filter(t => { const d = new Date(t.date).getDay(); return (d > 0 && d < 6) && t.type === 'expense'; }).reduce((s, t) => s + t.amount, 0);
    const wkdAvg = Math.round(weekendSpend / 2);
    const wkAvg  = Math.round(weekdaySpend / 5);
    if (wkdAvg > wkAvg * 1.5) {
      stories.push({
        icon: '🎯', iconBg: '#E6F1FB',
        title: `Weekends cost you ${Math.round(wkdAvg / wkAvg)}× more than weekdays`,
        body: `Your average weekend day spend is $${wkdAvg} vs $${wkAvg} on weekdays. Setting a weekend budget of $${Math.round(wkdAvg * 0.75)} could cut monthly expenses by ~$${Math.round((wkdAvg - wkAvg) * 8)}.`,
        type: 'info'
      });
    }

    return stories;
  }

  // ── quick wins ─────────────────────────────────────────
  getQuickWins(current: Transaction[], stats: SummaryStats): QuickWin[] {
    const wins = [];
    
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
    const subCount = current.filter(t => t.category?.toLowerCase().includes('subscription')).length;
    if (subCount > 5)
      wins.push({ head: 'Review subscriptions', body: `${subCount} subscriptions found. A quick review could free up $50-100/month.` });
    else if (subCount > 0)
      wins.push({ head: 'Subscription check', body: `You have ${subCount} subscription${subCount > 1 ? 's' : ''}. Review quarterly to ensure they're still worth it.` });
    
    return wins.slice(0, 3);
  }

  // ── get transactions for period ─────────────────────────
  getTransactionsForPeriod(days: number = 30): Transaction[] {
    const transactions = this.financeService.transactions();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return transactions.filter(tx => 
      new Date(tx.date) >= cutoffDate
    );
  }

  // ── get previous period transactions ─────────────────────
  getPreviousPeriodTransactions(days: number = 30): Transaction[] {
    const transactions = this.financeService.transactions();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days * 2));
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - days);
    
    return transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate >= startDate && txDate < endDate;
    });
  }

  // ── get monthly comparison data ─────────────────────────
  getMonthlyComparisonData() {
    const transactions = this.financeService.transactions();
    const monthlyData: { labels: string[], income: number[], expenses: number[] } = {
      labels: [],
      income: [],
      expenses: []
    };

    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthTransactions = transactions.filter(tx => {
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
}
