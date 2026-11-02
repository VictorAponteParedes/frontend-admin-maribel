import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSalesStore } from '@/store/useSalesStore';
import { formatCurrency } from '@/utils/formatters';
import { RoutesView } from '@/navigation/routes';
import { useTranslation } from '@/locale';
import {
  ArrowLeft,
  Receipt,
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  Barcode,
  CheckCircle2,
  Printer,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui';

export const SaleDetailScreen: React.FC = () => {
  const { t } = useTranslation(['sales', 'translation']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSaleById } = useSalesStore();

  const sale = id ? getSaleById(id) : undefined;

  if (!sale) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
        <Receipt className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-stone-800">
          {t('detail.notFoundTitle')}
        </h3>
        <p className="text-xs text-stone-500 mt-1 mb-4">
          {t('detail.notFoundDesc', { id })}
        </p>
        <Button variant="primary" onClick={() => navigate(RoutesView.SALES)}>
          {t('detail.backButton')}
        </Button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Botón de retorno y Acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          to={RoutesView.SALES}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('detail.backToSales')}</span>
        </Link>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            leftIcon={<Printer className="w-4 h-4" />}
            onClick={handlePrint}
          >
            {t('detail.printReceipt')}
          </Button>
        </div>
      </div>

      {/* Cabecera Principal de la Venta */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-maribel-100 text-maribel-800 rounded-2xl">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-serif font-bold text-stone-900 text-xl tracking-tight">
                {t('detail.saleTitle', { number: sale.saleNumber })}
              </h2>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                <span>{t('detail.confirmed')}</span>
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {t('detail.transactionId', { id: sale.id })}
            </p>
          </div>
        </div>

        <div className="md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
          <span className="text-xs text-stone-500 block">
            {t('detail.totalOperation')}
          </span>
          <p className="text-2xl font-bold font-serif text-maribel-800">
            {formatCurrency(sale.total)}
          </p>
        </div>
      </div>

      {/* Tarjetas informativas: Fecha/Hora y Cliente Asociado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Tarjeta Fecha y Hora */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-maribel-700" />
            <span>{t('detail.confirmationDateTime')}</span>
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
              <div className="flex items-center space-x-2 text-xs text-stone-700 font-medium">
                <Calendar className="w-4 h-4 text-stone-400" />
                <span>{t('detail.saleDate')}</span>
              </div>
              <span className="text-xs font-mono font-bold text-stone-900">
                {sale.date}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
              <div className="flex items-center space-x-2 text-xs text-stone-700 font-medium">
                <Clock className="w-4 h-4 text-stone-400" />
                <span>{t('detail.confirmationTime')}</span>
              </div>
              <span className="text-xs font-mono font-bold text-stone-900">
                {sale.time}
              </span>
            </div>
          </div>
        </div>

        {/* Tarjeta Cliente Asociado */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center space-x-2">
            <User className="w-4 h-4 text-maribel-700" />
            <span>{t('detail.associatedCustomer')}</span>
          </h3>

          <div className="p-3.5 bg-stone-50 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-900">
                {sale.customerName}
              </span>
              {sale.customerCode && (
                <span className="text-[11px] font-mono px-2 py-0.5 bg-stone-200 text-stone-800 rounded-md font-semibold">
                  {t('codeTag', { code: sale.customerCode })}
                </span>
              )}
            </div>

            {sale.customerPhone && (
              <div className="flex items-center space-x-2 text-xs text-stone-600">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span>{sale.customerPhone}</span>
              </div>
            )}

            {sale.customerAddress && (
              <div className="flex items-center space-x-2 text-xs text-stone-600">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{sale.customerAddress}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabla Detallada con TODOS los campos */}
      <section className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-4 h-4 text-maribel-700" />
            <h3 className="font-serif font-bold text-stone-900 text-sm">
              {t('detail.itemsSoldSection', { count: sale.items.length })}
            </h3>
          </div>
          <span className="text-xs text-stone-500">
            {t('detail.totalUnitsLabel')}{' '}
            <strong>{t('unitsTag', { count: sale.totalQuantity })}</strong>
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
              {sale.items.map((item, idx) => (
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
                  {t('unitsTag', { count: sale.totalQuantity })}
                </td>
                <td className="px-5 py-4 text-right text-xs font-semibold text-stone-600">
                  {t('detail.totalBilled')}
                </td>
                <td className="px-5 py-4 text-right font-bold text-base font-serif text-maribel-800">
                  {formatCurrency(sale.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
};
