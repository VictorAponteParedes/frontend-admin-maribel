import { Suspense } from 'react';
import lazyLoad from '@/utils/lazyLoad';
import { PrivateLayout } from '../../navigation/PrivateLayout';
import { RoutesView } from '../../navigation/routes';
import type { RouteConfig } from '../../navigation/types';
import { LoadingSpinner } from '@/components/ui';
import { Permission } from '@/types/permissions';

const CategoriesScreen = lazyLoad(() =>
  import('./screens/CategoriesScreen').then((module) => ({
    default: module.CategoriesScreen,
  }))
);

export const CATEGORIES_ROUTES: RouteConfig[] = [
  {
    path: RoutesView.CATEGORIES,
    element: (
      <PrivateLayout>
        <Suspense fallback={<LoadingSpinner fullScreen message="Cargando categorías..." />}>
          <CategoriesScreen />
        </Suspense>
      </PrivateLayout>
    ),
    isProtected: true,
    requiredPermission: Permission.CATEGORIES_MANAGE,
  },
];
