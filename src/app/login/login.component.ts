import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService, UserRole, User } from '../services/data.service';

interface LoginCredentials {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <!-- Animated Background -->
      <div class="animated-bg">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
          <div class="shape shape-4"></div>
        </div>
      </div>

      <!-- Main Login Card -->
      <div class="login-card">
        <!-- Glass Effect Background -->
        <div class="glass-bg"></div>
        
        <!-- Content -->
        <div class="login-content">
          <!-- Logo Section -->
          <div class="logo-section">
            <div class="logo-container">
              <div class="logo-ring"></div>
              <div class="logo-core">
                <span class="logo-text">Z</span>
              </div>
              <div class="logo-glow"></div>
            </div>
            <div class="brand-name">
              <h1 class="brand-title">ZORVYN</h1>
              <p class="brand-subtitle">Financial Intelligence Platform</p>
            </div>
          </div>

          <!-- Welcome Section -->
          <div class="welcome-section">
            <h2 class="welcome-title">Welcome Back</h2>
            <p class="welcome-subtitle">Enter your credentials to access your financial dashboard</p>
          </div>

          <!-- Login Form -->
          <form class="login-form" (ngSubmit)="onLoginSubmit($event)">
            <div class="input-group">
              <div class="input-container">
                <div class="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  class="form-input"
                  placeholder="Email address"
                  required
                  [(ngModel)]="credentials.email"
                />
                <div class="input-border"></div>
              </div>
            </div>

            <div class="input-group">
              <div class="input-container">
                <div class="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </div>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  class="form-input"
                  placeholder="Password"
                  required
                  [(ngModel)]="credentials.password"
                />
                <div class="input-border"></div>
              </div>
              <div class="forgot-password">
                <a href="#" class="forgot-link" (click)="handleForgotPassword($event)">Forgot password?</a>
              </div>
            </div>

            <button type="submit" class="login-btn" [disabled]="isLoading">
              <span class="btn-content">
                <span class="btn-text" *ngIf="!isLoading">Sign In</span>
                <span class="btn-text" *ngIf="isLoading">Authenticating...</span>
                <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" *ngIf="!isLoading">
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                </svg>
                <svg class="btn-icon loading" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" *ngIf="isLoading">
                  <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
              </span>
              <div class="btn-bg-effect"></div>
            </button>
          </form>

