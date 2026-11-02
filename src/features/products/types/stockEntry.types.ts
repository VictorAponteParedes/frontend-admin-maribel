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
