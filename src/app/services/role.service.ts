import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { Router } from '@angular/router';

export type UserRole = 'admin' | 'viewer';

const ROLE_STORAGE_KEY = 'userRole';
const LEGACY_ROLE_STORAGE_KEY = 'finance-dashboard-role';
const AUTH_STORAGE_KEY = 'isAuthenticated';

function isUserRole(value: unknown): value is UserRole {
  return value === 'admin' || value === 'viewer';
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly roleSubject = new BehaviorSubject<UserRole>(this.readStoredRole());
  private readonly authenticatedSubject = new BehaviorSubject<boolean>(this.readStoredAuth());
  readonly role$ = this.roleSubject.asObservable().pipe(distinctUntilChanged());
  readonly isAuthenticated$ = this.authenticatedSubject.asObservable().pipe(distinctUntilChanged());

  constructor() {
    if (typeof window !== 'undefined') {
      fromEvent<StorageEvent>(window, 'storage')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((event) => {
          if (
            event.key !== ROLE_STORAGE_KEY
            && event.key !== LEGACY_ROLE_STORAGE_KEY
            && event.key !== AUTH_STORAGE_KEY
          ) {
            return;
          }
          const nextRole = this.readStoredRole();
          if (nextRole !== this.roleSubject.value) {
            this.roleSubject.next(nextRole);
          }

          const nextAuth = this.readStoredAuth();
          if (nextAuth !== this.authenticatedSubject.value) {
            this.authenticatedSubject.next(nextAuth);
          }
        });
    }
  }

  loginAs(role: UserRole): void {
    this.setRole(role);
    this.setAuthenticated(true);
  }

  setRole(role: UserRole): void {
    if (role === this.roleSubject.value) {
      this.persistRole(role);
      return;
    }
    this.roleSubject.next(role);
    this.persistRole(role);
  }

  getCurrentRole(): UserRole {
    return this.roleSubject.value;
  }

  isAuthenticated(): boolean {
    return this.authenticatedSubject.value;
  }

  isAdmin(): boolean {
    return this.roleSubject.value === 'admin';
  }

  isViewer(): boolean {
    return this.roleSubject.value === 'viewer';
  }

  get isAdmin$() {
    return this.role$.pipe(map((role) => role === 'admin'));
  }

  get isViewer$() {
    return this.role$.pipe(map((role) => role === 'viewer'));
  }

  logout(): void {
    this.setAuthenticated(false);
    this.setRole('viewer');

    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(ROLE_STORAGE_KEY);
      localStorage.removeItem(LEGACY_ROLE_STORAGE_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
    }

    this.router.navigate(['/login']);
  }

  private setAuthenticated(isAuthenticated: boolean): void {
    this.authenticatedSubject.next(isAuthenticated);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, String(isAuthenticated));
      localStorage.setItem('isLoggedIn', String(isAuthenticated));
    }
  }

  private readStoredAuth(): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }

    // Backward compatibility for sessions created before isAuthenticated key existed.
    if (localStorage.getItem(AUTH_STORAGE_KEY) === 'true') {
      return true;
    }

    return localStorage.getItem('isLoggedIn') === 'true';
  }

  private readStoredRole(): UserRole {
    if (typeof localStorage === 'undefined') {
      return 'viewer';
    }

    const primary = localStorage.getItem(ROLE_STORAGE_KEY);
    if (isUserRole(primary)) {
      return primary;
    }

    const legacy = localStorage.getItem(LEGACY_ROLE_STORAGE_KEY);
    if (isUserRole(legacy)) {
      return legacy;
    }

    return 'viewer';
  }

  private persistRole(role: UserRole): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(ROLE_STORAGE_KEY, role);
    localStorage.setItem(LEGACY_ROLE_STORAGE_KEY, role);
  }
}
