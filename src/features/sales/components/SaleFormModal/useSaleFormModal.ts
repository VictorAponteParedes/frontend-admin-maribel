import React, { useState, useEffect, useRef } from 'react';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useSalesStore } from '@/store/useSalesStore';
import { useOrdersStore } from '@/store/useOrdersStore';
import { useCustomerStore } from '@/store/useCustomerStore';
import { toast } from '@/store/useToastStore';
import { Sale } from '@/features/sales/types/sale.types';
import { Product } from '@/features/products/types/product.types';
import { Customer } from '@/features/customers/types/customer.types';
import { useTranslation } from '@/locale';

export interface CartItem {
  barcode: string;
  brand: string;
  name: string;
  size: string;
  unitPrice: number;
  stock: number;
  quantity: number;
  subtotal: number;
}

export const useSaleFormModal = () => {
  const { t } = useTranslation(['sales', 'translation']);
  const {
    isCreateModalOpen,
    closeCreateModal,
    addSale,
    pendingOrderSale,
    clearPendingOrderSale,
  } = useSalesStore();
  const { products, getByBarcode, deductStock } = useInventoryStore();
  const { customers } = useCustomerStore();

  const [searchInput, setSearchInput] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSearchingLive, setIsSearchingLive] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Reiniciar estado o precargar desde un pedido web
  useEffect(() => {
    if (isCreateModalOpen) {
      setSearchInput('');
      setErrorMessage('');
      setSuccessMessage('');
      setIsSearchingLive(false);

      if (pendingOrderSale) {
        // Precargar productos desde la orden vinculada
        const preloadedCart: CartItem[] = pendingOrderSale.items.map((item) => {
          const invProduct = getByBarcode(item.barcode);
          return {
            barcode: item.barcode,
            brand: item.brand,
            name: item.name,
            size: item.size || invProduct?.size || '',
            unitPrice: item.unitPrice,
            stock: invProduct ? invProduct.stock : 99,
            quantity: item.quantity,
            subtotal: item.subtotal,
          };
        });
        setCartItems(preloadedCart);

        // Precargar cliente del pedido
        const matchingCustomer = customers.find(
          (c) =>
            (pendingOrderSale.customerPhone && c.phone === pendingOrderSale.customerPhone) ||
            c.name.toLowerCase() === pendingOrderSale.customerName.toLowerCase()
        );

        if (matchingCustomer) {
          setSelectedCustomer(matchingCustomer);
        } else {
          setSelectedCustomer({
            id: `temp-${Date.now()}`,
            code: 0,
            registrationDate: new Date().toLocaleDateString('es-PY'),
            name: pendingOrderSale.customerName,
            phone: pendingOrderSale.customerPhone || '',
            address: pendingOrderSale.customerAddress || '',
          });
        }
      } else {
        setCartItems([]);
        setSelectedCustomer(null);
      }

      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isCreateModalOpen, pendingOrderSale, customers, getByBarcode]);

  // Filtrado en vivo de productos por código, nombre o marca
  const trimmedSearch = searchInput.trim().toLowerCase();
  const liveSearchResults: Product[] =
    trimmedSearch.length >= 2
      ? products
          .filter(
            (p) =>
              p.barcode.toLowerCase().includes(trimmedSearch) ||
              p.name.toLowerCase().includes(trimmedSearch) ||
              p.brand.toLowerCase().includes(trimmedSearch)
          )
          .slice(0, 6)
      : [];

  // Agregar producto al carrito
  const handleAddToCart = (product: Product, quantityToAdd: number = 1) => {
    setErrorMessage('');

    if (product.stock <= 0) {
      setErrorMessage(t('form.errors.outOfStock'));
      return;
    }

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.barcode === product.barcode);

      if (existingIndex > -1) {
        const currentItem = prev[existingIndex];
        const newQuantity = currentItem.quantity + quantityToAdd;

        if (newQuantity > product.stock) {
          setErrorMessage(
            t('form.errors.stockExceeded', { count: product.stock })
          );
          return prev;
        }

        const updated = [...prev];
        updated[existingIndex] = {
          ...currentItem,
          quantity: newQuantity,
          subtotal: currentItem.unitPrice * newQuantity,
        };
        return updated;
      } else {
        if (quantityToAdd > product.stock) {
          setErrorMessage(
            t('form.errors.stockExceeded', { count: product.stock })
          );
          return prev;
        }

        const newItem: CartItem = {
          barcode: product.barcode,
          brand: product.brand,
          name: product.name,
          size: product.size,
          unitPrice: product.price,
          stock: product.stock,
          quantity: quantityToAdd,
          subtotal: product.price * quantityToAdd,
        };
        return [...prev, newItem];
      }
    });

    setSearchInput('');
    setIsSearchingLive(false);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);
  };

  // Escaneo directo con Enter o botón "Agregar"
  const handleScanSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const query = searchInput.trim();
    if (!query) return;

    const matchedProduct =
      getByBarcode(query) ||
      products.find((p) => p.barcode.toLowerCase() === query.toLowerCase()) ||
      products.find(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase())
      );

    if (matchedProduct) {
      handleAddToCart(matchedProduct, 1);
    } else {
      setErrorMessage(t('form.errors.productNotFound'));
    }
  };

  // Modificar cantidad de un producto en el carrito
  const handleUpdateQuantity = (barcode: string, nextQty: number) => {
    setErrorMessage('');

    if (nextQty <= 0) {
      handleRemoveItem(barcode);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.barcode === barcode) {
          const product = getByBarcode(barcode);
          const maxStock = product ? product.stock : item.stock;

          if (nextQty > maxStock) {
            setErrorMessage(
              t('form.errors.stockExceeded', { count: maxStock })
            );
            return item;
          }

          return {
            ...item,
            quantity: nextQty,
            subtotal: item.unitPrice * nextQty,
          };
        }
        return item;
      })
    );
  };

  // Quitar un producto del carrito
  const handleRemoveItem = (barcode: string) => {
    setCartItems((prev) => prev.filter((item) => item.barcode !== barcode));
  };

  // Vaciar carrito
  const handleClearCart = () => {
    setCartItems([]);
    setErrorMessage('');
  };

  // Totales acumulados
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + item.subtotal, 0);

  // Completar y registrar la venta multi-producto
  const handleSaveSale = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (cartItems.length === 0) {
      setErrorMessage(t('form.errors.emptyCart'));
      return;
    }

    for (const item of cartItems) {
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

    for (const item of cartItems) {
      deductStock(item.barcode, item.quantity);
    }

    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(
      today.getMonth() + 1
    ).padStart(2, '0')}/${today.getFullYear()}`;
    const formattedTime = `${String(today.getHours()).padStart(2, '0')}:${String(
      today.getMinutes()
    ).padStart(2, '0')} hs`;

    const newSaleNumber = `V-${today.getFullYear()}-${String(Date.now()).slice(-4)}`;

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      saleNumber: newSaleNumber,
      date: formattedDate,
      time: formattedTime,
      customerCode: selectedCustomer?.code ? String(selectedCustomer.code) : undefined,
      customerName: selectedCustomer ? selectedCustomer.name : t('customerSelect.casualCustomer'),
      customerPhone: selectedCustomer?.phone,
      customerAddress: selectedCustomer?.address,
      status: 'CONFIRMED',
      totalQuantity,
      total: totalAmount,
      items: cartItems.map((item) => ({
        barcode: item.barcode,
        brand: item.brand,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      })),
    };

    addSale(newSale);
    setSuccessMessage(t('saleSaved'));

    if (pendingOrderSale) {
      useOrdersStore.getState().updateOrderStatus(pendingOrderSale.orderId, 'DELIVERED');
      toast.success(
        '¡Venta completada!',
        `Pedido #${pendingOrderSale.orderNumber} facturado y actualizado a "Entregado"`
      );
      clearPendingOrderSale();
    } else {
      toast.success(
        '¡Venta completada!',
        `${newSale.saleNumber} • ${totalQuantity} unidades registradas`
      );
    }

    setTimeout(() => {
      closeCreateModal();
    }, 600);
  };

  return {
    state: {
      isCreateModalOpen,
      pendingOrderSale,
      searchInput,
      cartItems,
      selectedCustomer,
      errorMessage,
      successMessage,
      isSearchingLive,
      liveSearchResults,
      products,
      customers,
      totalQuantity,
      totalAmount,
    },
    refs: {
      searchInputRef,
    },
    actions: {
      setSearchInput,
      setIsSearchingLive,
      setSelectedCustomer,
      handleAddToCart,
      handleScanSubmit,
      handleUpdateQuantity,
      handleRemoveItem,
      handleClearCart,
      handleSaveSale,
      closeCreateModal,
    },
  };
};
