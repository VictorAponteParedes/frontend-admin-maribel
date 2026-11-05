import React from 'react';
import { Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui';

interface EditWebProductHeaderProps {
  productName: string;
  productBrand: string;
  onClose: () => void;
}

export const EditWebProductHeader: React.FC<EditWebProductHeaderProps> = ({
  productName,
  productBrand,
  onClose,
}) => {
  return (
    <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
      <div className="flex items-center space-x-2.5">
        <div className="w-8 h-8 rounded-lg bg-rose-50 text-maribel-700 flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-stone-900 text-base leading-tight">
            Ficha Web del Producto
          </h3>
          <p className="text-[11px] text-stone-500 truncate max-w-xs">
            {productName} ({productBrand})
          </p>
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="xs"
        onClick={onClose}
        className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg"
        aria-label="Cerrar modal"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};
