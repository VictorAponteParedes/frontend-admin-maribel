import React from 'react';
import { Package, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { Product } from '../../types/product.types';

export interface ProductDetailModalHeaderProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModalHeader: React.FC<ProductDetailModalHeaderProps> = ({
  product,
  onClose,
}) => {
  return (
    <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50 shrink-0">
      <div className="flex items-center space-x-2.5">
        <div className="p-2 bg-maribel-100 text-maribel-800 rounded-xl">
          <Package className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-maribel-700 block">
            {product.brand}
          </span>
          <h3 className="font-serif font-bold text-stone-900 text-base leading-tight">
            {product.name}
          </h3>
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="xs"
        onClick={onClose}
        className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition-colors"
        aria-label="Cerrar modal"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};
