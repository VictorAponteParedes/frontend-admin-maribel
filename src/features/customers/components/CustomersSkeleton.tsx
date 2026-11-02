import React from 'react';
import { Skeleton } from '@/componentes';

export interface CustomersSkeletonProps {
  rowCount?: number;
}

export const CustomersSkeleton: React.FC<CustomersSkeletonProps> = ({ rowCount = 6 }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Skeleton del Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-stone-200/80">
        <div className="space-y-2">
          <Skeleton className="h-7 w-52 rounded-lg" />
          <Skeleton className="h-4 w-96 max-w-full rounded-md" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {/* Skeleton del Contenedor de la Tabla */}
      <section className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        {/* Buscador y Contador */}
        <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="w-full max-w-md">
            <Skeleton className="h-9 w-full rounded-xl" />
          </div>
          <Skeleton className="h-4 w-36 rounded" />
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-5 py-3.5 text-center"><Skeleton className="h-3 w-14 mx-auto" /></th>
                <th className="px-4 py-3.5"><Skeleton className="h-3 w-24" /></th>
                <th className="px-5 py-3.5"><Skeleton className="h-3 w-32" /></th>
                <th className="px-5 py-3.5"><Skeleton className="h-3 w-32" /></th>
                <th className="px-5 py-3.5"><Skeleton className="h-3 w-40" /></th>
                <th className="px-4 py-3.5 text-center"><Skeleton className="h-3 w-20 mx-auto" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {Array.from({ length: rowCount }).map((_, index) => (
                <tr key={index} className="hover:bg-stone-50/40">
                  {/* Código */}
                  <td className="px-5 py-4 whitespace-nowrap text-center">
                    <Skeleton className="h-5 w-8 rounded-md mx-auto" />
                  </td>

                  {/* Fecha de Registro */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Skeleton className="h-4 w-20 rounded" />
                  </td>

                  {/* Nombre */}
                  <td className="px-5 py-4">
                    <Skeleton className="h-4 w-44 rounded" />
                  </td>

                  {/* Teléfono */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-24 rounded" />
                      <Skeleton className="h-6 w-6 rounded-md" />
                    </div>
                  </td>

                  {/* Dirección */}
                  <td className="px-5 py-4">
                    <Skeleton className="h-4 w-52 rounded" />
                  </td>

                  {/* Ubicación GPS */}
                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    <Skeleton className="h-6 w-20 rounded-lg mx-auto" />
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
