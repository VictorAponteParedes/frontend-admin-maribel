import React from 'react';
import { ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { useTranslation } from '@/locale';
import { StockEntry } from '../../types/stockEntry.types';

export interface ProductDetailModalEntriesTableProps {
  entries: StockEntry[];
}

export const ProductDetailModalEntriesTable: React.FC<ProductDetailModalEntriesTableProps> = ({
  entries,
}) => {
  const { t } = useTranslation(['inventory', 'translation']);

  return (
    <div>
      <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
        <ArrowDownRight className="w-4 h-4 text-emerald-600" />
        <span>{t('modal.stockEntriesCount', { count: entries.length })}</span>
      </h4>

      <div className="border border-stone-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-stone-500 text-[11px] border-b border-stone-200 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-2.5">{t('detail.date')}</th>
              <th className="px-4 py-2.5 text-center">{t('detail.qtyReceived')}</th>
              <th className="px-4 py-2.5 text-right">{t('modal.unitCostShort')}</th>
              <th className="px-4 py-2.5 text-right">{t('modal.totalCost')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-stone-50/60 transition-colors">
                <td className="px-4 py-2 font-mono text-[11px] text-stone-600">{entry.date}</td>
                <td className="px-4 py-2 text-center font-bold text-emerald-800">
                  +{entry.quantity} {t('units')}
                </td>
                <td className="px-4 py-2 text-right text-stone-600">
                  {formatCurrency(entry.unitCost)}
                </td>
                <td className="px-4 py-2 text-right font-semibold text-stone-900">
                  {formatCurrency(entry.totalCost)}
                </td>
              </tr>
            ))}

            {entries.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-3 text-center text-stone-400 text-xs">
                  {t('modal.noIndividualEntries')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
