import React from 'react';
import { Clock, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { useTranslation } from '@/locale';
import { StockEntry } from '../types/stockEntry.types';

export interface ProductDetailEntriesTableProps {
  entries: StockEntry[];
}

export const ProductDetailEntriesTable: React.FC<ProductDetailEntriesTableProps> = ({
  entries,
}) => {
  const { t } = useTranslation(['inventory', 'translation']);

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-stone-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-stone-400" />
          <h3 className="font-serif font-bold text-stone-900 text-base">
            {t('detail.entriesHistorySection', { count: entries.length })}
          </h3>
        </div>
      </div>

      {entries.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] border-b border-stone-200">
              <tr>
                <th className="px-5 py-3">{t('detail.date')}</th>
                <th className="px-5 py-3 text-center">{t('detail.qtyReceived')}</th>
                <th className="px-5 py-3 text-right">{t('detail.unitCost')}</th>
                <th className="px-5 py-3 text-right">{t('detail.totalLotCost')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-[11px] text-stone-700">
                    {entry.date}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <ArrowDownRight className="w-3 h-3 mr-0.5" />
                      {t('table.plusUnitsTag', { count: entry.quantity })}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium text-stone-800 font-mono">
                    {formatCurrency(entry.unitCost)}
                  </td>
                  <td className="px-5 py-3.5 text-right font-bold text-stone-900 font-mono">
                    {formatCurrency(entry.totalCost)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center text-xs text-stone-400">
          {t('detail.noEntriesArchived')}
        </div>
      )}
    </div>
  );
};
