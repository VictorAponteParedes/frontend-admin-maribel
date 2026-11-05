import React from 'react';
import { Tag } from 'lucide-react';
import { WebBadge } from '../../types/webCatalog.types';

interface EditWebProductBadgeSelectorProps {
  webBadge: WebBadge;
  onBadgeChange: (badge: WebBadge) => void;
}

export const EditWebProductBadgeSelector: React.FC<EditWebProductBadgeSelectorProps> = ({
  webBadge,
  onBadgeChange,
}) => {
  const badges: WebBadge[] = ['Ninguno', 'Más Vendido', 'Tendencia', 'Exclusivo', 'Favorito'];

  return (
    <div>
      <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
        <Tag className="w-3.5 h-3.5 text-amber-600" />
        <span>Etiqueta Destacada (Opcional)</span>
      </label>
      <select
        value={webBadge}
        onChange={(e) => onBadgeChange(e.target.value as WebBadge)}
        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 outline-none focus:bg-white focus:border-maribel-700 cursor-pointer"
      >
        {badges.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>
    </div>
  );
};
