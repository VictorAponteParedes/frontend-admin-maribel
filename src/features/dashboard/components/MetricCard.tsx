import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { DashboardMetric } from '@/features/dashboard/types/dashboard.types';
import { t } from '@/lang';

export interface MetricCardProps {
  metric: DashboardMetric;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          {t(metric.titleKey)}
        </span>
        <span
          className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
            metric.isPositive
              ? 'text-emerald-700 bg-emerald-50'
              : 'text-rose-700 bg-rose-50'
          }`}
        >
          {metric.isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
          )}
          {metric.change}
        </span>
      </div>
      <p className="text-2xl font-bold text-stone-900 mt-3 font-serif">
        {metric.value}
      </p>
    </div>
  );
};
