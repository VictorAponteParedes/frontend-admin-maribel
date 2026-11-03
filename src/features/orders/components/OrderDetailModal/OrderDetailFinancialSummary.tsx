import React from 'react';
import { PaymentMethod } from '@/features/orders/types/order.types';
import { getPaymentMethodLabel } from '@/features/orders/utils/order.utils';
import { formatCurrency } from '@/utils/formatters';
import { useTranslation } from '@/locale';

interface OrderDetailFinancialSummaryProps {
  paymentMethod: PaymentMethod;
  paymentStatus: 'PAID' | 'PENDING';
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export const OrderDetailFinancialSummary: React.FC<OrderDetailFinancialSummaryProps> = ({
  paymentMethod,
  paymentStatus,
  subtotal,
  deliveryFee,
  total,
}) => {
  const { t } = useTranslation(['orders']);

  return (
    <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="text-xs space-y-1">
        <p className="text-stone-600">
          {t('modal.paymentMethod')}{' '}
          <strong className="text-stone-800">
            {getPaymentMethodLabel(paymentMethod, t)}
          </strong>
        </p>
        <p className="text-stone-600">
          {t('modal.paymentStatus')}{' '}
          <span
            className={`font-semibold ${
              paymentStatus === 'PAID'
                ? 'text-emerald-700'
                : 'text-amber-700'
            }`}
          >
            {paymentStatus === 'PAID'
              ? t('payment.paid')
              : t('payment.pendingOnDelivery')}
          </span>
        </p>
      </div>

      <div className="w-full sm:w-auto text-right space-y-1 text-xs">
        <div className="flex justify-between sm:justify-end gap-6 text-stone-500">
          <span>{t('modal.subtotalProducts')}</span>
          <span className="font-mono">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between sm:justify-end gap-6 text-stone-500">
          <span>{t('modal.deliveryFee')}</span>
          <span className="font-mono">
            {deliveryFee > 0
              ? formatCurrency(deliveryFee)
              : t('modal.freeDelivery')}
          </span>
        </div>
        <div className="flex justify-between sm:justify-end gap-6 text-sm font-bold text-stone-900 pt-1 border-t border-stone-200">
          <span>{t('modal.totalToCollect')}</span>
          <span className="text-maribel-700 font-mono text-base">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  );
};
