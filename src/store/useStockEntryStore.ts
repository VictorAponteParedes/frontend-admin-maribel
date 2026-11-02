import { create } from 'zustand';
import { StockEntry, StockEntryFormData } from '@/features/products/types/stockEntry.types';
import { useInventoryStore } from '@/store/useInventoryStore';

export interface StockEntryState {
  entries: StockEntry[];
  isEntryModalOpen: boolean;
  openEntryModal: () => void;
  closeEntryModal: () => void;
  recordStockEntry: (data: StockEntryFormData) => boolean;
}

const INITIAL_STOCK_ENTRIES: StockEntry[] = [
  {
    id: 'entry-01',
    barcode: '6972011068673',
    brand: 'COOL GIRL',
    name: "IT'S SO GOOD TO BE BAD",
    size: '85 ml / 2.9 fl. oz',
    quantity: 12,
    date: '22/10/2026',
    unitCost: 95000,
    totalCost: 1140000,
  },
  {
    id: 'entry-02',
    barcode: '6936664302591',
    brand: 'COOL GIRL',
    name: 'VELVET FATALE - EAU DE PARFUM NAT',
    size: '85 ml / 2.9 fl. oz',
    quantity: 12,
    date: '22/10/2026',
    unitCost: 98000,
    totalCost: 1176000,
  },
  {
    id: 'entry-03',
    barcode: '6936664330587',
    brand: 'COOL GIRL',
    name: "Very - IT'S SO GOOD TO BE BAD - EAU",
    size: '85 ml / 2.9 fl. oz',
    quantity: 12,
    date: '22/10/2026',
    unitCost: 95000,
    totalCost: 1140000,
  },
  {
    id: 'entry-04',
    barcode: '6936664330655',
    brand: 'COOL GIRL',
    name: "IT'S SO GOOD TO BE BAD - EAU DE PA",
    size: '85 ml / 2.9 fl. oz',
    quantity: 12,
    date: '22/10/2026',
    unitCost: 95000,
    totalCost: 1140000,
  },
  {
    id: 'entry-05',
    barcode: '6936664300856',
    brand: 'STORY OF FLOWER',
    name: 'PERFUME eau de toilette',
    size: '50 ml / 1.7 FL. OZ.',
    quantity: 12,
    date: '22/10/2026',
    unitCost: 60000,
    totalCost: 720000,
  },
  {
    id: 'entry-06',
    barcode: '6936664300856',
    brand: 'STORY OF FLOWER',
    name: 'PERFUME eau de toilette',
    size: '50 ml / 1.7 FL. OZ.',
    quantity: 13,
    date: '22/10/2026',
    unitCost: 60000,
    totalCost: 780000,
  },
  {
    id: 'entry-07',
    barcode: '6972011066907',
    brand: 'COOL GIRL',
    name: "IT'S SO GOOD TO BE BAD",
    size: '85 ml / 2.9 fl. oz',
    quantity: 12,
    date: '22/10/2026',
    unitCost: 95000,
    totalCost: 1140000,
  },
  {
    id: 'entry-08',
    barcode: '6972011066914',
    brand: 'COOL GIRL',
    name: 'VELVET FATALE',
    size: '85 ml / 2.9 fl. oz',
    quantity: 12,
    date: '22/10/2026',
    unitCost: 98000,
    totalCost: 1176000,
  },
  {
    id: 'entry-09',
    barcode: '4897138051228',
    brand: 'LOOK GIRL',
    name: "IT'S SO GOOD TO BE BAD",
    size: '85 ml / 2.9 fl. oz',
    quantity: 12,
    date: '22/10/2026',
    unitCost: 85000,
    totalCost: 1020000,
  },
  {
    id: 'entry-10',
    barcode: '6936664321950',
    brand: 'COOL GIRL',
    name: 'Eau de Toilette Natural Spray ("IT\'S SO G',
    size: '85 ml (2.9 fl. oz)',
    quantity: 10,
    date: '23/10/2026',
    unitCost: 90000,
    totalCost: 900000,
  },
  {
    id: 'entry-11',
    barcode: '6936664330105',
    brand: 'ONLYYOU',
    name: 'PERFUME COLLECTION - VAPORISATE',
    size: '30 ml / 1.0 fl.oz.',
    quantity: 12,
    date: '23/10/2026',
    unitCost: 45000,
    totalCost: 540000,
  },
  {
    id: 'entry-12',
    barcode: '6936664357003',
    brand: 'MYSTICAL',
    name: 'ZANZIBARA ASADA - EAU DE PARFUM',
    size: '30 ml / 1.0 fl.oz.',
    quantity: 12,
    date: '23/10/2026',
    unitCost: 55000,
    totalCost: 660000,
  },
  {
    id: 'entry-13',
    barcode: '6936664367507',
    brand: 'MYSTICAL',
    name: 'Eau de Parfum ELIXIR (ASADA / أسد)',
    size: '30 ml / 1.0 fl. oz.',
    quantity: 15,
    date: '23/10/2026',
    unitCost: 58000,
    totalCost: 870000,
  },
];

export const useStockEntryStore = create<StockEntryState>((set) => ({
  entries: INITIAL_STOCK_ENTRIES,
  isEntryModalOpen: false,

  openEntryModal: () => set({ isEntryModalOpen: true }),
  closeEntryModal: () => set({ isEntryModalOpen: false }),

  recordStockEntry: (data: StockEntryFormData): boolean => {
    const inventoryStore = useInventoryStore.getState();
    const product = inventoryStore.getByBarcode(data.barcode);

    if (!product) {
      return false;
    }

    const today = new Date();
    const formattedDate = data.date || `${String(today.getDate()).padStart(2, '0')}/${String(
      today.getMonth() + 1
    ).padStart(2, '0')}/${today.getFullYear()}`;

    const totalCost = data.quantity * data.unitCost;

    const newEntry: StockEntry = {
      id: `entry-${Date.now()}`,
      barcode: product.barcode,
      brand: product.brand,
      name: product.name,
      size: product.size,
      quantity: data.quantity,
      date: formattedDate,
      unitCost: data.unitCost,
      totalCost,
    };

    // 1. Actualizar el stock e ingreso acumulado en el inventario
    inventoryStore.addIncomingStock(product.barcode, data.quantity);

    // 2. Guardar en el historial de ingresos
    set((state) => ({ entries: [newEntry, ...state.entries] }));
    return true;
  },
}));
