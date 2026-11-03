import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui';
import { NavItemConfig } from './types';

interface SidebarNavItemProps {
  item: NavItemConfig;
  isCollapsed: boolean;
  isSettingsExpanded: boolean;
  onToggleSettings: () => void;
  onNavClick: () => void;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  item,
  isCollapsed,
  isSettingsExpanded,
  onToggleSettings,
  onNavClick,
}) => {
  const Icon = item.icon;

  // Renderizado con sub-items desplegables (cuando está expandido)
  if (item.subItems && !isCollapsed) {
    return (
      <div className="space-y-1">
        <Button
          type="button"
          variant="ghost"
          onClick={onToggleSettings}
          className={`relative w-full !flex !items-center !justify-between rounded-xl text-xs font-medium transition-all px-3 py-2.5 ${
            item.isActive
              ? '!bg-stone-800 !text-stone-100 font-semibold'
              : 'text-stone-400 hover:!text-stone-100 hover:!bg-stone-800/60'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Icon className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">{item.label}</span>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${
              isSettingsExpanded ? 'rotate-180' : ''
            }`}
          />
        </Button>

        {/* Sub-items como vistas independientes */}
        {isSettingsExpanded && (
          <div className="pl-3 py-1 space-y-1 border-l border-stone-800 ml-5 mr-1">
            {item.subItems.map((sub) => {
              const SubIcon = sub.icon;
              return (
                <Link
                  key={sub.path}
                  to={sub.path}
                  onClick={onNavClick}
                  className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-all ${
                    sub.isActive
                      ? 'bg-maribel-700 text-white font-semibold shadow-xs'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <SubIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate text-[11px]">{sub.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.path}
      onClick={onNavClick}
      title={isCollapsed ? item.label : undefined}
      className={`relative group w-full flex items-center rounded-xl text-xs font-medium transition-all ${
        item.isActive
          ? 'bg-maribel-700 text-white shadow-xs'
          : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
      } ${
        isCollapsed
          ? 'lg:justify-center lg:px-0 lg:py-3 px-3 py-2.5 justify-between'
          : 'justify-between px-3 py-2.5'
      }`}
    >
      <div
        className={`flex items-center ${
          isCollapsed ? 'lg:space-x-0 space-x-3' : 'space-x-3'
        }`}
      >
        <div className="relative flex items-center justify-center">
          <Icon className="w-4 h-4 shrink-0" />
          {/* Badge mini para modo colapsado en desktop */}
          {isCollapsed && item.badge !== undefined && item.badge > 0 && (
            <span className="hidden lg:flex absolute -top-1.5 -right-2 bg-amber-500 text-stone-900 font-bold text-[9px] min-w-3.5 h-3.5 px-0.5 rounded-full items-center justify-center ring-2 ring-stone-900">
              {item.badge}
            </span>
          )}
        </div>
        <span
          className={`whitespace-nowrap transition-opacity duration-200 ${
            isCollapsed ? 'lg:hidden' : 'inline'
          }`}
        >
          {item.label}
        </span>
      </div>

      {/* Badge regular cuando está expandido o en mobile */}
      {item.badge !== undefined && item.badge > 0 && (
        <span
          className={`bg-amber-500 text-stone-900 font-bold text-[10px] px-1.5 py-0.5 rounded-full ${
            isCollapsed ? 'lg:hidden inline-block' : 'inline-block'
          }`}
        >
          {item.badge}
        </span>
      )}

      {/* Tooltip flotante en hover cuando está colapsado (Desktop) */}
      {isCollapsed && (
        <div className="hidden lg:group-hover:flex absolute left-full ml-3 px-2.5 py-1.5 bg-stone-800 text-white text-xs font-medium rounded-md shadow-lg border border-stone-700 whitespace-nowrap z-50 pointer-events-none items-center gap-2">
          <span>{item.label}</span>
          {item.badge !== undefined && item.badge > 0 && (
            <span className="bg-amber-500 text-stone-900 font-bold text-[10px] px-1.5 py-0.2 rounded-full">
              {item.badge}
            </span>
          )}
        </div>
      )}
    </Link>
  );
};
