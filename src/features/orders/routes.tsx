import { Suspense } from 'react';
import lazyLoad from '@/utils/lazyLoad';
import { PrivateLayout } from '@/navigation/PrivateLayout';
import { RoutesView } from '@/navigation/routes';
import type { RouteConfig } from '@/navigation/types';
import { Permission } from '@/types/permissions';
import { OrdersSkeleton } from './components/OrdersSkeleton';

const OrdersScreen = lazyLoad(() =>
  import('./screens/OrdersScreen').then((module) => ({
    default: module.OrdersScreen,
  }))
);

const OrderDetailScreen = lazyLoad(() =>
  import('./screens/OrderDetailScreen').then((module) => ({
    default: module.OrderDetailScreen,
  }))
);

export const ORDERS_ROUTES: RouteConfig[] = [
  {
    path: RoutesView.ORDERS,
    element: (
      <PrivateLayout>
        <Suspense fallback={<OrdersSkeleton />}>
          <OrdersScreen />
        </Suspense>
      </PrivateLayout>
    ),
    isProtected: true,
    requiredPermission: Permission.ORDERS_VIEW,
  },
  {
    path: RoutesView.ORDER_DETAIL,
    element: (
      <PrivateLayout>
        <Suspense fallback={<OrdersSkeleton />}>
          <OrderDetailScreen />
        </Suspense>
      </PrivateLayout>
    ),
    isProtected: true,
    requiredPermission: Permission.ORDERS_VIEW,
  },
  {
    path: RoutesView.ORDER_DETAIL_ALIAS,
    element: (
      <PrivateLayout>
        <Suspense fallback={<OrdersSkeleton />}>
          <OrderDetailScreen />
        </Suspense>
      </PrivateLayout>
    ),
    isProtected: true,
    requiredPermission: Permission.ORDERS_VIEW,
  },
];

export default ORDERS_ROUTES;
