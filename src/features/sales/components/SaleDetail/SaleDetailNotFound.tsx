import React from 'react';
import { Receipt } from 'lucide-react';
import { Button } from '@/components/ui';
import { useTranslation } from '@/locale';

interface SaleDetailNotFoundProps {
  id?: string;
  onBack: () => void;
}

export const SaleDetailNotFound: React.FC<SaleDetailNotFoundProps> = ({ id, onBack }) => {
  const { t } = useTranslation(['sales']);

  return (
    <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
      <Receipt className="w-12 h-12 text-stone-300 mx-auto mb-3" />
      <h3 className="text-base font-bold text-stone-800">
        {t('detail.notFoundTitle')}
      </h3>
      <p className="text-xs text-stone-500 mt-1 mb-4">
        {t('detail.notFoundDesc', { id })}
      </p>
      <Button variant="primary" onClick={onBack}>
        {t('detail.backButton')}
      </Button>
    </div>
  );
};
