import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui';

interface CreateComboModalFooterProps {
  onCancel: () => void;
  isSubmitDisabled: boolean;
  isLoading?: boolean;
}

export const CreateComboModalFooter: React.FC<CreateComboModalFooterProps> = ({
  onCancel,
  isSubmitDisabled,
  isLoading = false,
}) => {
  return (
    <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3 flex-shrink-0">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        variant="primary"
        size="sm"
        disabled={isSubmitDisabled || isLoading}
        isLoading={isLoading}
        leftIcon={<Check className="w-4 h-4" />}
      >
        Guardar Combo en Catálogo
      </Button>
    </div>
  );
};
