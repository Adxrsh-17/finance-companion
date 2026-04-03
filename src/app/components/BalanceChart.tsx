import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useFinanceStore } from '../store/financeStore';

const BalanceChart: React.FC = () => {
  const { timeSeries, isLoading } = useFinanceStore();

  if (isLoading) {
    return (
      <div className="h-80 bg-white dark:bg-slate-800 rounded-2xl shadow-premium border border-slate-200 dark:border-slate-700 p-6 flex items-center justify-center">
        <div className="skeleton-premium w-full h-full rounded-xl"></div>
      </div>
    );
  }

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  const formatTooltipValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="h-80 bg-white dark:bg-slate-800 rounded-2xl shadow-premium border border-slate-200 dark:border-slate-700 p-6 hover:shadow-premium-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Balance Over Time</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track your financial progress</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/20 rounded-lg border border-violet-200 dark:border-violet-800">
          <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse"></div>
          <span className="text-sm font-medium text-violet-700 dark:text-violet-300">Live</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
          <XAxis 
            dataKey="date" 
            stroke="#64748b"
            fontSize={12}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            stroke="#64748b"
            fontSize={12}
            tickFormatter={formatYAxis}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
              backdropFilter: 'blur(10px)',
            }}
            itemStyle={{ color: '#8b5cf6', fontWeight: 'bold' }}
            labelStyle={{ color: '#475569', fontWeight: 'normal' }}
            formatter={(value: number) => [formatTooltipValue(value), 'Balance']}
            labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { 
              weekday: 'short', 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#8b5cf6"
            strokeWidth={3}
            fill="url(#balanceGradient)"
            dot={false}
            activeDot={{
              r: 6,
              fill: '#8b5cf6',
              stroke: '#fff',
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BalanceChart;
