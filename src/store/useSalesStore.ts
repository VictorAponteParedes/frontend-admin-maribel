import { create } from 'zustand';
import { Sale } from '@/features/sales/types/sale.types';

export interface SalesState {
  sales: Sale[];
  isCreateModalOpen: boolean;
  selectedSaleForDetail: Sale | null;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openDetailModal: (sale: Sale) => void;
  closeDetailModal: () => void;
  addSale: (sale: Sale) => void;
  getSaleById: (id: string) => Sale | undefined;
}

const INITIAL_SALES: Sale[] = [
  {
    id: 'sale-001',
    saleNumber: 'V-2026-001',
    date: '28/10/2026',
    time: '16:45 hs',
    customerCode: '1',
    customerName: 'Pablo Ariel Melgarejo Servian',
    customerPhone: '0986 314 630',
    customerAddress: 'Pedro Juan Caballero',
    status: 'CONFIRMED',
    totalQuantity: 2,
    total: 240000,
    items: [
      {
        barcode: '6936664300856',
        brand: 'STORY OF FLOWER',
        name: 'PERFUME eau de toilette',
        size: '50 ml / 1.7 FL. OZ.',
        quantity: 2,
        unitPrice: 120000,
        subtotal: 240000,
      },
    ],
  },
  {
    id: 'sale-002',
    saleNumber: 'V-2026-002',
    date: '28/10/2026',
    time: '14:20 hs',
    customerCode: '4',
    customerName: 'Kevin Mendoza',
    customerPhone: '0985 549 093',
    customerAddress: 'Ypané',
    status: 'CONFIRMED',
    totalQuantity: 1,
    total: 180000,
    items: [
      {
        barcode: '6936664321950',
        brand: 'COOL GIRL',
        name: 'Eau de Toilette Natural Spray ("IT\'S SO GOOD TO BE)',
        size: '85 ml (2.9 fl. oz)',
        quantity: 1,
        unitPrice: 180000,
        subtotal: 180000,
      },
    ],
  },
  {
    id: 'sale-003',
    saleNumber: 'V-2026-003',
    date: '27/10/2026',
    time: '18:10 hs',
    customerCode: '2',
    customerName: 'Cliente casual',
    customerPhone: 'Sin teléfono',
    customerAddress: 'Mostrador / Venta directa',
    status: 'CONFIRMED',
    totalQuantity: 1,
    total: 110000,
    items: [
      {
        barcode: '6936664357003',
        brand: 'MYSTICAL',
        name: 'ZANZIBARA ASADA - EAU DE PARFUM (MYSTICAL)',
        size: '30 ml / 1.0 fl.oz.',
        quantity: 1,
        unitPrice: 110000,
        subtotal: 110000,
      },
    ],
  },
  {
    id: 'sale-004',
    saleNumber: 'V-2026-004',
    date: '26/10/2026',
    time: '11:30 hs',
    customerCode: '3',
    customerName: 'Marlene Roman',
    customerPhone: '0982 653 625',
    customerAddress: 'Profesor Luis Migone Battilana',
    status: 'CONFIRMED',
    totalQuantity: 2,
    total: 230000,
    items: [
      {
        barcode: '6936664367507',
        brand: 'MYSTICAL',
        name: 'Eau de Parfum ELIXIR (ASADA / أسد)',
        size: '30 ml / 1.0 fl. oz.',
        quantity: 2,
        unitPrice: 115000,
        subtotal: 230000,
      },
    ],
  },
  {
    id: 'sale-005',
    saleNumber: 'V-2026-005',
    date: '26/10/2026',
    time: '10:15 hs',
    customerCode: '7',
    customerName: 'Claudia Centurion',
    customerPhone: '0991 552 447',
    customerAddress: 'Coronel Oviedo',
    status: 'CONFIRMED',
    totalQuantity: 3,
    total: 285000,
    items: [
      {
        barcode: '6936664373669',
        brand: 'Cireline',
        name: 'Berry On Top - Give Me Gourmand (Classic Collection)',
        size: '15 ml / 12 pcs',
        quantity: 3,
        unitPrice: 95000,
        subtotal: 285000,
      },
    ],
  },
];

export const useSalesStore = create<SalesState>((set, get) => ({
  sales: INITIAL_SALES,
  isCreateModalOpen: false,
  selectedSaleForDetail: null,

  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),

  openDetailModal: (sale: Sale) => set({ selectedSaleForDetail: sale }),
  closeDetailModal: () => set({ selectedSaleForDetail: null }),

  addSale: (sale: Sale) =>
    set((state) => ({ sales: [sale, ...state.sales] })),

  getSaleById: (id: string): Sale | undefined => {
    return get().sales.find((s) => s.id === id || s.saleNumber === id);
  },
}));
