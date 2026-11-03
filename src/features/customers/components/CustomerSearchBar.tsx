import React from 'react';
import { Search } from 'lucide-react';
import { AppInput } from '@/components/ui';
import { useTranslation } from '@/locale';

export interface CustomerSearchBarProps {
  searchQuery: string;
  totalCount: number;
  onSearchChange: (query: string) => void;
}

export const CustomerSearchBar: React.FC<CustomerSearchBarProps> = ({
  searchQuery,
  totalCount,
  onSearchChange,
}) => {
  const { t } = useTranslation(['customers', 'translation']);

  return (
    <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <AppInput
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('searchPlaceholder')}
          leftIcon={<Search className="w-4 h-4" />}
          className="text-xs"
        />
      </div>

      <span className="text-xs text-stone-500 font-medium">
        {t('registeredCount', { count: totalCount })}
      </span>
    </div>
  );
};
