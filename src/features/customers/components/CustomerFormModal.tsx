import React from 'react';
import { useForm } from 'react-hook-form';
import { ControlledInput, Button } from '@/components/ui';
import { CustomerFormData } from '@/features/customers/types/customer.types';
import { t } from '@/lang';
import { X, UserPlus, MapPin, Phone } from 'lucide-react';

export interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitCustomer: (data: CustomerFormData) => void;
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  isOpen,
  onClose,
  onSubmitCustomer,
}) => {
  const { control, handleSubmit, reset } = useForm<CustomerFormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      gpsUrl: '',
    },
    mode: 'onTouched',
  });

  if (!isOpen) return null;

  const handleFormSubmit = (data: CustomerFormData) => {
    onSubmitCustomer(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-maribel-100 text-maribel-800 rounded-xl">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-base">
                Registrar Nuevo Cliente
              </h3>
              <p className="text-xs text-stone-500">
                Se le asignará un código correlativo automáticamente
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          <ControlledInput
            control={control}
            name="name"
            label="Nombre Completo"
            placeholder="ej. Pablo Ariel Melgarejo Servian"
            rules={{ required: t('validation.required') }}
          />

          <ControlledInput
            control={control}
            name="phone"
            label="Número de teléfono (WhatsApp)"
            placeholder="ej. 0986 314 630"
            leftIcon={<Phone className="w-4 h-4 text-stone-400" />}
          />

          <ControlledInput
            control={control}
            name="address"
            label="Dirección o referencia / Ciudad"
            placeholder="ej. Pedro Juan Caballero / Ypané"
            leftIcon={<MapPin className="w-4 h-4 text-stone-400" />}
            rules={{ required: t('validation.required') }}
          />

          <ControlledInput
            control={control}
            name="gpsUrl"
            label="Enlace GPS Google Maps (Opcional)"
            placeholder="https://maps.google.com/?q=..."
          />

          <div className="pt-4 border-t border-stone-100 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="primary">
              Guardar Cliente
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
