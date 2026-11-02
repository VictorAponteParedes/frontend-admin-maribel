import React from 'react';
import {
  X,
  MapPin,
  ExternalLink,
  MessageCircle,
  Truck,
  Store,
  Printer,
  Gift,
  Clock,
  User,
  CheckCircle2,
} from 'lucide-react';
import { Order, OrderStatus } from '@/features/orders/types/order.types';
import {
  buildWhatsAppLink,
  buildGoogleMapsLink,
  getOrderStatusConfig,
  getPaymentMethodLabel,
} from '@/features/orders/utils/orderHelpers';
import { formatCurrency } from '@/utils/formatters';
import { useTranslation } from '@/locale';

export interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  onStatusChange,
}) => {
  const { t } = useTranslation(['orders', 'translation']);

  if (!isOpen || !order) return null;

  const statusConfig = getOrderStatusConfig(order.status, t);
  const waLink = buildWhatsAppLink(
    order.customerPhone,
    order.customerName,
    order.orderNumber,
    order.total
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Cabecera del Modal */}
        <div className="p-5 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-maribel-100 text-maribel-700 flex items-center justify-center font-bold font-mono">
              📦
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-stone-900 font-mono">
                  #{order.orderNumber}
                </h3>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusConfig.className}`}
                >
                  {statusConfig.label}
                </span>
              </div>
              <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                {t('modal.orderDate')}{' '}
                <strong className="text-stone-700 font-medium">{order.date}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Fila Cliente & Entrega */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tarjeta Cliente */}
            <div className="bg-stone-50/70 rounded-xl p-4 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> {t('modal.customerData')}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-stone-900">
                  {order.customerName}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  WhatsApp:{' '}
                  <span className="font-mono font-medium text-stone-700">
                    {order.customerPhone}
                  </span>
                </p>
              </div>

              {/* Botón WhatsApp Directo */}
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t('modal.chatWhatsApp')}</span>
              </a>
            </div>

            {/* Tarjeta Tipo de Entrega */}
            <div className="bg-stone-50/70 rounded-xl p-4 border border-stone-200 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
                {order.deliveryType === 'DELIVERY' ? (
                  <Truck className="w-3.5 h-3.5 text-sky-600" />
                ) : (
                  <Store className="w-3.5 h-3.5 text-amber-600" />
                )}
                {t('modal.deliveryMode')}
              </span>

              <div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                    order.deliveryType === 'DELIVERY'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {order.deliveryType === 'DELIVERY'
                    ? t('delivery.homeDeliveryLong')
                    : t('delivery.pickupStoreLong')}
                </span>
              </div>

              {order.deliveryType === 'DELIVERY' && order.location ? (
                <div className="space-y-1.5 text-xs text-stone-600">
                  <p>
                    <strong className="text-stone-800">{t('modal.address')}</strong>{' '}
                    {order.location.address || t('modal.noAddress')}
                  </p>
                  {order.location.reference && (
                    <p className="text-stone-500 italic">
                      <strong className="text-stone-700 not-italic">
                        {t('modal.reference')}
                      </strong>{' '}
                      {order.location.reference}
                    </p>
                  )}
                  {order.location.city && (
                    <p>
                      <strong className="text-stone-800">{t('modal.city')}</strong>{' '}
                      {order.location.city}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-stone-500">
                  {t('delivery.pickupNote')}
                </p>
              )}
            </div>
          </div>

          {/* Sección Ubicación Geográfica (Latitud / Longitud) para Delivery */}
          {order.deliveryType === 'DELIVERY' && order.location && (
            <div className="bg-maribel-50/50 rounded-xl p-4 border border-maribel-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-maribel-100 text-maribel-700 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    {t('modal.gpsTitle')}
                  </h4>
                  <p className="text-xs font-mono text-stone-600 mt-0.5">
                    {t('modal.latitude')}{' '}
                    <span className="font-semibold text-maribel-900">
                      {order.location.latitude}
                    </span>{' '}
                    | {t('modal.longitude')}{' '}
                    <span className="font-semibold text-maribel-900">
                      {order.location.longitude}
                    </span>
                  </p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {t('modal.gpsDesc')}
                  </p>
                </div>
              </div>

              <a
                href={buildGoogleMapsLink(
                  order.location.latitude,
                  order.location.longitude
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-maribel-700 hover:bg-maribel-800 shadow-xs transition-colors shrink-0"
              >
                <span>{t('table.openMaps')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Dedicatoria o notas de regalo */}
          {order.notes && (
            <div className="bg-rose-50 rounded-xl p-4 border border-rose-200 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-rose-100 text-rose-700 shrink-0">
                <Gift className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-rose-900">
                  {t('modal.giftNotesTitle')}
                </h4>
                <p className="text-rose-800 mt-1 italic leading-relaxed">
                  "{order.notes}"
                </p>
              </div>
            </div>
          )}

          {/* Tabla de Productos */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              {t('modal.requestedProducts', {
                count: order.totalQuantity,
                unit:
                  order.totalQuantity === 1
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
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-50/50">
                      <td className="py-3 px-3">
                        <p className="font-semibold text-stone-900">
                          {item.brand}
                        </p>
                        <p className="text-[11px] text-stone-500">
                          {item.name}
                        </p>
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

          {/* Resumen Financiero */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-xs space-y-1">
              <p className="text-stone-600">
                {t('modal.paymentMethod')}{' '}
                <strong className="text-stone-800">
                  {getPaymentMethodLabel(order.paymentMethod, t)}
                </strong>
              </p>
              <p className="text-stone-600">
                {t('modal.paymentStatus')}{' '}
                <span
                  className={`font-semibold ${
                    order.paymentStatus === 'PAID'
                      ? 'text-emerald-700'
                      : 'text-amber-700'
                  }`}
                >
                  {order.paymentStatus === 'PAID'
                    ? t('payment.paid')
                    : t('payment.pendingOnDelivery')}
                </span>
              </p>
            </div>

            <div className="w-full sm:w-auto text-right space-y-1 text-xs">
              <div className="flex justify-between sm:justify-end gap-6 text-stone-500">
                <span>{t('modal.subtotalProducts')}</span>
                <span className="font-mono">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between sm:justify-end gap-6 text-stone-500">
                <span>{t('modal.deliveryFee')}</span>
                <span className="font-mono">
                  {order.deliveryFee > 0
                    ? formatCurrency(order.deliveryFee)
                    : t('modal.freeDelivery')}
                </span>
              </div>
              <div className="flex justify-between sm:justify-end gap-6 text-sm font-bold text-stone-900 pt-1 border-t border-stone-200">
                <span>{t('modal.totalToCollect')}</span>
                <span className="text-maribel-700 font-mono text-base">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Actualizar Estado */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-stone-100/70 rounded-xl border border-stone-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-stone-500" />
              <label htmlFor="order-status-select" className="text-xs font-bold text-stone-800">
                {t('modal.changeStatus')}
              </label>
            </div>
            <select
              id="order-status-select"
              value={order.status}
              onChange={(e) =>
                onStatusChange(order.id, e.target.value as OrderStatus)
              }
              className={`text-xs font-bold py-1.5 px-3 rounded-lg border cursor-pointer focus:outline-hidden ${statusConfig.className}`}
            >
              <option value="PENDING">{t('status.selectPending')}</option>
              <option value="PREPARING">{t('status.selectPreparing')}</option>
              <option value="SHIPPED">{t('status.selectShipped')}</option>
              <option value="DELIVERED">{t('status.selectDelivered')}</option>
              <option value="CANCELLED">{t('status.selectCancelled')}</option>
            </select>
          </div>
        </div>

        {/* Pie del modal con acciones */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-100 transition-colors"
          >
            <Printer className="w-4 h-4 text-stone-500" />
            <span>{t('modal.printTicket')}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 transition-colors"
          >
            {t('modal.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
