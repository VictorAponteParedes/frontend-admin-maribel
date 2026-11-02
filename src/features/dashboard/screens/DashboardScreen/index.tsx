import React from 'react';
import { Header } from '@/components/layout/Header';
import { MetricCard } from '@/features/dashboard/components/MetricCard';
import { RevenueEvolutionChart } from '@/features/dashboard/components/RevenueEvolutionChart';
import { BrandSalesChart } from '@/features/dashboard/components/BrandSalesChart';
import { useDashboardAnalytics } from '@/features/dashboard/hooks/useDashboardAnalytics';
import { DashboardMetric } from '@/features/dashboard/types/dashboard.types';
import { t } from '@/lang';

const DASHBOARD_METRICS: DashboardMetric[] = [
  {
    id: 'monthly-sales',
    titleKey: 'dashboard.monthlySales',
    value: '$ 3.450.000',
    change: '+14.2%',
    isPositive: true,
  },
  {
    id: 'active-orders',
    titleKey: 'dashboard.activeOrders',
    value: '28',
    change: '+5.1%',
    isPositive: true,
  },
  {
    id: 'total-products',
    titleKey: 'dashboard.totalProducts',
    value: '142',
    change: '+3',
    isPositive: true,
  },
  {
    id: 'low-stock',
    titleKey: 'dashboard.lowStock',
    value: '4',
    change: '-2',
    isPositive: false,
  },
];

export const DashboardScreen: React.FC = () => {
  const { revenueEvolution, brandSales } = useDashboardAnalytics();

  return (
    <div className="space-y-6">
      <Header
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
      />

      {/* Top Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {DASHBOARD_METRICS.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      {/* Analytics Charts: Revenue Evolution & Brand Sales */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueEvolutionChart data={revenueEvolution} />
        </div>
        <div className="lg:col-span-1">
          <BrandSalesChart data={brandSales} />
        </div>
      </section>
    </div>
  );
};
