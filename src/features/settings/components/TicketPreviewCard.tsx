import React from 'react';
import { Printer } from 'lucide-react';
import { StoreGeneralSettings } from '../types/settings.types';

export interface TicketPreviewCardProps {
  settings: Partial<StoreGeneralSettings>;
  showMonochrome?: boolean;
}

export const TicketPreviewCard: React.FC<TicketPreviewCardProps> = ({
  settings,
  showMonochrome = false,
}) => {
  const {
    tradeName = 'Maribel Tienda de Regalos',
    legalName = 'Maribel Escriva',
    taxId = '4815234-7',
    businessPhone = '0986 314 630',
    whatsappNumber = '0986 314 630',
    address = 'Avda. Dr. Francia e/ Tte. Herrero',
    city = 'Pedro Juan Caballero',
    country = 'Paraguay',
    openingHours = 'Lunes a Sábados: 07:30 a 19:30 hs',
    logoUrl = '/logo-maribel.png',
    receiptFooterMessage = '¡Gracias por su preferencia! Cambios con este comprobante dentro de los 5 días hábiles.',
  } = settings;

  return (
    <div className="bg-stone-50/70 border border-stone-200/80 rounded-2xl p-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200/80">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-stone-100 rounded-lg text-stone-700">
            <Printer className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Vista Previa en Comprobante
            </h4>
            <p className="text-[11px] text-stone-500">
              Simulación de ticket térmico estándar (80mm)
            </p>
          </div>
        </div>
        <span className="text-[10px] bg-stone-200/70 text-stone-700 font-semibold px-2 py-0.5 rounded-full">
          POS Térmico
        </span>
      </div>

      {/* Ticket Container */}
      <div className="relative mx-auto max-w-[320px] bg-white border border-stone-300 rounded-lg p-5 font-mono text-[11px] text-stone-800 shadow-sm leading-tight select-none">
        {/* Ticket Header */}
        <div className="text-center space-y-1.5 pb-3 border-b border-dashed border-stone-300">
          <div className="flex justify-center mb-1">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center p-1 border ${
                showMonochrome
                  ? 'border-stone-800 grayscale contrast-125'
                  : 'border-rose-100 bg-rose-50/50'
              }`}
            >
              <img
                src={logoUrl || '/logo-maribel.png'}
                alt="Logo preview"
                className={`max-w-full max-h-full object-contain ${
                  showMonochrome ? 'grayscale contrast-150' : ''
                }`}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>

          <div className="font-bold text-sm text-stone-900 uppercase tracking-wide">
            {tradeName || 'NOMBRE DE FANTASÍA'}
          </div>

          <div className="text-[10px] text-stone-600 font-sans">
            {legalName}
          </div>

          <div className="text-[10px] font-bold text-stone-800">
            RUC: {taxId || '---'}
          </div>

          <div className="text-[10px] text-stone-600 pt-1 leading-normal">
            <div>{address}</div>
            <div>{city} - {country}</div>
          </div>

          <div className="text-[10px] text-stone-600 pt-0.5">
            <div>Tel: {businessPhone}</div>
            <div>WhatsApp Oficial: {whatsappNumber}</div>
          </div>

          <div className="text-[9px] text-stone-500 pt-0.5 italic">
            Horario: {openingHours}
          </div>
        </div>

        {/* Receipt Mock Data */}
        <div className="py-2.5 text-[10px] border-b border-dashed border-stone-300 space-y-1">
          <div className="flex justify-between text-stone-500 text-[9px]">
            <span>FECHA: 02/11/2026 18:45</span>
            <span>TICKET #000492</span>
          </div>
          <div className="flex justify-between text-stone-500 text-[9px]">
            <span>CLIENTE: MOSTRADOR / CASUAL</span>
            <span>RUC: 44444401-7</span>
          </div>
        </div>

        {/* Items Table Mock */}
        <div className="py-2.5 border-b border-dashed border-stone-300 space-y-1.5 text-[10px]">
          <div className="flex justify-between font-bold text-stone-700 text-[9px] pb-1 border-b border-stone-200">
            <span>CANT / DESCRIPCIÓN</span>
            <span>SUBTOTAL</span>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <span className="font-bold">1x</span> COOL GIRL EDP 85ml
            </div>
            <span className="font-bold">Gs. 185.000</span>
          </div>
          <div className="flex justify-between items-start text-stone-500 text-[9px]">
            <div>Descuento promocional</div>
            <span>- Gs. 0</span>
          </div>
        </div>

        {/* Total */}
        <div className="py-2.5 space-y-1 border-b border-dashed border-stone-300">
          <div className="flex justify-between text-xs font-bold text-stone-900">
            <span>TOTAL A PAGAR:</span>
            <span>Gs. 185.000</span>
          </div>
          <div className="flex justify-between text-[9px] text-stone-500">
            <span>FORMA DE PAGO:</span>
            <span>EFECTIVO (Gs. 200.000)</span>
          </div>
          <div className="flex justify-between text-[9px] text-stone-500">
            <span>CAMBIO / VUELTO:</span>
            <span>Gs. 15.000</span>
          </div>
        </div>

        {/* Footer Message */}
        <div className="pt-3 text-center space-y-2">
          <p className="text-[10px] leading-relaxed text-stone-700 italic">
            "{receiptFooterMessage}"
          </p>

          <div className="flex flex-col items-center justify-center pt-1 text-[9px] text-stone-500">
            {/* Barcode simulation */}
            <div className="flex space-x-[2px] h-6 items-center my-1 opacity-75">
              <div className="w-[1px] h-full bg-stone-800"></div>
              <div className="w-[2px] h-full bg-stone-800"></div>
              <div className="w-[1px] h-full bg-stone-800"></div>
              <div className="w-[3px] h-full bg-stone-800"></div>
              <div className="w-[1px] h-full bg-stone-800"></div>
              <div className="w-[2px] h-full bg-stone-800"></div>
              <div className="w-[4px] h-full bg-stone-800"></div>
              <div className="w-[1px] h-full bg-stone-800"></div>
              <div className="w-[2px] h-full bg-stone-800"></div>
              <div className="w-[1px] h-full bg-stone-800"></div>
              <div className="w-[3px] h-full bg-stone-800"></div>
              <div className="w-[2px] h-full bg-stone-800"></div>
            </div>
            <span>COD-000492-2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
