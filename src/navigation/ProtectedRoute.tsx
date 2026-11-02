import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { RoutesView } from './routes';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
}) => {
  const { isAuthenticated, hasPermission } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={RoutesView.LOGIN} replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-stone-200 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-serif font-bold text-stone-900">
              Acceso Restringido
            </h2>
            <p className="text-xs text-stone-500 leading-relaxed font-medium">
              Tu rol de usuario no cuenta con los permisos necesarios para acceder a este módulo. Si crees que se trata de un error, solicita acceso a un Super Administrador.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to={RoutesView.DASHBOARD}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-maribel-700 text-white text-xs font-semibold hover:bg-maribel-800 transition-colors shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
