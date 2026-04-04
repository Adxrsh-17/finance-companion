import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService, UserRole } from './services/data.service';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <!-- Background Elements -->
      <div class="animated-bg">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
      </div>
      
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>

      <!-- Main Auth Card -->
      <div class="auth-card">
        <div class="glass-bg"></div>
        <div class="auth-content">
          <!-- Logo Section -->
          <div class="logo-section">
            <div class="logo-container">
              <div class="logo-ring"></div>
              <div class="logo-core">
                <span class="logo-text">Z</span>
              </div>
              <div class="logo-glow"></div>
            </div>
            <h1 class="brand-title">Zorvyn Finance</h1>
            <p class="brand-subtitle">Your intelligent financial companion</p>
          </div>

          <!-- Tab Navigation -->
          <div class="tab-nav">
            <button 
              class="tab-btn" 
              [class.active]="activeTab === 'signin'"
              (click)="switchTab('signin')"
            >
              Sign In
            </button>
            <button 
              class="tab-btn" 
              [class.active]="activeTab === 'register'"
              (click)="switchTab('register')"
            >
              Register
            </button>
          </div>

          <!-- Tab Content -->
          <div class="tab-content">
            <!-- Sign In Form -->
            <div class="tab-pane" [class.active]="activeTab === 'signin'">
              <div class="welcome-section">
                <h2 class="welcome-title">Welcome back</h2>
                <p class="welcome-subtitle">Enter your credentials to access your account</p>
              </div>

              <form class="auth-form" (ngSubmit)="onSignInSubmit($event)">
                <div class="input-group">
                  <div class="input-container">
                    <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <input 
                      type="email" 
                      class="form-input"
                      placeholder="Email address"
                      required
                      [(ngModel)]="signInForm.email"
                      name="email"
                    />
                    <div class="input-border"></div>
                  </div>
                </div>

                <div class="input-group">
                  <div class="input-container">
                    <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                    <input 
                      type="password" 
                      class="form-input"
                      placeholder="Password"
                      required
                      [(ngModel)]="signInForm.password"
                      name="password"
                    />
                    <div class="input-border"></div>
                  </div>
                  <div class="forgot-password">
                    <a href="#" class="forgot-link" (click)="handleForgotPassword($event)">Forgot password?</a>
                  </div>
                </div>

                <button type="submit" class="login-btn" [disabled]="isLoading">
                  <div class="btn-bg-effect"></div>
                  <div class="btn-content">
                    <span class="btn-text" *ngIf="!isLoading">Sign In</span>
                    <span class="btn-text" *ngIf="isLoading">Signing in...</span>
                    <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" *ngIf="!isLoading">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                    <svg class="btn-icon loading" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" *ngIf="isLoading">
                      <path d="M21 12a9 9 0 11-6.219-8.56"/>
                    </svg>
                  </div>
                </button>
              </form>
            </div>

            <!-- Register Form -->
            <div class="tab-pane" [class.active]="activeTab === 'register'">
              <div class="welcome-section">
                <h2 class="welcome-title">Create account</h2>
                <p class="welcome-subtitle">Join thousands managing their finances smarter</p>
              </div>

              <form class="auth-form" (ngSubmit)="onRegisterSubmit($event)">
                <div class="input-group">
                  <div class="input-container">
                    <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <input 
                      type="text" 
                      class="form-input"
                      placeholder="Full name"
                      required
                      [(ngModel)]="registerForm.name"
                      name="name"
                    />
                    <div class="input-border"></div>
                  </div>
                </div>

                <div class="input-group">
                  <div class="input-container">
                    <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <input 
                      type="email" 
                      class="form-input"
                      placeholder="Email address"
                      required
                      [(ngModel)]="registerForm.email"
                      name="email"
                    />
                    <div class="input-border"></div>
                  </div>
                </div>

                <div class="input-group">
                  <div class="input-container">
                    <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                    <input 
                      type="password" 
                      class="form-input"
                      placeholder="Password"
                      required
                      [(ngModel)]="registerForm.password"
                      name="password"
                    />
                    <div class="input-border"></div>
                  </div>
                </div>

                <div class="input-group">
                  <div class="input-container">
                    <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                    <input 
                      type="password" 
                      class="form-input"
                      placeholder="Confirm password"
                      required
                      [(ngModel)]="registerForm.confirmPassword"
                      name="confirmPassword"
                    />
                    <div class="input-border"></div>
                  </div>
                </div>

                <div class="terms-checkbox">
                  <label class="checkbox-label">
                    <input type="checkbox" [(ngModel)]="agreeToTerms" name="terms" required>
                    <span class="checkmark"></span>
                    <span class="checkbox-text">I agree to the <a href="#" class="terms-link">Terms of Service</a> and <a href="#" class="terms-link">Privacy Policy</a></span>
                  </label>
                </div>

                <button type="submit" class="login-btn" [disabled]="isLoading || !agreeToTerms">
                  <div class="btn-bg-effect"></div>
                  <div class="btn-content">
                    <span class="btn-text" *ngIf="!isLoading">Create Account</span>
                    <span class="btn-text" *ngIf="isLoading">Creating account...</span>
                    <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" *ngIf="!isLoading">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                    <svg class="btn-icon loading" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" *ngIf="isLoading">
                      <path d="M21 12a9 9 0 11-6.219-8.56"/>
                    </svg>
                  </div>
                </button>
              </form>
            </div>
          </div>

          <!-- Social Login Divider -->
          <div class="divider">
            <span class="divider-text">Or continue with</span>
          </div>

          <!-- Social Login Buttons -->
          <div class="social-login">
            <button class="social-btn google-btn" (click)="socialLogin('google')">
              <svg class="social-icon" width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            
            <button class="social-btn apple-btn" (click)="socialLogin('apple')">
              <svg class="social-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.42-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.42C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Apple
            </button>
            
            <button class="social-btn microsoft-btn" (click)="socialLogin('microsoft')">
              <svg class="social-icon" width="20" height="20" viewBox="0 0 24 24">
                <rect x="2" y="2" width="9" height="9" fill="#f25022"/>
                <rect x="13" y="2" width="9" height="9" fill="#7fba00"/>
                <rect x="2" y="13" width="9" height="9" fill="#00a4ef"/>
                <rect x="13" y="13" width="9" height="9" fill="#ffb900"/>
              </svg>
              Microsoft
            </button>
          </div>

          <!-- Quick Access for Demo -->
          <div class="quick-access">
            <button class="quick-btn" (click)="quickLogin('administrator')">
              <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Demo Admin
            </button>
            <button class="quick-btn" (click)="quickLogin('user')">
              <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Demo User
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Global reset and violet background */
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(135deg, #2a0f4a 0%, #4a148c 50%, #3a0f6a 100%) !important;
      overflow: hidden !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    /* Hide all scrollbars */
    ::-webkit-scrollbar {
      width: 0px !important;
      height: 0px !important;
      display: none !important;
    }

    * {
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
    }

    /* Force body and html */
    ::ng-deep html, ::ng-deep body {
      margin: 0 !important;
      padding: 0 !important;
      height: 100vh !important;
      overflow: hidden !important;
      background: linear-gradient(135deg, #2a0f4a 0%, #4a148c 50%, #3a0f6a 100%) !important;
    }

    /* Auth Container */
    .auth-container {
      position: relative;
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    /* Animated Background */
    .animated-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }

    .gradient-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.6;
      animation: float 20s ease-in-out infinite;
    }

    .orb-1 {
      width: 400px;
      height: 400px;
      background: linear-gradient(135deg, #8b5cf6, #6366f1);
      top: -10%;
      left: -10%;
      animation-delay: 0s;
    }

    .orb-2 {
      width: 300px;
      height: 300px;
      background: linear-gradient(135deg, #06b6d4, #3b82f6);
      bottom: -10%;
      right: -10%;
      animation-delay: 7s;
    }

    .orb-3 {
      width: 250px;
      height: 250px;
      background: linear-gradient(135deg, #a855f7, #8b5cf6);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation-delay: 14s;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(30px, -30px) rotate(90deg); }
      50% { transform: translate(-20px, 20px) rotate(180deg); }
      75% { transform: translate(-30px, -20px) rotate(270deg); }
    }

    .floating-shapes {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .shape {
      position: absolute;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      animation: rotate 30s linear infinite;
    }

    .shape-1 {
      width: 100px;
      height: 100px;
      top: 20%;
      left: 10%;
      border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 150px;
      height: 150px;
      top: 60%;
      right: 10%;
      border-radius: 63% 37% 54% 46% / 55% 48% 52% 45%;
      animation-delay: 10s;
    }

    .shape-3 {
      width: 80px;
      height: 80px;
      bottom: 20%;
      left: 30%;
      border-radius: 40% 60% 60% 40% / 60% 30% 70% 40%;
      animation-delay: 20s;
    }

    .shape-4 {
      width: 120px;
      height: 120px;
      top: 30%;
      right: 30%;
      border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
      animation-delay: 5s;
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Auth Card */
    .auth-card {
      position: relative;
      width: 100%;
      max-width: 480px;
      z-index: 10;
    }

    .glass-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

    .auth-content {
      position: relative;
      padding: 48px 40px;
      z-index: 2;
    }

    /* Logo Section */
    .logo-section {
      text-align: center;
      margin-bottom: 40px;
    }

    .logo-container {
      position: relative;
      display: inline-block;
      margin-bottom: 24px;
    }

    .logo-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80px;
      height: 80px;
      border: 3px solid rgba(139, 92, 246, 0.3);
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    }

    .logo-core {
      position: relative;
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #8b5cf6, #6366f1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      box-shadow: 0 10px 25px rgba(139, 92, 246, 0.4);
      z-index: 2;
    }

    .logo-text {
      font-size: 28px;
      font-weight: 800;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .logo-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100px;
      height: 100px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent);
      border-radius: 50%;
      animation: glow 3s ease-in-out infinite;
      z-index: 1;
    }

    @keyframes pulse {
      0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
      50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.6; }
    }

    @keyframes glow {
      0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
      50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.2); }
    }

    .brand-title {
      font-size: 32px;
      font-weight: 900;
      color: white;
      margin: 0 0 8px 0;
      background: linear-gradient(135deg, #ffffff, #e2e8f0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .brand-subtitle {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
      font-weight: 500;
    }

    /* Tab Navigation */
    .tab-nav {
      display: flex;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 4px;
      margin-bottom: 32px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .tab-btn {
      flex: 1;
      padding: 12px 20px;
      background: transparent;
      border: none;
      border-radius: 12px;
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .tab-btn.active {
      background: linear-gradient(135deg, #8b5cf6, #6366f1);
      color: white;
      box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
    }

    .tab-btn:hover:not(.active) {
      color: rgba(255, 255, 255, 0.8);
    }

    /* Tab Content */
    .tab-content {
      margin-bottom: 32px;
    }

    .tab-pane {
      display: none;
      animation: fadeIn 0.5s ease;
    }

    .tab-pane.active {
      display: block;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Welcome Section */
    .welcome-section {
      text-align: center;
      margin-bottom: 32px;
    }

    .welcome-title {
      font-size: 28px;
      font-weight: 700;
      color: white;
      margin: 0 0 12px 0;
    }

    .welcome-subtitle {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
      line-height: 1.5;
    }

    /* Form Styles */
    .auth-form {
      margin-bottom: 32px;
    }

    .input-group {
      margin-bottom: 24px;
    }

    .input-container {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255, 255, 255, 0.5);
      z-index: 2;
      transition: all 0.3s ease;
    }

    .form-input {
      width: 100%;
      padding: 18px 20px 18px 56px;
      background: rgba(255, 255, 255, 0.05);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      color: white;
      font-size: 16px;
      font-weight: 500;
      outline: none;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .form-input::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }

    .form-input:focus {
      border-color: rgba(139, 92, 246, 0.5);
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
    }

    .form-input:focus + .input-icon {
      color: rgba(139, 92, 246, 0.8);
    }

    .input-border {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #8b5cf6, #6366f1);
      transform: scaleX(0);
      transition: transform 0.3s ease;
      border-radius: 2px;
    }

    .form-input:focus ~ .input-border {
      transform: scaleX(1);
    }

    .forgot-password {
      text-align: right;
      margin-top: 12px;
    }

    .forgot-link {
      color: rgba(139, 92, 246, 0.8);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .forgot-link:hover {
      color: rgba(139, 92, 246, 1);
      text-decoration: underline;
    }

    /* Terms Checkbox */
    .terms-checkbox {
      margin-bottom: 24px;
    }

    .checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      cursor: pointer;
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      line-height: 1.5;
    }

    .checkbox-label input[type="checkbox"] {
      display: none;
    }

    .checkmark {
      position: relative;
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.05);
      transition: all 0.3s ease;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .checkbox-label input[type="checkbox"]:checked + .checkmark {
      background: linear-gradient(135deg, #8b5cf6, #6366f1);
      border-color: #8b5cf6;
    }

    .checkbox-label input[type="checkbox"]:checked + .checkmark::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 12px;
      font-weight: bold;
    }

    .terms-link {
      color: rgba(139, 92, 246, 0.8);
      text-decoration: none;
      font-weight: 500;
    }

    .terms-link:hover {
      color: rgba(139, 92, 246, 1);
      text-decoration: underline;
    }

    /* Login Button */
    .login-btn {
      width: 100%;
      padding: 18px 24px;
      background: linear-gradient(135deg, #8b5cf6, #6366f1);
      border: none;
      border-radius: 16px;
      color: white;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
      margin-top: 16px;
    }

    .btn-content {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-bg-effect {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #a855f7, #8b5cf6);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .login-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 20px 40px rgba(139, 92, 246, 0.3);
    }

    .login-btn:hover .btn-bg-effect {
      opacity: 1;
    }

    .login-btn:active {
      transform: translateY(0);
    }

    .login-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .btn-icon {
      transition: transform 0.3s ease;
    }

    .login-btn:hover .btn-icon {
      transform: translateX(4px);
    }

    .btn-icon.loading {
      animation: spin 1s linear infinite;
    }

    /* Divider */
    .divider {
      position: relative;
      text-align: center;
      margin: 32px 0 24px 0;
    }

    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
    }

    .divider-text {
      background: rgba(15, 15, 35, 0.8);
      padding: 0 16px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      position: relative;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* Social Login */
    .social-login {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
    }

    .social-btn {
      flex: 1;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: white;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      backdrop-filter: blur(10px);
    }

    .social-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }

    .social-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    /* Quick Access */
    .quick-access {
      display: flex;
      gap: 12px;
    }

    .quick-btn {
      flex: 1;
      padding: 14px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: white;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      backdrop-filter: blur(10px);
    }

    .quick-btn:hover {
      background: rgba(139, 92, 246, 0.2);
      border-color: rgba(139, 92, 246, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(139, 92, 246, 0.2);
    }

    .btn-icon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    /* Loading Animation */
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .auth-container {
        padding: 16px !important;
      }
      
      .auth-content {
        padding: 32px 24px;
      }
      
      .brand-title {
        font-size: 28px;
      }
      
      .welcome-title {
        font-size: 24px;
      }
      
      .social-login {
        flex-direction: column;
      }
      
      .quick-access {
        flex-direction: column;
      }
    }

    @media (max-width: 480px) {
      .auth-content {
        padding: 24px 20px;
      }
      
      .orb-1, .orb-2, .orb-3 {
        filter: blur(60px);
      }
      
      .orb-1 {
        width: 300px;
        height: 300px;
      }
      
      .orb-2 {
        width: 250px;
        height: 250px;
      }
      
      .orb-3 {
        width: 200px;
        height: 200px;
      }
    }
  `]
})
export class LoginComponent {
  activeTab: 'signin' | 'register' = 'signin';
  isLoading = false;
  agreeToTerms = false;
  
  signInForm: LoginCredentials = { email: '', password: '' };
  registerForm: RegisterCredentials = { 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  };
  
  constructor(private router: Router, private dataService: DataService) {}

  switchTab(tab: 'signin' | 'register') {
    this.activeTab = tab;
    // Reset forms when switching tabs
    if (tab === 'signin') {
      this.signInForm = { email: '', password: '' };
    } else {
      this.registerForm = { name: '', email: '', password: '', confirmPassword: '' };
      this.agreeToTerms = false;
    }
  }

  onSignInSubmit(event: Event) {
    event.preventDefault();
    this.isLoading = true;
    
    console.log('Sign in submitted', this.signInForm);
    
    // Simulate login validation
    setTimeout(() => {
      if (this.signInForm.email && this.signInForm.password) {
        // Set user in data service to satisfy auth guard
        this.dataService.setCurrentUser({
          id: '1',
          name: 'Adarsh Pradeep',
          email: this.signInForm.email,
          role: 'administrator' as UserRole,
          avatar: 'AP',
          department: 'IT',
          lastLogin: new Date()
        });
        
        // Store login state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', this.signInForm.email);
        
        console.log('Sign in successful, navigating to dashboard');
        this.router.navigate(['/dashboard']);
      } else {
        console.error('Invalid credentials');
        // Could show error message here
      }
      this.isLoading = false;
    }, 1000);
  }

  onRegisterSubmit(event: Event) {
    event.preventDefault();
    
    // Validate passwords match
    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      console.error('Passwords do not match');
      // Could show error message here
      return;
    }
    
    this.isLoading = true;
    
    console.log('Register submitted', this.registerForm);
    
    // Simulate registration
    setTimeout(() => {
      // Set user in data service
      this.dataService.setCurrentUser({
        id: '2',
        name: this.registerForm.name,
        email: this.registerForm.email,
        role: 'user' as UserRole,
        avatar: this.registerForm.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        department: 'Finance',
        lastLogin: new Date()
      });
      
      // Store login state
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', this.registerForm.email);
      
      console.log('Registration successful, navigating to dashboard');
      this.router.navigate(['/dashboard']);
      this.isLoading = false;
    }, 1500);
  }

  handleForgotPassword(event: Event) {
    event.preventDefault();
    console.log('Forgot password clicked');
    // Could implement password reset flow here
  }

  socialLogin(provider: 'google' | 'apple' | 'microsoft') {
    this.isLoading = true;
    
    console.log(`Social login with ${provider}`);
    
    // Simulate social login
    setTimeout(() => {
      const userData = {
        id: '3',
        name: provider === 'google' ? 'Google User' : provider === 'apple' ? 'Apple User' : 'Microsoft User',
        email: `user@${provider}.com`,
        role: 'user' as UserRole,
        avatar: provider.charAt(0).toUpperCase(),
        department: 'General',
        lastLogin: new Date()
      };
      
      this.dataService.setCurrentUser(userData);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', userData.email);
      
      console.log(`${provider} login successful, navigating to dashboard`);
      this.router.navigate(['/dashboard']);
      this.isLoading = false;
    }, 1000);
  }

  quickLogin(role: UserRole) {
    this.isLoading = true;
    
    // Set predefined credentials based on role
    const adminCredentials = { email: 'admin@zorvyn.com', password: 'admin123' };
    const userCredentials = { email: 'user@zorvyn.com', password: 'user123' };
    
    this.signInForm = role === 'administrator' ? adminCredentials : userCredentials;
    
    // Simulate login
    setTimeout(() => {
      this.dataService.setCurrentUser({
        id: role === 'administrator' ? '1' : '2',
        name: role === 'administrator' ? 'Adarsh Pradeep' : 'Sarah Johnson',
        email: this.signInForm.email,
        role: role,
        avatar: role === 'administrator' ? 'AP' : 'SJ',
        department: role === 'administrator' ? 'IT' : 'Finance',
        lastLogin: new Date()
      });
      
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', this.signInForm.email);
      
      console.log('Quick login successful as ' + role + ', navigating to dashboard');
      this.router.navigate(['/dashboard']);
      this.isLoading = false;
    }, 500);
  }
}
