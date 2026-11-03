import React from 'react';
import { Control } from 'react-hook-form';
import { Store, Building2, FileBadge, Sparkles } from 'lucide-react';
import { ControlledInput } from '@/components/ui';
import { StoreGeneralSettings } from '../types/settings.types';

interface StoreIdentitySectionProps {
  control: Control<StoreGeneralSettings>;
}

export const StoreIdentitySection: React.FC<StoreIdentitySectionProps> = ({ control }) => {
  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-5">
      <div className="flex items-center space-x-3 pb-3 border-b border-stone-100">
        <div className="p-2 bg-rose-50 text-maribel-700 rounded-xl">
          <Store className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-stone-900">
            Identidad Comercial & Presentación Web
          </h3>
          <p className="text-xs text-stone-500">
            Nombre visible en el encabezado y descripción de la tienda
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <ControlledInput
          name="tradeName"
          control={control}
          label="Nombre de la Tienda (Marca Comercial) *"
          placeholder="Ej. Maribel Tienda de Regalos"
          leftIcon={<Store className="w-4 h-4 text-stone-400" />}
          rules={{
            required: 'El nombre de la tienda es obligatorio',
            minLength: { value: 3, message: 'Mínimo 3 caracteres' },
          }}
          helperText="Nombre principal desplegado en la web y footer"
        />

        <ControlledInput
          name="storeBio"
          control={control}
          label="Slogan o Resumen de la Tienda (Visible en Footer) *"
          placeholder="Ej. Perfumería fina, fragancias exclusivas y detalles especiales..."
          leftIcon={<Sparkles className="w-4 h-4 text-stone-400" />}
          rules={{
            required: 'La descripción breve de la tienda es obligatoria',
          }}
          helperText="Frase breve que explica tu catálogo a los visitantes"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ControlledInput
            name="legalName"
            control={control}
            label="Razón Social / Nombre del Titular *"
            placeholder="Ej. Maribel Escriva"
            leftIcon={<Building2 className="w-4 h-4 text-stone-400" />}
            rules={{
              required: 'El nombre del titular o razón social es obligatorio',
            }}
            helperText="Aparece en el pie legal del sitio"
          />

          <ControlledInput
            name="taxId"
            control={control}
            label="RUC Paraguay *"
            placeholder="Ej. 4815234-7"
            leftIcon={<FileBadge className="w-4 h-4 text-stone-400" />}
            rules={{
              required: 'El RUC es obligatorio',
            }}
            helperText="Número de RUC para transparencia comercial"
          />
        </div>
      </div>
    </div>
  );
};
