import React from 'react';
import { Sparkles } from 'lucide-react';
import { formatGuarani } from '@/utils/formatters';

interface CreateComboPricingSectionProps {
  normalSum: number;
  promoPrice: string;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  numericPromoPrice: number;
  calculatedSavings: number;
  discountPercent: number;
}

export const CreateComboPricingSection: React.FC<CreateComboPricingSectionProps> = ({
  normalSum,
  promoPrice,
  onPriceChange,
  numericPromoPrice,
  calculatedSavings,
  discountPercent,
}) => {
  return (
    <div className="bg-gradient-to-br from-rose-50/70 via-amber-50/40 to-white border border-rose-200/90 rounded-2xl p-6 space-y-5 shadow-xs">
      <div className="flex items-center justify-between text-sm">
        <span className="text-stone-600 font-medium">Suma normal de los perfumes individuales:</span>
        <span className="font-serif font-bold text-stone-900 text-lg">
          Gs. {formatGuarani(normalSum)}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-rose-200/60">
        <div>
          <label className="block text-xs font-bold text-[#5a061a] uppercase tracking-wide">
            Precio Promocional que decides *
          </label>
          <span className="text-xs text-stone-500">
            El precio final que verá la clienta en la tienda web
          </span>
        </div>

        <div className="relative w-full sm:w-56">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-400 pointer-events-none">
            Gs.
          </span>
          <input
            type="text"
            inputMode="numeric"
            required
            value={promoPrice}
            onChange={onPriceChange}
            placeholder="Ej. 305.000"
            className="w-full bg-white border-2 border-maribel-700 rounded-xl pl-11 pr-4 py-2.5 text-base font-bold text-maribel-800 outline-none shadow-xs focus:ring-2 focus:ring-maribel-700/20"
          />
        </div>
      </div>

      {/* Cálculo automático de Ahorro para el cliente (solo cuando escribe un precio) */}
      {numericPromoPrice > 0 && calculatedSavings > 0 && (
        <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center justify-between text-xs font-semibold text-emerald-900 animate-in fade-in duration-200 shadow-xs">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Beneficio del combo (Ahorro para la clienta):</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-base text-emerald-700">
              Gs. {formatGuarani(calculatedSavings)}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              -{discountPercent}% OFF
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
