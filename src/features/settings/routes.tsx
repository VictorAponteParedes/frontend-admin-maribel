import { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { Receipt, Boxes, MessageSquare } from 'lucide-react';
import lazyLoad from '../../helpers/lazyLoad';
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

export const SETTINGS_ROUTES: RouteConfig[] = [
  {
    path: RoutesView.SETTINGS,
    element: <Navigate to={RoutesView.SETTINGS_STORE} replace />,
    isProtected: true,
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
  },
  {
    path: RoutesView.SETTINGS_RECEIPTS,
    element: (
      <PrivateLayout>
        <SettingsPlaceholderScreen
          title="Ventas & Comprobantes"
          description="Formato de impresión térmica, timbrado, numeración y talonario fiscal para Paraguay."
          icon={Receipt}
          bulletPoints={[
            'Configuración de timbrado y vencimiento según reglamentación SET/DNIT.',
            'Numeración correlativa de comprobantes (factura, ticket o remisión).',
            'Selección de ancho de papel térmico (58mm u 80mm).',
            'Desglose automático de IVA 10% / 5% / Exentas.',
          ]}
        />
      </PrivateLayout>
    ),
    isProtected: true,
  },
  {
    path: RoutesView.SETTINGS_INVENTORY,
    element: (
      <PrivateLayout>
        <SettingsPlaceholderScreen
          title="Inventario & Alertas"
          description="Umbrales de existencias críticas, alertas tempranas y control de lotes."
          icon={Boxes}
          bulletPoints={[
            'Umbral numérico de stock mínimo por fragancia (ej: ≤ 5 unidades).',
            'Notificaciones en pantalla de productos agotados o críticos.',
            'Bloqueo opcional de ventas sin stock físico disponible.',
            'Gestión de vencimientos de lotes recibidos.',
          ]}
        />
      </PrivateLayout>
    ),
    isProtected: true,
  },
  {
    path: RoutesView.SETTINGS_WHATSAPP,
    element: (
      <PrivateLayout>
        <SettingsPlaceholderScreen
          title="Integración WhatsApp"
          description="Plantillas de recibos digitales y mensajes automáticos enviados a clientes."
          icon={MessageSquare}
          bulletPoints={[
            'Plantilla personalizada de recibo digital tras concretar venta.',
            'Mensaje automático con enlace de Google Maps para retiro en local.',
            'Envío de comprobante en PDF o mensaje formateado por WhatsApp Web o API.',
          ]}
        />
      </PrivateLayout>
    ),
    isProtected: true,
  },
];

export default SETTINGS_ROUTES;
