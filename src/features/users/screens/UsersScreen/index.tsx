import React, { useEffect, useState, useMemo } from 'react';
import { Search, Users, RotateCcw, ShieldCheck } from 'lucide-react';
import { AppInput, Button, LoadingSpinner } from '@/components/ui';
import { ConfirmModal } from '@/componentes';
import { useUsersStore } from '@/store/useUsersStore';
import type { UserRole } from '@/store/useAuthStore';
import type {
  User,
  CreateUserData,
  UpdateUserData,
} from '../../types/user.types';
import { UsersHeader } from '../../components/UsersHeader';
import { UserTable } from '../../components/UserTable';
import { UserFormModal } from '../../components/UserFormModal';
import { ResetPasswordModal } from '../../components/ResetPasswordModal';
import { RolesMatrixView } from '../../components/RolesMatrixView';

export const UsersScreen: React.FC = () => {
  const {
    users,
    isLoading,
    isSubmitting,
    filterParams,
    setFilterParams,
    fetchUsers,
    createUser,
    updateUser,
    toggleStatus,
    resetPassword,
    deleteUser,
  } = useUsersStore();

  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [userToReset, setUserToReset] = useState<User | null>(null);

  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToToggle, setUserToToggle] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenCreate = () => {
    setUserToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setUserToEdit(user);
    setIsFormModalOpen(true);
  };

  const handleOpenReset = (user: User) => {
    setUserToReset(user);
    setIsResetModalOpen(true);
  };

  const handleFormSubmit = async (data: CreateUserData | UpdateUserData) => {
    if (userToEdit) {
      return await updateUser(userToEdit.id, data as UpdateUserData);
    } else {
      return await createUser(data as CreateUserData);
    }
  };

  const handleConfirmReset = async (newPassword: string) => {
    if (!userToReset) return false;
    return await resetPassword(userToReset.id, newPassword);
  };

  const handleConfirmToggle = async () => {
    if (!userToToggle) return;
    await toggleStatus(userToToggle.id);
    setUserToToggle(null);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    await deleteUser(userToDelete.id);
    setUserToDelete(null);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (filterParams.search) {
        const query = filterParams.search.toLowerCase();
        const matchesName = u.fullName.toLowerCase().includes(query);
        const matchesEmail = u.email.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail) return false;
      }
      if (filterParams.role && u.role !== filterParams.role) {
        return false;
      }
      if (
        filterParams.isActive !== undefined &&
        u.isActive !== filterParams.isActive
      ) {
        return false;
      }
      return true;
    });
  }, [users, filterParams]);

  const rolePills: Array<{ id: UserRole | 'ALL'; label: string }> = [
    { id: 'ALL', label: 'Todos' },
    { id: 'ADMIN', label: 'Super Admin' },
    { id: 'MANAGER', label: 'Encargados' },
    { id: 'STAFF', label: 'Ventas / Staff' },
  ];

  return (
    <div className="space-y-6">
      {/* Encabezado y Métricas */}
      <UsersHeader users={users} onNewUser={handleOpenCreate} />

      {/* Pestañas de Navegación: Colaboradores vs Roles & Permisos */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'users'
              ? 'bg-maribel-700 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Colaboradores</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === 'users'
                ? 'bg-white/20 text-white'
                : 'bg-stone-200 text-stone-700'
            }`}
          >
            {users.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'roles'
              ? 'bg-maribel-700 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>¿Qué puede hacer cada Rol?</span>
        </button>
      </div>

      {/* Contenido según la pestaña activa */}
      {activeTab === 'roles' ? (
        <RolesMatrixView />
      ) : (
        <>
          {/* Barra de Filtros y Búsqueda */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
            {/* Input de búsqueda */}
            <div className="w-full sm:max-w-xs">
              <AppInput
                placeholder="Buscar por nombre o correo..."
                value={filterParams.search || ''}
                onChange={(e) => setFilterParams({ search: e.target.value })}
                leftIcon={<Search className="w-4 h-4 text-stone-400" />}
              />
            </div>

            {/* Filtros por Rol */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mr-1 hidden lg:inline">
                Rol:
              </span>
              {rolePills.map((pill) => {
                const isSelected =
                  (pill.id === 'ALL' && !filterParams.role) ||
                  filterParams.role === pill.id;

                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() =>
                      setFilterParams({
                        role: pill.id === 'ALL' ? undefined : pill.id,
                      })
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-maribel-700 text-white shadow-2xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}

              {(filterParams.search || filterParams.role) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() =>
                    setFilterParams({
                      search: '',
                      role: undefined,
                      isActive: undefined,
                    })
                  }
                  className="text-stone-400 hover:text-stone-700 text-xs gap-1 ml-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Limpiar</span>
                </Button>
              )}
            </div>
          </div>

          {/* Contenedor de la Tabla */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
            {isLoading && users.length === 0 ? (
              <div className="p-12">
                <LoadingSpinner message="Cargando colaboradores..." />
              </div>
            ) : filteredUsers.length > 0 ? (
              <UserTable
                users={filteredUsers}
                onEdit={handleOpenEdit}
                onResetPassword={handleOpenReset}
                onToggleStatus={(u) => setUserToToggle(u)}
                onDelete={(u) => setUserToDelete(u)}
              />
            ) : (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 bg-stone-100 text-stone-400 rounded-2xl flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-stone-900 text-sm">
                    No se encontraron colaboradores
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Prueba ajustando los filtros de búsqueda o registra un nuevo
                    usuario.
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal de Crear / Editar Usuario */}
      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        userToEdit={userToEdit}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Modal de Restablecer Contraseña */}
      <ResetPasswordModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        user={userToReset}
        onConfirm={handleConfirmReset}
        isSubmitting={isSubmitting}
      />

      {/* Modal de Confirmar Suspensión / Activación */}
      <ConfirmModal
        isOpen={Boolean(userToToggle)}
        onClose={() => setUserToToggle(null)}
        onConfirm={handleConfirmToggle}
        title={
          userToToggle?.isActive
            ? '¿Suspender acceso al colaborador?'
            : '¿Reactivar acceso al colaborador?'
        }
        itemTitle={userToToggle?.fullName}
        description={
          userToToggle?.isActive
            ? 'El usuario no podrá iniciar sesión en el Backoffice mientras esté suspendido.'
            : 'El colaborador podrá volver a ingresar y operar en el sistema con su rol.'
        }
        confirmText={
          userToToggle?.isActive ? 'Suspender Cuenta' : 'Reactivar Cuenta'
        }
        variant={userToToggle?.isActive ? 'warning' : 'primary'}
      />

      {/* Modal de Confirmar Eliminación */}
      <ConfirmModal
        isOpen={Boolean(userToDelete)}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar colaborador?"
        itemTitle={userToDelete?.fullName}
        description="Esta acción deshabilitará permanentemente el acceso del usuario."
        confirmText="Eliminar Colaborador"
        variant="danger"
      />
    </div>
  );
};

export default UsersScreen;
