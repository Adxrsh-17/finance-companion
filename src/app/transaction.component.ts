import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { FinanceStateService } from './services/finance-state.service';
import type { SortField, Transaction, TransactionType } from './models/transaction.model';
import { CATEGORY_OPTIONS } from './data/mock-transactions';
import { RoleService } from './services/role.service';
import { HasRoleDirective } from './directives/permission.directive';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule, HasRoleDirective],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
})
export class TransactionComponent implements OnInit, OnDestroy {
  protected readonly finance = inject(FinanceStateService);
  private readonly roleService = inject(RoleService);

  protected readonly categoryOptions = CATEGORY_OPTIONS;
  protected readonly currentRole = toSignal(this.roleService.role$, { initialValue: 'viewer' as const });
  protected readonly isAdmin = computed(() => this.currentRole() === 'admin');

  private readonly searchSubject = new Subject<string>();
  private searchSub?: Subscription;

  /** Local input — synced to service after debounce */
  protected searchInput = '';

  protected readonly pageSize = signal(8);
  protected readonly page = signal(1);

  protected expandedId: string | null = null;

  protected showModal = false;
  protected editingId: string | null = null;
  protected formDate = '';
  protected formAmount: number | null = null;
  protected formCategory = 'Food';
  protected formType: TransactionType = 'expense';
  protected formNote = '';
  protected formError = '';

  protected readonly paginatedRows = computed(() => {
    const all = this.finance.filteredTransactions();
    const size = this.pageSize();
    const p = this.page();
    const start = (p - 1) * size;
    return all.slice(start, start + size);
  });

  protected readonly totalPages = computed(() => {
    const n = this.finance.filteredTransactions().length;
    return Math.max(1, Math.ceil(n / this.pageSize()));
  });

  constructor() {
    effect(() => {
      this.finance.filteredTransactions();
      this.page.set(1);
    });

    effect(() => {
      const role = this.currentRole();
      if (role === 'viewer' && this.showModal) {
        this.closeModal();
      }
    });
  }

  ngOnInit(): void {
    this.searchInput = this.finance.searchQuery();
    this.searchSub = this.searchSubject
      .pipe(debounceTime(320), distinctUntilChanged())
      .subscribe((q) => this.finance.setSearch(q));
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
    this.searchSubject.complete();
  }

  protected onSearchType(value: string): void {
    this.searchInput = value;
    this.searchSubject.next(value);
  }

  protected categoryEmoji(cat: string): string {
    const m: Record<string, string> = {
      Food: '🍔',
      Transport: '🚗',
      Shopping: '🛍️',
      Bills: '📄',
      Salary: '💰',
      Freelance: '💼',
      Other: '📌',
    };
    return m[cat] ?? '🏷️';
  }

  protected toggleExpand(id: string): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  protected setPage(p: number): void {
    const max = this.totalPages();
    this.page.set(Math.min(max, Math.max(1, p)));
  }

  protected openCreate(): void {
    if (!this.isAdmin()) return;
    this.editingId = null;
    this.formDate = new Date().toISOString().slice(0, 10);
    this.formAmount = null;
    this.formCategory = 'Food';
    this.formType = 'expense';
    this.formNote = '';
    this.formError = '';
    this.showModal = true;
  }

  protected openEdit(tx: Transaction): void {
    if (!this.isAdmin()) return;
    this.editingId = tx.id;
    this.formDate = tx.date;
    this.formAmount = tx.amount;
    this.formCategory = tx.category;
    this.formType = tx.type;
    this.formNote = tx.note ?? '';
    this.formError = '';
    this.showModal = true;
  }

  protected closeModal(): void {
    this.showModal = false;
    this.resetModalForm();
  }

  protected save(): void {
    if (!this.isAdmin()) {
      this.closeModal();
      return;
    }

    this.formError = '';
    if (!this.formDate?.trim()) {
      this.formError = 'Date is required.';
      return;
    }
    if (this.formAmount == null || this.formAmount <= 0 || Number.isNaN(this.formAmount)) {
      this.formError = 'Enter a valid amount greater than zero.';
      return;
    }
    if (this.editingId) {
      this.finance.updateTransaction(this.editingId, {
        date: this.formDate,
        amount: this.formAmount,
        category: this.formCategory,
        type: this.formType,
        note: this.formNote.trim() || undefined,
      });
    } else {
      this.finance.addTransaction({
        date: this.formDate,
        amount: this.formAmount,
        category: this.formCategory,
        type: this.formType,
        note: this.formNote.trim() || undefined,
      });
    }
    this.closeModal();
  }

  protected delete(tx: Transaction): void {
    if (!this.isAdmin()) return;
    if (!confirm(`Remove transaction "${tx.category}" on ${tx.date}?`)) return;
    this.finance.deleteTransaction(tx.id);
  }

  protected toggleSort(field: SortField): void {
    this.finance.toggleSort(field);
  }

  protected sortLabel(field: SortField): string {
    if (this.finance.sortField() !== field) {
      return '↕';
    }
    return this.finance.sortDirection() === 'asc' ? '↑' : '↓';
  }

  protected exportJson(): void {
    const blob = new Blob([this.finance.exportJson()], {
      type: 'application/json',
    });
    this.download(blob, 'transactions.json');
  }

  protected exportCsv(): void {
    const blob = new Blob([this.finance.exportCsv()], { type: 'text/csv' });
    this.download(blob, 'transactions.csv');
  }

  private download(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  protected resetSample(): void {
    if (confirm('Replace all transactions with the built-in sample dataset?')) {
      this.finance.resetToMockData();
    }
  }

  private resetModalForm(): void {
    this.editingId = null;
    this.formDate = '';
    this.formAmount = null;
    this.formCategory = 'Food';
    this.formType = 'expense';
    this.formNote = '';
    this.formError = '';
  }
}
