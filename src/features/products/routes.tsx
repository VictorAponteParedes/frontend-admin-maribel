import lazyLoad from '../../helpers/lazyLoad';
import { PrivateLayout } from '../../navigation/PrivateLayout';
import { RoutesView } from '../../navigation/routes';
import type { RouteConfig } from '../../navigation/types';

const ProductsScreen = lazyLoad(() =>
  import('./screens/ProductsScreen').then((module) => ({
    default: module.ProductsScreen,
  }))
);

export const PRODUCTS_ROUTES: RouteConfig[] = [
  {
    path: RoutesView.PRODUCTS,
    element: (
      <PrivateLayout>
        <ProductsScreen />
      </PrivateLayout>
    ),
    isProtected: true,
    requiredPermission: 'products:view',
  },
];

export default PRODUCTS_ROUTES;
