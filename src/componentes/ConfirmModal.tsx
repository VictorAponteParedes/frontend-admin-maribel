import React, { useEffect } from 'react';
import { AlertTriangle, HelpCircle, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui';

export type ConfirmVariant = 'danger' | 'warning' | 'primary';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: React.ReactNode;
  itemTitle?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Estás seguro?',
  description = 'Esta acción no se puede deshacer.',
  itemTitle,
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false,
}) => {
  // Manejo de la tecla Escape para cerrar
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <Trash2 className="w-6 h-6 text-rose-600" />,
          iconBg: 'bg-rose-50 border-rose-100',
          confirmVariant: 'danger' as const,
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
          iconBg: 'bg-amber-50 border-amber-100',
          confirmVariant: 'primary' as const,
        };
      case 'primary':
      default:
        return {
          icon: <HelpCircle className="w-6 h-6 text-maribel-700" />,
          iconBg: 'bg-rose-50 border-rose-100',
          confirmVariant: 'primary' as const,
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header con botón cerrar */}
        <div className="flex items-center justify-between p-4 pb-0">
          <div className="w-6" /> {/* Espaciador simétrico */}
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer disabled:opacity-40"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido Central */}
        <div className="px-6 pb-6 pt-1 text-center">
          <div
            className={`w-14 h-14 mx-auto rounded-2xl border flex items-center justify-center mb-4 ${styles.iconBg} shadow-xs`}
          >
            {styles.icon}
          </div>

          <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
            {title}
          </h3>

          {itemTitle && (
            <div className="inline-block bg-stone-100 border border-stone-200 text-stone-800 text-xs font-semibold px-3 py-1 rounded-lg max-w-[90%] truncate mb-3">
              {itemTitle}
            </div>
          )}

          <div className="text-stone-600 text-sm leading-relaxed mb-6">
            {description}
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              variant={styles.confirmVariant}
              size="md"
              onClick={handleConfirm}
              isLoading={isLoading}
              className="flex-1"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
