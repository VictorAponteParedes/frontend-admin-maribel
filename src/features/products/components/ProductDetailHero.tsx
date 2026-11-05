import React from 'react';
import { Sparkles, Barcode, Tag } from 'lucide-react';
import { useTranslation } from '@/locale';
import { Product } from '../types/product.types';

export interface ProductDetailHeroProps {
  product: Product;
}

export const ProductDetailHero: React.FC<ProductDetailHeroProps> = ({ product }) => {
  const { t } = useTranslation(['inventory', 'translation']);

  const getStockBadgeClass = (stock: number): string => {
    if (stock === 0) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (stock <= 5) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  const getStockDotClass = (stock: number): string => {
    if (stock === 0) return 'bg-rose-500';
    if (stock <= 5) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-gradient-to-br from-rose-50 to-maribel-100/60 border border-rose-200/60 rounded-2xl flex items-center justify-center text-maribel-700 shrink-0 shadow-xs">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center flex-wrap gap-2">
            <span className="px-2.5 py-0.5 bg-rose-50 border border-rose-100 text-maribel-800 text-[11px] font-bold rounded-full uppercase tracking-wider">
              {product.brand}
            </span>
            {product.category && (
              <span className="px-2.5 py-0.5 bg-stone-100 border border-stone-200 text-stone-700 text-[11px] font-semibold rounded-full flex items-center gap-1">
                <Tag className="w-3 h-3 text-stone-500" />
                <span>{product.category}</span>
              </span>
            )}
            <span className="text-xs text-stone-400 font-mono flex items-center space-x-1">
              <Barcode className="w-3.5 h-3.5" />
              <span>{product.barcode}</span>
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
            {product.name}
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            {t('detail.presentationSize', { size: product.size })}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4 bg-stone-50/80 p-4 rounded-2xl border border-stone-200/70 shrink-0">
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
            {t('detail.currentStockLabel')}
          </span>
          <span
            className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-sm font-bold mt-1 border ${getStockBadgeClass(
              product.stock
            )}`}
          >
            <span className={`w-2 h-2 rounded-full ${getStockDotClass(product.stock)}`} />
            <span>{t('detail.unitsCount', { count: product.stock })}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
