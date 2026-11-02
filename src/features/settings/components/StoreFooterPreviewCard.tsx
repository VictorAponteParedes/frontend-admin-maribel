import React from 'react';
import {
  Globe,
  MapPin,
  Phone,
  Clock,
  Instagram,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Store,
} from 'lucide-react';
import { StoreGeneralSettings } from '../types/settings.types';

export interface StoreFooterPreviewCardProps {
  settings: Partial<StoreGeneralSettings>;
}

export const StoreFooterPreviewCard: React.FC<StoreFooterPreviewCardProps> = ({
  settings,
}) => {
  const {
    tradeName = 'Maribel Tienda de Regalos',
    storeBio = 'Perfumería fina, fragancias exclusivas y detalles especiales con atención cálida en Pedro Juan Caballero y envíos a todo Paraguay.',
    legalName = 'Maribel Escriva',
    taxId = '4815234-7',
    whatsappNumber = '0986 314 630',
    businessPhone = '0986 314 630',
    address = 'Avda. Dr. Francia e/ Tte. Herrero',
    city = 'Pedro Juan Caballero',
    country = 'Paraguay',
    mapsUrl = 'https://maps.google.com/?q=Pedro+Juan+Caballero',
    openingHours = 'Lunes a Sábados: 07:30 a 19:30 hs',
    instagramUrl = 'https://instagram.com/maribel_tiendaderegalos',
    logoUrl = '/logo-maribel.png',
    footerCopyright = '© 2026 Maribel Tienda de Regalos. Todos los derechos reservados.',
  } = settings;

  const whatsappClean = whatsappNumber.replace(/\D/g, '');
  const whatsappLink = `https://wa.me/595${whatsappClean.startsWith('0') ? whatsappClean.slice(1) : whatsappClean}`;

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl shadow-xs overflow-hidden">
      {/* Header bar del preview */}
      <div className="flex items-center justify-between p-4 bg-stone-50/80 border-b border-stone-200/80">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-rose-100/70 text-maribel-700 rounded-lg">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Vista Previa en Tienda Web
            </h4>
            <p className="text-[11px] text-stone-500">
              Así ven tus clientes el pie de página (Footer) en la tienda
            </p>
          </div>
        </div>

        <span className="text-[10px] bg-rose-50 text-maribel-800 font-semibold px-2.5 py-1 rounded-full border border-rose-200">
          Página del Cliente
        </span>
      </div>

      {/* Simulación del Footer Web del Cliente */}
      <div className="bg-stone-950 text-stone-300 p-6 space-y-6 font-sans text-xs">
        {/* Banner superior de contacto rápido */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3 text-left w-full sm:w-auto">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-bold text-xs">
                ¿Dudas con una fragancia o pedido especial?
              </p>
              <p className="text-[11px] text-stone-400">
                Escríbenos directamente a nuestro WhatsApp oficial
              </p>
            </div>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs transition-colors shrink-0 shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat WhatsApp</span>
          </a>
        </div>

        {/* Columnas principales del Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Columna 1: Marca & Descripción */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center p-1 overflow-hidden shrink-0">
                <img
                  src={logoUrl || '/logo-maribel.png'}
                  alt={tradeName}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="font-serif font-bold text-white text-sm tracking-wide">
                {tradeName}
              </span>
            </div>

            <p className="text-[11px] text-stone-400 leading-relaxed">
              {storeBio}
            </p>

            {instagramUrl && (
              <div className="pt-1">
                <a
                  href={instagramUrl.startsWith('http') ? instagramUrl : `https://instagram.com/${instagramUrl.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-stone-300 hover:text-rose-300 text-xs transition-colors font-medium"
                >
                  <Instagram className="w-3.5 h-3.5 text-rose-400" />
                  <span>Instagram Oficial</span>
                  <ExternalLink className="w-2.5 h-2.5 text-stone-500" />
                </a>
              </div>
            )}
          </div>

          {/* Columna 2: Atención & Horarios */}
          <div className="space-y-3">
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider border-b border-stone-800 pb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-maribel-400" />
              <span>Atención & Contacto</span>
            </h5>

            <div className="space-y-2 text-[11px] text-stone-300">
              <div className="flex items-start space-x-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-400 block text-[10px]">WhatsApp de Pedidos:</span>
                  <span className="font-semibold text-white">{whatsappNumber}</span>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-400 block text-[10px]">Teléfono Comercial:</span>
                  <span>{businessPhone}</span>
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-0.5">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-400 block text-[10px]">Horarios de Atención:</span>
                  <span>{openingHours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Columna 3: Local Físico & Retiros */}
          <div className="space-y-3">
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider border-b border-stone-800 pb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-maribel-400" />
              <span>Retiros & Local</span>
            </h5>

            <div className="space-y-2 text-[11px] text-stone-300">
              <div className="flex items-start space-x-2">
                <Store className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-400 block text-[10px]">Dirección del Local:</span>
                  <span className="font-medium text-white">{address}</span>
                  <span className="block text-stone-400 text-[10px] mt-0.5">
                    {city}, {country}
                  </span>
                </div>
              </div>

              {mapsUrl && (
                <div className="pt-1.5">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 text-[11px] transition-colors"
                  >
                    <MapPin className="w-3 h-3 text-red-400" />
                    <span>Ver ubicación en Google Maps</span>
                    <ExternalLink className="w-2.5 h-2.5 text-stone-500" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Barra inferior de datos fiscales & Copyright */}
        <div className="pt-4 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between text-[10px] text-stone-500 gap-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
            <span>
              {legalName} • RUC {taxId}
            </span>
          </div>

          <div>
            <span>{footerCopyright}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
