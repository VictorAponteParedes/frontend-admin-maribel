import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useStockEntryStore } from '@/store/useStockEntryStore';
import { RoutesView } from '@/navigation/routes';
import { StockEntry } from '../types/stockEntry.types';
import { Product } from '../types/product.types';

export interface ProductDetailFinancialMetrics {
  costPrice: number;
  profit: number;
  marginPercent: number;
  totalStockValueCost: number;
  totalStockValueSale: number;
  projectedTotalProfit: number;
}

export const useProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, getById } = useInventoryStore();
  const { entries } = useStockEntryStore();

  const product: Product | undefined = useMemo(() => {
    return getById(id || '') || products.find((p) => p.id === id);
  }, [id, getById, products]);

  const metrics: ProductDetailFinancialMetrics = useMemo(() => {
    if (!product) {
      return {
        costPrice: 0,
        profit: 0,
        marginPercent: 0,
        totalStockValueCost: 0,
        totalStockValueSale: 0,
        projectedTotalProfit: 0,
      };
    }

    const costPrice = product.costPrice || Math.round(product.price * 0.65);
    const profit = product.profit || product.price - costPrice;
    const marginPercent = product.price > 0 ? Math.round((profit / product.price) * 100) : 0;
    const totalStockValueCost = product.stock * costPrice;
    const totalStockValueSale = product.stock * product.price;
    const projectedTotalProfit = product.stock * profit;

    return {
      costPrice,
      profit,
      marginPercent,
      totalStockValueCost,
      totalStockValueSale,
      projectedTotalProfit,
    };
  }, [product]);

  const productEntries: StockEntry[] = useMemo(() => {
    if (!product) return [];
    return entries.filter((e) => e.barcode === product.barcode);
  }, [entries, product]);

  const handleBackToInventory = () => {
    navigate(RoutesView.PRODUCTS);
  };

  const handleRecordEntry = () => {
    navigate(RoutesView.STOCK_ENTRY);
  };

  return {
    product,
    metrics,
    productEntries,
    actions: {
      handleBackToInventory,
      handleRecordEntry,
    },
  };
};
