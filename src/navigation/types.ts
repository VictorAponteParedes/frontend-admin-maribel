import type { ReactNode } from 'react';
import type { UserRole } from '@/store/useAuthStore';

export interface RouteConfig {
  path: string;
  element: ReactNode;
  isProtected?: boolean;
  requiredPermission?: string;
  requiredRole?: UserRole | UserRole[];
}
