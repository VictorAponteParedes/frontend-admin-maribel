import React from 'react';
import { Button } from '@/components/ui';
import { useTranslation } from '@/locale';
import { useProductDetailModal } from '../../hooks/useProductDetailModal';
import { ProductDetailModalHeader } from './ProductDetailModalHeader';
import { ProductDetailModalSummary } from './ProductDetailModalSummary';
import { ProductDetailModalMetrics } from './ProductDetailModalMetrics';
import { ProductDetailModalEntriesTable } from './ProductDetailModalEntriesTable';
import { ProductDetailModalSalesTable } from './ProductDetailModalSalesTable';

export const ProductDetailModal: React.FC = () => {
  const { t } = useTranslation(['inventory', 'translation']);
  const { isOpen, product, productEntries, productSales, onClose } = useProductDetailModal();

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        <ProductDetailModalHeader product={product} onClose={onClose} />

        <div className="p-6 space-y-6 overflow-y-auto">
          <ProductDetailModalSummary product={product} />

          <ProductDetailModalMetrics product={product} />

          <ProductDetailModalEntriesTable entries={productEntries} />

          <ProductDetailModalSalesTable sales={productSales} />
        </div>

        <div className="p-4 border-t border-stone-100 flex justify-end bg-stone-50/50 shrink-0">
          <Button variant="outline" size="sm" onClick={onClose}>
            {t('common.cancel')}
          </Button>
        </div>
      </div>
    </div>
  );
};
