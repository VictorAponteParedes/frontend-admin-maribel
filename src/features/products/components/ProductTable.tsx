import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/features/products/types/product.types';
import { formatCurrency } from '@/utils/formatters';
import { RoutesView } from '@/navigation/routes';
import { useTranslation } from '@/locale';
import { Button } from '@/components/ui';
import { useSettingsStore } from '@/features/settings/store/useSettingsStore';
import { Barcode, Eye, TrendingUp, Calendar, Tag, AlertTriangle, PackagePlus } from 'lucide-react';

export interface ProductTableProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  const { t } = useTranslation(['inventory', 'translation']);
  const navigate = useNavigate();
  const lowStockThreshold = useSettingsStore(
    (state) => state.settings.lowStockThreshold ?? 5
  );

  const handleViewDetail = (productId: string) => {
    navigate(RoutesView.productDetail(productId));
  };

  const handleRestock = (product: Product) => {
    const params = new URLSearchParams({
      barcode: product.barcode,
      productId: product.id,
    });
    navigate(`${RoutesView.STOCK_ENTRY}?${params.toString()}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] border-b border-stone-200 select-none">
          <tr>
            <th className="px-5 py-3.5">{t('table.codeSku')}</th>
            <th className="px-4 py-3.5 whitespace-nowrap">{t('table.brand')}</th>
            <th className="px-5 py-3.5">{t('table.description')}</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Categoría</th>
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
            const isOutOfStock = product.stock <= 0;
            const isLowStock = !isOutOfStock && product.stock <= lowStockThreshold;

            return (
              <tr
                key={product.id}
                className={`transition-colors ${
                  isOutOfStock
                    ? 'bg-rose-50/75 hover:bg-rose-100/70 border-l-4 border-l-rose-500'
                    : isLowStock
                    ? 'bg-amber-50/40 hover:bg-amber-50/80 border-l-4 border-l-amber-400'
                    : 'hover:bg-stone-50/70'
                }`}
              >
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

                {/* Categoría */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  {product.category ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-rose-50/80 text-maribel-800 border border-rose-200/60">
                      <Tag className="w-3 h-3 text-maribel-700" />
                      <span>{product.category}</span>
                    </span>
                  ) : (
                    <span className="text-stone-300 text-[11px]">-</span>
                  )}
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
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      isOutOfStock
                        ? 'bg-rose-600 text-white shadow-2xs'
                        : isLowStock
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {(isOutOfStock || isLowStock) && (
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                    )}
                    <span>
                      {isOutOfStock
                        ? `AGOTADO · 0 ${t('units')}`
                        : `${product.stock} ${t('units')}`}
                    </span>
                  </span>
                </td>

                {/* Botón de Detalle y Reposición Rápida */}
                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                  <div className="inline-flex items-center gap-1.5">
                    {isOutOfStock && (
                      <Button
                        type="button"
                        variant="primary"
                        size="xs"
                        leftIcon={<PackagePlus className="w-3.5 h-3.5" />}
                        onClick={() => handleRestock(product)}
                        title="Reponer stock de este producto"
                      >
                        Reponer
                      </Button>
                    )}
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
                  </div>
                </td>
              </tr>
            );
          })}

          {products.length === 0 && (
            <tr>
              <td colSpan={13} className="px-5 py-12 text-center text-stone-400">
                {t('table.noProductsFound')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
