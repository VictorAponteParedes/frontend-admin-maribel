import React from 'react';
import { Button } from '@/components/ui';
import { formatCurrency } from '@/utils/formatters';
import { useTranslation } from '@/locale';

interface SaleFormModalFooterProps {
  cartItemsCount: number;
  totalQuantity: number;
  totalAmount: number;
  onClose: () => void;
  onSaveSale: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export const SaleFormModalFooter: React.FC<SaleFormModalFooterProps> = ({
  cartItemsCount,
  totalQuantity,
  totalAmount,
  onClose,
  onSaveSale,
  isLoading = false,
}) => {
  const { t } = useTranslation(['sales', 'translation']);

  return (
    <div className="p-5 border-t border-stone-200/80 bg-stone-50/80 shrink-0 space-y-3.5">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-stone-500 block">
            {t('form.totalToCharge')}
          </span>
          <span className="text-[11px] text-stone-400">
            {cartItemsCount > 0
              ? `${cartItemsCount} producto(s) • ${totalQuantity} unidades`
              : 'Sin productos en el carrito'}
          </span>
        </div>
        <p className="text-2xl font-bold font-serif text-maribel-900 tracking-tight">
          {formatCurrency(totalAmount)}
        </p>
      </div>

      <div className="flex items-center space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
          className="w-1/3 py-2.5 rounded-xl text-xs font-semibold"
        >
          {t('common.cancel')}
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={onSaveSale}
          disabled={cartItemsCount === 0 || isLoading}
          isLoading={isLoading}
          className="w-2/3 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
        >
          {t('form.completeSale')} {totalQuantity > 0 ? `(${totalQuantity})` : ''}
        </Button>
      </div>
    </div>
  );
};
