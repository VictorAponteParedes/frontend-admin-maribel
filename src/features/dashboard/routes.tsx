import { Suspense } from 'react';
import lazyLoad from '../../helpers/lazyLoad';
import { PrivateLayout } from '../../navigation/PrivateLayout';
import { RoutesView } from '../../navigation/routes';
import type { RouteConfig } from '../../navigation/types';
import { DashboardSkeleton } from './components/DashboardSkeleton';

const DashboardScreen = lazyLoad(() =>
  import('./screens/DashboardScreen').then((module) => ({
    default: module.DashboardScreen,
  }))
);

export const DASHBOARD_ROUTES: RouteConfig[] = [
  {
    path: RoutesView.DASHBOARD,
    element: (
      <PrivateLayout>
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardScreen />
        </Suspense>
      </PrivateLayout>
    ),
    isProtected: true,
    requiredPermission: 'dashboard:view',
  },
];

export default DASHBOARD_ROUTES;
