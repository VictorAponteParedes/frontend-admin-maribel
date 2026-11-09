import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrdersStore } from '@/store/useOrdersStore';
import { useSalesStore } from '@/store/useSalesStore';
import { Order, OrderStatus } from '@/features/orders/types/order.types';
import { RoutesView } from '@/navigation/routes';
import { toast } from '@/store/useToastStore';

export const useOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedOrder, fetchOrderById, updateOrderStatus, isLoading } = useOrdersStore();
  const { openCreateModalFromOrder } = useSalesStore();

  const [order, setOrder] = useState<Order | null>(
    selectedOrder && selectedOrder.id === id ? selectedOrder : null
  );
  const [isFetching, setIsFetching] = useState(!order);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    setIsFetching(true);

    fetchOrderById(id).then((fetched) => {
      if (isMounted) {
        setOrder(fetched);
        setIsFetching(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id, fetchOrderById]);

  const handleBackToOrders = useCallback(() => {
    navigate(RoutesView.ORDERS);
  }, [navigate]);

  const handleStatusChange = useCallback(
    async (newStatus: OrderStatus) => {
      if (!id || !order) return;
      await updateOrderStatus(id, newStatus);
      setOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      toast.success('Estado actualizado', `El pedido se cambió a "${newStatus}"`);
    },
    [id, order, updateOrderStatus]
  );

  const handleProcessSale = useCallback(() => {
    if (!order) return;

    if (order.status === 'DELIVERED' || order.paymentStatus === 'PAID') {
      toast.warning(
        'Pedido ya facturado',
        `El pedido #${order.orderNumber} ya fue procesado y cobrado. No se permite duplicar la venta.`
      );
      return;
    }

    openCreateModalFromOrder({
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerAddress: order.location?.address || order.location?.reference,
      items: order.items.map((item) => ({
        barcode: item.barcode,
        brand: item.brand,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      })),
    });
    navigate(RoutesView.SALES);
  }, [order, openCreateModalFromOrder, navigate]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return {
    id,
    order,
    isLoading: isFetching || isLoading,
    actions: {
      handleBackToOrders,
      handleStatusChange,
      handleProcessSale,
      handlePrint,
    },
  };
};
