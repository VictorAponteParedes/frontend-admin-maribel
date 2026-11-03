import React from 'react';
import { Button } from '@/components/ui';
import { OrderStatus } from '@/features/orders/types/order.types';
import { useTranslation } from '@/locale';

interface OrderStatusTabsProps {
  currentFilter: 'ALL' | OrderStatus;
  onFilterChange: (status: 'ALL' | OrderStatus) => void;
  counts: {
    total: number;
    pending: number;
    preparing: number;
    shipped: number;
    delivered: number;
  };
}

export const OrderStatusTabs: React.FC<OrderStatusTabsProps> = ({
  currentFilter,
  onFilterChange,
  counts,
}) => {
  const { t } = useTranslation(['orders', 'translation']);

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
      <Button
        type="button"
        size="sm"
        variant={currentFilter === 'ALL' ? 'primary' : 'ghost'}
        onClick={() => onFilterChange('ALL')}
        className={`shrink-0 flex items-center gap-1.5 ${
          currentFilter === 'ALL'
            ? '!bg-stone-900 !text-white hover:!bg-stone-800'
            : 'text-stone-600 hover:bg-stone-100'
        }`}
      >
        <span>{t('tabs.all')}</span>
        <span
          className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            currentFilter === 'ALL'
              ? 'bg-stone-700 text-white'
              : 'bg-stone-200 text-stone-700'
          }`}
        >
          {counts.total}
        </span>
      </Button>

      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => onFilterChange('PENDING')}
        className={`shrink-0 flex items-center gap-1.5 ${
          currentFilter === 'PENDING'
            ? '!bg-amber-600 !text-white hover:!bg-amber-700'
            : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
        }`}
      >
        <span>{t('tabs.pending')}</span>
        {counts.pending > 0 && (
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              currentFilter === 'PENDING'
                ? 'bg-white text-amber-900'
                : 'bg-amber-200 text-amber-900'
            }`}
          >
            {counts.pending}
          </span>
        )}
      </Button>

      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => onFilterChange('PREPARING')}
        className={`shrink-0 flex items-center gap-1.5 ${
          currentFilter === 'PREPARING'
            ? '!bg-blue-600 !text-white hover:!bg-blue-700'
            : 'text-blue-800 bg-blue-50 hover:bg-blue-100'
        }`}
      >
        <span>{t('tabs.preparing')}</span>
        {counts.preparing > 0 && (
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              currentFilter === 'PREPARING'
                ? 'bg-white text-blue-900'
                : 'bg-blue-200 text-blue-900'
            }`}
          >
            {counts.preparing}
          </span>
        )}
      </Button>

      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => onFilterChange('SHIPPED')}
        className={`shrink-0 flex items-center gap-1.5 ${
          currentFilter === 'SHIPPED'
            ? '!bg-purple-600 !text-white hover:!bg-purple-700'
            : 'text-purple-800 bg-purple-50 hover:bg-purple-100'
        }`}
      >
        <span>{t('tabs.shipped')}</span>
        {counts.shipped > 0 && (
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              currentFilter === 'SHIPPED'
                ? 'bg-white text-purple-900'
                : 'bg-purple-200 text-purple-900'
            }`}
          >
            {counts.shipped}
          </span>
        )}
      </Button>

      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => onFilterChange('DELIVERED')}
        className={`shrink-0 flex items-center gap-1.5 ${
          currentFilter === 'DELIVERED'
            ? '!bg-emerald-600 !text-white hover:!bg-emerald-700'
            : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
        }`}
      >
        <span>{t('tabs.delivered')}</span>
        {counts.delivered > 0 && (
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              currentFilter === 'DELIVERED'
                ? 'bg-white text-emerald-900'
                : 'bg-emerald-200 text-emerald-900'
            }`}
          >
            {counts.delivered}
          </span>
        )}
      </Button>
    </div>
  );
};
