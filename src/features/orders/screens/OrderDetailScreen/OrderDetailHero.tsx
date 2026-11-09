import React from 'react';
import { ShoppingBag, Calendar } from 'lucide-react';
import { Order, OrderStatus } from '@/features/orders/types/order.types';
import { getOrderStatusConfig } from '@/features/orders/utils/order.utils';
import { formatCurrency } from '@/utils/formatters';
import { useTranslation } from '@/locale';

interface OrderDetailHeroProps {
  order: Order;
  onStatusChange: (status: OrderStatus) => void;
}

export const OrderDetailHero: React.FC<OrderDetailHeroProps> = ({
  order,
  onStatusChange,
}) => {
  const { t } = useTranslation(['orders']);
  const statusConfig = getOrderStatusConfig(order.status, t);

  return (
    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-start sm:items-center gap-4">
        <div className="p-3.5 bg-rose-50 text-maribel-700 rounded-2xl shrink-0">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif font-bold text-stone-900 text-2xl tracking-tight">
              #{order.orderNumber}
            </h1>
            <select
              value={order.status}
              onChange={(e) => onStatusChange(e.target.value as OrderStatus)}
              className={`text-xs font-semibold py-1 px-3 rounded-xl border focus:outline-hidden cursor-pointer transition-colors shadow-2xs ${statusConfig.className}`}
            >
              <option value="PENDING">{t('status.selectPending')}</option>
              <option value="PREPARING">{t('status.selectPreparing')}</option>
              <option value="SHIPPED">{t('status.selectShipped')}</option>
              <option value="DELIVERED">{t('status.selectDelivered')}</option>
              <option value="CANCELLED">{t('status.selectCancelled')}</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>{t('modal.orderDate')} {order.date}</span>
            </span>
            <span>•</span>
            <span className="font-medium text-stone-600">{t('detail.channelWeb')}</span>
          </div>
        </div>
      </div>

      <div className="md:text-right border-t md:border-t-0 pt-4 md:pt-0 border-stone-100 flex flex-col md:items-end">
        <span className="text-xs font-medium text-stone-500 block">
          {t('table.total')}
        </span>
        <p className="text-2xl sm:text-3xl font-bold font-serif text-maribel-800 tracking-tight">
          {formatCurrency(order.total)}
        </p>
        <span
          className={`text-[11px] font-semibold mt-0.5 ${
            order.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-amber-700'
          }`}
        >
          {order.paymentStatus === 'PAID' ? t('payment.paid') : t('payment.pending')}
        </span>
      </div>
    </div>
  );
};
