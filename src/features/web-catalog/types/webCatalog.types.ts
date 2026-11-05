export type WebCategory = string;

export type WebBadge = 'Más Vendido' | 'Tendencia' | 'Exclusivo' | 'Favorito' | 'Ninguno';

export interface WebProduct {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  size: string;
  costPrice: number;
  sellingPrice: number;
  webPrice?: number;
  stockQuantity: number;
  imageUrl: string;
  imageId?: string | null;
  isWebVisible: boolean;
  webCategory: WebCategory;
  webBadge?: WebBadge;
}

export interface ComboItemSelection {
  productId: string;
  productName: string;
  brand: string;
  quantity: number;
  originalPrice: number;
}

export interface WebCombo {
  id: string;
  title: string;
  kicker: string;
  description: string;
  fragranceCountLabel: string;
  items: ComboItemSelection[];
  originalPrice: number;
  price: number;
  savingsAmount: number;
  discountBadge: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
}
