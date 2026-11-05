import React from 'react';
import { CategorySelect } from '@/componentes';
import { WebCategory } from '../../types/webCatalog.types';

export interface EditWebProductCategorySelectorProps {
  webCategory: WebCategory;
  onCategoryChange: (cat: WebCategory) => void;
}

export const EditWebProductCategorySelector: React.FC<EditWebProductCategorySelectorProps> = ({
  webCategory,
  onCategoryChange,
}) => {
  return (
    <CategorySelect
      label="Categoría Web"
      value={webCategory}
      onChange={onCategoryChange}
      placeholder="Seleccionar categoría de la base de datos"
      size="md"
    />
  );
};

