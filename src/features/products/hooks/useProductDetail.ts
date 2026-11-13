import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInventoryStore } from "@/store/useInventoryStore";
import { useStockEntryStore } from "@/store/useStockEntryStore";
import { RoutesView } from "@/navigation/routes";
import { StockEntry } from "../types/stockEntry.types";
import { Product } from "../types/product.types";
import { productsService } from "../services/products.service";

export interface ProductDetailFinancialMetrics {
  costPrice: number;
  profit: number;
  marginPercent: number;
  totalStockValueCost: number;
  totalStockValueSale: number;
  projectedTotalProfit: number;
  bestMarginLot?: {
    batchNumber?: string | null;
    date: string;
    unitCost: number;
    margin: number;
    marginPercent: number;
  } | null;
}

export const useProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, getById } = useInventoryStore();
  const { entries } = useStockEntryStore();
  const [apiEntries, setApiEntries] = useState<StockEntry[]>([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);

  const product: Product | undefined = useMemo(() => {
    return getById(id || "") || products.find((p) => p.id === id);
  }, [id, getById, products]);

  useEffect(() => {
    let isMounted = true;
    if (product?.id) {
      setIsLoadingEntries(true);
      productsService
        .fetchProductStockEntries(product.id)
        .then((data) => {
          if (isMounted) setApiEntries(data);
        })
        .catch(() => {})
        .finally(() => {
          if (isMounted) setIsLoadingEntries(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [product?.id]);

  const productEntries: StockEntry[] = useMemo(() => {
    if (!product) return [];
    if (apiEntries.length > 0) return apiEntries;
    return entries
      .filter((e) => e.barcode === product.barcode)
      .map((e) => {
        const sellingPrice = product.price || 0;
        const unitCost = e.unitCost || 0;
        const lotMargin =
          sellingPrice > 0 && unitCost > 0 ? sellingPrice - unitCost : 0;
        const lotMarginPercent =
          sellingPrice > 0 && unitCost > 0
            ? Math.round((lotMargin / sellingPrice) * 100)
            : 0;
        return {
          ...e,
          sellingPrice,
          lotMargin,
          lotMarginPercent,
        };
      });
  }, [apiEntries, entries, product]);

  const metrics: ProductDetailFinancialMetrics = useMemo(() => {
    if (!product) {
      return {
        costPrice: 0,
        profit: 0,
        marginPercent: 0,
        totalStockValueCost: 0,
        totalStockValueSale: 0,
        projectedTotalProfit: 0,
        bestMarginLot: null,
      };
    }

    const costPrice = product.costPrice || Math.round(product.price * 0.65);
    const profit = product.profit || product.price - costPrice;
    const marginPercent =
      product.price > 0 ? Math.round((profit / product.price) * 100) : 0;
    const totalStockValueCost = product.stock * costPrice;
    const totalStockValueSale = product.stock * product.price;
    const projectedTotalProfit = product.stock * profit;

    let bestMarginLot = null;
    if (productEntries.length > 0) {
      const validLots = productEntries.filter(
        (e) =>
          (e.lotMarginPercent ?? 0) > 0 ||
          (e.unitCost > 0 && product.price > e.unitCost),
      );
      if (validLots.length > 0) {
        const sorted = [...validLots].sort((a, b) => {
          const marginA =
            a.lotMarginPercent ??
            Math.round(((product.price - a.unitCost) / product.price) * 100);
          const marginB =
            b.lotMarginPercent ??
            Math.round(((product.price - b.unitCost) / product.price) * 100);
          return marginB - marginA;
        });
        const top = sorted[0];
        const marginVal = top.lotMargin ?? product.price - top.unitCost;
        const marginPct =
          top.lotMarginPercent ??
          (product.price > 0
            ? Math.round((marginVal / product.price) * 100)
            : 0);
        bestMarginLot = {
          batchNumber: top.batchNumber,
          date: top.date,
          unitCost: top.unitCost,
          margin: marginVal,
          marginPercent: marginPct,
        };
      }
    }

    return {
      costPrice,
      profit,
      marginPercent,
      totalStockValueCost,
      totalStockValueSale,
      projectedTotalProfit,
      bestMarginLot,
    };
  }, [product, productEntries]);

  const handleBackToInventory = () => {
    navigate(RoutesView.PRODUCTS);
  };

  const handleRecordEntry = () => {
    if (product) {
      const params = new URLSearchParams({
        barcode: product.barcode,
        productId: product.id,
      });
      navigate(`${RoutesView.STOCK_ENTRY}?${params.toString()}`);
      return;
    }
    navigate(RoutesView.STOCK_ENTRY);
  };

  return {
    product,
    metrics,
    productEntries,
    isLoadingEntries,
    actions: {
      handleBackToInventory,
      handleRecordEntry,
    },
  };
};
