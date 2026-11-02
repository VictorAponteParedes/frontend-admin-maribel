import { create } from 'zustand';
import { Order, OrderStatus } from '@/features/orders/types/order.types';

export interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  isDetailModalOpen: boolean;
  openDetailModal: (order: Order) => void;
  closeDetailModal: () => void;
  updateOrderStatus: (id: string, newStatus: OrderStatus) => void;
  addOrder: (order: Order) => void;
}

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-001',
    orderNumber: 'PED-2026-101',
    date: 'Hoy 14:35',
    rawDate: '2026-11-02T14:35:00',
    customerName: 'Valeria Montserrat Benítez',
    customerPhone: '0981 445 892',
    deliveryType: 'DELIVERY',
    location: {
      latitude: -25.2867,
      longitude: -57.647,
      address: 'Avda. Mariscal López 1250 esq. San Martín',
      reference: 'Frente al banco, casa portón negro con rejas doradas',
      city: 'Asunción',
    },
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
      {
        barcode: '6936664357003',
        brand: 'MYSTICAL',
        name: 'ZANZIBARA ASADA - EAU DE PARFUM',
        size: '30 ml / 1.0 fl.oz.',
        quantity: 1,
        unitPrice: 110000,
        subtotal: 110000,
      },
    ],
    totalQuantity: 3,
    subtotal: 350000,
    deliveryFee: 25000,
    total: 375000,
    paymentMethod: 'CASH_ON_DELIVERY',
    paymentStatus: 'PENDING',
    status: 'PENDING',
    notes: 'Por favor envolver para regalo. Agregar dedicatoria: "¡Feliz Aniversario mi amor!".',
  },
  {
    id: 'ord-002',
    orderNumber: 'PED-2026-102',
    date: 'Hoy 12:10',
    rawDate: '2026-11-02T12:10:00',
    customerName: 'Carlos Daniel Bogado',
    customerPhone: '0983 712 309',
    deliveryType: 'DELIVERY',
    location: {
      latitude: -25.3389,
      longitude: -57.5358,
      address: 'Calle Las Palmas 420 casi Boquerón',
      reference: 'Edificio Los Robles, Dpto 4B',
      city: 'San Lorenzo',
    },
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
    totalQuantity: 1,
    subtotal: 180000,
    deliveryFee: 20000,
    total: 200000,
    paymentMethod: 'QR',
    paymentStatus: 'PAID',
    status: 'PREPARING',
    notes: 'Avisar por WhatsApp 10 minutos antes de llegar por favor.',
  },
  {
    id: 'ord-003',
    orderNumber: 'PED-2026-103',
    date: 'Hoy 09:45',
    rawDate: '2026-11-02T09:45:00',
    customerName: 'Marlene Elizabeth Román',
    customerPhone: '0982 653 625',
    deliveryType: 'PICKUP',
    items: [
      {
        barcode: '6936664300856',
        brand: 'STORY OF FLOWER',
        name: 'PERFUME eau de toilette',
        size: '50 ml / 1.7 FL. OZ.',
        quantity: 1,
        unitPrice: 120000,
        subtotal: 120000,
      },
    ],
    totalQuantity: 1,
    subtotal: 120000,
    deliveryFee: 0,
    total: 120000,
    paymentMethod: 'BANK_TRANSFER',
    paymentStatus: 'PAID',
    status: 'PREPARING',
    notes: 'Retira su prima alrededor de las 17:00 hs.',
  },
  {
    id: 'ord-004',
    orderNumber: 'PED-2026-104',
    date: '01/11/2026 18:20',
    rawDate: '2026-11-01T18:20:00',
    customerName: 'Guillermo Ariel Cáceres',
    customerPhone: '0971 889 421',
    deliveryType: 'DELIVERY',
    location: {
      latitude: -25.2981,
      longitude: -57.5843,
      address: 'Avda. Eusebio Ayala km 4.5',
      reference: 'Taller mecánico al lado de la farmacia',
      city: 'Fernando de la Mora',
    },
    items: [
      {
        barcode: '6936664357003',
        brand: 'MYSTICAL',
        name: 'ZANZIBARA ASADA - EAU DE PARFUM',
        size: '30 ml / 1.0 fl.oz.',
        quantity: 2,
        unitPrice: 110000,
        subtotal: 220000,
      },
    ],
    totalQuantity: 2,
    subtotal: 220000,
    deliveryFee: 25000,
    total: 245000,
    paymentMethod: 'CASH_ON_DELIVERY',
    paymentStatus: 'PAID',
    status: 'DELIVERED',
  },
];

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: INITIAL_ORDERS,
  selectedOrder: null,
  isDetailModalOpen: false,

  openDetailModal: (order) => {
    set({ selectedOrder: order, isDetailModalOpen: true });
  },

  closeDetailModal: () => {
    set({ selectedOrder: null, isDetailModalOpen: false });
  },

  updateOrderStatus: (id, newStatus) => {
    set((state) => ({
      orders: state.orders.map((ord) =>
        ord.id === id ? { ...ord, status: newStatus } : ord
      ),
      selectedOrder:
        state.selectedOrder?.id === id
          ? { ...state.selectedOrder, status: newStatus }
          : state.selectedOrder,
    }));
  },

  addOrder: (order) => {
    set((state) => ({
      orders: [order, ...state.orders],
    }));
  },
}));
