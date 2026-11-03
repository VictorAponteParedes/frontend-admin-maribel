import React from 'react';
import { DollarSign, ShoppingCart, Calendar } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { useTranslation } from '@/locale';
import { Product } from '../types/product.types';
import { ProductDetailFinancialMetrics } from '../hooks/useProductDetail';

export interface ProductDetailFinancialCardsProps {
  product: Product;
  metrics: ProductDetailFinancialMetrics;
}

export const ProductDetailFinancialCards: React.FC<ProductDetailFinancialCardsProps> = ({
  product,
  metrics,
}) => {
  const { t } = useTranslation(['inventory', 'translation']);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Precio Compra */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center justify-between text-stone-400 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            {t('detail.purchasePrice')}
          </span>
          <DollarSign className="w-4 h-4 text-stone-400" />
        </div>
        <p className="text-2xl font-bold font-serif text-stone-800">
          {formatCurrency(metrics.costPrice)}
        </p>
        <p className="text-[11px] text-stone-400 mt-1">{t('detail.purchaseCostDesc')}</p>
      </div>

      {/* Precio Venta */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center justify-between text-stone-400 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            {t('detail.salePrice')}
          </span>
          <ShoppingCart className="w-4 h-4 text-maribel-700" />
        </div>
        <p className="text-2xl font-bold font-serif text-stone-900">
          {formatCurrency(product.price)}
        </p>
        <p className="text-[11px] text-stone-400 mt-1">{t('detail.salePriceDesc')}</p>
      </div>

      {/* Ganancia Unitaria */}
      <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs bg-gradient-to-br from-white to-emerald-50/20">
        <div className="flex items-center justify-between text-emerald-700 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">
            {t('detail.unitProfit')}
          </span>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
            {t('detail.marginTag', { margin: metrics.marginPercent })}
          </span>
        </div>
        <p className="text-2xl font-bold font-serif text-emerald-700">
          +{formatCurrency(metrics.profit)}
        </p>
        <p className="text-[11px] text-emerald-600/90 mt-1">{t('detail.profitDesc')}</p>
      </div>

      {/* Fecha de Recepción */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center justify-between text-stone-400 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            {t('detail.lastReception')}
          </span>
          <Calendar className="w-4 h-4 text-stone-400" />
        </div>
        <p className="text-2xl font-bold font-mono text-stone-800">
          {product.receptionDate || '02/11/2026'}
        </p>
        <p className="text-[11px] text-stone-400 mt-1">{t('detail.lastReceptionDesc')}</p>
      </div>
    </div>
  );
};
