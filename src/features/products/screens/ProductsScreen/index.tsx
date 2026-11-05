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
import { PackagePlus, FileSpreadsheet } from 'lucide-react';

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

      <ProductsMetricsBar metrics={metrics} />

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
