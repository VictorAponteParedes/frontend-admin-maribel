import React from 'react';
import { Save, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui';

interface SettingsFormActionsProps {
  isSubmitting: boolean;
}

export const SettingsFormActions: React.FC<SettingsFormActionsProps> = ({
  isSubmitting,
}) => {
  return (
    <div className="flex items-center justify-between pt-2">
      <div className="flex items-center space-x-2 text-xs text-stone-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Cambios guardados localmente y reflejados en tiempo real.</span>
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting}
        leftIcon={<Save className="w-4 h-4" />}
        className="px-5 py-2.5"
      >
        <span>Guardar y Publicar en Web</span>
      </Button>
    </div>
  );
};
