import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { OrderStatus } from '@/features/orders/types/order.types';
import { StatusBadgeConfig } from '@/features/orders/utils/order.utils';
import { useTranslation } from '@/locale';

interface OrderDetailStatusUpdaterProps {
  orderId: string;
  status: OrderStatus;
  statusConfig: StatusBadgeConfig;
  onStatusChange: (id: string, status: OrderStatus) => void;
}

export const OrderDetailStatusUpdater: React.FC<OrderDetailStatusUpdaterProps> = ({
  orderId,
  status,
  statusConfig,
  onStatusChange,
}) => {
  const { t } = useTranslation(['orders']);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-stone-100/70 rounded-xl border border-stone-200">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-stone-500" />
        <label htmlFor="order-status-select" className="text-xs font-bold text-stone-800">
          {t('modal.changeStatus')}
        </label>
      </div>
      <select
        id="order-status-select"
        value={status}
        onChange={(e) =>
          onStatusChange(orderId, e.target.value as OrderStatus)
        }
        className={`text-xs font-bold py-1.5 px-3 rounded-lg border cursor-pointer focus:outline-hidden ${statusConfig.className}`}
      >
        <option value="PENDING">{t('status.selectPending')}</option>
        <option value="PREPARING">{t('status.selectPreparing')}</option>
        <option value="SHIPPED">{t('status.selectShipped')}</option>
        <option value="DELIVERED">{t('status.selectDelivered')}</option>
        <option value="CANCELLED">{t('status.selectCancelled')}</option>
      </select>
    </div>
  );
};
