import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Search,
  ArrowUpDown,
  ExternalLink,
  Percent,
  Package,
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { useInventoryStore } from '@/store/useInventoryStore';
import { Product } from '@/features/products/types/product.types';

export interface ProfitabilityReportTableProps {
  initialProducts?: Product[];
}

type SortField = 'marginPercent' | 'profit' | 'price' | 'costPrice' | 'stock';

export const ProfitabilityReportTable: React.FC<ProfitabilityReportTableProps> = ({
  initialProducts,
}) => {
  const navigate = useNavigate();
  const { products: storeProducts } = useInventoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('marginPercent');
  const [sortAsc, setSortAsc] = useState(false);

  const productsList = initialProducts || storeProducts;

  // Filtrado y ordenamiento de mayor a menor margen por defecto
  const filteredAndSorted = useMemo(() => {
    let list = productsList.map((p) => {
      const cost = p.costPrice || 0;
      const price = p.price || 0;
      const profit = p.profit || (price > cost ? price - cost : 0);
      const marginPercent =
        p.marginPercent ?? (price > 0 && cost > 0 ? Math.round((profit / price) * 100) : 0);

      return {
        ...p,
        costPrice: cost,
        profit,
        marginPercent,
      };
    });

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.barcode.toLowerCase().includes(term),
      );
    }

    return list.sort((a, b) => {
      const valA = a[sortField] ?? 0;
      const valB = b[sortField] ?? 0;
      return sortAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });
  }, [productsList, searchTerm, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // Por defecto de mayor a menor
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
      {/* Header con búsqueda y títulos */}
      <div className="p-6 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100">
              <TrendingUp className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-lg">
                Reporte de Rentabilidad y Márgenes por Producto
              </h3>
              <p className="text-xs text-stone-500">
                Productos ordenados por mayor margen de ganancia frente al costo promedio ponderado
              </p>
            </div>
          </div>
        </div>

        {/* Buscador */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por perfume o marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-400 text-stone-800"
          />
        </div>
      </div>

      {/* Tabla de Márgenes */}
      {filteredAndSorted.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 text-stone-500 uppercase tracking-wider text-[11px] border-b border-stone-200">
              <tr>
                <th className="px-6 py-3.5">Producto & Marca</th>
                <th
                  className="px-4 py-3.5 text-center cursor-pointer hover:text-stone-800 transition-colors"
                  onClick={() => handleSort('stock')}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>Stock</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-400" />
                  </div>
                </th>
                <th
                  className="px-4 py-3.5 text-right cursor-pointer hover:text-stone-800 transition-colors"
                  onClick={() => handleSort('costPrice')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Costo Promedio (PPP)</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-400" />
                  </div>
                </th>
                <th
                  className="px-4 py-3.5 text-right cursor-pointer hover:text-stone-800 transition-colors"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Precio Venta</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-400" />
                  </div>
                </th>
                <th
                  className="px-4 py-3.5 text-right cursor-pointer hover:text-stone-800 transition-colors"
                  onClick={() => handleSort('profit')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Ganancia Neta</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-400" />
                  </div>
                </th>
                <th
                  className="px-6 py-3.5 text-center cursor-pointer hover:text-stone-800 transition-colors"
                  onClick={() => handleSort('marginPercent')}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>Margen (%)</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-400" />
                  </div>
                </th>
                <th className="px-6 py-3.5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredAndSorted.map((product) => {
                const margin = product.marginPercent ?? 0;
                const isHighMargin = margin >= 45;
                const isMediumMargin = margin >= 25 && margin < 45;

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-stone-50/70 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    {/* Producto */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-stone-900 group-hover:text-maribel-700 transition-colors text-sm">
                        {product.name}
                      </div>
                      <div className="text-[11px] text-stone-400 flex items-center space-x-2 mt-0.5">
                        <span className="font-medium text-stone-600">{product.brand}</span>
                        <span>•</span>
                        <span>{product.size}</span>
                        <span>•</span>
                        <span className="font-mono">{product.barcode}</span>
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-800">
                        <Package className="w-3 h-3 mr-1 text-stone-400" />
                        {product.stock} un.
                      </span>
                    </td>

                    {/* Costo Promedio */}
                    <td className="px-4 py-4 text-right font-mono text-stone-700 text-xs">
                      {formatCurrency(product.costPrice)}
                    </td>

                    {/* Precio Venta */}
                    <td className="px-4 py-4 text-right font-mono font-bold text-stone-900 text-xs">
                      {formatCurrency(product.price)}
                    </td>

                    {/* Ganancia */}
                    <td className="px-4 py-4 text-right font-mono font-bold text-emerald-700 text-xs">
                      +{formatCurrency(product.profit)}
                    </td>

                    {/* Margen */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          isHighMargin
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : isMediumMargin
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-stone-100 text-stone-700 border border-stone-200'
                        }`}
                      >
                        <Percent className="w-3 h-3 mr-0.5" />
                        {margin}%
                      </span>
                    </td>

                    {/* Botón Ver Detalle */}
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/products/${product.id}`);
                        }}
                        className="inline-flex items-center px-3 py-1.5 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-400 hover:bg-stone-50 transition-colors text-xs font-medium"
                      >
                        <span>Ver Lotes</span>
                        <ExternalLink className="w-3 h-3 ml-1.5 text-stone-400" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center text-xs text-stone-400">
          No se encontraron productos coincidentes para el reporte.
        </div>
      )}
    </div>
  );
};
