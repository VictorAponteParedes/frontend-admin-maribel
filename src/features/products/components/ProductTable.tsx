import React from 'react';
import { Product } from '@/features/products/types/product.types';
import { formatCurrency } from '@/utils/formatters';
import { t } from '@/lang';
import { Barcode, Eye } from 'lucide-react';

export interface ProductTableProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, onSelectProduct }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] border-b border-stone-200">
          <tr>
            <th className="px-5 py-3.5">{t('inventory.barcode')}</th>
            <th className="px-5 py-3.5">{t('inventory.brand')}</th>
            <th className="px-5 py-3.5">{t('inventory.description')}</th>
            <th className="px-5 py-3.5">{t('inventory.size')}</th>
            <th className="px-5 py-3.5 text-right">{t('inventory.price')}</th>
            <th className="px-4 py-3.5 text-center">{t('inventory.totalIn')}</th>
            <th className="px-4 py-3.5 text-center">{t('inventory.totalSold')}</th>
            <th className="px-5 py-3.5 text-center">{t('inventory.stock')}</th>
            <th className="px-4 py-3.5 text-center">{t('common.actions')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-stone-50/70 transition-colors">
              <td className="px-5 py-3.5 font-mono text-[11px] text-stone-600 flex items-center space-x-1.5 whitespace-nowrap">
                <Barcode className="w-3.5 h-3.5 text-stone-400" />
                <span>{product.barcode}</span>
              </td>
              <td className="px-5 py-3.5 font-semibold text-stone-800 whitespace-nowrap">
                {product.brand}
              </td>
              <td className="px-5 py-3.5 text-stone-700 max-w-xs truncate" title={product.name}>
                {product.name}
              </td>
              <td className="px-5 py-3.5 text-stone-500 whitespace-nowrap">
                {product.size}
              </td>
              <td className="px-5 py-3.5 font-semibold text-stone-900 text-right whitespace-nowrap">
                {formatCurrency(product.price)}
              </td>
              <td className="px-4 py-3.5 text-center text-stone-500 font-medium">
                {product.totalIn}
              </td>
              <td className="px-4 py-3.5 text-center text-maribel-700 font-medium">
                {product.totalSold}
              </td>
              <td className="px-5 py-3.5 text-center whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    product.stock === 0
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : product.stock <= 5
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {product.stock} {t('inventory.units')}
                </span>
              </td>
              <td className="px-4 py-3.5 text-center whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => onSelectProduct?.(product)}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 bg-stone-100 hover:bg-maribel-50 hover:text-maribel-800 text-stone-700 rounded-lg text-xs font-semibold transition-colors"
                  title="Ver detalle del producto"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Detalle</span>
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={9} className="px-5 py-8 text-center text-stone-400">
                No se encontraron productos en el inventario.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
