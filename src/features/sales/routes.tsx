import { Suspense } from 'react';
import lazyLoad from '@/utils/lazyLoad';
import { PrivateLayout } from '@/navigation/PrivateLayout';
import { RoutesView } from '@/navigation/routes';
import type { RouteConfig } from '@/navigation/types';
import { Permission } from '@/types/permissions';
import { SalesSkeleton } from './components/SalesSkeleton';
import { SaleDetailSkeleton } from './components/SaleDetailSkeleton';

const SalesScreen = lazyLoad(() =>
  import('./screens/SalesScreen').then((module) => ({
    default: module.SalesScreen,
  }))
);

const SaleDetailScreen = lazyLoad(() =>
  import('./screens/SaleDetailScreen').then((module) => ({
    default: module.SaleDetailScreen,
  }))
);

export const SALES_ROUTES: RouteConfig[] = [
  {
    path: RoutesView.SALES,
    element: (
      <PrivateLayout>
        <Suspense fallback={<SalesSkeleton />}>
          <SalesScreen />
        </Suspense>
      </PrivateLayout>
    ),
    isProtected: true,
    requiredPermission: Permission.SALES_VIEW,
  },
  {
    path: RoutesView.SALE_DETAIL,
    element: (
      <PrivateLayout>
        <Suspense fallback={<SaleDetailSkeleton />}>
          <SaleDetailScreen />
        </Suspense>
      </PrivateLayout>
    ),
    isProtected: true,
    requiredPermission: Permission.SALES_VIEW,
  },
];

export default SALES_ROUTES;
