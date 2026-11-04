import { create } from 'zustand';
import { Sale } from '@/features/sales/types/sale.types';
import {
  salesService,
  SaleQueryParams,
  SaleMetrics,
  CreateSalePayload,
} from '@/features/sales/services/sales.service';
import { useInventoryStore } from './useInventoryStore';

export interface PreloadedOrderSale {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  items: {
    barcode: string;
    brand: string;
    name: string;
    size?: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
}

export interface SalesState {
  sales: Sale[];
  totalItems: number;
  isLoading: boolean;
  metrics: SaleMetrics;
  isCreateModalOpen: boolean;
  selectedSaleForDetail: Sale | null;
  pendingOrderSale: PreloadedOrderSale | null;
  openCreateModal: () => void;
  openCreateModalFromOrder: (orderSale: PreloadedOrderSale) => void;
  closeCreateModal: () => void;
  clearPendingOrderSale: () => void;
  openDetailModal: (sale: Sale) => void;
  closeDetailModal: () => void;
  fetchSales: (params?: SaleQueryParams) => Promise<void>;
  fetchMetrics: () => Promise<void>;
  addSale: (saleData: CreateSalePayload | Sale) => Promise<Sale>;
  getSaleById: (id: string) => Sale | undefined;
}

const DEFAULT_METRICS: SaleMetrics = {
  totalCount: 0,
  totalAmount: 0,
  totalUnits: 0,
  todayAmount: 0,
};

export const useSalesStore = create<SalesState>((set, get) => ({
  sales: [],
  totalItems: 0,
  isLoading: false,
  metrics: DEFAULT_METRICS,
  isCreateModalOpen: false,
  selectedSaleForDetail: null,
  pendingOrderSale: null,

  openCreateModal: () => {
    set({ isCreateModalOpen: true });
  },

  openCreateModalFromOrder: (orderSale: PreloadedOrderSale) => {
    set({
      pendingOrderSale: orderSale,
      isCreateModalOpen: true,
    });
  },

  closeCreateModal: () => {
    set({ isCreateModalOpen: false });
  },

  clearPendingOrderSale: () => {
    set({ pendingOrderSale: null });
  },

  openDetailModal: (sale: Sale) => {
    set({ selectedSaleForDetail: sale });
  },

  closeDetailModal: () => {
    set({ selectedSaleForDetail: null });
  },

  fetchSales: async (params?: SaleQueryParams) => {
    set({ isLoading: true });
    try {
      const data = await salesService.fetchSales(params);
      set({
        sales: data.items || [],
        totalItems: data.meta?.total ?? (data.items ? data.items.length : 0),
      });
    } catch {
      // Si el backend no responde, mantiene el estado actual
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMetrics: async () => {
    try {
      const metrics = await salesService.fetchSaleMetrics();
      if (metrics) {
        set({ metrics });
      }
    } catch {
      // Ignora fallo silenciosamente
    }
  },

  addSale: async (saleData: CreateSalePayload | Sale): Promise<Sale> => {
    // Si viene como Sale (interfaz legacy del front), mapear a CreateSalePayload
    let payload: CreateSalePayload;

    if ('items' in saleData && saleData.items.length > 0 && 'barcode' in saleData.items[0]) {
      const legacySale = saleData as Sale & { orderId?: string; customerId?: string };
      payload = {
        orderId: legacySale.orderId,
        customerId: legacySale.customerId,
        customerCode: legacySale.customerCode,
        customerName: legacySale.customerName,
        customerPhone: legacySale.customerPhone,
        customerAddress: legacySale.customerAddress,
        items: legacySale.items.map((it) => ({
          barcode: it.barcode,
          brand: it.brand,
          name: it.name,
          size: it.size,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
        })),
        status: 'CONFIRMED',
      };
    } else {
      payload = saleData as CreateSalePayload;
    }

    try {
      const createdSale = await salesService.createSale(payload);

      set((state) => ({
        sales: [createdSale, ...state.sales],
        totalItems: state.totalItems + 1,
      }));

      // Sincronizar métricas de ventas y stock de productos en segundo plano
      get().fetchMetrics();
      useInventoryStore.getState().fetchProducts();

      return createdSale;
    } catch (error) {
      // Fallback local si el backend está desconectado
      const today = new Date();
      const fallbackSale: Sale = {
        id: `sale-${Date.now()}`,
        saleNumber: `V-${today.getFullYear()}-${String(Date.now()).slice(-4)}`,
        date: today.toLocaleDateString('es-ES'),
        time: today.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        customerCode: payload.customerCode,
        customerName: payload.customerName,
        customerPhone: payload.customerPhone,
        customerAddress: payload.customerAddress,
        items: payload.items.map((it) => ({
          ...it,
          size: it.size || '100 ml',
          subtotal: it.unitPrice * it.quantity,
        })),
        totalQuantity: payload.items.reduce((acc, it) => acc + it.quantity, 0),
        total: payload.items.reduce((acc, it) => acc + it.unitPrice * it.quantity, 0),
        status: 'CONFIRMED',
      };

      set((state) => ({
        sales: [fallbackSale, ...state.sales],
        totalItems: state.totalItems + 1,
      }));

      throw error;
    }
  },

  getSaleById: (id: string) => {
    return get().sales.find((s) => s.id === id);
  },
}));
