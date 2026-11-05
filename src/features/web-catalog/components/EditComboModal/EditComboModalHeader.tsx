import React from 'react';
import { Edit3, X } from 'lucide-react';
import { Button } from '@/components/ui';

export interface EditComboModalHeaderProps {
  comboTitle?: string;
  onClose: () => void;
}

export const EditComboModalHeader: React.FC<EditComboModalHeaderProps> = ({
  comboTitle,
  onClose,
}) => {
  return (
    <div className="px-8 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70 flex-shrink-0">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-maribel-700 flex items-center justify-center shadow-xs border border-rose-100">
          <Edit3 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-stone-900 text-lg leading-tight">
            Editar Combo Promocional
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {comboTitle ? `Modificando: "${comboTitle}"` : 'Ajusta los productos, el precio o la visibilidad del set.'}
          </p>
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="xs"
        onClick={onClose}
        className="p-2 text-stone-400 hover:text-stone-700 rounded-xl"
        aria-label="Cerrar modal"
      >
        <X className="w-5 h-5" />
      </Button>
    </div>
  );
};
