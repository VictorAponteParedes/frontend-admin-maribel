import lazyLoad from '@/helpers/lazyLoad';
import { PrivateLayout } from '@/navigation/PrivateLayout';
import { RoutesView } from '@/navigation/routes';
import type { RouteConfig } from '@/navigation/types';

const OrdersScreen = lazyLoad(() =>
  import('./screens/OrdersScreen').then((module) => ({
    default: module.OrdersScreen,
  }))
);

export const ORDERS_ROUTES: RouteConfig[] = [
  {
    path: RoutesView.ORDERS,
    element: (
      <PrivateLayout>
        <OrdersScreen />
      </PrivateLayout>
    ),
    isProtected: true,
  },
];

export default ORDERS_ROUTES;
