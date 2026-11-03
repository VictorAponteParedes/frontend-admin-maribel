import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useSalesStore } from '@/store/useSalesStore';
import { useOrdersStore } from '@/store/useOrdersStore';
import { useCustomerStore } from '@/store/useCustomerStore';
import { toast } from '@/store/useToastStore';
import { Sale } from '@/features/sales/types/sale.types';
import { Product } from '@/features/products/types/product.types';
import { Customer } from '@/features/customers/types/customer.types';
import { formatCurrency } from '@/utils/formatters';
import { useTranslation } from '@/locale';
import { AppInput, Button } from '@/components/ui';
import { CustomerSelect } from './CustomerSelect';
import {
  X,
  Barcode,
  ShoppingCart,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
  Search,
  Plus,
  Minus,
  Trash2,
  Package,
  PackageCheck,
} from 'lucide-react';

interface CartItem {
  barcode: string;
  brand: string;
  name: string;
  size: string;
  unitPrice: number;
  stock: number;
  quantity: number;
  subtotal: number;
}

export const SaleFormModal: React.FC = () => {
  const { t } = useTranslation(['sales', 'translation']);
  const {
    isCreateModalOpen,
    closeCreateModal,
    addSale,
    pendingOrderSale,
    clearPendingOrderSale,
  } = useSalesStore();
  const { products, getByBarcode, deductStock } = useInventoryStore();
  const { customers } = useCustomerStore();

  const [searchInput, setSearchInput] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSearchingLive, setIsSearchingLive] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Reiniciar estado o precargar desde un pedido web
  useEffect(() => {
    if (isCreateModalOpen) {
      setSearchInput('');
      setErrorMessage('');
      setSuccessMessage('');
      setIsSearchingLive(false);

      if (pendingOrderSale) {
        // Precargar productos desde la orden vinculada
        const preloadedCart: CartItem[] = pendingOrderSale.items.map((item) => {
          const invProduct = getByBarcode(item.barcode);
          return {
            barcode: item.barcode,
            brand: item.brand,
            name: item.name,
            size: item.size || invProduct?.size || '',
            unitPrice: item.unitPrice,
            stock: invProduct ? invProduct.stock : 99,
            quantity: item.quantity,
            subtotal: item.subtotal,
          };
        });
        setCartItems(preloadedCart);

        // Precargar cliente del pedido
        const matchingCustomer = customers.find(
          (c) =>
            (pendingOrderSale.customerPhone && c.phone === pendingOrderSale.customerPhone) ||
            c.name.toLowerCase() === pendingOrderSale.customerName.toLowerCase()
        );

        if (matchingCustomer) {
          setSelectedCustomer(matchingCustomer);
        } else {
          setSelectedCustomer({
            id: `temp-${Date.now()}`,
            code: 0,
            registrationDate: new Date().toLocaleDateString('es-PY'),
            name: pendingOrderSale.customerName,
            phone: pendingOrderSale.customerPhone || 'Sin teléfono',
            address: pendingOrderSale.customerAddress || 'A Domicilio',
          });
        }
      } else {
        setCartItems([]);
        const casual = customers.find((c) => c.name === 'Cliente casual') || null;
        setSelectedCustomer(casual);
      }

      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isCreateModalOpen, pendingOrderSale, customers]);

  if (!isCreateModalOpen) return null;

  // Filtrado en vivo de productos por código, nombre o marca
  const trimmedSearch = searchInput.trim().toLowerCase();
  const liveSearchResults: Product[] =
    trimmedSearch.length >= 2
      ? products
          .filter(
            (p) =>
              p.barcode.toLowerCase().includes(trimmedSearch) ||
              p.name.toLowerCase().includes(trimmedSearch) ||
              p.brand.toLowerCase().includes(trimmedSearch)
          )
          .slice(0, 6)
      : [];

  // Agregar producto al carrito
  const handleAddToCart = (product: Product, quantityToAdd: number = 1) => {
    setErrorMessage('');

    if (product.stock <= 0) {
      setErrorMessage(t('form.errors.outOfStock'));
      return;
    }

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.barcode === product.barcode);

      if (existingIndex > -1) {
        const currentItem = prev[existingIndex];
        const newQuantity = currentItem.quantity + quantityToAdd;

        if (newQuantity > product.stock) {
          setErrorMessage(
            t('form.errors.stockExceeded', { count: product.stock })
          );
          return prev;
        }

        const updated = [...prev];
        updated[existingIndex] = {
          ...currentItem,
          quantity: newQuantity,
          subtotal: currentItem.unitPrice * newQuantity,
        };
        return updated;
      } else {
        if (quantityToAdd > product.stock) {
          setErrorMessage(
            t('form.errors.stockExceeded', { count: product.stock })
          );
          return prev;
        }

        const newItem: CartItem = {
          barcode: product.barcode,
          brand: product.brand,
          name: product.name,
          size: product.size,
          unitPrice: product.price,
          stock: product.stock,
          quantity: quantityToAdd,
          subtotal: product.price * quantityToAdd,
        };
        return [...prev, newItem];
      }
    });

    // Limpiar input y volver a hacer foco para el siguiente escaneo
    setSearchInput('');
    setIsSearchingLive(false);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);
  };

  // Escaneo directo con Enter o botón "Agregar"
  const handleScanSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const query = searchInput.trim();
    if (!query) return;

    // Buscar coincidencia exacta por barcode o similar
    const matchedProduct =
      getByBarcode(query) ||
      products.find((p) => p.barcode.toLowerCase() === query.toLowerCase()) ||
      products.find(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase())
      );

    if (matchedProduct) {
      handleAddToCart(matchedProduct, 1);
    } else {
      setErrorMessage(t('form.errors.productNotFound'));
    }
  };

  // Modificar cantidad de un producto en el carrito
  const handleUpdateQuantity = (barcode: string, nextQty: number) => {
    setErrorMessage('');

    if (nextQty <= 0) {
      handleRemoveItem(barcode);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.barcode === barcode) {
          const product = getByBarcode(barcode);
          const maxStock = product ? product.stock : item.stock;

          if (nextQty > maxStock) {
            setErrorMessage(
              t('form.errors.stockExceeded', { count: maxStock })
            );
            return item;
          }

          return {
            ...item,
            quantity: nextQty,
            subtotal: item.unitPrice * nextQty,
          };
        }
        return item;
      })
    );
  };

  // Quitar un producto del carrito
  const handleRemoveItem = (barcode: string) => {
    setCartItems((prev) => prev.filter((item) => item.barcode !== barcode));
  };

  // Vaciar carrito
  const handleClearCart = () => {
    setCartItems([]);
    setErrorMessage('');
  };

  // Totales acumulados
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + item.subtotal, 0);

  // Completar y registrar la venta multi-producto
  const handleSaveSale = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (cartItems.length === 0) {
      setErrorMessage(t('form.errors.emptyCart'));
      return;
    }

    // Validar stock de todos los artículos en el carrito
    for (const item of cartItems) {
      const product = getByBarcode(item.barcode);
      if (!product || product.stock < item.quantity) {
        setErrorMessage(
          t('form.errors.insufficientStock', {
            product: item.name,
            count: product ? product.stock : 0,
          })
        );
        return;
      }
    }

    // Descontar inventario de cada artículo vendido
    for (const item of cartItems) {
      deductStock(item.barcode, item.quantity);
    }

    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(
      today.getMonth() + 1
    ).padStart(2, '0')}/${today.getFullYear()}`;
    const formattedTime = `${String(today.getHours()).padStart(2, '0')}:${String(
      today.getMinutes()
    ).padStart(2, '0')} hs`;

    const newSaleNumber = `V-${today.getFullYear()}-${String(Date.now()).slice(-4)}`;

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      saleNumber: newSaleNumber,
      date: formattedDate,
      time: formattedTime,
      customerCode: selectedCustomer?.code ? String(selectedCustomer.code) : undefined,
      customerName: selectedCustomer ? selectedCustomer.name : t('customerSelect.casualCustomer'),
      customerPhone: selectedCustomer?.phone,
      customerAddress: selectedCustomer?.address,
      status: 'CONFIRMED',
      totalQuantity,
      total: totalAmount,
      items: cartItems.map((item) => ({
        barcode: item.barcode,
        brand: item.brand,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      })),
    };

    addSale(newSale);
    setSuccessMessage(t('saleSaved'));

    if (pendingOrderSale) {
      useOrdersStore.getState().updateOrderStatus(pendingOrderSale.orderId, 'DELIVERED');
      toast.success(
        '¡Venta completada!',
        `Pedido #${pendingOrderSale.orderNumber} facturado y actualizado a "Entregado"`
      );
      clearPendingOrderSale();
    } else {
      toast.success(
        '¡Venta completada!',
        `${newSale.saleNumber} • ${totalQuantity} unidades registradas`
      );
    }

    setTimeout(() => {
      closeCreateModal();
    }, 600);
  };

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
          className="relative z-10 w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-stone-200"
        >
          {/* Cabecera del Drawer */}
          <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 bg-rose-100/80 border border-rose-200/60 text-maribel-800 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs relative">
                <ShoppingCart className="w-5 h-5 stroke-[2]" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-maribel-700 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white shadow-xs">
                    {cartItems.length}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-lg tracking-tight">
                  {t('newSale')}
                </h3>
                <p className="text-xs text-stone-500">
                  {t('form.modalSubtitle')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeCreateModal}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cuerpo Scrolleable del Formulario */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
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

            {/* Banner Informativo de Pedido Web Vinculado */}
            {pendingOrderSale && (
              <div className="p-3.5 bg-gradient-to-r from-rose-50 via-maribel-50/60 to-amber-50/40 border border-maribel-200/90 rounded-2xl flex items-start gap-3 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-maribel-700 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <PackageCheck className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="text-xs font-bold text-maribel-900 truncate">
                      Venta vinculada al Pedido #{pendingOrderSale.orderNumber}
                    </h5>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-maribel-100 text-maribel-800 border border-maribel-200 shrink-0">
                      Pedido Web
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Cliente: <strong>{pendingOrderSale.customerName}</strong>
                    {pendingOrderSale.customerPhone ? ` • WhatsApp: ${pendingOrderSale.customerPhone}` : ''}
                  </p>
                  <p className="text-[10px] text-maribel-700 font-medium mt-1">
                    ✓ Al completar la venta, se descontará el stock y el pedido se marcará como <strong>"Entregado"</strong> automáticamente.
                  </p>
                </div>
              </div>
            )}

            {/* SECCIÓN 1: BUSCADOR Y ESCÁNER PARA AGREGAR AL CARRITO */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-800 flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <span>{t('form.searchOrScanLabel')}</span>
                  <span className="text-rose-500">*</span>
                </span>
                <span className="text-[11px] font-normal text-stone-400">
                  Presiona Enter para agregar
                </span>
              </label>

              <form onSubmit={handleScanSubmit} className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <AppInput
                    ref={searchInputRef}
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                      setIsSearchingLive(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleScanSubmit();
                      }
                    }}
                    placeholder={t('form.barcodePlaceholder')}
                    leftIcon={<Barcode className="w-4 h-4 text-stone-400" />}
                    className="font-mono text-xs pr-8"
                    autoFocus
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInput('');
                        setIsSearchingLive(false);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  leftIcon={<Plus className="w-4 h-4 shrink-0" />}
                  className="shrink-0 whitespace-nowrap h-[41px] px-4 rounded-xl text-xs font-semibold inline-flex items-center justify-center cursor-pointer"
                >
                  {t('form.addButton')}
                </Button>
              </form>

              {/* Resultados desplegables en vivo si el usuario escribe texto */}
              {isSearchingLive && liveSearchResults.length > 0 && (
                <div className="p-1.5 bg-white border border-stone-200 rounded-2xl shadow-lg space-y-1 max-h-48 overflow-y-auto z-20">
                  {liveSearchResults.map((prod) => (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => handleAddToCart(prod, 1)}
                      className="w-full p-2 hover:bg-rose-50/70 rounded-xl flex items-center justify-between text-left text-xs transition-colors group cursor-pointer"
                    >
                      <div className="truncate pr-2">
                        <span className="text-[10px] font-bold text-maribel-700 uppercase block">
                          {prod.brand}
                        </span>
                        <p className="font-semibold text-stone-800 truncate">
                          {prod.name}
                        </p>
                        <span className="text-[10px] text-stone-400 font-mono">
                          SKU: {prod.barcode} • {prod.size}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-serif font-bold text-stone-900 block">
                          {formatCurrency(prod.price)}
                        </span>
                        <span
                          className={`text-[10px] font-semibold ${
                            prod.stock > 0 ? 'text-emerald-600' : 'text-rose-500'
                          }`}
                        >
                          {prod.stock > 0
                            ? `${prod.stock} en stock`
                            : t('form.cart.noStock')}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Chips rápidos de catálogo con stock */}
              <div className="pt-1">
                <p className="text-[11px] text-stone-400 mb-1.5 flex items-center space-x-1">
                  <Search className="w-3 h-3 text-stone-400" />
                  <span>{t('form.catalogChoice')}</span>
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                  {products.slice(0, 6).map((p) => {
                    const inCart = cartItems.find((ci) => ci.barcode === p.barcode);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleAddToCart(p, 1)}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded-xl transition-all text-left flex items-center gap-1.5 cursor-pointer ${
                          inCart
                            ? 'bg-rose-100 text-maribel-900 border border-rose-300 font-semibold'
                            : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
                        }`}
                      >
                        <span className="font-bold">{p.brand}</span>
                        <span className="truncate max-w-[120px]">{p.name}</span>
                        <strong className="text-emerald-700 font-mono text-[10px]">
                          ({p.stock})
                        </strong>
                        {inCart && (
                          <span className="w-4 h-4 rounded-full bg-maribel-700 text-white text-[9px] flex items-center justify-center font-bold">
                            {inCart.quantity}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: EL CARRITO DE PRODUCTOS A VENDER */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-4 h-4 text-maribel-700" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                    {t('form.cart.title')}
                  </h4>
                  {cartItems.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-maribel-50 text-maribel-800 text-[10px] font-bold border border-rose-200">
                      {t('form.cart.itemsBadge', { count: cartItems.length })} • {totalQuantity} uds
                    </span>
                  )}
                </div>

                {cartItems.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearCart}
                    className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                  >
                    {t('form.cart.clearCart')}
                  </button>
                )}
              </div>

              {/* Lista de productos en el carrito */}
              {cartItems.length > 0 ? (
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.barcode}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-3.5 bg-rose-50/40 border border-rose-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      {/* Información del Perfume */}
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-white border border-rose-100 flex items-center justify-center text-maribel-700 shrink-0 shadow-2xs mt-0.5">
                          <Package className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-maribel-800 block truncate">
                            {item.brand}
                          </span>
                          <h5 className="text-xs font-bold text-stone-900 truncate">
                            {item.name}
                          </h5>
                          <div className="flex items-center gap-2 text-[10px] text-stone-500 font-mono mt-0.5">
                            <span>{item.size}</span>
                            <span>•</span>
                            <span>{formatCurrency(item.unitPrice)} c/u</span>
                          </div>
                        </div>
                      </div>

                      {/* Controles de Cantidad, Subtotal y Eliminar */}
                      <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-rose-100">
                        {/* Selector de Cantidad */}
                        <div className="flex items-center rounded-xl border border-stone-200 bg-white overflow-hidden shadow-2xs">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.barcode, item.quantity - 1)}
                            className="px-2.5 py-1 text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                            title="Disminuir"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-stone-900 select-none">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.barcode, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className={`px-2.5 py-1 transition-colors ${
                              item.quantity >= item.stock
                                ? 'text-stone-300 cursor-not-allowed'
                                : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100 cursor-pointer'
                            }`}
                            title={
                              item.quantity >= item.stock
                                ? `Stock máximo alcanzado (${item.stock})`
                                : 'Aumentar'
                            }
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right min-w-[85px]">
                          <span className="text-xs font-bold font-serif text-maribel-900 block">
                            {formatCurrency(item.subtotal)}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            Stock: {item.stock}
                          </span>
                        </div>

                        {/* Botón Eliminar */}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.barcode)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-100/70 rounded-lg transition-colors cursor-pointer"
                          title="Quitar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* Estado Vacío del Carrito */
                <div className="p-6 bg-stone-50 border border-dashed border-stone-200 rounded-2xl text-center space-y-1.5">
                  <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-2">
                    <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <p className="text-xs font-bold text-stone-700">
                    {t('form.cart.emptyTitle')}
                  </p>
                  <p className="text-[11px] text-stone-400 max-w-xs mx-auto leading-relaxed">
                    {t('form.cart.emptySubtitle')}
                  </p>
                </div>
              )}
            </div>

            {/* SECCIÓN 3: SELECCIÓN DE CLIENTE */}
            <div className="pt-2 border-t border-stone-100">
              <CustomerSelect
                selectedCustomer={selectedCustomer}
                onSelectCustomer={(c) => setSelectedCustomer(c)}
                customers={customers}
                label={t('form.customerLabel')}
              />
            </div>
          </div>

          {/* Footer Sticky del Drawer con Resumen de Cobro */}
          <div className="p-5 border-t border-stone-200/80 bg-stone-50/80 shrink-0 space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-stone-500 block">
                  {t('form.totalToCharge')}
                </span>
                <span className="text-[11px] text-stone-400">
                  {cartItems.length > 0
                    ? `${cartItems.length} producto(s) • ${totalQuantity} unidades`
                    : 'Sin productos en el carrito'}
                </span>
              </div>
              <p className="text-2xl font-bold font-serif text-maribel-900 tracking-tight">
                {formatCurrency(totalAmount)}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={closeCreateModal}
                className="w-1/3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleSaveSale}
                disabled={cartItems.length === 0}
                className="w-2/3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all disabled:opacity-50"
              >
                {t('form.completeSale')} {totalQuantity > 0 ? `(${totalQuantity})` : ''}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SaleFormModal;