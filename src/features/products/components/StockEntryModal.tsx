import React, { useState, useEffect } from 'react';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useStockEntryStore } from '@/store/useStockEntryStore';
import { formatCurrency, formatGuarani, parseGuarani } from '@/utils/formatters';
import { AppInput, DatePickerInput } from '@/components/ui';
import {
  X,
  Barcode,
  Camera,
  Search,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Package,
  Sparkles,
} from 'lucide-react';

export const StockEntryModal: React.FC = () => {
  const { isEntryModalOpen, closeEntryModal, recordStockEntry } = useStockEntryStore();
  const { products, getByBarcode } = useInventoryStore();

  const [barcodeInput, setBarcodeInput] = useState('6972011068673');
  const [quantity, setQuantity] = useState<number>(12);
  const [unitCost, setUnitCost] = useState<number>(120250);
  const [dateInput, setDateInput] = useState('');
  const [batchNumber, setBatchNumber] = useState('LOT-2026-FRAG-B42');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const selectedProduct = getByBarcode(barcodeInput) || products[0];

  useEffect(() => {
    if (isEntryModalOpen) {
      if (products.length > 0) {
        setBarcodeInput(products[0].barcode);
        setUnitCost(Math.round(products[0].price * 0.65));
      }
      setQuantity(12);
      setBatchNumber(`LOT-${new Date().getFullYear()}-FRAG-B${Math.floor(Math.random() * 90 + 10)}`);
      const today = new Date();
      setDateInput(
        `${String(today.getDate()).padStart(2, '0')}/${String(
          today.getMonth() + 1
        ).padStart(2, '0')}/${today.getFullYear()}`
      );
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isEntryModalOpen, products]);

  if (!isEntryModalOpen) return null;

  const handleSelectQuickProduct = (barcode: string) => {
    setBarcodeInput(barcode);
    const prod = getByBarcode(barcode);
    if (prod) {
      setUnitCost(Math.round(prod.price * 0.65));
    }
    setErrorMessage('');
  };

  const handleQuickAddQty = (qtyToAdd: number) => {
    setQuantity(qtyToAdd);
  };

  const handleUnitCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const parsed = parseGuarani(raw);
    setUnitCost(parsed);
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedProduct) {
      setErrorMessage('Debes seleccionar o ingresar un código de barras válido.');
      return;
    }

    if (quantity <= 0) {
      setErrorMessage('La cantidad ingresada debe ser mayor a 0.');
      return;
    }

    if (unitCost < 0) {
      setErrorMessage('El costo unitario no puede ser negativo.');
      return;
    }

    const success = recordStockEntry({
      barcode: selectedProduct.barcode,
      quantity,
      unitCost,
      date: dateInput,
    });

    if (!success) {
      setErrorMessage('Ocurrió un error al procesar el ingreso de mercadería.');
      return;
    }

    setSuccessMessage('¡Ingreso registrado y existencias actualizadas con éxito!');
    setTimeout(() => {
      closeEntryModal();
    }, 700);
  };

  const totalCost = quantity * unitCost;
  const existingStock = selectedProduct ? selectedProduct.stock : 0;
  const projectedStock = existingStock + quantity;

  // Cálculo del margen estimado si existe precio de venta
  const estimatedMargin =
    selectedProduct && selectedProduct.price > 0 && unitCost > 0
      ? Math.max(0, Math.round(((selectedProduct.price - unitCost) / selectedProduct.price) * 100))
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl border border-stone-200/80 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Cabecera elegante */}
        <div className="p-6 border-b border-stone-100 flex items-start justify-between bg-stone-50/40">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-2xs">
              <Package className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-serif font-bold text-stone-900 text-lg tracking-tight">
                  Ingreso de Mercadería
                </h3>
                <span className="px-2 py-0.5 bg-rose-50 border border-rose-100 text-maribel-700 text-[11px] font-semibold rounded-full">
                  Perfumería
                </span>
                <span className="px-2 py-0.5 bg-stone-100 border border-stone-200 text-stone-600 text-[11px] font-mono rounded-full">
                  {batchNumber}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Registra la recepción de lotes, códigos de barra y actualiza saldos al instante
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeEntryModal}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSaveEntry} className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-emerald-700 text-xs font-semibold">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Fila: Código de barras / SKU con AppInput + Badge de Lector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
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
                  onClick={() => {}}
                  className="px-2.5 py-1 text-[11px] font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 flex items-center space-x-1.5 transition-colors shadow-2xs"
                  title="Escanear con cámara"
                >
                  <Camera className="w-3.5 h-3.5 text-maribel-700" />
                  <span>Cámara</span>
                </button>
              }
              className="font-mono font-medium"
              autoFocus
            />

            {/* Coincidencias rápidas del catálogo */}
            <div className="mt-2.5">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="text-stone-500 flex items-center space-x-1">
                  <Search className="w-3 h-3 text-stone-400" />
                  <span>Coincidencias rápidas del catálogo:</span>
                </span>
                <span className="text-maribel-700 font-semibold cursor-pointer hover:underline">
                  + Crear nuevo producto
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {products.slice(0, 3).map((prod) => {
                  const isSelected = selectedProduct?.barcode === prod.barcode;
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => handleSelectQuickProduct(prod.barcode)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-medium transition-all text-left ${
                        isSelected
                          ? 'bg-rose-50/80 border border-maribel-300 text-maribel-900 font-semibold shadow-2xs'
                          : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700 border border-transparent'
                      }`}
                    >
                      <span className="font-bold">{prod.brand}</span>{' '}
                      <span className="opacity-90">{prod.name.slice(0, 18)}...</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tarjeta de Producto Seleccionado */}
          {selectedProduct && (
            <div className="p-4 bg-stone-50/70 border border-stone-200/80 rounded-2xl flex items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-10 h-10 bg-white rounded-xl border border-stone-200 flex items-center justify-center text-maribel-700 shrink-0 shadow-2xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-stone-500 font-medium truncate">
                    <strong className="text-stone-800 font-bold">{selectedProduct.brand}</strong> •{' '}
                    {selectedProduct.size} - Fragancia Fina
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
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span>{selectedProduct.stock} uds</span>
                </span>
              </div>
            </div>
          )}

          {/* Fila: Cantidad recibida + Costo unitario (Gs.) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cantidad recibida */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-800">
                  Cantidad recibida (uds)
                </label>
                <span className="text-[11px] text-stone-400">Pack estándar: 12</span>
              </div>

              <div className="flex items-center rounded-xl border border-stone-200 bg-stone-50 overflow-hidden focus-within:ring-2 focus-within:ring-maribel-600/20 focus-within:border-maribel-600 focus-within:bg-white transition-all">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
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
                  className="px-3.5 py-2.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Botones de incremento rápido */}
              <div className="flex items-center space-x-1.5 mt-2">
                <button
                  type="button"
                  onClick={() => handleQuickAddQty(6)}
                  className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border transition-all ${
                    quantity === 6
                      ? 'bg-rose-50 border-maribel-300 text-maribel-800'
                      : 'bg-stone-100 hover:bg-stone-200/80 border-transparent text-stone-600'
                  }`}
                >
                  +6
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAddQty(12)}
                  className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border transition-all ${
                    quantity === 12
                      ? 'bg-rose-50 border-maribel-300 text-maribel-800'
                      : 'bg-stone-100 hover:bg-stone-200/80 border-transparent text-stone-600'
                  }`}
                >
                  +12 (Caja)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAddQty(24)}
                  className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border transition-all ${
                    quantity === 24
                      ? 'bg-rose-50 border-maribel-300 text-maribel-800'
                      : 'bg-stone-100 hover:bg-stone-200/80 border-transparent text-stone-600'
                  }`}
                >
                  +24 (Master)
                </button>
              </div>
            </div>

            {/* Costo unitario en Guaraníes (Gs.) usando AppInput */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-800">
                  Costo unitario (Gs.)
                </label>
                {estimatedMargin > 0 && (
                  <span className="text-[11px] font-semibold text-maribel-700">
                    Margen estimado: ~{estimatedMargin}%
                  </span>
                )}
              </div>

              <AppInput
                type="text"
                prefixText="Gs."
                value={unitCost > 0 ? formatGuarani(unitCost) : ''}
                onChange={handleUnitCostChange}
                placeholder="0"
                className="font-semibold"
              />

              {selectedProduct && (
                <p className="text-[11px] text-stone-400 mt-1.5">
                  Precio venta al público actual:{' '}
                  <strong className="text-stone-700 font-semibold">
                    {formatCurrency(selectedProduct.price)}
                  </strong>
                </p>
              )}
            </div>
          </div>

          {/* Fila: Fecha de recepción con DatePickerInput + N° de Lote con AppInput */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <DatePickerInput
                label="Fecha de recepción"
                value={dateInput}
                onChange={(newDate) => setDateInput(newDate)}
                placeholder="DD/MM/AAAA"
              />
            </div>
          </div>

          {/* Tarjeta inferior de Proyección en Estantería y Costo Total en Guaraníes */}
          <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                Σ
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  PROYECCIÓN EN ESTANTERÍA
                </span>
                <p className="text-xs text-stone-700">
                  <span className="font-semibold">{existingStock} uds existentes</span> +{' '}
                  <strong className="text-emerald-700 font-bold">{quantity} nuevas</strong> ={' '}
                  <strong className="text-stone-900 font-bold text-sm">{projectedStock} uds totales</strong>
                </p>
              </div>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-emerald-100/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                COSTO TOTAL DEL LOTE
              </span>
              <p className="text-xl font-bold font-serif text-stone-900">
                {formatCurrency(totalCost)}
              </p>
            </div>
          </div>

          {/* Footer: Botones Cancelar y Confirmar Ingreso */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={closeEntryModal}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!selectedProduct || quantity <= 0}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-maribel-800 hover:bg-maribel-900 transition-all shadow-xs disabled:opacity-50"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Confirmar Ingreso (+{quantity} uds)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
