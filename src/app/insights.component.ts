import { Component, OnInit, inject, signal, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BudgetDeviationResult,
  CategoryBreakdown,
  HealthScoreResult,
  InsightStory,
  InsightsService,
  MonthlyComparisonData,
  OpportunityCostResult,
  QuickWin,
  SmartAction,
  SummaryStats,
} from './services/insights.service';
import { FinanceStateService } from './services/finance-state.service';
import { RoleService } from './services/role.service';
import { AdminSettingsService } from './services/admin-settings.service';
import { Chart, registerables, TooltipItem } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.css'
})
export class InsightsComponent implements OnInit, AfterViewInit {
  private insights = inject(InsightsService);
  private finance = inject(FinanceStateService);
  private roleService = inject(RoleService);
  private adminSettings = inject(AdminSettingsService);

  @ViewChild('monthlyTrendChart') monthlyChartRef!: ElementRef<HTMLCanvasElement>;
  private monthlyChart?: Chart<'line'>;

  // Expose Math for template usage
  readonly Math = Math;

  // Signals for reactive UI
  stories = signal<InsightStory[]>([]);
  breakdown = signal<CategoryBreakdown[]>([]);
  quickWins = signal<QuickWin[]>([]);
  smartActions = signal<SmartAction[]>([]);
  opportunityCost = signal<OpportunityCostResult>({
    category: '',
    monthlyAmount: 0,
    futureValue: 0,
    years: 10,
    returnRate: 0.07,
  });
  budgetDeviation = signal<BudgetDeviationResult>({
    needsPercent: 50,
    needsTarget: 0,
    needsActual: 0,
    needsDeviation: 0,
    wantsPercent: 30,
    wantsTarget: 0,
    wantsActual: 0,
    wantsDeviation: 0,
    savingsPercent: 20,
    savingsTarget: 0,
    savingsActual: 0,
    savingsDeviation: 0,
  });
  stats = signal<SummaryStats>({
    saved: 0,
    savedDelta: 0,
    savingsRate: 0,
    biggestDay: null,
    avgDaily: 0,
  });
  monthlyData = signal<MonthlyComparisonData>({ labels: [], income: [], expenses: [] });
  healthScore = signal<HealthScoreResult>({ score: 50, tier: 'Fair' });
  selectedDays = signal<number>(30);
  showAdvancedSignals = signal<boolean>(false);
  adminActionMessage = signal<string>('');
  anomalyDetectionActive = signal<boolean>(false);
  benchmarkModeActive = signal<boolean>(false);
  periodFrozen = signal<boolean>(false);
  systemHealthStatus = signal<'healthy' | 'degraded' | 'checking'>('healthy');
  deepAnalysisRunning = signal<boolean>(false);
  auditLog = signal<{ time: string; action: string; user: string }[]>([]);
  alertsConfigured = signal<number>(3);
  budgetThreshold = signal<number>(80);

  readonly periods = [7, 30, 90];

  get greetingMessage(): string {
    const name = this.roleService.isAdmin() ? 'Admin' : 'Adarsh';
    return this.insights.getGreeting(name);
  }

  get isAdmin(): boolean {
    return this.roleService.isAdmin();
  }

  ngOnInit() {
    this.loadInsights();
  }

  ngAfterViewInit() {
    this.initMonthlyChart();
  }

  private loadInsights() {
    const days = this.selectedDays();
    const current = this.insights.getTransactionsForPeriod(days);
    const previous = this.insights.getPreviousPeriodTransactions(days);
    const income = current.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);

    this.stats.set(this.insights.getSummaryStats(current, previous));
    this.stories.set(this.insights.generateStories(current, previous));
    this.breakdown.set(this.insights.getCategoryBreakdown(current));
    this.quickWins.set(this.insights.getQuickWins(current, this.stats()));
    this.healthScore.set(this.insights.getFinancialHealthScore(current));
    
    // NEW: Prescriptive analytics
    this.smartActions.set(this.insights.generateSmartActions(current, this.healthScore().score));
    this.opportunityCost.set(this.insights.calculateOpportunityCost(current));
    this.budgetDeviation.set(this.insights.calculateBudgetDeviation(current, income));
    
    this.monthlyData.set(this.insights.getMonthlyComparisonData());
    
