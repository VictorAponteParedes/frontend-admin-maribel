import { create } from 'zustand';
import axios from 'axios';
import type {
  User,
  CreateUserData,
  UpdateUserData,
  UserFilterParams,
} from '@/features/users/types/user.types';
import { usersService } from '@/features/users/services/users.service';
import { toast } from '@/store/useToastStore';

export interface UsersState {
  users: User[];
  isLoading: boolean;
  isSubmitting: boolean;
  filterParams: UserFilterParams;
  setFilterParams: (params: Partial<UserFilterParams>) => void;
  fetchUsers: () => Promise<void>;
  createUser: (data: CreateUserData) => Promise<boolean>;
  updateUser: (id: string, data: UpdateUserData) => Promise<boolean>;
  toggleStatus: (id: string) => Promise<boolean>;
  resetPassword: (id: string, newPassword: string) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  isLoading: false,
  isSubmitting: false,
  filterParams: {
    search: '',
    role: undefined,
    isActive: undefined,
  },

  setFilterParams: (params) => {
    set((state) => ({
      filterParams: { ...state.filterParams, ...params },
    }));
    get().fetchUsers();
  },

  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const users = await usersService.getUsers(get().filterParams);
      set({ users });
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'No se pudo obtener la lista de colaboradores.';
      toast.error('Error al cargar colaboradores', message);
    } finally {
      set({ isLoading: false });
    }
  },

  createUser: async (data: CreateUserData) => {
    set({ isSubmitting: true });
    try {
      await usersService.createUser(data);
      toast.success(
        'Colaborador creado',
        `El usuario "${data.fullName}" fue registrado correctamente.`,
      );
      await get().fetchUsers();
      return true;
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Ocurrió un error al crear el colaborador.';
      toast.error('Error al crear colaborador', message);
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  updateUser: async (id: string, data: UpdateUserData) => {
    set({ isSubmitting: true });
    try {
      await usersService.updateUser(id, data);
      toast.success(
        'Colaborador actualizado',
        'Los datos del usuario fueron guardados.',
      );
      await get().fetchUsers();
      return true;
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Ocurrió un error al actualizar los datos.';
      toast.error('Error al actualizar', message);
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  toggleStatus: async (id: string) => {
    try {
      const updated = await usersService.toggleUserStatus(id);
      const actionText = updated.isActive ? 'activada' : 'suspendida';
      toast.success(
        'Estado actualizado',
        `La cuenta de "${updated.fullName}" ha sido ${actionText}.`,
      );
      await get().fetchUsers();
      return true;
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'No fue posible cambiar el estado del colaborador.';
      toast.error('Error al cambiar estado', message);
      return false;
    }
  },

  resetPassword: async (id: string, newPassword: string) => {
    set({ isSubmitting: true });
    try {
      await usersService.resetPassword(id, newPassword);
      toast.success(
        'Contraseña restablecida',
        'La contraseña del usuario se actualizó con éxito.',
      );
      return true;
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'No se pudo restablecer la contraseña.';
      toast.error('Error al cambiar contraseña', message);
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  deleteUser: async (id: string) => {
    try {
      await usersService.deleteUser(id);
      toast.success(
        'Colaborador eliminado',
        'El usuario ha sido removido del sistema.',
      );
      await get().fetchUsers();
      return true;
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'No fue posible eliminar al colaborador.';
      toast.error('Error al eliminar', message);
      return false;
    }
  },
}));
