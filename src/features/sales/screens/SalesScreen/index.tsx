import React from 'react';
import { Plus } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button, Pagination } from '@/components/ui';
import { SaleTable } from '@/features/sales/components/SaleTable';
import { DetailedSalesTable } from '@/features/sales/components/DetailedSalesTable';
import { SaleFormModal } from '@/features/sales/components/SaleFormModal';
import { SalesMetricsBar } from '@/features/sales/components/SalesMetricsBar';
import { SalesTabsHeader } from '@/features/sales/components/SalesTabsHeader';
import { SalesSearchBar } from '@/features/sales/components/SalesSearchBar';
import { useSalesList } from '@/features/sales/hooks/useSalesList';
import { useTranslation } from '@/locale';

export const SalesScreen: React.FC = () => {
  const { t } = useTranslation(['sales']);
  const { state, actions } = useSalesList();

  return (
    <div>
      <Header
        title={t('title')}
        subtitle={t('subtitle')}
        action={
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={actions.openCreateModal}
          >
            {t('newSale')}
          </Button>
        }
      />

      {/* Barra de Métricas */}
      <SalesMetricsBar
        totalRevenue={state.totalRevenue}
        totalItemsSold={state.totalItemsSold}
        averageTicket={state.averageTicket}
      />

      <section className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        {/* Pestañas: Resumen vs Ventas Detalladas */}
        <SalesTabsHeader
          activeTab={state.activeTab}
          onTabChange={actions.setActiveTab}
          summaryCount={state.sales.length}
          detailedCount={state.allDetailedRows.length}
        />

        {/* Buscador */}
        <SalesSearchBar
          searchQuery={state.searchQuery}
          onSearchChange={actions.setSearchQuery}
        />

        {/* Tablas según pestaña */}
        {state.activeTab === 'summary' ? (
          <SaleTable sales={state.paginatedSales} />
        ) : (
          <DetailedSalesTable rows={state.paginatedDetailedRows} />
        )}

        {/* Paginación */}
        {state.activeTab === 'summary' ? (
          <Pagination
            currentPage={state.salesPage}
            totalItems={state.filteredSales.length}
            pageSize={state.salesPageSize}
            pageSizeOptions={[10, 25, 50, 100]}
            onPageChange={actions.setSalesPage}
            onPageSizeChange={actions.handleSalesPageSizeChange}
          />
        ) : (
          <Pagination
            currentPage={state.detailedPage}
            totalItems={state.allDetailedRows.length}
            pageSize={state.detailedPageSize}
            pageSizeOptions={[10, 25, 50, 100]}
            onPageChange={actions.setDetailedPage}
            onPageSizeChange={actions.handleDetailedPageSizeChange}
          />
        )}
      </section>

      {/* Modal para crear venta */}
      <SaleFormModal />
    </div>
  );
};
