import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui';
import { Pagination } from '@/componentes';
import { ProductTable } from '@/features/products/components/ProductTable';
import { ProductFormModal } from '@/features/products/components/ProductFormModal';
import { StockEntryTable } from '@/features/products/components/StockEntryTable';
import { ProductFormData } from '@/features/products/types/product.types';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useStockEntryStore } from '@/store/useStockEntryStore';
import { RoutesView } from '@/navigation/routes';
import { t } from '@/lang';
import {
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Layers,
  PackagePlus,
  Boxes,
  History,
} from 'lucide-react';

export const ProductsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { products, addProduct } = useInventoryStore();
  const { entries } = useStockEntryStore();

  const [activeTab, setActiveTab] = useState<'stock' | 'entries'>('stock');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);

  // Estados de paginación para pestaña Stock
  const [productsPage, setProductsPage] = useState<number>(1);
  const [productsPageSize, setProductsPageSize] = useState<number>(10);

  // Estados de paginación para pestaña Ingresos
  const [entriesPage, setEntriesPage] = useState<number>(1);
  const [entriesPageSize, setEntriesPageSize] = useState<number>(10);

  // Reiniciar páginas al buscar o cambiar filtro
  useEffect(() => {
    setProductsPage(1);
    setEntriesPage(1);
  }, [searchQuery, filterLowStock]);

  const handleCreateProduct = (data: ProductFormData) => {
    addProduct(data);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode.includes(searchQuery);

    if (filterLowStock) {
      return matchesSearch && product.stock <= 5;
    }
    return matchesSearch;
  });

  const filteredEntries = entries.filter(
    (entry) =>
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.barcode.includes(searchQuery) ||
      entry.date.includes(searchQuery)
  );

  // Registros paginados según la pestaña activa
  const paginatedProducts = filteredProducts.slice(
    (productsPage - 1) * productsPageSize,
    productsPage * productsPageSize
  );

  const paginatedEntries = filteredEntries.slice(
    (entriesPage - 1) * entriesPageSize,
    entriesPage * entriesPageSize
  );

  const lowStockCount = products.filter((p) => p.stock <= 5).length;
  const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const totalEntriesUnits = entries.reduce((acc, e) => acc + e.quantity, 0);

  const handleProductsPageSizeChange = (newSize: number) => {
    setProductsPageSize(newSize);
    setProductsPage(1);
  };

  const handleEntriesPageSizeChange = (newSize: number) => {
    setEntriesPageSize(newSize);
    setEntriesPage(1);
  };

  return (
    <div>
      <Header
        title={t('inventory.title')}
        subtitle={t('inventory.subtitle')}
        action={
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsProductModalOpen(true)}
            >
              {t('inventory.newProduct')}
            </Button>
            <Button
              variant="primary"
              leftIcon={<PackagePlus className="w-4 h-4" />}
              onClick={() => navigate(RoutesView.STOCK_ENTRY)}
            >
              {t('inventory.newEntry')}
            </Button>
          </div>
        }
      />

      {/* Mini metric bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 bg-maribel-50 text-maribel-700 rounded-lg">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase text-stone-500">Catálogo Activo</p>
            <p className="text-xl font-bold font-serif text-stone-900">{products.length} productos</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase text-stone-500">Saldo en Inventario</p>
            <p className="text-xl font-bold font-serif text-stone-900">{totalStockUnits} uds</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase text-stone-500">Stock Crítico (≤ 5)</p>
            <p className="text-xl font-bold font-serif text-amber-800">{lowStockCount} referencias</p>
          </div>
        </div>
      </div>

      <section className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        {/* Pestañas de Navegación: Stock vs Ingresos */}
        <div className="px-5 pt-4 pb-0 border-b border-stone-200 flex items-center justify-between flex-wrap gap-3 bg-stone-50/50">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('stock');
                setProductsPage(1);
              }}
              className={`flex items-center space-x-2 py-2.5 px-4 text-xs font-semibold rounded-t-xl border-b-2 transition-all ${
                activeTab === 'stock'
                  ? 'border-maribel-700 text-maribel-800 bg-white shadow-xs'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Boxes className="w-4 h-4" />
              <span>{t('inventory.tabStock')} ({products.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('entries');
                setEntriesPage(1);
              }}
              className={`flex items-center space-x-2 py-2.5 px-4 text-xs font-semibold rounded-t-xl border-b-2 transition-all ${
                activeTab === 'entries'
                  ? 'border-maribel-700 text-maribel-800 bg-white shadow-xs'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <History className="w-4 h-4" />
              <span>{t('inventory.tabEntries')} ({entries.length})</span>
            </button>
          </div>

          <span className="text-[11px] text-stone-400 pb-2">
            {activeTab === 'stock'
              ? 'Saldos consolidados por código de barras'
              : `Historial de entradas (${totalEntriesUnits} unidades ingresadas en total)`}
          </span>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'stock'
                  ? 'Buscar por código, marca o fragancia...'
                  : 'Buscar por código, fecha o proveedor...'
              }
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-maribel-600"
            />
          </div>

          {activeTab === 'stock' && (
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setFilterLowStock((prev) => !prev)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  filterLowStock
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Solo stock bajo ({lowStockCount})</span>
              </button>
            </div>
          )}
        </div>

        {/* Tabla activa */}
        {activeTab === 'stock' ? (
          <ProductTable products={paginatedProducts} />
        ) : (
          <StockEntryTable entries={paginatedEntries} />
        )}

        {/* Componente de Paginación */}
        {activeTab === 'stock' ? (
          <Pagination
            currentPage={productsPage}
            totalItems={filteredProducts.length}
            pageSize={productsPageSize}
            pageSizeOptions={[10, 25, 50, 100]}
            onPageChange={setProductsPage}
            onPageSizeChange={handleProductsPageSizeChange}
          />
        ) : (
          <Pagination
            currentPage={entriesPage}
            totalItems={filteredEntries.length}
            pageSize={entriesPageSize}
            pageSizeOptions={[10, 25, 50, 100]}
            onPageChange={setEntriesPage}
            onPageSizeChange={handleEntriesPageSizeChange}
          />
        )}
      </section>

      {/* Modal de Creación Rápida */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSubmitProduct={handleCreateProduct}
      />
    </div>
  );
};
