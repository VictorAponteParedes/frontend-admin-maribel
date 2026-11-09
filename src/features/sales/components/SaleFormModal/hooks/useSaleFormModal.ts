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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (isSubmitting) return;
    clearErrors();

    if (cart.cartItems.length === 0) {
      const msg = t('form.errors.emptyCart');
      setErrorMessage(msg);
      toast.error('Carrito vacío', msg);
      return;
    }

    // Prevención de doble facturación si proviene de un pedido web ya facturado
    if (preload.pendingOrderSale?.orderId) {
      const orderAlreadyBilled = useSalesStore
        .getState()
        .sales.some((s) => s.orderId === preload.pendingOrderSale?.orderId);

      if (orderAlreadyBilled) {
        const msg = `El pedido #${preload.pendingOrderSale.orderNumber} ya cuenta con una venta registrada en el sistema. No se permite duplicar el cobro.`;
        setErrorMessage(msg);
        toast.warning('Pedido ya facturado', msg);
        closeCreateModal();
        return;
      }
    }

    // Validación de stock: solo si el producto existe en el catálogo físico y no tiene stock suficiente
    for (const item of cart.cartItems) {
      const product =
        getByBarcode(item.barcode) ||
        useInventoryStore.getState().getById(item.barcode);

      if (product && product.stock < item.quantity) {
        const errorMsg = t('form.errors.insufficientStock', {
          product: item.name,
          count: product.stock,
        });
        setErrorMessage(errorMsg);
        toast.error('Stock insuficiente', errorMsg);
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const isUuid = (val?: string): boolean =>
        Boolean(val && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val.trim()));

      const createdSale = await addSale({
        orderId: preload.pendingOrderSale?.orderId,
        customerId: isUuid(selectedCustomer?.id) ? selectedCustomer!.id : undefined,
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

      // Descontar inventario local únicamente tras confirmación exitosa del backend
      for (const item of cart.cartItems) {
        deductStock(item.barcode, item.quantity);
      }

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
    } catch (err: unknown) {
      const msg =
        err instanceof Error && err.message
          ? err.message
          : t('errors.saveFailed') || 'Error al registrar la venta en el servidor.';
      setErrorMessage(msg);
      toast.error('Error al registrar venta', msg);
    } finally {
      setIsSubmitting(false);
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
      isSubmitting,
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
