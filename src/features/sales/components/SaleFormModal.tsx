import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useSalesStore } from '@/store/useSalesStore';
import { useCustomerStore } from '@/store/useCustomerStore';
import { Sale } from '@/features/sales/types/sale.types';
import { Customer } from '@/features/customers/types/customer.types';
import { formatCurrency } from '@/utils/formatters';
import { t } from '@/lang';
import { AppInput, Button } from '@/components/ui';
import { CustomerSelect } from './CustomerSelect';
import {
  X,
  Barcode,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Search,
  Sparkles,
  Plus,
  Minus,
} from 'lucide-react';

export const SaleFormModal: React.FC = () => {
  const { isCreateModalOpen, closeCreateModal, addSale } = useSalesStore();
  const { products, getByBarcode, deductStock } = useInventoryStore();
  const { customers } = useCustomerStore();

  const [barcodeInput, setBarcodeInput] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const selectedProduct = getByBarcode(barcodeInput);

  useEffect(() => {
    if (isCreateModalOpen) {
      setBarcodeInput('');
      setQuantity(1);
      // Por defecto cliente casual
      const casual = customers.find((c) => c.name === 'Cliente casual') || null;
      setSelectedCustomer(casual);
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isCreateModalOpen, customers]);

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
    const formattedTime = `${String(today.getHours()).padStart(2, '0')}:${String(
      today.getMinutes()
    ).padStart(2, '0')} hs`;

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      saleNumber: `V-${Date.now().toString().slice(-4)}`,
      date: formattedDate,
      time: formattedTime,
      customerCode: selectedCustomer?.code ? String(selectedCustomer.code) : undefined,
      customerName: selectedCustomer ? selectedCustomer.name : 'Cliente casual',
      customerPhone: selectedCustomer?.phone,
      customerAddress: selectedCustomer?.address,
      status: 'CONFIRMED',
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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs select-none">
        {/* Backdrop para cerrar al hacer clic afuera */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCreateModal}
          className="fixed inset-0"
        />

        {/* Drawer Lateral desde la derecha */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative z-10 w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-stone-200"
        >
          {/* Cabecera del Drawer */}
          <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/60 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 bg-rose-100/80 border border-rose-200/60 text-maribel-800 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs">
                <ShoppingCart className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-lg tracking-tight">
                  {t('sales.newSale')}
                </h3>
                <p className="text-xs text-stone-500">
                  Registra la salida y descuenta stock al instante
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeCreateModal}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cuerpo Scrolleable del Formulario */}
          <form onSubmit={handleSaveSale} className="flex-1 overflow-y-auto p-6 space-y-6">
            {errorMessage && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-2.5 text-rose-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-2.5 text-emerald-700 text-xs font-semibold">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Código de barras con AppInput */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-800 flex items-center space-x-1">
                <span>{t('sales.scanBarcode')}</span>
                <span className="text-rose-500">*</span>
              </label>

              <AppInput
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Escanea o escribe el código (ej. 6972011068673)"
                leftIcon={<Barcode className="w-4 h-4" />}
                className="font-mono text-xs"
                autoFocus
              />

              {/* Chips rápidos de catálogo con stock */}
              {!selectedProduct && (
                <div className="pt-2">
                  <p className="text-[11px] text-stone-400 mb-1.5 flex items-center space-x-1">
                    <Search className="w-3 h-3 text-stone-400" />
                    <span>O elige un perfume con stock del catálogo:</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                    {products.slice(0, 5).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectQuickProduct(p.barcode)}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-[11px] font-medium rounded-xl transition-all text-left"
                      >
                        <span className="font-bold">{p.brand}</span> - {p.name.slice(0, 18)}...{' '}
                        <strong className="text-emerald-700">({p.stock} uds)</strong>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Ficha del Producto Seleccionado */}
            {selectedProduct ? (
              <div className="p-4 bg-rose-50/50 border border-rose-200/80 rounded-2xl space-y-3 shadow-2xs">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-rose-100 flex items-center justify-center text-maribel-700 shrink-0 shadow-2xs">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-maribel-800 block">
                        {selectedProduct.brand}
                      </span>
                      <h4 className="text-xs font-bold text-stone-900 mt-0.5">
                        {selectedProduct.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                        {selectedProduct.size} • SKU: {selectedProduct.barcode}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      PRECIO UNITARIO
                    </span>
                    <p className="text-sm font-bold text-stone-900 font-serif">
                      {formatCurrency(selectedProduct.price)}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-rose-100 flex items-center justify-between text-xs">
                  <span className="text-stone-600 font-medium">Saldo en estantería:</span>
                  <span
                    className={`font-semibold px-2.5 py-0.5 rounded-full text-[11px] ${
                      selectedProduct.stock > 3
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {selectedProduct.stock} unidades disponibles
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-stone-50 border border-dashed border-stone-200 rounded-2xl text-center text-xs text-stone-400">
                Escanea o selecciona un perfume para cargar la venta.
              </div>
            )}

            {/* Cantidad a Vender */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-800">
                  {t('sales.quantity')}
                </label>
                {selectedProduct && (
                  <span className="text-[11px] text-stone-400">
                    Máx: {selectedProduct.stock} uds
                  </span>
                )}
              </div>

              <div className="flex items-center rounded-xl border border-stone-200 bg-stone-50 overflow-hidden focus-within:ring-2 focus-within:ring-maribel-600/20 focus-within:border-maribel-600 focus-within:bg-white transition-all w-full max-w-xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min={1}
                  max={selectedProduct ? selectedProduct.stock : 99}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full text-center py-2 text-sm font-bold text-stone-900 bg-transparent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) =>
                      selectedProduct ? Math.min(selectedProduct.stock, q + 1) : q + 1
                    )
                  }
                  className="px-4 py-2.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Desglose de Cliente Personalizado y Elegante (Nombre + Teléfono) */}
            <div>
              <CustomerSelect
                selectedCustomer={selectedCustomer}
                onSelectCustomer={(c) => setSelectedCustomer(c)}
                customers={customers}
                label="Cliente / Destinatario"
              />
            </div>
          </form>

          {/* Footer Sticky del Drawer */}
          <div className="p-6 border-t border-stone-200/80 bg-stone-50/60 shrink-0 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 block">Total a cobrar:</span>
                <span className="text-[11px] text-stone-400">
                  {quantity} {quantity === 1 ? 'unidad' : 'unidades'} seleccionada(s)
                </span>
              </div>
              <p className="text-2xl font-bold font-serif text-maribel-900">
                {formatCurrency(subtotal)}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={closeCreateModal}
                className="w-1/3 py-2.5 rounded-xl text-xs font-semibold"
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleSaveSale}
                disabled={!selectedProduct || selectedProduct.stock < quantity}
                className="w-2/3 py-2.5 rounded-xl text-xs font-bold"
              >
                Completar Venta
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
