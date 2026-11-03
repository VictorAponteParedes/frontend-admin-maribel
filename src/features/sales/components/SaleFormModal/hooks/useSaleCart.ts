import { useState, useMemo } from 'react';
import { Product } from '@/features/products/types/product.types';
import { CartItem } from '@/features/sales/types/sale.types';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useTranslation } from '@/locale';

interface UseSaleCartProps {
  onError: (msg: string) => void;
  onClearError: () => void;
}

export const useSaleCart = ({ onError, onClearError }: UseSaleCartProps) => {
  const { t } = useTranslation(['sales']);
  const { getByBarcode } = useInventoryStore();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Agregar producto al carrito
  const handleAddToCart = (product: Product, quantityToAdd: number = 1) => {
    onClearError();

    if (product.stock <= 0) {
      onError(t('form.errors.outOfStock'));
      return false;
    }

    let success = true;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.barcode === product.barcode);

      if (existingIndex > -1) {
        const currentItem = prev[existingIndex];
        const newQuantity = currentItem.quantity + quantityToAdd;

        if (newQuantity > product.stock) {
          onError(t('form.errors.stockExceeded', { count: product.stock }));
          success = false;
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
          onError(t('form.errors.stockExceeded', { count: product.stock }));
          success = false;
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

    return success;
  };

  // Modificar cantidad de un producto en el carrito
  const handleUpdateQuantity = (barcode: string, nextQty: number) => {
    onClearError();

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
            onError(t('form.errors.stockExceeded', { count: maxStock }));
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
    onClearError();
  };

  const totalQuantity = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const totalAmount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.subtotal, 0),
    [cartItems]
  );

  return {
    cartItems,
    setCartItems,
    totalQuantity,
    totalAmount,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveItem,
    handleClearCart,
  };
};
