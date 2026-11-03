import { httpClient } from '@/lib/httpClient';
import {
  BulkImportProductItem,
  BulkImportSummary,
  Product,
  ProductFormData,
} from '../types/product.types';

export interface ProductsResponseData {
  items: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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
      costPrice: productData.costPrice,
      sellingPrice: productData.price,
      initialStock: productData.totalIn ?? 0,
      receptionDate: productData.receptionDate,
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
    },
  ) => {
    const response = await httpClient.post(
      `/products/${productId}/stock-entry`,
      entryData,
    );
    return response.data.data;
  },
};
