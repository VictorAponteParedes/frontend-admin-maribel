import React from 'react';
import { Control } from 'react-hook-form';
import { Clock } from 'lucide-react';
import { ControlledInput } from '@/components/ui';
import { StoreGeneralSettings } from '../types/settings.types';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43 6.3 6.3 0 0 0 1.93-4.52V8.62a8.2 8.2 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.97-.05z" />
  </svg>
);

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ControlledInput
            name="instagramUrl"
            control={control}
            label="Instagram (Opcional)"
            placeholder="https://instagram.com/maribel_tiendaderegalos"
            leftIcon={<InstagramIcon className="w-4 h-4 text-rose-500" />}
            helperText="Enlace al perfil de Instagram"
          />

          <ControlledInput
            name="facebookUrl"
            control={control}
            label="Facebook (Opcional)"
            placeholder="https://facebook.com/maribel_tiendaderegalos"
            leftIcon={<FacebookIcon className="w-4 h-4 text-blue-600" />}
            helperText="Página oficial de Facebook"
          />

          <ControlledInput
            name="tiktokUrl"
            control={control}
            label="TikTok (Opcional)"
            placeholder="https://tiktok.com/@maribel_tiendaderegalos"
            leftIcon={<TikTokIcon className="w-4 h-4 text-stone-900" />}
            helperText="Canal oficial en TikTok"
          />
        </div>

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
