export interface StoreGeneralSettings {
  tradeName: string;            // Nombre de fantasía (Maribel Tienda de Regalos)
  legalName: string;            // Razón social o Nombre del Titular
  taxId: string;                // RUC Paraguay (ej: 80012345-6)
  businessPhone: string;        // Teléfono comercial de línea / atención
  whatsappNumber: string;       // Número de WhatsApp oficial para comprobantes
  address: string;              // Dirección física del local
  city: string;                 // Ciudad / Departamento
  country: string;              // País (Paraguay)
  mapsUrl: string;              // Enlace de Google Maps para retiros
  openingHours: string;         // Horarios de atención al público
  logoUrl: string;              // Logotipo color oficial
  monochromeLogoUrl?: string;   // Variante blanco y negro para impresoras térmicas
  receiptFooterMessage: string; // Mensaje al pie de tickets / comprobantes
}

export type SettingsTabId = 'general' | 'sales' | 'inventory' | 'whatsapp' | 'users';
