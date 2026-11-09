import { useState, useEffect } from 'react';
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
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
  });

  const { control, handleSubmit, reset } = form;

  // Garantizar que los campos arranquen 100% vacíos sin precargas residuales
  useEffect(() => {
    reset({
      email: '',
      password: '',
    });
    setRememberMe(false);
  }, [reset]);

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

      login(response.user, response.token, response.refreshToken);

      toast.success('¡Bienvenido!', 'Sesión iniciada correctamente.');
      navigate(RoutesView.DASHBOARD);
    } catch (error: any) {
      const serverMessage =
        error?.response?.data?.message || 'Error de autenticación. Verifica tus credenciales.';
      toast.error('Acceso denegado', serverMessage);
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
      handleSupportClick,
      handleForgotPassword,
      handleLoginSubmit,
    },
  };
};
