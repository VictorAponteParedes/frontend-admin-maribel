import React from 'react';
import { Layers, ShoppingBag, Boxes } from 'lucide-react';
import { useTranslation } from '@/locale';
import { Product } from '../../types/product.types';

export interface ProductDetailModalMetricsProps {
  product: Product;
}

export const ProductDetailModalMetrics: React.FC<ProductDetailModalMetricsProps> = ({
  product,
}) => {
  const { t } = useTranslation(['inventory', 'translation']);

  const getStockColorClass = (stock: number): string => {
    if (stock === 0) return 'text-rose-700';
    if (stock <= 5) return 'text-amber-700';
    return 'text-emerald-700';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* Total Recibido */}
      <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-2xs">
        <div className="flex items-center justify-between text-stone-500 text-xs font-medium mb-1">
          <span>{t('modal.totalIn')}</span>
          <Layers className="w-4 h-4 text-stone-400" />
        </div>
        <p className="text-xl font-bold font-serif text-stone-900">
          {product.totalIn} {t('units')}
        </p>
        <span className="text-[11px] text-stone-400">{t('modal.receivedGoods')}</span>
      </div>

      {/* Total Vendido */}
      <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-2xs">
        <div className="flex items-center justify-between text-stone-500 text-xs font-medium mb-1">
          <span>{t('modal.totalSold')}</span>
          <ShoppingBag className="w-4 h-4 text-maribel-700" />
        </div>
        <p className="text-xl font-bold font-serif text-maribel-800">
          {product.totalSold} {t('units')}
        </p>
        <span className="text-[11px] text-stone-400">{t('modal.counterSales')}</span>
      </div>

      {/* Saldo Inventario */}
      <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-2xs">
        <div className="flex items-center justify-between text-stone-500 text-xs font-medium mb-1">
          <span>{t('modal.stockBalance')}</span>
          <Boxes className="w-4 h-4 text-emerald-600" />
        </div>
        <p className={`text-xl font-bold font-serif ${getStockColorClass(product.stock)}`}>
          {product.stock} {t('units')}
        </p>
        <span className="text-[11px] text-stone-400">{t('modal.availableToday')}</span>
      </div>
    </div>
  );
};
