import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useStockEntryStore } from '@/store/useStockEntryStore';
import { toast } from '@/store/useToastStore';
import { RoutesView } from '@/navigation/routes';
import { useTranslation } from '@/locale';
import {
  StockEntryFormValues,
  StockEntryCalculatedMetrics,
} from '../types/stockEntry.types';
import {
  generateDefaultBatchNumber,
  getTodayFormattedDate,
  calculateStockEntryMetrics,
} from '../utils/stockEntry.utils';

export const useStockEntryForm = () => {
  const { t } = useTranslation(['inventory', 'translation']);
  const navigate = useNavigate();
  const { getByBarcode, recordIncomingStock, addProduct } = useInventoryStore();
  const { recordStockEntry } = useStockEntryStore();

  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const form = useForm<StockEntryFormValues>({
    defaultValues: {
      barcode: '',
      brand: '',
      name: '',
      size: '',
      quantity: 12,
      costPrice: 0,
      sellingPrice: 0,
      receptionDate: getTodayFormattedDate(),
      batchNumber: generateDefaultBatchNumber(),
    },
    mode: 'onTouched',
  });

  const { watch, setValue, control, handleSubmit, formState } = form;

  const watchedBarcode = watch('barcode');
  const watchedQuantity = watch('quantity');
  const watchedCostPrice = watch('costPrice');
  const watchedSellingPrice = watch('sellingPrice');

  const cleanBarcode = (watchedBarcode || '').trim();
  const existingProduct = cleanBarcode ? getByBarcode(cleanBarcode) : undefined;

  const metrics: StockEntryCalculatedMetrics = calculateStockEntryMetrics(
    watchedQuantity,
    watchedCostPrice,
    watchedSellingPrice,
    existingProduct
  );

  const applyMatchedProduct = (barcode: string) => {
    const clean = barcode.trim();
    if (!clean) return;

    const matched = getByBarcode(clean);
    if (matched) {
      setValue('brand', matched.brand, { shouldValidate: true, shouldDirty: true });
      setValue('name', matched.name, { shouldValidate: true, shouldDirty: true });
      setValue('size', matched.size, { shouldValidate: true, shouldDirty: true });
      setValue('costPrice', matched.costPrice || 0, { shouldValidate: true, shouldDirty: true });
      setValue('sellingPrice', matched.price || 0, { shouldValidate: true, shouldDirty: true });
    }
  };

  const handleBarcodeChange = (newBarcode: string) => {
    setValue('barcode', newBarcode, { shouldValidate: true, shouldDirty: true });
    applyMatchedProduct(newBarcode);
  };

  const handleBarcodeScanned = (decodedText: string) => {
    handleBarcodeChange(decodedText);
    toast.success('Código detectado', `Lectura: ${decodedText}`);
  };

  const handleQuickAddQty = (qty: number) => {
    setValue('quantity', Math.max(1, qty), { shouldValidate: true, shouldDirty: true });
  };

  const handleIncrementQty = () => {
    setValue('quantity', Math.max(1, (watchedQuantity || 0) + 1), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleDecrementQty = () => {
    setValue('quantity', Math.max(1, (watchedQuantity || 0) - 1), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleReturn = () => {
    navigate(RoutesView.PRODUCTS);
  };

  const onSubmit = (data: StockEntryFormValues) => {
    const cleanBarcode = data.barcode.trim();
    const cleanBrand = data.brand.trim();
    const cleanName = data.name.trim();
    const cleanSize = data.size.trim();

    if (data.sellingPrice < data.costPrice) {
      toast.warning('Margen negativo', t('entry.errors.negativeMarginWarning'));
    }

    recordStockEntry({
      barcode: cleanBarcode,
      quantity: data.quantity,
      unitCost: data.costPrice,
      date: data.receptionDate,
    });

    if (existingProduct) {
      recordIncomingStock(
        cleanBarcode,
        data.quantity,
        data.costPrice,
        data.sellingPrice,
        data.receptionDate,
        cleanBrand,
        cleanName,
        cleanSize
      );
    } else {
      addProduct({
        barcode: cleanBarcode,
        brand: cleanBrand,
        name: cleanName,
        size: cleanSize,
        costPrice: data.costPrice,
        price: data.sellingPrice,
        totalIn: data.quantity,
        receptionDate: data.receptionDate,
      });
    }

    const successMsg = t('entry.entrySuccess', { count: data.quantity, brand: cleanBrand });
    toast.success('Ingreso registrado', successMsg);

    setTimeout(() => {
      navigate(RoutesView.PRODUCTS);
    }, 600);
  };

  const isFormValid =
    Boolean(watchedBarcode?.trim()) &&
    Boolean(watch('brand')?.trim()) &&
    Boolean(watch('name')?.trim()) &&
    Boolean(watch('size')?.trim()) &&
    Number(watchedQuantity) > 0 &&
    Number(watchedCostPrice) > 0 &&
    Number(watchedSellingPrice) > 0;

  return {
    control,
    handleSubmit,
    setValue,
    isSubmitting: formState.isSubmitting,
    isFormValid,
    metrics,
    watchedQuantity,
    watchedCostPrice,
    watchedSellingPrice,
    scanner: {
      isOpen: isScannerOpen,
      openScanner: () => setIsScannerOpen(true),
      closeScanner: () => setIsScannerOpen(false),
      handleScanned: handleBarcodeScanned,
    },
    actions: {
      onSubmit,
      handleBarcodeChange,
      handleQuickAddQty,
      handleIncrementQty,
      handleDecrementQty,
      handleReturn,
    },
  };
};
