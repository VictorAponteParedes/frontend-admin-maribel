import React from 'react';
import { Barcode } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { useTranslation } from '@/locale';
import { Product } from '../../types/product.types';

export interface ProductDetailModalSummaryProps {
  product: Product;
}

export const ProductDetailModalSummary: React.FC<ProductDetailModalSummaryProps> = ({
  product,
}) => {
  const { t } = useTranslation(['inventory', 'translation']);

  return (
    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-stone-600 text-xs font-mono">
          <Barcode className="w-4 h-4 text-stone-400" />
          <span className="font-semibold text-stone-800">{product.barcode}</span>
        </div>
        <p className="text-xs text-stone-500">
          {t('modal.presentationSize')}{' '}
          <strong className="text-stone-700">{product.size}</strong>
        </p>
      </div>

      <div className="sm:text-right">
        <span className="text-xs text-stone-500 block">{t('modal.salePricePublic')}</span>
        <p className="text-2xl font-bold font-serif text-maribel-800">
          {formatCurrency(product.price)}
        </p>
      </div>
    </div>
  );
};
