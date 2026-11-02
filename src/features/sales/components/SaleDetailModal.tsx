import React from 'react';
import { useSalesStore } from '@/store/useSalesStore';
import { formatCurrency } from '@/utils/formatters';
import { t } from '@/lang';
import { X, Receipt, Barcode } from 'lucide-react';
import { Button } from '@/components/ui';

export const SaleDetailModal: React.FC = () => {
  const { selectedSaleForDetail, closeDetailModal } = useSalesStore();

  if (!selectedSaleForDetail) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-maribel-100 text-maribel-800 rounded-xl">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-base">
                {t('sales.saleDetail')} - {selectedSaleForDetail.saleNumber}
              </h3>
              <p className="text-xs text-stone-500">
                Fecha: {selectedSaleForDetail.date} • Cliente: {selectedSaleForDetail.customerName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeDetailModal}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          <div className="border border-stone-200 rounded-xl overflow-hidden mb-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] border-b border-stone-200">
                <tr>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Producto / Fragancia</th>
                  <th className="px-3 py-3">Medida</th>
                  <th className="px-3 py-3 text-center">Cant.</th>
                  <th className="px-4 py-3 text-right">Precio Unit.</th>
                  <th className="px-4 py-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {selectedSaleForDetail.items.map((item, idx) => (
                  <tr key={`${item.barcode}-${idx}`} className="hover:bg-stone-50/60">
                    <td className="px-4 py-3 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Barcode className="w-3.5 h-3.5 text-stone-400" />
                        <span>{item.barcode}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-stone-800 block">{item.brand}</span>
                      <span className="text-stone-600 text-[11px]">{item.name}</span>
                    </td>
                    <td className="px-3 py-3 text-stone-500 whitespace-nowrap">{item.size}</td>
                    <td className="px-3 py-3 text-center font-bold text-stone-800">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-stone-700 whitespace-nowrap">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-stone-900 whitespace-nowrap">
                      {formatCurrency(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-200">
            <div>
              <span className="text-xs text-stone-500">Total de productos:</span>
              <p className="text-sm font-semibold text-stone-800">
                {selectedSaleForDetail.totalQuantity} unidades
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-500">Monto total abonado:</span>
              <p className="text-xl font-bold font-serif text-maribel-800">
                {formatCurrency(selectedSaleForDetail.total)}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={closeDetailModal}>
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
