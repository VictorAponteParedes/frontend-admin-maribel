import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui';
import { ProtectedRoute } from '@/navigation/ProtectedRoute';
import { AUTH_ROUTES } from '@/features/auth/routes';
import { DASHBOARD_ROUTES } from '@/features/dashboard/routes';
import { PRODUCTS_ROUTES } from '@/features/products/routes';
import { CATEGORIES_ROUTES } from '@/features/categories/routes';
import { WEB_CATALOG_ROUTES } from '@/features/web-catalog/routes';
import { SALES_ROUTES } from '@/features/sales/routes';
import { ORDERS_ROUTES } from '@/features/orders/routes';
import { CUSTOMERS_ROUTES } from '@/features/customers/routes';
import { USERS_ROUTES } from '@/features/users/routes';
import { SETTINGS_ROUTES } from '@/features/settings/routes';
import { RoutesView } from '@/navigation/routes';
import type { RouteConfig } from '@/navigation/types';

export const ALL_APP_ROUTES: RouteConfig[] = [
  ...AUTH_ROUTES,
  ...DASHBOARD_ROUTES,
  ...SALES_ROUTES,
  ...ORDERS_ROUTES,
  ...PRODUCTS_ROUTES,
  ...CATEGORIES_ROUTES,
  ...WEB_CATALOG_ROUTES,
  ...CUSTOMERS_ROUTES,
  ...USERS_ROUTES,
  ...SETTINGS_ROUTES,
];

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen message="Cargando módulo..." />}>
      <Routes>
        {ALL_APP_ROUTES.map((route) => {
          const element = route.isProtected ? (
            <ProtectedRoute
              requiredPermission={route.requiredPermission}
              requiredRole={route.requiredRole}
            >
              {route.element}
            </ProtectedRoute>
          ) : (
            route.element
          );
          return <Route key={route.path} path={route.path} element={element} />;
        })}
        <Route path="*" element={<Navigate to={RoutesView.DASHBOARD} replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
