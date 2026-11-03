import React from 'react';
import { Barcode, Search, Plus, X } from 'lucide-react';
import { AppInput, Button } from '@/components/ui';
import { Product } from '@/features/products/types/product.types';
import { CartItem } from './useSaleFormModal';
import { formatCurrency } from '@/utils/formatters';
import { useTranslation } from '@/locale';

interface SaleFormProductScannerProps {
  searchInput: string;
  onSearchChange: (val: string) => void;
  onClearSearch: () => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  onSubmit: (e?: React.FormEvent) => void;
  isSearchingLive: boolean;
  liveSearchResults: Product[];
  quickProducts: Product[];
  cartItems: CartItem[];
  onAddToCart: (product: Product, quantity?: number) => void;
}

export const SaleFormProductScanner: React.FC<SaleFormProductScannerProps> = ({
  searchInput,
  onSearchChange,
  onClearSearch,
  searchInputRef,
  onSubmit,
  isSearchingLive,
  liveSearchResults,
  quickProducts,
  cartItems,
  onAddToCart,
}) => {
  const { t } = useTranslation(['sales']);

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-stone-800 flex items-center justify-between">
        <span className="flex items-center space-x-1">
          <span>{t('form.searchOrScanLabel')}</span>
          <span className="text-rose-500">*</span>
        </span>
        <span className="text-[11px] font-normal text-stone-400">
          Presiona Enter para agregar
        </span>
      </label>

      <form onSubmit={onSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <AppInput
            ref={searchInputRef}
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSubmit();
              }
            }}
            placeholder={t('form.barcodePlaceholder')}
            leftIcon={<Barcode className="w-4 h-4 text-stone-400" />}
            className="font-mono text-xs pr-8"
            autoFocus
          />
          {searchInput && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={onClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          leftIcon={<Plus className="w-4 h-4 shrink-0" />}
          className="shrink-0 whitespace-nowrap h-[41px] px-4 rounded-xl text-xs font-semibold"
        >
          {t('form.addButton')}
        </Button>
      </form>

      {/* Resultados desplegables en vivo si el usuario escribe texto */}
      {isSearchingLive && liveSearchResults.length > 0 && (
        <div className="p-1.5 bg-white border border-stone-200 rounded-2xl shadow-lg space-y-1 max-h-48 overflow-y-auto z-20">
          {liveSearchResults.map((prod) => (
            <Button
              key={prod.id}
              type="button"
              variant="ghost"
              onClick={() => onAddToCart(prod, 1)}
              className="w-full p-2 hover:!bg-rose-50/70 rounded-xl flex items-center justify-between text-left text-xs transition-colors group cursor-pointer justify-between"
            >
              <div className="truncate pr-2 text-left">
                <span className="text-[10px] font-bold text-maribel-700 uppercase block">
                  {prod.brand}
                </span>
                <p className="font-semibold text-stone-800 truncate">
                  {prod.name}
                </p>
                <span className="text-[10px] text-stone-400 font-mono">
                  SKU: {prod.barcode} • {prod.size}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-serif font-bold text-stone-900 block">
                  {formatCurrency(prod.price)}
                </span>
                <span
                  className={`text-[10px] font-semibold ${
                    prod.stock > 0 ? 'text-emerald-600' : 'text-rose-500'
                  }`}
                >
                  {prod.stock > 0
                    ? `${prod.stock} en stock`
                    : t('form.cart.noStock')}
                </span>
              </div>
            </Button>
          ))}
        </div>
      )}

      {/* Chips rápidos de catálogo con stock */}
      <div className="pt-1">
        <p className="text-[11px] text-stone-400 mb-1.5 flex items-center space-x-1">
          <Search className="w-3 h-3 text-stone-400" />
          <span>{t('form.catalogChoice')}</span>
        </p>
        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
          {quickProducts.slice(0, 6).map((p) => {
            const inCart = cartItems.find((ci) => ci.barcode === p.barcode);
            return (
              <Button
                key={p.id}
                type="button"
                size="xs"
                variant={inCart ? 'primary' : 'secondary'}
                onClick={() => onAddToCart(p, 1)}
                className={`text-[11px] font-medium rounded-xl transition-all text-left flex items-center gap-1.5 ${
                  inCart
                    ? '!bg-rose-100 !text-maribel-900 border border-rose-300 font-semibold'
                    : '!bg-stone-100 hover:!bg-stone-200/80 text-stone-700'
                }`}
              >
                <span className="font-bold">{p.brand}</span>
                <span className="truncate max-w-[120px]">{p.name}</span>
                <strong className="text-emerald-700 font-mono text-[10px]">
                  ({p.stock})
                </strong>
                {inCart && (
                  <span className="w-4 h-4 rounded-full bg-maribel-700 text-white text-[9px] flex items-center justify-center font-bold">
                    {inCart.quantity}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
