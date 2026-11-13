import React from 'react';
import { DollarSign, ShoppingCart, Award } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { Product } from '../types/product.types';
import { ProductDetailFinancialMetrics } from '../hooks/useProductDetail';

export interface ProductDetailFinancialCardsProps {
  product: Product;
  metrics: ProductDetailFinancialMetrics;
}

export const ProductDetailFinancialCards: React.FC<ProductDetailFinancialCardsProps> = ({
  product,
  metrics,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Costo Promedio Actual */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center justify-between text-stone-400 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Costo Promedio Actual
          </span>
          <DollarSign className="w-4 h-4 text-stone-400" />
        </div>
        <p className="text-2xl font-bold font-serif text-stone-800">
          {formatCurrency(metrics.costPrice)}
        </p>
        <p className="text-[11px] text-stone-400 mt-1">Costo ponderado de inventario (PPP)</p>
      </div>

      {/* Precio Venta al Público */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center justify-between text-stone-400 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Precio de Venta
          </span>
          <ShoppingCart className="w-4 h-4 text-maribel-700" />
        </div>
        <p className="text-2xl font-bold font-serif text-stone-900">
          {formatCurrency(product.price)}
        </p>
        <p className="text-[11px] text-stone-400 mt-1">Precio fijo para el cliente final</p>
      </div>

      {/* Margen de Ganancia Actual */}
      <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs bg-gradient-to-br from-white to-emerald-50/30">
        <div className="flex items-center justify-between text-emerald-700 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Margen de Ganancia Actual
          </span>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
            {metrics.marginPercent}%
          </span>
        </div>
        <p className="text-2xl font-bold font-serif text-emerald-700">
          +{formatCurrency(metrics.profit)}
        </p>
        <p className="text-[11px] text-emerald-600/90 mt-1">Ganancia neta por unidad vendida</p>
      </div>

      {/* Mayor Margen Histórico por Lote */}
      <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs bg-gradient-to-br from-white to-amber-50/20">
        <div className="flex items-center justify-between text-amber-600 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
            Mejor Margen por Lote
          </span>
          <Award className="w-4 h-4 text-amber-500" />
        </div>
        {metrics.bestMarginLot ? (
          <>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold font-serif text-amber-800">
                {metrics.bestMarginLot.marginPercent}%
              </p>
              <span className="text-xs font-semibold text-amber-700">
                (+{formatCurrency(metrics.bestMarginLot.margin)})
              </span>
            </div>
            <p className="text-[11px] text-amber-700/80 mt-1 truncate">
              {metrics.bestMarginLot.batchNumber ? `Lote ${metrics.bestMarginLot.batchNumber} • ` : ''}
              Compra a {formatCurrency(metrics.bestMarginLot.unitCost)}
            </p>
          </>
        ) : (
          <>
            <p className="text-2xl font-bold font-serif text-stone-700">
              {metrics.marginPercent}%
            </p>
            <p className="text-[11px] text-stone-400 mt-1">Margen de compra inicial</p>
          </>
        )}
      </div>
    </div>
  );
};
