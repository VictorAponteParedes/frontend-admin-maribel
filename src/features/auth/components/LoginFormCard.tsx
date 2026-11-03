import React from 'react';
import { Control } from 'react-hook-form';
import { User, Lock, Eye, EyeOff, ArrowRight, Globe, Sparkles } from 'lucide-react';
import { Button, ControlledInput } from '@/components/ui';
import { LoginFormData } from '../types/auth.types';

export interface LoginFormCardProps {
  control: Control<LoginFormData>;
  isLoading: boolean;
  showPassword: boolean;
  rememberMe: boolean;
  onToggleShowPassword: () => void;
  onToggleRememberMe: (checked: boolean) => void;
  onFillCredentials: () => void;
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
  onFillCredentials,
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

        {/* Chip de prueba / Autocompletar rápido de credenciales */}
        <div className="mb-5 p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs text-stone-600">
          <div className="flex items-center gap-2 truncate">
            <Sparkles className="w-3.5 h-3.5 text-maribel-700 shrink-0" />
            <span className="text-[11px] truncate">
              Demo: <strong className="text-stone-800">maribel@gmail.com</strong> /{' '}
              <strong className="text-stone-800">Admin123.</strong>
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={onFillCredentials}
            className="text-[11px] font-semibold text-maribel-700 hover:text-maribel-800 p-0 h-auto ml-2 shrink-0"
          >
            Autocompletar
          </Button>
        </div>

        {/* Formulario conectado a React Hook Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Campo Usuario o Correo */}
          <ControlledInput
            control={control}
            name="email"
            type="email"
            label="USUARIO O CORREO ELECTRÓNICO"
            labelClassName="text-[10px] font-bold text-stone-600 tracking-wider uppercase"
            placeholder="admin@maribelregalos.com"
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
            placeholder="••••••••••••"
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
              <span className="font-medium text-stone-600 text-xs">Recordar sesión</span>
            </label>

            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={onForgotPassword}
              className="text-stone-500 hover:text-stone-800 font-medium p-0 h-auto"
            >
              ¿Olvidaste tu contraseña?
            </Button>
          </div>

          {/* Botón de Enviar */}
          <Button
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
            className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-maribel-800 to-maribel-900 hover:from-maribel-700 hover:to-maribel-800 text-white font-medium text-xs tracking-wider shadow-md shadow-maribel-900/15 flex items-center justify-center gap-2 group cursor-pointer transition-all active:scale-[0.99]"
          >
            <span>{isLoading ? 'Ingresando al sistema...' : 'Ingresar al Sistema'}</span>
            {!isLoading && (
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            )}
          </Button>
        </form>
      </div>

      {/* Footer del Formulario */}
      <div className="pt-8 mt-6 border-t border-stone-100 flex flex-wrap items-center justify-between text-[11px] text-stone-400 gap-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-stone-500 hover:text-stone-700 cursor-pointer transition-colors">
            <Globe className="w-3.5 h-3.5" />
            <span>Español (ES)</span>
          </span>
          <span>•</span>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={onSupportClick}
            className="text-stone-500 hover:text-stone-700 p-0 h-auto"
          >
            Centro de Ayuda
          </Button>
        </div>

        <span className="text-stone-400 font-normal">Maribel Backoffice v2.4</span>
      </div>
    </div>
  );
};
