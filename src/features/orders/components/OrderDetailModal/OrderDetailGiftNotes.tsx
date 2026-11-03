import React from 'react';
import { Gift } from 'lucide-react';
import { useTranslation } from '@/locale';

interface OrderDetailGiftNotesProps {
  notes?: string;
}

export const OrderDetailGiftNotes: React.FC<OrderDetailGiftNotesProps> = ({ notes }) => {
  const { t } = useTranslation(['orders']);

  if (!notes) return null;

  return (
    <div className="bg-rose-50 rounded-xl p-4 border border-rose-200 flex items-start gap-3">
      <div className="p-2 rounded-lg bg-rose-100 text-rose-700 shrink-0">
        <Gift className="w-4 h-4" />
      </div>
      <div className="text-xs">
        <h4 className="font-bold text-rose-900">{t('modal.giftNotesTitle')}</h4>
        <p className="text-rose-800 mt-1 italic leading-relaxed">
          &ldquo;{notes}&rdquo;
        </p>
      </div>
    </div>
  );
};
