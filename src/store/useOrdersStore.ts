import { create } from "zustand";
import { Order, OrderStatus } from "@/features/orders/types/order.types";
import {
  ordersService,
  OrderQueryParams,
  OrderMetrics,
} from "@/features/orders/services/orders.service";

export interface OrdersState {
  orders: Order[];
  totalItems: number;
  isLoading: boolean;
  selectedOrder: Order | null;
  isDetailModalOpen: boolean;
  metrics: OrderMetrics;
  openDetailModal: (order: Order) => void;
  closeDetailModal: () => void;
  fetchOrders: (params?: OrderQueryParams) => Promise<void>;
  fetchMetrics: () => Promise<void>;
  updateOrderStatus: (id: string, newStatus: OrderStatus) => Promise<void>;
  addOrder: (order: Order) => void;
}

const DEFAULT_METRICS: OrderMetrics = {
  totalCount: 0,
  pendingCount: 0,
  preparingCount: 0,
  shippedCount: 0,
  deliveredCount: 0,
};

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  totalItems: 0,
  isLoading: false,
  selectedOrder: null,
  isDetailModalOpen: false,
  metrics: DEFAULT_METRICS,

  openDetailModal: (order) => {
    set({ selectedOrder: order, isDetailModalOpen: true });
  },

  closeDetailModal: () => {
    set({ selectedOrder: null, isDetailModalOpen: false });
  },

  fetchOrders: async (params?: OrderQueryParams) => {
    set({ isLoading: true });
    try {
      const data = await ordersService.fetchOrders(params);
      set({
        orders: data.items || [],
        totalItems: data.meta?.total ?? (data.items ? data.items.length : 0),
      });
    } catch {
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMetrics: async () => {
    try {
      const metrics = await ordersService.fetchOrderMetrics();
      if (metrics) {
        set({ metrics });
      }
    } catch {}
  },

  updateOrderStatus: async (id: string, newStatus: OrderStatus) => {
    set((state) => ({
      orders: state.orders.map((ord) =>
        ord.id === id ? { ...ord, status: newStatus } : ord,
      ),
      selectedOrder:
        state.selectedOrder?.id === id
          ? { ...state.selectedOrder, status: newStatus }
          : state.selectedOrder,
    }));

    try {
      await ordersService.updateOrderStatus(id, newStatus);

      get().fetchMetrics();
    } catch {
      get().fetchOrders();
    }
  },

  addOrder: (order) => {
    set((state) => ({
      orders: [order, ...state.orders],
      totalItems: state.totalItems + 1,
    }));
  },
}));
