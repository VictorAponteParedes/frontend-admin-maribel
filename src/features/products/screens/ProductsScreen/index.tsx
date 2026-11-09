import React from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui';
import { Pagination } from '@/componentes';
import { ProductTable } from '../../components/ProductTable';
import { ProductFormModal } from '../../components/ProductFormModal';
import { BulkImportModal } from '../../components/BulkImportModal';
import { StockEntryTable } from '../../components/StockEntryTable';
import { ProductsMetricsBar } from '../../components/ProductsMetricsBar';
import { ProductsTabsHeader } from '../../components/ProductsTabsHeader';
import { ProductsFilterBar } from '../../components/ProductsFilterBar';
import { useProductsList } from '../../hooks/useProductsList';
import { useTranslation } from '@/locale';
import { PackagePlus, FileSpreadsheet, AlertTriangle } from 'lucide-react';

export const ProductsScreen: React.FC = () => {
  const { t } = useTranslation(['inventory', 'translation']);
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filterLowStock,
    isProductModalOpen,
    isBulkImportModalOpen,
    metrics,
    stockPagination,
    entriesPagination,
    actions,
  } = useProductsList();

  const isStockTab = activeTab === 'stock';
  const currentPagination = isStockTab ? stockPagination : entriesPagination;

  return (
    <div>
      <Header
        title={t('title')}
        subtitle={t('subtitle')}
        action={
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
              onClick={actions.openBulkImportModal}
            >
              Importar Excel
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<PackagePlus className="w-4 h-4" />}
              onClick={actions.handleNavigateToStockEntry}
            >
              {t('newEntry')}
            </Button>
          </div>
        }
      />

      <ProductsMetricsBar
        metrics={metrics}
        onClickCritical={actions.toggleFilterLowStock}
      />

      {metrics.lowStockCount > 0 && (
        <div
          className={`mb-5 p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            metrics.outOfStockCount > 0
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                metrics.outOfStockCount > 0
                  ? 'bg-rose-600 text-white'
                  : 'bg-amber-500 text-white'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold">
                {metrics.outOfStockCount > 0
                  ? `¡Atención! Tienes ${metrics.outOfStockCount} producto(s) agotado(s) en 0 unidades`
                  : `Alerta de inventario: ${metrics.lowStockCount} producto(s) con stock crítico (≤ ${metrics.lowStockThreshold} uds)`}
              </p>
              <p className="text-[11px] opacity-85 mt-0.5">
                {(metrics.outOfStockCount > 0
                  ? metrics.outOfStockProducts
                  : metrics.lowStockProducts
                )
                  .slice(0, 4)
                  .map((p) => `${p.brand} ${p.name} (${p.stock} uds)`)
                  .join(' · ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="secondary"
              size="xs"
              onClick={actions.toggleFilterLowStock}
            >
              {filterLowStock ? 'Ver todos' : 'Filtrar críticos'}
            </Button>
          </div>
        </div>
      )}

      <section className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <ProductsTabsHeader
          activeTab={activeTab}
          productsCount={metrics.totalCatalogCount}
          entriesCount={entriesPagination.totalItems}
          totalEntriesUnits={metrics.totalEntriesUnits}
          onTabChange={setActiveTab}
        />

        <ProductsFilterBar
          activeTab={activeTab}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          filterLowStock={filterLowStock}
          lowStockCount={metrics.lowStockCount}
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          onToggleLowStock={actions.toggleFilterLowStock}
        />

        {isStockTab ? (
          <ProductTable products={stockPagination.items} />
        ) : (
          <StockEntryTable entries={entriesPagination.items} />
        )}

        <Pagination
          currentPage={currentPagination.currentPage}
          totalItems={currentPagination.totalItems}
          pageSize={currentPagination.pageSize}
          pageSizeOptions={[10, 25, 50, 100]}
          onPageChange={currentPagination.onPageChange}
          onPageSizeChange={currentPagination.onPageSizeChange}
        />
      </section>

      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={actions.closeProductModal}
        onSubmitProduct={actions.handleCreateProduct}
      />

      <BulkImportModal
        isOpen={isBulkImportModalOpen}
        onClose={actions.closeBulkImportModal}
      />
    </div>
  );
};
