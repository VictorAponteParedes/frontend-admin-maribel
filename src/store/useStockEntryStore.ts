import { create } from "zustand";
import {
  StockEntry,
  StockEntryFormData,
} from "@/features/products/types/stockEntry.types";
import { useInventoryStore } from "@/store/useInventoryStore";
import { productsService } from "@/features/products/services/products.service";

export interface StockEntryState {
  entries: StockEntry[];
  isLoading: boolean;
  isEntryModalOpen: boolean;
  openEntryModal: () => void;
  closeEntryModal: () => void;
  fetchEntries: () => Promise<void>;
  recordStockEntry: (data: StockEntryFormData) => boolean;
}

export const useStockEntryStore = create<StockEntryState>((set, get) => ({
  entries: [],
  isLoading: false,
  isEntryModalOpen: false,

  openEntryModal: () => set({ isEntryModalOpen: true }),
  closeEntryModal: () => set({ isEntryModalOpen: false }),

  fetchEntries: async () => {
    set({ isLoading: true });
    try {
      const items = await productsService.fetchStockEntries();
      set({ entries: items || [] });
    } catch {
    } finally {
      set({ isLoading: false });
    }
  },

  recordStockEntry: (data: StockEntryFormData): boolean => {
    const inventoryStore = useInventoryStore.getState();
    const product = inventoryStore.getByBarcode(data.barcode);

    if (!product) {
      return false;
    }

    const today = new Date();
    const formattedDate =
      data.date ||
      `${String(today.getDate()).padStart(2, "0")}/${String(
        today.getMonth() + 1,
      ).padStart(2, "0")}/${today.getFullYear()}`;

    const totalCost = data.quantity * data.unitCost;

    const newEntry: StockEntry = {
      id: `entry-${Date.now()}`,
      barcode: product.barcode,
      brand: product.brand,
      name: product.name,
      size: product.size,
      quantity: data.quantity,
      date: formattedDate,
      unitCost: data.unitCost,
      totalCost,
    };

    inventoryStore.addIncomingStock(product.barcode, data.quantity);

    set((state) => ({ entries: [newEntry, ...state.entries] }));

    get().fetchEntries();

    return true;
  },
}));
