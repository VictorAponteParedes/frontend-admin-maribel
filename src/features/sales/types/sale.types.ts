export interface CartItem {
  barcode: string;
  brand: string;
  name: string;
  size: string;
  unitPrice: number;
  stock: number;
  quantity: number;
  subtotal: number;
}

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
  time: string;
  customerCode?: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  items: SaleItem[];
  totalQuantity: number;
  total: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
}

export interface SaleFormData {
  barcode: string;
  quantity: number;
  customerCode?: string;
  customerName?: string;
  date?: string;
  time?: string;
}
