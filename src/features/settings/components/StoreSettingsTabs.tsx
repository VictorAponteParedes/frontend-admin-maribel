import React from 'react';
import {
  Store,
  Megaphone,
  MessageCircle,
  MapPin,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { FieldErrors } from 'react-hook-form';
import { StoreGeneralSettings, StoreSettingsTabId } from '../types/settings.types';

export interface StoreSettingsTabItem {
  id: StoreSettingsTabId;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  fields: (keyof StoreGeneralSettings)[];
}

export const STORE_SETTINGS_TABS: StoreSettingsTabItem[] = [
  {
    id: 'identity',
    label: 'Identidad Comercial & Presentación Web',
    shortLabel: 'Identidad Comercial',
    icon: Store,
    fields: ['tradeName', 'storeBio', 'legalName', 'taxId'],
  },
  {
    id: 'announcement',
    label: 'Cintillo de Anuncios & Promociones Web',
    shortLabel: 'Cintillo de Anuncios',
    icon: Megaphone,
    fields: ['announcementActive', 'announcementText', 'freeShippingThreshold'],
  },
  {
    id: 'contact',
    label: 'Canales de Contacto Directo & Pedidos',
    shortLabel: 'Contacto & Pedidos',
    icon: MessageCircle,
    fields: ['whatsappNumber', 'businessPhone'],
  },
  {
    id: 'location',
    label: 'Local Físico & Ubicación para Retiros',
    shortLabel: 'Local & Retiros',
    icon: MapPin,
    fields: ['address', 'city', 'country', 'mapsUrl'],
  },
  {
    id: 'hours_social',
    label: 'Horarios de Atención & Redes Sociales',
    shortLabel: 'Horarios & Redes',
    icon: Clock,
    fields: ['openingHours', 'instagramUrl', 'facebookUrl', 'tiktokUrl'],
  },
];

export interface StoreSettingsTabsProps {
  activeTab: StoreSettingsTabId;
  onTabChange: (tabId: StoreSettingsTabId) => void;
  errors?: FieldErrors<StoreGeneralSettings>;
}

export const StoreSettingsTabs: React.FC<StoreSettingsTabsProps> = ({
  activeTab,
  onTabChange,
  errors = {},
}) => {
  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-1.5 shadow-xs">
      <nav
        className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth"
        aria-label="Pestañas de configuración de la tienda"
      >
        {STORE_SETTINGS_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          const hasError = tab.fields.some((field) => Boolean(errors[field]));

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`group shrink-0 relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-maribel-700 text-white font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'bg-stone-100 text-stone-500 group-hover:text-stone-800 group-hover:bg-stone-200/60'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <span>
                <span className="hidden xl:inline">{tab.label}</span>
                <span className="inline xl:hidden">{tab.shortLabel}</span>
              </span>

              {hasError && (
                <span
                  title="Hay campos obligatorios pendientes de completar"
                  className={`flex items-center justify-center ${
                    isActive ? 'text-amber-200' : 'text-rose-600'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 animate-pulse" />
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
