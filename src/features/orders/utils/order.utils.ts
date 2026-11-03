import {
  OrderStatus,
  PaymentMethod,
} from '@/features/orders/types/order.types';
import { formatCurrency } from '@/utils/formatters';
import { t } from '@/locale';

export const buildWhatsAppLink = (
  phone: string,
  customerName: string,
  orderNumber: string,
  total: number
): string => {
  const digitsOnly = phone.replace(/\D/g, '');
  // Si empieza con 0 (ej: 0981...), asumimos código país Paraguay +595
  const internationalNumber = digitsOnly.startsWith('0')
    ? `595${digitsOnly.slice(1)}`
    : digitsOnly;

  const formattedTotal = formatCurrency(total);
  const message = t('orders.whatsapp.message', {
    name: customerName,
    orderNumber,
    total: formattedTotal,
  });

  return `https://wa.me/${internationalNumber}?text=${encodeURIComponent(
    message
  )}`;
};

export const buildGoogleMapsLink = (lat: number, lng: number): string => {
  return `https://www.google.com/maps?q=${lat},${lng}`;
};

export interface StatusBadgeConfig {
  label: string;
  className: string;
}

export const getOrderStatusConfig = (
  status: OrderStatus,
  translateFn: (key: string) => string = t
): StatusBadgeConfig => {
  switch (status) {
    case 'PENDING':
      return {
        label: translateFn('orders.status.pending'),
        className: 'bg-amber-100 text-amber-800 border-amber-300',
      };
    case 'PREPARING':
      return {
        label: translateFn('orders.status.preparing'),
        className: 'bg-blue-100 text-blue-800 border-blue-300',
      };
    case 'SHIPPED':
      return {
        label: translateFn('orders.status.shipped'),
        className: 'bg-purple-100 text-purple-800 border-purple-300',
      };
    case 'DELIVERED':
      return {
        label: translateFn('orders.status.delivered'),
        className: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      };
    case 'CANCELLED':
      return {
        label: translateFn('orders.status.cancelled'),
        className: 'bg-rose-100 text-rose-800 border-rose-300',
      };
    default:
      return {
        label: status,
        className: 'bg-stone-100 text-stone-800 border-stone-300',
      };
  }
};

export const getPaymentMethodLabel = (
  method: PaymentMethod,
  translateFn: (key: string) => string = t
): string => {
  switch (method) {
    case 'CASH_ON_DELIVERY':
      return translateFn('orders.payment.cashOnDelivery');
    case 'BANK_TRANSFER':
      return translateFn('orders.payment.bankTransfer');
    case 'QR':
      return translateFn('orders.payment.qr');
    case 'CARD':
      return translateFn('orders.payment.card');
    default:
      return method;
  }
};
