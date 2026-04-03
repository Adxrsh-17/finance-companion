import { Pipe, PipeTransform, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CurrencyService } from '../services/currency.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Pipe({ name: 'appCurrency', pure: false })
export class CurrencyFormatPipe implements PipeTransform, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private cs: CurrencyService, private cdr: ChangeDetectorRef) {
    // Subscribe to currency changes to trigger re-evaluation
    this.cs.currency$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  transform(value: number): string {
    return this.cs.format(value);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
