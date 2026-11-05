import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui';

interface EditWebProductFooterProps {
  onCancel: () => void;
  isLoading?: boolean;
}

export const EditWebProductFooter: React.FC<EditWebProductFooterProps> = ({
  onCancel,
  isLoading = false,
}) => {
  return (
    <div className="pt-4 border-t border-stone-100 flex justify-end gap-2">
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
        disabled={isLoading}
        isLoading={isLoading}
        leftIcon={<Check className="w-4 h-4" />}
      >
        Guardar Ficha Web
      </Button>
    </div>
  );
};
