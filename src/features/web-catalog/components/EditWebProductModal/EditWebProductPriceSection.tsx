import React from 'react';
import { formatGuarani } from '@/utils/formatters';

interface EditWebProductPriceSectionProps {
  sellingPrice: number;
  webPrice: string;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EditWebProductPriceSection: React.FC<EditWebProductPriceSectionProps> = ({
  sellingPrice,
  webPrice,
  onPriceChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3.5 pt-1">
      <div>
        <label className="block text-[11px] font-medium text-stone-500 mb-1">
          Precio de Inventario (Fijo)
        </label>
        <div className="px-3 py-2 rounded-xl bg-stone-100 border border-stone-200 text-xs font-bold text-stone-700">
          Gs. {formatGuarani(sellingPrice)}
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
          Precio Especial Web (Opcional)
        </label>
        <input
          type="text"
          inputMode="numeric"
          value={webPrice}
          onChange={onPriceChange}
          placeholder={`Ej. ${formatGuarani(sellingPrice)}`}
          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-maribel-700 outline-none focus:bg-white focus:border-maribel-700"
        />
        <span className="text-[10px] text-stone-400 mt-0.5 block">
          Si lo dejas vacío, usará el precio de tienda.
        </span>
      </div>
    </div>
  );
};
