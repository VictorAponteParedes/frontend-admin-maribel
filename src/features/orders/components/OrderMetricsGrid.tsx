import React from 'react';
import { ShoppingBag, Clock, Truck, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/locale';

interface OrderMetricsGridProps {
  totalCount: number;
  pendingCount: number;
  inProgressCount: number;
  deliveredCount: number;
}

export const OrderMetricsGrid: React.FC<OrderMetricsGridProps> = ({
  totalCount,
  pendingCount,
  inProgressCount,
  deliveredCount,
}) => {
  const { t } = useTranslation(['orders', 'translation']);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {/* Total */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            {t('metrics.total')}
          </p>
          <p className="text-2xl font-bold text-stone-900 mt-1 font-mono">
            {totalCount}
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-stone-100 text-stone-700">
          <ShoppingBag className="w-5 h-5" />
        </div>
      </div>

      {/* Pendientes */}
      <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
            {t('metrics.pending')}
          </p>
          <p className="text-2xl font-bold text-amber-900 mt-1 font-mono">
            {pendingCount}
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      {/* En Preparación / Reparto */}
      <div className="bg-white p-4 rounded-2xl border border-sky-200 bg-sky-50/20 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">
            {t('metrics.inProgress')}
          </p>
          <p className="text-2xl font-bold text-sky-900 mt-1 font-mono">
            {inProgressCount}
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700">
          <Truck className="w-5 h-5" />
        </div>
      </div>

      {/* Entregados */}
      <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
            {t('metrics.delivered')}
          </p>
          <p className="text-2xl font-bold text-emerald-900 mt-1 font-mono">
            {deliveredCount}
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
