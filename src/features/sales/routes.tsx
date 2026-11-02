import lazyLoad from '@/helpers/lazyLoad';
import { PrivateLayout } from '@/navigation/PrivateLayout';
import { RoutesView } from '@/navigation/routes';
import type { RouteConfig } from '@/navigation/types';

const SalesScreen = lazyLoad(() =>
  import('./screens/SalesScreen').then((module) => ({
    default: module.SalesScreen,
  }))
);

export const SALES_ROUTES: RouteConfig[] = [
  {
    path: RoutesView.SALES,
    element: (
      <PrivateLayout>
        <SalesScreen />
      </PrivateLayout>
    ),
    isProtected: true,
  },
];

export default SALES_ROUTES;
