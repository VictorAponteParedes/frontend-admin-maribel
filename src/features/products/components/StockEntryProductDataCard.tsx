import React from 'react';
import { Control, useController } from 'react-hook-form';
import { Barcode, Camera, Tag, Droplets, Package } from 'lucide-react';
import { AppInput, ControlledInput, Button } from '@/components/ui';
import { ProductImageUploader } from '@/componentes';
import { useTranslation } from '@/locale';
import { Product } from '../types/product.types';
import { StockEntryFormValues } from '../types/stockEntry.types';

export interface StockEntryProductDataCardProps {
  control: Control<StockEntryFormValues>;
  existingProduct?: Product;
  imageUrl?: string;
  imageId?: string;
  onImageChange?: (data: { imageUrl: string; imageId?: string }) => void;
  onOpenScanner: () => void;
  onBarcodeChange: (barcode: string) => void;
}

export const StockEntryProductDataCard: React.FC<StockEntryProductDataCardProps> = ({
  control,
  existingProduct,
  imageUrl,
  imageId,
  onImageChange,
  onOpenScanner,
  onBarcodeChange,
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
          name={barcodeField.name}
          ref={barcodeField.ref}
          value={barcodeField.value || ''}
          onChange={(e) => {
            barcodeField.onChange(e);
            onBarcodeChange(e.target.value);
          }}
          onBlur={barcodeField.onBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}
          autoFocus
          placeholder={t('entry.barcodePlaceholder')}
          leftIcon={<Barcode className="w-5 h-5" />}
          error={barcodeError?.message}
          rightElement={
            <Button
              type="button"
              variant="outline"
              size="xs"
              leftIcon={<Camera className="w-3.5 h-3.5 text-maribel-700" />}
              onClick={onOpenScanner}
            >
              {t('entry.cameraButton')}
            </Button>
          }
          className="font-mono font-medium"
        />
      </div>

      {/* Fila: Marca y Medidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ControlledInput
          name="brand"
          control={control}
          label={t('entry.brandLabel')}
          placeholder="ej: COOL GIRL"
          leftIcon={<Tag className="w-4 h-4" />}
          rules={{ required: t('entry.errors.brandRequired') }}
        />

        <ControlledInput
          name="size"
          control={control}
          label={t('entry.sizeLabel')}
          placeholder="ej: 85 ml / 2.9 fl. oz"
          leftIcon={<Droplets className="w-4 h-4" />}
          rules={{ required: t('entry.errors.sizeRequired') }}
        />
      </div>

      {/* Descripción */}
      <ControlledInput
        name="name"
        control={control}
        label={t('entry.descriptionLabel')}
        placeholder="ej: IT'S SO GOOD TO BE BAD - EAU DE PARFUM"
        leftIcon={<Package className="w-4 h-4" />}
        rules={{ required: t('entry.errors.descRequired') }}
      />

      {/* Imagen / Foto del Perfume */}
      <div className="pt-2 border-t border-stone-100">
        <ProductImageUploader
          imageUrl={imageUrl}
          imageId={imageId}
          onImageChange={(data) => onImageChange?.(data)}
          label="Foto / Imagen del Perfume"
        />
      </div>
    </div>
  );
};
