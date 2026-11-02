import { Suspense } from 'react';
import lazyLoad from '@/helpers/lazyLoad';
import { PrivateLayout } from '@/navigation/PrivateLayout';
import { RoutesView } from '@/navigation/routes';
import type { RouteConfig } from '@/navigation/types';
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
  },
];

export default SALES_ROUTES;
