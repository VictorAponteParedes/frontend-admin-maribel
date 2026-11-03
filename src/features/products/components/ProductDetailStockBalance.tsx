import React from 'react';
import { Layers, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { useTranslation } from '@/locale';
import { Product } from '../types/product.types';
import { ProductDetailFinancialMetrics } from '../hooks/useProductDetail';

export interface ProductDetailStockBalanceProps {
  product: Product;
  metrics: ProductDetailFinancialMetrics;
}

export const ProductDetailStockBalance: React.FC<ProductDetailStockBalanceProps> = ({
  product,
  metrics,
}) => {
  const { t } = useTranslation(['inventory', 'translation']);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Balance Operativo de Unidades */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-stone-100">
          <Layers className="w-4 h-4 text-maribel-700" />
          <h3 className="font-serif font-bold text-stone-900 text-base">
            {t('detail.stockMovements')}
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
            <span className="text-stone-500 font-medium">{t('detail.historicalTotalIn')}</span>
            <strong className="text-stone-900 text-sm">
              {t('table.unitsTag', { count: product.totalIn })}
            </strong>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50/50 text-maribel-900">
            <span className="font-medium">{t('detail.historicalTotalSold')}</span>
            <strong className="text-maribel-800 text-sm font-bold">
              {t('table.unitsTag', { count: product.totalSold })}
            </strong>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 text-emerald-900 font-semibold border border-emerald-100">
            <span>{t('detail.currentAvailable')}</span>
            <span className="text-base font-bold font-serif">
              {t('table.unitsTag', { count: product.stock })}
            </span>
          </div>
        </div>
      </div>

      {/* Proyección Financiera de Stock Restante */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-stone-100">
          <TrendingUp className="w-4 h-4 text-emerald-700" />
          <h3 className="font-serif font-bold text-stone-900 text-base">
            {t('detail.stockValuation')}
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
            <span className="text-stone-500 font-medium">{t('detail.tiedInvestment')}</span>
            <strong className="text-stone-900 text-sm font-mono">
              {formatCurrency(metrics.totalStockValueCost)}
            </strong>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
            <span className="text-stone-500 font-medium">{t('detail.potentialSales')}</span>
            <strong className="text-stone-900 text-sm font-mono">
              {formatCurrency(metrics.totalStockValueSale)}
            </strong>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 text-emerald-950 font-bold border border-emerald-200/80">
            <span>{t('detail.projectedProfit')}</span>
            <span className="text-base font-serif text-emerald-700 font-bold">
              +{formatCurrency(metrics.projectedTotalProfit)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
