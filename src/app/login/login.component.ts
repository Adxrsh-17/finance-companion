import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService, User } from '../services/data.service';
import { RoleService, UserRole } from '../services/role.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly dataService = inject(DataService);
  private readonly roleService = inject(RoleService);
  private readonly fb = inject(FormBuilder);

  isLoading = false;
  loginError = '';
  readonly particles = Array.from({ length: 18 }, (_, index) => index + 1);

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  private readonly mockUsers: Record<string, { password: string; role: UserRole; name: string; dataRole: User['role'] }> = {
    'admin@zorvyn.com': {
      password: 'admin123',
      role: 'admin',
      name: 'Admin User',
      dataRole: 'administrator',
    },
    'viewer@zorvyn.com': {
      password: 'viewer123',
      role: 'viewer',
      name: 'Viewer User',
      dataRole: 'user',
    },
  };

  constructor() {
    if (this.roleService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLoginSubmit(): void {
    if (this.isLoading) return;
    this.loginError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loginError = 'Please enter a valid email and password.';
      return;
    }

    const email = this.loginForm.controls.email.value.trim().toLowerCase();
    const password = this.loginForm.controls.password.value;
    const account = this.mockUsers[email];

    this.isLoading = true;

    setTimeout(() => {
      if (!account || account.password !== password) {
        this.loginError = 'Invalid credentials. Try admin@zorvyn.com/admin123 or viewer@zorvyn.com/viewer123.';
        this.isLoading = false;
        return;
      }

      const user: User = {
        id: account.role === 'admin' ? '1' : '2',
        name: account.name,
        email,
        role: account.dataRole,
        avatar: account.role === 'admin' ? 'AD' : 'VW',
        department: 'Finance',
        lastLogin: new Date()
      };

      this.dataService.setCurrentUser(user);
      this.roleService.loginAs(account.role);
      localStorage.setItem('userEmail', email);
      this.router.navigate(['/dashboard']);

      this.isLoading = false;
    }, 500);
  }
}
