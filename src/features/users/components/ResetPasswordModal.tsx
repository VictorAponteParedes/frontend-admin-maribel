import React from 'react';
import { useForm } from 'react-hook-form';
import { KeyRound, X, Lock } from 'lucide-react';
import { ControlledInput, Button } from '@/components/ui';
import type { User } from '../types/user.types';

export interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onConfirm: (newPassword: string) => Promise<boolean>;
  isSubmitting?: boolean;
}

interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  user,
  onConfirm,
  isSubmitting = false,
}) => {
  const { control, handleSubmit, reset, watch } = useForm<ResetPasswordFormData>({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  });

  const newPasswordValue = watch('newPassword');

  if (!isOpen || !user) return null;

  const handleFormSubmit = async (data: ResetPasswordFormData) => {
    const success = await onConfirm(data.newPassword);
    if (success) {
      reset();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-100 text-amber-800 rounded-2xl">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-base">
                Restablecer Contraseña
              </h3>
              <p className="text-xs text-stone-500">
                Usuario: <span className="font-semibold text-stone-700">{user.fullName}</span>
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          <ControlledInput
            control={control}
            name="newPassword"
            type="password"
            label="Nueva Contraseña"
            placeholder="Mínimo 6 caracteres"
            leftIcon={<Lock className="w-4 h-4 text-stone-400" />}
            rules={{
              required: 'La contraseña es obligatoria',
              minLength: {
                value: 6,
                message: 'Debe contener al menos 6 caracteres',
              },
            }}
          />

          <ControlledInput
            control={control}
            name="confirmPassword"
            type="password"
            label="Confirmar Contraseña"
            placeholder="Repite la contraseña"
            leftIcon={<Lock className="w-4 h-4 text-stone-400" />}
            rules={{
              required: 'Confirma la contraseña',
              validate: (val) =>
                val === newPasswordValue || 'Las contraseñas no coinciden',
            }}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              Actualizar Contraseña
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
