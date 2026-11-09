import React from 'react';
import { PackageX } from 'lucide-react';
import { Button } from '@/components/ui';
import { useTranslation } from '@/locale';

interface OrderDetailNotFoundProps {
  id?: string;
  onBack: () => void;
}

export const OrderDetailNotFound: React.FC<OrderDetailNotFoundProps> = ({ id, onBack }) => {
  const { t } = useTranslation(['orders']);

  return (
    <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-xs max-w-xl mx-auto my-12">
      <div className="w-16 h-16 bg-stone-100 text-stone-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <PackageX className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold font-serif text-stone-900">
        {t('detail.notFoundTitle')}
      </h3>
      <p className="text-xs text-stone-500 mt-1 mb-6">
        {t('detail.notFoundDesc', { id })}
      </p>
      <Button variant="primary" onClick={onBack}>
        {t('detail.backButton')}
      </Button>
    </div>
  );
};
