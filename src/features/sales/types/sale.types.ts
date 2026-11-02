export interface SaleItem {
  barcode: string;
  brand: string;
  name: string;
  size: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  saleNumber: string;
  date: string;
  customerCode?: string;
  customerName: string;
  items: SaleItem[];
  totalQuantity: number;
  total: number;
}

export interface SaleFormData {
  barcode: string;
  quantity: number;
  customerCode?: string;
  customerName?: string;
  date?: string;
}
