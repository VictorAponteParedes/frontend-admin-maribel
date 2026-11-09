import { httpClient } from '@/lib/httpClient';
import { StoreGeneralSettings } from '../types/settings.types';

export interface BackendWebSettings {
  id: number;
  tradeName?: string;
  storeBio?: string;
  legalName?: string;
  taxId?: string;
  whatsappNumber?: string;
  businessPhone?: string;
  storeAddress?: string;
  city?: string;
  country?: string;
  mapsUrl?: string;
  openingHours?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  logoUrl?: string;
  footerCopyright?: string;
  announcementText?: string;
  announcementActive?: boolean;
  freeShippingThreshold?: number;
  bankDetails?: Array<{
    bank: string;
    accountType: string;
    accountNumber: string;
    holder: string;
    ruc: string;
  }>;
  deliveryRates?: Array<{
    city: string;
    cost: number;
  }>;
}

export const mapBackendSettingsToStoreSettings = (
  raw: BackendWebSettings
): StoreGeneralSettings => {
  return {
    tradeName: raw.tradeName || 'Maribel Tienda de Regalos',
    storeBio:
      raw.storeBio ||
      'Perfumería fina, fragancias exclusivas y detalles especiales con atención cálida en Pedro Juan Caballero y envíos a todo Paraguay.',
    legalName: raw.legalName || 'Maribel Escriva',
    taxId: raw.taxId || '4815234-7',
    whatsappNumber: raw.whatsappNumber || '0986 314 630',
    businessPhone: raw.businessPhone || '0986 314 630',
    address: raw.storeAddress || 'Avda. Dr. Francia e/ Tte. Herrero',
    city: raw.city || 'Pedro Juan Caballero',
    country: raw.country || 'Paraguay',
    mapsUrl: raw.mapsUrl || 'https://maps.google.com/?q=Pedro+Juan+Caballero',
    openingHours: raw.openingHours || 'Lunes a Sábados: 07:30 a 19:30 hs',
    instagramUrl:
      raw.instagramUrl || 'https://instagram.com/maribel_tiendaderegalos',
    facebookUrl: raw.facebookUrl || '',
    tiktokUrl: raw.tiktokUrl || '',
    logoUrl: raw.logoUrl || '/logo-maribel.png',
    footerCopyright:
      raw.footerCopyright ||
      '© 2026 Maribel Tienda de Regalos. Todos los derechos reservados.',
  };
};

export const settingsService = {
  fetchSettings: async (): Promise<StoreGeneralSettings> => {
    const response = await httpClient.get('/web-settings');
    const data = response.data?.data || response.data;
    const settingsRaw: BackendWebSettings = data.settings || data;
    return mapBackendSettingsToStoreSettings(settingsRaw);
  },

  updateSettings: async (
    data: Partial<StoreGeneralSettings>
  ): Promise<StoreGeneralSettings> => {
    const payload: Partial<BackendWebSettings> = {
      tradeName: data.tradeName,
      storeBio: data.storeBio,
      legalName: data.legalName,
      taxId: data.taxId,
      whatsappNumber: data.whatsappNumber,
      businessPhone: data.businessPhone,
      storeAddress: data.address,
      city: data.city,
      country: data.country,
      mapsUrl: data.mapsUrl,
      openingHours: data.openingHours,
      instagramUrl: data.instagramUrl,
      facebookUrl: data.facebookUrl,
      tiktokUrl: data.tiktokUrl,
      logoUrl: data.logoUrl,
      footerCopyright: data.footerCopyright,
    };

    const response = await httpClient.patch('/web-settings', payload);
    const updated = response.data?.data || response.data;
    return mapBackendSettingsToStoreSettings(updated);
  },
};
