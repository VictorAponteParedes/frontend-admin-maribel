import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { Button } from '@/components/ui';
import { RoutesView } from '@/navigation/routes';
import { useTranslation } from '@/locale';

interface SaleDetailHeaderNavProps {
  onPrint: () => void;
}

export const SaleDetailHeaderNav: React.FC<SaleDetailHeaderNavProps> = ({ onPrint }) => {
  const { t } = useTranslation(['sales']);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <Link
        to={RoutesView.SALES}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('detail.backToSales')}</span>
      </Link>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          leftIcon={<Printer className="w-4 h-4" />}
          onClick={onPrint}
        >
          {t('detail.printReceipt')}
        </Button>
      </div>
    </div>
  );
};
