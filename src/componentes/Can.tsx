import React from 'react';
import { useAuthStore, type UserRole } from '@/store/useAuthStore';

export interface CanProps {
  permission?: string;
  permissions?: string[];
  role?: UserRole | UserRole[];
  requireAll?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({
  permission,
  permissions,
  role,
  requireAll = false,
  children,
  fallback = null,
}) => {
  const { user, hasPermission, hasAnyPermission, hasAllPermissions, hasRole } =
    useAuthStore();

  if (!user) {
    return <>{fallback}</>;
  }

  // Super Admin siempre tiene acceso total
  if (user.role === 'ADMIN' || user.permissions?.includes('*')) {
    return <>{children}</>;
  }

  // Validar rol si fue provisto
  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  // Validar permiso único
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  // Validar array de permisos
  if (permissions && permissions.length > 0) {
    if (requireAll) {
      if (!hasAllPermissions(permissions)) {
        return <>{fallback}</>;
      }
    } else {
      if (!hasAnyPermission(permissions)) {
        return <>{fallback}</>;
      }
    }
  }

  return <>{children}</>;
};

export default Can;
