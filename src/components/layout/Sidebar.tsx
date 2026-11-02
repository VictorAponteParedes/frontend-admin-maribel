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
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrdersStore } from '@/store/useOrdersStore';
import { RoutesView } from '@/navigation/routes';
import { t } from '@/lang';
import { logoAdmin } from '@/assets';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { orders } = useOrdersStore();

  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING').length;

  const handleLogout = () => {
    logout();
    navigate(RoutesView.LOGIN);
  };

  const navItems = [
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
    <aside className="w-64 bg-stone-900 text-stone-200 flex flex-col h-screen sticky top-0 border-r border-stone-800 select-none shrink-0">
      <Link
        to={RoutesView.DASHBOARD}
        className="p-5 border-b border-stone-800 flex items-center space-x-3 hover:bg-stone-800/40 transition-colors"
      >
        <img
          src={logoAdmin}
          alt="Maribel Tienda de Regalos"
          className="h-10 w-10 rounded-full object-cover ring-2 ring-maribel-600"
        />
        <div>
          <h2 className="font-serif font-bold text-white text-base tracking-wide">
            {t('common.appName')}
          </h2>
          <span className="text-[11px] text-maribel-400 font-medium tracking-wider uppercase">
            {t('common.backoffice')}
          </span>
        </div>
      </Link>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                item.isActive
                  ? 'bg-maribel-700 text-white shadow-xs'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-amber-500 text-stone-900 font-bold text-[10px] px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Perfil del usuario autenticado */}
      <div className="p-4 border-t border-stone-800 bg-stone-950/40">
        <div className="flex items-center justify-between">
          <div className="truncate pr-2">
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
            className="p-2 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
