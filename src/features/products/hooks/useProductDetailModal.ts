import { useMemo } from 'react';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useStockEntryStore } from '@/store/useStockEntryStore';
import { useSalesStore } from '@/store/useSalesStore';
import { StockEntry } from '../types/stockEntry.types';

export interface ProductSaleMovement {
  saleNumber: string;
  date: string;
  customerName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export const useProductDetailModal = () => {
  const { selectedProductForDetail, closeProductDetail } = useInventoryStore();
  const { entries } = useStockEntryStore();
  const { sales } = useSalesStore();

  const product = selectedProductForDetail;

  const productEntries = useMemo<StockEntry[]>(() => {
    if (!product) return [];
    return entries.filter((entry) => entry.barcode === product.barcode);
  }, [entries, product]);

  const productSales = useMemo<ProductSaleMovement[]>(() => {
    if (!product) return [];
    return sales.flatMap((sale) =>
      sale.items
        .filter((item) => item.barcode === product.barcode)
        .map((item) => ({
          saleNumber: sale.saleNumber,
          date: sale.date,
          customerName: sale.customerName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
        }))
    );
  }, [sales, product]);

  return {
    isOpen: Boolean(product),
    product,
    productEntries,
    productSales,
    onClose: closeProductDetail,
  };
};
