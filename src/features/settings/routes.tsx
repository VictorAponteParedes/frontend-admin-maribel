import { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import lazyLoad from '@/utils/lazyLoad';
import { PrivateLayout } from '../../navigation/PrivateLayout';
import { RoutesView } from '../../navigation/routes';
import type { RouteConfig } from '../../navigation/types';
import { LoadingSpinner } from '@/components/ui';
import { SettingsPlaceholderScreen } from './screens/SettingsPlaceholderScreen';

const StoreSettingsScreen = lazyLoad(() =>
  import('./screens/SettingsScreen').then((module) => ({
    default: module.StoreSettingsScreen,
  }))
);

const InventorySettingsScreen = lazyLoad(() =>
  import('./screens/InventorySettingsScreen').then((module) => ({
    default: module.InventorySettingsScreen,
  }))
);

export const SETTINGS_ROUTES: RouteConfig[] = [
  {
    path: RoutesView.SETTINGS,
    element: <Navigate to={RoutesView.SETTINGS_STORE} replace />,
    isProtected: true,
    requiredRole: 'ADMIN',
  },
  {
    path: RoutesView.SETTINGS_STORE,
    element: (
      <PrivateLayout>
        <Suspense fallback={<LoadingSpinner fullScreen message="Cargando datos de la tienda..." />}>
          <StoreSettingsScreen />
        </Suspense>
      </PrivateLayout>
    ),
    isProtected: true,
    requiredRole: 'ADMIN',
  },
  {
    path: RoutesView.SETTINGS_INVENTORY,
    element: (
      <PrivateLayout>
        <Suspense fallback={<LoadingSpinner fullScreen message="Cargando ajustes de inventario..." />}>
          <InventorySettingsScreen />
        </Suspense>
      </PrivateLayout>
    ),
    isProtected: true,
    requiredRole: 'ADMIN',
  },
  {
    path: RoutesView.SETTINGS_WHATSAPP,
    element: (
      <PrivateLayout>
        <SettingsPlaceholderScreen
          title="Integración WhatsApp"
          description="Plantillas de mensajes automáticos y enlace flotante para clientes."
          icon={MessageSquare}
          bulletPoints={[
            'Plantilla personalizada de bienvenida y confirmación de pedidos.',
            'Mensaje automático con enlace de Google Maps para retiro en local.',
            'Enlace directo para canal de ventas y atención por WhatsApp.',
          ]}
        />
      </PrivateLayout>
    ),
    isProtected: true,
    requiredRole: 'ADMIN',
  },
];

export default SETTINGS_ROUTES;
