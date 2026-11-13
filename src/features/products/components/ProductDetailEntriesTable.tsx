import React, { useMemo } from 'react';
import { Clock, ArrowDownRight, Award, Layers, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { StockEntry } from '../types/stockEntry.types';

export interface ProductDetailEntriesTableProps {
  entries: StockEntry[];
  sellingPrice?: number;
}

export const ProductDetailEntriesTable: React.FC<ProductDetailEntriesTableProps> = ({
  entries,
  sellingPrice = 0,
}) => {
  // Encontrar el ID de la entrada que tuvo el mejor margen de ganancia
  const bestEntryId = useMemo(() => {
    if (!entries.length || sellingPrice <= 0) return null;
    let highestMargin = -Infinity;
    let bestId: string | null = null;

    entries.forEach((entry) => {
      if (entry.unitCost > 0) {
        const margin = entry.lotMargin ?? (sellingPrice - entry.unitCost);
        if (margin > highestMargin) {
          highestMargin = margin;
          bestId = entry.id;
        }
      }
    });

    return highestMargin > 0 ? bestId : null;
  }, [entries, sellingPrice]);

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-stone-700" />
          <div>
            <h3 className="font-serif font-bold text-stone-900 text-base">
              Historial de Compras, Lotes y Márgenes ({entries.length})
            </h3>
            <p className="text-xs text-stone-500">
              Registro histórico de recepciones por fecha y análisis de rentabilidad por lote frente al precio de venta fijo ({formatCurrency(sellingPrice)})
            </p>
          </div>
        </div>
      </div>

      {entries.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] border-b border-stone-200">
              <tr>
                <th className="px-5 py-3.5">Fecha Recepción</th>
                <th className="px-5 py-3.5">N° Lote</th>
                <th className="px-5 py-3.5 text-center">Cantidad</th>
                <th className="px-5 py-3.5 text-right">Precio de Compra</th>
                <th className="px-5 py-3.5 text-right">Inversión Total</th>
                <th className="px-5 py-3.5 text-right">Margen del Lote</th>
                <th className="px-5 py-3.5 text-center">Rendimiento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {entries.map((entry) => {
                const isBest = entry.id === bestEntryId;
                const margin =
                  entry.lotMargin ??
                  (sellingPrice > 0 && entry.unitCost > 0 ? sellingPrice - entry.unitCost : 0);
                const marginPercent =
                  entry.lotMarginPercent ??
                  (sellingPrice > 0 && entry.unitCost > 0
                    ? Math.round((margin / sellingPrice) * 100)
                    : 0);

                return (
                  <tr
                    key={entry.id}
                    className={`transition-colors ${
                      isBest ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-stone-50/70'
                    }`}
                  >
                    {/* Fecha de recepción */}
                    <td className="px-5 py-4 font-mono text-[12px] font-medium text-stone-800">
                      {entry.date ||
                        (entry as { dateFormatted?: string }).dateFormatted ||
                        ((entry as { entryDate?: string }).entryDate
                          ? new Date((entry as { entryDate?: string }).entryDate!).toLocaleDateString('es-ES')
                          : 'Recepción inicial')}
                    </td>

                    {/* N° Lote */}
                    <td className="px-5 py-4">
                      {entry.batchNumber ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-stone-100 text-stone-700 border border-stone-200">
                          <Layers className="w-3 h-3 mr-1 text-stone-400" />
                          {entry.batchNumber}
                        </span>
                      ) : (
                        <span className="text-stone-400 text-[11px] italic">Sin lote</span>
                      )}
                    </td>

                    {/* Cantidad recibida */}
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <ArrowDownRight className="w-3 h-3 mr-0.5" />
                        +{entry.quantity} un.
                      </span>
                    </td>

                    {/* Costo Unitario de Compra */}
                    <td className="px-5 py-4 text-right font-medium text-stone-900 font-mono text-[12px]">
                      {formatCurrency(entry.unitCost)}
                    </td>

                    {/* Total Inversión Lote */}
                    <td className="px-5 py-4 text-right font-mono text-stone-600">
                      {formatCurrency(entry.totalCost || entry.unitCost * entry.quantity)}
                    </td>

                    {/* Margen de ese lote frente al precio de venta */}
                    <td className="px-5 py-4 text-right">
                      <div className="font-mono font-bold text-emerald-700 text-[12px]">
                        +{formatCurrency(margin)}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {marginPercent}% margen
                      </div>
                    </td>

                    {/* Rendimiento / Badge Mayor Margen */}
                    <td className="px-5 py-4 text-center">
                      {isBest ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs">
                          <Award className="w-3 h-3 mr-1 text-amber-600" />
                          Mayor Margen
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[11px] text-stone-500">
                          <TrendingUp className="w-3 h-3 mr-1 text-stone-400" />
                          Estándar
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center text-xs text-stone-400">
          No hay entradas ni compras registradas para este producto aún.
        </div>
      )}
    </div>
  );
};
