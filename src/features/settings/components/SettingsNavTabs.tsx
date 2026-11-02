import React from 'react';
import { Store, Receipt, Boxes, MessageSquare, Users } from 'lucide-react';
import { SettingsTabId } from '../types/settings.types';

export interface SettingsNavTabsProps {
  activeTab: SettingsTabId;
  onSelectTab: (tab: SettingsTabId) => void;
}

export const SettingsNavTabs: React.FC<SettingsNavTabsProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs = [
    {
      id: 'general' as SettingsTabId,
      label: 'Datos de la Tienda (General)',
      icon: Store,
      badge: 'Principal',
      enabled: true,
    },
    {
      id: 'sales' as SettingsTabId,
      label: 'Ventas & Comprobantes',
      icon: Receipt,
      badge: 'Próximamente',
      enabled: false,
    },
    {
      id: 'inventory' as SettingsTabId,
      label: 'Inventario & Alertas',
      icon: Boxes,
      badge: 'Próximamente',
      enabled: false,
    },
    {
      id: 'whatsapp' as SettingsTabId,
      label: 'Integración WhatsApp',
      icon: MessageSquare,
      badge: 'Próximamente',
      enabled: false,
    },
    {
      id: 'users' as SettingsTabId,
      label: 'Usuarios & Seguridad',
      icon: Users,
      badge: 'Próximamente',
      enabled: false,
    },
  ];

  return (
    <div className="flex space-x-2 border-b border-stone-200/80 overflow-x-auto pb-px select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            disabled={!tab.enabled}
            onClick={() => tab.enabled && onSelectTab(tab.id)}
            className={`flex items-center space-x-2 py-3 px-4 text-xs font-semibold rounded-t-2xl border-b-2 transition-all whitespace-nowrap ${
              isActive
                ? 'border-maribel-700 text-maribel-800 bg-white shadow-2xs font-bold'
                : tab.enabled
                ? 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50'
                : 'border-transparent text-stone-300 cursor-not-allowed opacity-60'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  isActive
                    ? 'bg-rose-50 text-maribel-800 border border-rose-200'
                    : 'bg-stone-100 text-stone-400'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
