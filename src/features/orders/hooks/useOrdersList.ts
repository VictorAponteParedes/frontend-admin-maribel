import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrdersStore } from '@/store/useOrdersStore';
import { useSalesStore } from '@/store/useSalesStore';
import { Order, OrderStatus } from '@/features/orders/types/order.types';
import { RoutesView } from '@/navigation/routes';

export const useOrdersList = () => {
  const navigate = useNavigate();
  const { openCreateModalFromOrder } = useSalesStore();
  const {
    orders,
    selectedOrder,
    isDetailModalOpen,
    openDetailModal,
    closeDetailModal,
    updateOrderStatus,
  } = useOrdersStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | OrderStatus>('ALL');

  // Paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Reiniciar a la primera página si cambia la búsqueda o el filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const handleProcessSale = (order: Order) => {
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
  };

  // Contadores para métricas y tabs
  const pendingCount = useMemo(
    () => orders.filter((o) => o.status === 'PENDING').length,
    [orders]
  );
  const preparingCount = useMemo(
    () => orders.filter((o) => o.status === 'PREPARING').length,
    [orders]
  );
  const shippedCount = useMemo(
    () => orders.filter((o) => o.status === 'SHIPPED').length,
    [orders]
  );
  const deliveredCount = useMemo(
    () => orders.filter((o) => o.status === 'DELIVERED').length,
    [orders]
  );
  const totalCount = orders.length;

  // Filtrado
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (statusFilter !== 'ALL' && order.status !== statusFilter) {
        return false;
      }

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchNumber = order.orderNumber.toLowerCase().includes(q);
      const matchCustomer = order.customerName.toLowerCase().includes(q);
      const matchPhone = order.customerPhone.includes(q);
      const matchAddress = order.location?.address?.toLowerCase().includes(q) || false;
      const matchItem = order.items.some(
        (it) =>
          it.name.toLowerCase().includes(q) ||
          it.brand.toLowerCase().includes(q) ||
          it.barcode.includes(q)
      );

      return matchNumber || matchCustomer || matchPhone || matchAddress || matchItem;
    });
  }, [orders, statusFilter, searchQuery]);

  // Paginado
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  return {
    state: {
      searchQuery,
      statusFilter,
      currentPage,
      pageSize,
      selectedOrder,
      isDetailModalOpen,
      totalCount,
      pendingCount,
      preparingCount,
      shippedCount,
      deliveredCount,
      filteredOrders,
      paginatedOrders,
    },
    actions: {
      setSearchQuery,
      setStatusFilter,
      setCurrentPage,
      setPageSize,
      openDetailModal,
      closeDetailModal,
      updateOrderStatus,
      handleProcessSale,
    },
  };
};
