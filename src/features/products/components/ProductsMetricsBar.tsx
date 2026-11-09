import React from 'react';
import { Layers, Boxes, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/locale';
import { ProductsMetrics } from '../hooks/useProductsList';

export interface ProductsMetricsBarProps {
  metrics: ProductsMetrics;
  onClickCritical?: () => void;
}

export const ProductsMetricsBar: React.FC<ProductsMetricsBarProps> = ({
  metrics,
  onClickCritical,
}) => {
  const { t } = useTranslation(['inventory', 'translation']);
  const hasOutOfStock = metrics.outOfStockCount > 0;
  const hasCritical = metrics.lowStockCount > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {/* Catálogo Activo */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex items-center space-x-3">
        <div className="p-2.5 bg-maribel-50 text-maribel-700 rounded-lg">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase text-stone-500">
            {t('metrics.activeCatalog')}
          </p>
          <p className="text-xl font-bold font-serif text-stone-900">
            {t('metrics.productsCount', { count: metrics.totalCatalogCount })}
          </p>
        </div>
      </div>

      {/* Saldo Inventario */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex items-center space-x-3">
        <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
          <Boxes className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase text-stone-500">
            {t('metrics.inventoryBalance')}
          </p>
          <p className="text-xl font-bold font-serif text-stone-900">
            {t('table.unitsTag', { count: metrics.totalStockUnits })}
          </p>
        </div>
      </div>

      {/* Stock Crítico */}
      <div
        onClick={onClickCritical}
        role={onClickCritical ? 'button' : undefined}
        tabIndex={onClickCritical ? 0 : undefined}
        className={`p-4 rounded-xl border shadow-xs flex items-center justify-between transition-all ${
          hasOutOfStock
            ? 'bg-rose-50/70 border-rose-300 hover:bg-rose-100/70 cursor-pointer'
            : hasCritical
            ? 'bg-amber-50/60 border-amber-300 hover:bg-amber-100/60 cursor-pointer'
            : 'bg-white border-stone-200/80'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`p-2.5 rounded-lg ${
              hasOutOfStock
                ? 'bg-rose-600 text-white'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase text-stone-600">
              STOCK CRÍTICO (≤ {metrics.lowStockThreshold})
            </p>
            <p
              className={`text-xl font-bold font-serif ${
                hasOutOfStock ? 'text-rose-800' : 'text-amber-800'
              }`}
            >
              {t('metrics.referencesCount', { count: metrics.lowStockCount })}
            </p>
          </div>
        </div>
        {hasOutOfStock && (
          <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-2xs">
            {metrics.outOfStockCount} en 0 uds
          </span>
        )}
      </div>
    </div>
  );
};
