import React from 'react';
import { Receipt, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { useTranslation } from '@/locale';

interface SaleDetailHeroProps {
  saleNumber: string;
  saleId: string;
  total: number;
}

export const SaleDetailHero: React.FC<SaleDetailHeroProps> = ({
  saleNumber,
  saleId,
  total,
}) => {
  const { t } = useTranslation(['sales']);

  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center space-x-3.5">
        <div className="p-3 bg-maribel-100 text-maribel-800 rounded-2xl">
          <Receipt className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="font-serif font-bold text-stone-900 text-xl tracking-tight">
              {t('detail.saleTitle', { number: saleNumber })}
            </h2>
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" />
              <span>{t('detail.confirmed')}</span>
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            {t('detail.transactionId', { id: saleId })}
          </p>
        </div>
      </div>

      <div className="md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
        <span className="text-xs text-stone-500 block">
          {t('detail.totalOperation')}
        </span>
        <p className="text-2xl font-bold font-serif text-maribel-800">
          {formatCurrency(total)}
        </p>
      </div>
    </div>
  );
};
