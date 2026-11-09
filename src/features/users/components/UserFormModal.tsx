import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, UserPlus, Shield, ShieldAlert, UserCheck, Mail, Lock, User as UserIcon } from 'lucide-react';
import { ControlledInput, Button } from '@/components/ui';
import type { UserRole } from '@/store/useAuthStore';
import type { User, CreateUserData, UpdateUserData } from '../types/user.types';

export interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: User | null;
  onSubmit: (data: CreateUserData | UpdateUserData) => Promise<boolean>;
  isSubmitting?: boolean;
}

interface UserFormData {
  fullName: string;
  email: string;
  password?: string;
  role: UserRole;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  userToEdit,
  onSubmit,
  isSubmitting = false,
}) => {
  const isEditing = Boolean(userToEdit);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role: 'STAFF',
    },
    mode: 'onTouched',
  });

  const selectedRole = watch('role');

  useEffect(() => {
    if (userToEdit) {
      reset({
        fullName: userToEdit.fullName,
        email: userToEdit.email,
        password: '',
        role: userToEdit.role,
      });
    } else {
      reset({
        fullName: '',
        email: '',
        password: '',
        role: 'STAFF',
      });
    }
  }, [userToEdit, isOpen, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data: UserFormData) => {
    let success = false;
    if (isEditing) {
      success = await onSubmit({
        fullName: data.fullName,
        role: data.role,
      });
    } else {
      success = await onSubmit({
        fullName: data.fullName,
        email: data.email,
        password: data.password || '',
        role: data.role,
      });
    }

    if (success) {
      reset();
      onClose();
    }
  };

  const roleOptions: Array<{
    id: UserRole;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }> = [
    {
      id: 'STAFF',
      title: 'Vendedor / Staff',
      description: 'Caja POS, cobros, registro de pedidos y clientes. Sin acceso a costos ni configuraciones.',
      icon: UserCheck,
      accentColor: 'border-emerald-500 bg-emerald-50/50 text-emerald-900',
    },
    {
      id: 'MANAGER',
      title: 'Encargado de Tienda',
      description: 'Gestión de productos, existencias, ventas y reportes operativos.',
      icon: Shield,
      accentColor: 'border-blue-500 bg-blue-50/50 text-blue-900',
    },
    {
      id: 'ADMIN',
      title: 'Super Administrador',
      description: 'Control absoluto del sistema, métricas financieras, configuración y usuarios.',
      icon: ShieldAlert,
      accentColor: 'border-purple-500 bg-purple-50/50 text-purple-900',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl border border-stone-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Encabezado */}
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-maribel-100 text-maribel-800 rounded-2xl">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-lg">
                {isEditing ? 'Editar Colaborador' : 'Nuevo Colaborador'}
              </h3>
              <p className="text-xs text-stone-500">
                {isEditing
                  ? 'Modifica los datos y rol de acceso del usuario.'
                  : 'Registra un nuevo miembro del equipo en el Backoffice.'}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 rounded-xl hover:bg-stone-100 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-5">
          <ControlledInput
            control={control}
            name="fullName"
            label="Nombre Completo"
            placeholder="Ej: Laura Méndez"
            leftIcon={<UserIcon className="w-4 h-4 text-stone-400" />}
            rules={{
              required: 'El nombre es obligatorio',
              minLength: {
                value: 3,
                message: 'Debe tener al menos 3 caracteres',
              },
            }}
          />

          <ControlledInput
            control={control}
            name="email"
            label="Correo Electrónico"
            placeholder="colaborador@maribelregalos.com"
            disabled={isEditing}
            leftIcon={<Mail className="w-4 h-4 text-stone-400" />}
            rules={{
              required: 'El correo electrónico es obligatorio',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Ingresa un correo electrónico válido',
              },
            }}
            helperText={
              isEditing ? 'El correo es el identificador principal y no puede modificarse.' : undefined
            }
          />

          {!isEditing && (
            <ControlledInput
              control={control}
              name="password"
              type="password"
              label="Contraseña Temporal"
              placeholder="Mínimo 6 caracteres"
              leftIcon={<Lock className="w-4 h-4 text-stone-400" />}
              rules={{
                required: 'La contraseña es obligatoria para nuevos usuarios',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres',
                },
              }}
            />
          )}

          {/* Selector de Rol */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-semibold text-stone-700">
              Rol de Acceso en el Sistema
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {roleOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedRole === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setValue('role', opt.id, { shouldValidate: true })}
                    className={`cursor-pointer rounded-2xl p-3.5 border transition-all flex items-start gap-3 ${
                      isSelected
                        ? opt.accentColor + ' shadow-xs ring-1 ring-offset-0 ring-maribel-500'
                        : 'border-stone-200 bg-white hover:bg-stone-50/80 text-stone-700'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        isSelected ? 'bg-white shadow-2xs' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-serif">{opt.title}</span>
                        {isSelected && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider bg-maribel-700 text-white px-2 py-0.5 rounded-full">
                            Seleccionado
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            {errors.role && (
              <span className="text-xs text-rose-500">{errors.role.message}</span>
            )}
          </div>

          {/* Botones de acción */}
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
              {isEditing ? 'Guardar Cambios' : 'Registrar Colaborador'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
