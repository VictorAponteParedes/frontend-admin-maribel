import React from 'react';
import type { UserRole } from '@/store/useAuthStore';

export interface SubNavItemConfig {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  requiredPermission?: string;
  requiredRole?: UserRole | UserRole[];
}

export interface NavItemConfig {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  isActive: boolean;
  requiredPermission?: string;
  requiredRole?: UserRole | UserRole[];
  subItems?: SubNavItemConfig[];
}
