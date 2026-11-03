import React from 'react';
import { ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui';
import { useTranslation } from '@/locale';

export interface ProductDetailNotFoundProps {
  onBack: () => void;
}

export const ProductDetailNotFound: React.FC<ProductDetailNotFoundProps> = ({ onBack }) => {
  const { t } = useTranslation(['inventory', 'translation']);

  return (
    <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-stone-200 mt-10 space-y-4 shadow-xs">
      <Package className="w-12 h-12 text-stone-300 mx-auto" />
      <h2 className="text-xl font-serif font-bold text-stone-800">
        {t('detail.notFoundTitle')}
      </h2>
      <p className="text-xs text-stone-500">{t('detail.notFoundDesc')}</p>
      <Button
        type="button"
        variant="primary"
        size="md"
        leftIcon={<ArrowLeft className="w-4 h-4" />}
        onClick={onBack}
      >
        {t('detail.backToInventory')}
      </Button>
    </div>
  );
};
