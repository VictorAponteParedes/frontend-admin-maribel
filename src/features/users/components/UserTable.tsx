import React from 'react';
import { PenLine, KeyRound, Power, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { Can } from '@/componentes';
import { useAuthStore } from '@/store/useAuthStore';
import { Permission } from '@/types/permissions';
import { UserRoleBadge } from './UserRoleBadge';
import type { User } from '../types/user.types';

export interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onResetPassword: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onDelete: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onResetPassword,
  onToggleStatus,
  onDelete,
}) => {
  const { user: currentUser } = useAuthStore();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] border-b border-stone-200">
          <tr>
            <th className="px-5 py-3.5">Colaborador</th>
            <th className="px-5 py-3.5">Rol de Acceso</th>
            <th className="px-5 py-3.5 text-center">Estado</th>
            <th className="px-5 py-3.5">Fecha Registro</th>
            <th className="px-5 py-3.5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {users.map((collab) => {
            const isMe = currentUser?.id === collab.id;

            return (
              <tr key={collab.id} className="hover:bg-stone-50/70 transition-colors">
                {/* Colaborador (Avatar, Nombre, Email) */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center space-x-3">
                    {collab.avatar?.url ? (
                      <img
                        src={collab.avatar.url}
                        alt={collab.fullName}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-stone-200"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-maribel-100 text-maribel-800 font-bold flex items-center justify-center text-xs ring-1 ring-maribel-200">
                        {getInitials(collab.fullName)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-900 text-xs">
                          {collab.fullName}
                        </span>
                        {isMe && (
                          <span className="px-1.5 py-0.2 bg-stone-200 text-stone-700 text-[10px] font-bold rounded-sm">
                            Tú
                          </span>
                        )}
                      </div>
                      <span className="text-stone-500 text-[11px] font-mono">
                        {collab.email}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Rol de Acceso */}
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <UserRoleBadge role={collab.role} />
                </td>

                {/* Estado */}
                <td className="px-5 py-3.5 text-center whitespace-nowrap">
                  {collab.isActive ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      Suspendido
                    </span>
                  )}
                </td>

                {/* Fecha */}
                <td className="px-5 py-3.5 text-stone-500 whitespace-nowrap font-mono text-[11px]">
                  {formatDate(collab.createdAt)}
                </td>

                {/* Acciones */}
                <td className="px-5 py-3.5 text-right whitespace-nowrap">
                  <Can permission={Permission.USERS_MANAGE}>
                    <div className="inline-flex items-center gap-1">
                      {/* Editar */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => onEdit(collab)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                        title="Editar colaborador"
                      >
                        <PenLine className="w-3.5 h-3.5" />
                      </Button>

                      {/* Cambiar contraseña */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => onResetPassword(collab)}
                        className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg"
                        title="Restablecer contraseña"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                      </Button>

                      {/* Toggle status (no para uno mismo) */}
                      {!isMe && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          onClick={() => onToggleStatus(collab)}
                          className={`p-1.5 rounded-lg ${
                            collab.isActive
                              ? 'text-stone-400 hover:text-rose-600 hover:bg-rose-50'
                              : 'text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50'
                          }`}
                          title={collab.isActive ? 'Suspender acceso' : 'Activar acceso'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </Button>
                      )}

                      {/* Eliminar (no para uno mismo) */}
                      {!isMe && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          onClick={() => onDelete(collab)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </Can>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
