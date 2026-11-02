import React from 'react';
import { ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RoutesView } from '@/navigation/routes';

export interface SettingsPlaceholderScreenProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  bulletPoints?: string[];
}

export const SettingsPlaceholderScreen: React.FC<SettingsPlaceholderScreenProps> = ({
  title,
  description,
  icon: Icon,
  badge = 'En desarrollo',
  bulletPoints = [],
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-stone-500 mb-1">
            <span>Sistema</span>
            <span>/</span>
            <span>Configuración</span>
            <span>/</span>
            <span className="text-maribel-700 font-semibold">{title}</span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-stone-900 tracking-tight flex items-center gap-2">
            {title}
          </h1>
          <p className="text-xs text-stone-500 mt-1">{description}</p>
        </div>

        <button
          type="button"
          onClick={() => navigate(RoutesView.SETTINGS_STORE)}
          className="inline-flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 rounded-xl transition-colors shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Ir a Datos de la Tienda</span>
        </button>
      </div>

      {/* Placeholder Card */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-10 text-center shadow-xs space-y-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-maribel-700 shadow-2xs">
          <Icon className="w-8 h-8" />
        </div>

        <div className="max-w-md mx-auto space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span>{badge}</span>
          </div>
          <h3 className="text-lg font-bold text-stone-900 font-serif">
            Módulo {title}
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Esta vista independiente está preparada para su configuración detallada en las siguientes fases del sistema.
          </p>
        </div>

        {bulletPoints.length > 0 && (
          <div className="max-w-md mx-auto bg-stone-50 border border-stone-200/70 rounded-xl p-4 text-left space-y-2">
            <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-maribel-700" />
              Características planificadas:
            </span>
            <ul className="space-y-1.5 text-xs text-stone-600">
              {bulletPoints.map((point, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-maribel-600 font-bold">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
