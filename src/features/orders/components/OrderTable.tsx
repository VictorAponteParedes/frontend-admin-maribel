import React from 'react';
import {
  MessageCircle,
  MapPin,
  ExternalLink,
  Truck,
  Store,
  Eye,
  ShoppingBag,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { Order, OrderStatus } from '@/features/orders/types/order.types';
import {
  buildWhatsAppLink,
  buildGoogleMapsLink,
  getOrderStatusConfig,
} from '@/features/orders/utils/order.utils';
import { formatCurrency } from '@/utils/formatters';
import { useTranslation } from '@/locale';

export interface OrderTableProps {
  orders: Order[];
  onViewDetail: (order: Order) => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
  onProcessSale?: (order: Order) => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onViewDetail,
  onStatusChange,
  onProcessSale,
}) => {
  const { t } = useTranslation(['orders', 'translation']);

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500 shadow-xs">
        <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <p className="text-base font-semibold text-stone-700">
          {t('table.noOrdersFound')}
        </p>
        <p className="text-xs text-stone-400 mt-1">
          {t('table.noOrdersDesc')}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-stone-600">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">{t('table.orderDate')}</th>
              <th className="py-3 px-4">{t('table.customer')}</th>
              <th className="py-3 px-4">{t('table.whatsapp')}</th>
              <th className="py-3 px-4">{t('table.deliveryType')}</th>
              <th className="py-3 px-4">{t('table.location')}</th>
              <th className="py-3 px-4">{t('table.products')}</th>
              <th className="py-3 px-4">{t('table.total')}</th>
              <th className="py-3 px-4">{t('table.status')}</th>
              <th className="py-3 px-4 text-center">{t('table.action')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-medium">
            {orders.map((order) => {
              const statusConfig = getOrderStatusConfig(order.status, t);
              const waLink = buildWhatsAppLink(
                order.customerPhone,
                order.customerName,
                order.orderNumber,
                order.total
              );

              return (
                <tr
                  key={order.id}
                  className="hover:bg-stone-50/70 transition-colors group"
                >
                  {/* Pedido y Fecha */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-stone-900 block font-mono">
                      #{order.orderNumber}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {order.date}
                    </span>
                  </td>

                  {/* Nombre del Cliente */}
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-stone-800 line-clamp-1">
                      {order.customerName}
                    </p>
                    {order.notes && (
                      <span
                        className="inline-block mt-0.5 text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200 font-normal truncate max-w-[170px]"
                        title={order.notes}
                      >
                        {t('table.giftNote')}
                      </span>
                    )}
                  </td>

                  {/* Número de WhatsApp con link directo */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors font-medium text-[11px]"
                      title={t('table.openWhatsApp')}
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{order.customerPhone}</span>
                    </a>
                  </td>

                  {/* Tipo de Entrega */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {order.deliveryType === 'DELIVERY' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                        <Truck className="w-3 h-3 text-sky-600" />
                        {t('delivery.homeDelivery')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        <Store className="w-3 h-3 text-amber-600" />
                        {t('delivery.pickupStore')}
                      </span>
                    )}
                  </td>

                  {/* Ubicación (Latitud, Longitud) y Maps */}
                  <td className="py-3.5 px-4 max-w-[210px]">
                    {order.location ? (
                      <div>
                        <a
                          href={buildGoogleMapsLink(
                            order.location.latitude,
                            order.location.longitude
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-maribel-700 hover:text-maribel-800 hover:underline"
                          title={t('table.openMaps')}
                        >
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-maribel-600" />
                          <span className="font-mono text-[10.5px]">
                            {order.location.latitude.toFixed(4)},{' '}
                            {order.location.longitude.toFixed(4)}
                          </span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                        {order.location.address && (
                          <p
                            className="text-[11px] text-stone-500 truncate mt-0.5"
                            title={order.location.address}
                          >
                            {order.location.address}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-stone-400 text-[11px] italic">
                        {t('delivery.notApplicable')}
                      </span>
                    )}
                  </td>

                  {/* Productos y Cantidad */}
                  <td className="py-3.5 px-4 max-w-[240px]">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-bold text-stone-800">
                        {order.totalQuantity}{' '}
                        {order.totalQuantity === 1
                          ? t('table.unitSingular')
                          : t('table.unitPlural')}
                      </span>
                      <span className="text-stone-400">·</span>
                      <span className="text-stone-500 text-[11px]">
                        {order.items.length}{' '}
                        {order.items.length === 1
                          ? t('table.itemSingular')
                          : t('table.itemPlural')}
                      </span>
                    </div>
                    <ul className="text-[11px] text-stone-500 space-y-0.5 list-disc list-inside truncate">
                      {order.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="truncate"
                          title={`${item.quantity}x ${item.brand} - ${item.name}`}
                        >
                          <span className="font-semibold text-stone-700">
                            {item.quantity}x
                          </span>{' '}
                          {item.brand} {item.name}
                        </li>
                      ))}
                    </ul>
                  </td>

                  {/* Total */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-stone-900 block text-xs">
                      {formatCurrency(order.total)}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {order.paymentStatus === 'PAID'
                        ? t('payment.paid')
                        : t('payment.pending')}
                    </span>
                  </td>

                  {/* Selector rápido de Estado */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        onStatusChange(order.id, e.target.value as OrderStatus)
                      }
                      className={`text-[11px] font-semibold py-1 px-2 rounded-lg border focus:outline-hidden cursor-pointer transition-colors ${statusConfig.className}`}
                    >
                      <option value="PENDING">{t('status.pending')}</option>
                      <option value="PREPARING">{t('status.preparing')}</option>
                      <option value="SHIPPED">{t('status.shipped')}</option>
                      <option value="DELIVERED">{t('status.delivered')}</option>
                      <option value="CANCELLED">{t('status.cancelled')}</option>
                    </select>
                  </td>

                  {/* Acciones: Facturar Venta y Ver Detalle */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      {onProcessSale && (
                        <Button
                          type="button"
                          variant={order.status === 'DELIVERED' ? 'secondary' : 'primary'}
                          size="xs"
                          onClick={() => onProcessSale(order)}
                          title={
                            order.status === 'DELIVERED'
                              ? 'Este pedido ya figura como entregado. Haz clic si deseas volver a facturarlo.'
                              : 'Llevar los productos de este pedido directamente a la caja para facturar'
                          }
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>
                            {order.status === 'DELIVERED' ? 'Facturado' : 'Llevar a Venta'}
                          </span>
                        </Button>
                      )}

                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => onViewDetail(order)}
                        title={t('table.viewDetailTooltip')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
