import { create } from "zustand";
import {
  BulkImportProductItem,
  BulkImportSummary,
  Product,
  ProductFormData,
} from "@/features/products/types/product.types";
import { productsService } from "@/features/products/services/products.service";

export interface InventoryState {
  products: Product[];
  isLoading: boolean;
  selectedProductForDetail: Product | null;
  fetchProducts: () => Promise<void>;
  bulkImport: (items: BulkImportProductItem[]) => Promise<BulkImportSummary>;
  addProduct: (productData: ProductFormData) => Promise<void>;
  deductStock: (barcode: string, quantity: number) => boolean;
  addIncomingStock: (barcode: string, quantity: number) => boolean;
  recordIncomingStock: (
    barcode: string,
    quantity: number,
    costPrice: number,
    sellingPrice?: number,
    receptionDate?: string,
    brand?: string,
    name?: string,
    size?: string,
    batchNumber?: string,
    imageId?: string,
  ) => Promise<boolean>;
  getByBarcode: (barcode: string) => Product | undefined;
  getById: (id: string) => Product | undefined;
  openProductDetail: (product: Product) => void;
  closeProductDetail: () => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  products: [],
  selectedProductForDetail: null,
  isLoading: false,

  openProductDetail: (product: Product) =>
    set({ selectedProductForDetail: product }),
  closeProductDetail: () => set({ selectedProductForDetail: null }),

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const items = await productsService.fetchProducts();
      set({ products: items || [] });
    } catch {
      // Si el backend no está disponible, mantiene el estado actual
    } finally {
      set({ isLoading: false });
    }
  },

  bulkImport: async (items: BulkImportProductItem[]) => {
    set({ isLoading: true });
    try {
      const summary = await productsService.bulkImport(items);
      try {
        const refreshed = await productsService.fetchProducts();
        set({ products: refreshed || [] });
      } catch {
        // En caso de que falle la recarga
      }
      return summary;
    } finally {
      set({ isLoading: false });
    }
  },

  addProduct: async (productData: ProductFormData) => {
    try {
      await productsService.createProduct(productData);
      const refreshed = await productsService.fetchProducts();
      set({ products: refreshed || [] });
    } catch {
      // Fallback local si no hay conexión al backend
      const costPrice =
        productData.costPrice || Math.round(productData.price * 0.65);
      const profit = productData.price - costPrice;
      const newProduct: Product = {
        id: `p-${Date.now()}`,
        barcode: productData.barcode,
        brand: productData.brand,
        name: productData.name,
        size: productData.size,
        costPrice,
        price: productData.price,
        profit,
        receptionDate:
          productData.receptionDate || new Date().toLocaleDateString("es-ES"),
        totalIn: productData.totalIn,
        totalSold: 0,
        stock: productData.totalIn,
        isActive: true,
        imageId: productData.imageId || null,
        imageUrl: productData.imageUrl || null,
      };
      set((state) => ({ products: [newProduct, ...state.products] }));
    }
  },

  deductStock: (barcode: string, quantity: number): boolean => {
    const { products } = get();
    const product = products.find((p) => p.barcode === barcode);
    if (!product || product.stock < quantity) {
      return false;
    }

    set((state) => ({
      products: state.products.map((item) => {
        if (item.barcode === barcode) {
          const newSold = item.totalSold + quantity;
          const newStock = Math.max(0, item.stock - quantity);
          return {
            ...item,
            totalSold: newSold,
            stock: newStock,
          };
        }
        return item;
      }),
    }));
    return true;
  },

  addIncomingStock: (barcode: string, quantity: number): boolean => {
    const { products } = get();
    const product = products.find((p) => p.barcode === barcode);
    if (!product) {
      return false;
    }

    set((state) => ({
      products: state.products.map((item) => {
        if (item.barcode === barcode) {
          const newIn = item.totalIn + quantity;
          const newStock = item.stock + quantity;
          return {
            ...item,
            totalIn: newIn,
            stock: newStock,
          };
        }
        return item;
      }),
    }));
    return true;
  },

  recordIncomingStock: async (
    barcode: string,
    quantity: number,
    costPrice: number,
    sellingPrice?: number,
    receptionDate?: string,
    brand?: string,
    name?: string,
    size?: string,
    batchNumber?: string,
    imageId?: string,
  ): Promise<boolean> => {
    const { products } = get();
    const product = products.find((p) => p.barcode === barcode);
    if (!product) return false;

    try {
      await productsService.addStockEntry(product.id, {
        quantity,
        unitCost: costPrice,
        batchNumber,
        entryDate: receptionDate,
      });

      if (imageId && imageId !== product.imageId) {
        await productsService.updateProduct(product.id, { imageId });
      }

      const refreshed = await productsService.fetchProducts();
      set({ products: refreshed || [] });
      return true;
    } catch {
      set((state) => ({
        products: state.products.map((item) => {
          if (item.barcode === barcode) {
            const finalPrice =
              sellingPrice && sellingPrice > 0 ? sellingPrice : item.price;
            const finalCost =
              costPrice && costPrice > 0 ? costPrice : item.costPrice;
            return {
              ...item,
              brand: brand?.trim() || item.brand,
              name: name?.trim() || item.name,
              size: size?.trim() || item.size,
              totalIn: item.totalIn + quantity,
              stock: item.stock + quantity,
              costPrice: finalCost,
              price: finalPrice,
              profit: finalPrice - finalCost,
              receptionDate: receptionDate || item.receptionDate,
            };
          }
          return item;
        }),
      }));
      return true;
    }
  },

  getByBarcode: (barcode: string): Product | undefined => {
    const clean = barcode.trim().toLowerCase();
    return get().products.find(
      (p) =>
        p.barcode.trim().toLowerCase() === clean ||
        p.id.trim().toLowerCase() === clean
    );
  },

  getById: (id: string): Product | undefined => {
    const clean = id.trim().toLowerCase();
    return get().products.find((p) => p.id.trim().toLowerCase() === clean);
  },
}));
