import { create } from 'zustand';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '../types/category.types';
import { categoriesService } from '../services/categories.service';
import { toast } from '@/store/useToastStore';

interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (input: CreateCategoryInput) => Promise<Category | null>;
  updateCategory: (id: string, input: UpdateCategoryInput) => Promise<boolean>;
  toggleActive: (id: string) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await categoriesService.fetchCategories();
      set({ categories: items || [] });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar las categorías.';
      set({ error: message });
      toast.error('Error al cargar categorías', message);
    } finally {
      set({ isLoading: false });
    }
  },

  addCategory: async (input: CreateCategoryInput) => {
    set({ isLoading: true, error: null });
    try {
      const created = await categoriesService.createCategory(input);
      // Recargar lista para asegurar sincronización y orden
      await get().fetchCategories();
      toast.success('Categoría creada', `"${created.name}" fue agregada exitosamente.`);
      return created;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'No se pudo crear la categoría.';
      set({ error: message });
      toast.error('Error al crear categoría', message);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  updateCategory: async (id: string, input: UpdateCategoryInput) => {
    set({ isLoading: true, error: null });
    try {
      await categoriesService.updateCategory(id, input);
      await get().fetchCategories();
      toast.success('Categoría actualizada', 'Los cambios fueron guardados.');
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'No se pudo actualizar la categoría.';
      set({ error: message });
      toast.error('Error al actualizar', message);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  toggleActive: async (id: string) => {
    const current = get().categories.find((c) => c.id === id);
    if (!current) return false;

    const newActiveState = !current.isActive;

    // Optimistic update
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, isActive: newActiveState } : c
      ),
    }));

    try {
      await categoriesService.updateCategory(id, { isActive: newActiveState });
      toast.success(
        newActiveState ? 'Categoría activada' : 'Categoría pausada',
        `"${current.name}" ahora está ${newActiveState ? 'activa' : 'inactiva'}.`
      );
      return true;
    } catch (err: unknown) {
      // Revertir en caso de falla
      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === id ? { ...c, isActive: !newActiveState } : c
        ),
      }));
      const message =
        err instanceof Error ? err.message : 'No se pudo cambiar el estado.';
      toast.error('Error', message);
      return false;
    }
  },

  deleteCategory: async (id: string) => {
    const target = get().categories.find((c) => c.id === id);
    set({ isLoading: true, error: null });

    try {
      await categoriesService.deleteCategory(id);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }));
      toast.success(
        'Categoría eliminada',
        target ? `"${target.name}" fue eliminada.` : undefined
      );
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'No se pudo eliminar la categoría.';
      set({ error: message });
      toast.error('Error al eliminar', message);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));
