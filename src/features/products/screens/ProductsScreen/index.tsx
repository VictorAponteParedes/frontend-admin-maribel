import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui';
import { ProductTable } from '@/features/products/components/ProductTable';
import { ProductFormModal } from '@/features/products/components/ProductFormModal';
import { Product, ProductFormData } from '@/features/products/types/product.types';
import { t } from '@/lang';
import { Plus, Search, Filter } from 'lucide-react';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Miss Dior Eau de Parfum',
    brand: 'Dior',
    category: 'Femenino',
    price: 185000,
    stock: 8,
    description: 'Notas florales de rosa centifolia.',
    isActive: true,
  },
  {
    id: '2',
    name: 'Bleu de Chanel Parfum',
    brand: 'Chanel',
    category: 'Masculino',
    price: 210000,
    stock: 5,
    description: 'Amaderada y aromática.',
    isActive: true,
  },
  {
    id: '3',
    name: 'La Vie Est Belle',
    brand: 'Lancôme',
    category: 'Femenino',
    price: 175000,
    stock: 12,
    description: 'Iris gourmand elegante.',
    isActive: true,
  },
  {
    id: '4',
    name: 'Sauvage Elixir',
    brand: 'Dior',
    category: 'Masculino',
    price: 240000,
    stock: 2,
    description: 'Especias cálidas y lavanda.',
    isActive: true,
  },
];

export const ProductsScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateProduct = (data: ProductFormData) => {
    const newProduct: Product = {
      id: String(Date.now()),
      ...data,
      isActive: true,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Header
        title={t('products.title')}
        subtitle={t('products.subtitle')}
        action={
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            {t('products.newProduct')}
          </Button>
        }
      />

      <section className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('common.search')}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-maribel-600"
            />
          </div>

          <button
            type="button"
            className="p-1.5 text-stone-500 border border-stone-200 rounded-lg hover:bg-stone-50 self-end sm:self-auto"
          >
            <Filter className="w-4 h-4" />
          </button>
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
