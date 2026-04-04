import { Injectable, signal } from '@angular/core';

export interface AlgorithmConstants {
  marketReturnRate: number; // Default 7%
  targetSavingsRate: number; // Default 20%
  microSpendThreshold: number; // Default $15
  excludeOutliers: boolean; // Default false
}

export interface SimulationModifiers {
  incomeModifier: number; // Default 1.0 (-50% to +50% range)
  expenseModifier: number; // Default 1.0 (-50% to +50% range)
}

const ADMIN_SETTINGS_KEY = 'finance-admin-settings';

@Injectable({ providedIn: 'root' })
export class AdminSettingsService {
  // Algorithm Constants - Global Settings
  private readonly _algorithmConstants = signal<AlgorithmConstants>({
    marketReturnRate: 7,
    targetSavingsRate: 20,
    microSpendThreshold: 15,
    excludeOutliers: false,
  });
  readonly algorithmConstants = this._algorithmConstants.asReadonly();

  // Simulation Modifiers - What-If Scenarios
  private readonly _simulationModifiers = signal<SimulationModifiers>({
    incomeModifier: 1.0,
    expenseModifier: 1.0,
  });
  readonly simulationModifiers = this._simulationModifiers.asReadonly();

  constructor() {
    this.loadSettings();
  }

  // Algorithm Constants getters
  get marketReturnRate(): number {
    return this._algorithmConstants().marketReturnRate / 100;
  }

  get targetSavingsRate(): number {
    return this._algorithmConstants().targetSavingsRate / 100;
  }

  get microSpendThreshold(): number {
    return this._algorithmConstants().microSpendThreshold;
  }

  get excludeOutliers(): boolean {
    return this._algorithmConstants().excludeOutliers;
  }

  // Simulation Modifiers getters
  get incomeModifier(): number {
    return this._simulationModifiers().incomeModifier;
  }

  get expenseModifier(): number {
    return this._simulationModifiers().expenseModifier;
  }

  // Update methods for Algorithm Constants
  updateMarketReturnRate(value: number): void {
    this._algorithmConstants.update(constants => ({
      ...constants,
      marketReturnRate: Math.max(0, Math.min(50, value)) // Clamp between 0-50%
    }));
    this.saveSettings();
  }

  updateTargetSavingsRate(value: number): void {
    this._algorithmConstants.update(constants => ({
      ...constants,
      targetSavingsRate: Math.max(0, Math.min(100, value)) // Clamp between 0-100%
    }));
    this.saveSettings();
  }

  updateMicroSpendThreshold(value: number): void {
    this._algorithmConstants.update(constants => ({
      ...constants,
      microSpendThreshold: Math.max(0, Math.min(1000, value)) // Clamp between $0-$1000
    }));
    this.saveSettings();
  }

  toggleExcludeOutliers(): void {
    this._algorithmConstants.update(constants => ({
      ...constants,
      excludeOutliers: !constants.excludeOutliers
    }));
    this.saveSettings();
  }

  // Update methods for Simulation Modifiers
  updateIncomeModifier(value: number): void {
    this._simulationModifiers.update(modifiers => ({
      ...modifiers,
      incomeModifier: Math.max(0.5, Math.min(1.5, value)) // Clamp between 0.5-1.5
    }));
  }

  updateExpenseModifier(value: number): void {
    this._simulationModifiers.update(modifiers => ({
      ...modifiers,
      expenseModifier: Math.max(0.5, Math.min(1.5, value)) // Clamp between 0.5-1.5
    }));
  }

  resetSimulation(): void {
    this._simulationModifiers.set({
      incomeModifier: 1.0,
      expenseModifier: 1.0,
    });
  }

  // Utility methods
  isSimulationActive(): boolean {
    const mods = this._simulationModifiers();
    return mods.incomeModifier !== 1.0 || mods.expenseModifier !== 1.0;
  }

  getSimulationStatus(): string {
    if (!this.isSimulationActive()) return 'No Active Simulation';
    
    const income = this._simulationModifiers().incomeModifier;
    const expense = this._simulationModifiers().expenseModifier;
    
    const parts: string[] = [];
    if (income !== 1.0) {
      const change = Number(((income - 1) * 100).toFixed(0));
      parts.push(`Income ${change > 0 ? '+' : ''}${change}%`);
    }
    if (expense !== 1.0) {
      const change = Number(((expense - 1) * 100).toFixed(0));
      parts.push(`Expenses ${change > 0 ? '+' : ''}${change}%`);
    }
    
    return parts.join(', ');
  }

  // Persistence
  private loadSettings(): void {
    try {
      const stored = localStorage.getItem(ADMIN_SETTINGS_KEY);
      if (stored) {
        const settings = JSON.parse(stored);
        if (settings.algorithmConstants) {
          this._algorithmConstants.set(settings.algorithmConstants);
        }
        if (settings.simulationModifiers) {
          this._simulationModifiers.set(settings.simulationModifiers);
        }
      }
    } catch (error) {
      console.warn('Failed to load admin settings:', error);
    }
  }

  private saveSettings(): void {
    try {
      const settings = {
        algorithmConstants: this._algorithmConstants(),
        simulationModifiers: this._simulationModifiers(),
      };
      localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save admin settings:', error);
    }
  }
}
