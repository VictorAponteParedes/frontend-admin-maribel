import React from 'react';
import { Printer, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { Order } from '@/features/orders/types/order.types';
import { useTranslation } from '@/locale';

interface OrderDetailModalFooterProps {
  order: Order;
  onClose: () => void;
  onProcessSale?: (order: Order) => void;
}

export const OrderDetailModalFooter: React.FC<OrderDetailModalFooterProps> = ({
  order,
  onClose,
  onProcessSale,
}) => {
  const { t } = useTranslation(['orders']);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={handlePrint}
      >
        <Printer className="w-4 h-4 text-stone-500" />
        <span>{t('modal.printTicket')}</span>
      </Button>

      <div className="flex items-center gap-2">
        {(() => {
          const isBilled =
            order.status === 'DELIVERED' || order.paymentStatus === 'PAID';

          if (isBilled) {
            return (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pedido Facturado y Cobrado</span>
              </span>
            );
          }

          if (onProcessSale) {
            return (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => {
                  onClose();
                  onProcessSale(order);
                }}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Facturar / Llevar a Venta</span>
              </Button>
            );
          }

          return null;
        })()}

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onClose}
        >
          {t('modal.close')}
        </Button>
      </div>
    </div>
  );
};
