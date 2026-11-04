import { useState, useEffect, useMemo } from 'react';
import { useSalesStore } from '@/store/useSalesStore';
import { DetailedSaleRow } from '@/features/sales/components/DetailedSalesTable';

export const useSalesList = () => {
  const { sales, totalItems, metrics, isLoading, fetchSales, fetchMetrics, openCreateModal } =
    useSalesStore();

  const [activeTab, setActiveTab] = useState<'summary' | 'detailed'>('summary');
  const [searchQuery, setSearchQuery] = useState('');

  // Estados de paginación para pestaña Resumen
  const [salesPage, setSalesPage] = useState<number>(1);
  const [salesPageSize, setSalesPageSize] = useState<number>(10);

  // Estados de paginación para pestaña Venta Detallada
  const [detailedPage, setDetailedPage] = useState<number>(1);
  const [detailedPageSize, setDetailedPageSize] = useState<number>(10);

  // Cargar métricas al montar
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // Reiniciar a la primera página si cambia la búsqueda
  useEffect(() => {
    setSalesPage(1);
    setDetailedPage(1);
  }, [searchQuery]);

  // Cargar ventas del backend con debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSales({
        search: searchQuery.trim() || undefined,
        page: salesPage,
        limit: salesPageSize,
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, salesPage, salesPageSize, fetchSales]);

  // Todos los renglones detallados de las ventas actuales
  const allDetailedRows = useMemo<DetailedSaleRow[]>(() => {
    return sales.flatMap((sale) =>
      sale.items.map((item, idx) => ({
        rowKey: `${sale.id}-${item.barcode}-${idx}`,
        saleNumber: sale.saleNumber,
        date: sale.date,
        time: sale.time,
        customerCode: sale.customerCode || '-',
        customerName: sale.customerName,
        barcode: item.barcode,
        brand: item.brand,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      })),
    );
  }, [sales]);

  // Renglones paginados
  const paginatedDetailedRows = useMemo(() => {
    const start = (detailedPage - 1) * detailedPageSize;
    return allDetailedRows.slice(start, start + detailedPageSize);
  }, [allDetailedRows, detailedPage, detailedPageSize]);

  // Métricas reales consolidadas del backend
  const totalRevenue = metrics.totalAmount;
  const totalItemsSold = metrics.totalUnits;
  const averageTicket =
    metrics.totalCount > 0 ? Math.round(metrics.totalAmount / metrics.totalCount) : 0;

  const handleSalesPageSizeChange = (newSize: number) => {
    setSalesPageSize(newSize);
    setSalesPage(1);
  };

  const handleDetailedPageSizeChange = (newSize: number) => {
    setDetailedPageSize(newSize);
    setDetailedPage(1);
  };

  const handleTabChange = (tab: 'summary' | 'detailed') => {
    setActiveTab(tab);
    if (tab === 'summary') {
      setSalesPage(1);
    } else {
      setDetailedPage(1);
    }
  };

  return {
    state: {
      sales,
      totalItems,
      isLoading,
      activeTab,
      searchQuery,
      salesPage,
      salesPageSize,
      detailedPage,
      detailedPageSize,
      filteredSales: sales,
      paginatedSales: sales,
      allDetailedRows,
      paginatedDetailedRows,
      totalRevenue,
      totalItemsSold,
      averageTicket,
    },
    actions: {
      setActiveTab: handleTabChange,
      setSearchQuery,
      setSalesPage,
      setDetailedPage,
      handleSalesPageSizeChange,
      handleDetailedPageSizeChange,
      openCreateModal,
      refreshSales: () => {
        fetchSales({
          search: searchQuery.trim() || undefined,
          page: salesPage,
          limit: salesPageSize,
        });
        fetchMetrics();
      },
    },
  };
};
