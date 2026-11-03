import { create } from 'zustand';
import {
  BulkImportProductItem,
  BulkImportSummary,
  Product,
  ProductFormData,
} from '@/features/products/types/product.types';
import { productsService } from '@/features/products/services/products.service';

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
    size?: string
  ) => boolean;
  getByBarcode: (barcode: string) => Product | undefined;
  getById: (id: string) => Product | undefined;
  openProductDetail: (product: Product) => void;
  closeProductDetail: () => void;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p-1',
    barcode: '6972011068673',
    brand: 'COOL GIRL',
    name: "IT'S SO GOOD TO BE BAD",
    size: '85 ml / 2.9 fl. oz',
    totalIn: 12,
    totalSold: 1,
    stock: 11,
    costPrice: 120000,
    price: 185000,
    profit: 65000,
    receptionDate: '31/10/2026',
    isActive: true,
  },
  {
    id: 'p-2',
    barcode: '6936664302591',
    brand: 'COOL GIRL',
    name: 'VELVET FATALE - EAU DE PARFUM NATURAL SPRAY',
    size: '85 ml / 2.9 fl. oz',
    totalIn: 12,
    totalSold: 0,
    stock: 12,
    costPrice: 130000,
    price: 195000,
    profit: 65000,
    receptionDate: '31/10/2026',
    isActive: true,
  },
  {
    id: 'p-3',
    barcode: '6936664330587',
    brand: 'COOL GIRL',
    name: "Very - IT'S SO GOOD TO BE BAD - EAU DE PARFUM",
    size: '85 ml / 2.9 fl. oz',
    totalIn: 12,
    totalSold: 0,
    stock: 12,
    costPrice: 125000,
    price: 190000,
    profit: 65000,
    receptionDate: '01/11/2026',
    isActive: true,
  },
  {
    id: 'p-4',
    barcode: '6936664330655',
    brand: 'COOL GIRL',
    name: "IT'S SO GOOD TO BE BAD - EAU DE PARFUM NATU",
    size: '85 ml / 2.9 fl. oz',
    totalIn: 12,
    totalSold: 1,
    stock: 11,
    costPrice: 120000,
    price: 185000,
    profit: 65000,
    receptionDate: '01/11/2026',
    isActive: true,
  },
  {
    id: 'p-5',
    barcode: '6936664300856',
    brand: 'STORY OF FLOWER',
    name: 'PERFUME eau de toilette',
    size: '50 ml / 1.7 FL. OZ.',
    totalIn: 25,
    totalSold: 3,
    stock: 22,
    costPrice: 75000,
    price: 120000,
    profit: 45000,
    receptionDate: '28/10/2026',
    isActive: true,
  },
  {
    id: 'p-6',
    barcode: '6972011066907',
    brand: 'COOL GIRL',
    name: "IT'S SO GOOD TO BE BAD",
    size: '85 ml / 2.9 fl. oz',
    totalIn: 12,
    totalSold: 0,
    stock: 12,
    costPrice: 120000,
    price: 185000,
    profit: 65000,
    receptionDate: '29/10/2026',
    isActive: true,
  },
  {
    id: 'p-7',
    barcode: '6972011066914',
    brand: 'COOL GIRL',
    name: 'VELVET FATALE',
    size: '85 ml / 2.9 fl. oz',
    totalIn: 12,
    totalSold: 0,
    stock: 12,
    costPrice: 125000,
    price: 190000,
    profit: 65000,
    receptionDate: '29/10/2026',
    isActive: true,
  },
  {
    id: 'p-8',
    barcode: '4897138051228',
    brand: 'LOOK GIRL',
    name: "IT'S SO GOOD TO BE BAD",
    size: '85 ml / 2.9 fl. oz',
    totalIn: 16,
    totalSold: 0,
    stock: 16,
    costPrice: 105000,
    price: 165000,
    profit: 60000,
    receptionDate: '30/10/2026',
    isActive: true,
  },
  {
    id: 'p-9',
    barcode: '6936664321950',
    brand: 'COOL GIRL',
    name: 'Eau de Toilette Natural Spray ("IT\'S SO GOOD TO BE)',
    size: '85 ml (2.9 fl. oz)',
    totalIn: 10,
    totalSold: 1,
    stock: 9,
    costPrice: 115000,
    price: 180000,
    profit: 65000,
    receptionDate: '01/11/2026',
    isActive: true,
  },
  {
    id: 'p-10',
    barcode: '6936664339238',
    brand: 'COOL GIRL',
    name: 'Eau de Parfum Natural Spray ("DOT DRAMA Karlie Klo...)',
    size: '85 ml (2.9 fl. oz)',
    totalIn: 12,
    totalSold: 0,
    stock: 12,
    costPrice: 130000,
    price: 195000,
    profit: 65000,
    receptionDate: '01/11/2026',
    isActive: true,
  },
  {
    id: 'p-11',
    barcode: '6936664330105',
    brand: 'ONLYYOU',
    name: 'PERFUME COLLECTION - VAPORISATEUR NATURA',
    size: '30 ml / 1.0 fl.oz.',
    totalIn: 12,
    totalSold: 5,
    stock: 7,
    costPrice: 60000,
    price: 95000,
    profit: 35000,
    receptionDate: '25/10/2026',
    isActive: true,
  },
  {
    id: 'p-12',
    barcode: '6936664357003',
    brand: 'MYSTICAL',
    name: 'ZANZIBARA ASADA - EAU DE PARFUM (MYSTICAL)',
    size: '30 ml / 1.0 fl.oz.',
    totalIn: 12,
    totalSold: 7,
    stock: 5,
    costPrice: 70000,
    price: 110000,
    profit: 40000,
    receptionDate: '26/10/2026',
    isActive: true,
  },
  {
    id: 'p-13',
    barcode: '6936664367507',
    brand: 'MYSTICAL',
    name: 'Eau de Parfum ELIXIR (ASADA / أسد)',
    size: '30 ml / 1.0 fl. oz.',
    totalIn: 15,
    totalSold: 3,
    stock: 12,
    costPrice: 75000,
    price: 115000,
    profit: 40000,
    receptionDate: '27/10/2026',
    isActive: true,
  },
];

