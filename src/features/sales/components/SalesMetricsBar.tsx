import React from 'react';
import { DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { useTranslation } from '@/locale';

interface SalesMetricsBarProps {
  totalRevenue: number;
  totalItemsSold: number;
  averageTicket: number;
}

export const SalesMetricsBar: React.FC<SalesMetricsBarProps> = ({
  totalRevenue,
  totalItemsSold,
  averageTicket,
}) => {
  const { t } = useTranslation(['sales']);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex items-center space-x-3">
        <div className="p-2.5 bg-maribel-50 text-maribel-700 rounded-lg">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase text-stone-500">
            {t('metrics.registeredRevenue')}
          </p>
          <p className="text-xl font-bold font-serif text-stone-900">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex items-center space-x-3">
        <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase text-stone-500">
            {t('metrics.itemsSold')}
          </p>
          <p className="text-xl font-bold font-serif text-stone-900">
            {t('metrics.perfumesCount', { count: totalItemsSold })}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex items-center space-x-3">
        <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-lg">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase text-stone-500">
            {t('metrics.averageTicket')}
          </p>
          <p className="text-xl font-bold font-serif text-stone-900">
            {formatCurrency(averageTicket)}
          </p>
        </div>
      </div>
    </div>
  );
};
