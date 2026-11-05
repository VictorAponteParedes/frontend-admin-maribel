export interface Product {
  id: string;
  barcode: string;         // Código de barras
  brand: string;           // Marca del producto
  name: string;            // Descripción del producto
  size: string;            // Medida (ej: 85 ml / 2.9 fl. oz)
  category?: string;       // Nombre de categoría
  categoryId?: string | null;
  categorySlug?: string | null;
  totalIn: number;         // Ingreso acumulado
  totalSold: number;       // Venta acumulada
  stock: number;           // Saldo Inventario
  costPrice: number;       // Precio unitario de compra
  price: number;           // Precio unitario de venta
  profit: number;          // Ganancia unitaria (price - costPrice)
  receptionDate: string;   // Fecha de recepción (DD/MM/AAAA)
  isActive: boolean;
  isWebVisible?: boolean;
  webBadge?: string | null;
  webPrice?: number | null;
  imageUrl?: string | null;
  imageId?: string | null;
}

export interface ProductFormData {
  barcode: string;
  brand: string;
  name: string;
  size: string;
  category?: string;
  categoryId?: string;
  costPrice?: number;
  price: number;
  totalIn: number;
  receptionDate?: string;
}

export interface BulkImportProductItem {
  barcode: string;
  name: string;
  brandName: string;
  size?: string;
  category?: string;
  costPrice?: number;
  sellingPrice?: number;
  quantity?: number;
  receptionDate?: string;
}

export interface BulkImportSummary {
  totalProcessed: number;
  inserted: number;
  updated: number;
  errorsCount: number;
  errors: Array<{ barcode: string; error: string }>;
}
