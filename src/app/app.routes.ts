import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard],
    data: { roles: ['admin', 'viewer'] }
  },
  {
    path: 'transactions',
    loadComponent: () => import('./transaction.component').then((m) => m.TransactionComponent),
    canActivate: [authGuard],
    data: { roles: ['admin', 'viewer'] }
  },
  {
    path: 'insights',
    loadComponent: () => import('./insights.component').then((m) => m.InsightsComponent),
    canActivate: [authGuard],
    data: { roles: ['admin', 'viewer'] }
  },
  { path: '**', redirectTo: 'login' },
];
