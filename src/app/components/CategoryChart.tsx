import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useFinanceStore } from '../store/financeStore';

const CategoryChart: React.FC = () => {
  const { categoryDistribution, isLoading } = useFinanceStore();

  if (isLoading) {
    return (
      <div className="h-80 bg-white dark:bg-slate-800 rounded-2xl shadow-premium border border-slate-200 dark:border-slate-700 p-6 flex items-center justify-center">
        <div className="skeleton-premium w-full h-full rounded-xl"></div>
      </div>
    );
  }

  const COLORS = [
    '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', 
    '#ef4444', '#14b8a6', '#f97316', '#6366f1', '#84cc16'
  ];

  const formatTooltipValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-lg">
          <p className="font-semibold text-slate-900 dark:text-white">{data.name}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {formatTooltipValue(data.value)} ({data.payload.percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = (entry: any) => {
    if (entry.percentage < 5) return null;
    return `${entry.percentage.toFixed(0)}%`;
  };

  return (
    <div className="h-80 bg-white dark:bg-slate-800 rounded-2xl shadow-premium border border-slate-200 dark:border-slate-700 p-6 hover:shadow-premium-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Category Distribution</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Spending by category</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></div>
          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
            {categoryDistribution.length} Categories
          </span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryDistribution}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {categoryDistribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry: any) => (
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {value} ({entry.payload.percentage.toFixed(1)}%)
              </span>
            )}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;
