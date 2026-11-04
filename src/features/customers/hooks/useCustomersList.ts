import { useState, useEffect, useMemo, useCallback } from 'react';
import { useCustomerStore } from '@/store/useCustomerStore';
import { toast } from '@/store/useToastStore';
import { CustomerFormData } from '../types/customer.types';
import { CustomerFiltersState } from '../components/CustomerFilterDrawer';

const INITIAL_FILTERS: CustomerFiltersState = {
  code: '',
  name: '',
  phone: '',
  startDate: '',
  endDate: '',
};

export const useCustomersList = () => {
  const { customers, totalItems, addCustomer, fetchCustomers, isLoading } =
    useCustomerStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<CustomerFiltersState>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Reiniciar a la primera página si cambia la búsqueda o los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  // Carga y filtrado directamente desde el backend (con debounce para no saturar peticiones)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers({
        search: searchQuery.trim() || undefined,
        code: filters.code.trim() ? Number(filters.code) : undefined,
        name: filters.name.trim() || undefined,
        phone: filters.phone.trim() || undefined,
        startDate: filters.startDate.trim() || undefined,
        endDate: filters.endDate.trim() || undefined,
        page: currentPage,
        limit: pageSize,
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, filters, currentPage, pageSize, fetchCustomers]);

  const handleChangeFilter = useCallback(
    (key: keyof CustomerFiltersState, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleResetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter((val) => Boolean(val && val.trim()))
      .length;
  }, [filters]);

  const handleCreateCustomer = async (data: CustomerFormData) => {
    try {
      await addCustomer(data);
      toast.success(
        'Cliente registrado',
        `${data.name} fue guardado correctamente.`,
      );
    } catch {
      toast.error(
        'Error al registrar',
        'No se pudo guardar el cliente en el servidor.',
      );
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return {
    searchQuery,
    setSearchQuery,
    isModalOpen,
    isFilterDrawerOpen,
    filters,
    activeFiltersCount,
    isLoading,
    pagination: {
      currentPage,
      pageSize,
      totalItems,
      items: customers,
      onPageChange: setCurrentPage,
      onPageSizeChange: handlePageSizeChange,
    },
    actions: {
      handleCreateCustomer,
      openModal: () => setIsModalOpen(true),
      closeModal: () => setIsModalOpen(false),
      openFilterDrawer: () => setIsFilterDrawerOpen(true),
      closeFilterDrawer: () => setIsFilterDrawerOpen(false),
      handleChangeFilter,
      handleResetFilters,
      refreshCustomers: () =>
        fetchCustomers({
          search: searchQuery.trim() || undefined,
          code: filters.code.trim() ? Number(filters.code) : undefined,
          name: filters.name.trim() || undefined,
          phone: filters.phone.trim() || undefined,
          startDate: filters.startDate.trim() || undefined,
          endDate: filters.endDate.trim() || undefined,
          page: currentPage,
          limit: pageSize,
        }),
    },
  };
};
