import React from 'react';
import { Truck, Store } from 'lucide-react';
import { OrderLocation } from '@/features/orders/types/order.types';
import { useTranslation } from '@/locale';

interface OrderDetailDeliveryCardProps {
  deliveryType: 'DELIVERY' | 'PICKUP';
  location?: OrderLocation;
}

export const OrderDetailDeliveryCard: React.FC<OrderDetailDeliveryCardProps> = ({
  deliveryType,
  location,
}) => {
  const { t } = useTranslation(['orders']);

  return (
    <div className="bg-stone-50/70 rounded-xl p-4 border border-stone-200 space-y-3">
      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
        {deliveryType === 'DELIVERY' ? (
          <Truck className="w-3.5 h-3.5 text-sky-600" />
        ) : (
          <Store className="w-3.5 h-3.5 text-amber-600" />
        )}
        {t('modal.deliveryMode')}
      </span>

      <div>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
            deliveryType === 'DELIVERY'
              ? 'bg-sky-100 text-sky-800'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {deliveryType === 'DELIVERY'
            ? t('delivery.homeDeliveryLong')
            : t('delivery.pickupStoreLong')}
        </span>
      </div>

      {deliveryType === 'DELIVERY' && location ? (
        <div className="space-y-1.5 text-xs text-stone-600">
          <p>
            <strong className="text-stone-800">{t('modal.address')}</strong>{' '}
            {location.address || t('modal.noAddress')}
          </p>
          {location.reference && (
            <p className="text-stone-500 italic">
              <strong className="text-stone-700 not-italic">
                {t('modal.reference')}
              </strong>{' '}
              {location.reference}
            </p>
          )}
          {location.city && (
            <p>
              <strong className="text-stone-800">{t('modal.city')}</strong>{' '}
              {location.city}
            </p>
          )}
        </div>
      ) : (
        <p className="text-xs text-stone-500">{t('delivery.pickupNote')}</p>
      )}
    </div>
  );
};
