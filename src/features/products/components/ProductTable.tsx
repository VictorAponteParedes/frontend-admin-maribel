import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/features/products/types/product.types';
import { formatCurrency } from '@/utils/formatters';
import { RoutesView } from '@/navigation/routes';
import { useTranslation } from '@/locale';
import { Button } from '@/components/ui';
import { Barcode, Eye, TrendingUp, Calendar } from 'lucide-react';

export interface ProductTableProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  const { t } = useTranslation(['inventory', 'translation']);
  const navigate = useNavigate();

  const handleViewDetail = (productId: string) => {
    navigate(RoutesView.productDetail(productId));
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] border-b border-stone-200 select-none">
          <tr>
            <th className="px-5 py-3.5">{t('table.codeSku')}</th>
            <th className="px-4 py-3.5 whitespace-nowrap">{t('table.brand')}</th>
            <th className="px-5 py-3.5">{t('table.description')}</th>
            <th className="px-4 py-3.5">{t('size')}</th>
            <th className="px-4 py-3.5 whitespace-nowrap">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>{t('table.receptionDate')}</span>
              </span>
            </th>
            <th className="px-4 py-3.5 text-right whitespace-nowrap">{t('table.purchasePrice')}</th>
            <th className="px-4 py-3.5 text-right whitespace-nowrap">{t('table.sellingPrice')}</th>
            <th className="px-4 py-3.5 text-right whitespace-nowrap">
              <span className="flex items-center justify-end space-x-1 text-emerald-700">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{t('table.profit')}</span>
              </span>
            </th>
            <th className="px-4 py-3.5 text-center">{t('table.entry')}</th>
            <th className="px-4 py-3.5 text-center">{t('table.sold')}</th>
            <th className="px-4 py-3.5 text-center whitespace-nowrap">{t('table.stockBalance')}</th>
            <th className="px-4 py-3.5 text-center">{t('table.actions')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {products.map((product) => {
            const profit = product.profit || product.price - product.costPrice;

            return (
              <tr key={product.id} className="hover:bg-stone-50/70 transition-colors">
                {/* Código de barras */}
                <td className="px-5 py-3.5 font-mono text-[11px] text-stone-600 whitespace-nowrap">
                  <div className="flex items-center space-x-1.5">
                    <Barcode className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{product.barcode}</span>
                  </div>
                </td>

                {/* Marca */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md inline-block">
                    {product.brand}
                  </span>
                </td>

                {/* Descripción */}
                <td className="px-5 py-3.5">
                  <p className="text-stone-900 font-medium text-xs truncate max-w-xs" title={product.name}>
                    {product.name}
                  </p>
                </td>

                {/* Medida */}
                <td className="px-4 py-3.5 text-stone-500 whitespace-nowrap text-[11px]">
                  {product.size}
                </td>

                {/* Fecha de Recepción */}
                <td className="px-4 py-3.5 text-stone-600 whitespace-nowrap font-mono text-[11px]">
                  {product.receptionDate || '02/11/2026'}
                </td>

                {/* Precio Compra */}
                <td className="px-4 py-3.5 text-stone-600 text-right whitespace-nowrap font-medium">
                  {formatCurrency(product.costPrice)}
                </td>

                {/* Precio Venta */}
                <td className="px-4 py-3.5 font-bold text-stone-900 text-right whitespace-nowrap">
                  {formatCurrency(product.price)}
                </td>

                {/* Ganancia Unitaria */}
                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                    <span>+{formatCurrency(profit)}</span>
                  </span>
                </td>

                {/* Ingreso acumulado */}
                <td className="px-4 py-3.5 text-center text-stone-500 font-medium">
                  {product.totalIn}
                </td>

                {/* Venta acumulada */}
                <td className="px-4 py-3.5 text-center text-maribel-700 font-semibold">
                  {product.totalSold}
                </td>

                {/* Saldo Stock */}
                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      product.stock === 0
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : product.stock <= 5
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {product.stock} {t('units')}
                  </span>
                </td>

                {/* Botón de Detalle que navega a vista dedicada */}
                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                  <Button
                    type="button"
                    variant="secondary"
                    size="xs"
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                    onClick={() => handleViewDetail(product.id)}
                    className="hover:bg-maribel-700 hover:text-white"
                    title={t('table.viewDetailTooltip')}
                  >
                    {t('table.detail')}
                  </Button>
                </td>
              </tr>
            );
          })}

          {products.length === 0 && (
            <tr>
              <td colSpan={12} className="px-5 py-12 text-center text-stone-400">
                {t('table.noProductsFound')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
