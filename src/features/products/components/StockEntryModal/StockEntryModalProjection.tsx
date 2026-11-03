import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import { useTranslation } from '@/locale';

export interface StockEntryModalProjectionProps {
  existingStock: number;
  quantity: number;
  projectedStock: number;
  totalCost: number;
}

export const StockEntryModalProjection: React.FC<StockEntryModalProjectionProps> = ({
  existingStock,
  quantity,
  projectedStock,
  totalCost,
}) => {
  const { t } = useTranslation(['inventory', 'translation']);

  return (
    <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
          Σ
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
            {t('entry.shelfProjection')}
          </span>
          <p className="text-xs text-stone-700">
            <span className="font-semibold">
              {existingStock} {t('units')}
            </span>{' '}
            + <strong className="text-emerald-700 font-bold">{quantity}</strong> ={' '}
            <strong className="text-stone-900 font-bold text-sm">
              {projectedStock} {t('units')}
            </strong>
          </p>
        </div>
      </div>

      <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-emerald-100/80">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
          {t('detail.totalLotCost')}
        </span>
        <p className="text-xl font-bold font-serif text-stone-900">
          {formatCurrency(totalCost)}
        </p>
      </div>
    </div>
  );
};
