import React from 'react';
import { ToggleSwitch } from '@/componentes';

interface EditWebProductVisibilityToggleProps {
  isWebVisible: boolean;
  onToggle: (checked: boolean) => void;
}

export const EditWebProductVisibilityToggle: React.FC<EditWebProductVisibilityToggleProps> = ({
  isWebVisible,
  onToggle,
}) => {
  return (
    <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 flex items-center justify-between">
      <div>
        <span className="text-xs font-bold text-stone-900 block leading-tight">
          Publicar en Tienda Online
        </span>
        <span className="text-[11px] text-stone-500">
          {isWebVisible
            ? 'Visible para los clientes en la web'
            : 'Solo visible en caja / tienda física'}
        </span>
      </div>

      <ToggleSwitch
        checked={isWebVisible}
        onChange={onToggle}
        size="md"
        ariaLabel="Publicar en tienda online"
      />
    </div>
  );
};
