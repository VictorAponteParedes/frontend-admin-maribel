import React from 'react';
import { OrderItem } from '@/features/orders/types/order.types';
import { formatCurrency } from '@/utils/formatters';
import { useTranslation } from '@/locale';

interface OrderDetailProductsTableProps {
  items: OrderItem[];
  totalQuantity: number;
}

export const OrderDetailProductsTable: React.FC<OrderDetailProductsTableProps> = ({
  items,
  totalQuantity,
}) => {
  const { t } = useTranslation(['orders', 'translation']);

  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
        {t('modal.requestedProducts', {
          count: totalQuantity,
          unit:
            totalQuantity === 1
              ? t('table.unitSingular')
              : t('table.unitPlural'),
        })}
      </h4>
      <div className="border border-stone-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase text-[10px]">
            <tr>
              <th className="py-2.5 px-3">{t('modal.productCol')}</th>
              <th className="py-2.5 px-3">{t('modal.sizeCol')}</th>
              <th className="py-2.5 px-3 text-center">{t('modal.quantityCol')}</th>
              <th className="py-2.5 px-3 text-right">{t('modal.priceCol')}</th>
              <th className="py-2.5 px-3 text-right">{t('modal.subtotalCol')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {items.map((item, idx) => (
              <tr key={idx} className="hover:bg-stone-50/50">
                <td className="py-3 px-3">
                  <p className="font-semibold text-stone-900">{item.brand}</p>
                  <p className="text-[11px] text-stone-500">{item.name}</p>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {t('modal.codePrefix')} {item.barcode}
                  </span>
                </td>
                <td className="py-3 px-3 text-stone-600">
                  {item.size || item.variant || '-'}
                </td>
                <td className="py-3 px-3 text-center font-bold text-stone-800">
                  {item.quantity}
                </td>
                <td className="py-3 px-3 text-right text-stone-700 font-mono">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="py-3 px-3 text-right font-bold text-stone-900 font-mono">
                  {formatCurrency(item.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
