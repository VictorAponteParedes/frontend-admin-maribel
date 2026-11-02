import React, { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Pagination } from '@/componentes';
import { OrderTable } from '@/features/orders/components/OrderTable';
import { OrderDetailModal } from '@/features/orders/components/OrderDetailModal';
import { useOrdersStore } from '@/store/useOrdersStore';
import { OrderStatus } from '@/features/orders/types/order.types';
import {
  Search,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
} from 'lucide-react';

export const OrdersScreen: React.FC = () => {
  const {
    orders,
    selectedOrder,
    isDetailModalOpen,
    openDetailModal,
    closeDetailModal,
    updateOrderStatus,
  } = useOrdersStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | OrderStatus>('ALL');

  // Paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Reiniciar a la primera página si cambia la búsqueda o el filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Contadores para métricas y tabs
  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const preparingCount = orders.filter((o) => o.status === 'PREPARING').length;
  const shippedCount = orders.filter((o) => o.status === 'SHIPPED').length;
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;
  const totalCount = orders.length;

  // Filtrado
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Filtro de estado
      if (statusFilter !== 'ALL' && order.status !== statusFilter) {
        return false;
      }

      // Filtro de búsqueda
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchNumber = order.orderNumber.toLowerCase().includes(q);
      const matchCustomer = order.customerName.toLowerCase().includes(q);
      const matchPhone = order.customerPhone.includes(q);
      const matchAddress = order.location?.address?.toLowerCase().includes(q) || false;
      const matchItem = order.items.some(
        (it) =>
          it.name.toLowerCase().includes(q) ||
          it.brand.toLowerCase().includes(q) ||
          it.barcode.includes(q)
      );

      return matchNumber || matchCustomer || matchPhone || matchAddress || matchItem;
    });
  }, [orders, statusFilter, searchQuery]);

  // Paginado
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      <Header
        title="Pedidos Web"
        subtitle="Control en tiempo real de compras recibidas desde la página web, despachos y ubicaciones GPS"
      />

      {/* Tarjetas de Métricas Rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Total Pedidos
            </p>
            <p className="text-2xl font-bold text-stone-900 mt-1 font-mono">
              {totalCount}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-100 text-stone-700">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        {/* Pendientes */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
              Nuevos / Pendientes
            </p>
            <p className="text-2xl font-bold text-amber-900 mt-1 font-mono">
              {pendingCount}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* En Preparación / Reparto */}
        <div className="bg-white p-4 rounded-2xl border border-sky-200 bg-sky-50/20 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">
              En Proceso / Envío
            </p>
            <p className="text-2xl font-bold text-sky-900 mt-1 font-mono">
              {preparingCount + shippedCount}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        {/* Entregados */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Entregados
            </p>
            <p className="text-2xl font-bold text-emerald-900 mt-1 font-mono">
              {deliveredCount}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        {/* Fila de Filtros Rápidos (Tabs) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
              statusFilter === 'ALL'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>Todos</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                statusFilter === 'ALL'
                  ? 'bg-stone-700 text-white'
                  : 'bg-stone-200 text-stone-700'
              }`}
            >
              {totalCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('PENDING')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
              statusFilter === 'PENDING'
                ? 'bg-amber-600 text-white'
                : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
            }`}
          >
            <span>🟡 Pendientes</span>
            {pendingCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white text-amber-900 font-bold">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('PREPARING')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
              statusFilter === 'PREPARING'
                ? 'bg-blue-600 text-white'
                : 'text-blue-800 bg-blue-50 hover:bg-blue-100'
            }`}
          >
            <span>🔵 En Preparación</span>
            {preparingCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white text-blue-900 font-bold">
                {preparingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('SHIPPED')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
              statusFilter === 'SHIPPED'
                ? 'bg-purple-600 text-white'
                : 'text-purple-800 bg-purple-50 hover:bg-purple-100'
            }`}
          >
            <span>🟣 En Reparto</span>
            {shippedCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white text-purple-900 font-bold">
                {shippedCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('DELIVERED')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
              statusFilter === 'DELIVERED'
                ? 'bg-emerald-600 text-white'
                : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            <span>🟢 Entregados</span>
            {deliveredCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white text-emerald-900 font-bold">
                {deliveredCount}
              </span>
            )}
          </button>
        </div>

        {/* Buscador */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por cliente, WhatsApp, Nº de pedido, producto o dirección..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-maribel-600 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Tabla de Pedidos */}
      <OrderTable
        orders={paginatedOrders}
        onViewDetail={openDetailModal}
        onStatusChange={updateOrderStatus}
      />

      {/* Paginación */}
      {filteredOrders.length > 0 && (
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={filteredOrders.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
          pageSizeOptions={[10, 25, 50]}
        />
      )}

      {/* Modal de Detalle */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        onStatusChange={updateOrderStatus}
      />
    </div>
  );
};
