import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useToastStore } from '../store/useToastStore';
import { Toast } from './Toast';

export interface ToastContainerProps {
  className?: string;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ className = '' }) => {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <aside
      aria-live="polite"
      aria-label="Notificaciones"
      className={`fixed top-5 right-5 z-50 flex flex-col gap-3 pointer-events-none max-w-sm sm:max-w-md w-full px-4 sm:px-0 sm:w-auto ${className}`}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((item) => (
          <Toast key={item.id} toast={item} onDismiss={removeToast} />
        ))}
      </AnimatePresence>
    </aside>
  );
};
