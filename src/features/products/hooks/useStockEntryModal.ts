import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useStockEntryStore } from '@/store/useStockEntryStore';
import { toast } from '@/store/useToastStore';
import { useTranslation } from '@/locale';
import { generateDefaultBatchNumber, getTodayFormattedDate } from '../utils/stockEntry.utils';

export interface StockEntryModalFormValues {
  barcode: string;
  quantity: number;
  unitCost: number;
  date: string;
  batchNumber: string;
}

export const useStockEntryModal = () => {
  const { t } = useTranslation(['inventory', 'translation']);
  const { isEntryModalOpen, closeEntryModal, recordStockEntry } = useStockEntryStore();
  const { products, getByBarcode } = useInventoryStore();

  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const { control, handleSubmit, setValue, watch, reset, formState } =
    useForm<StockEntryModalFormValues>({
      defaultValues: {
        barcode: '',
        quantity: 12,
        unitCost: 0,
        date: getTodayFormattedDate(),
        batchNumber: generateDefaultBatchNumber(),
      },
      mode: 'onTouched',
    });

  const watchedBarcode = watch('barcode');
  const watchedQuantity = watch('quantity');
  const watchedUnitCost = watch('unitCost');
  const watchedBatchNumber = watch('batchNumber');

  const selectedProduct =
    (watchedBarcode ? getByBarcode(watchedBarcode.trim()) : undefined) || products[0];

  useEffect(() => {
    if (isEntryModalOpen && products.length > 0) {
      const first = products[0];
      const initialCost = first.costPrice || Math.round(first.price * 0.65);
      reset({
        barcode: first.barcode,
        quantity: 12,
        unitCost: initialCost,
        date: getTodayFormattedDate(),
        batchNumber: generateDefaultBatchNumber(),
      });
    }
  }, [isEntryModalOpen, products, reset]);

  const handleSelectQuickProduct = (barcode: string) => {
    setValue('barcode', barcode, { shouldValidate: true, shouldDirty: true });
    const prod = getByBarcode(barcode);
    if (prod) {
      const cost = prod.costPrice || Math.round(prod.price * 0.65);
      setValue('unitCost', cost, { shouldValidate: true, shouldDirty: true });
    }
  };

  const handleQuickAddQty = (qty: number) => {
    setValue('quantity', qty, { shouldValidate: true, shouldDirty: true });
  };

  const handleIncrementQty = () => {
    setValue('quantity', (watchedQuantity || 0) + 1, { shouldValidate: true, shouldDirty: true });
  };

  const handleDecrementQty = () => {
    setValue('quantity', Math.max(1, (watchedQuantity || 0) - 1), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleBarcodeScanned = (decodedText: string) => {
    handleSelectQuickProduct(decodedText);
    toast.success('Código detectado', `Lectura: ${decodedText}`);
  };

  const onSubmit = (data: StockEntryModalFormValues) => {
    if (!selectedProduct) {
      toast.error('Error', t('entry.errors.barcodeRequired'));
      return;
    }

    const success = recordStockEntry({
      barcode: selectedProduct.barcode,
      quantity: data.quantity,
      unitCost: data.unitCost,
      date: data.date,
    });

    if (!success) {
      toast.error('Error', 'Ocurrió un error al procesar el ingreso de mercadería.');
      return;
    }

    toast.success(
      'Ingreso registrado',
      t('entry.entrySuccess', { count: data.quantity, brand: selectedProduct.brand })
    );

    setTimeout(() => {
      closeEntryModal();
    }, 600);
  };

  const totalCost = (watchedQuantity || 0) * (watchedUnitCost || 0);
  const existingStock = selectedProduct ? selectedProduct.stock : 0;
  const projectedStock = existingStock + (watchedQuantity || 0);

  const estimatedMargin =
    selectedProduct && selectedProduct.price > 0 && (watchedUnitCost || 0) > 0
      ? Math.max(
          0,
          Math.round(((selectedProduct.price - (watchedUnitCost || 0)) / selectedProduct.price) * 100)
        )
      : 0;

  return {
    isOpen: isEntryModalOpen,
    control,
    handleSubmit,
    setValue,
    isSubmitting: formState.isSubmitting,
    selectedProduct,
    catalogProducts: products.slice(0, 3),
    metrics: {
      watchedQuantity,
      watchedUnitCost,
      watchedBatchNumber,
      totalCost,
      existingStock,
      projectedStock,
      estimatedMargin,
    },
    scanner: {
      isOpen: isScannerOpen,
      openScanner: () => setIsScannerOpen(true),
      closeScanner: () => setIsScannerOpen(false),
      handleScanned: handleBarcodeScanned,
    },
    actions: {
      onSubmit,
      onClose: closeEntryModal,
      handleSelectQuickProduct,
      handleQuickAddQty,
      handleIncrementQty,
      handleDecrementQty,
    },
  };
};
