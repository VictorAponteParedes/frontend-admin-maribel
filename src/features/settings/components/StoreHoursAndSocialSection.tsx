import React from 'react';
import { Control } from 'react-hook-form';
import { Clock, Instagram } from 'lucide-react';
import { ControlledInput } from '@/components/ui';
import { StoreGeneralSettings } from '../types/settings.types';

interface StoreHoursAndSocialSectionProps {
  control: Control<StoreGeneralSettings>;
}

export const StoreHoursAndSocialSection: React.FC<StoreHoursAndSocialSectionProps> = ({
  control,
}) => {
  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-5">
      <div className="flex items-center space-x-3 pb-3 border-b border-stone-100">
        <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-stone-900">
            Horarios de Atención & Redes Sociales
          </h3>
          <p className="text-xs text-stone-500">
            Información complementaria visible al pie de la página
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <ControlledInput
          name="openingHours"
          control={control}
          label="Horarios de Atención al Público *"
          placeholder="Ej. Lunes a Sábados: 07:30 a 19:30 hs"
          leftIcon={<Clock className="w-4 h-4 text-stone-400" />}
          rules={{
            required: 'Los horarios de atención son requeridos',
          }}
          helperText="Horarios en los que los clientes pueden retirar productos"
        />

        <ControlledInput
          name="instagramUrl"
          control={control}
          label="Perfil de Instagram *"
          placeholder="https://instagram.com/maribel_tiendaderegalos"
          leftIcon={<Instagram className="w-4 h-4 text-rose-500" />}
          rules={{
            required: 'El perfil de Instagram es requerido',
          }}
          helperText="Enlace para que los clientes te sigan en redes"
        />

        <ControlledInput
          name="footerCopyright"
          control={control}
          label="Texto de Derechos / Copyright en Footer *"
          placeholder="Ej. © 2026 Maribel Tienda de Regalos. Todos los derechos reservados."
          rules={{
            required: 'El texto de copyright es requerido',
          }}
          helperText="Línea final al pie de la tienda del cliente"
        />
      </div>
    </div>
  );
};
