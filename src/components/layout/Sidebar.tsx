import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
  Package,
  Users,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useSalesStore } from '@/store/useSalesStore';
import { RoutesView } from '@/navigation/routes';
import { t } from '@/lang';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { openCreateModal } = useSalesStore();

  const handleLogout = () => {
    logout();
    navigate(RoutesView.LOGIN);
  };

  const handleQuickSale = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== RoutesView.SALES) {
      navigate(RoutesView.SALES);
    }
    openCreateModal();
  };

  const isSalesActive =
    location.pathname === RoutesView.SALES ||
    location.pathname.startsWith(`${RoutesView.SALES}/`);

  const isProductsActive =
    location.pathname === RoutesView.PRODUCTS ||
    location.pathname.startsWith(`${RoutesView.PRODUCTS}/`);

  return (
    <aside className="w-64 bg-stone-900 text-stone-200 flex flex-col h-screen sticky top-0 border-r border-stone-800 select-none shrink-0">
      <Link
        to={RoutesView.DASHBOARD}
        className="p-5 border-b border-stone-800 flex items-center space-x-3 hover:bg-stone-800/40 transition-colors"
      >
        <img
          src="/logo-maribel.png"
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
        {/* 1. Dashboard */}
        <Link
          to={RoutesView.DASHBOARD}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
            location.pathname === RoutesView.DASHBOARD
              ? 'bg-maribel-700 text-white shadow-xs'
              : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>{t('nav.dashboard')}</span>
        </Link>

        {/* 2. Ventas Grupo */}
        <div className="pt-2">
          <Link
            to={RoutesView.SALES}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
              isSalesActive
                ? 'bg-maribel-700 text-white shadow-xs'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
            }`}
          >
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-4 h-4" />
              <span>{t('nav.sales')}</span>
            </div>
          </Link>

          {/* Sub-item: Cargar Venta rápida */}
          <div className="pl-4 pr-1 pt-1">
            <button
              type="button"
              onClick={handleQuickSale}
              className="w-full flex items-center space-x-2.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-maribel-300 hover:text-white hover:bg-stone-800/70 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-maribel-400" />
              <span>{t('nav.newSale')}</span>
            </button>
          </div>
        </div>

        {/* 3. Inventario / Stock */}
        <div className="pt-2">
          <Link
            to={RoutesView.PRODUCTS}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
              isProductsActive
                ? 'bg-maribel-700 text-white shadow-xs'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{t('nav.inventory')}</span>
          </Link>
        </div>

        {/* 4. Clientes */}
        <Link
          to={RoutesView.CUSTOMERS}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
            location.pathname === RoutesView.CUSTOMERS
              ? 'bg-maribel-700 text-white shadow-xs'
              : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t('nav.customers')}</span>
        </Link>

        {/* 5. Configuración */}
        <Link
          to={RoutesView.SETTINGS}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
            location.pathname === RoutesView.SETTINGS
              ? 'bg-maribel-700 text-white shadow-xs'
              : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{t('nav.settings')}</span>
        </Link>
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
