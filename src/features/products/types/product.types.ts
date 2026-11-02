export interface Product {
  id: string;
  barcode: string;         // Código de barras
  brand: string;           // Marca del producto
  name: string;            // Descripción del producto
  size: string;            // Medida (ej: 85 ml / 2.9 fl. oz)
  totalIn: number;         // Ingreso acumulado
  totalSold: number;       // Venta acumulada
  stock: number;           // Saldo Inventario
  costPrice: number;       // Precio unitario de compra
  price: number;           // Precio unitario de venta
  profit: number;          // Ganancia unitaria (price - costPrice)
  receptionDate: string;   // Fecha de recepción (DD/MM/AAAA)
  isActive: boolean;
}

export interface ProductFormData {
  barcode: string;
  brand: string;
  name: string;
  size: string;
  costPrice?: number;
  price: number;
  totalIn: number;
  receptionDate?: string;
}
