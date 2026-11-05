import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ControlledInput, Button } from '@/components/ui';
import { CategorySelect } from '@/componentes';
import { ProductFormData } from '@/features/products/types/product.types';
import { useTranslation } from '@/locale';
import { X, Barcode } from 'lucide-react';

export interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitProduct: (data: ProductFormData) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmitProduct,
}) => {
  const { t } = useTranslation(['inventory', 'translation']);
  const { control, handleSubmit, reset } = useForm<ProductFormData>({
    defaultValues: {
      barcode: '',
      brand: '',
      name: '',
      size: '85 ml / 2.9 fl. oz',
      category: '',
      price: 0,
      totalIn: 10,
    },
    mode: 'onTouched',
  });

  if (!isOpen) return null;

  const handleFormSubmit = (data: ProductFormData) => {
    onSubmitProduct({
      ...data,
      category: data.category?.trim() || undefined,
      price: Number(data.price),
      totalIn: Number(data.totalIn),
    });
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-stone-200 overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Barcode className="w-5 h-5 text-maribel-700" />
            <h3 className="font-serif font-bold text-stone-900 text-base">
              {t('newProduct')}
            </h3>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-5 space-y-4">
          <ControlledInput
            control={control}
            name="barcode"
            label={t('barcode')}
            placeholder="e.g. 6972011068673"
            rules={{ required: t('entry.errors.barcodeRequired') }}
          />

          <div className="grid grid-cols-2 gap-4">
            <ControlledInput
              control={control}
              name="brand"
              label={t('brand')}
              placeholder="e.g. COOL GIRL / MYSTICAL"
              rules={{ required: t('entry.errors.brandRequired') }}
            />
            <ControlledInput
              control={control}
              name="size"
              label={t('size')}
              placeholder="e.g. 85 ml / 2.9 fl. oz"
              rules={{ required: t('entry.errors.sizeRequired') }}
            />
          </div>

          <ControlledInput
            control={control}
            name="name"
            label={t('description')}
            placeholder="e.g. IT'S SO GOOD TO BE BAD - EAU DE PARFUM"
            rules={{ required: t('entry.errors.descRequired') }}
          />

          {/* Selector de Categoría traída de la Base de Datos */}
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <CategorySelect
                label="Categoría"
                placeholder="Seleccionar categoría de la base de datos"
                value={field.value || ''}
                onChange={field.onChange}
              />
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <ControlledInput
              control={control}
              name="price"
              type="number"
              label={t('price')}
              placeholder="0"
              rules={{
                required: t('entry.errors.salePositive'),
                min: { value: 1, message: t('entry.errors.salePositive') },
              }}
            />
            <ControlledInput
              control={control}
              name="totalIn"
              type="number"
              label={t('totalIn')}
              placeholder="10"
              rules={{
                required: t('entry.errors.quantityPositive'),
                min: { value: 1, message: t('entry.errors.quantityPositive') },
              }}
            />
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="primary">
              {t('common.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
