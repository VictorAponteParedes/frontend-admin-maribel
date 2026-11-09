import React from 'react';
import { Control } from 'react-hook-form';
import { User, Lock, Eye, EyeOff, ArrowRight, Globe } from 'lucide-react';
import { Button, ControlledInput } from '@/components/ui';
import { LoginFormData } from '../types/auth.types';

export interface LoginFormCardProps {
  control: Control<LoginFormData>;
  isLoading: boolean;
  showPassword: boolean;
  rememberMe: boolean;
  onToggleShowPassword: () => void;
  onToggleRememberMe: (checked: boolean) => void;
  onSupportClick: () => void;
  onForgotPassword: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export const LoginFormCard: React.FC<LoginFormCardProps> = ({
  control,
  isLoading,
  showPassword,
  rememberMe,
  onToggleShowPassword,
  onToggleRememberMe,
  onSupportClick,
  onForgotPassword,
  onSubmit,
}) => {
  return (
    <div className="md:col-span-7 bg-white p-8 lg:p-12 flex flex-col justify-between">
      <div>
        {/* Fila Superior: Acceso Seguro & Badge Sistema Activo */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-bold tracking-[0.18em] text-stone-400 uppercase select-none">
            ACCESO SEGURO
          </span>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-[11px] font-medium shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sistema Activo</span>
          </div>
        </div>

        {/* Encabezado del Formulario */}
        <div className="mt-6 mb-6">
          <h2 className="text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Iniciar Sesión
          </h2>
          <div className="text-xs text-stone-500 mt-2 flex flex-wrap items-center gap-1.5">
            <span>¿Aún no tienes acceso?</span>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={onSupportClick}
              className="font-semibold text-maribel-700 hover:text-maribel-800 p-0 h-auto"
            >
              Solicitar credenciales a soporte
            </Button>
          </div>
        </div>

        {/* Formulario conectado a React Hook Form sin autocompletado */}
        <form onSubmit={onSubmit} className="space-y-4" autoComplete="off">
          {/* Campo Usuario o Correo */}
          <ControlledInput
            control={control}
            name="email"
            type="email"
            label="USUARIO O CORREO ELECTRÓNICO"
            labelClassName="text-[10px] font-bold text-stone-600 tracking-wider uppercase"
            placeholder="ej: usuario@maribelregalos.com"
            autoComplete="off"
            leftIcon={<User className="w-4 h-4 text-stone-400" />}
            rules={{
              required: 'El correo electrónico es obligatorio',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Ingresa un correo electrónico válido',
              },
            }}
          />

          {/* Campo Contraseña con Toggle de Visibilidad */}
          <ControlledInput
            control={control}
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="CONTRASEÑA"
            labelClassName="text-[10px] font-bold text-stone-600 tracking-wider uppercase"
            placeholder="Ingresa tu contraseña..."
            autoComplete="new-password"
            leftIcon={<Lock className="w-4 h-4 text-stone-400" />}
            rightIcon={
              showPassword ? (
                <EyeOff className="w-4 h-4 text-stone-400 hover:text-stone-700" />
              ) : (
                <Eye className="w-4 h-4 text-stone-400 hover:text-stone-700" />
              )
            }
            onRightIconClick={onToggleShowPassword}
            rules={{
              required: 'La contraseña es obligatoria',
              minLength: {
                value: 6,
                message: 'Mínimo 6 caracteres',
              },
            }}
          />

          {/* Fila de opciones: Recordar sesión y Olvidaste contraseña */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-stone-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => onToggleRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-maribel-700 accent-maribel-700 focus:ring-maribel-600 border-stone-300 cursor-pointer"
              />
              <span className="font-medium text-stone-700">Recordar sesión</span>
            </label>

            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={onForgotPassword}
              className="text-stone-500 hover:text-stone-800 p-0 h-auto font-medium"
            >
              ¿Olvidaste tu contraseña?
            </Button>
          </div>

          {/* Botón Principal de Envío */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full justify-center bg-maribel-900 hover:bg-maribel-950 text-white rounded-xl py-3.5 shadow-md shadow-maribel-950/20 active:scale-[0.99] transition-all"
            >
              <span>Ingresar al Sistema</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </form>
      </div>

      {/* Pie de Página: Selección de Idioma, Enlaces y Versión */}
      <div className="pt-8 mt-6 border-t border-stone-100 flex flex-wrap items-center justify-between text-[11px] text-stone-400 gap-3">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex items-center gap-1.5 hover:text-stone-600 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Español (ES)</span>
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={onSupportClick}
            className="hover:text-stone-600 transition-colors"
          >
            Centro de Ayuda
          </button>
        </div>

        <span className="font-mono text-stone-400">Maribel Backoffice v2.4</span>
      </div>
    </div>
  );
};
