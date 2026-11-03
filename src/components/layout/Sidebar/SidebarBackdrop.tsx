import React from 'react';
import { useTranslation } from '@/locale';

interface SidebarBackdropProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SidebarBackdrop: React.FC<SidebarBackdropProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={t('nav.closeMenu')}
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === 'Enter') onClose();
      }}
      className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
    />
  );
};
