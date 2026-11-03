import React from 'react';
import { Search } from 'lucide-react';
import { AppInput } from '@/components/ui';
import { useTranslation } from '@/locale';

interface OrderSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export const OrderSearchBar: React.FC<OrderSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  placeholder,
}) => {
  const { t } = useTranslation(['orders']);

  return (
    <AppInput
      type="text"
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder={placeholder || t('searchPlaceholder')}
      leftIcon={<Search className="w-4 h-4 text-stone-400" />}
      className="text-xs bg-stone-50"
    />
  );
};
