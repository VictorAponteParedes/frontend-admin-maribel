import React from 'react';
import { Control } from 'react-hook-form';
import { MessageCircle, Phone } from 'lucide-react';
import { ControlledInput } from '@/components/ui';
import { StoreGeneralSettings } from '../types/settings.types';

interface StoreContactSectionProps {
  control: Control<StoreGeneralSettings>;
}

export const StoreContactSection: React.FC<StoreContactSectionProps> = ({ control }) => {
  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-5">
      <div className="flex items-center space-x-3 pb-3 border-b border-stone-100">
        <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
          <MessageCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-stone-900">
            Canales de Contacto Directo & Pedidos
          </h3>
          <p className="text-xs text-stone-500">
            Números donde tus clientes harán pedidos y consultas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ControlledInput
          name="whatsappNumber"
          control={control}
          label="WhatsApp Oficial para Pedidos *"
          placeholder="Ej. 0986 314 630"
          leftIcon={<MessageCircle className="w-4 h-4 text-emerald-600" />}
          rules={{
            required: 'El número de WhatsApp es requerido',
          }}
          helperText="Enlace directo en el botón flotante y footer web"
        />

        <ControlledInput
          name="businessPhone"
          control={control}
          label="Teléfono Comercial / Llamadas"
          placeholder="Ej. 0986 314 630"
          leftIcon={<Phone className="w-4 h-4 text-stone-400" />}
          rules={{
            required: 'El teléfono de contacto es requerido',
          }}
          helperText="Línea secundaria de atención al cliente"
        />
      </div>
    </div>
  );
};
