import { Suspense } from 'react';
import lazyLoad from '../../helpers/lazyLoad';
import { PrivateLayout } from '../../navigation/PrivateLayout';
import { RoutesView } from '../../navigation/routes';
import type { RouteConfig } from '../../navigation/types';
import { LoadingSpinner } from '@/components/ui';

const SettingsScreen = lazyLoad(() =>
  import('./screens/SettingsScreen').then((module) => ({
    default: module.SettingsScreen,
  }))
);

export const SETTINGS_ROUTES: RouteConfig[] = [
  {
    path: RoutesView.SETTINGS,
    element: (
      <PrivateLayout>
        <Suspense fallback={<LoadingSpinner fullScreen message="Cargando configuración..." />}>
          <SettingsScreen />
        </Suspense>
      </PrivateLayout>
    ),
    isProtected: true,
  },
];

export default SETTINGS_ROUTES;
