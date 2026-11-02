import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight, Globe, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from '@/store/useToastStore';
import { Button, ControlledInput } from '@/components/ui';
import { RoutesView } from '@/navigation/routes';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { control, handleSubmit, setValue } = useForm<LoginFormData>({
    defaultValues: {
      email: 'maribel@gmail.com',
      password: 'Admin123.',
    },
    mode: 'onTouched',
  });

  const handleFillCredentials = () => {
    setValue('email', 'maribel@gmail.com', { shouldValidate: true });
    setValue('password', 'Admin123.', { shouldValidate: true });
    toast.info('Credenciales aplicadas', 'maribel@gmail.com / Admin123.');
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

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] relative flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
      {/* Patrón de puntos sutil en el fondo beige/crema */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: 'radial-gradient(#D3CABE 1.2px, transparent 1.2px)',
          backgroundSize: '22px 22px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[960px] bg-white rounded-[32px] shadow-2xl shadow-stone-900/10 border border-stone-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]"
      >
        {/* PANEL IZQUIERDO: Branding Luxury Maribel */}
        <div className="md:col-span-5 relative bg-gradient-to-b from-[#8B1229] via-[#6F0B1F] to-[#450412] p-8 lg:p-10 flex flex-col justify-between overflow-hidden text-white min-h-[420px] md:min-h-full">
          {/* Círculos decorativos de fondo con resplandor */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header Izquierdo: Logo y Título */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center p-1.5 shadow-md">
              <img
                src="/logo-maribel.png"
                alt="Maribel Haute Parfumerie"
                className="w-full h-full object-contain drop-shadow"
              />
            </div>
            <div>
              <h2 className="font-serif font-bold text-white tracking-[0.22em] text-sm leading-tight">
                MARIBEL
              </h2>
              <p className="text-[9px] font-medium tracking-[0.16em] text-rose-200/80 uppercase mt-0.5">
                BACKOFFICE • HAUTE PARFUMERIE
              </p>
            </div>
          </div>

          {/* Gráfico Central: Medallón de Lujo con Logo Oficial de Maribel */}
          <div className="relative z-10 my-auto py-8 flex items-center justify-center">
            {/* Anillos orbitales decorativos */}
            <div className="absolute w-64 h-64 rounded-full border border-white/10 pointer-events-none" />
            <div className="absolute w-52 h-52 rounded-full border border-rose-300/25 border-dashed pointer-events-none animate-[spin_60s_linear_infinite]" />

            {/* Chispas y destellos decorativos de alta perfumería */}
            <span className="absolute -top-1 right-10 text-rose-300/80 text-xs select-none">✦</span>
            <span className="absolute bottom-4 left-8 text-rose-300/60 text-[10px] select-none">✦</span>
            <span className="absolute top-8 left-6 w-1.5 h-1.5 rounded-full bg-rose-200/70" />
            <span className="absolute bottom-12 right-6 w-1.5 h-1.5 rounded-full bg-rose-200/70" />

            {/* Medallón Glassmorphism de Lujo con Logo 100% Redondo */}
            <div className="relative w-36 h-36 md:w-40 md:h-40 rounded-full border border-white/30 bg-gradient-to-b from-white/20 via-white/5 to-black/40 backdrop-blur-md p-2 flex items-center justify-center shadow-[0_0_50px_rgba(225,29,72,0.4)] group">
              {/* Anillo de resplandor interior */}
              <div className="absolute inset-1 rounded-full border border-rose-300/30 pointer-events-none" />

              {/* Contenedor del Logo perfectamente circular */}
              <div className="w-full h-full rounded-full overflow-hidden border border-white/30 shadow-2xl flex items-center justify-center bg-maribel-900">
                <img
                  src="/logo-maribel.png"
                  alt="Maribel Haute Parfumerie & Regalos"
                  className="w-full h-full object-cover rounded-full filter drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* Pie Izquierdo: Mensaje y Paginación */}
          <div className="relative z-10 space-y-3">
            <h1 className="text-2xl lg:text-3xl font-serif font-normal text-white tracking-tight leading-snug">
              ¡Bienvenida a la Maison!
            </h1>
            <p className="text-xs text-rose-100/75 leading-relaxed font-light max-w-sm">
              Plataforma integral de gestión de existencias, pedidos de regalos personalizados y ventas exclusivas de tienda.
            </p>

            {/* Indicadores de diapositivas */}
            <div className="flex items-center space-x-2 pt-2">
              <span className="w-6 h-1.5 bg-white rounded-full transition-all" />
              <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
              <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
            </div>
          </div>
        </div>

        {/* PANEL DERECHO: Formulario de Iniciar Sesión */}
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
                <button
                  type="button"
                  onClick={handleSupportClick}
                  className="font-semibold text-maribel-700 hover:text-maribel-800 transition-colors cursor-pointer"
                >
                  Solicitar credenciales a soporte
                </button>
              </div>
            </div>

            {/* Chip de prueba / Autocompletar rápido de credenciales */}
            <div className="mb-5 p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs text-stone-600">
              <div className="flex items-center gap-2 truncate">
                <Sparkles className="w-3.5 h-3.5 text-maribel-700 shrink-0" />
                <span className="text-[11px] truncate">
                  Demo: <strong className="text-stone-800">maribel@gmail.com</strong> / <strong className="text-stone-800">Admin123.</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={handleFillCredentials}
                className="text-[11px] font-semibold text-maribel-700 hover:text-maribel-800 hover:underline shrink-0 ml-2 cursor-pointer"
              >
                Autocompletar
              </button>
            </div>

            {/* Formulario conectado a React Hook Form */}
            <form onSubmit={handleSubmit(handleLoginSubmit)} className="space-y-4">
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
                onRightIconClick={() => setShowPassword((prev) => !prev)}
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
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-maribel-700 accent-maribel-700 focus:ring-maribel-600 border-stone-300 cursor-pointer"
                  />
                  <span className="font-medium text-stone-600 text-xs">Recordar sesión</span>
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-stone-500 hover:text-stone-800 font-medium transition-colors cursor-pointer text-xs"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Botón de Enviar */}
              <Button
                type="submit"
                disabled={isLoading}
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
              <button
                type="button"
                onClick={handleSupportClick}
                className="text-stone-500 hover:text-stone-700 transition-colors cursor-pointer"
              >
                Centro de Ayuda
              </button>
            </div>

            <span className="text-stone-400 font-normal">
              Maribel Backoffice v2.4
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;