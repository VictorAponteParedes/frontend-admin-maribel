import React, { useState, useEffect } from 'react';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useSalesStore } from '@/store/useSalesStore';
import { Sale } from '@/features/sales/types/sale.types';
import { formatCurrency } from '@/utils/formatters';
import { t } from '@/lang';
import { X, Barcode, ShoppingCart, CheckCircle, AlertCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui';

export const SaleFormModal: React.FC = () => {
  const { isCreateModalOpen, closeCreateModal, addSale } = useSalesStore();
  const { products, getByBarcode, deductStock } = useInventoryStore();

  const [barcodeInput, setBarcodeInput] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState('Consumidor Final');
  const [customerCode, setCustomerCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const selectedProduct = getByBarcode(barcodeInput);

  useEffect(() => {
    if (isCreateModalOpen) {
      setBarcodeInput('');
      setQuantity(1);
      setCustomerName('Consumidor Final');
      setCustomerCode('');
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isCreateModalOpen]);

  if (!isCreateModalOpen) return null;

  const handleSelectQuickProduct = (barcode: string) => {
    setBarcodeInput(barcode);
    setErrorMessage('');
  };

  const handleSaveSale = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedProduct) {
      setErrorMessage('Debes seleccionar o escanear un código de barras válido.');
      return;
    }

    if (quantity <= 0) {
      setErrorMessage('La cantidad debe ser mayor a 0.');
      return;
    }

    if (quantity > selectedProduct.stock) {
      setErrorMessage(
        `Stock insuficiente. El saldo actual es de ${selectedProduct.stock} unidades.`
      );
      return;
    }

    // Descontar del inventario
    const success = deductStock(selectedProduct.barcode, quantity);
    if (!success) {
      setErrorMessage('Error al actualizar el saldo de inventario.');
      return;
    }

    const subtotal = selectedProduct.price * quantity;
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(
      today.getMonth() + 1
    ).padStart(2, '0')}/${today.getFullYear()}`;

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      saleNumber: `V-${Date.now().toString().slice(-4)}`,
      date: formattedDate,
      customerCode: customerCode.trim() || undefined,
      customerName: customerName.trim() || 'Consumidor Final',
      totalQuantity: quantity,
      total: subtotal,
      items: [
        {
          barcode: selectedProduct.barcode,
          brand: selectedProduct.brand,
          name: selectedProduct.name,
          size: selectedProduct.size,
          quantity: quantity,
          unitPrice: selectedProduct.price,
          subtotal: subtotal,
        },
      ],
    };

    addSale(newSale);
    setSuccessMessage(t('sales.saleSaved'));

    setTimeout(() => {
      closeCreateModal();
    }, 700);
  };

  const subtotal = selectedProduct ? selectedProduct.price * quantity : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-maribel-100 text-maribel-800 rounded-xl">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-base">
                {t('sales.newSale')}
              </h3>
              <p className="text-xs text-stone-500">
                Registra la salida y actualiza el saldo de inventario automáticamente
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCreateModal}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSaveSale} className="p-6 space-y-5">
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

          {/* Código de barras input */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t('sales.scanBarcode')}
            </label>
            <div className="relative">
              <Barcode className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Escanea o escribe el código (ej. 6972011068673)"
                className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-maribel-600"
                autoFocus
              />
            </div>

            {/* Sugerencias de productos del catálogo */}
            {!selectedProduct && (
              <div className="mt-2">
                <p className="text-[11px] text-stone-400 mb-1 flex items-center space-x-1">
                  <Search className="w-3 h-3" />
                  <span>O elige un perfume con stock del catálogo:</span>
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {products.slice(0, 4).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectQuickProduct(p.barcode)}
                      className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] rounded-lg transition-colors text-left"
                    >
                      <span className="font-semibold">{p.brand}</span> - {p.name.slice(0, 20)}... ({p.stock} uds)
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tarjeta de producto encontrado */}
          {selectedProduct ? (
            <div className="p-4 bg-maribel-50/60 border border-maribel-200 rounded-2xl flex flex-col gap-2">
              <div className="flex items-start justify-between">
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
                  <span className="text-xs text-stone-500">Precio unitario</span>
                  <p className="text-sm font-bold text-stone-900">
                    {formatCurrency(selectedProduct.price)}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-maribel-200/60 flex items-center justify-between text-xs">
                <span className="text-stone-600">Saldo actual en inventario:</span>
                <span
                  className={`font-semibold px-2 py-0.5 rounded-md ${
                    selectedProduct.stock > 3
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedProduct.stock} unidades disponibles
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-stone-50 border border-dashed border-stone-200 rounded-2xl text-center text-xs text-stone-400">
              Escanea un código de barras para ver los datos del perfume.
            </div>
          )}

          {/* Cantidad y datos del cliente */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('sales.quantity')}
              </label>
              <input
                type="number"
                min={1}
                max={selectedProduct ? selectedProduct.stock : 99}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-maribel-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('sales.customerName')}
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Consumidor Final"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-maribel-600"
              />
            </div>
          </div>

          {/* Subtotal y Botones */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500">Total a cobrar:</span>
              <p className="text-xl font-bold font-serif text-maribel-800">
                {formatCurrency(subtotal)}
              </p>
            </div>

            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={closeCreateModal}>
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={!selectedProduct || selectedProduct.stock < quantity}
              >
                Completar Venta
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
