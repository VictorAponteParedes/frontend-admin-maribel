export interface StoreGeneralSettings {
  tradeName: string;            // Nombre de la tienda visible en la web (Maribel Tienda de Regalos)
  storeBio: string;             // Slogan o descripción de la tienda visible en el footer
  legalName: string;            // Razón social o Nombre del Titular (Paraguay)
  taxId: string;                // RUC Paraguay (ej: 4815234-7)
  whatsappNumber: string;       // Número de WhatsApp oficial para consultas y pedidos
  businessPhone: string;        // Teléfono comercial / llamadas
  address: string;              // Dirección física del local
  city: string;                 // Ciudad / Departamento
  country: string;              // País (Paraguay)
  mapsUrl: string;              // Enlace de Google Maps para retiros en tienda
  openingHours: string;         // Horarios de atención al público
  instagramUrl: string;         // Enlace o perfil de Instagram (@maribel.regalos)
  facebookUrl?: string;         // Enlace de Facebook oficial (Opcional)
  tiktokUrl?: string;           // Enlace o perfil de TikTok (Opcional)
  logoUrl: string;              // Logotipo de la tienda
  footerCopyright: string;      // Texto de copyright y créditos en el footer
  announcementText: string;     // Mensaje publicitario o promocional en el cintillo superior de la web
  announcementActive: boolean;  // Estado de activación del cintillo en la web
  freeShippingThreshold?: number; // Monto mínimo para envío gratuito (Gs.)
}

export type SettingsTabId = 'store' | 'inventory' | 'whatsapp' | 'users';
