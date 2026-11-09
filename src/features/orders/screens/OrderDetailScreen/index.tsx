import React from 'react';
import { useOrderDetail } from '@/features/orders/hooks/useOrderDetail';
import { OrderDetailHeaderNav } from './OrderDetailHeaderNav';
import { OrderDetailHero } from './OrderDetailHero';
import { OrderDetailNotFound } from './OrderDetailNotFound';
import { OrderDetailCustomerCard } from '@/features/orders/components/OrderDetailModal/OrderDetailCustomerCard';
import { OrderDetailDeliveryCard } from '@/features/orders/components/OrderDetailModal/OrderDetailDeliveryCard';
import { OrderDetailGpsCard } from '@/features/orders/components/OrderDetailModal/OrderDetailGpsCard';
import { OrderDetailGiftNotes } from '@/features/orders/components/OrderDetailModal/OrderDetailGiftNotes';
import { OrderDetailProductsTable } from '@/features/orders/components/OrderDetailModal/OrderDetailProductsTable';
import { OrderDetailFinancialSummary } from '@/features/orders/components/OrderDetailModal/OrderDetailFinancialSummary';
import { buildWhatsAppLink } from '@/features/orders/utils/order.utils';
import { LoadingSpinner } from '@/components/ui';

export const OrderDetailScreen: React.FC = () => {
  const { id, order, isLoading, actions } = useOrderDetail();

  if (isLoading && !order) {
    return (
      <div className="py-24 flex items-center justify-center">
        <LoadingSpinner message="Cargando información del pedido..." />
      </div>
    );
  }

  if (!order) {
    return <OrderDetailNotFound id={id} onBack={actions.handleBackToOrders} />;
  }

  const waLink = buildWhatsAppLink(
    order.customerPhone,
    order.customerName,
    order.orderNumber,
    order.total
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <OrderDetailHeaderNav
        order={order}
        onPrint={actions.handlePrint}
        onProcessSale={actions.handleProcessSale}
      />

      <OrderDetailHero
        order={order}
        onStatusChange={actions.handleStatusChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

      {order.notes && <OrderDetailGiftNotes notes={order.notes} />}

      <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-6">
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
      </div>
    </div>
  );
};

export default OrderDetailScreen;
