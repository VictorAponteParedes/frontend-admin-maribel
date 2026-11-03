import React from 'react';
import { Control } from 'react-hook-form';
import { MapPin, Globe, ExternalLink } from 'lucide-react';
import { ControlledInput } from '@/components/ui';
import { StoreGeneralSettings } from '../types/settings.types';

interface StoreLocationSectionProps {
  control: Control<StoreGeneralSettings>;
  mapsUrl?: string;
}

export const StoreLocationSection: React.FC<StoreLocationSectionProps> = ({
  control,
  mapsUrl,
}) => {
  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-5">
      <div className="flex items-center space-x-3 pb-3 border-b border-stone-100">
        <div className="p-2 bg-sky-50 text-sky-700 rounded-xl">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-stone-900">
            Local Físico & Ubicación para Retiros
          </h3>
          <p className="text-xs text-stone-500">
            Dirección que verán los clientes para ubicar la tienda
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <ControlledInput
          name="address"
          control={control}
          label="Dirección del Local *"
          placeholder="Ej. Avda. Dr. Francia e/ Tte. Herrero"
          leftIcon={<MapPin className="w-4 h-4 text-stone-400" />}
          rules={{
            required: 'La dirección es obligatoria',
          }}
          helperText="Calle, número de local o referencias clave"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ControlledInput
            name="city"
            control={control}
            label="Ciudad / Departamento *"
            placeholder="Ej. Pedro Juan Caballero"
            rules={{
              required: 'La ciudad es requerida',
            }}
          />

          <ControlledInput
            name="country"
            control={control}
            label="País *"
            placeholder="Paraguay"
            rules={{
              required: 'El país es requerido',
            }}
          />
        </div>

        <div className="space-y-1">
          <ControlledInput
            name="mapsUrl"
            control={control}
            label="Enlace de Google Maps (Cómo llegar)"
            placeholder="https://maps.google.com/?q=..."
            leftIcon={<Globe className="w-4 h-4 text-stone-400" />}
            helperText="Enlace que abre Google Maps en el celular del cliente"
          />
          {mapsUrl && (
            <div className="pt-1">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-[11px] font-semibold text-sky-700 hover:text-sky-800 hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Probar enlace de Maps en pestaña nueva</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
