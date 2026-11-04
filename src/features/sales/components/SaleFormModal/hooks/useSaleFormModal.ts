import { useState, useCallback } from 'react';
import { Customer } from '@/features/customers/types/customer.types';
import { CartItem } from '@/features/sales/types/sale.types';
import { useSalesStore } from '@/store/useSalesStore';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useOrdersStore } from '@/store/useOrdersStore';
import { toast } from '@/store/useToastStore';
import { useTranslation } from '@/locale';
import { useSaleCart } from './useSaleCart';
import { useSaleScanner } from './useSaleScanner';
import { useSalePreload } from './useSalePreload';

export type { CartItem };

export const useSaleFormModal = () => {
  const { t } = useTranslation(['sales', 'translation']);
  const { closeCreateModal, addSale, clearPendingOrderSale } = useSalesStore();
  const { getByBarcode, deductStock } = useInventoryStore();

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const clearErrors = useCallback(() => {
    setErrorMessage('');
  }, []);

  const resetAllMessages = useCallback(() => {
    setErrorMessage('');
    setSuccessMessage('');
  }, []);

  // 1. Hook de Gestión del Carrito
  const cart = useSaleCart({
    onError: setErrorMessage,
    onClearError: clearErrors,
  });

  // 2. Hook de Escaneo y Búsqueda de Productos
  const scanner = useSaleScanner({
    onAddToCart: cart.handleAddToCart,
    onError: setErrorMessage,
    onClearError: clearErrors,
  });

  // 3. Hook de Precarga de Datos (Pedidos Web / Limpieza al Abrir)
  const preload = useSalePreload({
    onPreloadCart: cart.setCartItems,
    onPreloadCustomer: setSelectedCustomer,
    onResetMessages: resetAllMessages,
    onFocusSearch: scanner.focusSearchInput,
  });

  // 4. Registro y Cierre de Venta
  const handleSaveSale = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (cart.cartItems.length === 0) {
      setErrorMessage(t('form.errors.emptyCart'));
      return;
    }

    // Validación de stock
    for (const item of cart.cartItems) {
      const product = getByBarcode(item.barcode);
      if (!product || product.stock < item.quantity) {
        setErrorMessage(
          t('form.errors.insufficientStock', {
            product: item.name,
            count: product ? product.stock : 0,
          })
        );
        return;
      }
    }

    // Descontar inventario local optimista
    for (const item of cart.cartItems) {
      deductStock(item.barcode, item.quantity);
    }

    try {
      const createdSale = await addSale({
        orderId: preload.pendingOrderSale?.orderId,
        customerId: selectedCustomer?.id,
        customerCode: selectedCustomer?.code ? String(selectedCustomer.code) : undefined,
        customerName: selectedCustomer ? selectedCustomer.name : t('customerSelect.casualCustomer'),
        customerPhone: selectedCustomer?.phone,
        customerAddress: selectedCustomer?.address,
        status: 'CONFIRMED',
        items: cart.cartItems.map((item) => ({
          barcode: item.barcode,
          brand: item.brand,
          name: item.name,
          size: item.size,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });

      setSuccessMessage(t('saleSaved'));

      if (preload.pendingOrderSale) {
        useOrdersStore.getState().updateOrderStatus(preload.pendingOrderSale.orderId, 'DELIVERED');
        toast.success(
          '¡Venta completada!',
          `Pedido #${preload.pendingOrderSale.orderNumber} facturado y actualizado a "Entregado"`
        );
        clearPendingOrderSale();
      } else {
        toast.success(
          '¡Venta completada!',
          `${createdSale.saleNumber} • ${cart.totalQuantity} unidades registradas`
        );
      }

      setTimeout(() => {
        closeCreateModal();
      }, 600);
    } catch {
      setErrorMessage(t('errors.saveFailed') || 'Error al registrar la venta en el servidor.');
    }
  };

  return {
    state: {
      isCreateModalOpen: preload.isCreateModalOpen,
      pendingOrderSale: preload.pendingOrderSale,
      searchInput: scanner.searchInput,
      cartItems: cart.cartItems,
      selectedCustomer,
      errorMessage,
      successMessage,
      isSearchingLive: scanner.isSearchingLive,
      liveSearchResults: scanner.liveSearchResults,
      products: scanner.products,
      customers: preload.customers,
      totalQuantity: cart.totalQuantity,
      totalAmount: cart.totalAmount,
    },
    refs: {
      searchInputRef: scanner.searchInputRef,
    },
    actions: {
      setSearchInput: scanner.setSearchInput,
      setIsSearchingLive: scanner.setIsSearchingLive,
      setSelectedCustomer,
      handleAddToCart: cart.handleAddToCart,
      handleScanSubmit: scanner.handleScanSubmit,
      handleUpdateQuantity: cart.handleUpdateQuantity,
      handleRemoveItem: cart.handleRemoveItem,
      handleClearCart: cart.handleClearCart,
      handleSaveSale,
      closeCreateModal,
    },
  };
};
