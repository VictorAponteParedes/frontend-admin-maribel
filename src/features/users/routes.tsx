import { Suspense } from 'react';
import lazyLoad from '@/utils/lazyLoad';
import { PrivateLayout } from '@/navigation/PrivateLayout';
import { RoutesView } from '@/navigation/routes';
import type { RouteConfig } from '@/navigation/types';
import { LoadingSpinner } from '@/components/ui';
import { Permission } from '@/types/permissions';

const UsersScreen = lazyLoad(() =>
  import('./screens/UsersScreen').then((module) => ({
    default: module.UsersScreen,
  }))
);

export const USERS_ROUTES: RouteConfig[] = [
  {
    path: RoutesView.USERS,
    element: (
      <PrivateLayout>
        <Suspense fallback={<LoadingSpinner fullScreen message="Cargando colaboradores..." />}>
          <UsersScreen />
        </Suspense>
      </PrivateLayout>
    ),
    isProtected: true,
    requiredPermission: Permission.USERS_VIEW,
  },
];

export default USERS_ROUTES;
