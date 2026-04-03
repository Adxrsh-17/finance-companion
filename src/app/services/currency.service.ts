import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Currency {
  code: string;
  symbol: string;
  label: string;
  rate: number; // relative to USD
  flag: string;
  shadow?: string;
}

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  readonly currencies: Currency[] = [
    { code: 'USD', symbol: '$', label: 'US Dollar',     rate: 1,      flag: '🇺🇸', shadow: '0 0 8px rgba(139, 92, 246, 0.3)' },
    { code: 'INR', symbol: '₹',  label: 'Indian Rupee',  rate: 83.5,   flag: '🇮🇳' },
    { code: 'EUR', symbol: '€',  label: 'Euro',          rate: 0.92,   flag: '🇪🇺' },
    { code: 'GBP', symbol: '£',  label: 'British Pound', rate: 0.79,   flag: '🇬🇧' },
    { code: 'JPY', symbol: '¥',  label: 'Japanese Yen',  rate: 149.5,  flag: '🇯🇵' },
    { code: 'AED', symbol: 'د.إ',label: 'UAE Dirham',    rate: 3.67,   flag: '🇦🇪' },
    { code: 'SGD', symbol: 'S$', label: 'Singapore $',   rate: 1.34,   flag: '🇸🇬' },
  ];

  private saved = localStorage.getItem('currency') || 'USD';
  currency$ = new BehaviorSubject<Currency>(
    this.currencies.find(c => c.code === this.saved) || this.currencies[0]
  );

  get current() { return this.currency$.value; }

  setCurrency(code: string) {
    const c = this.currencies.find(x => x.code === code);
    if (!c) return;
    this.currency$.next(c);
    localStorage.setItem('currency', code);
  }

  // Convert a USD base amount to the selected currency
  convert(usdAmount: number): number {
    return +(usdAmount * this.current.rate).toFixed(2);
  }

  // Format with symbol
  format(usdAmount: number): string {
    const val = this.convert(usdAmount);
    return this.current.symbol + val.toLocaleString('en-IN', {
      minimumFractionDigits: 2, maximumFractionDigits: 2
    });
  }
}
