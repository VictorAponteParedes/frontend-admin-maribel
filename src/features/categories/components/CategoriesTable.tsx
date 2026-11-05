import React from 'react';
import { Edit2, Trash2, Globe, Tag, Hash } from 'lucide-react';
import { Category } from '../types/category.types';
import { ToggleSwitch } from '@/componentes';

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onToggleActive: (id: string) => void;
  onDelete: (category: Category) => void;
}

export const CategoriesTable: React.FC<CategoriesTableProps> = ({
  categories,
  onEdit,
  onToggleActive,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50/70 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3.5 px-4 w-16 text-center">
                <span className="flex items-center justify-center gap-1">
                  <Hash className="w-3.5 h-3.5" />
                  <span>Orden</span>
                </span>
              </th>
              <th className="py-3.5 px-4">Categoría</th>
              <th className="py-3.5 px-4">Slug Web</th>
              <th className="py-3.5 px-4 text-center">Productos</th>
              <th className="py-3.5 px-4 text-center">Visible en Web</th>
              <th className="py-3.5 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-stone-50/60 transition-colors">
                {/* Posición / Orden */}
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-stone-100 text-stone-700 font-bold text-xs">
                    {cat.displayOrder}
                  </span>
                </td>

                {/* Nombre y Descripción */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-maribel-700 flex items-center justify-center flex-shrink-0">
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-stone-900 text-sm block">
                        {cat.name}
                      </span>
                      {cat.description && (
                        <span className="text-[11px] text-stone-400 line-clamp-1 max-w-md block">
                          {cat.description}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Slug Web */}
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-stone-600 font-mono text-[11px]">
                    <Globe className="w-3 h-3 text-stone-400" />
                    <span>/{cat.slug}</span>
                  </span>
                </td>

                {/* Contador de Productos */}
                <td className="py-3.5 px-4 text-center">
                  <span className="font-semibold text-stone-700 text-xs">
                    {cat.productCount ?? 0} fragancias
                  </span>
                </td>

                {/* Toggle Switch */}
                <td className="py-3.5 px-4 text-center">
                  <div className="inline-flex items-center gap-1.5" title={cat.isActive ? 'Activa en tienda online' : 'Oculta en tienda online'}>
                    <ToggleSwitch
                      checked={cat.isActive}
                      onChange={() => onToggleActive(cat.id)}
                      size="sm"
                      ariaLabel="Estado de categoría en web"
                    />
                    <span className={`text-[10px] font-bold ${cat.isActive ? 'text-emerald-700' : 'text-stone-400'}`}>
                      {cat.isActive ? 'Activa' : 'Off'}
                    </span>
                  </div>
                </td>

                {/* Acciones */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end space-x-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit(cat)}
                      className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                      title="Editar categoría"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(cat)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Eliminar categoría"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {categories.length === 0 && (
        <div className="py-12 text-center text-stone-400">
          <Tag className="w-8 h-8 text-stone-300 mx-auto mb-2" />
          <p className="font-medium text-xs text-stone-600">No hay categorías registradas</p>
          <p className="text-[11px] text-stone-400 mt-0.5">
            Haz clic en "Nueva Categoría" para crear la primera.
          </p>
        </div>
      )}
    </div>
  );
};
