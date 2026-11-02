import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button, ControlledInput } from '@/components/ui';
import { RoutesView } from '@/navigation/routes';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const { control, handleSubmit } = useForm<LoginFormData>({
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  const handleLoginSubmit = (data: LoginFormData) => {
    login(
      {
        id: 'admin-1',
        email: data.email,
        fullName: 'Maribel Admin',
        role: 'ADMIN',
        permissions: ['*'],
      },
      'token-jwt-maribel'
    );
    navigate(RoutesView.DASHBOARD);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 shadow-md border border-stone-200/80 max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <img
            src="/logo-maribel.png"
            alt="Maribel Tienda de Regalos"
            className="w-16 h-16 rounded-full object-cover mx-auto ring-4 ring-maribel-600/20 shadow-sm"
          />
          <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Maribel Backoffice
          </h1>
          <p className="text-xs text-stone-500">
            Ingresa tus credenciales para administrar la tienda
          </p>
        </div>

        <form onSubmit={handleSubmit(handleLoginSubmit)} className="space-y-4">
          <ControlledInput
            control={control}
            name="email"
            type="email"
            label="Correo electrónico"
            placeholder="admin@maribelregalos.com"
            leftIcon={<Mail className="w-4 h-4" />}
            rules={{
              required: 'El correo es obligatorio',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Ingresa un correo electrónico válido',
              },
            }}
          />

          <ControlledInput
            control={control}
            name="password"
            type="password"
            label="Contraseña"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            rules={{
              required: 'La contraseña es obligatoria',
              minLength: {
                value: 6,
                message: 'Mínimo 6 caracteres',
              },
            }}
          />

          <Button type="submit" variant="primary" className="w-full mt-2">
            Iniciar Sesión
          </Button>
        </form>
      </div>
    </div>
  );
};
