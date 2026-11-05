import React from 'react';
import { Gift, X } from 'lucide-react';
import { Button } from '@/components/ui';

interface CreateComboModalHeaderProps {
  onClose: () => void;
}

export const CreateComboModalHeader: React.FC<CreateComboModalHeaderProps> = ({ onClose }) => {
  return (
    <div className="px-8 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70 flex-shrink-0">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-xs">
          <Gift className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-stone-900 text-lg leading-tight">
            Creador de Combos & Sets de Regalo
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Arma paquetes promocionales con cálculo automático de existencias físicas y ahorro al cliente.
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
