import React from 'react';
import { Layers, Boxes, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/locale';
import { ProductsMetrics } from '../hooks/useProductsList';

export interface ProductsMetricsBarProps {
  metrics: ProductsMetrics;
}

export const ProductsMetricsBar: React.FC<ProductsMetricsBarProps> = ({ metrics }) => {
  const { t } = useTranslation(['inventory', 'translation']);

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
      <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex items-center space-x-3">
        <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase text-stone-500">
            {t('metrics.criticalStock')}
          </p>
          <p className="text-xl font-bold font-serif text-amber-800">
            {t('metrics.referencesCount', { count: metrics.lowStockCount })}
          </p>
        </div>
      </div>
    </div>
  );
};
