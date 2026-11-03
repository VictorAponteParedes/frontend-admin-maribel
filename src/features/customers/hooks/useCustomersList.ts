import { useState, useEffect, useMemo } from 'react';
import { useCustomerStore } from '@/store/useCustomerStore';
import { Customer, CustomerFormData } from '../types/customer.types';

export const useCustomersList = () => {
  const { customers, addCustomer } = useCustomerStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Reiniciar a la primera página si cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredCustomers = useMemo<Customer[]>(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return customers;

    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        String(c.code).includes(q) ||
        c.phone.includes(q) ||
        c.address.toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  const paginatedCustomers = useMemo<Customer[]>(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, currentPage, pageSize]);

  const handleCreateCustomer = (data: CustomerFormData) => {
    addCustomer(data);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return {
    searchQuery,
    setSearchQuery,
    isModalOpen,
    pagination: {
      currentPage,
      pageSize,
      totalItems: filteredCustomers.length,
      items: paginatedCustomers,
      onPageChange: setCurrentPage,
      onPageSizeChange: handlePageSizeChange,
    },
    actions: {
      handleCreateCustomer,
      openModal: () => setIsModalOpen(true),
      closeModal: () => setIsModalOpen(false),
    },
  };
};
