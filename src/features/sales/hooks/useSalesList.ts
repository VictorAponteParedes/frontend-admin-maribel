import { useState, useEffect, useMemo } from 'react';
import { useSalesStore } from '@/store/useSalesStore';
import { DetailedSaleRow } from '@/features/sales/components/DetailedSalesTable';

export const useSalesList = () => {
  const { sales, openCreateModal } = useSalesStore();
  const [activeTab, setActiveTab] = useState<'summary' | 'detailed'>('summary');
  const [searchQuery, setSearchQuery] = useState('');

  // Estados de paginación para pestaña Resumen
  const [salesPage, setSalesPage] = useState<number>(1);
  const [salesPageSize, setSalesPageSize] = useState<number>(10);

  // Estados de paginación para pestaña Venta Detallada
  const [detailedPage, setDetailedPage] = useState<number>(1);
  const [detailedPageSize, setDetailedPageSize] = useState<number>(10);

  // Reiniciar a la primera página si cambia la búsqueda
  useEffect(() => {
    setSalesPage(1);
    setDetailedPage(1);
  }, [searchQuery]);

  const filteredSales = useMemo(() => {
    if (!searchQuery.trim()) return sales;
    const q = searchQuery.toLowerCase();
    return sales.filter(
      (sale) =>
        sale.saleNumber.toLowerCase().includes(q) ||
        sale.customerName.toLowerCase().includes(q) ||
        sale.date.includes(q) ||
        sale.items.some(
          (i) =>
            i.brand.toLowerCase().includes(q) ||
            i.name.toLowerCase().includes(q) ||
            i.barcode.includes(q)
        )
    );
  }, [sales, searchQuery]);

  // Paginación para ventas por comprobante
  const paginatedSales = useMemo(() => {
    const start = (salesPage - 1) * salesPageSize;
    return filteredSales.slice(start, start + salesPageSize);
  }, [filteredSales, salesPage, salesPageSize]);

  // Todos los renglones detallados de las ventas filtradas
  const allDetailedRows = useMemo<DetailedSaleRow[]>(() => {
    return filteredSales.flatMap((sale) =>
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
      }))
    );
  }, [filteredSales]);

  // Renglones paginados
  const paginatedDetailedRows = useMemo(() => {
    const start = (detailedPage - 1) * detailedPageSize;
    return allDetailedRows.slice(start, start + detailedPageSize);
  }, [allDetailedRows, detailedPage, detailedPageSize]);

  const totalRevenue = useMemo(
    () => sales.reduce((acc, s) => acc + s.total, 0),
    [sales]
  );
  const totalItemsSold = useMemo(
    () => sales.reduce((acc, s) => acc + s.totalQuantity, 0),
    [sales]
  );
  const averageTicket = useMemo(
    () => (sales.length > 0 ? Math.round(totalRevenue / sales.length) : 0),
    [sales.length, totalRevenue]
  );

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
      activeTab,
      searchQuery,
      salesPage,
      salesPageSize,
      detailedPage,
      detailedPageSize,
      filteredSales,
      paginatedSales,
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
    },
  };
};
