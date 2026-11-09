import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, APP_STORAGE_KEYS } from '@/config/constants';
import { useAuthStore } from '@/store/useAuthStore';

export const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(APP_STORAGE_KEYS.AUTH_TOKEN);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para auto-renovación silenciosa de token cuando venza (401)
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el servidor respondió 401 y no es petición de login ni de refresh
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return httpClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem(
        APP_STORAGE_KEYS.AUTH_REFRESH_TOKEN,
      );

      if (!refreshToken) {
        isRefreshing = false;
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
        );

        const newAccessToken =
          refreshResponse.data?.data?.token || refreshResponse.data?.token;
        const newRefreshToken =
          refreshResponse.data?.data?.refreshToken ||
          refreshResponse.data?.refreshToken;

        if (newAccessToken) {
          localStorage.setItem(APP_STORAGE_KEYS.AUTH_TOKEN, newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem(
              APP_STORAGE_KEYS.AUTH_REFRESH_TOKEN,
              newRefreshToken,
            );
          }
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);
          return httpClient(originalRequest);
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
