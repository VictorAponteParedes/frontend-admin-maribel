import { httpClient } from '@/lib/httpClient';
import { Sale } from '../types/sale.types';

export interface SaleQueryParams {
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  page?: number;
  limit?: number;
}

export interface SalesResponseData {
  items: Sale[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SaleMetrics {
  totalCount: number;
  totalAmount: number;
  totalUnits: number;
  todayAmount: number;
}

export interface CreateSaleItemPayload {
  barcode: string;
  brand: string;
  name: string;
  size?: string;
  quantity: number;
  unitPrice: number;
  productId?: string;
}

export interface CreateSalePayload {
  orderId?: string;
  customerId?: string;
  customerCode?: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  items: CreateSaleItemPayload[];
  status?: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  paymentMethod?: string;
}

export const salesService = {
  fetchSales: async (params?: SaleQueryParams): Promise<SalesResponseData> => {
    const cleanParams: Record<string, string | number> = {};

    if (params?.search?.trim()) cleanParams.search = params.search.trim();
    if (params?.startDate?.trim()) cleanParams.startDate = params.startDate.trim();
    if (params?.endDate?.trim()) cleanParams.endDate = params.endDate.trim();
    if (params?.status) cleanParams.status = params.status;
    if (params?.page) cleanParams.page = params.page;
    cleanParams.limit = params?.limit ?? 50;

    const response = await httpClient.get('/sales', {
      params: cleanParams,
    });

    return response.data.data;
  },

  fetchSaleById: async (id: string): Promise<Sale> => {
    const response = await httpClient.get(`/sales/${id}`);
    return response.data.data;
  },

  createSale: async (payload: CreateSalePayload): Promise<Sale> => {
    // Sanitizar UUIDs para evitar enviar cadenas vacías que rechazaría class-validator
    const cleanPayload: CreateSalePayload = {
      ...payload,
      orderId: payload.orderId && payload.orderId.trim() ? payload.orderId.trim() : undefined,
      customerId: payload.customerId && payload.customerId.trim() ? payload.customerId.trim() : undefined,
      customerCode: payload.customerCode && payload.customerCode.trim() ? payload.customerCode.trim() : undefined,
      customerPhone: payload.customerPhone && payload.customerPhone.trim() ? payload.customerPhone.trim() : undefined,
      customerAddress: payload.customerAddress && payload.customerAddress.trim() ? payload.customerAddress.trim() : undefined,
    };

    const response = await httpClient.post('/sales', cleanPayload);
    return response.data.data;
  },

  fetchSaleMetrics: async (): Promise<SaleMetrics> => {
    const response = await httpClient.get('/sales/metrics');
    return response.data.data;
  },

  deleteSale: async (id: string): Promise<void> => {
    await httpClient.delete(`/sales/${id}`);
  },
};
