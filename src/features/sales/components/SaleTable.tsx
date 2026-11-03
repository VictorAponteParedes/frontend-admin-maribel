import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { Sale } from '@/features/sales/types/sale.types';
import { formatCurrency } from '@/utils/formatters';
import { RoutesView } from '@/navigation/routes';
import { useTranslation } from '@/locale';
import { Eye, Receipt, Clock } from 'lucide-react';

export interface SaleTableProps {
  sales: Sale[];
  onSelectSale?: (sale: Sale) => void;
}

export const SaleTable: React.FC<SaleTableProps> = ({ sales, onSelectSale }) => {
  const { t } = useTranslation(['sales', 'translation']);
  const navigate = useNavigate();

  const handleGoToDetail = (sale: Sale) => {
    if (onSelectSale) {
      onSelectSale(sale);
    }
    navigate(RoutesView.saleDetail(sale.id));
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] border-b border-stone-200">
          <tr>
            <th className="px-5 py-3.5">{t('saleNumber')}</th>
            <th className="px-5 py-3.5">{t('dateTime')}</th>
            <th className="px-5 py-3.5">{t('customer')}</th>
            <th className="px-4 py-3.5 text-center">{t('itemsCount')}</th>
            <th className="px-5 py-3.5 text-right">{t('total')}</th>
            <th className="px-5 py-3.5 text-center">{t('common.actions')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {sales.map((sale) => (
            <tr key={sale.id} className="hover:bg-stone-50/70 transition-colors">
              <td className="px-5 py-3.5 font-semibold text-stone-900 flex items-center space-x-2">
                <Receipt className="w-4 h-4 text-maribel-700" />
                <span>{sale.saleNumber}</span>
              </td>
              <td className="px-5 py-3.5 text-stone-600 whitespace-nowrap">
                <span className="font-mono text-[11px] font-semibold text-stone-800 block">
                  {sale.date}
                </span>
                <span className="text-[10px] text-stone-400 flex items-center space-x-1 mt-0.5">
                  <Clock className="w-3 h-3" />
                  <span>{sale.time}</span>
                </span>
              </td>
              <td className="px-5 py-3.5">
                <span className="font-medium text-stone-800 block">{sale.customerName}</span>
                {sale.customerCode && (
                  <span className="text-[11px] text-stone-400 block font-mono">
                    {t('codeTag', { code: sale.customerCode })}
                  </span>
                )}
              </td>
              <td className="px-4 py-3.5 text-center">
                <span className="inline-block px-2.5 py-0.5 bg-stone-100 text-stone-700 rounded-full font-semibold">
                  {t('unitsTag', { count: sale.totalQuantity })}
                </span>
              </td>
              <td className="px-5 py-3.5 font-bold text-stone-900 text-right whitespace-nowrap">
                {formatCurrency(sale.total)}
              </td>
              <td className="px-5 py-3.5 text-center">
                <Button
                  type="button"
                  variant="secondary"
                  size="xs"
                  onClick={() => handleGoToDetail(sale)}
                  leftIcon={<Eye className="w-3.5 h-3.5" />}
                >
                  <span>{t('viewDetail')}</span>
                </Button>
              </td>
            </tr>
          ))}
          {sales.length === 0 && (
            <tr>
              <td colSpan={6} className="px-5 py-8 text-center text-stone-400">
                {t('noSalesFound')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
