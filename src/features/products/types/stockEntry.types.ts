import { Product } from './product.types';

export interface StockEntry {
  id: string;
  barcode: string;
  brand: string;
  name: string;
  size: string;
  quantity: number;
  date: string;
  unitCost: number;
  totalCost: number;
}

export interface StockEntryFormData {
  barcode: string;
  quantity: number;
  unitCost: number;
  date?: string;
}

export interface StockEntryFormValues {
  barcode: string;
  brand: string;
  name: string;
  size: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  receptionDate: string;
  batchNumber: string;
}

export interface StockEntryCalculatedMetrics {
  unitProfit: number;
  marginPercent: number;
  totalCost: number;
  totalSales: number;
  totalProfit: number;
  existingStock: number;
  projectedStock: number;
  existingProduct?: Product;
}
