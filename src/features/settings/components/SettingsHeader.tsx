import React from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui';

interface SettingsHeaderProps {
  onReset: () => void;
  onSubmit: () => void;
  isDirty: boolean;
  isSubmitting: boolean;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  onReset,
  onSubmit,
  isDirty,
  isSubmitting,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center space-x-2 text-xs text-stone-500 mb-1">
          <span>Sistema</span>
          <span>/</span>
          <span>Configuración</span>
          <span>/</span>
          <span className="text-maribel-700 font-semibold">Datos de la Tienda (Web)</span>
        </div>
        <h1 className="text-2xl font-bold font-serif text-stone-900 tracking-tight flex items-center gap-2">
          Datos de la Tienda & Footer Web
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Personaliza la información institucional, redes sociales, horarios y contacto que verán tus clientes en la página web.
        </p>
      </div>

      {/* Global Action Buttons */}
      <div className="flex items-center space-x-3">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onReset}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          <span>Restablecer todo</span>
        </Button>

        <Button
          type="button"
          variant={isDirty ? 'primary' : 'secondary'}
          size="sm"
          onClick={onSubmit}
          disabled={isSubmitting}
          leftIcon={<Save className="w-4 h-4" />}
          className={!isDirty ? '!bg-stone-800 !text-white hover:!bg-stone-900' : ''}
        >
          <span>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</span>
        </Button>
      </div>
    </div>
  );
};
