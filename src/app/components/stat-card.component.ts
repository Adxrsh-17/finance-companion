import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyFormatPipe } from '../pipes/currency-format.pipe';

export interface StatCard {
  title: string;
  value: number;
  delta: string;
  subtitle: string;
  icon: string;
  iconBg: string;
  sparklineData?: number[];
}

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, CurrencyFormatPipe],
  template: `
    <div class="stat-card" [ngClass]="getCardClass()">
      <!-- Top row: icon + label -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full flex items-center justify-center" [style.background-color]="card.iconBg">
            <span class="text-white text-base">{{ card.icon }}</span>
          </div>
          <span class="text-xs uppercase tracking-widest" style="color: var(--text-muted); letter-spacing: 0.1em;">{{ card.title }}</span>
        </div>
      </div>
      
      <!-- Main value -->
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 32px; font-weight: 700; color: var(--text-primary); margin-bottom: 12px;">
        {{ card.value | appCurrency }}
      </div>
      
      <!-- Delta badge -->
      <div class="flex items-center gap-2 mb-3">
        <div class="px-4 py-2 rounded-full text-sm font-medium" 
             [style]="card.delta.startsWith('+') 
               ? 'background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid rgba(16,185,129,0.3);' 
               : 'background: rgba(244,63,94,0.15); color: #f43f5e; border: 1px solid rgba(244,63,94,0.3);'">
          <span class="mr-2">{{ card.delta.startsWith('+') ? '▲' : '▼' }}</span>
          {{ card.delta }} vs last period
        </div>
      </div>
      
      <!-- Subtitle -->
      <p style="color: var(--text-muted); font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">{{ card.subtitle }}</p>
      
      <!-- Mini sparkline -->
      <div class="mt-4" *ngIf="card.sparklineData && card.sparklineData.length > 0">
        <svg width="100" height="40" class="overflow-visible">
          <polyline
            [attr.points]="getSparklinePoints()"
            fill="none"
            [attr.stroke]="card.delta.startsWith('+') ? '#10b981' : '#f43f5e'"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class StatCardComponent {
  @Input() card!: StatCard;

  getCardClass(): string {
    const type = this.card.title.toLowerCase();
    if (type.includes('balance')) return 'stat-card balance';
    if (type.includes('income')) return 'stat-card income';
    if (type.includes('expense')) return 'stat-card expense';
    return 'stat-card';
  }

  getSparklinePoints(): string {
    if (!this.card.sparklineData || this.card.sparklineData.length === 0) {
      return '';
    }
    
    const data = this.card.sparklineData;
    const width = 100;
    const height = 40;
    const padding = 8;
    const stepX = (width - padding * 2) / (data.length - 1);
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    return data.map((value, index) => {
      const x = padding + index * stepX;
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' ');
  }
}
