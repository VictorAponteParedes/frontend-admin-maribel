import { useEffect } from 'react';
import { Customer } from '@/features/customers/types/customer.types';
import { CartItem } from '@/features/sales/types/sale.types';
import { useCustomerStore } from '@/store/useCustomerStore';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useSalesStore } from '@/store/useSalesStore';

interface UseSalePreloadProps {
  onPreloadCart: (items: CartItem[]) => void;
  onPreloadCustomer: (customer: Customer | null) => void;
  onResetMessages: () => void;
  onFocusSearch: () => void;
}

export const useSalePreload = ({
  onPreloadCart,
  onPreloadCustomer,
  onResetMessages,
  onFocusSearch,
}: UseSalePreloadProps) => {
  const { isCreateModalOpen, pendingOrderSale } = useSalesStore();
  const { products, getByBarcode, getById } = useInventoryStore();
  const { customers } = useCustomerStore();

  useEffect(() => {
    if (useInventoryStore.getState().products.length === 0) {
      useInventoryStore.getState().fetchProducts();
    }
    if (useCustomerStore.getState().customers.length === 0) {
      useCustomerStore.getState().fetchCustomers();
    }
  }, []);

  useEffect(() => {
    if (!isCreateModalOpen) return;

    onResetMessages();

    if (pendingOrderSale) {
      // Precargar productos desde la orden vinculada cruzando stock real
      const preloadedCart: CartItem[] = pendingOrderSale.items.map((item) => {
        const normalizedCode = (item.barcode || '').trim().toLowerCase();
        const invProduct =
          getByBarcode(item.barcode) ||
          getById(item.barcode) ||
          products.find(
            (p) =>
              p.barcode.trim().toLowerCase() === normalizedCode ||
              p.id.trim().toLowerCase() === normalizedCode ||
              (p.name.trim().toLowerCase() === item.name.trim().toLowerCase() &&
                p.brand.trim().toLowerCase() === item.brand.trim().toLowerCase())
          );

        return {
          barcode: invProduct ? invProduct.barcode : item.barcode,
          brand: invProduct ? invProduct.brand : item.brand,
          name: invProduct ? invProduct.name : item.name,
          size: item.size || invProduct?.size || '100 ml',
          unitPrice: item.unitPrice,
          stock: invProduct ? invProduct.stock : 0,
          quantity: item.quantity,
          subtotal: item.unitPrice * item.quantity,
        };
      });
      onPreloadCart(preloadedCart);

      // Precargar cliente del pedido
      const matchingCustomer = customers.find(
        (c) =>
          (pendingOrderSale.customerPhone && c.phone === pendingOrderSale.customerPhone) ||
          c.name.toLowerCase() === pendingOrderSale.customerName.toLowerCase()
      );

      if (matchingCustomer) {
        onPreloadCustomer(matchingCustomer);
      } else {
        onPreloadCustomer({
          id: `temp-${Date.now()}`,
          code: 0,
          registrationDate: new Date().toLocaleDateString('es-PY'),
          name: pendingOrderSale.customerName,
          phone: pendingOrderSale.customerPhone || '',
          address: pendingOrderSale.customerAddress || '',
        });
      }
    } else {
      onPreloadCart([]);
      onPreloadCustomer(null);
    }

    onFocusSearch();
  }, [isCreateModalOpen, pendingOrderSale, customers, products, getByBarcode, getById]);

  return {
    isCreateModalOpen,
    pendingOrderSale,
    customers,
  };
};
