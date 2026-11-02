import type { ReactNode } from 'react';

export interface RouteConfig {
  path: string;
  element: ReactNode;
  isProtected?: boolean;
  requiredPermission?: string;
}
