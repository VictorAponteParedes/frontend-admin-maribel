import React from 'react';
import { ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui';
import { useTranslation } from '@/locale';

export interface StockEntryHeaderProps {
  onBack: () => void;
}

export const StockEntryHeader: React.FC<StockEntryHeaderProps> = ({ onBack }) => {
  const { t } = useTranslation(['inventory', 'translation']);

  return (
    <div className="space-y-6">
      {/* Barra superior de navegación */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-200/80">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={onBack}
        >
          {t('detail.backButton')}
        </Button>

        <span className="px-3 py-1 bg-rose-50 border border-rose-100 text-maribel-700 text-xs font-semibold rounded-full">
          {t('entry.navBadge')}
        </span>
      </div>

      {/* Hero del encabezado */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-2xs">
            <Package className="w-7 h-7 stroke-[1.8]" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
              {t('entry.title')}
            </h1>
            <p className="text-xs text-stone-500 mt-1">{t('entry.subtitle')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
