import type { UserRole } from '@/store/useAuthStore';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  permissions: string[];
  avatarId?: string | null;
  avatar?: { id: string; url: string } | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  permissions?: string[];
  avatarId?: string;
}

export interface UpdateUserData {
  fullName?: string;
  role?: UserRole;
  permissions?: string[];
  avatarId?: string;
  isActive?: boolean;
}

export interface ResetPasswordData {
  newPassword: string;
}

export interface UserFilterParams {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
}
