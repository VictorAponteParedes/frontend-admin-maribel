import { Suspense } from 'react';
import lazyLoad from '@/utils/lazyLoad';
import { PrivateLayout } from '../../navigation/PrivateLayout';
import { RoutesView } from '../../navigation/routes';
import type { RouteConfig } from '../../navigation/types';
import { LoadingSpinner } from '@/components/ui';
import { Permission } from '@/types/permissions';

const WebCatalogScreen = lazyLoad(() =>
  import('./screens/WebCatalogScreen').then((module) => ({
    default: module.WebCatalogScreen,
  }))
);

export const WEB_CATALOG_ROUTES: RouteConfig[] = [
  {
    path: RoutesView.WEB_CATALOG,
    element: (
      <PrivateLayout>
        <Suspense fallback={<LoadingSpinner fullScreen message="Cargando catálogo web..." />}>
          <WebCatalogScreen />
        </Suspense>
      </PrivateLayout>
    ),
    isProtected: true,
    requiredPermission: Permission.SETTINGS_VIEW,
  },
];
