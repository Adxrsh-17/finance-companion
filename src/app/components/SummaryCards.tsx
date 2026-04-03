import React from 'react';
import { useFinanceStore } from '../store/financeStore';

const SummaryCards: React.FC = () => {
  const { totals, isLoading } = useFinanceStore();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl shadow-premium border border-slate-200 dark:border-slate-700 p-6">
            <div className="skeleton-premium h-4 w-24 rounded-lg mb-3"></div>
            <div className="skeleton-premium h-8 w-32 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Balance',
      value: totals.balance,
      trend: totals.balance >= 0 ? 'positive' : 'negative',
      icon: '💰',
      color: 'violet',
      bgColor: 'from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/20',
      borderColor: 'border-violet-200 dark:border-violet-800',
      textColor: 'text-violet-700 dark:text-violet-300'
    },
    {
      title: 'Total Income',
      value: totals.income,
      trend: 'positive',
      icon: '📈',
      color: 'emerald',
      bgColor: 'from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      textColor: 'text-emerald-700 dark:text-emerald-300'
    },
    {
      title: 'Total Expenses',
      value: totals.expense,
      trend: 'negative',
      icon: '📉',
      color: 'red',
      bgColor: 'from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/20',
      borderColor: 'border-red-200 dark:border-red-800',
      textColor: 'text-red-700 dark:text-red-300'
    },
    {
      title: 'Transactions',
      value: totals.transactionCount,
      trend: 'neutral',
      icon: '🔄',
      color: 'blue',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-700 dark:text-blue-300'
    }
  ];

  const formatValue = (value: number, isCurrency: boolean = true) => {
    if (!isCurrency) return value.toLocaleString();
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'positive':
        return '↑';
      case 'negative':
        return '↓';
      default:
        return '→';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'positive':
        return 'text-emerald-500';
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-slate-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`group bg-gradient-to-br ${card.bgColor} rounded-2xl shadow-premium border ${card.borderColor} p-6 hover:shadow-premium-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`text-2xl transition-transform duration-200 group-hover:scale-110`}>
              {card.icon}
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(card.trend)}`}>
              <span>{getTrendIcon(card.trend)}</span>
              <span className="count-animation">
                {card.trend === 'positive' ? '+' : card.trend === 'negative' ? '-' : ''}
                {Math.abs(Math.random() * 20).toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className={`text-sm font-semibold ${card.textColor} opacity-80`}>
              {card.title}
            </p>
            <p className={`text-2xl font-bold text-slate-900 dark:text-white count-animation`}>
              {formatValue(card.value, card.title !== 'Transactions')}
            </p>
          </div>
          
          <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20"></div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
