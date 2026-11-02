export type OrderStatus =
  | "PENDING"
  | "PREPARING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type DeliveryType = "DELIVERY" | "PICKUP";

export type PaymentMethod =
  | "CASH_ON_DELIVERY"
  | "BANK_TRANSFER"
  | "QR"
  | "CARD";

export type PaymentStatus = "PAID" | "PENDING";

export interface OrderItem {
  barcode: string;
  brand: string;
  name: string;
  size?: string;
  variant?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderLocation {
  latitude: number;
  longitude: number;
  address?: string;
  reference?: string;
  city?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  rawDate: string;
  customerName: string;
  customerPhone: string;
  deliveryType: DeliveryType;
  location?: OrderLocation;
  items: OrderItem[];
  totalQuantity: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  notes?: string;
}
