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
  const { getByBarcode } = useInventoryStore();
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
      // Precargar productos desde la orden vinculada
      const preloadedCart: CartItem[] = pendingOrderSale.items.map((item) => {
        const invProduct =
          getByBarcode(item.barcode) ||
          useInventoryStore.getState().getById(item.barcode);

        return {
          barcode: item.barcode,
          brand: item.brand,
          name: item.name,
          size: item.size || invProduct?.size || '100 ml',
          unitPrice: item.unitPrice,
          stock: invProduct ? invProduct.stock : 99,
          quantity: item.quantity,
          subtotal: item.subtotal,
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
  }, [isCreateModalOpen, pendingOrderSale, customers, getByBarcode]);

  return {
    isCreateModalOpen,
    pendingOrderSale,
    customers,
  };
};
