import React from 'react';
import { Clock, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { StatusBadgeConfig } from '@/features/orders/utils/order.utils';
import { useTranslation } from '@/locale';

interface OrderDetailModalHeaderProps {
  orderNumber: string;
  orderDate: string;
  statusConfig: StatusBadgeConfig;
  onClose: () => void;
}

export const OrderDetailModalHeader: React.FC<OrderDetailModalHeaderProps> = ({
  orderNumber,
  orderDate,
  statusConfig,
  onClose,
}) => {
  const { t } = useTranslation(['orders']);

  return (
    <div className="p-5 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-maribel-100 text-maribel-700 flex items-center justify-center font-bold font-mono">
          📦
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-stone-900 font-mono">
              #{orderNumber}
            </h3>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusConfig.className}`}
            >
              {statusConfig.label}
            </span>
          </div>
          <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            {t('modal.orderDate')}{' '}
            <strong className="text-stone-700 font-medium">{orderDate}</strong>
          </p>
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="xs"
        onClick={onClose}
        aria-label="Cerrar modal"
      >
        <X className="w-5 h-5" />
      </Button>
    </div>
  );
};
