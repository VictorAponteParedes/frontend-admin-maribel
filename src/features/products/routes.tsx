import { Suspense } from 'react';
import lazyLoad from '@/utils/lazyLoad';
import { PrivateLayout } from '../../navigation/PrivateLayout';
import { RoutesView } from '../../navigation/routes';
import type { RouteConfig } from '../../navigation/types';
import { ProductsSkeleton } from './components/ProductsSkeleton';

const ProductsScreen = lazyLoad(() =>
  import('./screens/ProductsScreen').then((module) => ({
    default: module.ProductsScreen,
  }))
);

const ProductDetailScreen = lazyLoad(() =>
  import('./screens/ProductDetailScreen').then((module) => ({
    default: module.ProductDetailScreen,
  }))
);

const StockEntryScreen = lazyLoad(() =>
  import('./screens/StockEntryScreen').then((module) => ({
    default: module.StockEntryScreen,
  }))
);

export const PRODUCTS_ROUTES: RouteConfig[] = [
  {
    path: RoutesView.PRODUCTS,
    element: (
      <PrivateLayout>
        <Suspense fallback={<ProductsSkeleton />}>
          <ProductsScreen />
        </Suspense>
      </PrivateLayout>
    ),
    isProtected: true,
    requiredPermission: 'products:view',
  },
  {
    path: RoutesView.STOCK_ENTRY,
    element: (
      <PrivateLayout>
        <Suspense fallback={<ProductsSkeleton />}>
          <StockEntryScreen />
        </Suspense>
      </PrivateLayout>
    ),
    isProtected: true,
    requiredPermission: 'products:view',
  },
  {
    path: RoutesView.PRODUCT_DETAIL,
    element: (
      <PrivateLayout>
        <Suspense fallback={<ProductsSkeleton />}>
          <ProductDetailScreen />
        </Suspense>
      </PrivateLayout>
    ),
    isProtected: true,
    requiredPermission: 'products:view',
  },
];

export default PRODUCTS_ROUTES;
