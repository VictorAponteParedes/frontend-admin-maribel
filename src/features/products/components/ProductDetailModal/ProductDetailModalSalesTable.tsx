import React from 'react';
import { Receipt } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { useTranslation } from '@/locale';
import { ProductSaleMovement } from '../../hooks/useProductDetailModal';

export interface ProductDetailModalSalesTableProps {
  sales: ProductSaleMovement[];
}

export const ProductDetailModalSalesTable: React.FC<ProductDetailModalSalesTableProps> = ({
  sales,
}) => {
  const { t } = useTranslation(['inventory', 'translation']);

  return (
    <div>
      <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
        <Receipt className="w-4 h-4 text-maribel-700" />
        <span>{t('modal.recordedSalesCount', { count: sales.length })}</span>
      </h4>

      <div className="border border-stone-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-stone-500 text-[11px] border-b border-stone-200 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-2.5">{t('modal.saleNumber')}</th>
              <th className="px-4 py-2.5">{t('detail.date')}</th>
              <th className="px-4 py-2.5">{t('modal.client')}</th>
              <th className="px-4 py-2.5 text-center">{t('modal.qtyShort')}</th>
              <th className="px-4 py-2.5 text-right">{t('modal.subtotal')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {sales.map((sale, i) => (
              <tr key={`${sale.saleNumber}-${i}`} className="hover:bg-stone-50/60 transition-colors">
                <td className="px-4 py-2 font-semibold text-stone-800">{sale.saleNumber}</td>
                <td className="px-4 py-2 text-stone-500 font-mono text-[11px]">{sale.date}</td>
                <td className="px-4 py-2 text-stone-700">{sale.customerName}</td>
                <td className="px-4 py-2 text-center font-bold text-maribel-800">
                  {sale.quantity} {t('units')}
                </td>
                <td className="px-4 py-2 text-right font-bold text-stone-900">
                  {formatCurrency(sale.subtotal)}
                </td>
              </tr>
            ))}

            {sales.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-3 text-center text-stone-400 text-xs">
                  {t('modal.noSalesRecorded')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
