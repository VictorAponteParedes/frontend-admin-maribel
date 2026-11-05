import React from 'react';

interface CreateComboBasicInfoProps {
  title: string;
  onTitleChange: (value: string) => void;
  kicker: string;
  onKickerChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
}

export const CreateComboBasicInfo: React.FC<CreateComboBasicInfoProps> = ({
  title,
  onTitleChange,
  kicker,
  onKickerChange,
  description,
  onDescriptionChange,
}) => {
  const suggestions = ['★ FAVORITO BOUTIQUE', '🌸 EDICIÓN ESPECIAL', '✨ TENDENCIA LUXE'];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">
          Nombre del Combo *
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Ej. Duo Sensualité, Trio Árabe Imperial"
          className="w-full bg-stone-50/80 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 outline-none focus:bg-white focus:border-maribel-700 focus:ring-2 focus:ring-maribel-700/10 transition-all shadow-xs"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">
          Etiqueta / Kicker Superior
        </label>
        <input
          type="text"
          value={kicker}
          onChange={(e) => onKickerChange(e.target.value)}
          placeholder="Ej. ★ FAVORITO BOUTIQUE"
          className="w-full bg-stone-50/80 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 outline-none focus:bg-white focus:border-maribel-700 focus:ring-2 focus:ring-maribel-700/10 transition-all shadow-xs"
        />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {suggestions.map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => onKickerChange(sug)}
              className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors font-medium cursor-pointer"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">
          Descripción del Set (Opcional)
        </label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Ej. Incluye caja rígida de lujo con lazo satinado y tarjeta de dedicatoria de obsequio."
          className="w-full bg-stone-50/80 border border-stone-200 rounded-xl px-4 py-2 text-xs sm:text-sm text-stone-900 outline-none focus:bg-white focus:border-maribel-700 focus:ring-2 focus:ring-maribel-700/10 transition-all shadow-xs resize-none"
        />
      </div>
    </div>
  );
};
