import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertTriangle, X, Info } from 'lucide-react';
import { ToastItem, ToastType } from '../types/toast';

interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

interface ToastVariantConfig {
  cardClasses: string;
  outerRingClasses: string;
  innerCircleClasses: string;
  icon: React.ReactNode;
}

const getVariantConfig = (type: ToastType): ToastVariantConfig => {
  switch (type) {
    case 'success':
      return {
        cardClasses:
          'bg-gradient-to-r from-[#172521] via-[#1a2124] to-[#1b2126] border-[#223b32]/80 shadow-[0_12px_32px_-4px_rgba(0,0,0,0.6),0_0_24px_-6px_rgba(16,185,129,0.2)]',
        outerRingClasses: 'bg-[#153e31]/70 ring-2 ring-[#00e599]/20',
        innerCircleClasses: 'bg-[#00df89] text-[#0d2e22]',
        icon: <Check className="w-4 h-4 stroke-[2.75]" />,
      };
    case 'warning':
      return {
        cardClasses:
          'bg-gradient-to-r from-[#272317] via-[#202123] to-[#1b2126] border-[#3d361f]/80 shadow-[0_12px_32px_-4px_rgba(0,0,0,0.6),0_0_24px_-6px_rgba(245,158,11,0.2)]',
        outerRingClasses: 'bg-[#3d331a]/70 ring-2 ring-[#fbbf24]/20',
        innerCircleClasses: 'bg-[#ffc226] text-[#2b2106]',
        icon: <AlertTriangle className="w-3.5 h-3.5 fill-current stroke-[1.5]" />,
      };
    case 'error':
      return {
        cardClasses:
          'bg-gradient-to-r from-[#2a1b1f] via-[#211f24] to-[#1b2126] border-[#44232a]/80 shadow-[0_12px_32px_-4px_rgba(0,0,0,0.6),0_0_24px_-6px_rgba(244,63,94,0.2)]',
        outerRingClasses: 'bg-[#401f27]/70 ring-2 ring-[#f43f5e]/20',
        innerCircleClasses: 'bg-[#fa4356] text-white',
        icon: <X className="w-3.5 h-3.5 stroke-[3]" />,
      };
    case 'info':
    default:
      return {
        cardClasses:
          'bg-gradient-to-r from-[#16212d] via-[#1a2027] to-[#1b2126] border-[#22354a]/80 shadow-[0_12px_32px_-4px_rgba(0,0,0,0.6),0_0_24px_-6px_rgba(56,189,248,0.2)]',
        outerRingClasses: 'bg-[#18344c]/70 ring-2 ring-[#38bdf8]/20',
        innerCircleClasses: 'bg-[#0ea5e9] text-white',
        icon: <Info className="w-4 h-4 stroke-[2.5]" />,
      };
  }
};

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingTimeRef = useRef<number>(toast.duration ?? 4500);
  const startTimeRef = useRef<number>(Date.now());

  const config = getVariantConfig(toast.type);

  // Iniciar auto-cierre si tiene duración mayor a 0
  useEffect(() => {
    if (!toast.duration || toast.duration <= 0) return;

    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      onDismiss(toast.id);
    }, remainingTimeRef.current);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.id, toast.duration, onDismiss]);

  const handleMouseEnter = () => {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
    const elapsed = Date.now() - startTimeRef.current;
    remainingTimeRef.current = Math.max(remainingTimeRef.current - elapsed, 1000);
  };

  const handleMouseLeave = () => {
    if (!toast.duration || toast.duration <= 0) return;
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      onDismiss(toast.id);
    }, remainingTimeRef.current);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="alert"
      className={`relative group flex items-start gap-3.5 p-4 rounded-2xl border backdrop-blur-md min-w-[320px] max-w-[420px] select-none pointer-events-auto transition-all ${config.cardClasses}`}
    >
      {/* Icono de doble círculo estilizado según la referencia */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${config.outerRingClasses}`}
      >
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center shadow-md ${config.innerCircleClasses}`}
        >
          {config.icon}
        </div>
      </div>

      {/* Contenido textual */}
      <div className="flex-1 pr-5 pt-0.5 min-w-0">
        <h4 className="text-[14.5px] font-semibold text-white tracking-tight leading-snug break-words">
          {toast.title}
        </h4>
        {toast.message && (
          <p className="text-[13px] text-gray-300/80 leading-relaxed mt-1 break-words">
            {toast.message}
          </p>
        )}

        {/* Botón de acción opcional */}
        {toast.action && (
          <div className="mt-2.5">
            <button
              type="button"
              onClick={() => {
                toast.action?.onClick();
                onDismiss(toast.id);
              }}
              className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              {toast.action.label}
            </button>
          </div>
        )}
      </div>

      {/* Botón de cierre manual */}
      {toast.dismissible && (
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          aria-label="Cerrar notificación"
          className="absolute top-3.5 right-3.5 p-1 rounded-lg text-gray-400/60 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </motion.div>
  );
};
