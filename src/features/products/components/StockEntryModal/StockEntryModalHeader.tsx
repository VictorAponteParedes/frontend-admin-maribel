import React from 'react';
import { Package, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { useTranslation } from '@/locale';

export interface StockEntryModalHeaderProps {
  batchNumber: string;
  onClose: () => void;
}

export const StockEntryModalHeader: React.FC<StockEntryModalHeaderProps> = ({
  batchNumber,
  onClose,
}) => {
  const { t } = useTranslation(['inventory', 'translation']);

  return (
    <div className="p-6 border-b border-stone-100 flex items-start justify-between bg-stone-50/40">
      <div className="flex items-center space-x-3.5">
        <div className="w-11 h-11 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-2xs">
          <Package className="w-6 h-6 stroke-[1.8]" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-serif font-bold text-stone-900 text-lg tracking-tight">
              {t('entry.title')}
            </h3>
            <span className="px-2 py-0.5 bg-rose-50 border border-rose-100 text-maribel-700 text-[11px] font-semibold rounded-full">
              Perfumería
            </span>
            <span className="px-2 py-0.5 bg-stone-100 border border-stone-200 text-stone-600 text-[11px] font-mono rounded-full">
              {batchNumber}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">{t('entry.subtitle')}</p>
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="xs"
        onClick={onClose}
        className="p-2 text-stone-400 hover:text-stone-700"
        aria-label="Cerrar modal"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};
