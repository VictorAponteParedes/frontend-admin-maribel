import React from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { RoutesView } from '@/navigation/routes';
import { useTranslation } from '@/locale';
import { logoAdmin } from '@/assets';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  onNavClick: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  onToggleCollapse,
  onCloseMobile,
  onNavClick,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`border-b border-stone-800 flex items-center transition-all ${
        isCollapsed
          ? 'p-3 lg:flex-col lg:justify-center lg:gap-3 justify-between'
          : 'p-4 justify-between'
      }`}
    >
      {/* Logo y título */}
      <Link
        to={RoutesView.DASHBOARD}
        onClick={onNavClick}
        className={`flex items-center gap-3 overflow-hidden transition-all ${
          isCollapsed ? 'lg:justify-center lg:gap-0' : ''
        }`}
        title={t('common.appName')}
      >
        <img
          src={logoAdmin}
          alt="Maribel Tienda de Regalos"
          className="h-10 w-10 min-w-10 rounded-full object-cover ring-2 ring-maribel-600 shrink-0"
        />
        <div
          className={`transition-opacity duration-200 whitespace-nowrap ${
            isCollapsed ? 'lg:hidden' : 'block'
          }`}
        >
          <h2 className="font-serif font-bold text-white text-base tracking-wide leading-tight">
            {t('common.appName')}
          </h2>
          <span className="text-[11px] text-maribel-400 font-medium tracking-wider uppercase">
            {t('common.backoffice')}
          </span>
        </div>
      </Link>

      {/* Botones de acción: Mobile close / Desktop collapse */}
      <div className="flex items-center">
        {/* Botón cerrar para mobile */}
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={onCloseMobile}
          className="p-2 text-stone-400 hover:text-white hover:bg-stone-800/80 lg:hidden"
          title={t('nav.closeMenu')}
          aria-label={t('nav.closeMenu')}
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Botón flecha colapsar/expandir en Desktop */}
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={onToggleCollapse}
          className={`hidden lg:flex items-center justify-center rounded-lg text-stone-400 hover:text-white hover:bg-stone-800/80 ${
            isCollapsed ? 'w-8 h-8 mt-1' : 'w-8 h-8'
          }`}
          title={isCollapsed ? t('nav.expandSidebar') : t('nav.collapseSidebar')}
          aria-label={isCollapsed ? t('nav.expandSidebar') : t('nav.collapseSidebar')}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-maribel-400" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
