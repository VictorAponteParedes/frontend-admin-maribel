import React from 'react';
import { User, MessageCircle } from 'lucide-react';
import { useTranslation } from '@/locale';

interface OrderDetailCustomerCardProps {
  customerName: string;
  customerPhone: string;
  waLink: string;
}

export const OrderDetailCustomerCard: React.FC<OrderDetailCustomerCardProps> = ({
  customerName,
  customerPhone,
  waLink,
}) => {
  const { t } = useTranslation(['orders']);

  return (
    <div className="bg-stone-50/70 rounded-xl p-4 border border-stone-200 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
          <User className="w-3.5 h-3.5" /> {t('modal.customerData')}
        </span>
      </div>
      <div>
        <p className="text-sm font-bold text-stone-900">{customerName}</p>
        <p className="text-xs text-stone-500 mt-0.5">
          WhatsApp:{' '}
          <span className="font-mono font-medium text-stone-700">
            {customerPhone}
          </span>
        </p>
      </div>

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        <span>{t('modal.chatWhatsApp')}</span>
      </a>
    </div>
  );
};
