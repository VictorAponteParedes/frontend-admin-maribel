import React from 'react';
import { ToggleSwitch } from '@/componentes';

interface CreateComboPublishToggleProps {
  isActive: boolean;
  onToggle: (checked: boolean) => void;
}

export const CreateComboPublishToggle: React.FC<CreateComboPublishToggleProps> = ({
  isActive,
  onToggle,
}) => {
  return (
    <div className="p-5 rounded-2xl border border-stone-200 bg-white flex items-center justify-between shadow-xs">
      <div>
        <span className="text-sm font-bold text-stone-900 block leading-tight">
          Publicar Combo en la Web
        </span>
        <span className="text-xs text-stone-500 mt-0.5 block">
          {isActive
            ? 'Visible inmediatamente en la sección de Sets & Regalos'
            : 'Permanecerá pausado hasta que lo actives'}
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <ToggleSwitch
          checked={isActive}
          onChange={onToggle}
          size="md"
          ariaLabel="Publicar combo en la web"
        />
        <span className={`text-xs font-bold ${isActive ? 'text-emerald-700' : 'text-stone-400'}`}>
          {isActive ? 'Activo en Web' : 'Pausado'}
        </span>
      </div>
    </div>
  );
};
