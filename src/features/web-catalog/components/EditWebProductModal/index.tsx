import React from 'react';
import { WebProduct } from '../../types/webCatalog.types';
import { useEditWebProductForm } from './useEditWebProductForm';
import { EditWebProductHeader } from './EditWebProductHeader';
import { EditWebProductImageUploader } from './EditWebProductImageUploader';
import { EditWebProductVisibilityToggle } from './EditWebProductVisibilityToggle';
import { EditWebProductCategorySelector } from './EditWebProductCategorySelector';
import { EditWebProductBadgeSelector } from './EditWebProductBadgeSelector';
import { EditWebProductPriceSection } from './EditWebProductPriceSection';
import { EditWebProductFooter } from './EditWebProductFooter';

export interface EditWebProductModalProps {
  product: WebProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<WebProduct>) => void;
}

export const EditWebProductModal: React.FC<EditWebProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
}) => {
  const { state, actions } = useEditWebProductForm(product, onSave, onClose);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <EditWebProductHeader
          productName={product.name}
          productBrand={product.brand}
          onClose={onClose}
        />

        {/* Form Body */}
        <form onSubmit={actions.handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Subida / Preview de Imagen */}
          <EditWebProductImageUploader
            imageUrl={state.imageUrl}
            onImageUrlChange={actions.setImageUrl}
            onFileUpload={actions.handleSimulateUpload}
          />

          {/* Switch de Visibilidad */}
          <EditWebProductVisibilityToggle
            isWebVisible={state.isWebVisible}
            onToggle={actions.setIsWebVisible}
          />

          {/* Selector de Categoría Web */}
          <EditWebProductCategorySelector
            webCategory={state.webCategory}
            onCategoryChange={actions.setWebCategory}
          />

          {/* Selector de Badge / Etiqueta */}
          <EditWebProductBadgeSelector
            webBadge={state.webBadge}
            onBadgeChange={actions.setWebBadge}
          />

          {/* Sección de Precios */}
          <EditWebProductPriceSection
            sellingPrice={product.sellingPrice}
            webPrice={state.webPrice}
            onPriceChange={actions.handlePriceChange}
          />

          {/* Footer de Acciones */}
          <EditWebProductFooter onCancel={onClose} />
        </form>
      </div>
    </div>
  );
};

export default EditWebProductModal;
