import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { CurrencyService } from '../services/currency.service';
import { FinanceStateService } from '../services/finance-state.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <div class="app-layout">
      <!-- Animated Background -->
      <div class="animated-background">
        <!-- Particle Canvas -->
        <canvas id="particleCanvas" class="particle-canvas"></canvas>
        
        <!-- Floating Orbs -->
        <div class="floating-orb orb-1"></div>
        <div class="floating-orb orb-2"></div>
        <div class="floating-orb orb-3"></div>
        <div class="floating-orb orb-4"></div>
        <div class="floating-orb orb-5"></div>
      </div>

      <!-- Conditionally show sidebar -->
      <aside *ngIf="!isLandingPage()" class="sidebar">
        <!-- Sidebar -->
        <div class="sidebar-container">
          <!-- Logo Section -->
          <div class="logo-section">
            <div class="logo-wrapper">
              <div class="logo-icon">Z</div>
              <div class="logo-text">
                <div class="logo-title">Zorvyn</div>
                <div class="logo-subtitle">Technologies</div>
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <nav class="navigation-section">
            <div class="nav-title">Main Menu</div>
            <div class="nav-items">
              <a routerLink="/dashboard" routerLinkActive="nav-item active" 
                 class="nav-item">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 012-1h2a1 1 0 012 2v10m-6 0a1 1 0 002 2h2a1 1 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2 2z"></path>
                </svg>
                <span class="nav-label">Dashboard</span>
              </a>
              
              <a routerLink="/transactions" routerLinkActive="nav-item active"
                 class="nav-item">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 012 2M9 5a2 2 0 012-2h2a2 2 0 012 2z"></path>
                </svg>
                <span class="nav-label">Transactions</span>
              </a>
              
              <a routerLink="/insights" routerLinkActive="nav-item active"
                 class="nav-item">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2 2z"></path>
                </svg>
                <span class="nav-label">Insights</span>
              </a>
            </div>
          </nav>

          <!-- Date and Time -->
          <div class="datetime-section">
            <div class="datetime-card">
              <div class="time-display">{{ currentTime() }}</div>
              <div class="date-display">{{ currentDate() }}</div>
            </div>
          </div>

          <!-- User Profile -->
          <div class="user-profile-section">
            <div class="user-card">
              <div class="user-avatar">
                <span class="avatar-text">AP</span>
                <div class="status-indicator"></div>
              </div>
              <div class="user-info">
                <div class="user-name">Adarsh Pradeep</div>
                <div class="user-role">Financial Analyst</div>
              </div>
              <button class="sign-out-btn" (click)="logout()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="main-content">
        <!-- Header - only show if not landing page -->
        <header *ngIf="!isLandingPage()" class="header">
          <!-- Accent Line -->
          <div class="accent-line"></div>
          
          <!-- Header Content -->
          <div class="header-content">
            <!-- LEFT: Page title only -->
            <div class="header-title-section">
              <h1 class="header-title">Zorvyn - Your Financial Companion</h1>
            </div>

            <!-- RIGHT: All header elements -->
            <div class="header-actions">
              <!-- Currency switcher -->
              <div class="currency-switcher" 
                   (click)="toggleCurrencyMenu(); $event.stopPropagation()" 
                   [class.open]="currencyOpen()">
                <span class="curr-flag" [style]="currencyService.current.shadow ? 'filter: ' + currencyService.current.shadow : ''">{{ currencyService.current.flag }}</span>
                <span class="curr-code">{{ currencyService.current.code }}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>

                <!-- Dropdown -->
                <div class="currency-menu" *ngIf="currencyOpen()" (click)="$event.stopPropagation()">
                  <div *ngFor="let c of currencyService.currencies"
                       class="currency-option"
                       [class.active]="c.code === currencyService.current.code"
                       (click)="selectCurrency(c.code)">
                    <span class="opt-flag" [style]="c.shadow ? 'filter: ' + c.shadow : ''">{{ c.flag }}</span>
                    <div class="opt-info">
                      <span class="opt-code">{{ c.code }}</span>
                      <span class="opt-label">{{ c.label }}</span>
                    </div>
                    <span class="opt-symbol">{{ c.symbol }}</span>
                  </div>
                </div>
              </div>

              <!-- Theme toggle -->
              <button (click)="toggleTheme()" class="btn-glass theme-toggle">
                <svg *ngIf="!finance.isDark()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
                <svg *ngIf="finance.isDark()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </button>

              <!-- User avatar -->
              <div class="user-avatar">
                <div class="avatar-circle">
                  AP
                </div>
                <div class="status-dot"></div>
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <div class="page-content">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    /* Hide scrollbars globally */
    ::-webkit-scrollbar {
      width: 0px;
      height: 0px;
      display: none;
    }
    
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    
    ::-webkit-scrollbar-thumb {
      background: transparent;
    }
    
    ::-webkit-scrollbar-corner {
      background: transparent;
    }
    
    /* Firefox scrollbar hiding */
    * {
      scrollbar-width: none;
    }
    
    /* IE/Edge scrollbar hiding */
    * {
      -ms-overflow-style: none;
    }

    .app-layout {
      display: flex;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      background: var(--bg-app);
      position: relative;
    }

    /* Animated Background */
    .animated-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      pointer-events: none;
    }

    .particle-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    .floating-orb {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(124, 58, 237, 0.3));
      filter: blur(40px);
      animation: float 6s ease-in-out infinite;
    }
    
    .orb-1 {
      width: 300px;
      height: 300px;
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }
    
    .orb-2 {
      width: 200px;
      height: 200px;
      top: 60%;
      right: 10%;
      animation-delay: 2s;
    }
    
    .orb-3 {
      width: 250px;
      height: 250px;
      bottom: 10%;
      left: 30%;
      animation-delay: 4s;
    }
    
    .orb-4 {
      width: 150px;
      height: 150px;
      top: 30%;
      right: 30%;
      animation-delay: 1s;
    }
    
    .orb-5 {
      width: 180px;
      height: 180px;
      bottom: 20%;
      right: 20%;
      animation-delay: 3s;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }

    /* Sidebar */
    .sidebar {
      width: 280px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
      background: linear-gradient(135deg, rgba(13, 15, 19, 0.98), rgba(6, 182, 212, 0.05));
      border-right: 2px solid rgba(6, 182, 212, 0.2);
      backdrop-filter: blur(20px);
    }

    .sidebar-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 24px 20px;
      gap: 32px;
    }

    /* Logo Section */
    .logo-section {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .logo-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(124, 58, 237, 0.1));
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      backdrop-filter: blur(12px);
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #06b6d4, #7c3aed);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 18px;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
    }

    .logo-title {
      font-size: 18px;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.2;
    }

    .logo-subtitle {
      font-size: 12px;
      color: #94a3b8;
      font-weight: 500;
    }

    /* Navigation */
    .navigation-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .nav-title {
      font-size: 11px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }

    .nav-items {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 12px;
      color: #94a3b8;
      text-decoration: none;
      transition: all 0.3s ease;
      font-weight: 500;
      font-size: 14px;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #ffffff;
      transform: translateX(4px);
    }

    .nav-item.active {
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(124, 58, 237, 0.2));
      color: #ffffff;
      border: 1px solid rgba(6, 182, 212, 0.3);
    }

    .nav-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .nav-label {
      font-weight: 500;
    }

    .datetime-section {
      padding: 0;
    }

    .datetime-card {
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(124, 58, 237, 0.1));
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 20px;
      text-align: center;
      backdrop-filter: blur(12px);
    }

    .time-display {
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
      font-family: 'Courier New', monospace;
      margin-bottom: 8px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .date-display {
      font-size: 12px;
      color: #94a3b8;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* User Profile */
    .user-profile-section {
      margin-top: auto;
    }

    .user-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(124, 58, 237, 0.1));
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      backdrop-filter: blur(12px);
    }

    .user-avatar {
      position: relative;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #06b6d4, #7c3aed);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
    }

    .avatar-text {
      position: relative;
      z-index: 2;
    }

    .status-indicator {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 12px;
      height: 12px;
      background: #10b981;
      border: 2px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(16, 185, 129, 0.4);
    }

    .user-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 4px;
    }

    .user-role {
      font-size: 12px;
      color: #94a3b8;
      font-weight: 500;
    }

    .sign-out-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 8px;
      color: #94a3b8;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sign-out-btn:hover {
      background: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.3);
      color: #ffffff;
    }

    .user-section {
      padding: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      margin-top: auto;
    }

    .sidebar-user-panel {
      position: relative;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 12px;
      padding: 20px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(12px);
      transition: all 0.3s ease;
    }

    .sidebar-user-panel.enhanced {
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(124, 58, 237, 0.1));
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 8px 32px rgba(6, 182, 212, 0.2);
    }

    .company-info {
      text-align: center;
      margin-bottom: 16px;
    }

    .company-name {
      font-size: 16px;
      font-weight: 700;
      color: #ffffff !important;
      margin-bottom: 4px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .company-tagline {
      font-size: 11px;
      color: #94a3b8 !important;
      font-style: italic;
      opacity: 0.8;
    }

    .panel-inner {
      position: relative;
      z-index: 2;
    }

    .panel-identity {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .panel-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #06b6d4, #7c3aed);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      color: #ffffff;
      position: relative;
    }

    .avatar-text {
      position: relative;
      z-index: 2;
    }

    .role-indicator {
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 16px;
      height: 16px;
      background: linear-gradient(135deg, #06b6d4, #7c3aed);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      box-shadow: 0 2px 8px rgba(6, 182, 212, 0.4);
    }

    .panel-name-block {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .panel-name {
      display: block;
      font-weight: 600;
      font-size: 14px;
      color: #ffffff !important;
      margin-bottom: 4px;
    }

    .creative-role {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .role-text {
      font-size: 11px;
      color: #94a3b8 !important;
      font-weight: 400;
    }

    .role-highlight {
      font-size: 11px;
      color: #06b6d4 !important;
      font-weight: 600;
      background: rgba(6, 182, 212, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid rgba(6, 182, 212, 0.3);
    }

    .panel-role {
      display: block;
      font-size: 11px;
      color: #94a3b8 !important;
      font-weight: 400;
    }

    .panel-divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
      margin: 16px 0;
    }

    .panel-logout {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #ffffff !important;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .panel-logout:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(6, 182, 212, 0.3);
    }

    .panel-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 12px;
      z-index: 1;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
      overflow: hidden;
      z-index: 5;
      position: relative;
    }

    .header {
      width: 100%;
      background: rgba(13, 15, 19, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 2px solid rgba(139, 92, 246, 0.5);
      z-index: 20;
      position: sticky;
      top: 0;
    }

    .accent-line {
      height: 3px;
      width: 100%;
      background: linear-gradient(90deg, #06b6d4, #7c3aed, #ec4899);
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      height: 80px;
    }

    .header-title-section {
      flex-shrink: 0;
    }

    .header-title {
      font-size: 2.5rem;
      font-weight: 900;
      color: #ffffff !important;
      margin: 0 0 8px 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header-subtitle {
      font-size: 1.25rem;
      color: #94a3b8 !important;
      margin: 0;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-glass {
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #ffffff !important;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .btn-glass:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(6, 182, 212, 0.3);
    }

    .btn-glass.btn-success {
      background: rgba(16, 185, 129, 0.1);
      border-color: rgba(16, 185, 129, 0.3);
    }

    .btn-glass.btn-success:hover {
      background: rgba(16, 185, 129, 0.2);
      border-color: rgba(16, 185, 129, 0.5);
    }

    .theme-toggle {
      width: 44px;
      height: 44px;
      padding: 0;
      border-radius: 50%;
      background: rgba(139, 92, 246, 0.3);
      border: 2px solid rgba(139, 92, 246, 0.6);
      color: #1a1a1a !important;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      animation: themePulse 3s ease-in-out infinite;
    }

    @keyframes themePulse {
      0%, 100% {
        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      }
      50% {
        box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
      }
    }

    .theme-toggle::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent);
      transform: translate(-50%, -50%);
      transition: all 0.6s ease;
    }

    .theme-toggle:hover {
      transform: translateY(-2px) scale(1.05);
      border-color: rgba(139, 92, 246, 0.8);
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.1));
      box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    .theme-toggle:hover::before {
      width: 100%;
      height: 100%;
    }

    .theme-toggle:active {
      transform: translateY(0) scale(0.98);
      transition: all 0.1s ease;
    }

    .theme-toggle svg {
      width: 20px !important;
      height: 20px !important;
      transition: all 0.4s ease;
      position: relative;
      z-index: 2;
    }

    .theme-toggle:hover svg {
      transform: rotate(180deg) scale(1.1);
    }

    /* Light mode styles for theme toggle */
    :host-context(html.light) .theme-toggle {
      background: rgba(139, 92, 246, 0.2) !important;
      border-color: rgba(139, 92, 246, 0.5) !important;
      color: #000000 !important;
      box-shadow: 0 4px 15px rgba(139, 92, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5);
    }

    :host-context(html.light) .theme-toggle:hover {
      border-color: rgba(139, 92, 246, 0.6) !important;
      background: rgba(139, 92, 246, 0.25) !important;
      box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.7);
    }

    .user-avatar {
      position: relative;
    }

    .avatar-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #06b6d4, #7c3aed);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 12px;
      font-weight: bold;
      border: 2px solid rgba(139, 92, 246, 0.5);
    }

    .status-dot {
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #10b981;
      border: 2px solid #ffffff;
    }

    /* Currency Switcher - Complete Rework */
    .currency-switcher {
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: rgba(139, 92, 246, 0.15);
      border: 2px solid rgba(139, 92, 246, 0.4);
      border-radius: 12px;
      color: #ffffff !important;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(16px);
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
    }

    .currency-switcher:hover {
      background: rgba(139, 92, 246, 0.25);
      border-color: rgba(139, 92, 246, 0.6);
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(139, 92, 246, 0.3);
    }

    .currency-switcher .curr-flag,
    .currency-switcher .curr-code {
      color: inherit !important;
      font-weight: inherit;
    }

    /* Currency Menu - Enhanced */
    .currency-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: rgba(15, 15, 35, 0.95);
      border: 2px solid rgba(139, 92, 246, 0.3);
      border-radius: 16px;
      backdrop-filter: blur(20px);
      overflow: hidden;
      min-width: 300px;
      z-index: 1000;
      animation: dropdownSlide 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }

    @keyframes dropdownSlide {
      from {
        opacity: 0;
        transform: translateY(-8px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* Currency Options - New Logic */
    .currency-option {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      border-bottom: 1px solid rgba(139, 92, 246, 0.1);
      position: relative;
      background: transparent;
    }

    .currency-option:last-child {
      border-bottom: none;
    }

    .currency-option:hover {
      background: rgba(139, 92, 246, 0.08);
      transform: translateX(2px);
    }

    .currency-option.active {
      background: rgba(139, 92, 246, 0.12);
      border-left: 3px solid rgba(139, 92, 246, 0.8);
    }

    .currency-option.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: linear-gradient(135deg, #8b5cf6, #6366f1);
    }

    /* Currency Flag */
    .opt-flag {
      font-size: 22px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(139, 92, 246, 0.15);
      border-radius: 50%;
      flex-shrink: 0;
      border: 1px solid rgba(139, 92, 246, 0.3);
      transition: all 0.2s ease;
    }

    .currency-option:hover .opt-flag {
      background: rgba(139, 92, 246, 0.25);
      transform: scale(1.05);
    }

    .currency-option.active .opt-flag {
      background: rgba(139, 92, 246, 0.3);
      border-color: rgba(139, 92, 246, 0.5);
      box-shadow: 0 0 12px rgba(139, 92, 246, 0.4);
    }

    /* Currency Info */
    .opt-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .opt-code {
      font-size: 15px;
      font-weight: 700;
      color: #ffffff !important;
      letter-spacing: 0.5px;
      transition: all 0.2s ease;
    }

    .opt-label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6) !important;
      font-weight: 500;
      letter-spacing: 0.3px;
      transition: all 0.2s ease;
    }

    .currency-option:hover .opt-code {
      color: #ffffff !important;
    }

    .currency-option:hover .opt-label {
      color: rgba(255, 255, 255, 0.8) !important;
    }

    .currency-option.active .opt-code {
      color: #ffffff !important;
      text-shadow: 0 0 8px rgba(139, 92, 246, 0.5);
    }

    .currency-option.active .opt-label {
      color: rgba(255, 255, 255, 0.7) !important;
    }

    /* Currency Symbol */
    .opt-symbol {
      font-size: 14px;
      font-weight: 700;
      color: #ffffff !important;
      background: rgba(139, 92, 246, 0.2);
      padding: 6px 10px;
      border-radius: 8px;
      border: 1px solid rgba(139, 92, 246, 0.3);
      transition: all 0.2s ease;
      min-width: 40px;
      text-align: center;
    }

    .currency-option:hover .opt-symbol {
      background: rgba(139, 92, 246, 0.3);
      transform: scale(1.05);
    }

    .currency-option.active .opt-symbol {
      background: rgba(139, 92, 246, 0.4);
      border-color: rgba(139, 92, 246, 0.6);
      box-shadow: 0 0 8px rgba(139, 92, 246, 0.3);
    }

    .page-content {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 24px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }

    /* Light Mode */
    :host-context(html.light) .sidebar {
      background: rgba(255, 255, 255, 0.95) !important;
      border-right: 2px solid #d1d5db !important;
    }

    :host-context(html.light) .logo-title,
    :host-context(html.light) .logo-subtitle,
    :host-context(html.light) .filter-pill,
    :host-context(html.light) .panel-name,
    :host-context(html.light) .panel-logout {
      color: #000000 !important;
    }

    :host-context(html.light) .logo-subtitle,
    /* Light Mode Currency Styles - Complete Rework */
    :host-context(html.light) .currency-switcher {
      background: rgba(139, 92, 246, 0.08) !important;
      border: 2px solid rgba(139, 92, 246, 0.3) !important;
      color: #000000 !important;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.1) !important;
    }

    :host-context(html.light) .currency-switcher:hover {
      background: rgba(139, 92, 246, 0.15) !important;
      border-color: rgba(139, 92, 246, 0.5) !important;
      box-shadow: 0 6px 20px rgba(139, 92, 246, 0.2) !important;
    }

    :host-context(html.light) .currency-menu {
      background: rgba(255, 255, 255, 0.95) !important;
      border: 2px solid rgba(139, 92, 246, 0.2) !important;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
    }

    :host-context(html.light) .currency-option {
      border-bottom-color: rgba(139, 92, 246, 0.08) !important;
    }

    :host-context(html.light) .currency-option:hover {
      background: rgba(139, 92, 246, 0.05) !important;
    }

    :host-context(html.light) .currency-option.active {
      background: rgba(139, 92, 246, 0.08) !important;
    }

    :host-context(html.light) .currency-option.active::before {
      background: linear-gradient(135deg, #8b5cf6, #6366f1) !important;
    }

    :host-context(html.light) .opt-flag {
      background: rgba(139, 92, 246, 0.08) !important;
      border-color: rgba(139, 92, 246, 0.2) !important;
    }

    :host-context(html.light) .currency-option:hover .opt-flag {
      background: rgba(139, 92, 246, 0.12) !important;
    }

    :host-context(html.light) .currency-option.active .opt-flag {
      background: rgba(139, 92, 246, 0.15) !important;
      border-color: rgba(139, 92, 246, 0.3) !important;
      box-shadow: 0 0 12px rgba(139, 92, 246, 0.2) !important;
    }

    :host-context(html.light) .opt-code {
      color: #000000 !important;
    }

    :host-context(html.light) .opt-label {
      color: #374151 !important;
    }

    :host-context(html.light) .currency-option:hover .opt-code {
      color: #000000 !important;
    }

    :host-context(html.light) .currency-option:hover .opt-label {
      color: #4b5563 !important;
    }

    :host-context(html.light) .currency-option.active .opt-code {
      color: #000000 !important;
      text-shadow: 0 0 8px rgba(139, 92, 246, 0.3) !important;
    }

    :host-context(html.light) .currency-option.active .opt-label {
      color: #374151 !important;
    }

    :host-context(html.light) .opt-symbol {
      color: #000000 !important;
      background: rgba(139, 92, 246, 0.08) !important;
      border-color: rgba(139, 92, 246, 0.2) !important;
    }

    :host-context(html.light) .currency-option:hover .opt-symbol {
      background: rgba(139, 92, 246, 0.12) !important;
    }

    :host-context(html.light) .currency-option.active .opt-symbol {
      background: rgba(139, 92, 246, 0.15) !important;
      border-color: rgba(139, 92, 246, 0.3) !important;
      box-shadow: 0 0 8px rgba(139, 92, 246, 0.2) !important;
    }

    :host-context(html.light) .btn-glass:hover,
    :host-context(html.light) .currency-switcher:hover {
      background: rgba(0, 0, 0, 0.1) !important;
      border-color: #06b6d4 !important;
    }

    /* Light Mode Header Styles - Missing! */
    :host-context(html.light) .header {
      background: rgba(255, 255, 255, 0.95) !important;
      border-bottom: 2px solid rgba(139, 92, 246, 0.3) !important;
    }

    :host-context(html.light) .header-title {
      color: #000000 !important;
      text-shadow: none !important;
    }

    :host-context(html.light) .header-subtitle {
      color: #374151 !important;
    }

    :host-context(html.light) .accent-line {
      background: linear-gradient(90deg, #06b6d4, #7c3aed, #ec4899) !important;
    }

    :host-context(html.light) .sidebar-user-panel {
      background: rgba(0, 0, 0, 0.05) !important;
      border: 1px solid #d1d5db !important;
    }

    :host-context(html.light) .panel-logout {
      background: rgba(0, 0, 0, 0.05) !important;
      border: 1px solid #d1d5db !important;
      color: #000000 !important;
    }

    :host-context(html.light) .panel-logout:hover {
      background: rgba(0, 0, 0, 0.1) !important;
      border-color: #06b6d4 !important;
    }

    :host-context(html.light) .filter-pill {
      background: rgba(255, 255, 255, 0.9) !important;
      border: 1px solid #d1d5db !important;
      color: #000000 !important;
    }

    :host-context(html.light) .filter-pill:hover {
      border-color: #06b6d4 !important;
      background: rgba(6, 182, 212, 0.1) !important;
    }

    :host-context(html.light) .filter-pill.active {
      background: #06b6d4 !important;
      border-color: #0891b2 !important;
      color: #ffffff !important;
    }

    :host-context(html.light) .currency-menu {
      background: rgba(255, 255, 255, 0.95) !important;
      border: 1px solid #d1d5db !important;
    }

    :host-context(html.light) .currency-option {
      color: #000000 !important;
    }

    /* Light mode currency dropdown text */
    :host-context(html.light) .opt-code {
      color: #000000 !important;
    }

    :host-context(html.light) .opt-label {
      color: #374151 !important;
    }

    :host-context(html.light) .opt-symbol {
      color: #000000 !important;
      background: rgba(139, 92, 246, 0.1) !important;
    }

    :host-context(html.light) .currency-switcher {
      color: #000000 !important;
    }

    :host-context(html.light) .currency-option:hover {
      background: rgba(0, 0, 0, 0.05) !important;
    }

    :host-context(html.light) .currency-option.active {
      background: rgba(6, 182, 212, 0.1) !important;
      border: 1px solid #06b6d4 !important;
    }

    /* Light mode date/time */
    :host-context(html.light) .datetime-card {
      background: rgba(255, 255, 255, 0.9) !important;
      border: 1px solid #d1d5db !important;
    }

    :host-context(html.light) .date-text {
      color: #374151 !important;
    }

    :host-context(html.light) .time-text {
      color: #000000 !important;
    }

    /* Light mode enhanced user card */
    :host-context(html.light) .sidebar-user-panel.enhanced {
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.05), rgba(124, 58, 237, 0.05)) !important;
      border: 1px solid #d1d5db !important;
      box-shadow: 0 8px 32px rgba(6, 182, 212, 0.1) !important;
    }

    :host-context(html.light) .company-name {
      color: #000000 !important;
      text-shadow: none;
    }

    :host-context(html.light) .company-tagline,
    :host-context(html.light) .panel-role {
      color: #374151 !important;
    }

    :host-context(html.light) .panel-name {
      color: #000000 !important;
    }

    :host-context(html.light) .role-text {
      color: #374151 !important;
    }

    :host-context(html.light) .role-highlight {
      color: #06b6d4 !important;
      background: rgba(6, 182, 212, 0.05) !important;
      border: 1px solid rgba(6, 182, 212, 0.2) !important;
    }
  `]
})
export class LayoutComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  public currencyService = inject(CurrencyService);
  public finance = inject(FinanceStateService);
  
  isLandingPage = toSignal(
    this.router.events.pipe(
      map(() => {
        const url = this.router.url;
        return url === '/' || url === '/landing' || url === '/login';
      })
    ),
    { initialValue: false }
  );

  currencyOpen = signal(false);
  currentTime = signal('');
  currentDate = signal('');
  private timeSubscription: Subscription | null = null;

  ngOnInit() {
    this.updateDateTime();
    this.timeSubscription = interval(1000).subscribe(() => {
      this.updateDateTime();
    });
    
    // Initialize particle effects
    setTimeout(() => {
      this.initParticles();
    }, 100);
    
    // Add global click listener to close currency menu
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.currency-switcher')) {
        this.currencyOpen.set(false);
      }
    });
  }

  ngOnDestroy() {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }

  updateDateTime() {
    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    };
    const dateOptions: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    
    this.currentTime.set(now.toLocaleTimeString('en-US', timeOptions));
    this.currentDate.set(now.toLocaleDateString('en-US', dateOptions));
  }

  initParticles() {
    const canvas = document.getElementById('particleCanvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles: any[] = [];
    const particleCount = 100;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${particle.opacity})`;
        ctx.fill();
      });
      
      // Draw connections
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.2 * (1 - distance / 100)})`;
            ctx.stroke();
          }
        });
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
  }

  toggleCurrencyMenu() {
    this.currencyOpen.set(!this.currencyOpen());
  }

  selectCurrency(code: string) {
    this.currencyService.setCurrency(code);
    this.currencyOpen.set(false);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    
    // Store theme preference
    localStorage.setItem('theme', newTheme);
  }

  logout() {
    // Clear authentication state
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    
    // Clear user state in data service
    const dataService = this.finance as any;
    if (dataService.clearCurrentUser) {
      dataService.clearCurrentUser();
    }
    
    // Navigate to login page
    this.router.navigate(['/login']);
  }
}
