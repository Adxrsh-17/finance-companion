import { Component, OnInit, inject, signal, computed, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InsightsService } from './services/insights.service';
import { FinanceStateService } from './services/finance-state.service';
import { DataService } from './services/data.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.css'
})
export class InsightsComponent implements OnInit, AfterViewInit {
  private insights = inject(InsightsService);
  private finance = inject(FinanceStateService);
  private dataService = inject(DataService);

  @ViewChild('monthlyTrendChart') monthlyChartRef!: ElementRef<HTMLCanvasElement>;
  private monthlyChart?: Chart;

  // Signals for reactive UI
  greeting = signal('');
  stories = signal<any[]>([]);
  breakdown = signal<any[]>([]);
  quickWins = signal<any[]>([]);
  stats = signal<any>({});
  monthlyData = signal<any>({ labels: [], income: [], expenses: [] });

  // Get current user for greeting
  currentUser = toSignal(this.dataService.currentUser$, { initialValue: null });

  constructor() {}

  ngOnInit() {
    this.loadInsights();
  }

  ngAfterViewInit() {
    this.initMonthlyChart();
  }

  private loadInsights() {
    const current = this.insights.getTransactionsForPeriod(30);
    const previous = this.insights.getPreviousPeriodTransactions(30);
    
    const user = this.currentUser();
    if (user) {
      this.greeting.set(this.insights.getGreeting(user.name));
    }

    this.stats.set(this.insights.getSummaryStats(current, previous));
    this.stories.set(this.insights.generateStories(current, previous));
    this.breakdown.set(this.insights.getCategoryBreakdown(current));
    this.quickWins.set(this.insights.getQuickWins(current, this.stats()));
    this.monthlyData.set(this.insights.getMonthlyComparisonData());
    
    // Update chart when data changes
    setTimeout(() => this.updateMonthlyChart(), 100);
  }

  private initMonthlyChart() {
    const ctx = this.monthlyChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    const data = this.monthlyData();
    
    this.monthlyChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Income',
            data: data.income,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
          },
          {
            label: 'Expenses',
            data: data.expenses,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: this.finance.isDark() ? '#e2e8f0' : '#475569',
              usePointStyle: true,
              padding: 20
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: this.finance.isDark() ? 'rgba(148, 163, 184, 0.12)' : 'rgba(100, 116, 139, 0.15)',
              display: true
            },
            ticks: {
              color: this.finance.isDark() ? '#e2e8f0' : '#475569'
            }
          },
          y: {
            grid: {
              color: this.finance.isDark() ? 'rgba(148, 163, 184, 0.12)' : 'rgba(100, 116, 139, 0.15)',
              display: true
            },
            ticks: {
              color: this.finance.isDark() ? '#e2e8f0' : '#475569',
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          }
        }
      }
    });
  }

  private updateMonthlyChart() {
    if (!this.monthlyChart) return;
    
    const data = this.monthlyData();
    this.monthlyChart.data.labels = data.labels;
    this.monthlyChart.data.datasets[0].data = data.income;
    this.monthlyChart.data.datasets[1].data = data.expenses;
    this.monthlyChart.update();
  }

  formatPct(val: number): string {
    return (val >= 0 ? '+' : '') + val.toFixed(1) + '%';
  }

  formatCurrency(val: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(val);
  }

  getStoryTypeClasses(type: string): string {
    switch (type) {
      case 'warning':
        return 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20';
      case 'positive':
        return 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20';
      case 'info':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
      default:
        return 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800';
    }
  }

  getStoryIconClasses(type: string): string {
    switch (type) {
      case 'warning':
        return 'text-amber-600 dark:text-amber-400';
      case 'positive':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'info':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-slate-600 dark:text-slate-400';
    }
  }
}
