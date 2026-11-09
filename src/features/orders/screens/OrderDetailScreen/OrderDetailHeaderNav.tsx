import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Printer, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { Order } from '@/features/orders/types/order.types';
import { RoutesView } from '@/navigation/routes';
import { useTranslation } from '@/locale';

interface OrderDetailHeaderNavProps {
  order: Order;
  onPrint: () => void;
  onProcessSale: () => void;
}

export const OrderDetailHeaderNav: React.FC<OrderDetailHeaderNavProps> = ({
  order,
  onPrint,
  onProcessSale,
}) => {
  const { t } = useTranslation(['orders']);
  const isBilled = order.status === 'DELIVERED' || order.paymentStatus === 'PAID';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <Link
        to={RoutesView.ORDERS}
        className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('detail.backToOrders')}</span>
      </Link>

      <div className="flex flex-wrap items-center gap-2.5">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onPrint}
        >
          <Printer className="w-4 h-4 text-stone-500" />
          <span>{t('detail.printTicket')}</span>
        </Button>

        {isBilled ? (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs select-none">
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('detail.orderBilled')}</span>
          </span>
        ) : (
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onProcessSale}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{t('detail.processSale')}</span>
          </Button>
        )}
      </div>
    </div>
  );
};
