export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  isActive: boolean;
}

export interface ProductFormData {
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  description: string;
}
