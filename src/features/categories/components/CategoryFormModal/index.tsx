import React, { useState, useEffect } from 'react';
import { Category, CreateCategoryInput } from '../../types/category.types';
import { CategoryFormHeader } from './CategoryFormHeader';
import { CategoryFormFields } from './CategoryFormFields';
import { CategoryFormFooter } from './CategoryFormFooter';

export interface CategoryFormModalProps {
  isOpen: boolean;
  category: Category | null;
  onClose: () => void;
  onSave: (input: CreateCategoryInput, categoryId?: string) => Promise<boolean | Category | null | void> | void;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  category,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
      setDescription(category.description || '');
      setDisplayOrder(category.displayOrder);
      setIsActive(category.isActive);
    } else {
      setName('');
      setSlug('');
      setDescription('');
      setDisplayOrder(1);
      setIsActive(true);
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSave(
        {
          name: name.trim(),
          slug: slug.trim() || undefined,
          description: description.trim() || undefined,
          displayOrder,
          isActive,
        },
        category?.id
      );
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = !!category;
  const isSubmitDisabled = !name.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-stone-200 overflow-hidden">
        {/* Header */}
        <CategoryFormHeader isEditing={isEditing} onClose={onClose} />

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <CategoryFormFields
            name={name}
            onNameChange={setName}
            slug={slug}
            onSlugChange={setSlug}
            description={description}
            onDescriptionChange={setDescription}
            displayOrder={displayOrder}
            onDisplayOrderChange={setDisplayOrder}
            isActive={isActive}
            onIsActiveChange={setIsActive}
          />

          {/* Footer */}
          <CategoryFormFooter
            isEditing={isEditing}
            onCancel={onClose}
            disabled={isSubmitDisabled}
            isLoading={isSubmitting}
          />
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;
