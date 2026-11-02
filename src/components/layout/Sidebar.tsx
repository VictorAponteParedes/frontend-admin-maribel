import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Truck,
  Package,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrdersStore } from '@/store/useOrdersStore';
import { useSidebarStore } from '@/store/useSidebarStore';
import { RoutesView } from '@/navigation/routes';
import { useTranslation } from '@/locale';
import { logoAdmin } from '@/assets';

interface NavItemConfig {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  isActive: boolean;
}

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { orders } = useOrdersStore();
  const { isCollapsed, toggleCollapse, isMobileOpen, closeMobile } = useSidebarStore();

  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING').length;

  const handleLogout = () => {
    closeMobile();
    logout();
    navigate(RoutesView.LOGIN);
  };

  const handleNavClick = () => {
    closeMobile();
  };

  const navItems: NavItemConfig[] = [
    {
      path: RoutesView.DASHBOARD,
      label: t('nav.dashboard'),
      icon: LayoutDashboard,
      isActive: location.pathname === RoutesView.DASHBOARD,
    },
    {
      path: RoutesView.SALES,
      label: t('nav.sales'),
      icon: ShoppingBag,
      isActive:
        location.pathname === RoutesView.SALES ||
        location.pathname.startsWith(`${RoutesView.SALES}/`),
    },
    {
      path: RoutesView.ORDERS,
      label: t('nav.orders'),
      icon: Truck,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      isActive:
        location.pathname === RoutesView.ORDERS ||
        location.pathname.startsWith(`${RoutesView.ORDERS}/`),
    },
    {
      path: RoutesView.PRODUCTS,
      label: t('nav.inventory'),
      icon: Package,
      isActive:
        location.pathname === RoutesView.PRODUCTS ||
        location.pathname.startsWith(`${RoutesView.PRODUCTS}/`),
    },
    {
      path: RoutesView.CUSTOMERS,
      label: t('nav.customers'),
      icon: Users,
      isActive:
        location.pathname === RoutesView.CUSTOMERS ||
        location.pathname.startsWith(`${RoutesView.CUSTOMERS}/`),
    },
    {
      path: RoutesView.SETTINGS,
      label: t('nav.settings'),
      icon: Settings,
      isActive:
        location.pathname === RoutesView.SETTINGS ||
        location.pathname.startsWith(`${RoutesView.SETTINGS}/`),
    },
  ];

  return (
    <>
      {/* Backdrop para mobile */}
      {isMobileOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label={t('nav.closeMenu')}
          onClick={closeMobile}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter') closeMobile();
          }}
          className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Contenedor del Sidebar */}
      <aside
        className={`bg-stone-900 text-stone-200 flex flex-col h-screen border-r border-stone-800 select-none shrink-0 transition-all duration-300 z-50
          fixed inset-y-0 left-0
          lg:static lg:h-screen lg:sticky lg:top-0
          ${
            isMobileOpen
              ? 'translate-x-0 shadow-2xl'
              : '-translate-x-full lg:translate-x-0'
          }
          w-72
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
        `}
      >
        {/* Cabecera del Sidebar */}
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
            onClick={handleNavClick}
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

          {/* Botones de acción en Header: Botón de cerrar en mobile / Botón de colapsar en Desktop */}
          <div className="flex items-center">
            {/* Botón cerrar para mobile */}
            <button
              type="button"
              onClick={closeMobile}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800/80 rounded-lg lg:hidden transition-colors"
              title={t('nav.closeMenu')}
              aria-label={t('nav.closeMenu')}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Botón flecha colapsar/expandir en Desktop */}
            <button
              type="button"
              onClick={toggleCollapse}
              className={`hidden lg:flex items-center justify-center rounded-lg text-stone-400 hover:text-white hover:bg-stone-800/80 transition-all ${
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
            </button>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
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
          })}
        </nav>

        {/* Perfil del usuario autenticado */}
        <div
          className={`border-t border-stone-800 bg-stone-950/40 transition-all ${
            isCollapsed ? 'p-3 lg:px-2 lg:py-3' : 'p-4'
          }`}
        >
          <div
            className={`flex items-center ${
              isCollapsed ? 'lg:justify-center justify-between' : 'justify-between'
            }`}
          >
            <div
              className={`truncate pr-2 ${
                isCollapsed ? 'lg:hidden block' : 'block'
              }`}
            >
              <p className="text-xs font-semibold text-stone-200 truncate">
                {user?.fullName || 'Administrator'}
              </p>
              <p className="text-[11px] text-stone-500 truncate">
                {user?.email || 'admin@maribel.com'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title={t('nav.logout')}
              aria-label={t('nav.logout')}
              className={`text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded-lg transition-colors ${
                isCollapsed ? 'p-2.5' : 'p-2'
              }`}
            >
              <LogOut className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
