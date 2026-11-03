import React from 'react';
import { Search } from 'lucide-react';
import { AppInput } from '@/components/ui';
import { useTranslation } from '@/locale';

interface SalesSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export const SalesSearchBar: React.FC<SalesSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  placeholder,
}) => {
  const { t } = useTranslation(['sales']);

  return (
    <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex-1 max-w-md">
        <AppInput
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder || t('searchPlaceholder')}
          leftIcon={<Search className="w-4 h-4 text-stone-400" />}
          className="text-xs bg-stone-50"
        />
      </div>
    </div>
  );
};
