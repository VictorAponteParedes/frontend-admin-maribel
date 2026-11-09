import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Boxes,
  Eye,
  EyeOff,
  Save,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { ToggleSwitch } from '@/componentes/ToggleSwitch';
import { RoutesView } from '@/navigation/routes';
import { useSettingsStore } from '../../store/useSettingsStore';
import { toast } from '@/store/useToastStore';

export const InventorySettingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { settings, isLoading, fetchSettings, saveSettings } = useSettingsStore();

  const [showStockInWeb, setShowStockInWeb] = useState<boolean>(
    settings.showStockInWeb ?? true
  );
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(
    settings.lowStockThreshold ?? 5
  );
  const [blockOutOfStockOrders, setBlockOutOfStockOrders] = useState<boolean>(
    settings.blockOutOfStockOrders ?? true
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    setShowStockInWeb(settings.showStockInWeb ?? true);
    setLowStockThreshold(settings.lowStockThreshold ?? 5);
    setBlockOutOfStockOrders(settings.blockOutOfStockOrders ?? true);
  }, [
    settings.showStockInWeb,
    settings.lowStockThreshold,
    settings.blockOutOfStockOrders,
  ]);

  const hasChanges =
    showStockInWeb !== (settings.showStockInWeb ?? true) ||
    lowStockThreshold !== (settings.lowStockThreshold ?? 5) ||
    blockOutOfStockOrders !== (settings.blockOutOfStockOrders ?? true);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveSettings({
        ...settings,
        showStockInWeb,
        lowStockThreshold: Math.max(1, Number(lowStockThreshold) || 5),
        blockOutOfStockOrders,
      });
      toast.success(
        'Configuración guardada',
        'Las reglas de inventario y visibilidad de stock en la web se actualizaron correctamente.'
      );
    } catch {
      toast.error(
        'Error al guardar',
        'No se pudo actualizar la configuración de inventario.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-stone-500 mb-1">
            <span>Sistema</span>
            <span>/</span>
            <span>Configuración</span>
            <span>/</span>
            <span className="text-maribel-700 font-semibold">
              Inventario & Alertas
            </span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-stone-900 tracking-tight flex items-center gap-2">
            <Boxes className="w-6 h-6 text-maribel-700" />
            <span>Inventario & Alertas</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Control de visibilidad de stock en la tienda web, umbrales críticos y protección contra sobreventa.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => navigate(RoutesView.SETTINGS_STORE)}
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            <span>Ir a Datos de la Tienda</span>
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges || isSaving || isLoading}
            isLoading={isSaving}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            <span>Guardar Cambios</span>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Principal de Ajustes */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Visibilidad de Stock en la Web */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-maribel-700 flex items-center justify-center shrink-0">
                  {showStockInWeb ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif text-stone-900">
                    Mostrar cantidad de stock en la Tienda Web
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Si está activo, las tarjetas de productos y la vista de detalle en la web mostrarán a los clientes la cantidad exacta de unidades disponibles (ej: <strong>Stock: 10 uds</strong>).
                  </p>
                </div>
              </div>

              <ToggleSwitch
                checked={showStockInWeb}
                onChange={setShowStockInWeb}
                size="md"
                activeColor="bg-maribel-700"
                ariaLabel="Mostrar stock en la tienda web"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs text-stone-600 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                {showStockInWeb
                  ? 'Modo Transparente Activo: Los clientes verán cuántas unidades quedan en cada perfume antes de agregar al carrito.'
                  : 'Modo Boutique Activo: El número exacto de stock se oculta en el catálogo público, pero el carrito igualmente impedirá que pidan más de lo disponible.'}
              </span>
            </div>
          </div>

          {/* Card 2: Protección contra Sobreventa y Reglas de Stock */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif text-stone-900">
                    Bloquear pedidos y ventas sin stock suficiente
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Impide que un cliente en la web pida más unidades de las que existen en inventario (ej: pedir 15 cuando hay 10) y bloquea la facturación si el saldo físico no alcanza.
                  </p>
                </div>
              </div>

              <ToggleSwitch
                checked={blockOutOfStockOrders}
                onChange={setBlockOutOfStockOrders}
                size="md"
                activeColor="bg-emerald-600"
                ariaLabel="Bloquear pedidos sin stock"
              />
            </div>

            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label
                  htmlFor="lowStockThreshold"
                  className="text-xs font-bold text-stone-800 flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Umbral de Stock Crítico / Bajo (unidades)</span>
                </label>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Cuando el saldo sea menor o igual a este valor, se marcará como crítico en Inventario y como &ldquo;Últimas unidades&rdquo; en la web.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <input
                  id="lowStockThreshold"
                  type="number"
                  min={1}
                  max={50}
                  value={lowStockThreshold}
                  onChange={(e) =>
                    setLowStockThreshold(Math.max(1, parseInt(e.target.value, 10) || 1))
                  }
                  className="w-20 px-3 py-2 rounded-xl border border-stone-300 text-center text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-maribel-600/20 focus:border-maribel-700"
                />
                <span className="text-xs font-semibold text-stone-500">uds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Vista Previa en Tiempo Real de la Tarjeta Web */}
        <div className="lg:col-span-5 lg:sticky lg:top-6">
          <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-maribel-700">
                  Vista Previa en Tiempo Real
                </span>
                <h4 className="text-sm font-bold font-serif text-stone-900">
                  Card de Producto en la Web
                </h4>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  showStockInWeb
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-stone-100 text-stone-600 border-stone-200'
                }`}
              >
                {showStockInWeb ? 'Stock visible' : 'Stock oculto'}
              </span>
            </div>

            {/* Simulación del ProductCard de la Web */}
            <div className="max-w-[260px] mx-auto bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
              <div className="relative bg-stone-100 h-36 flex items-center justify-center">
                <Package className="w-10 h-10 text-stone-300" />
                <span className="absolute bottom-2 right-2 bg-white/95 text-stone-700 text-[10px] font-semibold px-2 py-0.5 rounded shadow-2xs">
                  85ml
                </span>
              </div>
              <div className="p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9b7036]">
                    PUMA
                  </span>
                  {showStockInWeb && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Stock: 10 uds
                    </span>
                  )}
                </div>
                <p className="font-serif font-bold text-sm text-stone-900 truncate">
                  Descripcion del producto
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="font-bold text-sm text-[#5a061a]">
                    Gs. 160.000
                  </span>
                  <span className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-rose-50 text-[#5a061a]">
                    + Agregar
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-stone-500 text-center leading-relaxed">
              En ambos modos, el cliente tendrá un tope máximo igual al stock disponible en su bolsa de compras.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
