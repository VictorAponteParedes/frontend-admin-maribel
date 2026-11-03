import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { OrderLocation } from '@/features/orders/types/order.types';
import { buildGoogleMapsLink } from '@/features/orders/utils/order.utils';
import { useTranslation } from '@/locale';

interface OrderDetailGpsCardProps {
  location: OrderLocation;
}

export const OrderDetailGpsCard: React.FC<OrderDetailGpsCardProps> = ({ location }) => {
  const { t } = useTranslation(['orders']);

  return (
    <div className="bg-maribel-50/50 rounded-xl p-4 border border-maribel-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-maribel-100 text-maribel-700 shrink-0">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-stone-900">{t('modal.gpsTitle')}</h4>
          <p className="text-xs font-mono text-stone-600 mt-0.5">
            {t('modal.latitude')}{' '}
            <span className="font-semibold text-maribel-900">
              {location.latitude}
            </span>{' '}
            | {t('modal.longitude')}{' '}
            <span className="font-semibold text-maribel-900">
              {location.longitude}
            </span>
          </p>
          <p className="text-[11px] text-stone-500 mt-0.5">{t('modal.gpsDesc')}</p>
        </div>
      </div>

      <a
        href={buildGoogleMapsLink(location.latitude, location.longitude)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-maribel-700 hover:bg-maribel-800 shadow-xs transition-colors shrink-0"
      >
        <span>{t('table.openMaps')}</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
};
