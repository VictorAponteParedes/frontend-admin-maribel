import { httpClient } from '@/lib/httpClient';
import {
  BulkImportProductItem,
  BulkImportSummary,
  Product,
  ProductFormData,
} from '../types/product.types';
import { StockEntry } from '../types/stockEntry.types';

export interface ProductsResponseData {
  items: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

function normalizeToIsoDate(dateStr?: string): string | undefined {
  if (!dateStr) return undefined;
  const trimmed = dateStr.trim();
  if (!trimmed) return undefined;
  if (trimmed.includes('/')) {
    const parts = trimmed.split('/');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
  }
  return trimmed;
}

export const productsService = {
  fetchProducts: async (params?: {
    search?: string;
    brand?: string;
    category?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<Product[]> => {
    const response = await httpClient.get('/products', {
      params: {
        limit: params?.limit ?? 500,
        ...params,
      },
    });

    const data: ProductsResponseData = response.data.data;
    return data.items || [];
  },

  fetchStockEntries: async (): Promise<StockEntry[]> => {
    const response = await httpClient.get('/products/stock-entries');
    return response.data.data || [];
  },

  bulkImport: async (
    items: BulkImportProductItem[],
  ): Promise<BulkImportSummary> => {
    const response = await httpClient.post('/products/bulk-import', { items });
    return response.data.data.summary;
  },

  createProduct: async (productData: ProductFormData): Promise<Product> => {
    const payload = {
      barcode: productData.barcode,
      name: productData.name,
      brandName: productData.brand,
      size: productData.size,
      categoryName: productData.category,
      categoryId: productData.categoryId,
      costPrice: productData.costPrice,
      sellingPrice: productData.price,
      initialStock: productData.totalIn ?? 0,
      receptionDate: normalizeToIsoDate(productData.receptionDate),
      imageId: productData.imageId || undefined,
    };

    const response = await httpClient.post('/products', payload);
    return response.data.data;
  },

  addStockEntry: async (
    productId: string,
    entryData: {
      quantity: number;
      unitCost?: number;
      batchNumber?: string;
      notes?: string;
      entryDate?: string;
    },
  ) => {
    const payload = {
      quantity: entryData.quantity,
      unitCost: entryData.unitCost,
      batchNumber: entryData.batchNumber,
      notes: entryData.notes,
      entryDate: normalizeToIsoDate(entryData.entryDate),
    };

    const response = await httpClient.post(
      `/products/${productId}/stock-entry`,
      payload,
    );
    return response.data.data;
  },

  updateProduct: async (
    id: string,
    updates: {
      isWebVisible?: boolean;
      webBadge?: string;
      webPrice?: number;
      categoryId?: string;
      categoryName?: string;
      imageId?: string;
      name?: string;
      price?: number;
      costPrice?: number;
    }
  ): Promise<Product> => {
    const response = await httpClient.patch(`/products/${id}`, updates);
    return response.data.data;
  },
};
