import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from '@/store/useToastStore';
import { RoutesView } from '@/navigation/routes';
import { LoginFormData } from '../types/auth.types';
import { authService } from '../services/auth.service';

export const useLoginForm = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<LoginFormData>({
    defaultValues: {
      email: 'admin@maribelregalos.com',
      password: 'admin123456',
    },
    mode: 'onTouched',
  });

  const { control, handleSubmit, setValue } = form;

  const handleFillCredentials = () => {
    setValue('email', 'admin@maribelregalos.com', { shouldValidate: true, shouldDirty: true });
    setValue('password', 'admin123456', { shouldValidate: true, shouldDirty: true });
    toast.info('Credenciales aplicadas', 'admin@maribelregalos.com / admin123456');
  };

  const handleSupportClick = () => {
    toast.info(
      'Soporte Técnico',
      'Comunícate con soporte@maribelregalos.com para la asignación de accesos.'
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
      const response = await authService.login(data);

      login(response.user, response.token);

      toast.success('¡Bienvenido!', 'Sesión iniciada correctamente.');
      navigate(RoutesView.DASHBOARD);
    } catch (error: any) {
      const serverMessage =
        error?.response?.data?.message || 'Error de autenticación. Verifica tus credenciales.';
      toast.error('Error de acceso', serverMessage);
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