export const useInventoryStore = create<InventoryState>((set, get) => ({
  products: INITIAL_PRODUCTS,
  selectedProductForDetail: null,
  isLoading: false,

  openProductDetail: (product: Product) => set({ selectedProductForDetail: product }),
  closeProductDetail: () => set({ selectedProductForDetail: null }),

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const items = await productsService.fetchProducts();
      if (items && items.length > 0) {
        set({ products: items });
      }
    } catch {
      // Si el backend no está disponible o falla, mantiene los datos en memoria
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
        if (refreshed && refreshed.length > 0) {
          set({ products: refreshed });
        }
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
      set({ products: refreshed });
    } catch {
      // Fallback local si no hay conexión al backend
      const costPrice = productData.costPrice || Math.round(productData.price * 0.65);
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
        receptionDate: productData.receptionDate || new Date().toLocaleDateString('es-ES'),
        totalIn: productData.totalIn,
        totalSold: 0,
        stock: productData.totalIn,
        isActive: true,
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

  recordIncomingStock: (
    barcode: string,
    quantity: number,
    costPrice: number,
    sellingPrice?: number,
    receptionDate?: string,
    brand?: string,
    name?: string,
    size?: string
  ): boolean => {
    const { products } = get();
    const product = products.find((p) => p.barcode === barcode);
    if (!product) return false;

    set((state) => ({
      products: state.products.map((item) => {
        if (item.barcode === barcode) {
          const finalPrice = sellingPrice && sellingPrice > 0 ? sellingPrice : item.price;
          const finalCost = costPrice && costPrice > 0 ? costPrice : item.costPrice;
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
  },

  getByBarcode: (barcode: string): Product | undefined => {
    return get().products.find((p) => p.barcode.trim() === barcode.trim());
  },

  getById: (id: string): Product | undefined => {
    return get().products.find((p) => p.id === id);
  },
}));