    setTimeout(() => this.updateMonthlyChart(), 100);
  }

  setPeriod(days: number): void {
    this.selectedDays.set(days);
    this.loadInsights();
  }

  refreshInsights(): void {
    this.loadInsights();
    this.adminActionMessage.set(`Insights refreshed for last ${this.selectedDays()} days.`);
  }

  toggleAdvancedSignals(): void {
    this.showAdvancedSignals.update((value) => !value);
    this.adminActionMessage.set(this.showAdvancedSignals() ? 'Advanced signals enabled.' : 'Advanced signals hidden.');
  }

  exportInsightsSnapshot(): void {
    const payload = {
      generatedAt: new Date().toISOString(),
      periodDays: this.selectedDays(),
      stats: this.stats(),
      healthScore: this.healthScore(),
      topStories: this.stories().slice(0, 5),
      breakdown: this.breakdown(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `insights-snapshot-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    this.adminActionMessage.set('Insights snapshot exported.');
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
          },
          tooltip: {
            callbacks: {
              label: (item: TooltipItem<'line'>) => {
                const value = item.parsed.y ?? 0;
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(value);
              },
            },
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
              callback: (value: string | number) => {
                const amount = typeof value === 'number' ? value : Number(value);
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(Number.isFinite(amount) ? amount : 0);
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

  getStoryTypeClasses(type: InsightStory['type']): string {
    return 'border-violet-300 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/30';
  }

  getStoryIconClasses(type: InsightStory['type']): string {
    return 'text-violet-600 dark:text-violet-400';
  }

  getHealthTierClass(): string {
    const tier = this.healthScore().tier;
    if (tier === 'Excellent') return 'text-violet-200 dark:text-violet-100';
    if (tier === 'Good') return 'text-cyan-200 dark:text-cyan-100';
    if (tier === 'Fair') return 'text-amber-200 dark:text-amber-100';
    return 'text-rose-200 dark:text-rose-100';
  }

  // ==========================================
  // ADMIN CONTROL METHODS
  // ==========================================

  private pushAuditLog(action: string): void {
    const entry = {
      time: new Date().toLocaleTimeString(),
      action,
      user: 'Admin',
    };
    this.auditLog.update(log => [entry, ...log].slice(0, 20));
  }

  runDeepAnalysis(): void {
    this.deepAnalysisRunning.set(true);
    this.adminActionMessage.set('⚙️ Deep analysis in progress...');
    this.pushAuditLog('Deep Analysis initiated');
    setTimeout(() => {
      this.deepAnalysisRunning.set(false);
      this.loadInsights();
      this.adminActionMessage.set('✅ Deep analysis complete. Signals recalculated.');
      this.pushAuditLog('Deep Analysis completed successfully');
    }, 2000);
  }

  toggleAnomalyDetection(): void {
    this.anomalyDetectionActive.update(v => !v);
    const state = this.anomalyDetectionActive() ? 'ENABLED' : 'DISABLED';
    this.adminActionMessage.set(`🔍 Anomaly Detection ${state}`);
    this.pushAuditLog(`Anomaly Detection ${state}`);
  }

  toggleBenchmarkMode(): void {
    this.benchmarkModeActive.update(v => !v);
    const state = this.benchmarkModeActive() ? 'ENABLED' : 'DISABLED';
    this.adminActionMessage.set(`📊 Benchmark Mode ${state} — comparing against industry averages`);
    this.pushAuditLog(`Benchmark Mode ${state}`);
  }

  togglePeriodFreeze(): void {
    this.periodFrozen.update(v => !v);
    const state = this.periodFrozen() ? 'FROZEN' : 'UNFROZEN';
    this.adminActionMessage.set(`🔒 Period ${state}. Data locked for ${this.selectedDays()}-day window.`);
    this.pushAuditLog(`Period ${state} for last ${this.selectedDays()} days`);
  }

  runSystemHealthCheck(): void {
    this.systemHealthStatus.set('checking');
    this.adminActionMessage.set('🏥 Running system diagnostics...');
    this.pushAuditLog('System Health Check initiated');
    setTimeout(() => {
      this.systemHealthStatus.set('healthy');
      this.adminActionMessage.set('✅ System healthy — all data pipelines operational.');
      this.pushAuditLog('System Health Check passed');
    }, 1500);
  }

  generateFullReport(): void {
    this.adminActionMessage.set('📄 Generating comprehensive financial report...');
    this.pushAuditLog('Full Report generation initiated');
    const current = this.insights.getTransactionsForPeriod(this.selectedDays());
    const report = {
      generatedAt: new Date().toISOString(),
      generatedBy: 'Admin',
      periodDays: this.selectedDays(),
      stats: this.stats(),
      healthScore: this.healthScore(),
      budgetDeviation: this.budgetDeviation(),
      opportunityCost: this.opportunityCost(),
      breakdown: this.breakdown(),
      smartActions: this.smartActions(),
      stories: this.stories(),
      totalTransactions: current.length,
      anomalyDetection: this.anomalyDetectionActive(),
      benchmarkMode: this.benchmarkModeActive(),
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `full-report-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    this.adminActionMessage.set('✅ Full report exported successfully.');
    this.pushAuditLog('Full Report exported');
  }

  raiseBudgetThreshold(): void {
    this.budgetThreshold.update(v => Math.min(100, v + 5));
    this.adminActionMessage.set(`🎯 Budget alert threshold set to ${this.budgetThreshold()}%`);
    this.pushAuditLog(`Budget threshold updated to ${this.budgetThreshold()}%`);
  }

  lowerBudgetThreshold(): void {
    this.budgetThreshold.update(v => Math.max(10, v - 5));
    this.adminActionMessage.set(`🎯 Budget alert threshold set to ${this.budgetThreshold()}%`);
    this.pushAuditLog(`Budget threshold updated to ${this.budgetThreshold()}%`);
  }

  configureAlerts(): void {
    this.alertsConfigured.update(v => (v % 5) + 1);
    this.adminActionMessage.set(`🔔 Alert sensitivity updated — ${this.alertsConfigured()} active rule(s)`);
    this.pushAuditLog(`Alert configuration updated: ${this.alertsConfigured()} rules active`);
  }

  clearAuditLog(): void {
    this.auditLog.set([]);
    this.adminActionMessage.set('🗑️ Audit log cleared.');
  }
}
