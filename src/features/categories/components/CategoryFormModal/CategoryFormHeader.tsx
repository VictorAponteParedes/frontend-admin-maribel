import React from 'react';
import { Tags, X } from 'lucide-react';
import { Button } from '@/components/ui';

interface CategoryFormHeaderProps {
  isEditing: boolean;
  onClose: () => void;
}

export const CategoryFormHeader: React.FC<CategoryFormHeaderProps> = ({
  isEditing,
  onClose,
}) => {
  return (
    <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
      <div className="flex items-center space-x-2.5">
        <div className="w-8 h-8 rounded-lg bg-rose-50 text-maribel-700 flex items-center justify-center">
          <Tags className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-stone-900 text-base leading-tight">
            {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
          </h3>
          <p className="text-[11px] text-stone-500">
            {isEditing
              ? 'Actualiza el nombre, slug o estado para la tienda online'
              : 'Define una nueva categoría para organizar tus fragancias'}
          </p>
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="xs"
        onClick={onClose}
        className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
        aria-label="Cerrar modal"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};
