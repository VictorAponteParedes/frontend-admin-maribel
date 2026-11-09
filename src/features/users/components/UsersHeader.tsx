import React from 'react';
import { Users, UserPlus, ShieldAlert, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { Can } from '@/componentes';
import { Permission } from '@/types/permissions';
import type { User } from '../types/user.types';

export interface UsersHeaderProps {
  users: User[];
  onNewUser: () => void;
}

export const UsersHeader: React.FC<UsersHeaderProps> = ({
  users,
  onNewUser,
}) => {
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const managerCount = users.filter((u) => u.role === 'MANAGER').length;
  const activeCount = users.filter((u) => u.isActive).length;

  const stats = [
    {
      label: 'Colaboradores Registrados',
      value: totalUsers,
      icon: Users,
      color: 'text-stone-700 bg-stone-100',
    },
    {
      label: 'Super Administradores',
      value: adminCount,
      icon: ShieldAlert,
      color: 'text-purple-700 bg-purple-50',
    },
    {
      label: 'Encargados de Tienda',
      value: managerCount,
      icon: Shield,
      color: 'text-blue-700 bg-blue-50',
    },
    {
      label: 'Cuentas Activas',
      value: activeCount,
      icon: CheckCircle,
      color: 'text-emerald-700 bg-emerald-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Título de la página y botón principal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Equipo & Control de Acceso
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Administra los usuarios del Backoffice, asigna roles y gestiona sus permisos.
          </p>
        </div>

        <Can permission={Permission.USERS_MANAGE}>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onNewUser}
            className="inline-flex items-center gap-2 shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nuevo Colaborador</span>
          </Button>
        </Can>
      </div>

      {/* Grid de métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center gap-3.5"
            >
              <div className={`p-2.5 rounded-xl ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xl font-bold font-serif text-stone-900 leading-none">
                  {stat.value}
                </span>
                <span className="text-[11px] text-stone-500 font-medium mt-0.5 block">
                  {stat.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
