import { create } from 'zustand';
import { Product, ProductFormData } from '@/features/products/types/product.types';

export interface InventoryState {
  products: Product[];
  addProduct: (productData: ProductFormData) => void;
  deductStock: (barcode: string, quantity: number) => boolean;
  getByBarcode: (barcode: string) => Product | undefined;
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
    price: 185000,
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
    price: 195000,
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
    price: 190000,
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
    price: 185000,
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
    price: 120000,
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
    price: 185000,
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
    price: 190000,
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
    price: 165000,
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
    price: 180000,
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
    price: 195000,
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
    price: 95000,
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
    price: 110000,
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
    price: 115000,
    isActive: true,
  },
];

export const useInventoryStore = create<InventoryState>((set, get) => ({
  products: INITIAL_PRODUCTS,

  addProduct: (productData: ProductFormData) => {
    const newProduct: Product = {
      id: `p-${Date.now()}`,
      barcode: productData.barcode,
      brand: productData.brand,
      name: productData.name,
      size: productData.size,
      price: productData.price,
      totalIn: productData.totalIn,
      totalSold: 0,
      stock: productData.totalIn,
      isActive: true,
    };
    set((state) => ({ products: [newProduct, ...state.products] }));
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

  getByBarcode: (barcode: string): Product | undefined => {
    return get().products.find((p) => p.barcode.trim() === barcode.trim());
  },
}));
