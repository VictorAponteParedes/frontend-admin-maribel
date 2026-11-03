import React from 'react';
import { TrendingUp, Check } from 'lucide-react';
import { Button } from '@/components/ui';
import { formatCurrency } from '@/utils/formatters';
import { useTranslation } from '@/locale';
import { StockEntryCalculatedMetrics } from '../types/stockEntry.types';

export interface StockEntrySummaryCardProps {
  metrics: StockEntryCalculatedMetrics;
  quantity: number;
  isFormValid: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const StockEntrySummaryCard: React.FC<StockEntrySummaryCardProps> = ({
  metrics,
  quantity,
  isFormValid,
  isSubmitting,
  onCancel,
}) => {
  const { t } = useTranslation(['inventory', 'translation']);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5 sticky top-24">
        <div className="flex items-center space-x-2 pb-3 border-b border-stone-100">
          <TrendingUp className="w-5 h-5 text-emerald-700" />
          <h3 className="font-serif font-bold text-stone-900 text-base">
            {t('entry.batchSummary')}
          </h3>
        </div>

        {/* Proyección de existencias en góndola */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
            {t('entry.shelfProjection')}
          </span>
          <div className="flex items-center justify-between text-xs text-stone-600">
            <span>{t('entry.currentStock')}</span>
            <span className="font-medium">
              {t('table.unitsTag', { count: metrics.existingStock })}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold">
            <span>{t('entry.newIncoming')}</span>
            <span>{t('table.plusUnitsTag', { count: quantity })}</span>
          </div>
          <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
            <span className="font-bold text-stone-800">{t('entry.totalAvailable')}</span>
            <span className="font-bold text-base text-stone-900 font-serif">
              {t('table.unitsTag', { count: metrics.projectedStock })}
            </span>
          </div>
        </div>

        {/* Resumen Monetario del Lote */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
            <span className="text-stone-500 font-medium">{t('entry.totalBatchInvestment')}</span>
            <strong className="text-stone-900 text-sm font-mono">
              {formatCurrency(metrics.totalCost)}
            </strong>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
            <span className="text-stone-500 font-medium">{t('entry.projectedGrossSales')}</span>
            <strong className="text-stone-900 text-sm font-mono">
              {formatCurrency(metrics.totalSales)}
            </strong>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
              {t('entry.estimatedTotalProfit')}
            </span>
            <p className="text-2xl font-bold font-serif text-emerald-800">
              +{formatCurrency(metrics.totalProfit)}
            </p>
            <p className="text-[11px] text-emerald-700">
              {t('entry.whenSellingAll', { count: quantity })}
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="space-y-2 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!isFormValid || isSubmitting}
            isLoading={isSubmitting}
            leftIcon={<Check className="w-4 h-4 stroke-[2.5]" />}
            className="w-full"
          >
            {t('entry.confirmEntry', { count: quantity })}
          </Button>

          {!isFormValid && (
            <p className="text-[11px] text-center text-stone-400 font-medium">
              {t('entry.formRequirementNote')}
            </p>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="w-full text-stone-500"
          >
            {t('entry.cancelAndReturn')}
          </Button>
        </div>
      </div>
    </div>
  );
};
