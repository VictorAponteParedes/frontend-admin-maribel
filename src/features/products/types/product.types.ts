export interface Product {
  id: string;
  barcode: string;         // Código de barras
  brand: string;           // Marca del producto
  name: string;            // Descripción del producto
  size: string;            // Medida (ej: 85 ml / 2.9 fl. oz)
  totalIn: number;         // Ingreso acumulado
  totalSold: number;       // Venta acumulada
  stock: number;           // Saldo Inventario
  price: number;           // Precio venta
  isActive: boolean;
}

export interface ProductFormData {
  barcode: string;
  brand: string;
  name: string;
  size: string;
  price: number;
  totalIn: number;
}
