import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useStockEntryStore } from '@/store/useStockEntryStore';
import { RoutesView } from '@/navigation/routes';
import { ProductFormData, Product } from '../types/product.types';
import { StockEntry } from '../types/stockEntry.types';

export type ProductTab = 'stock' | 'entries';

export interface ProductsMetrics {
  totalCatalogCount: number;
  totalStockUnits: number;
  lowStockCount: number;
  totalEntriesUnits: number;
}

export const useProductsList = () => {
  const navigate = useNavigate();
  const { products, addProduct } = useInventoryStore();
  const { entries } = useStockEntryStore();

  const [activeTab, setActiveTab] = useState<ProductTab>('stock');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);

  // Estados de paginación
  const [productsPage, setProductsPage] = useState<number>(1);
  const [productsPageSize, setProductsPageSize] = useState<number>(10);
  const [entriesPage, setEntriesPage] = useState<number>(1);
  const [entriesPageSize, setEntriesPageSize] = useState<number>(10);

  // Reiniciar a página 1 al filtrar o cambiar búsqueda
  useEffect(() => {
    setProductsPage(1);
    setEntriesPage(1);
  }, [searchQuery, filterLowStock]);

  // Filtrado de productos
  const filteredProducts = useMemo<Product[]>(() => {
    const q = searchQuery.toLowerCase().trim();
    return products.filter((product) => {
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.barcode.includes(q);

      if (filterLowStock) {
        return matchesSearch && product.stock <= 5;
      }
      return matchesSearch;
    });
  }, [products, searchQuery, filterLowStock]);

  // Filtrado de ingresos
  const filteredEntries = useMemo<StockEntry[]>(() => {
    const q = searchQuery.toLowerCase().trim();
    return entries.filter((entry) => {
      return (
        !q ||
        entry.name.toLowerCase().includes(q) ||
        entry.brand.toLowerCase().includes(q) ||
        entry.barcode.includes(q) ||
        entry.date.includes(q)
      );
    });
  }, [entries, searchQuery]);

  // Paginación
  const paginatedProducts = useMemo(() => {
    const start = (productsPage - 1) * productsPageSize;
    return filteredProducts.slice(start, start + productsPageSize);
  }, [filteredProducts, productsPage, productsPageSize]);

  const paginatedEntries = useMemo(() => {
    const start = (entriesPage - 1) * entriesPageSize;
    return filteredEntries.slice(start, start + entriesPageSize);
  }, [filteredEntries, entriesPage, entriesPageSize]);

  // Métricas
  const metrics: ProductsMetrics = useMemo(() => {
    const lowStockCount = products.filter((p) => p.stock <= 5).length;
    const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0);
    const totalEntriesUnits = entries.reduce((acc, e) => acc + e.quantity, 0);

    return {
      totalCatalogCount: products.length,
      totalStockUnits,
      lowStockCount,
      totalEntriesUnits,
    };
  }, [products, entries]);

  const handleCreateProduct = (data: ProductFormData) => {
    addProduct(data);
  };

  const handleProductsPageSizeChange = (newSize: number) => {
    setProductsPageSize(newSize);
    setProductsPage(1);
  };

  const handleEntriesPageSizeChange = (newSize: number) => {
    setEntriesPageSize(newSize);
    setEntriesPage(1);
  };

  const handleNavigateToStockEntry = () => {
    navigate(RoutesView.STOCK_ENTRY);
  };

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filterLowStock,
    setFilterLowStock,
    isProductModalOpen,
    setIsProductModalOpen,
    metrics,
    stockPagination: {
      currentPage: productsPage,
      pageSize: productsPageSize,
      totalItems: filteredProducts.length,
      items: paginatedProducts,
      onPageChange: setProductsPage,
      onPageSizeChange: handleProductsPageSizeChange,
    },
    entriesPagination: {
      currentPage: entriesPage,
      pageSize: entriesPageSize,
      totalItems: filteredEntries.length,
      items: paginatedEntries,
      onPageChange: setEntriesPage,
      onPageSizeChange: handleEntriesPageSizeChange,
    },
    actions: {
      handleCreateProduct,
      handleNavigateToStockEntry,
      toggleFilterLowStock: () => setFilterLowStock((prev) => !prev),
      openProductModal: () => setIsProductModalOpen(true),
      closeProductModal: () => setIsProductModalOpen(false),
    },
  };
};
