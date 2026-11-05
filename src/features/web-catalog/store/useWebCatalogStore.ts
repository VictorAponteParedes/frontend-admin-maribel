import { create } from 'zustand';
import {
  WebProduct,
  WebCombo,
  ComboItemSelection,
  WebCategory,
  WebBadge,
} from '../types/webCatalog.types';
import { combosService } from '../services/combos.service';
import { productsService } from '@/features/products/services/products.service';
import { Product } from '@/features/products/types/product.types';
import { resolveImageUrl } from '@/services/files.service';
import { toast } from '@/store/useToastStore';

interface WebCatalogState {
  products: WebProduct[];
  combos: WebCombo[];
  isLoading: boolean;
  error: string | null;
  fetchCatalogData: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  fetchCombos: () => Promise<void>;
  toggleProductVisibility: (id: string) => Promise<boolean>;
  updateProduct: (id: string, updates: Partial<WebProduct>) => Promise<boolean>;
  toggleComboActive: (id: string) => Promise<boolean>;
  createCombo: (data: {
    title: string;
    kicker: string;
    description: string;
    price: number;
    imageId?: string;
    imageUrl?: string;
    items: ComboItemSelection[];
    isActive: boolean;
  }) => Promise<WebCombo | null>;
  deleteCombo: (id: string) => Promise<boolean>;
}

function mapProductToWebProduct(prod: Product): WebProduct {
  const categoryName: WebCategory = prod.category?.trim() || 'Unisex';

  const resolvedImage = prod.imageUrl
    ? resolveImageUrl(prod.imageUrl)
    : 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=80';

  return {
    id: prod.id,
    barcode: prod.barcode,
    name: prod.name,
    brand: prod.brand,
    size: prod.size || '100 ml',
    costPrice: prod.costPrice,
    sellingPrice: prod.price,
    webPrice: prod.webPrice ?? prod.price,
    stockQuantity: prod.stock,
    imageUrl: resolvedImage,
    imageId: prod.imageId,
    isWebVisible: Boolean(prod.isWebVisible),
    webCategory: categoryName,
    webBadge: (prod.webBadge as WebBadge) || 'Ninguno',
  };
}

export const useWebCatalogStore = create<WebCatalogState>((set, get) => ({
  products: [],
  combos: [],
  isLoading: false,
  error: null,

  fetchCatalogData: async () => {
    set({ isLoading: true, error: null });
    try {
      await Promise.all([get().fetchProducts(), get().fetchCombos()]);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al sincronizar catálogo web.';
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProducts: async () => {
    try {
      const rawProducts = await productsService.fetchProducts({ limit: 500 });
      const webProducts = (rawProducts || []).map(mapProductToWebProduct);
      set({ products: webProducts });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar productos.';
      console.error(message);
    }
  },

  fetchCombos: async () => {
    try {
      const items = await combosService.fetchCombos();
      set({ combos: items || [] });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar combos promocionales.';
      console.error(message);
      toast.error('Error al cargar combos', message);
    }
  },

  toggleProductVisibility: async (id: string) => {
    const target = get().products.find((p) => p.id === id);
    if (!target) return false;

    const nextVisible = !target.isWebVisible;

    // Actualización optimista
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, isWebVisible: nextVisible } : p
      ),
    }));

    try {
      await productsService.updateProduct(id, { isWebVisible: nextVisible });
      if (nextVisible) {
        toast.success(
          'Producto Publicado',
          `"${target.name}" ahora es visible en la tienda web.`
        );
      } else {
        toast.info(
          'Producto Ocultado',
          `"${target.name}" ya no se mostrará en la tienda web.`
        );
      }
      return true;
    } catch (err: unknown) {
      // Revertir optimismo
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, isWebVisible: !nextVisible } : p
        ),
      }));
      const message =
        err instanceof Error ? err.message : 'No se pudo actualizar visibilidad.';
      toast.error('Error', message);
      return false;
    }
  },

  updateProduct: async (id: string, updates: Partial<WebProduct>) => {
    try {
      await productsService.updateProduct(id, {
        isWebVisible: updates.isWebVisible,
        webBadge: updates.webBadge,
        webPrice: updates.webPrice,
        categoryName: updates.webCategory,
        imageId: updates.imageId || undefined,
      });

      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      }));
      toast.success(
        'Producto Actualizado',
        'Los cambios se guardaron en la ficha web.'
      );
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'No se pudo actualizar el producto.';
      toast.error('Error', message);
      return false;
    }
  },

  toggleComboActive: async (id: string) => {
    const target = get().combos.find((c) => c.id === id);
    if (!target) return false;

    const nextActive = !target.isActive;

    // Optimista
    set((state) => ({
      combos: state.combos.map((c) =>
        c.id === id ? { ...c, isActive: nextActive } : c
      ),
    }));

    try {
      await combosService.toggleComboActive(id);
      if (nextActive) {
        toast.success('Combo Activado', `"${target.title}" publicado en la web.`);
      } else {
        toast.info('Combo Pausado', `"${target.title}" fue pausado temporalmente.`);
      }
      return true;
    } catch (err: unknown) {
      // Revertir
      set((state) => ({
        combos: state.combos.map((c) =>
          c.id === id ? { ...c, isActive: !nextActive } : c
        ),
      }));
      const message =
        err instanceof Error ? err.message : 'No se pudo cambiar el estado del combo.';
      toast.error('Error', message);
      return false;
    }
  },

  createCombo: async (data) => {
    set({ isLoading: true });
    try {
      const created = await combosService.createCombo({
        title: data.title,
        kicker: data.kicker,
        description: data.description,
        price: data.price,
        imageId: data.imageId,
        imageUrl: data.imageUrl,
        isActive: data.isActive,
        items: data.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      });

      set((state) => ({
        combos: [created, ...state.combos],
      }));

      toast.success(
        'Combo Creado',
        `"${created.title}" se guardó en la base de datos con éxito.`
      );
      return created;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'No se pudo crear el combo.';
      toast.error('Error al crear combo', message);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCombo: async (id: string) => {
    const target = get().combos.find((c) => c.id === id);
    set({ isLoading: true });

    try {
      await combosService.deleteCombo(id);
      set((state) => ({
        combos: state.combos.filter((c) => c.id !== id),
      }));
      toast.success(
        'Combo Eliminado',
        target ? `"${target.title}" fue eliminado.` : 'Combo eliminado con éxito.'
      );
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'No se pudo eliminar el combo.';
      toast.error('Error al eliminar', message);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));
