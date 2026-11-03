import React from 'react';
import { Search, Filter } from 'lucide-react';
import { AppInput, Button } from '@/components/ui';
import { useTranslation } from '@/locale';
import { ProductTab } from '../hooks/useProductsList';

export interface ProductsFilterBarProps {
  activeTab: ProductTab;
  searchQuery: string;
  filterLowStock: boolean;
  lowStockCount: number;
  onSearchChange: (query: string) => void;
  onToggleLowStock: () => void;
}

export const ProductsFilterBar: React.FC<ProductsFilterBarProps> = ({
  activeTab,
  searchQuery,
  filterLowStock,
  lowStockCount,
  onSearchChange,
  onToggleLowStock,
}) => {
  const { t } = useTranslation(['inventory', 'translation']);

  return (
    <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <AppInput
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={
            activeTab === 'stock'
              ? t('filters.searchStockPlaceholder')
              : t('filters.searchEntriesPlaceholder')
          }
          leftIcon={<Search className="w-4 h-4" />}
          className="text-xs"
        />
      </div>

      {activeTab === 'stock' && (
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant={filterLowStock ? 'outline' : 'secondary'}
            size="sm"
            leftIcon={<Filter className="w-3.5 h-3.5" />}
            onClick={onToggleLowStock}
            className={
              filterLowStock
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }
          >
            {t('filters.onlyLowStock', { count: lowStockCount })}
          </Button>
        </div>
      )}
    </div>
  );
};
