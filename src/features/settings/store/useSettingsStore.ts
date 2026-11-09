import { create } from 'zustand';
import { StoreGeneralSettings } from '../types/settings.types';
import { settingsService } from '../services/settings.service';

const STORAGE_KEY = 'maribel_store_general_settings';

export const DEFAULT_STORE_SETTINGS: StoreGeneralSettings = {
  tradeName: 'Maribel Tienda de Regalos',
  storeBio:
    'Perfumería fina, fragancias exclusivas y detalles especiales con atención cálida en Pedro Juan Caballero y envíos a todo Paraguay.',
  legalName: 'Maribel Escriva',
  taxId: '4815234-7',
  whatsappNumber: '0986 314 630',
  businessPhone: '0986 314 630',
  address: 'Avda. Dr. Francia e/ Tte. Herrero',
  city: 'Pedro Juan Caballero',
  country: 'Paraguay',
  mapsUrl: 'https://maps.google.com/?q=Pedro+Juan+Caballero',
  openingHours: 'Lunes a Sábados: 07:30 a 19:30 hs',
  instagramUrl: 'https://instagram.com/maribel_tiendaderegalos',
  facebookUrl: '',
  tiktokUrl: '',
  logoUrl: '/logo-maribel.png',
  footerCopyright:
    '© 2026 Maribel Tienda de Regalos. Todos los derechos reservados.',
  announcementText:
    'Envíos a todo el país · Caja de lujo de obsequio con tarjeta dedicatoria en compras desde Gs. 250.000',
  announcementActive: true,
  freeShippingThreshold: 250000,
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
  isLoading: boolean;
  error: string | null;
  fetchSettings: (force?: boolean) => Promise<void>;
  saveSettings: (
    newSettings: Partial<StoreGeneralSettings>
  ) => Promise<StoreGeneralSettings>;
  resetToDefaults: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: loadInitialSettings(),
  isLoading: false,
  error: null,

  fetchSettings: async (force = false) => {
    // Si ya cargó y no es forzado, no volver a pedir
    if (!force && get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const serverSettings = await settingsService.fetchSettings();
      set({ settings: serverSettings, isLoading: false });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serverSettings));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar configuración';
      set({ error: message, isLoading: false });
    }
  },

  saveSettings: async (newSettings) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await settingsService.updateSettings(newSettings);
      set({ settings: updated, isLoading: false });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al guardar configuración';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  resetToDefaults: async () => {
    try {
      await settingsService.updateSettings(DEFAULT_STORE_SETTINGS);
    } catch {
      // Ignorar si falla la red al resetear
    }
    localStorage.removeItem(STORAGE_KEY);
    set({ settings: DEFAULT_STORE_SETTINGS });
  },
}));
