import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sale } from '@/features/sales/types/sale.types';
import { formatCurrency } from '@/utils/formatters';
import { RoutesView } from '@/navigation/routes';
import { t } from '@/lang';
import { Eye, Receipt, Clock } from 'lucide-react';

export interface SaleTableProps {
  sales: Sale[];
  onSelectSale?: (sale: Sale) => void;
}

export const SaleTable: React.FC<SaleTableProps> = ({ sales, onSelectSale }) => {
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
            <th className="px-5 py-3.5">{t('sales.saleNumber')}</th>
            <th className="px-5 py-3.5">Fecha y Hora</th>
            <th className="px-5 py-3.5">{t('sales.customer')}</th>
            <th className="px-4 py-3.5 text-center">{t('sales.itemsCount')}</th>
            <th className="px-5 py-3.5 text-right">{t('sales.total')}</th>
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
                    Código #{sale.customerCode}
                  </span>
                )}
              </td>
              <td className="px-4 py-3.5 text-center">
                <span className="inline-block px-2.5 py-0.5 bg-stone-100 text-stone-700 rounded-full font-semibold">
                  {sale.totalQuantity} uds
                </span>
              </td>
              <td className="px-5 py-3.5 font-bold text-stone-900 text-right whitespace-nowrap">
                {formatCurrency(sale.total)}
              </td>
              <td className="px-5 py-3.5 text-center">
                <button
                  type="button"
                  onClick={() => handleGoToDetail(sale)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 bg-stone-100 hover:bg-maribel-50 hover:text-maribel-800 text-stone-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t('sales.viewDetail')}</span>
                </button>
              </td>
            </tr>
          ))}
          {sales.length === 0 && (
            <tr>
              <td colSpan={6} className="px-5 py-8 text-center text-stone-400">
                No hay ventas registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
