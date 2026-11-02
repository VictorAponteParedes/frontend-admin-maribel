import React from 'react';
import { Skeleton } from '@/componentes';

export interface SalesSkeletonProps {
  rowCount?: number;
}

export const SalesSkeleton: React.FC<SalesSkeletonProps> = ({ rowCount = 6 }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Skeleton del Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-stone-200/80">
        <div className="space-y-2">
          <Skeleton className="h-7 w-36 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>

      {/* Skeleton de las 3 tarjetas de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((cardIndex) => (
          <div
            key={cardIndex}
            className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex items-center space-x-3.5"
          >
            <Skeleton className="w-11 h-11 rounded-lg shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-28 rounded" />
              <Skeleton className="h-6 w-32 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Skeleton del contenedor principal con pestañas, buscador y tabla */}
      <section className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        {/* Skeleton de Pestañas */}
        <div className="px-5 pt-4 pb-0 border-b border-stone-200 flex items-center justify-between flex-wrap gap-3 bg-stone-50/50">
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-48 rounded-t-xl" />
            <Skeleton className="h-9 w-40 rounded-t-xl" />
          </div>
          <Skeleton className="h-3 w-56 rounded mb-2 hidden md:block" />
        </div>

        {/* Skeleton del Buscador */}
        <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="w-full max-w-md">
            <Skeleton className="h-9 w-full rounded-xl" />
          </div>
        </div>

        {/* Skeleton de la Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-5 py-3.5">
                  <Skeleton className="h-3 w-24" />
                </th>
                <th className="px-5 py-3.5">
                  <Skeleton className="h-3 w-28" />
                </th>
                <th className="px-5 py-3.5">
                  <Skeleton className="h-3 w-32" />
                </th>
                <th className="px-5 py-3.5">
                  <Skeleton className="h-3 w-40" />
                </th>
                <th className="px-5 py-3.5 text-right">
                  <Skeleton className="h-3 w-20 ml-auto" />
                </th>
                <th className="px-5 py-3.5 text-center">
                  <Skeleton className="h-3 w-16 mx-auto" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {Array.from({ length: rowCount }).map((_, index) => (
                <tr key={index} className="hover:bg-stone-50/40">
                  {/* Comprobante */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <Skeleton className="h-5 w-24 rounded-md" />
                  </td>

                  {/* Fecha y hora */}
                  <td className="px-5 py-4 whitespace-nowrap space-y-1">
                    <Skeleton className="h-3.5 w-24 rounded" />
                    <Skeleton className="h-3 w-16 rounded" />
                  </td>

                  {/* Cliente */}
                  <td className="px-5 py-4 whitespace-nowrap space-y-1">
                    <Skeleton className="h-3.5 w-36 rounded" />
                    <Skeleton className="h-3 w-24 rounded" />
                  </td>

                  {/* Artículos / Fragancias */}
                  <td className="px-5 py-4 space-y-1">
                    <Skeleton className="h-3.5 w-48 rounded" />
                    <Skeleton className="h-3 w-28 rounded" />
                  </td>

                  {/* Total */}
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <Skeleton className="h-5 w-24 rounded ml-auto" />
                  </td>

                  {/* Botón de acción */}
                  <td className="px-5 py-4 whitespace-nowrap text-center">
                    <Skeleton className="h-8 w-24 rounded-lg mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Skeleton de Paginación */}
        <div className="px-5 py-4 border-t border-stone-200 bg-stone-50/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Skeleton className="h-4 w-48 rounded" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-36 rounded-lg" />
          </div>
        </div>
      </section>
    </div>
  );
};
