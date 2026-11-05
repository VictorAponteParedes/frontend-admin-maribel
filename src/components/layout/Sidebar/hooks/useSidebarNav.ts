import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Truck,
  Package,
  Users,
  Settings,
  Store,
  Boxes,
  MessageSquare,
  Globe,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrdersStore } from '@/store/useOrdersStore';
import { useSidebarStore } from '@/store/useSidebarStore';
import { RoutesView } from '@/navigation/routes';
import { useTranslation } from '@/locale';
import { NavItemConfig } from '../types';

export const useSidebarNav = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { orders, metrics, fetchMetrics } = useOrdersStore();
  const { isCollapsed, toggleCollapse, isMobileOpen, closeMobile } = useSidebarStore();
  const [isSettingsExpanded, setIsSettingsExpanded] = useState<boolean>(true);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const pendingOrdersCount = useMemo(
    () => metrics.pendingCount || orders.filter((o) => o.status === 'PENDING').length,
    [metrics.pendingCount, orders]
  );

  const isSettingsActive = useMemo(
    () =>
      location.pathname === RoutesView.SETTINGS ||
      location.pathname.startsWith(`${RoutesView.SETTINGS}/`),
    [location.pathname]
  );

  useEffect(() => {
    if (isSettingsActive) {
      setIsSettingsExpanded(true);
    }
  }, [isSettingsActive]);

  const handleLogout = () => {
    closeMobile();
    logout();
    navigate(RoutesView.LOGIN);
  };

  const handleNavClick = () => {
    closeMobile();
  };

  const navItems: NavItemConfig[] = useMemo(
    () => [
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
        path: RoutesView.WEB_CATALOG,
        label: 'Catálogo Web',
        icon: Globe,
        isActive:
          location.pathname === RoutesView.WEB_CATALOG ||
          location.pathname.startsWith(`${RoutesView.WEB_CATALOG}/`),
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
        path: RoutesView.SETTINGS_STORE,
        label: t('nav.settings'),
        icon: Settings,
        isActive: isSettingsActive,
        subItems: [
          {
            path: RoutesView.SETTINGS_STORE,
            label: 'Datos de la Tienda (Web)',
            icon: Store,
            isActive:
              location.pathname === RoutesView.SETTINGS_STORE ||
              location.pathname === RoutesView.SETTINGS,
          },
          {
            path: RoutesView.SETTINGS_INVENTORY,
            label: 'Inventario & Alertas',
            icon: Boxes,
            isActive: location.pathname === RoutesView.SETTINGS_INVENTORY,
          },
          {
            path: RoutesView.SETTINGS_WHATSAPP,
            label: 'Integración WhatsApp',
            icon: MessageSquare,
            isActive: location.pathname === RoutesView.SETTINGS_WHATSAPP,
          },
        ],
      },
    ],
    [location.pathname, pendingOrdersCount, isSettingsActive, t]
  );

  return {
    state: {
      user,
      isCollapsed,
      isMobileOpen,
      isSettingsExpanded,
      navItems,
    },
    actions: {
      toggleCollapse,
      closeMobile,
      setIsSettingsExpanded,
      handleLogout,
      handleNavClick,
    },
  };
};
