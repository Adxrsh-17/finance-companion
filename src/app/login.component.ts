import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService, UserRole } from './services/data.service';

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
      <!-- LEFT COLUMN - Hero Panel -->
      <div class="hero-panel">
        <!-- Dot Grid Background -->
        <div class="dot-grid"></div>
        
        <!-- Content -->
        <div class="hero-content">
          <!-- Logo -->
          <div class="hero-logo">
            <div class="logo-mark">Z</div>
          </div>
          
          <!-- Headlines -->
          <h1 class="hero-title">Your Financial Companion</h1>
          <p class="hero-subtitle">Track expenses, monitor investments, and achieve your financial goals with intelligent insights.</p>
          
          <!-- Stats Pills -->
          <div class="stats-pills">
            <div class="pill">
              <div class="pill-number">10k+</div>
              <div class="pill-label">Users</div>
            </div>
            <div class="pill">
              <div class="pill-number">Bank-grade</div>
              <div class="pill-label">Security</div>
            </div>
            <div class="pill">
              <div class="pill-number">Real-time</div>
              <div class="pill-label">Sync</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- RIGHT COLUMN - Login Form Panel -->
      <div class="form-panel">
        <div class="form-container">
          <!-- Logo Icon -->
          <div class="form-logo">
            <div class="logo-icon">Z</div>
          </div>
          
          <!-- Brand Label -->
          <div class="brand-label">ZORVYN FINANCE</div>
          
          <!-- Welcome Heading -->
          <h2 class="form-title">Welcome back</h2>
          
          <!-- Login Form -->
          <form class="login-form" (ngSubmit)="onLoginSubmit($event)">
            <div class="form-group">
              <label for="email" class="form-label">Email Address</label>
              <div class="input-wrapper">
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  class="form-input"
                  placeholder="Enter your email address"
                  required
                  [(ngModel)]="credentials.email"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <div class="input-wrapper">
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  class="form-input"
                  placeholder="Enter your password"
                  required
                  [(ngModel)]="credentials.password"
                />
              </div>
              <div class="forgot-password">
                <a href="#" class="forgot-link">Forgot password?</a>
              </div>
            </div>
            
            <button type="submit" class="login-button" [disabled]="isLoading">
              <span class="button-text" *ngIf="!isLoading">Sign In</span>
              <span class="button-text" *ngIf="isLoading">Signing in...</span>
              <svg class="button-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" *ngIf="!isLoading">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
              <svg class="button-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" *ngIf="isLoading" style="animation: spin 1s linear infinite;">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
              </svg>
            </button>
          </form>
          
          <!-- Divider -->
          <div class="divider">
            <span class="divider-text">Or continue as</span>
          </div>
          
          <!-- Quick Access Buttons -->
          <div class="quick-access">
            <button class="quick-btn admin-btn" (click)="quickLogin('administrator')">
              <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Admin
            </button>
            <button class="quick-btn user-btn" (click)="quickLogin('user')">
              <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              User
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Main Container - Two Column Layout */
    .login-container {
      display: flex;
      min-height: 100vh;
      overflow: hidden;
      width: 100vw;
    }
    
    /* LEFT COLUMN - Hero Panel */
    .hero-panel {
      flex: 1.2;
      background: #0a0f1e;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 80px 60px;
      min-width: 600px;
    }
    
    /* Dot Grid Background */
    .dot-grid {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
      background-size: 30px 30px;
      opacity: 0.4;
    }
    
    /* Hero Content */
    .hero-content {
      position: relative;
      z-index: 1;
      text-align: center;
      color: white;
      max-width: 700px;
      width: 100%;
    }
    
    .hero-logo {
      margin-bottom: 50px;
    }
    
    .logo-mark {
      width: 100px;
      height: 100px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      font-size: 40px;
      font-weight: bold;
      box-shadow: 0 25px 50px rgba(99, 102, 241, 0.4);
    }
    
    .hero-title {
      font-size: 56px;
      font-weight: 700;
      margin-bottom: 24px;
      line-height: 1.1;
      background: linear-gradient(135deg, #ffffff, #e2e8f0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .hero-subtitle {
      font-size: 20px;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 70px;
    }
    
    .stats-pills {
      display: flex;
      gap: 32px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .pill {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      padding: 20px 28px;
      text-align: center;
      backdrop-filter: blur(10px);
      min-width: 140px;
    }
    
    .pill-number {
      font-size: 20px;
      font-weight: 700;
      color: #6366f1;
      margin-bottom: 4px;
    }
    
    .pill-label {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    /* RIGHT COLUMN - Form Panel */
    .form-panel {
      flex: 0.8;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 80px 60px;
      overflow-y: auto;
      min-width: 500px;
    }
    
    .form-container {
      width: 100%;
      max-width: 520px;
    }
    
    .form-logo {
      text-align: center;
      margin-bottom: 16px;
    }
    
    .logo-icon {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      font-size: 20px;
      font-weight: bold;
      color: white;
    }
    
    .brand-label {
      text-align: center;
      font-size: 12px;
      font-weight: 600;
      color: #6366f1;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }
    
    .form-title {
      font-size: 28px;
      font-weight: 700;
      color: #1f2937;
      text-align: center;
      margin-bottom: 24px;
    }
    
    /* Form Styles */
    .login-form {
      margin-bottom: 24px;
    }
    
    .form-group {
      margin-bottom: 18px;
    }
    
    .form-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 6px;
    }
    
    .input-wrapper {
      position: relative;
    }
    
    .form-input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 15px;
      color: #1f2937;
      background: #ffffff;
      transition: all 0.2s ease;
      outline: none;
    }
    
    .form-input:focus {
      border-left: 3px solid #6366f1;
      border-color: #e5e7eb;
      box-shadow: 0 0 0 0 transparent;
    }
    
    .form-input::placeholder {
      color: #9ca3af;
    }
    
    .forgot-password {
      text-align: right;
      margin-top: 8px;
    }
    
    .forgot-link {
      font-size: 14px;
      color: #6366f1;
      text-decoration: none;
      font-weight: 500;
    }
    
    .forgot-link:hover {
      color: #4f46e5;
      text-decoration: underline;
    }
    
    .login-button {
      width: 100%;
      padding: 12px 20px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border: none;
      border-radius: 8px;
      color: white;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 6px;
    }
    
    .login-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
    }
    
    .login-button:active {
      transform: translateY(0);
    }
    
    .login-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    
    .button-text {
      font-size: 16px;
      font-weight: 600;
    }
    
    .button-arrow {
      transition: transform 0.2s ease;
    }
    
    .login-button:hover .button-arrow {
      transform: translateX(2px);
    }
    
    /* Divider */
    .divider {
      position: relative;
      text-align: center;
      margin: 20px 0;
    }
    
    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #e5e7eb;
    }
    
    .divider-text {
      background: #ffffff;
      padding: 0 16px;
      font-size: 14px;
      color: #6b7280;
      position: relative;
    }
    
    /* Quick Access Buttons */
    .quick-access {
      display: flex;
      gap: 12px;
    }
    
    .quick-btn {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
      color: #374151;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    
    .quick-btn:hover {
      background: #6366f1;
      color: white;
      border-color: #6366f1;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
    }
    
    .btn-icon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }
    
    /* Responsive Design */
    @media (max-width: 1200px) {
      .hero-panel {
        flex: 1;
        min-width: 500px;
        padding: 60px 40px;
      }
      
      .form-panel {
        flex: 1;
        min-width: 450px;
        padding: 60px 40px;
      }
      
      .hero-content {
        max-width: 600px;
      }
      
      .hero-title {
        font-size: 48px;
      }
    }
    
    @media (max-width: 768px) {
      .login-container {
        flex-direction: column;
      }
      
      .hero-panel {
        min-height: 40vh;
        padding: 40px 20px;
        min-width: auto;
      }
      
      .hero-title {
        font-size: 36px;
      }
      
      .hero-subtitle {
        font-size: 16px;
        margin-bottom: 40px;
      }
      
      .stats-pills {
        gap: 16px;
      }
      
      .pill {
        padding: 12px 16px;
      }
      
      .form-panel {
        min-height: 60vh;
        padding: 40px 20px;
        min-width: auto;
      }
      
      .form-title {
        font-size: 28px;
      }
    }
    
    @media (max-width: 480px) {
      .hero-panel,
      .form-panel {
        padding: 30px 16px;
      }
      
      .hero-title {
        font-size: 28px;
      }
      
      .stats-pills {
        flex-direction: column;
        align-items: center;
      }
      
      .pill {
        width: 100%;
        max-width: 200px;
      }
      
      .quick-access {
        flex-direction: column;
      }
    }
    
    /* Loading Animation */
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
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
