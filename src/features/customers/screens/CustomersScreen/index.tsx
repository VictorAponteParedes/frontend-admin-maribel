import React from 'react';
import { UserPlus, Filter } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui';
import { Pagination } from '@/componentes';
import { CustomerSearchBar } from '../../components/CustomerSearchBar';
import { CustomerTable } from '../../components/CustomerTable';
import { CustomerFormModal } from '../../components/CustomerFormModal';
import { CustomerFilterDrawer } from '../../components/CustomerFilterDrawer';
import { useCustomersList } from '../../hooks/useCustomersList';
import { useTranslation } from '@/locale';

export const CustomersScreen: React.FC = () => {
  const { t } = useTranslation(['customers', 'translation']);
  const {
    searchQuery,
    setSearchQuery,
    isModalOpen,
    isFilterDrawerOpen,
    filters,
    activeFiltersCount,
    pagination,
    actions,
  } = useCustomersList();

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
              leftIcon={<Filter className="w-4 h-4 text-stone-600" />}
              onClick={actions.openFilterDrawer}
            >
              Filtros
              {activeFiltersCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-maribel-700 text-white rounded-full text-[10px] font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            <Button
              variant="primary"
              size="sm"
              leftIcon={<UserPlus className="w-4 h-4" />}
              onClick={actions.openModal}
            >
              {t('newCustomer')}
            </Button>
          </div>
        }
      />

      <section className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <CustomerSearchBar
          searchQuery={searchQuery}
          totalCount={pagination.totalItems}
          onSearchChange={setSearchQuery}
        />

        <CustomerTable customers={pagination.items} />

        <Pagination
          currentPage={pagination.currentPage}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          pageSizeOptions={[10, 25, 50, 100]}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
        />
      </section>

      <CustomerFormModal
        isOpen={isModalOpen}
        onClose={actions.closeModal}
        onSubmitCustomer={actions.handleCreateCustomer}
      />

      <CustomerFilterDrawer
        isOpen={isFilterDrawerOpen}
        filters={filters}
        onClose={actions.closeFilterDrawer}
        onChangeFilter={actions.handleChangeFilter}
        onResetFilters={actions.handleResetFilters}
        onApplyFilters={actions.closeFilterDrawer}
        totalResultsCount={pagination.totalItems}
      />
    </div>
  );
};
