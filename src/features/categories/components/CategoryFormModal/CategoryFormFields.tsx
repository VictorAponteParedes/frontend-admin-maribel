import React from 'react';
import { ToggleSwitch } from '@/componentes';

interface CategoryFormFieldsProps {
  name: string;
  onNameChange: (val: string) => void;
  slug: string;
  onSlugChange: (val: string) => void;
  description: string;
  onDescriptionChange: (val: string) => void;
  displayOrder: number;
  onDisplayOrderChange: (val: number) => void;
  isActive: boolean;
  onIsActiveChange: (val: boolean) => void;
}

export const CategoryFormFields: React.FC<CategoryFormFieldsProps> = ({
  name,
  onNameChange,
  slug,
  onSlugChange,
  description,
  onDescriptionChange,
  displayOrder,
  onDisplayOrderChange,
  isActive,
  onIsActiveChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Nombre */}
      <div>
        <label className="block text-xs font-bold text-stone-700 mb-1">
          Nombre de la Categoría *
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Ej. Femenino, Árabe, Decants, Infantil"
          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-900 outline-none focus:bg-white focus:border-maribel-700 shadow-xs"
        />
      </div>

      {/* Slug y Orden */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Slug URL (Opcional)
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            placeholder="ej. femenino, arabe-lujo"
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 outline-none focus:bg-white focus:border-maribel-700 shadow-xs"
          />
          <span className="text-[10.5px] text-stone-400 mt-0.5 block">
            Se genera automáticamente si lo dejas vacío.
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Orden de Visualización
          </label>
          <input
            type="number"
            min={1}
            value={displayOrder}
            onChange={(e) => onDisplayOrderChange(Number(e.target.value) || 1)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 outline-none focus:bg-white focus:border-maribel-700 shadow-xs"
          />
          <span className="text-[10.5px] text-stone-400 mt-0.5 block">
            Posición en el menú web (1 = primero).
          </span>
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1">
          Descripción (Opcional)
        </label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Breve reseña del estilo de fragancias que abarca esta categoría..."
          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 outline-none focus:bg-white focus:border-maribel-700 shadow-xs resize-none"
        />
      </div>

      {/* Toggle Activo */}
      <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-stone-900 block leading-tight">
            Categoría Activa en la Web
          </span>
          <span className="text-[11px] text-stone-500">
            {isActive ? 'Visible para los clientes en la tienda online' : 'Oculta en la web'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ToggleSwitch
            checked={isActive}
            onChange={onIsActiveChange}
            size="md"
            ariaLabel="Activar categoría en web"
          />
          <span className={`text-[11px] font-bold ${isActive ? 'text-emerald-700' : 'text-stone-400'}`}>
            {isActive ? 'Activa' : 'Off'}
          </span>
        </div>
      </div>
    </div>
  );
};
