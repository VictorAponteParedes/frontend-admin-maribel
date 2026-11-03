import React from 'react';
import { UserPlus } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui';
import { Pagination } from '@/componentes';
import { CustomerSearchBar } from '../../components/CustomerSearchBar';
import { CustomerTable } from '../../components/CustomerTable';
import { CustomerFormModal } from '../../components/CustomerFormModal';
import { useCustomersList } from '../../hooks/useCustomersList';
import { useTranslation } from '@/locale';

export const CustomersScreen: React.FC = () => {
  const { t } = useTranslation(['customers', 'translation']);
  const { searchQuery, setSearchQuery, isModalOpen, pagination, actions } = useCustomersList();

  return (
    <div>
      <Header
        title={t('title')}
        subtitle={t('subtitle')}
        action={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<UserPlus className="w-4 h-4" />}
            onClick={actions.openModal}
          >
            {t('newCustomer')}
          </Button>
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
    </div>
  );
};
