import React from 'react';
import { Order, OrderStatus } from '@/features/orders/types/order.types';
import {
  buildWhatsAppLink,
  getOrderStatusConfig,
} from '@/features/orders/utils/order.utils';
import { useTranslation } from '@/locale';
import { OrderDetailModalHeader } from './OrderDetailModalHeader';
import { OrderDetailCustomerCard } from './OrderDetailCustomerCard';
import { OrderDetailDeliveryCard } from './OrderDetailDeliveryCard';
import { OrderDetailGpsCard } from './OrderDetailGpsCard';
import { OrderDetailGiftNotes } from './OrderDetailGiftNotes';
import { OrderDetailProductsTable } from './OrderDetailProductsTable';
import { OrderDetailFinancialSummary } from './OrderDetailFinancialSummary';
import { OrderDetailStatusUpdater } from './OrderDetailStatusUpdater';
import { OrderDetailModalFooter } from './OrderDetailModalFooter';

export interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
  onProcessSale?: (order: Order) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  onStatusChange,
  onProcessSale,
}) => {
  const { t } = useTranslation(['orders']);

  if (!isOpen || !order) return null;

  const statusConfig = getOrderStatusConfig(order.status, t);
  const waLink = buildWhatsAppLink(
    order.customerPhone,
    order.customerName,
    order.orderNumber,
    order.total
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        <OrderDetailModalHeader
          orderNumber={order.orderNumber}
          orderDate={order.date}
          statusConfig={statusConfig}
          onClose={onClose}
        />

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <OrderDetailCustomerCard
              customerName={order.customerName}
              customerPhone={order.customerPhone}
              waLink={waLink}
            />

            <OrderDetailDeliveryCard
              deliveryType={order.deliveryType}
              location={order.location}
            />
          </div>

          {order.deliveryType === 'DELIVERY' && order.location && (
            <OrderDetailGpsCard location={order.location} />
          )}

          <OrderDetailGiftNotes notes={order.notes} />

          <OrderDetailProductsTable
            items={order.items}
            totalQuantity={order.totalQuantity}
          />

          <OrderDetailFinancialSummary
            paymentMethod={order.paymentMethod}
            paymentStatus={order.paymentStatus}
            subtotal={order.subtotal}
            deliveryFee={order.deliveryFee}
            total={order.total}
          />

          <OrderDetailStatusUpdater
            orderId={order.id}
            status={order.status}
            statusConfig={statusConfig}
            onStatusChange={onStatusChange}
          />
        </div>

        <OrderDetailModalFooter
          order={order}
          onClose={onClose}
          onProcessSale={onProcessSale}
        />
      </div>
    </div>
  );
};
