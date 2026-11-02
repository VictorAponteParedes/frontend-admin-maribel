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
}

const INITIAL_SALES: Sale[] = [
  {
    id: 'sale-001',
    saleNumber: 'V-2026-001',
    date: '28/10/2026',
    customerCode: 'CLI-01',
    customerName: 'María González',
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
    customerCode: 'CLI-02',
    customerName: 'Carlos Benítez',
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
    customerCode: '',
    customerName: 'Consumidor Final',
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
    customerCode: 'CLI-03',
    customerName: 'Laura Martínez',
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
];

export const useSalesStore = create<SalesState>((set) => ({
  sales: INITIAL_SALES,
  isCreateModalOpen: false,
  selectedSaleForDetail: null,

  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),

  openDetailModal: (sale: Sale) => set({ selectedSaleForDetail: sale }),
  closeDetailModal: () => set({ selectedSaleForDetail: null }),

  addSale: (sale: Sale) =>
    set((state) => ({ sales: [sale, ...state.sales] })),
}));
