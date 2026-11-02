import React from 'react';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useStockEntryStore } from '@/store/useStockEntryStore';
import { useSalesStore } from '@/store/useSalesStore';
import { formatCurrency } from '@/utils/formatters';
import { useTranslation } from '@/locale';
import {
  X,
  Barcode,
  Package,
  Layers,
  ShoppingBag,
  Boxes,
  ArrowDownRight,
  Receipt,
} from 'lucide-react';
import { Button } from '@/components/ui';

export const ProductDetailModal: React.FC = () => {
  const { t } = useTranslation(['inventory', 'translation']);
  const { selectedProductForDetail, closeProductDetail } = useInventoryStore();
  const { entries } = useStockEntryStore();
  const { sales } = useSalesStore();

  if (!selectedProductForDetail) return null;

  const product = selectedProductForDetail;

  // Filtrar ingresos específicos de este producto
  const productEntries = entries.filter((e) => e.barcode === product.barcode);

  // Filtrar ventas específicas de este producto
  const productSales = sales.flatMap((sale) =>
    sale.items
      .filter((item) => item.barcode === product.barcode)
      .map((item) => ({
        saleNumber: sale.saleNumber,
        date: sale.date,
        customerName: sale.customerName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      }))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Cabecera */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-maribel-100 text-maribel-800 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-maribel-700 block">
                {product.brand}
              </span>
              <h3 className="font-serif font-bold text-stone-900 text-base leading-tight">
                {product.name}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={closeProductDetail}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Ficha básica */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-stone-600 text-xs font-mono">
                <Barcode className="w-4 h-4 text-stone-400" />
                <span className="font-semibold text-stone-800">{product.barcode}</span>
              </div>
              <p className="text-xs text-stone-500">
                {t('modal.presentationSize')}{' '}
                <strong className="text-stone-700">{product.size}</strong>
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-xs text-stone-500 block">{t('modal.salePricePublic')}</span>
              <p className="text-2xl font-bold font-serif text-maribel-800">
                {formatCurrency(product.price)}
              </p>
            </div>
          </div>

          {/* Tarjetas de Métricas de Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-stone-200 bg-white">
              <div className="flex items-center justify-between text-stone-500 text-xs font-medium mb-1">
                <span>{t('modal.totalIn')}</span>
                <Layers className="w-4 h-4 text-stone-400" />
              </div>
              <p className="text-xl font-bold font-serif text-stone-900">
                {product.totalIn} {t('units')}
              </p>
              <span className="text-[11px] text-stone-400">{t('modal.receivedGoods')}</span>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-white">
              <div className="flex items-center justify-between text-stone-500 text-xs font-medium mb-1">
                <span>{t('modal.totalSold')}</span>
                <ShoppingBag className="w-4 h-4 text-maribel-700" />
              </div>
              <p className="text-xl font-bold font-serif text-maribel-800">
                {product.totalSold} {t('units')}
              </p>
              <span className="text-[11px] text-stone-400">{t('modal.counterSales')}</span>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-white">
              <div className="flex items-center justify-between text-stone-500 text-xs font-medium mb-1">
                <span>{t('modal.stockBalance')}</span>
                <Boxes className="w-4 h-4 text-emerald-600" />
              </div>
              <p
                className={`text-xl font-bold font-serif ${
                  product.stock === 0
                    ? 'text-rose-700'
                    : product.stock <= 5
                    ? 'text-amber-700'
                    : 'text-emerald-700'
                }`}
              >
                {product.stock} {t('units')}
              </p>
              <span className="text-[11px] text-stone-400">{t('modal.availableToday')}</span>
            </div>
          </div>

          {/* Movimientos: Historial de Entradas */}
          <div>
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <ArrowDownRight className="w-4 h-4 text-emerald-600" />
              <span>
                {t('modal.stockEntriesCount', { count: productEntries.length })}
              </span>
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
                  {productEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-stone-50/60">
                      <td className="px-4 py-2 font-mono text-[11px] text-stone-600">
                        {entry.date}
                      </td>
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
                  {productEntries.length === 0 && (
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

          {/* Movimientos: Historial de Ventas */}
          <div>
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Receipt className="w-4 h-4 text-maribel-700" />
              <span>
                {t('modal.recordedSalesCount', { count: productSales.length })}
              </span>
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
                  {productSales.map((sale, i) => (
                    <tr key={`${sale.saleNumber}-${i}`} className="hover:bg-stone-50/60">
                      <td className="px-4 py-2 font-semibold text-stone-800">
                        {sale.saleNumber}
                      </td>
                      <td className="px-4 py-2 text-stone-500 font-mono text-[11px]">
                        {sale.date}
                      </td>
                      <td className="px-4 py-2 text-stone-700">{sale.customerName}</td>
                      <td className="px-4 py-2 text-center font-bold text-maribel-800">
                        {sale.quantity} {t('units')}
                      </td>
                      <td className="px-4 py-2 text-right font-bold text-stone-900">
                        {formatCurrency(sale.subtotal)}
                      </td>
                    </tr>
                  ))}
                  {productSales.length === 0 && (
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
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 flex justify-end bg-stone-50/50 shrink-0">
          <Button variant="outline" onClick={closeProductDetail}>
            {t('common.cancel')}
          </Button>
        </div>
      </div>
    </div>
  );
};
