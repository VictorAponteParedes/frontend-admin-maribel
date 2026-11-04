import { useState, useEffect } from 'react';
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
    totalItems,
    isLoading,
    metrics,
    selectedOrder,
    isDetailModalOpen,
    openDetailModal,
    closeDetailModal,
    fetchOrders,
    fetchMetrics,
    updateOrderStatus,
  } = useOrdersStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Cargar métricas globales de órdenes al montar
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // Reiniciar a la primera página si cambia la búsqueda o el filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Cargar órdenes desde el backend con debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders({
        search: searchQuery.trim() || undefined,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        page: currentPage,
        limit: pageSize,
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, currentPage, pageSize, fetchOrders]);

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

  // Contadores para métricas y tabs tomados del backend
  const pendingCount = metrics.pendingCount;
  const preparingCount = metrics.preparingCount;
  const shippedCount = metrics.shippedCount;
  const deliveredCount = metrics.deliveredCount;
  const totalCount = metrics.totalCount;

  return {
    state: {
      searchQuery,
      statusFilter,
      currentPage,
      pageSize,
      isLoading,
      selectedOrder,
      isDetailModalOpen,
      totalCount,
      totalItems,
      pendingCount,
      preparingCount,
      shippedCount,
      deliveredCount,
      filteredOrders: orders,
      paginatedOrders: orders,
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
      refreshOrders: () => {
        fetchOrders({
          search: searchQuery.trim() || undefined,
          status: statusFilter === 'ALL' ? undefined : statusFilter,
          page: currentPage,
          limit: pageSize,
        });
        fetchMetrics();
      },
    },
  };
};
