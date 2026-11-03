import React from 'react';
import { Control, useController } from 'react-hook-form';
import { Barcode, Camera, Search } from 'lucide-react';
import { AppInput, Button } from '@/components/ui';
import { useTranslation } from '@/locale';
import { Product } from '../../types/product.types';
import { StockEntryModalFormValues } from '../../hooks/useStockEntryModal';

export interface StockEntryModalProductSelectorProps {
  control: Control<StockEntryModalFormValues>;
  selectedProduct?: Product;
  catalogProducts: Product[];
  onOpenScanner: () => void;
  onSelectQuickProduct: (barcode: string) => void;
}

export const StockEntryModalProductSelector: React.FC<StockEntryModalProductSelectorProps> = ({
  control,
  selectedProduct,
  catalogProducts,
  onOpenScanner,
  onSelectQuickProduct,
}) => {
  const { t } = useTranslation(['inventory', 'translation']);

  const {
    field: barcodeField,
    fieldState: { error: barcodeError },
  } = useController({
    name: 'barcode',
    control,
    rules: { required: t('entry.errors.barcodeRequired') },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-stone-800 flex items-center space-x-1">
          <span>{t('entry.barcodeLabel')}</span>
          <span className="text-rose-500">*</span>
        </label>

        <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200/60 rounded-full text-[11px] font-medium text-emerald-700">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span>{t('entry.usbScannerActive')}</span>
        </span>
      </div>

      <AppInput
        name={barcodeField.name}
        ref={barcodeField.ref}
        value={barcodeField.value || ''}
        onChange={(e) => {
          barcodeField.onChange(e);
          onSelectQuickProduct(e.target.value);
        }}
        onBlur={barcodeField.onBlur}
        placeholder="6972011068673"
        leftIcon={<Barcode className="w-5 h-5" />}
        error={barcodeError?.message}
        rightElement={
          <Button
            type="button"
            variant="outline"
            size="xs"
            leftIcon={<Camera className="w-3.5 h-3.5 text-maribel-700" />}
            onClick={onOpenScanner}
            title={t('entry.cameraButton')}
          >
            {t('entry.cameraButton')}
          </Button>
        }
        className="font-mono font-medium"
        autoFocus
      />

      {/* Coincidencias rápidas del catálogo */}
      <div className="mt-2.5">
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="text-stone-500 flex items-center space-x-1">
            <Search className="w-3 h-3 text-stone-400" />
            <span>{t('hints.consolidatedStock')}</span>
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {catalogProducts.map((prod) => {
            const isSelected = selectedProduct?.barcode === prod.barcode;
            return (
              <Button
                key={prod.id}
                type="button"
                variant={isSelected ? 'outline' : 'secondary'}
                size="xs"
                onClick={() => onSelectQuickProduct(prod.barcode)}
                className={`text-left ${
                  isSelected
                    ? 'bg-rose-50/80 border-maribel-300 text-maribel-900 font-semibold shadow-2xs'
                    : ''
                }`}
              >
                <span className="font-bold">{prod.brand}</span>{' '}
                <span className="opacity-90">{prod.name.slice(0, 18)}...</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
