import React from 'react';
import { ShoppingBag, Barcode } from 'lucide-react';
import { SaleItem } from '@/features/sales/types/sale.types';
import { formatCurrency } from '@/utils/formatters';
import { useTranslation } from '@/locale';

interface SaleDetailItemsTableProps {
  items: SaleItem[];
  totalQuantity: number;
  total: number;
}

export const SaleDetailItemsTable: React.FC<SaleDetailItemsTableProps> = ({
  items,
  totalQuantity,
  total,
}) => {
  const { t } = useTranslation(['sales', 'translation']);

  return (
    <section className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
        <div className="flex items-center space-x-2">
          <ShoppingBag className="w-4 h-4 text-maribel-700" />
          <h3 className="font-serif font-bold text-stone-900 text-sm">
            {t('detail.itemsSoldSection', { count: items.length })}
          </h3>
        </div>
        <span className="text-xs text-stone-500">
          {t('detail.totalUnitsLabel')}{' '}
          <strong>{t('unitsTag', { count: totalQuantity })}</strong>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] border-b border-stone-200">
            <tr>
              <th className="px-5 py-3.5">{t('barcode')}</th>
              <th className="px-5 py-3.5">{t('brand')}</th>
              <th className="px-5 py-3.5">{t('description')}</th>
              <th className="px-5 py-3.5">{t('size')}</th>
              <th className="px-4 py-3.5 text-center">{t('quantity')}</th>
              <th className="px-5 py-3.5 text-right">{t('unitPrice')}</th>
              <th className="px-5 py-3.5 text-right">{t('subtotal')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {items.map((item, idx) => (
              <tr key={`${item.barcode}-${idx}`} className="hover:bg-stone-50/70 transition-colors">
                <td className="px-5 py-3.5 font-mono text-[11px] text-stone-600 whitespace-nowrap">
                  <div className="flex items-center space-x-1.5">
                    <Barcode className="w-3.5 h-3.5 text-stone-400" />
                    <span>{item.barcode}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 font-semibold text-stone-900 whitespace-nowrap">
                  {item.brand}
                </td>
                <td className="px-5 py-3.5 text-stone-800 font-medium">
                  {item.name}
                </td>
                <td className="px-5 py-3.5 text-stone-500 whitespace-nowrap">
                  {item.size}
                </td>
                <td className="px-4 py-3.5 text-center font-bold text-stone-900 whitespace-nowrap">
                  <span className="inline-block px-2.5 py-0.5 bg-stone-100 text-stone-800 rounded-md">
                    {t('unitsTag', { count: item.quantity })}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right font-medium text-stone-700 whitespace-nowrap">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="px-5 py-3.5 text-right font-bold text-stone-900 whitespace-nowrap">
                  {formatCurrency(item.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-stone-50/80 border-t border-stone-200">
            <tr>
              <td colSpan={4} className="px-5 py-4 text-xs font-semibold text-stone-600">
                {t('detail.totalItemsSoldLabel')}
              </td>
              <td className="px-4 py-4 text-center font-bold text-stone-900">
                {t('unitsTag', { count: totalQuantity })}
              </td>
              <td className="px-5 py-4 text-right text-xs font-semibold text-stone-600">
                {t('detail.totalBilled')}
              </td>
              <td className="px-5 py-4 text-right font-bold text-base font-serif text-maribel-800">
                {formatCurrency(total)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
};
