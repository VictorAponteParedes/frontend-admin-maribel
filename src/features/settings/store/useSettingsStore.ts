import { create } from 'zustand';
import { StoreGeneralSettings } from '../types/settings.types';

const STORAGE_KEY = 'maribel_store_general_settings';

export const DEFAULT_STORE_SETTINGS: StoreGeneralSettings = {
  tradeName: 'Maribel Tienda de Regalos',
  legalName: 'Maribel Aponte Paredes',
  taxId: '4815234-7',
  businessPhone: '0986 314 630',
  whatsappNumber: '0986 314 630',
  address: 'Avda. Dr. Francia e/ Tte. Herrero',
  city: 'Pedro Juan Caballero',
  country: 'Paraguay',
  mapsUrl: 'https://maps.google.com/?q=Pedro+Juan+Caballero',
  openingHours: 'Lunes a Sábados: 07:30 a 19:30 hs',
  logoUrl: '/logo-maribel.png',
  monochromeLogoUrl: '/logo-maribel.png',
  receiptFooterMessage: '¡Gracias por su preferencia! Cambios con este comprobante dentro de los 5 días hábiles.',
};

const loadInitialSettings = (): StoreGeneralSettings => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.error('Error loading store settings from localStorage', error);
  }
  return DEFAULT_STORE_SETTINGS;
};

interface SettingsState {
  settings: StoreGeneralSettings;
  updateSettings: (newSettings: Partial<StoreGeneralSettings>) => void;
  resetToDefaults: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: loadInitialSettings(),

  updateSettings: (newSettings) => {
    set((state) => {
      const updated = { ...state.settings, ...newSettings };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving store settings to localStorage', error);
      }
      return { settings: updated };
    });
  },

  resetToDefaults: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ settings: DEFAULT_STORE_SETTINGS });
  },
}));
