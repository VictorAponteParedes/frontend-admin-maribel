import React from 'react';
import { Header } from '@/components/layout/Header';
import { Pagination } from '@/components/ui';
import { OrderTable } from '@/features/orders/components/OrderTable';
import { OrderDetailModal } from '@/features/orders/components/OrderDetailModal';
import { OrderMetricsGrid } from '@/features/orders/components/OrderMetricsGrid';
import { OrderStatusTabs } from '@/features/orders/components/OrderStatusTabs';
import { OrderSearchBar } from '@/features/orders/components/OrderSearchBar';
import { useOrdersList } from '@/features/orders/hooks/useOrdersList';
import { useTranslation } from '@/locale';

export const OrdersScreen: React.FC = () => {
  const { t } = useTranslation(['orders']);
  const { state, actions } = useOrdersList();

  return (
    <div className="space-y-6">
      <Header
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {/* Tarjetas de Métricas Rápidas */}
      <OrderMetricsGrid
        totalCount={state.totalCount}
        pendingCount={state.pendingCount}
        inProgressCount={state.preparingCount + state.shippedCount}
        deliveredCount={state.deliveredCount}
      />

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <OrderStatusTabs
          currentFilter={state.statusFilter}
          onFilterChange={actions.setStatusFilter}
          counts={{
            total: state.totalCount,
            pending: state.pendingCount,
            preparing: state.preparingCount,
            shipped: state.shippedCount,
            delivered: state.deliveredCount,
          }}
        />

        <OrderSearchBar
          searchQuery={state.searchQuery}
          onSearchChange={actions.setSearchQuery}
        />
      </div>

      {/* Tabla de Pedidos */}
      <OrderTable
        orders={state.paginatedOrders}
        onViewDetail={actions.openDetailModal}
        onStatusChange={actions.updateOrderStatus}
        onProcessSale={actions.handleProcessSale}
      />

      {/* Paginación */}
      {state.totalItems > 0 && (
        <Pagination
          currentPage={state.currentPage}
          pageSize={state.pageSize}
          totalItems={state.totalItems}
          onPageChange={actions.setCurrentPage}
          onPageSizeChange={(newSize: number) => {
            actions.setPageSize(newSize);
            actions.setCurrentPage(1);
          }}
          pageSizeOptions={[10, 25, 50]}
        />
      )}

      {/* Modal de Detalle */}
      <OrderDetailModal
        order={state.selectedOrder}
        isOpen={state.isDetailModalOpen}
        onClose={actions.closeDetailModal}
        onStatusChange={actions.updateOrderStatus}
        onProcessSale={actions.handleProcessSale}
      />
    </div>
  );
};
