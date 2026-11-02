import { create } from 'zustand';
import { ToastItem, ToastOptions, ToastType } from '../types/toast';

interface ToastState {
  toasts: ToastItem[];
  addToast: (type: ToastType, title: string, message?: string, options?: ToastOptions) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (type, title, message, options) => {
    const id = Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    const newToast: ToastItem = {
      id,
      type,
      title,
      message,
      duration: options?.duration ?? 4500,
      dismissible: options?.dismissible ?? true,
      action: options?.action,
      createdAt: Date.now(),
    };

    set((state) => ({
      // Mantener como máximo 5 toasts simultáneos para no saturar la pantalla
      toasts: [...state.toasts.slice(-4), newToast],
    }));

    return id;
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
}));

/**
 * Helper global para disparar notificaciones desde cualquier lugar
 * (componentes, tiendas Zustand, interceptores Axios, etc.)
 */
export const toast = {
  success: (title: string, message?: string, options?: ToastOptions): string =>
    useToastStore.getState().addToast('success', title, message, options),
  error: (title: string, message?: string, options?: ToastOptions): string =>
    useToastStore.getState().addToast('error', title, message, options),
  warning: (title: string, message?: string, options?: ToastOptions): string =>
    useToastStore.getState().addToast('warning', title, message, options),
  info: (title: string, message?: string, options?: ToastOptions): string =>
    useToastStore.getState().addToast('info', title, message, options),
  dismiss: (id: string): void => useToastStore.getState().removeToast(id),
  clear: (): void => useToastStore.getState().clearToasts(),
};
