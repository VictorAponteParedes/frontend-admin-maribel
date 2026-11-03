import React from 'react';
import { Sparkles } from 'lucide-react';
import { useTranslation } from '@/locale';
import { Product } from '../../types/product.types';

export interface StockEntryModalProductCardProps {
  product?: Product;
}

export const StockEntryModalProductCard: React.FC<StockEntryModalProductCardProps> = ({
  product,
}) => {
  const { t } = useTranslation(['inventory', 'translation']);

  if (!product) return null;

  return (
    <div className="p-4 bg-stone-50/70 border border-stone-200/80 rounded-2xl flex items-center justify-between gap-4 shadow-2xs">
      <div className="flex items-center space-x-3 min-w-0">
        <div className="w-10 h-10 bg-white rounded-xl border border-stone-200 flex items-center justify-center text-maribel-700 shrink-0 shadow-2xs">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] text-stone-500 font-medium truncate">
            <strong className="text-stone-800 font-bold">{product.brand}</strong> • {product.size}
          </p>
          <h4 className="font-serif font-bold text-stone-900 text-sm truncate mt-0.5">
            {product.name}
          </h4>
        </div>
      </div>

      <div className="text-right shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
          {t('detail.currentStockLabel')}
        </span>
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mt-0.5">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          <span>
            {product.stock} {t('units')}
          </span>
        </span>
      </div>
    </div>
  );
};
