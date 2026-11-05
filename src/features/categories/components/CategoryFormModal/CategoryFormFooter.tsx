import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui';

interface CategoryFormFooterProps {
  isEditing: boolean;
  onCancel: () => void;
  disabled: boolean;
  isLoading?: boolean;
}

export const CategoryFormFooter: React.FC<CategoryFormFooterProps> = ({
  isEditing,
  onCancel,
  disabled,
  isLoading = false,
}) => {
  return (
    <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2.5">
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
        disabled={disabled || isLoading}
        isLoading={isLoading}
        leftIcon={<Check className="w-4 h-4" />}
      >
        {isEditing ? 'Guardar Cambios' : 'Crear Categoría'}
      </Button>
    </div>
  );
};
