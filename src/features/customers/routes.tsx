import lazyLoad from '@/helpers/lazyLoad';
import { PrivateLayout } from '@/navigation/PrivateLayout';
import { RoutesView } from '@/navigation/routes';
import type { RouteConfig } from '@/navigation/types';

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
        <CustomersScreen />
      </PrivateLayout>
    ),
    isProtected: true,
  },
];

export default CUSTOMERS_ROUTES;
