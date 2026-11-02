import React from 'react';
import {
  MessageCircle,
  MapPin,
  ExternalLink,
  Truck,
  Store,
  Eye,
  ShoppingBag,
} from 'lucide-react';
import { Order, OrderStatus } from '@/features/orders/types/order.types';
import {
  buildWhatsAppLink,
  buildGoogleMapsLink,
  getOrderStatusConfig,
} from '@/features/orders/utils/orderHelpers';
import { formatCurrency } from '@/utils/formatters';

export interface OrderTableProps {
  orders: Order[];
  onViewDetail: (order: Order) => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onViewDetail,
  onStatusChange,
}) => {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500 shadow-xs">
        <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <p className="text-base font-semibold text-stone-700">No se encontraron pedidos</p>
        <p className="text-xs text-stone-400 mt-1">
          No hay pedidos que coincidan con los filtros o la búsqueda actual.
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
              <th className="py-3 px-4">Pedido / Fecha</th>
              <th className="py-3 px-4">Cliente</th>
              <th className="py-3 px-4">WhatsApp</th>
              <th className="py-3 px-4">Tipo Entrega</th>
              <th className="py-3 px-4">Ubicación (Lat, Lng)</th>
              <th className="py-3 px-4">Productos</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-4 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-medium">
            {orders.map((order) => {
              const statusConfig = getOrderStatusConfig(order.status);
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
                      <span className="inline-block mt-0.5 text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200 font-normal truncate max-w-[170px]" title={order.notes}>
                        💌 Regalo con dedicatoria
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
                      title="Abrir chat de WhatsApp con mensaje listo"
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
                        A Domicilio
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        <Store className="w-3 h-3 text-amber-600" />
                        Retiro en Tienda
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
                          title="Abrir en Google Maps"
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
                        No aplica (Retiro en local)
                      </span>
                    )}
                  </td>

                  {/* Productos y Cantidad */}
                  <td className="py-3.5 px-4 max-w-[240px]">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-bold text-stone-800">
                        {order.totalQuantity} {order.totalQuantity === 1 ? 'unidad' : 'unidades'}
                      </span>
                      <span className="text-stone-400">·</span>
                      <span className="text-stone-500 text-[11px]">
                        {order.items.length} {order.items.length === 1 ? 'ítem' : 'ítems'}
                      </span>
                    </div>
                    <ul className="text-[11px] text-stone-500 space-y-0.5 list-disc list-inside truncate">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="truncate" title={`${item.quantity}x ${item.brand} - ${item.name}`}>
                          <span className="font-semibold text-stone-700">{item.quantity}x</span> {item.brand} {item.name}
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
                      {order.paymentStatus === 'PAID' ? '✓ Pagado' : 'Pendiente cobro'}
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
                      <option value="PENDING">Pendiente</option>
                      <option value="PREPARING">En Preparación</option>
                      <option value="SHIPPED">En Reparto</option>
                      <option value="DELIVERED">Entregado</option>
                      <option value="CANCELLED">Cancelado</option>
                    </select>
                  </td>

                  {/* Botón Ver Detalle */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onViewDetail(order)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                      title="Ver detalle completo del pedido"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
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
