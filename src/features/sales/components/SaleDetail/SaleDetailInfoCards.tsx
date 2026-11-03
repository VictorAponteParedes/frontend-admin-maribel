import React from 'react';
import { Calendar, Clock, User, Phone, MapPin } from 'lucide-react';
import { useTranslation } from '@/locale';

interface SaleDetailInfoCardsProps {
  date: string;
  time: string;
  customerName: string;
  customerCode?: string;
  customerPhone?: string;
  customerAddress?: string;
}

export const SaleDetailInfoCards: React.FC<SaleDetailInfoCardsProps> = ({
  date,
  time,
  customerName,
  customerCode,
  customerPhone,
  customerAddress,
}) => {
  const { t } = useTranslation(['sales']);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Tarjeta Fecha y Hora */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-maribel-700" />
          <span>{t('detail.confirmationDateTime')}</span>
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
            <div className="flex items-center space-x-2 text-xs text-stone-700 font-medium">
              <Calendar className="w-4 h-4 text-stone-400" />
              <span>{t('detail.saleDate')}</span>
            </div>
            <span className="text-xs font-mono font-bold text-stone-900">
              {date}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
            <div className="flex items-center space-x-2 text-xs text-stone-700 font-medium">
              <Clock className="w-4 h-4 text-stone-400" />
              <span>{t('detail.confirmationTime')}</span>
            </div>
            <span className="text-xs font-mono font-bold text-stone-900">
              {time}
            </span>
          </div>
        </div>
      </div>

      {/* Tarjeta Cliente Asociado */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center space-x-2">
          <User className="w-4 h-4 text-maribel-700" />
          <span>{t('detail.associatedCustomer')}</span>
        </h3>

        <div className="p-3.5 bg-stone-50 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-900">
              {customerName}
            </span>
            {customerCode && (
              <span className="text-[11px] font-mono px-2 py-0.5 bg-stone-200 text-stone-800 rounded-md font-semibold">
                {t('codeTag', { code: customerCode })}
              </span>
            )}
          </div>

          {customerPhone && (
            <div className="flex items-center space-x-2 text-xs text-stone-600">
              <Phone className="w-3.5 h-3.5 text-stone-400" />
              <span>{customerPhone}</span>
            </div>
          )}

          {customerAddress && (
            <div className="flex items-center space-x-2 text-xs text-stone-600">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span>{customerAddress}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
