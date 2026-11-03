import React from 'react';

export interface SubNavItemConfig {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
}

export interface NavItemConfig {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  isActive: boolean;
  subItems?: SubNavItemConfig[];
}
