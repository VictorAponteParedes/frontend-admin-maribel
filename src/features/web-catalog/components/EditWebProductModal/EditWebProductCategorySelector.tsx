import React from 'react';
import { WebCategory } from '../../types/webCatalog.types';

interface EditWebProductCategorySelectorProps {
  webCategory: WebCategory;
  onCategoryChange: (cat: WebCategory) => void;
}

export const EditWebProductCategorySelector: React.FC<EditWebProductCategorySelectorProps> = ({
  webCategory,
  onCategoryChange,
}) => {
  const categories: WebCategory[] = ['Femenino', 'Masculino', 'Árabe', 'Unisex'];

  return (
    <div>
      <label className="block text-xs font-semibold text-stone-700 mb-1">
        Categoría Web
      </label>
      <div className="grid grid-cols-4 gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat)}
            className={`py-2 px-1 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
              webCategory === cat
                ? 'border-maribel-700 bg-maribel-50 text-maribel-800'
                : 'border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
