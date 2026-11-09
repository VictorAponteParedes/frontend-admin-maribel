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
  Tags,
  ShieldCheck,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrdersStore } from '@/store/useOrdersStore';
import { useSidebarStore } from '@/store/useSidebarStore';
import { RoutesView } from '@/navigation/routes';
import { useTranslation } from '@/locale';
import { Permission } from '@/types/permissions';
import { NavItemConfig } from '../types';

export const useSidebarNav = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasPermission, hasRole } = useAuthStore();
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

  const rawNavItems: NavItemConfig[] = useMemo(
    () => [
      {
        path: RoutesView.DASHBOARD,
        label: t('nav.dashboard'),
        icon: LayoutDashboard,
        requiredPermission: Permission.DASHBOARD_VIEW,
        isActive: location.pathname === RoutesView.DASHBOARD,
      },
      {
        path: RoutesView.SALES,
        label: t('nav.sales'),
        icon: ShoppingBag,
        requiredPermission: Permission.SALES_VIEW,
        isActive:
          location.pathname === RoutesView.SALES ||
          location.pathname.startsWith(`${RoutesView.SALES}/`),
      },
      {
        path: RoutesView.ORDERS,
        label: t('nav.orders'),
        icon: Truck,
        badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
        requiredPermission: Permission.ORDERS_VIEW,
        isActive:
          location.pathname === RoutesView.ORDERS ||
          location.pathname.startsWith(`${RoutesView.ORDERS}/`),
      },
      {
        path: RoutesView.PRODUCTS,
        label: t('nav.inventory'),
        icon: Package,
        requiredPermission: Permission.PRODUCTS_VIEW,
        isActive:
          location.pathname === RoutesView.PRODUCTS ||
          location.pathname.startsWith(`${RoutesView.PRODUCTS}/`),
      },
      {
        path: RoutesView.CATEGORIES,
        label: 'Categorías',
        icon: Tags,
        requiredPermission: Permission.CATEGORIES_MANAGE,
        isActive:
          location.pathname === RoutesView.CATEGORIES ||
          location.pathname.startsWith(`${RoutesView.CATEGORIES}/`),
      },
      {
        path: RoutesView.WEB_CATALOG,
        label: 'Catálogo Web',
        icon: Globe,
        requiredPermission: Permission.SETTINGS_VIEW,
        isActive:
          location.pathname === RoutesView.WEB_CATALOG ||
          location.pathname.startsWith(`${RoutesView.WEB_CATALOG}/`),
      },
      {
        path: RoutesView.CUSTOMERS,
        label: t('nav.customers'),
        icon: Users,
        requiredPermission: Permission.CUSTOMERS_VIEW,
        isActive:
          location.pathname === RoutesView.CUSTOMERS ||
          location.pathname.startsWith(`${RoutesView.CUSTOMERS}/`),
      },
      {
        path: RoutesView.USERS,
        label: 'Equipo & Roles',
        icon: ShieldCheck,
        requiredRole: 'ADMIN',
        isActive:
          location.pathname === RoutesView.USERS ||
          location.pathname.startsWith(`${RoutesView.USERS}/`),
      },
      {
        path: RoutesView.SETTINGS_STORE,
        label: t('nav.settings'),
        icon: Settings,
        requiredRole: 'ADMIN',
        isActive: isSettingsActive,
        subItems: [
          {
            path: RoutesView.SETTINGS_STORE,
            label: 'Datos de la Tienda (Web)',
            icon: Store,
            requiredRole: 'ADMIN',
            isActive:
              location.pathname === RoutesView.SETTINGS_STORE ||
              location.pathname === RoutesView.SETTINGS,
          },
          {
            path: RoutesView.SETTINGS_INVENTORY,
            label: 'Inventario & Alertas',
            icon: Boxes,
            requiredRole: 'ADMIN',
            isActive: location.pathname === RoutesView.SETTINGS_INVENTORY,
          },
          {
            path: RoutesView.SETTINGS_WHATSAPP,
            label: 'Integración WhatsApp',
            icon: MessageSquare,
            requiredRole: 'ADMIN',
            isActive: location.pathname === RoutesView.SETTINGS_WHATSAPP,
          },
        ],
      },
    ],
    [location.pathname, pendingOrdersCount, isSettingsActive, t]
  );

  const navItems: NavItemConfig[] = useMemo(() => {
    return rawNavItems
      .filter((item) => {
        if (item.requiredPermission && !hasPermission(item.requiredPermission)) {
          return false;
        }
        if (item.requiredRole && !hasRole(item.requiredRole)) {
          return false;
        }
        return true;
      })
      .map((item) => {
        if (!item.subItems) return item;
        const visibleSubItems = item.subItems.filter((sub) => {
          if (sub.requiredPermission && !hasPermission(sub.requiredPermission)) {
            return false;
          }
          if (sub.requiredRole && !hasRole(sub.requiredRole)) {
            return false;
          }
          return true;
        });
        return { ...item, subItems: visibleSubItems };
      })
      .filter((item) => {
        if (item.subItems && item.subItems.length === 0) {
          return false;
        }
        return true;
      });
  }, [rawNavItems, hasPermission, hasRole]);

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
