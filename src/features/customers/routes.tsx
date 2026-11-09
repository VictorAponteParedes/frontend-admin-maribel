import { Suspense } from 'react';
import lazyLoad from '@/utils/lazyLoad';
import { PrivateLayout } from '@/navigation/PrivateLayout';
import { RoutesView } from '@/navigation/routes';
import type { RouteConfig } from '@/navigation/types';
import { Permission } from '@/types/permissions';
import { CustomersSkeleton } from './components/CustomersSkeleton';

const CustomersScreen = lazyLoad(() =>
  import('./screens/CustomersScreen').then((module) => ({
    default: module.CustomersScreen,
  }))
);

export const CUSTOMERS_ROUTES: RouteConfig[] = [
  {
    path: RoutesView.CUSTOMERS,
    element: (
      <PrivateLayout>
        <Suspense fallback={<CustomersSkeleton />}>
          <CustomersScreen />
        </Suspense>
      </PrivateLayout>
    ),
    isProtected: true,
    requiredPermission: Permission.CUSTOMERS_VIEW,
  },
];

export default CUSTOMERS_ROUTES;
