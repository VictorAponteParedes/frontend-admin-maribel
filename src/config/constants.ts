export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const APP_STORAGE_KEYS = {
  AUTH_TOKEN: 'admin_auth_token',
  THEME: 'admin_theme',
  LANGUAGE: 'admin_language',
} as const;

