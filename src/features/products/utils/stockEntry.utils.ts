import { Product } from '../types/product.types';
import { StockEntryCalculatedMetrics } from '../types/stockEntry.types';

export const generateDefaultBatchNumber = (): string => {
  const currentYear = new Date().getFullYear();
  const randomSuffix = Math.floor(Math.random() * 90 + 10);
  return `LOT-${currentYear}-FRAG-B${randomSuffix}`;
};

export const getTodayFormattedDate = (): string => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
};

export const calculateStockEntryMetrics = (
  quantity: number,
  costPrice: number,
  sellingPrice: number,
  existingProduct?: Product
): StockEntryCalculatedMetrics => {
  const safeQty = Math.max(0, quantity || 0);
  const safeCost = Math.max(0, costPrice || 0);
  const safeSale = Math.max(0, sellingPrice || 0);

  const unitProfit = safeSale - safeCost;
  const marginPercent = safeSale > 0 ? Math.round((unitProfit / safeSale) * 100) : 0;
  const totalCost = safeQty * safeCost;
  const totalSales = safeQty * safeSale;
  const totalProfit = safeQty * unitProfit;

  const existingStock = existingProduct ? existingProduct.stock : 0;
  const projectedStock = existingStock + safeQty;

  return {
    unitProfit,
    marginPercent,
    totalCost,
    totalSales,
    totalProfit,
    existingStock,
    projectedStock,
    existingProduct,
  };
};
