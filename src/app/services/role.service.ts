import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export type UserRole = 'admin' | 'viewer';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private roleSubject = new BehaviorSubject<UserRole>('viewer');
  public role$ = this.roleSubject.asObservable();

  constructor() {
    // Load role from localStorage on init
    const savedRole = localStorage.getItem('userRole') as UserRole;
    if (savedRole === 'admin' || savedRole === 'viewer') {
      this.roleSubject.next(savedRole);
    }
  }

  setRole(role: UserRole) {
    this.roleSubject.next(role);
    localStorage.setItem('userRole', role);
  }

  getCurrentRole(): UserRole {
    return this.roleSubject.value;
  }

  isAdmin(): boolean {
    return this.roleSubject.value === 'admin';
  }

  isViewer(): boolean {
    return this.roleSubject.value === 'viewer';
  }

  // Observable getters for template usage
  get isAdmin$() {
    return this.role$.pipe(
      map(role => role === 'admin')
    );
  }

  get isViewer$() {
    return this.role$.pipe(
      map(role => role === 'viewer')
    );
  }
}
