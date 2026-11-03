import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from '@/store/useToastStore';
import { RoutesView } from '@/navigation/routes';
import { LoginFormData } from '../types/auth.types';

export const useLoginForm = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<LoginFormData>({
    defaultValues: {
      email: 'maribel@gmail.com',
      password: 'Admin123.',
    },
    mode: 'onTouched',
  });

  const { control, handleSubmit, setValue } = form;

  const handleFillCredentials = () => {
    setValue('email', 'maribel@gmail.com', { shouldValidate: true, shouldDirty: true });
    setValue('password', 'Admin123.', { shouldValidate: true, shouldDirty: true });
    toast.info('Credenciales aplicadas', 'maribel@gmail.com / Admin123.');
  };

  const handleSupportClick = () => {
    toast.info(
      'Soporte Técnico',
      'Comunícate con soporte@maribel.com para la asignación de accesos.'
    );
  };

  const handleForgotPassword = () => {
    toast.info(
      'Recuperación de Contraseña',
      'Se ha enviado un enlace de restablecimiento a tu correo corporativo.'
    );
  };

  const handleLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      // Simulación de autenticación elegante
      await new Promise((resolve) => setTimeout(resolve, 550));

      login(
        {
          id: 'admin-1',
          email: data.email,
          fullName: 'Maribel Admin',
          role: 'ADMIN',
          permissions: ['*'],
        },
        'token-jwt-maribel-admin'
      );

      toast.success('¡Bienvenida a la Maison!', 'Sesión iniciada correctamente.');
      navigate(RoutesView.DASHBOARD);
    } catch {
      toast.error('Error de autenticación', 'Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    control,
    handleSubmit,
    isLoading,
    showPassword,
    rememberMe,
    setRememberMe,
    toggleShowPassword: () => setShowPassword((prev) => !prev),
    actions: {
      handleLoginSubmit,
      handleFillCredentials,
      handleSupportClick,
      handleForgotPassword,
    },
  };
};
