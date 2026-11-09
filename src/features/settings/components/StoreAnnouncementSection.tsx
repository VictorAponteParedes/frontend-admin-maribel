import React from 'react';
import { Control, Controller, useWatch } from 'react-hook-form';
import { Megaphone, Sparkles, EyeOff, Truck } from 'lucide-react';
import { ControlledInput } from '@/components/ui';
import { ToggleSwitch } from '@/componentes';
import { StoreGeneralSettings } from '../types/settings.types';

export interface StoreAnnouncementSectionProps {
  control: Control<StoreGeneralSettings>;
}

export const StoreAnnouncementSection: React.FC<StoreAnnouncementSectionProps> = ({
  control,
}) => {
  const watchedActive = useWatch({
    control,
    name: 'announcementActive',
    defaultValue: true,
  });

  const watchedText = useWatch({
    control,
    name: 'announcementText',
    defaultValue: '',
  });

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-5">
      {/* Encabezado de la Sección */}
      <div className="flex items-center space-x-3 pb-3 border-b border-stone-100">
        <div className="p-2 bg-rose-50 text-maribel-700 rounded-xl">
          <Megaphone className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-stone-900">
            Cintillo de Anuncios & Promociones Web
          </h3>
          <p className="text-xs text-stone-500">
            Configura la barra publicitaria superior y avisos especiales visibles en la tienda online
          </p>
        </div>
      </div>

      {/* Switch de Activación / Ocultación */}
      <Controller
        name="announcementActive"
        control={control}
        render={({ field: { value, onChange } }) => (
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 flex items-center justify-between transition-colors">
            <div>
              <span className="text-xs font-bold text-stone-900 block leading-tight">
                Mostrar Cintillo en la Tienda Online
              </span>
              <span className="text-[11px] text-stone-500">
                {value
                  ? 'Activo: los clientes verán el anuncio en el encabezado superior'
                  : 'Desactivado: la barra superior estará oculta en la web'}
              </span>
            </div>

            <ToggleSwitch
              checked={Boolean(value)}
              onChange={onChange}
              size="md"
              ariaLabel="Activar cintillo de anuncio en la web"
            />
          </div>
        )}
      />

      {/* Campo de Texto del Anuncio */}
      <div className="space-y-4">
        <ControlledInput
          name="announcementText"
          control={control}
          label="Texto del Anuncio / Frase Promocional *"
          placeholder="Ej. Envíos a todo el país · Caja de lujo de obsequio con tarjeta dedicatoria en compras desde Gs. 250.000"
          leftIcon={<Sparkles className="w-4 h-4 text-stone-400" />}
          rules={{
            required: watchedActive
              ? 'El texto del anuncio es requerido mientras el cintillo esté activo'
              : false,
            maxLength: {
              value: 200,
              message: 'El anuncio debe tener como máximo 200 caracteres',
            },
          }}
          helperText="Aparece con fondo bordeaux en la parte superior de la pantalla de bienvenida y catálogo"
        />

        {/* Monto de Envío Gratis */}
        <ControlledInput
          name="freeShippingThreshold"
          control={control}
          type="number"
          label="Monto Mínimo para Envío Gratis (Gs.)"
          placeholder="250000"
          leftIcon={<Truck className="w-4 h-4 text-stone-400" />}
          helperText="Monto en Guaraníes a partir del cual el flete se marca como cortesía en la web"
        />
      </div>

      {/* Vista previa en tiempo real estilo Web Store */}
      <div className="space-y-2 pt-2 border-t border-stone-100">
        <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500">
          <span>Vista Previa del Encabezado Web:</span>
          <span className="text-[10px] text-stone-400">
            {watchedActive ? 'En vivo' : 'Oculto'}
          </span>
        </div>

        {watchedActive ? (
          <div className="w-full bg-[#5a061a] text-white text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-2 text-center shadow-xs transition-all">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate font-medium">
              {watchedText || 'Escribe un texto promocional para visualizarlo aquí...'}
            </span>
          </div>
        ) : (
          <div className="w-full bg-stone-100 border border-dashed border-stone-200 text-stone-400 text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2">
            <EyeOff className="w-4 h-4 text-stone-400" />
            <span>El cintillo no se mostrará a los visitantes</span>
          </div>
        )}
      </div>
    </div>
  );
};
