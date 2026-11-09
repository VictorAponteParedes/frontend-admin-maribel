import { Suspense } from 'react';
import lazyLoad from '@/utils/lazyLoad';
import { PrivateLayout } from '@/navigation/PrivateLayout';
import { RoutesView } from '@/navigation/routes';
import type { RouteConfig } from '@/navigation/types';
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
  },
];

export default ORDERS_ROUTES;
