import React from 'react';
import { useForm } from 'react-hook-form';
import { ControlledInput, Button } from '@/components/ui';
import { ProductFormData } from '@/features/products/types/product.types';
import { t } from '@/lang';
import { X } from 'lucide-react';

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
  const { control, handleSubmit, reset } = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      brand: '',
      category: '',
      price: 0,
      stock: 0,
      description: '',
    },
    mode: 'onTouched',
  });

  if (!isOpen) return null;

  const handleFormSubmit = (data: ProductFormData) => {
    onSubmitProduct(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-stone-200 overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-serif font-bold text-stone-900 text-base">
            {t('products.newProduct')}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-5 space-y-4">
          <ControlledInput
            control={control}
            name="name"
            label={t('products.name')}
            placeholder="e.g. Miss Dior Parfum"
            rules={{ required: t('validation.required') }}
          />

          <div className="grid grid-cols-2 gap-4">
            <ControlledInput
              control={control}
              name="brand"
              label={t('products.brand')}
              placeholder="e.g. Dior"
              rules={{ required: t('validation.required') }}
            />
            <ControlledInput
              control={control}
              name="category"
              label={t('products.category')}
              placeholder="e.g. Femenino"
              rules={{ required: t('validation.required') }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ControlledInput
              control={control}
              name="price"
              type="number"
              label={t('products.price')}
              placeholder="0"
              rules={{
                required: t('validation.required'),
                min: { value: 1, message: t('validation.minPrice') },
              }}
            />
            <ControlledInput
              control={control}
              name="stock"
              type="number"
              label={t('products.stock')}
              placeholder="0"
              rules={{
                required: t('validation.required'),
                min: { value: 0, message: t('validation.minStock') },
              }}
            />
          </div>

          <ControlledInput
            control={control}
            name="description"
            label={t('products.description')}
            placeholder="Notas aromáticas y detalles..."
          />

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
