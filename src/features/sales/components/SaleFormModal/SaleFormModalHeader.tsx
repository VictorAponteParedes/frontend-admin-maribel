import React from 'react';
import { ShoppingCart, PackageCheck, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { useTranslation } from '@/locale';

interface SaleFormModalHeaderProps {
  isLinkedOrder: boolean;
  onClose: () => void;
}

export const SaleFormModalHeader: React.FC<SaleFormModalHeaderProps> = ({
  isLinkedOrder,
  onClose,
}) => {
  const { t } = useTranslation(['sales']);

  return (
    <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50 shrink-0">
      <div className="flex items-center space-x-3">
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs ${
            isLinkedOrder
              ? 'bg-gradient-to-br from-maribel-600 to-rose-700 text-white'
              : 'bg-maribel-100 text-maribel-800'
          }`}
        >
          {isLinkedOrder ? (
            <PackageCheck className="w-5 h-5" />
          ) : (
            <ShoppingCart className="w-5 h-5" />
          )}
        </div>
        <div>
          <h3 className="font-serif font-bold text-stone-900 text-lg tracking-tight">
            {t('newSale')}
          </h3>
          <p className="text-xs text-stone-500">{t('form.modalSubtitle')}</p>
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="xs"
        onClick={onClose}
        aria-label="Cerrar modal"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};
