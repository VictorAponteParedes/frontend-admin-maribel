import { create } from "zustand";
import { APP_STORAGE_KEYS } from "@/config/constants";

export type UserRole = "ADMIN" | "MANAGER" | "STAFF";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  permissions: string[];
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  initAuth: () => void;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: {
    id: "admin-01",
    email: "admin@maribelregalos.com",
    fullName: "Maribel Admin",
    role: "ADMIN",
    permissions: ["*"], // Super Admin wildcard
  },
  token:
    localStorage.getItem(APP_STORAGE_KEYS.AUTH_TOKEN) || "demo-admin-token",
  isAuthenticated: true,
  initAuth: () => {
    const token = localStorage.getItem(APP_STORAGE_KEYS.AUTH_TOKEN);
    if (!token) {
      // For demo we keep authenticated, but in production:
      // set({ isAuthenticated: false, user: null, token: null });
    }
  },
  login: (user: AuthUser, token: string) => {
    localStorage.setItem(APP_STORAGE_KEYS.AUTH_TOKEN, token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem(APP_STORAGE_KEYS.AUTH_TOKEN);
    set({ user: null, token: null, isAuthenticated: false });
  },
  hasRole: (roles: UserRole | UserRole[]) => {
    const user = get().user;
    if (!user) return false;
    if (user.role === "ADMIN") return true;
    const targetRoles = Array.isArray(roles) ? roles : [roles];
    return targetRoles.includes(user.role);
  },
  hasPermission: (permission: string) => {
    const user = get().user;
    if (!user) return false;
    if (user.role === "ADMIN" || user.permissions?.includes("*")) return true;
    return user.permissions?.includes(permission) ?? false;
  },
  hasAnyPermission: (permissions: string[]) => {
    const user = get().user;
    if (!user) return false;
    if (user.role === "ADMIN" || user.permissions?.includes("*")) return true;
    return permissions.some((p) => user.permissions?.includes(p));
  },
  hasAllPermissions: (permissions: string[]) => {
    const user = get().user;
    if (!user) return false;
    if (user.role === "ADMIN" || user.permissions?.includes("*")) return true;
    return permissions.every((p) => user.permissions?.includes(p));
  },
}));
