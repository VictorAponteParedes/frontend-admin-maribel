import React from 'react';
import { Skeleton } from '@/componentes';

export interface ProductsSkeletonProps {
  rowCount?: number;
}

export const ProductsSkeleton: React.FC<ProductsSkeletonProps> = ({ rowCount = 6 }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Skeleton del Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-stone-200/80">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 rounded-lg" />
          <Skeleton className="h-4 w-80 max-w-full rounded-md" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>
      </div>

      {/* Skeleton de las 3 Tarjetas de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
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

      {/* Skeleton del Contenedor Principal (Tabs, Filtros, Tabla, Paginación) */}
      <section className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        {/* Pestañas de Navegación */}
        <div className="px-5 pt-4 pb-0 border-b border-stone-200 flex items-center justify-between flex-wrap gap-3 bg-stone-50/50">
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-44 rounded-t-xl" />
            <Skeleton className="h-9 w-44 rounded-t-xl" />
          </div>
          <Skeleton className="h-3 w-56 rounded mb-2 hidden md:block" />
        </div>

        {/* Buscador y Botón de Filtro */}
        <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="w-full max-w-md">
            <Skeleton className="h-9 w-full rounded-xl" />
          </div>
          <Skeleton className="h-9 w-36 rounded-xl" />
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-5 py-3.5"><Skeleton className="h-3 w-28" /></th>
                <th className="px-5 py-3.5"><Skeleton className="h-3 w-20" /></th>
                <th className="px-5 py-3.5"><Skeleton className="h-3 w-36" /></th>
                <th className="px-5 py-3.5"><Skeleton className="h-3 w-16" /></th>
                <th className="px-5 py-3.5 text-right"><Skeleton className="h-3 w-20 ml-auto" /></th>
                <th className="px-4 py-3.5 text-center"><Skeleton className="h-3 w-14 mx-auto" /></th>
                <th className="px-4 py-3.5 text-center"><Skeleton className="h-3 w-14 mx-auto" /></th>
                <th className="px-5 py-3.5 text-center"><Skeleton className="h-3 w-20 mx-auto" /></th>
                <th className="px-4 py-3.5 text-center"><Skeleton className="h-3 w-16 mx-auto" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {Array.from({ length: rowCount }).map((_, index) => (
                <tr key={index} className="hover:bg-stone-50/40">
                  {/* Código de barras */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <Skeleton className="h-4 w-28 rounded" />
                  </td>

                  {/* Marca */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <Skeleton className="h-4 w-24 rounded" />
                  </td>

                  {/* Descripción */}
                  <td className="px-5 py-4">
                    <Skeleton className="h-4 w-44 rounded" />
                  </td>

                  {/* Medida */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <Skeleton className="h-4 w-16 rounded" />
                  </td>

                  {/* Precio */}
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <Skeleton className="h-4 w-20 rounded ml-auto" />
                  </td>

                  {/* Ingresado */}
                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    <Skeleton className="h-4 w-10 rounded mx-auto" />
                  </td>

                  {/* Vendido */}
                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    <Skeleton className="h-4 w-10 rounded mx-auto" />
                  </td>

                  {/* Stock */}
                  <td className="px-5 py-4 text-center whitespace-nowrap">
                    <Skeleton className="h-6 w-20 rounded-full mx-auto" />
                  </td>

                  {/* Acción */}
                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    <Skeleton className="h-7 w-20 rounded-lg mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="px-5 py-4 border-t border-stone-200 bg-stone-50/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Skeleton className="h-4 w-44 rounded" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-36 rounded-lg" />
          </div>
        </div>
      </section>
    </div>
  );
};
