import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useStockEntryStore } from '@/store/useStockEntryStore';
import { toast } from '@/store/useToastStore';
import { formatCurrency, formatGuarani, parseGuarani } from '@/utils/formatters';
import { AppInput, DatePickerInput } from '@/components/ui';
import { BarcodeScannerModal } from '@/componentes';
import type { Html5QrcodeResult } from 'html5-qrcode';
import { RoutesView } from '@/navigation/routes';
import { useTranslation } from '@/locale';
import {
  ArrowLeft,
  Barcode,
  Camera,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Package,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Tag,
  Droplets,
} from 'lucide-react';

export const StockEntryScreen: React.FC = () => {
  const { t } = useTranslation(['inventory', 'translation']);
  const navigate = useNavigate();
  const { getByBarcode, recordIncomingStock, addProduct } = useInventoryStore();
  const { recordStockEntry } = useStockEntryStore();

  // Estados de los campos (sin preselección automática)
  const [barcodeInput, setBarcodeInput] = useState('');
  const [brandInput, setBrandInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');

  const [quantity, setQuantity] = useState<number>(12);
  const [costPrice, setCostPrice] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [dateInput, setDateInput] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Manejar el resultado del escáner por cámara
  const handleBarcodeScanned = (decodedText: string, decodedResult: Html5QrcodeResult) => {
    console.log('[StockEntryScreen] Código de barra recibido:', decodedText);
    console.log('[StockEntryScreen] Resultado completo:', decodedResult);
    handleBarcodeChange(decodedText);
    toast.success('Código detectado', `Lectura: ${decodedText}`);
  };

  // Inicializar solo fecha y lote (sin preseleccionar ningún producto)
  useEffect(() => {
    setBatchNumber(`LOT-${new Date().getFullYear()}-FRAG-B${Math.floor(Math.random() * 90 + 10)}`);
    const today = new Date();
    setDateInput(
      `${String(today.getDate()).padStart(2, '0')}/${String(
        today.getMonth() + 1
      ).padStart(2, '0')}/${today.getFullYear()}`
    );
  }, []);

  // Verificar si el código ingresado coincide con algún producto existente en el catálogo
  const existingProduct = barcodeInput.trim() ? getByBarcode(barcodeInput.trim()) : undefined;

  // Manejar cambio en el código de barras y autocompletar si existe
  const handleBarcodeChange = (val: string) => {
    setBarcodeInput(val);
    setErrorMessage('');
    const clean = val.trim();
    if (!clean) return;

    const matched = getByBarcode(clean);
    if (matched) {
      setBrandInput(matched.brand);
      setNameInput(matched.name);
      setSizeInput(matched.size);
      setCostPrice(matched.costPrice || 0);
      setSellingPrice(matched.price || 0);
    }
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

  const existingStock = existingProduct ? existingProduct.stock : 0;
  const projectedStock = existingStock + quantity;

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!barcodeInput.trim()) {
      setErrorMessage(t('entry.errors.barcodeRequired'));
      toast.error('Código requerido', t('entry.errors.barcodeRequired'));
      return;
    }

    if (!brandInput.trim()) {
      setErrorMessage(t('entry.errors.brandRequired'));
      toast.error('Marca requerida', t('entry.errors.brandRequired'));
      return;
    }

    if (!nameInput.trim()) {
      setErrorMessage(t('entry.errors.descRequired'));
      toast.error('Descripción requerida', t('entry.errors.descRequired'));
      return;
    }

    if (!sizeInput.trim()) {
      setErrorMessage(t('entry.errors.sizeRequired'));
      toast.error('Medidas requeridas', t('entry.errors.sizeRequired'));
      return;
    }

    if (quantity <= 0) {
      setErrorMessage(t('entry.errors.quantityPositive'));
      toast.error('Cantidad inválida', t('entry.errors.quantityPositive'));
      return;
    }

    if (costPrice <= 0) {
      setErrorMessage(t('entry.errors.costPositive'));
      toast.error('Precio requerido', t('entry.errors.costPositive'));
      return;
    }

    if (sellingPrice <= 0) {
      setErrorMessage(t('entry.errors.salePositive'));
      toast.error('Precio requerido', t('entry.errors.salePositive'));
      return;
    }

    if (sellingPrice < costPrice) {
      setErrorMessage(t('entry.errors.negativeMarginWarning'));
      toast.warning('Margen negativo', t('entry.errors.negativeMarginWarning'));
    }

    const cleanBarcode = barcodeInput.trim();
    const cleanBrand = brandInput.trim();
    const cleanName = nameInput.trim();
    const cleanSize = sizeInput.trim();

    // 1. Registrar movimiento en el store de historial
    recordStockEntry({
      barcode: cleanBarcode,
      quantity,
      unitCost: costPrice,
      date: dateInput,
    });

    // 2. Si el producto ya existe, actualizamos stock y datos
    if (existingProduct) {
      recordIncomingStock(
        cleanBarcode,
        quantity,
        costPrice,
        sellingPrice,
        dateInput,
        cleanBrand,
        cleanName,
        cleanSize
      );
    } else {
      // Si es un producto nuevo, lo agregamos al inventario
      addProduct({
        barcode: cleanBarcode,
        brand: cleanBrand,
        name: cleanName,
        size: cleanSize,
        costPrice,
        price: sellingPrice,
        totalIn: quantity,
        receptionDate: dateInput,
      });
    }

    const successMsg = t('entry.entrySuccess', { count: quantity, brand: cleanBrand });
    setSuccessMessage(successMsg);
    toast.success('Ingreso registrado', successMsg);

    setTimeout(() => {
      navigate(RoutesView.PRODUCTS);
    }, 700);
  };

  const isFormValid =
    barcodeInput.trim().length > 0 &&
    brandInput.trim().length > 0 &&
    nameInput.trim().length > 0 &&
    sizeInput.trim().length > 0 &&
    quantity > 0 &&
    costPrice > 0 &&
    sellingPrice > 0;

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
          <span>{t('detail.backButton')}</span>
        </button>

        <span className="px-3 py-1 bg-rose-50 border border-rose-100 text-maribel-700 text-xs font-semibold rounded-full">
          {t('entry.navBadge')}
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
              {t('entry.title')}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              {t('entry.subtitle')}
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
          {/* Tarjeta: Datos del Producto (Inputs Separados) */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-stone-900 text-sm">
                {t('entry.productData')}
              </h3>

              <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200/60 rounded-full text-[11px] font-medium text-emerald-700">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span>{t('entry.usbScannerActive')}</span>
              </span>
            </div>

            {/* Código de barras / SKU */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-800 flex items-center space-x-1">
                  <span>{t('entry.barcodeLabel')}</span>
                  <span className="text-rose-500">*</span>
                </label>
                {existingProduct && (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span>{t('entry.inCatalogTag', { count: existingProduct.stock })}</span>
                  </span>
                )}
              </div>

              <AppInput
                value={barcodeInput}
                onChange={(e) => handleBarcodeChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
                autoFocus
                placeholder={t('entry.barcodePlaceholder')}
                leftIcon={<Barcode className="w-5 h-5" />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setIsScannerOpen(true)}
                    className="px-2.5 py-1 text-[11px] font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 flex items-center space-x-1.5 shadow-2xs active:scale-95 transition-all"
                  >
                    <Camera className="w-3.5 h-3.5 text-maribel-700" />
                    <span>{t('entry.cameraButton')}</span>
                  </button>
                }
                className="font-mono font-medium"
              />
            </div>

            {/* Fila: Marca de producto y Medidas del producto */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-800 flex items-center space-x-1 mb-1.5">
                  <span>{t('entry.brandLabel')}</span>
                  <span className="text-rose-500">*</span>
                </label>
                <AppInput
                  value={brandInput}
                  onChange={(e) => setBrandInput(e.target.value)}
                  placeholder="ej: COOL GIRL"
                  leftIcon={<Tag className="w-4 h-4" />}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 flex items-center space-x-1 mb-1.5">
                  <span>{t('entry.sizeLabel')}</span>
                  <span className="text-rose-500">*</span>
                </label>
                <AppInput
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  placeholder="ej: 85 ml / 2.9 fl. oz"
                  leftIcon={<Droplets className="w-4 h-4" />}
                />
              </div>
            </div>

            {/* Input 3: Descripción del producto */}
            <div>
              <label className="text-xs font-semibold text-stone-800 flex items-center space-x-1 mb-1.5">
                <span>{t('entry.descriptionLabel')}</span>
                <span className="text-rose-500">*</span>
              </label>
              <AppInput
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="ej: IT'S SO GOOD TO BE BAD - EAU DE PARFUM"
                leftIcon={<Package className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Tarjeta: Cantidades y Precios de Compra / Venta / Ganancia */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
            <h3 className="font-serif font-bold text-stone-900 text-sm pb-2 border-b border-stone-100">
              {t('entry.quantitiesPricesTitle')}
            </h3>

            {/* Cantidad recibida */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-800">
                  {t('entry.qtyToEnter')}
                </label>
                <span className="text-[11px] text-stone-400">{t('entry.standardPack')}</span>
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
                    {t('entry.boxTag')}
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
                    {t('entry.masterTag')}
                  </button>
                </div>
              </div>
            </div>

            {/* Fila Financiera: Precio Compra vs Precio Venta vs Ganancia */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Precio Compra */}
              <div>
                <label className="text-xs font-semibold text-stone-800 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center space-x-1">
                    <span>{t('entry.purchasePriceLabel')}</span>
                    <span className="text-rose-500">*</span>
                  </span>
                  <DollarSign className="w-3.5 h-3.5 text-stone-400" />
                </label>
                <AppInput
                  prefixText="Gs."
                  value={costPrice > 0 ? formatGuarani(costPrice) : ''}
                  onChange={(e) => setCostPrice(parseGuarani(e.target.value))}
                  placeholder="0"
                  className="font-semibold text-sm"
                />
                <p className="text-[11px] text-stone-400 mt-1">{t('entry.purchasePriceDesc')}</p>
              </div>

              {/* Precio Venta */}
              <div>
                <label className="text-xs font-semibold text-stone-800 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center space-x-1">
                    <span>{t('entry.sellingPriceLabel')}</span>
                    <span className="text-rose-500">*</span>
                  </span>
                  <ShoppingCart className="w-3.5 h-3.5 text-maribel-700" />
                </label>
                <AppInput
                  prefixText="Gs."
                  value={sellingPrice > 0 ? formatGuarani(sellingPrice) : ''}
                  onChange={(e) => setSellingPrice(parseGuarani(e.target.value))}
                  placeholder="0"
                  className="font-bold text-sm"
                />
                <p className="text-[11px] text-stone-400 mt-1">{t('entry.sellingPriceDesc')}</p>
              </div>

              {/* Ganancia Unitaria Calculada en tiempo real */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900">
                      {t('entry.profitPerUnit')}
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
                    ? t('entry.gainPerBottle', { profit: formatCurrency(unitProfit) })
                    : t('entry.enterPurchaseSale')}
                </p>
              </div>
            </div>

            {/* Fecha de Recepción y Lote */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <DatePickerInput
                  label={t('entry.receptionDate')}
                  value={dateInput}
                  onChange={(d) => setDateInput(d)}
                />
              </div>

              <div>
                <AppInput
                  label={t('entry.batchNumber')}
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
                {t('entry.batchSummary')}
              </h3>
            </div>

            {/* Proyección de existencias */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                {t('entry.shelfProjection')}
              </span>
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span>{t('entry.currentStock')}</span>
                <span className="font-medium">{t('table.unitsTag', { count: existingStock })}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold">
                <span>{t('entry.newIncoming')}</span>
                <span>{t('table.plusUnitsTag', { count: quantity })}</span>
              </div>
              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
                <span className="font-bold text-stone-800">{t('entry.totalAvailable')}</span>
                <span className="font-bold text-base text-stone-900 font-serif">
                  {t('table.unitsTag', { count: projectedStock })}
                </span>
              </div>
            </div>

            {/* Resumen Monetario del Lote */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
                <span className="text-stone-500 font-medium">{t('entry.totalBatchInvestment')}</span>
                <strong className="text-stone-900 text-sm font-mono">
                  {formatCurrency(totalCost)}
                </strong>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
                <span className="text-stone-500 font-medium">{t('entry.projectedGrossSales')}</span>
                <strong className="text-stone-900 text-sm font-mono">
                  {formatCurrency(totalSales)}
                </strong>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                  {t('entry.estimatedTotalProfit')}
                </span>
                <p className="text-2xl font-bold font-serif text-emerald-800">
                  +{formatCurrency(totalProfit)}
                </p>
                <p className="text-[11px] text-emerald-700">
                  {t('entry.whenSellingAll', { count: quantity })}
                </p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={!isFormValid}
                className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-maribel-800 hover:bg-maribel-900 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>{t('entry.confirmEntry', { count: quantity })}</span>
              </button>

              {!isFormValid && (
                <p className="text-[11px] text-center text-stone-400 font-medium">
                  {t('entry.formRequirementNote')}
                </p>
              )}

              <button
                type="button"
                onClick={() => navigate(RoutesView.PRODUCTS)}
                className="w-full py-2.5 text-xs font-semibold text-stone-500 hover:text-stone-800 hover:bg-stone-50 rounded-xl transition-colors text-center"
              >
                {t('entry.cancelAndReturn')}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Modal de escaneo de código de barras por cámara */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleBarcodeScanned}
      />
    </div>
  );
};
