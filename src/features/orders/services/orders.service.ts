import { httpClient } from '@/lib/httpClient';
import { Order, OrderStatus } from '../types/order.types';

export interface OrderQueryParams {
  search?: string;
  status?: OrderStatus | 'ALL';
  page?: number;
  limit?: number;
}

export interface OrdersResponseData {
  items: Order[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface OrderMetrics {
  totalCount: number;
  pendingCount: number;
  preparingCount: number;
  shippedCount: number;
  deliveredCount: number;
}

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  deliveryType: 'DELIVERY' | 'PICKUP';
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
    reference?: string;
    city?: string;
  };
  items: {
    barcode: string;
    brand: string;
    name: string;
    size?: string;
    variant?: string;
    quantity: number;
    unitPrice: number;
  }[];
  deliveryFee?: number;
  paymentMethod: 'CASH_ON_DELIVERY' | 'BANK_TRANSFER' | 'QR' | 'CARD';
  paymentStatus?: 'PAID' | 'PENDING';
  status?: OrderStatus;
  notes?: string;
}

export const ordersService = {
  fetchOrders: async (params?: OrderQueryParams): Promise<OrdersResponseData> => {
    const cleanParams: Record<string, string | number> = {};

    if (params?.search?.trim()) cleanParams.search = params.search.trim();
    if (params?.status && params.status !== 'ALL') cleanParams.status = params.status;
    if (params?.page) cleanParams.page = params.page;
    cleanParams.limit = params?.limit ?? 50;

    const response = await httpClient.get('/orders', {
      params: cleanParams,
    });

    return response.data.data;
  },

  fetchOrderById: async (id: string): Promise<Order> => {
    const response = await httpClient.get(`/orders/${id}`);
    return response.data.data;
  },

  createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
    const response = await httpClient.post('/orders', payload);
    return response.data.data;
  },

  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    const response = await httpClient.patch(`/orders/${id}/status`, { status });
    return response.data.data;
  },

  deleteOrder: async (id: string): Promise<void> => {
    await httpClient.delete(`/orders/${id}`);
  },

  fetchOrderMetrics: async (): Promise<OrderMetrics> => {
    const response = await httpClient.get('/orders/metrics');
    return response.data.data;
  },
};
