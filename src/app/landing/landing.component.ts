import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <!-- Animated Background Elements -->
      <div class="absolute inset-0">
        <!-- Floating Orbs -->
        <div class="floating-orb orb-1"></div>
        <div class="floating-orb orb-2"></div>
        <div class="floating-orb orb-3"></div>
        
        <!-- Animated Lines -->
        <div class="absolute inset-0">
          <div class="animated-line line-1"></div>
          <div class="animated-line line-2"></div>
          <div class="animated-line line-3"></div>
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div class="max-w-4xl w-full text-center">
          <!-- Logo and Title -->
          <div class="mb-12 animate-fade-in-down">
            <div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-3xl mb-6 shadow-2xl animate-pulse-slow">
              <span class="text-4xl font-bold text-white">WG</span>
            </div>
            <h1 class="text-6xl md:text-8xl font-bold text-white mb-4 animate-fade-in-up">
              Wealth Grid
            </h1>
            <p class="text-2xl md:text-3xl text-gray-300 mb-8 animate-fade-in-up animation-delay-200">
              Your wallet, powered by intelligence
            </p>
            <p class="text-xl text-gray-400 max-w-2xl mx-auto animate-fade-in-up animation-delay-300">
              Smart financial management for the modern world. Track expenses, manage budgets, and gain insights into your financial health.
            </p>
          </div>
          
          <!-- Feature Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 animate-fade-in-up animation-delay-400">
              <div class="text-4xl mb-4">�</div>
              <h3 class="text-xl font-bold text-white mb-2">Dashboard Analytics</h3>
              <p class="text-gray-300">Real-time insights and financial overview</p>
            </div>
            
            <div class="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 animate-fade-in-up animation-delay-500">
              <div class="text-4xl mb-4">💳</div>
              <h3 class="text-xl font-bold text-white mb-2">Transaction Management</h3>
              <p class="text-gray-300">Track and manage all your financial activities</p>
            </div>
            
            <div class="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 animate-fade-in-up animation-delay-600">
              <div class="text-4xl mb-4">�</div>
              <h3 class="text-xl font-bold text-white mb-2">Smart Insights</h3>
              <p class="text-gray-300">AI-powered recommendations and trends</p>
            </div>
          </div>
          
          <!-- CTA Section -->
          <div class="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up animation-delay-700">
            <button class="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-full hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl" 
                    (click)="navigateToDashboard()">
              Get Started
            </button>
            <button class="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
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
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }
    
    .animated-line {
      position: absolute;
      background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.5), transparent);
      height: 1px;
      animation: lineMove 8s linear infinite;
    }
    
    .line-1 {
      width: 100%;
      top: 20%;
      animation-delay: 0s;
    }
    
    .line-2 {
      width: 100%;
      top: 50%;
      animation-delay: 2s;
    }
    
    .line-3 {
      width: 100%;
      top: 80%;
      animation-delay: 4s;
    }
    
    @keyframes lineMove {
      0% { transform: translateX(-100%); opacity: 0; }
      50% { opacity: 1; }
      100% { transform: translateX(100%); opacity: 0; }
    }
    
    .animate-fade-in-down {
      animation: fadeInDown 0.8s ease-out;
    }
    
    .animate-fade-in-up {
      animation: fadeInUp 0.8s ease-out;
    }
    
    .animate-pulse-slow {
      animation: pulse 3s ease-in-out infinite;
    }
    
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.8; }
    }
    
    .animation-delay-200 { animation-delay: 0.2s; }
    .animation-delay-300 { animation-delay: 0.3s; }
    .animation-delay-400 { animation-delay: 0.4s; }
    .animation-delay-500 { animation-delay: 0.5s; }
    .animation-delay-600 { animation-delay: 0.6s; }
    .animation-delay-700 { animation-delay: 0.7s; }
    
    /* Light mode styles */
    :host-context(html.light) .min-h-screen {
      background: linear-gradient(135deg, #f8fafc, #e0e7ff, #f8fafc);
    }
    
    :host-context(html.light) .floating-orb {
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(124, 58, 237, 0.2));
    }
    
    :host-context(html.light) .text-white {
      color: #000000 !important;
    }
    
    :host-context(html.light) .text-gray-300 {
      color: #374151 !important;
    }
    
    :host-context(html.light) .text-gray-400 {
      color: #4b5563 !important;
    }
    
    :host-context(html.light) .bg-white\\/10 {
      background: rgba(255, 255, 255, 0.9) !important;
    }
    
    :host-context(html.light) .border-white\\/20 {
      border-color: #d1d5db !important;
    }
    
    :host-context(html.light) .border-white\\/30 {
      border-color: #d1d5db !important;
    }
    
    :host-context(html.light) .hover\\:bg-white\\/10:hover {
      background: rgba(0, 0, 0, 0.05) !important;
    }
  `]
})
export class LandingComponent {
  constructor(private router: Router) {}

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
