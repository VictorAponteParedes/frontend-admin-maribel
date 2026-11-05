import React from 'react';
import { useCreateComboForm } from './useCreateComboForm';
import { CreateComboModalHeader } from './CreateComboModalHeader';
import { CreateComboBasicInfo } from './CreateComboBasicInfo';
import { CreateComboImageUploader } from './CreateComboImageUploader';
import { CreateComboProductSelector } from './CreateComboProductSelector';
import { CreateComboPricingSection } from './CreateComboPricingSection';
import { CreateComboPublishToggle } from './CreateComboPublishToggle';
import { CreateComboModalFooter } from './CreateComboModalFooter';

export interface CreateComboModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateComboModal: React.FC<CreateComboModalProps> = ({ isOpen, onClose }) => {
  const { state, actions } = useCreateComboForm(onClose);

  if (!isOpen) return null;

  const isSubmitDisabled =
    state.selectedItems.length === 0 ||
    state.numericPromoPrice <= 0 ||
    !state.title.trim() ||
    state.isUploadingImage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 md:p-8 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">

        <CreateComboModalHeader onClose={onClose} />

        <form onSubmit={actions.handleSubmit} className="px-8 py-6 space-y-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <CreateComboBasicInfo
              title={state.title}
              onTitleChange={actions.setTitle}
              kicker={state.kicker}
              onKickerChange={actions.setKicker}
              description={state.description}
              onDescriptionChange={actions.setDescription}
            />

            <CreateComboImageUploader
              imageUrl={state.imageUrl}
              onImageUrlChange={actions.setImageUrl}
              onFileUpload={actions.handleImageUpload}
              isUploading={state.isUploadingImage}
            />
          </div>

          <CreateComboProductSelector
            products={state.filteredStock}
            selectedItems={state.selectedItems}
            searchProduct={state.searchProduct}
            onSearchChange={actions.setSearchProduct}
            onAddItem={actions.handleAddItem}
            onDecreaseQuantity={actions.handleDecreaseQuantity}
            onRemoveItem={actions.handleRemoveItem}
          />

          <CreateComboPricingSection
            normalSum={state.normalSum}
            promoPrice={state.promoPrice}
            onPriceChange={actions.handlePriceChange}
            numericPromoPrice={state.numericPromoPrice}
            calculatedSavings={state.calculatedSavings}
            discountPercent={state.discountPercent}
          />

          <CreateComboPublishToggle
            isActive={state.isActive}
            onToggle={actions.setIsActive}
          />

          <CreateComboModalFooter
            onCancel={onClose}
            isSubmitDisabled={isSubmitDisabled}
            isLoading={state.isSubmitting}
          />
        </form>
      </div>
    </div>
  );
};

export default CreateComboModal;
