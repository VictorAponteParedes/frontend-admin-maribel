import React from 'react';
import { Search, Plus, Minus, Trash2 } from 'lucide-react';
import { WebProduct, ComboItemSelection } from '../../types/webCatalog.types';
import { formatGuarani } from '@/utils/formatters';

interface CreateComboProductSelectorProps {
  products: WebProduct[];
  selectedItems: ComboItemSelection[];
  searchProduct: string;
  onSearchChange: (value: string) => void;
  onAddItem: (productId: string) => void;
  onDecreaseQuantity: (productId: string) => void;
  onRemoveItem: (productId: string) => void;
}

export const CreateComboProductSelector: React.FC<CreateComboProductSelectorProps> = ({
  products,
  selectedItems,
  searchProduct,
  onSearchChange,
  onAddItem,
  onDecreaseQuantity,
  onRemoveItem,
}) => {
  const totalUnits = selectedItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="border border-stone-200 rounded-2xl p-6 bg-stone-50/50 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-sm font-bold text-stone-900 block leading-tight">
            Seleccionar Perfumes del Inventario *
          </span>
          <span className="text-xs text-stone-500">
            El stock físico se descontará automáticamente de cada fragancia al registrarse la venta.
          </span>
        </div>
        <span className="text-xs font-bold text-maribel-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 self-start sm:self-auto">
          {totalUnits} unidades en total
        </span>
      </div>

      {/* Buscador de perfumes del stock */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchProduct}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por fragancia, marca o referencia para añadir al combo..."
          className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-stone-800 outline-none focus:border-maribel-700 shadow-xs"
        />
      </div>

      {/* Lista desplegable para añadir */}
      <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 divide-y divide-stone-100 bg-white border border-stone-200 rounded-xl p-2.5 shadow-xs">
        {products.map((prod) => (
          <div
            key={prod.id}
            className="pt-2 first:pt-0 flex items-center justify-between text-xs px-2 py-1.5 hover:bg-stone-50/80 rounded-lg transition-colors"
          >
            <div>
              <span className="font-semibold text-stone-900">{prod.name}</span>
              <span className="text-[11px] text-stone-500 ml-2">
                ({prod.brand} · Stock: <strong className="text-stone-700">{prod.stockQuantity} un.</strong>)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-stone-700">
                Gs. {formatGuarani(prod.webPrice || prod.sellingPrice)}
              </span>
              <button
                type="button"
                onClick={() => onAddItem(prod.id)}
                className="px-2.5 py-1.5 bg-rose-50 hover:bg-maribel-700 hover:text-white text-maribel-700 font-bold rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Perfumes ya seleccionados en el combo */}
      {selectedItems.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-stone-200/80">
          <span className="text-xs font-bold text-stone-700 block uppercase tracking-wider">
            Perfumes incluidos en este combo:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {selectedItems.map((item) => (
              <div
                key={item.productId}
                className="bg-white border border-stone-200 rounded-xl p-3 flex items-center justify-between text-xs shadow-xs"
              >
                <div>
                  <span className="font-bold text-stone-900 block truncate max-w-[180px]">
                    {item.productName}
                  </span>
                  <span className="text-stone-400 text-[11px] block">{item.brand}</span>
                  <span className="text-stone-600 font-semibold text-[11px] mt-0.5 block">
                    Gs. {formatGuarani(item.originalPrice * item.quantity)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Control de cantidad */}
                  <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                    <button
                      type="button"
                      onClick={() => onDecreaseQuantity(item.productId)}
                      className="p-1 text-stone-500 hover:text-stone-800 cursor-pointer"
                      title="Disminuir"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 font-bold text-xs text-stone-800">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onAddItem(item.productId)}
                      className="p-1 text-stone-500 hover:text-stone-800 cursor-pointer"
                      title="Aumentar"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.productId)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Quitar del combo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
