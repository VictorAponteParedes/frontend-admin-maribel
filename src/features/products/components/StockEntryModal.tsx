import React, { useState, useEffect } from 'react';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useStockEntryStore } from '@/store/useStockEntryStore';
import { formatCurrency } from '@/utils/formatters';
import { t } from '@/lang';
import { X, Barcode, PackagePlus, CheckCircle, AlertCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui';

export const StockEntryModal: React.FC = () => {
  const { isEntryModalOpen, closeEntryModal, recordStockEntry } = useStockEntryStore();
  const { products, getByBarcode } = useInventoryStore();

  const [barcodeInput, setBarcodeInput] = useState('');
  const [quantity, setQuantity] = useState<number>(12);
  const [unitCost, setUnitCost] = useState<number>(0);
  const [dateInput, setDateInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const selectedProduct = getByBarcode(barcodeInput);

  useEffect(() => {
    if (isEntryModalOpen) {
      setBarcodeInput('');
      setQuantity(12);
      setUnitCost(0);
      const today = new Date();
      setDateInput(
        `${String(today.getDate()).padStart(2, '0')}/${String(
          today.getMonth() + 1
        ).padStart(2, '0')}/${today.getFullYear()}`
      );
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isEntryModalOpen]);

  if (!isEntryModalOpen) return null;

  const handleSelectQuickProduct = (barcode: string) => {
    setBarcodeInput(barcode);
    setErrorMessage('');
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedProduct) {
      setErrorMessage('Debes seleccionar o escanear un código de barras existente.');
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

    setSuccessMessage(t('inventory.entrySaved'));
    setTimeout(() => {
      closeEntryModal();
    }, 700);
  };

  const totalCost = quantity * unitCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-base">
                {t('inventory.entryModalTitle')}
              </h3>
              <p className="text-xs text-stone-500">
                {t('inventory.entryModalSubtitle')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeEntryModal}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSaveEntry} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-emerald-700 text-xs font-semibold">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Código de barras */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t('inventory.barcode')}
            </label>
            <div className="relative">
              <Barcode className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Escanea o ingresa el código del producto recibido"
                className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-maribel-600"
                autoFocus
              />
            </div>

            {!selectedProduct && (
              <div className="mt-2">
                <p className="text-[11px] text-stone-400 mb-1 flex items-center space-x-1">
                  <Search className="w-3 h-3" />
                  <span>O selecciona un producto existente para sumar mercadería:</span>
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {products.slice(0, 5).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectQuickProduct(p.barcode)}
                      className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] rounded-lg transition-colors text-left"
                    >
                      <span className="font-semibold">{p.brand}</span> - {p.name.slice(0, 18)}...
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preview del producto seleccionado */}
          {selectedProduct ? (
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-maribel-700">
                  {selectedProduct.brand}
                </span>
                <h4 className="text-xs font-bold text-stone-900 mt-0.5">
                  {selectedProduct.name}
                </h4>
                <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                  {selectedProduct.size} • Código: {selectedProduct.barcode}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-stone-500 block">Stock actual</span>
                <span className="text-xs font-bold text-stone-800">
                  {selectedProduct.stock} uds
                </span>
                <span className="text-[11px] text-emerald-700 block font-semibold mt-0.5">
                  Nuevo saldo: {selectedProduct.stock + quantity} uds
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-stone-50 border border-dashed border-stone-200 rounded-xl text-center text-xs text-stone-400">
              Escanea o ingresa un código para vincular la mercadería entrante.
            </div>
          )}

          {/* Cantidad recibida y Costo unitario */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('inventory.receivedQty')}
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-maribel-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('inventory.unitCost')}
              </label>
              <input
                type="number"
                min={0}
                value={unitCost}
                onChange={(e) => setUnitCost(Math.max(0, Number(e.target.value)))}
                placeholder="0"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-maribel-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Fecha
              </label>
              <input
                type="text"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                placeholder="DD/MM/AAAA"
                className="w-full px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-maribel-600"
              />
            </div>
          </div>

          {/* Costo Total Calculado y Botones */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500">Costo total del lote:</span>
              <p className="text-lg font-bold font-serif text-stone-900">
                {formatCurrency(totalCost)}
              </p>
            </div>

            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={closeEntryModal}>
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={!selectedProduct || quantity <= 0}
              >
                Confirmar Ingreso (+{quantity} uds)
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
