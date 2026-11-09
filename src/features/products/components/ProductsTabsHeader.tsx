import React from 'react';
import { Boxes, History } from 'lucide-react';
import { Button } from '@/components/ui';
import { useTranslation } from '@/locale';
import { ProductTab } from '../hooks/useProductsList';

export interface ProductsTabsHeaderProps {
  activeTab: ProductTab;
  productsCount: number;
  entriesCount: number;
  totalEntriesUnits: number;
  onTabChange: (tab: ProductTab) => void;
}

export const ProductsTabsHeader: React.FC<ProductsTabsHeaderProps> = ({
  activeTab,
  productsCount,
  entriesCount,
  totalEntriesUnits,
  onTabChange,
}) => {
  const { t } = useTranslation(['inventory', 'translation']);

  return (
    <div className="px-5 pt-4 pb-0 border-b border-stone-200 flex items-center justify-between flex-wrap gap-3 bg-stone-50/50">
      <div className="flex space-x-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          leftIcon={<Boxes className="w-4 h-4" />}
          onClick={() => onTabChange('stock')}
          className={`py-2.5 px-4 font-semibold rounded-t-xl rounded-b-none border-b-2 transition-all ${
            activeTab === 'stock'
              ? 'border-maribel-700 !bg-white !text-maribel-800 shadow-xs'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          {t('tabStock')} ({productsCount})
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          leftIcon={<History className="w-4 h-4" />}
          onClick={() => onTabChange('entries')}
          className={`py-2.5 px-4 font-semibold rounded-t-xl rounded-b-none border-b-2 transition-all ${
            activeTab === 'entries'
              ? 'border-maribel-700 !bg-white !text-maribel-800 shadow-xs'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          {t('tabEntries')} ({entriesCount})
        </Button>
      </div>

      <span className="text-[11px] text-stone-400 pb-2">
        {activeTab === 'stock'
          ? t('hints.consolidatedStock')
          : t('hints.entriesHistory', { count: totalEntriesUnits })}
      </span>
    </div>
  );
};
