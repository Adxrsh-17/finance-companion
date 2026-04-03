import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';

export interface PeriodStats {
  income: number;
  expense: number;
  incomeDelta: string;
  expenseDelta: string;
  balance: number;
}

export interface BalanceTrend {
  labels: string[];
  data: number[];
}

export interface CategoryBreakdown {
  labels: string[];
  data: number[];
  colors: string[];
}

export interface CategoryLegend {
  label: string;
  amount: number;
  percent: number;
  color: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {

  constructor() {}

  // 📊 Calculate period statistics
  getPeriodStats(txs: Transaction[], prevTxs: Transaction[]): PeriodStats {
    const income = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const prevIncome = prevTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const prevExpense = prevTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    
    const incomeDelta = prevIncome > 0 ? ((income - prevIncome) / prevIncome * 100) : 0;
    const expenseDelta = prevExpense > 0 ? ((expense - prevExpense) / prevExpense * 100) : 0;
    
    return {
      income,
      expense,
      incomeDelta: (incomeDelta >= 0 ? '+' : '') + incomeDelta.toFixed(1),
      expenseDelta: (expenseDelta >= 0 ? '+' : '') + expenseDelta.toFixed(1),
      balance: income - expense
    };
  }

  // 📈 Calculate balance trend
  getBalanceTrend(txs: Transaction[], days: number): BalanceTrend {
    const result: Record<string, number> = {};
    const now = new Date();
    
    // Initialize all days with 0
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      result[d.toISOString().substring(0, 10)] = 0;
    }
    
    // Sum transactions by day
    txs.forEach(t => {
      const day = t.date.substring(0, 10);
      if (result[day] !== undefined) {
        result[day] += t.type === 'income' ? t.amount : -t.amount;
      }
    });
    
    // Convert to cumulative
    let running = 0;
    const data = Object.values(result).map(v => {
      running += v;
      return +running.toFixed(2);
    });
    
    const labels = Object.keys(result).map(d => {
      const date = new Date(d);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    return { labels, data };
  }

  // 🍩 Calculate category breakdown
  getCategoryBreakdown(txs: Transaction[]): CategoryBreakdown {
    const expenses = txs.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, t) => {
      const cat = t.category || 'Other';
      acc[cat] = (acc[cat] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
    const palette = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f43f5e'];
    
    return {
      labels: sorted.map(([k]) => k),
      data: sorted.map(([, v]) => +v.toFixed(2)),
      colors: sorted.map((_, i) => palette[i % palette.length])
    };
  }

  // 📋 Get category legend data
  getCategoryLegend(breakdown: CategoryBreakdown): CategoryLegend[] {
    const total = breakdown.data.reduce((sum, val) => sum + val, 0);
    return breakdown.labels.map((label, i) => ({
      label,
      amount: breakdown.data[i],
      percent: Math.round((breakdown.data[i] / total) * 100),
      color: breakdown.colors[i]
    }));
  }

  // 🗓️ Generate sparkline data (last 7 points)
  getSparklineData(txs: Transaction[]): number[] {
    const now = new Date();
    const last7Days = [];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().substring(0, 10);
      
      const dayTotal = txs
        .filter(t => t.date.substring(0, 10) === dayStr)
        .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
      
      last7Days.push(dayTotal);
    }
    
    return last7Days;
  }
}
