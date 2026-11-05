import React, { useState, useEffect } from 'react';
import { Plus, Tags, CheckCircle2, Globe, Search, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui';
import { ConfirmModal } from '@/componentes';
import { useCategoriesStore } from '../../store/useCategoriesStore';
import { Category, CreateCategoryInput } from '../../types/category.types';
import { CategoriesTable } from '../../components/CategoriesTable';
import { CategoryFormModal } from '../../components/CategoryFormModal';

export const CategoriesScreen: React.FC = () => {
  const categories = useCategoriesStore((state) => state.categories);
  const isLoading = useCategoriesStore((state) => state.isLoading);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);
  const addCategory = useCategoriesStore((state) => state.addCategory);
  const updateCategory = useCategoriesStore((state) => state.updateCategory);
  const toggleActive = useCategoriesStore((state) => state.toggleActive);
  const deleteCategory = useCategoriesStore((state) => state.deleteCategory);

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const activeCount = categories.filter((c) => c.isActive).length;
  const totalProducts = categories.reduce((sum, c) => sum + (c.productCount || 0), 0);

  const filteredCategories = categories.filter((cat) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      cat.name.toLowerCase().includes(q) ||
      cat.slug.toLowerCase().includes(q) ||
      (cat.description && cat.description.toLowerCase().includes(q))
    );
  });

  const handleOpenCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleSave = async (input: CreateCategoryInput, categoryId?: string) => {
    if (categoryId) {
      await updateCategory(categoryId, input);
    } else {
      await addCategory(input);
    }
  };

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      await deleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <Header
        title="Categorías de Productos"
        subtitle="Organiza tus fragancias por familias y colecciones visibles tanto en inventario como en la tienda web."
        action={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleOpenCreate}
          >
            Nueva Categoría
          </Button>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-500 font-medium">Total Categorías</span>
            <div className="font-serif font-bold text-2xl text-stone-900 mt-1">
              {categories.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
            <Tags className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-500 font-medium">Activas en la Web</span>
            <div className="font-serif font-bold text-2xl text-emerald-700 mt-1">
              {activeCount} <span className="text-xs font-normal font-sans text-stone-400">visibles</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-500 font-medium">Productos Clasificados</span>
            <div className="font-serif font-bold text-2xl text-maribel-700 mt-1">
              {totalProducts}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-maribel-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, slug o descripción..."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-stone-800 outline-none focus:bg-white focus:border-maribel-700 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-3">
          {isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-maribel-700 font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Sincronizando...</span>
            </div>
          )}
          <span className="text-xs text-stone-500">
            Mostrando <strong>{filteredCategories.length}</strong> de {categories.length} categorías
          </span>
        </div>
      </div>

      {/* Table */}
      <CategoriesTable
        categories={filteredCategories}
        onEdit={handleOpenEdit}
        onToggleActive={toggleActive}
        onDelete={handleDelete}
      />

      {/* Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        category={selectedCategory}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      {/* Modal de Confirmación de Eliminación */}
      <ConfirmModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar categoría?"
        itemTitle={categoryToDelete?.name}
        description={
          categoryToDelete?.productCount && categoryToDelete.productCount > 0
            ? `Esta categoría tiene ${categoryToDelete.productCount} productos asociados. Si la eliminas, dichos productos quedarán sin categoría asignada.`
            : 'Esta acción eliminará permanentemente la categoría del catálogo y de inventario.'
        }
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
};

export default CategoriesScreen;
