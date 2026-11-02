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
  logoUrl: string;              // Logotipo de la tienda
  footerCopyright: string;      // Texto de copyright y créditos en el footer
}

export type SettingsTabId = 'store' | 'inventory' | 'whatsapp' | 'users';
