import React from 'react';
import { Shield, ShieldAlert, UserCheck } from 'lucide-react';
import type { UserRole } from '@/store/useAuthStore';

export interface UserRoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md';
}

export const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({
  role,
  size = 'md',
}) => {
  const configs: Record<
    UserRole,
    { label: string; icon: React.ComponentType<{ className?: string }>; bg: string; text: string; border: string }
  > = {
    ADMIN: {
      label: 'Super Admin',
      icon: ShieldAlert,
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
    },
    MANAGER: {
      label: 'Encargado',
      icon: Shield,
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
    STAFF: {
      label: 'Vendedor / Staff',
      icon: UserCheck,
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
    },
  };

  const config = configs[role] ?? configs.STAFF;
  const Icon = config.icon;

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[10px] gap-1'
      : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border shadow-2xs ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
};