          <!-- Quick Access -->
          <div class="quick-access">
            <div class="divider">
              <span class="divider-text">Quick Access</span>
            </div>
            <div class="quick-buttons">
              <button class="quick-btn admin" (click)="quickLogin('administrator')">
                <div class="btn-icon-wrapper">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <span>Admin</span>
              </button>
              <button class="quick-btn user" (click)="quickLogin('user')">
                <div class="btn-icon-wrapper">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <span>User</span>
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div class="login-footer">
            <p class="footer-text">
              © 2024 Zorvyn Technologies. All rights reserved.
            </p>
            <div class="footer-links">
              <a href="#" class="footer-link">Privacy</a>
              <a href="#" class="footer-link">Terms</a>
              <a href="#" class="footer-link">Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Modern Landing Page - Complete Rework */
    :host {
      display: block;
      position: fixed;
      inset: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* Hide scrollbars globally */
    ::-webkit-scrollbar {
      display: none;
    }
    
    * {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    /* Login container */
    .login-container {
      position: fixed;
      inset: 0;
      display: grid;
      place-items: center;
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    /* Animated background elements */
    .animated-bg {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .bg-circle {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
      animation: float 20s ease-in-out infinite;
    }

    .bg-circle:nth-child(1) {
      width: 300px;
      height: 300px;
      top: -150px;
      left: -150px;
      animation-delay: 0s;
    }

    .bg-circle:nth-child(2) {
      width: 200px;
      height: 200px;
      bottom: -100px;
      right: -100px;
      animation-delay: 5s;
    }

    .bg-circle:nth-child(3) {
      width: 150px;
      height: 150px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation-delay: 10s;
    }

    @keyframes float {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      33% {
        transform: translate(30px, -30px) scale(1.1);
      }
      66% {
        transform: translate(-20px, 20px) scale(0.9);
      }
    }

    /* Login card */
    .login-card {
      position: relative;
      width: 100%;
      max-width: 420px;
      z-index: 10;
    }

    .card-inner {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 3rem;
      box-shadow: 
        0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 10px 10px -5px rgba(0, 0, 0, 0.04),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    /* Logo section */
    .logo-section {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .logo-container {
      position: relative;
      display: inline-block;
      margin-bottom: 1.5rem;
    }

    .logo-circle {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
      position: relative;
      overflow: hidden;
    }

    .logo-circle::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transform: translateX(-100%);
      animation: shimmer 3s infinite;
    }

    @keyframes shimmer {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .brand-title {
      font-size: 2rem;
      font-weight: 800;
      color: #1a202c;
      margin: 0 0 0.5rem 0;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .brand-subtitle {
      font-size: 0.875rem;
      color: #718096;
      margin: 0;
      font-weight: 500;
    }

    /* Welcome section */
    .welcome-section {
      text-align: center;
      margin-bottom: 2rem;
    }

    .welcome-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2d3748;
      margin: 0 0 0.75rem 0;
    }

    .welcome-subtitle {
      font-size: 0.9375rem;
      color: #718096;
      margin: 0;
      line-height: 1.6;
    }

    /* Form styles */
    .login-form {
      margin-bottom: 2rem;
    }

    .input-group {
      margin-bottom: 1.5rem;
    }

    .input-wrapper {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #a0aec0;
      transition: color 0.2s;
      z-index: 2;
    }

    .form-input {
      width: 100%;
      padding: 1rem 1rem 1rem 3rem;
      background: #f7fafc;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      color: #2d3748;
      font-size: 1rem;
      font-weight: 500;
      outline: none;
      transition: all 0.2s;
    }

    .form-input::placeholder {
      color: #a0aec0;
    }

    .form-input:focus {
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-input:focus + .input-icon {
      color: #667eea;
    }

    .forgot-password {
      text-align: right;
      margin-top: 0.75rem;
    }

    .forgot-link {
      color: #667eea;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: color 0.2s;
    }

    .forgot-link:hover {
      color: #5a67d8;
      text-decoration: underline;
    }

    /* Login button */
    .login-btn {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border: none;
      border-radius: 12px;
      color: white;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.3s;
      margin-top: 1rem;
    }

    .login-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
    }

    .login-btn:hover::before {
      left: 100%;
    }

    .login-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    .login-btn:active {
      transform: translateY(0);
    }

    .login-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    /* Quick access section */
    .quick-access {
      margin-bottom: 2rem;
    }

    .divider {
      position: relative;
      text-align: center;
      margin: 2rem 0 1.5rem 0;
    }

    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #e2e8f0;
    }

    .divider-text {
      background: white;
      padding: 0 1rem;
      font-size: 0.75rem;
      color: #a0aec0;
      position: relative;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .quick-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    .quick-btn {
      padding: 0.875rem;
      background: #f7fafc;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      color: #4a5568;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .quick-btn:hover {
      background: #edf2f7;
      border-color: #667eea;
      color: #667eea;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    }

    /* Footer */
    .login-footer {
      text-align: center;
      padding-top: 1.5rem;
      border-top: 1px solid #e2e8f0;
    }

    .footer-text {
      font-size: 0.75rem;
      color: #a0aec0;
      margin: 0 0 0.75rem 0;
    }

    .footer-links {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }

    .footer-link {
      font-size: 0.75rem;
      color: #a0aec0;
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer-link:hover {
      color: #667eea;
    }

    /* Loading animation */
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .btn-icon.loading {
      animation: spin 1s linear infinite;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .login-container {
        padding: 1rem;
      }
      
      .card-inner {
        padding: 2rem;
      }
      
      .brand-title {
        font-size: 1.75rem;
      }
      
      .welcome-title {
        font-size: 1.25rem;
      }
      
      .quick-buttons {
        grid-template-columns: 1fr;
      }
      
      .footer-links {
        flex-direction: column;
        gap: 0.5rem;
      }
    }

    @media (max-width: 480px) {
      .card-inner {
        padding: 1.5rem;
      }
      
      .brand-title {
        font-size: 1.5rem;
      }
      
      .bg-circle:nth-child(1) {
        width: 200px;
        height: 200px;
      }
      
      .bg-circle:nth-child(2) {
        width: 150px;
        height: 150px;
      }
      
      .bg-circle:nth-child(3) {
        width: 100px;
        height: 100px;
      }
    }
  `]
})
export class LoginComponent {
  credentials: LoginCredentials = { email: '', password: '' };
  isLoading = false;
  
  constructor(private router: Router, private dataService: DataService) {}

  onLoginSubmit(event: Event) {
    event.preventDefault();
    this.isLoading = true;
    
    console.log('Login submitted', this.credentials);
    
    // Simulate login validation - in real app, this would be an API call
    setTimeout(() => {
      // Simple validation for demo
      if (this.credentials.email && this.credentials.password) {
        // Set user in data service to satisfy auth guard
        this.dataService.setCurrentUser({
          id: '1',
          name: 'Adarsh Pradeep',
          email: this.credentials.email,
          role: 'administrator' as UserRole,
          avatar: 'AP',
          department: 'IT',
          lastLogin: new Date()
        });
        
        // Store login state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', this.credentials.email);
        
        console.log('Login successful, navigating to dashboard');
        this.router.navigate(['/dashboard']);
      } else {
        console.error('Invalid credentials');
        // Could show error message here
      }
      this.isLoading = false;
    }, 1000);
  }

  handleForgotPassword(event: Event) {
    event.preventDefault();
    console.log('Forgot password clicked');
    // Implement forgot password logic here
  }

  quickLogin(role: UserRole) {
    this.isLoading = true;
    
    // Set predefined credentials based on role
    const adminCredentials = { email: 'admin@zorvyn.com', password: 'admin123' };
    const userCredentials = { email: 'user@zorvyn.com', password: 'user123' };
    
    this.credentials = role === 'administrator' ? adminCredentials : userCredentials;
    
    // Simulate login
    setTimeout(() => {
      this.dataService.setCurrentUser({
        id: role === 'administrator' ? '1' : '2',
        name: role === 'administrator' ? 'Adarsh Pradeep' : 'Sarah Johnson',
        email: this.credentials.email,
        role: role,
        avatar: role === 'administrator' ? 'AP' : 'SJ',
        department: role === 'administrator' ? 'IT' : 'Finance',
        lastLogin: new Date()
      });
      
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', this.credentials.email);
      
      console.log('Quick login successful as ' + role + ', navigating to dashboard');
      this.router.navigate(['/dashboard']);
      this.isLoading = false;
    }, 500);
  }
}
