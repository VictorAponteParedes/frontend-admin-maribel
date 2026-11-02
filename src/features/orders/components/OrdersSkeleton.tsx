import React from 'react';
import { Skeleton } from '@/componentes';

export interface OrdersSkeletonProps {
  rowCount?: number;
}

export const OrdersSkeleton: React.FC<OrdersSkeletonProps> = ({ rowCount = 6 }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Skeleton del Header */}
      <div className="space-y-2 pb-6 border-b border-stone-200/80">
        <Skeleton className="h-7 w-48 rounded-lg" />
        <Skeleton className="h-4 w-96 max-w-full rounded-md" />
      </div>

      {/* Skeleton de las 4 Tarjetas de Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between"
          >
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="h-7 w-12 rounded-md" />
            </div>
            <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          </div>
        ))}
      </div>

      {/* Skeleton de Barra de Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        {/* Pills de estado */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Skeleton className="h-8 w-20 rounded-xl shrink-0" />
          <Skeleton className="h-8 w-28 rounded-xl shrink-0" />
          <Skeleton className="h-8 w-32 rounded-xl shrink-0" />
          <Skeleton className="h-8 w-28 rounded-xl shrink-0" />
          <Skeleton className="h-8 w-28 rounded-xl shrink-0" />
        </div>

        {/* Buscador */}
        <Skeleton className="h-9 w-full rounded-xl" />
      </div>

      {/* Skeleton de Tabla de Pedidos */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="py-3 px-4"><Skeleton className="h-3 w-24" /></th>
                <th className="py-3 px-4"><Skeleton className="h-3 w-28" /></th>
                <th className="py-3 px-4"><Skeleton className="h-3 w-24" /></th>
                <th className="py-3 px-4"><Skeleton className="h-3 w-24" /></th>
                <th className="py-3 px-4"><Skeleton className="h-3 w-32" /></th>
                <th className="py-3 px-4"><Skeleton className="h-3 w-36" /></th>
                <th className="py-3 px-4"><Skeleton className="h-3 w-16" /></th>
                <th className="py-3 px-4"><Skeleton className="h-3 w-24" /></th>
                <th className="py-3 px-4 text-center"><Skeleton className="h-3 w-12 mx-auto" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {Array.from({ length: rowCount }).map((_, index) => (
                <tr key={index} className="hover:bg-stone-50/40">
                  {/* Pedido / Fecha */}
                  <td className="py-3.5 px-4 whitespace-nowrap space-y-1">
                    <Skeleton className="h-4 w-20 rounded" />
                    <Skeleton className="h-3 w-16 rounded" />
                  </td>

                  {/* Cliente */}
                  <td className="py-3.5 px-4 space-y-1">
                    <Skeleton className="h-4 w-32 rounded" />
                    <Skeleton className="h-3 w-20 rounded" />
                  </td>

                  {/* WhatsApp */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Skeleton className="h-7 w-28 rounded-lg" />
                  </td>

                  {/* Tipo Entrega */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Skeleton className="h-6 w-24 rounded-md" />
                  </td>

                  {/* Ubicación */}
                  <td className="py-3.5 px-4 space-y-1">
                    <Skeleton className="h-3.5 w-32 rounded" />
                    <Skeleton className="h-3 w-24 rounded" />
                  </td>

                  {/* Productos */}
                  <td className="py-3.5 px-4 space-y-1.5">
                    <Skeleton className="h-3.5 w-24 rounded" />
                    <Skeleton className="h-3 w-40 rounded" />
                  </td>

                  {/* Total */}
                  <td className="py-3.5 px-4 whitespace-nowrap space-y-1">
                    <Skeleton className="h-4 w-20 rounded" />
                    <Skeleton className="h-3 w-14 rounded" />
                  </td>

                  {/* Selector Estado */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Skeleton className="h-7 w-28 rounded-lg" />
                  </td>

                  {/* Acción */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <Skeleton className="h-7 w-7 rounded-lg mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Skeleton de Paginación */}
      <div className="px-5 py-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <Skeleton className="h-4 w-40 rounded" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
};
