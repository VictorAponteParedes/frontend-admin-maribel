import React from 'react';
import { Skeleton } from '@/componentes';

export const SaleDetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Skeleton de Botón de retorno y Acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Skeleton className="h-4 w-44 rounded-md" />
        <Skeleton className="h-9 w-36 rounded-xl" />
      </div>

      {/* Skeleton de Cabecera Principal */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-36 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-3 w-48 rounded" />
          </div>
        </div>

        <div className="md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-stone-100 space-y-1">
          <Skeleton className="h-3 w-32 md:ml-auto rounded" />
          <Skeleton className="h-7 w-28 md:ml-auto rounded-md" />
        </div>
      </div>

      {/* Skeleton de Tarjetas Informativas (Fecha/Hora y Cliente) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Tarjeta Fecha y Hora */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
          <Skeleton className="h-4 w-48 rounded" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>

        {/* Tarjeta Cliente Asociado */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
          <Skeleton className="h-4 w-44 rounded" />
          <div className="p-3.5 bg-stone-50 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-40 rounded" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
            <Skeleton className="h-3.5 w-32 rounded" />
            <Skeleton className="h-3.5 w-48 rounded" />
          </div>
        </div>
      </div>

      {/* Skeleton de Tabla Detallada */}
      <section className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <Skeleton className="h-4 w-48 rounded" />
          <Skeleton className="h-3 w-28 rounded" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-5 py-3.5"><Skeleton className="h-3 w-24" /></th>
                <th className="px-5 py-3.5"><Skeleton className="h-3 w-24" /></th>
                <th className="px-5 py-3.5"><Skeleton className="h-3 w-36" /></th>
                <th className="px-5 py-3.5"><Skeleton className="h-3 w-16" /></th>
                <th className="px-4 py-3.5"><Skeleton className="h-3 w-16 mx-auto" /></th>
                <th className="px-5 py-3.5 text-right"><Skeleton className="h-3 w-20 ml-auto" /></th>
                <th className="px-5 py-3.5 text-right"><Skeleton className="h-3 w-20 ml-auto" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {[1, 2, 3].map((item) => (
                <tr key={item}>
                  <td className="px-5 py-3.5"><Skeleton className="h-4 w-28 rounded" /></td>
                  <td className="px-5 py-3.5"><Skeleton className="h-4 w-24 rounded" /></td>
                  <td className="px-5 py-3.5"><Skeleton className="h-4 w-44 rounded" /></td>
                  <td className="px-5 py-3.5"><Skeleton className="h-4 w-16 rounded" /></td>
                  <td className="px-4 py-3.5 text-center"><Skeleton className="h-6 w-16 rounded-md mx-auto" /></td>
                  <td className="px-5 py-3.5 text-right"><Skeleton className="h-4 w-20 ml-auto rounded" /></td>
                  <td className="px-5 py-3.5 text-right"><Skeleton className="h-4 w-20 ml-auto rounded" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
