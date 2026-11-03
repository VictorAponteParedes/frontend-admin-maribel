import React from 'react';
import { motion } from 'framer-motion';
import { useLoginForm } from '../../hooks/useLoginForm';
import { LoginBrandingPanel } from '../../components/LoginBrandingPanel';
import { LoginFormCard } from '../../components/LoginFormCard';

export const LoginScreen: React.FC = () => {
  const {
    control,
    handleSubmit,
    isLoading,
    showPassword,
    rememberMe,
    setRememberMe,
    toggleShowPassword,
    actions,
  } = useLoginForm();

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
        initial={{ opacity: 0, x: -28 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 28 }}
        transition={{
          duration: 0.32,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative z-10 w-full max-w-[960px] bg-white rounded-[32px] shadow-2xl shadow-stone-900/10 border border-stone-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]"
      >
        <LoginBrandingPanel />

        <LoginFormCard
          control={control}
          isLoading={isLoading}
          showPassword={showPassword}
          rememberMe={rememberMe}
          onToggleShowPassword={toggleShowPassword}
          onToggleRememberMe={setRememberMe}
          onFillCredentials={actions.handleFillCredentials}
          onSupportClick={actions.handleSupportClick}
          onForgotPassword={actions.handleForgotPassword}
          onSubmit={handleSubmit(actions.handleLoginSubmit)}
        />
      </motion.div>
    </div>
  );
};

export default LoginScreen;
