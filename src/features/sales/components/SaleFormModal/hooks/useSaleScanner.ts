import React, { useState, useRef, useMemo } from 'react';
import { Product } from '@/features/products/types/product.types';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useTranslation } from '@/locale';

interface UseSaleScannerProps {
  onAddToCart: (product: Product, quantity?: number) => boolean;
  onError: (msg: string) => void;
  onClearError: () => void;
}

export const useSaleScanner = ({
  onAddToCart,
  onError,
  onClearError,
}: UseSaleScannerProps) => {
  const { t } = useTranslation(['sales']);
  const { products, getByBarcode } = useInventoryStore();

  const [searchInput, setSearchInput] = useState('');
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const focusSearchInput = (delay = 50) => {
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, delay);
  };

  const clearSearch = () => {
    setSearchInput('');
    setIsSearchingLive(false);
    focusSearchInput();
  };

  // Filtrado en vivo de productos por código, nombre o marca
  const liveSearchResults: Product[] = useMemo(() => {
    const trimmed = searchInput.trim().toLowerCase();
    if (trimmed.length < 2) return [];

    return products
      .filter(
        (p) =>
          p.barcode.toLowerCase().includes(trimmed) ||
          p.name.toLowerCase().includes(trimmed) ||
          p.brand.toLowerCase().includes(trimmed)
      )
      .slice(0, 6);
  }, [searchInput, products]);

  // Escaneo directo con Enter o botón "Agregar"
  const handleScanSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onClearError();

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
      const added = onAddToCart(matchedProduct, 1);
      if (added) {
        clearSearch();
      }
    } else {
      onError(t('form.errors.productNotFound'));
    }
  };

  return {
    searchInput,
    setSearchInput,
    isSearchingLive,
    setIsSearchingLive,
    searchInputRef,
    liveSearchResults,
    products,
    clearSearch,
    handleScanSubmit,
    focusSearchInput,
  };
};
