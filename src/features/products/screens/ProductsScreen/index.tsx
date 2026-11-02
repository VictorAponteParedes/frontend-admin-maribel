import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui';
import { ProductTable } from '@/features/products/components/ProductTable';
import { ProductFormModal } from '@/features/products/components/ProductFormModal';
import { ProductFormData } from '@/features/products/types/product.types';
import { useInventoryStore } from '@/store/useInventoryStore';
import { t } from '@/lang';
import { Plus, Search, Filter, AlertTriangle, Layers } from 'lucide-react';

export const ProductsScreen: React.FC = () => {
  const { products, addProduct } = useInventoryStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);

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

  const lowStockCount = products.filter((p) => p.stock <= 5).length;
  const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0);

  return (
    <div>
      <Header
        title={t('inventory.title')}
        subtitle={t('inventory.subtitle')}
        action={
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            {t('inventory.newProduct')}
          </Button>
        }
      />

      {/* Mini metric bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 bg-maribel-50 text-maribel-700 rounded-lg">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase text-stone-500">Total Referencias</p>
            <p className="text-xl font-bold font-serif text-stone-900">{products.length} productos</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase text-stone-500">Unidades en Stock</p>
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
        <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por código de barras, marca o fragancia..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-maribel-600"
            />
          </div>

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
        </div>

        <ProductTable products={filteredProducts} />
      </section>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitProduct={handleCreateProduct}
      />
    </div>
  );
};
