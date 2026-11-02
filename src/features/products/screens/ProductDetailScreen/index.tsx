import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useStockEntryStore } from '@/store/useStockEntryStore';
import { formatCurrency } from '@/utils/formatters';
import { RoutesView } from '@/navigation/routes';
import { useTranslation } from '@/locale';
import {
  ArrowLeft,
  Barcode,
  Package,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Calendar,
  Sparkles,
  Layers,
  Clock,
  ArrowDownRight,
  PackagePlus,
} from 'lucide-react';

export const ProductDetailScreen: React.FC = () => {
  const { t } = useTranslation(['inventory', 'translation']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, getById } = useInventoryStore();
  const { entries } = useStockEntryStore();

  const product = getById(id || '') || products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-stone-200 mt-10 space-y-4">
        <Package className="w-12 h-12 text-stone-300 mx-auto" />
        <h2 className="text-xl font-serif font-bold text-stone-800">
          {t('detail.notFoundTitle')}
        </h2>
        <p className="text-xs text-stone-500">
          {t('detail.notFoundDesc')}
        </p>
        <button
          type="button"
          onClick={() => navigate(RoutesView.PRODUCTS)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-maribel-800 text-white text-xs font-semibold rounded-xl hover:bg-maribel-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('detail.backToInventory')}</span>
        </button>
      </div>
    );
  }

  const costPrice = product.costPrice || Math.round(product.price * 0.65);
  const profit = product.profit || product.price - costPrice;
  const marginPercent =
    product.price > 0 ? Math.round((profit / product.price) * 100) : 0;

  // Entradas registradas de este producto
  const productEntries = entries.filter((e) => e.barcode === product.barcode);

  // Valorizaciones financieras
  const totalStockValueCost = product.stock * costPrice;
  const totalStockValueSale = product.stock * product.price;
  const projectedTotalProfit = product.stock * profit;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Barra superior de navegación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/80">
        <button
          type="button"
          onClick={() => navigate(RoutesView.PRODUCTS)}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-stone-600 hover:text-maribel-800 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('detail.backButton')}</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => navigate(RoutesView.STOCK_ENTRY)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-maribel-800 hover:bg-maribel-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <PackagePlus className="w-4 h-4" />
            <span>{t('detail.recordEntry')}</span>
          </button>
        </div>
      </div>

      {/* Hero del Producto */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-50 to-maribel-100/60 border border-rose-200/60 rounded-2xl flex items-center justify-center text-maribel-700 shrink-0 shadow-xs">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-rose-50 border border-rose-100 text-maribel-800 text-[11px] font-bold rounded-full uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="text-xs text-stone-400 font-mono flex items-center space-x-1">
                <Barcode className="w-3.5 h-3.5" />
                <span>{product.barcode}</span>
              </span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
              {product.name}
            </h1>
            <p className="text-xs text-stone-500 font-medium">
              {t('detail.presentationSize', { size: product.size })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 bg-stone-50/80 p-4 rounded-2xl border border-stone-200/70 shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              {t('detail.currentStockLabel')}
            </span>
            <span
              className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-sm font-bold mt-1 ${
                product.stock === 0
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : product.stock <= 5
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{t('detail.unitsCount', { count: product.stock })}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 4 Métricas Clave Financieras */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Precio Compra */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              {t('detail.purchasePrice')}
            </span>
            <DollarSign className="w-4 h-4 text-stone-400" />
          </div>
          <p className="text-2xl font-bold font-serif text-stone-800">
            {formatCurrency(costPrice)}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">{t('detail.purchaseCostDesc')}</p>
        </div>

        {/* Precio Venta */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              {t('detail.salePrice')}
            </span>
            <ShoppingCart className="w-4 h-4 text-maribel-700" />
          </div>
          <p className="text-2xl font-bold font-serif text-stone-900">
            {formatCurrency(product.price)}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">{t('detail.salePriceDesc')}</p>
        </div>

        {/* Ganancia Unitaria */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs bg-gradient-to-br from-white to-emerald-50/20">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {t('detail.unitProfit')}
            </span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
              {t('detail.marginTag', { margin: marginPercent })}
            </span>
          </div>
          <p className="text-2xl font-bold font-serif text-emerald-700">
            +{formatCurrency(profit)}
          </p>
          <p className="text-[11px] text-emerald-600/90 mt-1">{t('detail.profitDesc')}</p>
        </div>

        {/* Fecha de Recepción */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              {t('detail.lastReception')}
            </span>
            <Calendar className="w-4 h-4 text-stone-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-stone-800">
            {product.receptionDate || '02/11/2026'}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">{t('detail.lastReceptionDesc')}</p>
        </div>
      </div>

      {/* Cuadrícula de Desglose: Balance Operativo & Valorización */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance Operativo de Unidades */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-stone-100">
            <Layers className="w-4 h-4 text-maribel-700" />
            <h3 className="font-serif font-bold text-stone-900 text-base">
              {t('detail.stockMovements')}
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
              <span className="text-stone-500 font-medium">{t('detail.historicalTotalIn')}</span>
              <strong className="text-stone-900 text-sm">
                {t('table.unitsTag', { count: product.totalIn })}
              </strong>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50/50 text-maribel-900">
              <span className="font-medium">{t('detail.historicalTotalSold')}</span>
              <strong className="text-maribel-800 text-sm font-bold">
                {t('table.unitsTag', { count: product.totalSold })}
              </strong>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 text-emerald-900 font-semibold border border-emerald-100">
              <span>{t('detail.currentAvailable')}</span>
              <span className="text-base font-bold font-serif">
                {t('table.unitsTag', { count: product.stock })}
              </span>
            </div>
          </div>
        </div>

        {/* Proyección Financiera de Stock Restante */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-stone-100">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <h3 className="font-serif font-bold text-stone-900 text-base">
              {t('detail.stockValuation')}
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
              <span className="text-stone-500 font-medium">{t('detail.tiedInvestment')}</span>
              <strong className="text-stone-900 text-sm font-mono">
                {formatCurrency(totalStockValueCost)}
              </strong>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
              <span className="text-stone-500 font-medium">{t('detail.potentialSales')}</span>
              <strong className="text-stone-900 text-sm font-mono">
                {formatCurrency(totalStockValueSale)}
              </strong>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 text-emerald-950 font-bold border border-emerald-200/80">
              <span>{t('detail.projectedProfit')}</span>
              <span className="text-base font-serif text-emerald-700 font-bold">
                +{formatCurrency(projectedTotalProfit)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Historial de Lotes / Entradas de este perfume */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-stone-400" />
            <h3 className="font-serif font-bold text-stone-900 text-base">
              {t('detail.entriesHistorySection', { count: productEntries.length })}
            </h3>
          </div>
        </div>

        {productEntries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] border-b border-stone-200">
                <tr>
                  <th className="px-5 py-3">{t('detail.date')}</th>
                  <th className="px-5 py-3 text-center">{t('detail.qtyReceived')}</th>
                  <th className="px-5 py-3 text-right">{t('detail.unitCost')}</th>
                  <th className="px-5 py-3 text-right">{t('detail.totalLotCost')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {productEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-[11px] text-stone-700">
                      {entry.date}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <ArrowDownRight className="w-3 h-3 mr-0.5" />
                        {t('table.plusUnitsTag', { count: entry.quantity })}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium text-stone-800 font-mono">
                      {formatCurrency(entry.unitCost)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-stone-900 font-mono">
                      {formatCurrency(entry.totalCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-stone-400">
            {t('detail.noEntriesArchived')}
          </div>
        )}
      </div>
    </div>
  );
};
