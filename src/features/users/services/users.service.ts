import { httpClient } from '@/lib/httpClient';
import type {
  User,
  CreateUserData,
  UpdateUserData,
  UserFilterParams,
} from '../types/user.types';

export const usersService = {
  getUsers: async (params?: UserFilterParams): Promise<User[]> => {
    const cleanParams: Record<string, string | boolean> = {};

    if (params?.search?.trim()) {
      cleanParams.search = params.search.trim();
    }
    if (params?.role) {
      cleanParams.role = params.role;
    }
    if (params?.isActive !== undefined) {
      cleanParams.isActive = params.isActive;
    }

    const response = await httpClient.get('/users', { params: cleanParams });
    return response.data.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await httpClient.get(`/users/${id}`);
    return response.data.data;
  },

  createUser: async (data: CreateUserData): Promise<User> => {
    const response = await httpClient.post('/users', data);
    return response.data.data;
  },

  updateUser: async (id: string, data: UpdateUserData): Promise<User> => {
    const response = await httpClient.patch(`/users/${id}`, data);
    return response.data.data;
  },

  toggleUserStatus: async (id: string): Promise<User> => {
    const response = await httpClient.patch(`/users/${id}/toggle-status`);
    return response.data.data;
  },

  resetPassword: async (id: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    const response = await httpClient.patch(`/users/${id}/reset-password`, {
      newPassword,
    });
    return response.data.data;
  },

  deleteUser: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await httpClient.delete(`/users/${id}`);
    return response.data.data;
  },
};
