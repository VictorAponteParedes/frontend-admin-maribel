export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id: string) => `/products/${id}`,
  },
  ORDERS: {
    BASE: '/orders',
    BY_ID: (id: string) => `/orders/${id}`,
  },
  METRICS: {
    DASHBOARD: '/metrics/dashboard',
  },
} as const;

export const APP_STORAGE_KEYS = {
  AUTH_TOKEN: 'maribel_admin_token',
  LANGUAGE: 'maribel_admin_lang',
  THEME: 'maribel_admin_theme',
} as const;
