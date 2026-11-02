import React from 'react';
import { StockEntry } from '@/features/products/types/stockEntry.types';
import { formatCurrency } from '@/utils/formatters';
import { useTranslation } from '@/locale';
import { Barcode, ArrowDownRight } from 'lucide-react';

export interface StockEntryTableProps {
  entries: StockEntry[];
}

export const StockEntryTable: React.FC<StockEntryTableProps> = ({ entries }) => {
  const { t } = useTranslation(['inventory', 'translation']);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] border-b border-stone-200">
          <tr>
            <th className="px-5 py-3.5">{t('barcode')}</th>
            <th className="px-4 py-3.5 text-center">{t('detail.qtyReceived')}</th>
            <th className="px-4 py-3.5">{t('detail.date')}</th>
            <th className="px-5 py-3.5">{t('brand')}</th>
            <th className="px-5 py-3.5">{t('description')}</th>
            <th className="px-4 py-3.5">{t('size')}</th>
            <th className="px-5 py-3.5 text-right">{t('detail.unitCost')}</th>
            <th className="px-5 py-3.5 text-right">{t('detail.totalLotCost')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {entries.map((entry) => (
            <tr key={entry.id} className="hover:bg-stone-50/70 transition-colors">
              <td className="px-5 py-3.5 font-mono text-[11px] text-stone-600 flex items-center space-x-1.5 whitespace-nowrap">
                <Barcode className="w-3.5 h-3.5 text-stone-400" />
                <span>{entry.barcode}</span>
              </td>
              <td className="px-4 py-3.5 text-center whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <ArrowDownRight className="w-3 h-3 mr-0.5" />
                  +{entry.quantity} {t('units')}
                </span>
              </td>
              <td className="px-4 py-3.5 text-stone-600 whitespace-nowrap font-mono text-[11px]">
                {entry.date}
              </td>
              <td className="px-5 py-3.5 font-semibold text-stone-900 whitespace-nowrap">
                {entry.brand}
              </td>
              <td className="px-5 py-3.5 text-stone-700 max-w-xs truncate" title={entry.name}>
                {entry.name}
              </td>
              <td className="px-4 py-3.5 text-stone-500 whitespace-nowrap">
                {entry.size}
              </td>
              <td className="px-5 py-3.5 font-medium text-stone-700 text-right whitespace-nowrap">
                {formatCurrency(entry.unitCost)}
              </td>
              <td className="px-5 py-3.5 font-bold text-stone-900 text-right whitespace-nowrap">
                {formatCurrency(entry.totalCost)}
              </td>
            </tr>
          ))}
          {entries.length === 0 && (
            <tr>
              <td colSpan={8} className="px-5 py-8 text-center text-stone-400">
                {t('table.noEntriesFound')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
