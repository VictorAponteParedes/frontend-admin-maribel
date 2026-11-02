import React from 'react';
import { Skeleton } from '@/componentes';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Skeleton del Header */}
      <div className="space-y-2 pb-6 border-b border-stone-200/80">
        <Skeleton className="h-7 w-48 rounded-lg" />
        <Skeleton className="h-4 w-80 max-w-full rounded-md" />
      </div>

      {/* Skeleton de las 4 Tarjetas de Métricas Superiores */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-28 rounded" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-8 w-32 rounded-md" />
          </div>
        ))}
      </section>

      {/* Skeleton de Gráficos de Analítica */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Evolución de Ingresos (2 columnas) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-neutral-100 shadow-sm flex flex-col justify-between min-h-[420px]">
          {/* Header del gráfico */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-6 w-64 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-3 w-48 rounded" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
            </div>
          </div>

          {/* Área de simulación de Curva / Gráfico */}
          <div className="space-y-6 my-4">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Skeleton className="h-3 w-10 rounded" />
                <Skeleton className="h-px w-full" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-3 w-10 rounded" />
                <Skeleton className="h-px w-full" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-3 w-10 rounded" />
                <Skeleton className="h-px w-full" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-3 w-10 rounded" />
                <Skeleton className="h-px w-full" />
              </div>
            </div>

            {/* Eje X Labels */}
            <div className="flex justify-between items-center px-4 pt-2">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <Skeleton key={day} className="h-3 w-8 rounded" />
              ))}
            </div>
          </div>

          {/* Footer del gráfico */}
          <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <Skeleton className="h-4 w-72 rounded" />
            <Skeleton className="h-3 w-28 rounded" />
          </div>
        </div>

        {/* Gráfico de Ventas por Marca (1 columna) */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 sm:p-7 border border-neutral-100 shadow-sm flex flex-col justify-between min-h-[420px]">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1">
              <Skeleton className="h-6 w-36 rounded-md" />
              <Skeleton className="h-3 w-44 rounded" />
            </div>
            <Skeleton className="h-6 w-6 rounded-lg" />
          </div>

          {/* Gráfico Donut simulado */}
          <div className="flex items-center justify-center my-6">
            <div className="relative w-44 h-44 rounded-full border-[18px] border-stone-200/80 animate-pulse flex items-center justify-center">
              <div className="space-y-1 text-center flex flex-col items-center">
                <Skeleton className="h-2.5 w-16 rounded" />
                <Skeleton className="h-6 w-12 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
            </div>
          </div>

          {/* Filas de leyendas */}
          <div className="space-y-3 mt-4 pt-3 border-t border-neutral-100">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center justify-between py-1 px-2">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="w-2.5 h-2.5 rounded-full shrink-0" />
                  <Skeleton className="h-3.5 w-24 rounded" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-8 rounded" />
                  <Skeleton className="h-3.5 w-14 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
