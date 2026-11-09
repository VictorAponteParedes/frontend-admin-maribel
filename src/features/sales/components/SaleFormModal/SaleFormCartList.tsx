import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, Minus, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui';
import { CartItem } from '@/features/sales/types/sale.types';
import { formatCurrency } from '@/utils/formatters';
import { useTranslation } from '@/locale';

interface SaleFormCartListProps {
  cartItems: CartItem[];
  totalQuantity: number;
  onUpdateQuantity: (barcode: string, nextQty: number) => void;
  onRemoveItem: (barcode: string) => void;
  onClearCart: () => void;
}

export const SaleFormCartList: React.FC<SaleFormCartListProps> = ({
  cartItems,
  totalQuantity,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const { t } = useTranslation(['sales']);

  return (
    <div className="space-y-2 pt-2 border-t border-stone-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShoppingBag className="w-4 h-4 text-maribel-700" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
            {t('form.cart.title')}
          </h4>
          {cartItems.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-maribel-50 text-maribel-800 text-[10px] font-bold border border-rose-200">
              {t('form.cart.itemsBadge', { count: cartItems.length })} • {totalQuantity} uds
            </span>
          )}
        </div>

        {cartItems.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={onClearCart}
            className="!text-rose-600 hover:!text-rose-800 hover:!bg-rose-50"
          >
            {t('form.cart.clearCart')}
          </Button>
        )}
      </div>

      {cartItems.length > 0 ? (
        <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
          {cartItems.map((item) => {
            const exceedsStock = item.quantity > item.stock;
            return (
              <motion.div
                key={item.barcode}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-3.5 rounded-2xl flex flex-col gap-2.5 shadow-2xs border ${
                  exceedsStock
                    ? 'bg-rose-50/90 border-rose-400'
                    : 'bg-rose-50/40 border-rose-200/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Información del Perfume */}
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white border border-rose-100 flex items-center justify-center text-maribel-700 shrink-0 shadow-2xs mt-0.5">
                      <Package className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-maribel-800 block truncate">
                        {item.brand}
                      </span>
                      <h5 className="text-xs font-bold text-stone-900 truncate">
                        {item.name}
                      </h5>
                      <div className="flex items-center gap-2 text-[10px] text-stone-500 font-mono mt-0.5">
                        <span>{item.size}</span>
                        <span>•</span>
                        <span>{formatCurrency(item.unitPrice)} c/u</span>
                      </div>
                    </div>
                  </div>

                  {/* Controles de Cantidad, Subtotal y Eliminar */}
                  <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-rose-100">
                    {/* Selector de Cantidad */}
                    <div className="flex items-center rounded-xl border border-stone-200 bg-white overflow-hidden shadow-2xs">
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => onUpdateQuantity(item.barcode, item.quantity - 1)}
                        className="p-1 text-stone-500 hover:text-stone-900 rounded-none"
                        aria-label="Disminuir"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span
                        className={`w-8 text-center text-xs font-bold select-none ${
                          exceedsStock ? 'text-rose-700' : 'text-stone-900'
                        }`}
                      >
                        {item.quantity}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => onUpdateQuantity(item.barcode, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-1 rounded-none disabled:opacity-30"
                        aria-label="Aumentar"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-[85px]">
                      <span className="text-xs font-bold font-serif text-maribel-900 block">
                        {formatCurrency(item.subtotal)}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-semibold ${
                          exceedsStock ? 'text-rose-600' : 'text-stone-500'
                        }`}
                      >
                        Stock: {item.stock}
                      </span>
                    </div>

                    {/* Botón Eliminar */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => onRemoveItem(item.barcode)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-100/70 rounded-lg"
                      aria-label="Quitar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Alerta cuando el pedido supera el stock real disponible */}
                {exceedsStock && (
                  <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-rose-100/90 border border-rose-300 text-rose-800 text-[11px]">
                    <div className="flex items-center gap-1.5 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>
                        Stock insuficiente: pidieron <strong>{item.quantity} uds</strong> pero solo tienes{' '}
                        <strong>{item.stock} uds</strong> en inventario.
                      </span>
                    </div>
                    {item.stock > 0 && (
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.barcode, item.stock)}
                        className="px-2.5 py-1 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold text-[10px] shrink-0 transition-colors cursor-pointer"
                      >
                        Ajustar a {item.stock} uds
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Estado Vacío del Carrito */
        <div className="p-6 bg-stone-50 border border-dashed border-stone-200 rounded-2xl text-center space-y-1.5">
          <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-2">
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
          </div>
          <p className="text-xs font-bold text-stone-700">
            {t('form.cart.emptyTitle')}
          </p>
          <p className="text-[11px] text-stone-400 max-w-xs mx-auto leading-relaxed">
            {t('form.cart.emptySubtitle')}
          </p>
        </div>
      )}
    </div>
  );
};
