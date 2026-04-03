import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed, AfterViewInit, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FinanceStateService } from './services/finance-state.service';
import { DataService } from './services/data.service';
import { RoleService } from './services/role.service';
import { ToastService } from './services/toast.service';
import { ToastComponent } from './components/toast.component';
import { Observable, combineLatest } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyService } from './services/currency.service';
import { LayoutComponent } from './layout/layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    ToastComponent,
    LayoutComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'Zorvyn Finance';

  private dataService = inject(DataService);
  private roleService = inject(RoleService);
  private toastService = inject(ToastService);
  public finance = inject(FinanceStateService);
  private router = inject(Router);
  public currencyService = inject(CurrencyService);

  // Convert observables to signals for template access
  currentUser = toSignal(this.dataService.currentUser$, { initialValue: null });
  allUsers = toSignal(this.dataService.allUsers$, { initialValue: [] });

  // Role management - updated to use new RoleService
  role$ = this.roleService.role$;
  isAdmin$ = this.roleService.isAdmin$;
  isViewer$ = this.roleService.isViewer$;
  currentRole = toSignal(this.roleService.role$, { initialValue: 'viewer' });
  isAdmin = toSignal(this.roleService.isAdmin$, { initialValue: false });
  isViewer = toSignal(this.roleService.isViewer$, { initialValue: true });

  // Custom date range state
  showCustomDatePicker = signal(false);
  customStartDate = signal('');
  customEndDate = signal('');

  // Currency switcher state
  currencyOpen = signal(false);

  // Period data for command bar
  periods = [
    { label: 'Today', days: 1 },
    { label: '7 Days', days: 7 },
    { label: '30 Days', days: 30 },
    { label: '90 Days', days: 90 },
  ];
  selectedDays = signal(30);

  constructor() {
    // Initialize theme based on system preference or saved preference
    this.initializeTheme();
  }

  ngOnInit() {
    // Apply theme on startup
    const savedTheme = localStorage.getItem('theme') || 'dark';
    this.applyTheme(savedTheme as 'dark' | 'light');
  }

  ngAfterViewInit() {
    // Initialize particle animations after view is ready
    setTimeout(() => {
      this.initBgParticles();
      this.initSidebarParticles();
    }, 100);
  }

  private initializeTheme() {
    // Theme is already initialized by FinanceStateService constructor
    // Just ensure the theme class is applied
    const isDark = this.finance.isDark();
    this.applyTheme(isDark ? 'dark' : 'light');
  }

  private applyTheme(mode: 'dark' | 'light') {
    const root = document.documentElement;
    const body = document.body;
    
    if (mode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      body.style.background = '#0d0f16';
      body.style.color = '#f1f5f9';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      body.style.background = '#f8fafc';
      body.style.color = '#1f2937';
    }
    
    localStorage.setItem('theme', mode);
    
    // Force re-render by triggering a change detection
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    this.toastService.success(`Switched to ${newTheme} mode`);
  }

  // Initialize full-page particle animation
  private initBgParticles() {
    const canvas = document.getElementById('bgParticles') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d')!;
    
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 1.8 + 0.6
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Check theme for colors
      const isLight = document.documentElement.classList.contains('light');
      const dotColor = isLight ? 'rgba(6,182,212,0.22)' : 'rgba(6,182,212,0.55)';
      const lineColor = (alpha: number) => 
        isLight ? `rgba(6,182,212,${alpha * 0.4})` : `rgba(6,182,212,${alpha})`;
      
      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = lineColor((1 - dist/140) * 0.25);
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw dots
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      requestAnimationFrame(draw);
    };
    draw();
  }

  // Initialize particle animation for sidebar
  private initSidebarParticles() {
    const canvas = document.getElementById('sidebarParticleCanvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d')!;
    const parent = canvas.parentElement!;
    canvas.width  = parent.offsetWidth;
    canvas.height = parent.offsetHeight;

    const particles = Array.from({ length: 18 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 60) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(6,182,212,${(1 - dist/60) * 0.4})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6,182,212,0.5)';
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
      requestAnimationFrame(animate);
    };
    animate();
  }

  // Header state
  sectionTitle = computed(() => {
    const path = window.location.pathname;
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('transactions')) return 'Transactions';
    if (path.includes('insights')) return 'Insights';
    return 'Dashboard';
  });

  headerRangeLabel = computed(() => {
    const range = this.finance.timeRangePreset();
    if (range === '7d') return 'Last 7 days';
    if (range === 'month') return 'This month';
    if (range === 'custom') {
      const start = this.customStartDate();
      const end = this.customEndDate();
      if (start && end) {
        return `${start} - ${end}`;
      }
      return 'Custom range';
    }
    return '';
  });

  // Date range label for command bar
  get dateRangeLabel(): string {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - this.selectedDays());
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return fmt(start) + ' – ' + fmt(end);
  }

  // Currency switcher methods
  toggleCurrencyMenu() { 
    this.currencyOpen.set(!this.currencyOpen()); 
  }

  selectCurrency(code: string) {
    this.currencyService.setCurrency(code);
    this.currencyOpen.set(false);
    this.toastService.success(`Currency switched to ${code}`);
  }

  @HostListener('document:click')
  onDocClick() { 
    this.currencyOpen.set(false); 
  }

  // Period change for command bar
  onPeriodChange(days: number) {
    this.selectedDays.set(days);
    // Update finance service to match
    const preset = days === 1 ? '7d' : days === 7 ? '7d' : days === 30 ? 'month' : 'year';
    this.finance.setTimeRangePreset(preset);
  }

  // Date range methods
  setPreset(preset: string) {
    const today = new Date();
    let start: Date;
    let presetValue: string;

    switch (preset) {
      case 'Today':
        start = new Date(today);
        presetValue = '7d'; // Use '7d' since there's no 'today' preset
        break;
      case '7 Days':
        start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        presetValue = '7d';
        break;
      case '30 Days':
        start = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        presetValue = 'month';
        break;
      case '90 Days':
        start = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
        presetValue = 'year';
        break;
      case 'Custom':
        this.showCustomDatePicker.set(true);
        return;
      default:
        start = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        presetValue = 'month';
    }

    this.finance.setTimeRangePreset(presetValue as any);
    this.toastService.success(`Date range updated to ${preset}`);
  }

  presetActive(preset: string): boolean {
    const range = this.finance.timeRangePreset();

    switch (preset) {
      case '7 Days':
        return range === '7d';
      case '30 Days':
        return range === 'month';
      case '90 Days':
        return range === 'year';
      case 'Custom':
        return range === 'custom';
      default:
        return false;
    }
  }

  // Custom date range methods
  applyCustomDateRange() {
    const start = this.customStartDate();
    const end = this.customEndDate();
    
    if (!start || !end) {
      this.toastService.error('Please select both start and end dates');
      return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (startDate > endDate) {
      this.toastService.error('Start date must be before end date');
      return;
    }

    this.finance.setTimeRangePreset('custom');
    // You might need to add a method to set custom date range in FinanceStateService
    this.showCustomDatePicker.set(false);
    this.toastService.success(`Custom date range applied: ${start} - ${end}`);
  }

  cancelCustomDateRange() {
    this.showCustomDatePicker.set(false);
    this.customStartDate.set('');
    this.customEndDate.set('');
  }

  // User management
  onUserChange(userId: string) {
    this.dataService.switchUser(userId);
    this.toastService.success(`Switched to user: ${userId}`);
  }

  // Role switching - updated for new role types
  onRoleChange(newRole: 'admin' | 'viewer') {
    const oldRole = this.roleService.getCurrentRole();
    this.roleService.setRole(newRole);

    const roleText = newRole === 'admin' ? 'Admin' : 'Viewer';
    const permissionsText = newRole === 'admin' ? 'full access enabled' : 'view-only mode';

    this.toastService.info(`Switched to ${roleText} mode — ${permissionsText}`);
  }

  // Format percentage values
  formatPct(val: number): string {
    return (val >= 0 ? '+' : '') + val.toFixed(1) + '%';
  }

  // Logout
  logout() {
    // Clear authentication state
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    
    // Clear user state in data service
    this.dataService.clearCurrentUser();
    
    // Reset role to default
    this.roleService.setRole('viewer');
    
    this.toastService.success('Logged out successfully');
    
    // Navigate to login page using Angular Router
    this.router.navigate(['/login']);
  }

  // Get summary data for current date range
  protected getSummaryData() {
    const range = this.finance.reportRange();
    return this.dataService.getSummaryData({
      start: new Date(range.start),
      end: new Date(range.end)
    });
  }
}
