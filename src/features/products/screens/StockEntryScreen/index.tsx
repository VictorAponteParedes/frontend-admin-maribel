import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useStockEntryStore } from '@/store/useStockEntryStore';
import { formatCurrency, formatGuarani, parseGuarani } from '@/utils/formatters';
import { AppInput, DatePickerInput } from '@/components/ui';
import { RoutesView } from '@/navigation/routes';
import {
  ArrowLeft,
  Barcode,
  Camera,
  Search,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Package,
  Sparkles,
  TrendingUp,
  DollarSign,
  ShoppingCart,
} from 'lucide-react';

export const StockEntryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { products, getByBarcode, recordIncomingStock } = useInventoryStore();
  const { recordStockEntry } = useStockEntryStore();

  const [barcodeInput, setBarcodeInput] = useState('6972011068673');
  const [quantity, setQuantity] = useState<number>(12);
  const [costPrice, setCostPrice] = useState<number>(20000); // Precio unitario de compra
  const [sellingPrice, setSellingPrice] = useState<number>(30000); // Precio unitario de venta
  const [dateInput, setDateInput] = useState('');
  const [batchNumber, setBatchNumber] = useState('LOT-2026-FRAG-B42');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const selectedProduct = getByBarcode(barcodeInput) || products[0];

  useEffect(() => {
    if (products.length > 0) {
      const initialProd = products[0];
      setBarcodeInput(initialProd.barcode);
      setCostPrice(initialProd.costPrice || 20000);
      setSellingPrice(initialProd.price || 30000);
    }
    setQuantity(12);
    setBatchNumber(`LOT-${new Date().getFullYear()}-FRAG-B${Math.floor(Math.random() * 90 + 10)}`);
    const today = new Date();
    setDateInput(
      `${String(today.getDate()).padStart(2, '0')}/${String(
        today.getMonth() + 1
      ).padStart(2, '0')}/${today.getFullYear()}`
    );
  }, [products]);

  const handleSelectQuickProduct = (barcode: string) => {
    setBarcodeInput(barcode);
    const prod = getByBarcode(barcode);
    if (prod) {
      setCostPrice(prod.costPrice || Math.round(prod.price * 0.65));
      setSellingPrice(prod.price);
    }
    setErrorMessage('');
  };

  const handleQuickAddQty = (qtyToAdd: number) => {
    setQuantity(qtyToAdd);
  };

  // Ganancia Unitaria calculada en vivo: Venta - Compra
  const unitProfit = sellingPrice - costPrice;
  const marginPercent =
    sellingPrice > 0 ? Math.round((unitProfit / sellingPrice) * 100) : 0;

  // Totales del lote
  const totalCost = quantity * costPrice;
  const totalSales = quantity * sellingPrice;
  const totalProfit = quantity * unitProfit;

  const existingStock = selectedProduct ? selectedProduct.stock : 0;
  const projectedStock = existingStock + quantity;

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedProduct) {
      setErrorMessage('Debes seleccionar un producto válido por su código de barras.');
      return;
    }

    if (quantity <= 0) {
      setErrorMessage('La cantidad ingresada debe ser mayor a 0 unidades.');
      return;
    }

    if (costPrice < 0) {
      setErrorMessage('El precio de compra no puede ser negativo.');
      return;
    }

    if (sellingPrice < costPrice) {
      setErrorMessage('Advertencia: El precio de venta no debería ser menor al costo de compra.');
      // Permite continuar si el usuario lo confirma, pero avisa
    }

    // 1. Registrar entrada en el store de historial
    recordStockEntry({
      barcode: selectedProduct.barcode,
      quantity,
      unitCost: costPrice,
      date: dateInput,
    });

    // 2. Actualizar el inventario general con los nuevos precios y saldos
    recordIncomingStock(
      selectedProduct.barcode,
      quantity,
      costPrice,
      sellingPrice,
      dateInput
    );

    setSuccessMessage('¡Ingreso registrado y existencias actualizadas con éxito!');
    setTimeout(() => {
      navigate(RoutesView.PRODUCTS);
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Barra superior de navegación */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-200/80">
        <button
          type="button"
          onClick={() => navigate(RoutesView.PRODUCTS)}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-stone-600 hover:text-maribel-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Inventario</span>
        </button>

        <span className="px-3 py-1 bg-rose-50 border border-rose-100 text-maribel-700 text-xs font-semibold rounded-full">
          Recepción de Mercadería & Actualización de Precios
        </span>
      </div>

      {/* Título de la página */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-2xs">
            <Package className="w-7 h-7 stroke-[1.8]" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
              Registrar Ingreso de Mercadería
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Actualiza saldos, precios unitarios de compra y venta, y visualiza la ganancia estimada en tiempo real.
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-3 text-rose-700 text-xs font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3 text-emerald-800 text-xs font-semibold">
          <Check className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSaveEntry} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Principal (2 de 3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tarjeta: Búsqueda y Selección del Producto */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-800 flex items-center space-x-1">
                <span>Código de barras / SKU</span>
                <span className="text-rose-500">*</span>
              </label>

              <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200/60 rounded-full text-[11px] font-medium text-emerald-700">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span>Lector USB Activo</span>
              </span>
            </div>

            <AppInput
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              placeholder="6972011068673"
              leftIcon={<Barcode className="w-5 h-5" />}
              rightElement={
                <button
                  type="button"
                  className="px-2.5 py-1 text-[11px] font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 flex items-center space-x-1.5 shadow-2xs"
                >
                  <Camera className="w-3.5 h-3.5 text-maribel-700" />
                  <span>Cámara</span>
                </button>
              }
              className="font-mono font-medium"
            />

            {/* Coincidencias rápidas del catálogo */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-[11px] mb-2 text-stone-500">
                <span className="flex items-center space-x-1">
                  <Search className="w-3.5 h-3.5 text-stone-400" />
                  <span>Seleccionar producto frecuente del catálogo:</span>
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {products.slice(0, 4).map((prod) => {
                  const isSelected = selectedProduct?.barcode === prod.barcode;
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => handleSelectQuickProduct(prod.barcode)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all text-left ${
                        isSelected
                          ? 'bg-rose-50 border border-maribel-400 text-maribel-900 font-semibold shadow-2xs'
                          : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700 border border-transparent'
                      }`}
                    >
                      <span className="font-bold">{prod.brand}</span> •{' '}
                      <span className="opacity-90">{prod.name.slice(0, 20)}...</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Card del Producto Seleccionado */}
            {selectedProduct && (
              <div className="p-4 bg-stone-50/80 border border-stone-200/80 rounded-2xl flex items-center justify-between gap-4 mt-2">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-11 h-11 bg-white rounded-xl border border-stone-200 flex items-center justify-center text-maribel-700 shrink-0 shadow-2xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-stone-500 font-medium truncate">
                      <strong className="text-stone-800 font-bold">{selectedProduct.brand}</strong> •{' '}
                      {selectedProduct.size}
                    </p>
                    <h4 className="font-serif font-bold text-stone-900 text-sm truncate mt-0.5">
                      {selectedProduct.name}
                    </h4>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    STOCK ACTUAL
                  </span>
                  <span className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span>{selectedProduct.stock} uds</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Tarjeta: Cantidades y Precios de Compra / Venta / Ganancia */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
            <h3 className="font-serif font-bold text-stone-900 text-sm pb-2 border-b border-stone-100">
              Cantidades, Precios y Rentabilidad
            </h3>

            {/* Cantidad recibida */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-800">
                  Cantidad recibida a ingresar (uds)
                </label>
                <span className="text-[11px] text-stone-400">Pack estándar: 12 unidades</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div className="flex items-center rounded-xl border border-stone-200 bg-stone-50 overflow-hidden focus-within:ring-2 focus-within:ring-maribel-600/20 focus-within:border-maribel-600 focus-within:bg-white transition-all">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-2.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full text-center py-2 text-sm font-bold text-stone-900 bg-transparent focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-4 py-2.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Botones de incremento rápido */}
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleQuickAddQty(6)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      quantity === 6
                        ? 'bg-rose-50 border-maribel-300 text-maribel-800 font-bold'
                        : 'bg-stone-100 hover:bg-stone-200/80 border-transparent text-stone-700'
                    }`}
                  >
                    +6
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAddQty(12)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      quantity === 12
                        ? 'bg-rose-50 border-maribel-300 text-maribel-800 font-bold'
                        : 'bg-stone-100 hover:bg-stone-200/80 border-transparent text-stone-700'
                    }`}
                  >
                    +12 (Caja)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAddQty(24)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      quantity === 24
                        ? 'bg-rose-50 border-maribel-300 text-maribel-800 font-bold'
                        : 'bg-stone-100 hover:bg-stone-200/80 border-transparent text-stone-700'
                    }`}
                  >
                    +24 (Master)
                  </button>
                </div>
              </div>
            </div>

            {/* Fila Financiera: Precio Compra vs Precio Venta vs Ganancia */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Precio Compra */}
              <div>
                <label className="text-xs font-semibold text-stone-800 mb-1.5 flex items-center justify-between">
                  <span>Precio de compra (Gs.)</span>
                  <DollarSign className="w-3.5 h-3.5 text-stone-400" />
                </label>
                <AppInput
                  prefixText="Gs."
                  value={costPrice > 0 ? formatGuarani(costPrice) : ''}
                  onChange={(e) => setCostPrice(parseGuarani(e.target.value))}
                  placeholder="0"
                  className="font-semibold text-sm"
                />
                <p className="text-[11px] text-stone-400 mt-1">Costo pagado al proveedor</p>
              </div>

              {/* Precio Venta */}
              <div>
                <label className="text-xs font-semibold text-stone-800 mb-1.5 flex items-center justify-between">
                  <span>Precio de venta (Gs.)</span>
                  <ShoppingCart className="w-3.5 h-3.5 text-maribel-700" />
                </label>
                <AppInput
                  prefixText="Gs."
                  value={sellingPrice > 0 ? formatGuarani(sellingPrice) : ''}
                  onChange={(e) => setSellingPrice(parseGuarani(e.target.value))}
                  placeholder="0"
                  className="font-bold text-sm"
                />
                <p className="text-[11px] text-stone-400 mt-1">PVP sugerido al cliente</p>
              </div>

              {/* Ganancia Unitaria Calculada en tiempo real */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900">
                      Ganancia / Unidad
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      ~{marginPercent}%
                    </span>
                  </div>
                  <p className="text-lg font-bold font-serif text-emerald-800 mt-1">
                    +{formatCurrency(unitProfit)}
                  </p>
                </div>
                <p className="text-[10px] text-emerald-700/80 font-medium">
                  {costPrice > 0 && sellingPrice > 0
                    ? `Ganas ${formatCurrency(unitProfit)} por cada frasco`
                    : 'Ingresa compra y venta'}
                </p>
              </div>
            </div>

            {/* Fecha de Recepción y Lote */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <DatePickerInput
                  label="Fecha de recepción"
                  value={dateInput}
                  onChange={(d) => setDateInput(d)}
                />
              </div>

              <div>
                <AppInput
                  label="N° de Lote / Proveedor"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  placeholder="LOT-2026-FRAG-B42"
                  className="font-mono uppercase"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Columna Lateral de Resumen Financiero (1 de 3) */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5 sticky top-24">
            <div className="flex items-center space-x-2 pb-3 border-b border-stone-100">
              <TrendingUp className="w-5 h-5 text-emerald-700" />
              <h3 className="font-serif font-bold text-stone-900 text-base">
                Resumen del Lote
              </h3>
            </div>

            {/* Proyección de existencias */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                PROYECCIÓN EN ESTANTERÍA
              </span>
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span>Stock actual:</span>
                <span className="font-medium">{existingStock} uds</span>
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold">
                <span>Ingreso nuevo:</span>
                <span>+{quantity} uds</span>
              </div>
              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
                <span className="font-bold text-stone-800">Total Disponible:</span>
                <span className="font-bold text-base text-stone-900 font-serif">
                  {projectedStock} uds
                </span>
              </div>
            </div>

            {/* Resumen Monetario del Lote */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
                <span className="text-stone-500 font-medium">Inversión Total del Lote:</span>
                <strong className="text-stone-900 text-sm font-mono">
                  {formatCurrency(totalCost)}
                </strong>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
                <span className="text-stone-500 font-medium">Venta Bruta Proyectada:</span>
                <strong className="text-stone-900 text-sm font-mono">
                  {formatCurrency(totalSales)}
                </strong>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                  GANANCIA TOTAL ESTIMADA
                </span>
                <p className="text-2xl font-bold font-serif text-emerald-800">
                  +{formatCurrency(totalProfit)}
                </p>
                <p className="text-[11px] text-emerald-700">
                  Al vender las {quantity} unidades de este ingreso
                </p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={!selectedProduct || quantity <= 0}
                className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-maribel-800 hover:bg-maribel-900 transition-all shadow-xs disabled:opacity-50 active:scale-98"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Confirmar Ingreso (+{quantity} uds)</span>
              </button>

              <button
                type="button"
                onClick={() => navigate(RoutesView.PRODUCTS)}
                className="w-full py-2.5 text-xs font-semibold text-stone-500 hover:text-stone-800 hover:bg-stone-50 rounded-xl transition-colors text-center"
              >
                Cancelar y regresar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
