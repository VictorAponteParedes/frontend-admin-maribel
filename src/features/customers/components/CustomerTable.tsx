import React from 'react';
import { MapPin, ExternalLink, MessageCircle } from 'lucide-react';
import { useTranslation } from '@/locale';
import { Customer } from '../types/customer.types';
import { isValidPhoneNumber, buildCustomerWhatsAppUrl } from '../utils/customer.utils';

export interface CustomerTableProps {
  customers: Customer[];
}

export const CustomerTable: React.FC<CustomerTableProps> = ({ customers }) => {
  const { t } = useTranslation(['customers', 'translation']);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] border-b border-stone-200">
          <tr>
            <th className="px-5 py-3.5 text-center">{t('table.code')}</th>
            <th className="px-4 py-3.5">{t('table.registrationDate')}</th>
            <th className="px-5 py-3.5">{t('table.name')}</th>
            <th className="px-5 py-3.5">{t('table.phone')}</th>
            <th className="px-5 py-3.5">{t('table.address')}</th>
            <th className="px-4 py-3.5 text-center">{t('table.gpsLocation')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {customers.map((customer) => {
            const hasValidPhone =
              customer.phone !== 'Sin teléfono' && isValidPhoneNumber(customer.phone);
            const whatsAppUrl = hasValidPhone
              ? buildCustomerWhatsAppUrl(customer.phone)
              : '';

            return (
              <tr key={customer.id} className="hover:bg-stone-50/70 transition-colors">
                <td className="px-5 py-3.5 text-center font-mono font-bold text-stone-900 whitespace-nowrap">
                  <span className="inline-block px-2 py-0.5 bg-stone-100 rounded-md">
                    {customer.code}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-stone-500 whitespace-nowrap font-mono text-[11px]">
                  {customer.registrationDate}
                </td>
                <td className="px-5 py-3.5 font-semibold text-stone-900">{customer.name}</td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  {hasValidPhone ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-stone-700 font-mono text-[11px]">
                        {customer.phone}
                      </span>
                      <a
                        href={whatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                        title={t('sendWhatsAppTooltip')}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ) : (
                    <span className="text-stone-400 italic text-[11px]">
                      {customer.phone === 'Sin teléfono' ? t('noPhone') : customer.phone}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-stone-600">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{customer.address}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                  {customer.gpsUrl && customer.gpsUrl !== '0' ? (
                    <a
                      href={customer.gpsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-2.5 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg text-xs font-medium transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>{t('viewMap')}</span>
                    </a>
                  ) : (
                    <span className="text-stone-300 text-xs">-</span>
                  )}
                </td>
              </tr>
            );
          })}

          {customers.length === 0 && (
            <tr>
              <td colSpan={6} className="px-5 py-8 text-center text-stone-400">
                {t('table.noResults')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
