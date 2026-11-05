import React, { useState, useRef, useEffect } from 'react';
import { Tag, ChevronDown, Check, Loader2, Search, X } from 'lucide-react';
import { useCategoriesStore } from '@/features/categories/store/useCategoriesStore';

export interface CategorySelectProps {
  value: string;
  onChange: (categoryName: string) => void;
  placeholder?: string;
  label?: string;
  includeAllOption?: boolean;
  allOptionLabel?: string;
  size?: 'sm' | 'md';
  className?: string;
  disabled?: boolean;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onChange,
  placeholder = 'Seleccionar categoría',
  label,
  includeAllOption = false,
  allOptionLabel = 'Todas las categorías',
  size = 'md',
  className = '',
  disabled = false,
}) => {
  const categories = useCategoriesStore((state) => state.categories);
  const isLoading = useCategoriesStore((state) => state.isLoading);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const isAllSelected = includeAllOption && (value === 'Todos' || value === '' || !value);

  const filteredCategories = categories.filter((cat) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      cat.name.toLowerCase().includes(q) ||
      cat.slug.toLowerCase().includes(q) ||
      (cat.description && cat.description.toLowerCase().includes(q))
    );
  });

  const isSmall = size === 'sm';

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-stone-700 mb-1.5">
          {label}
        </label>
      )}

      {/* Botón trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2.5 rounded-xl border transition-all text-left cursor-pointer ${
          isSmall ? 'px-3 py-1.5 text-xs' : 'px-3.5 py-2.5 text-xs'
        } ${
          isOpen
            ? 'border-maribel-700 ring-2 ring-maribel-700/10 bg-white shadow-xs'
            : value && !isAllSelected
              ? 'border-maribel-300 bg-rose-50/60 text-maribel-900'
              : 'border-stone-200 bg-stone-50/70 hover:bg-white hover:border-stone-300 text-stone-700'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`rounded-lg flex items-center justify-center shrink-0 ${
              isSmall ? 'w-5 h-5' : 'w-6 h-6'
            } ${
              value && !isAllSelected
                ? 'bg-maribel-700 text-white'
                : 'bg-stone-200/70 text-stone-600'
            }`}
          >
            {isLoading ? (
              <Loader2 className={`${isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} animate-spin`} />
            ) : (
              <Tag className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
            )}
          </div>
          <span className="font-bold truncate block">
            {isAllSelected
              ? `${allOptionLabel} (${categories.length})`
              : value || placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {includeAllOption && !isAllSelected && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onChange('Todos');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  onChange('Todos');
                }
              }}
              className="p-0.5 rounded-md hover:bg-rose-200/60 text-maribel-700 transition-colors"
              title="Limpiar categoría"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`text-stone-400 transition-transform duration-200 ${
              isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'
            } ${isOpen ? 'rotate-180 text-maribel-700' : ''}`}
          />
        </div>
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 min-w-[220px]">
          {/* Buscador dentro del dropdown si hay varias categorías */}
          {categories.length > 4 && (
            <div className="p-2 border-b border-stone-100 bg-stone-50/60">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar categoría..."
                  className="w-full bg-white border border-stone-200 rounded-lg pl-8 pr-2.5 py-1 text-xs text-stone-800 outline-none focus:border-maribel-700"
                />
              </div>
            </div>
          )}

          <div className="max-h-56 overflow-y-auto divide-y divide-stone-100 p-1">
            {includeAllOption && (
              <button
                type="button"
                onClick={() => {
                  onChange('Todos');
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer text-xs ${
                  isAllSelected
                    ? 'bg-rose-50/90 text-maribel-800 font-bold'
                    : 'hover:bg-stone-50 text-stone-700 font-medium'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                      isAllSelected
                        ? 'bg-maribel-700 text-white'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    <Tag className="w-3 h-3" />
                  </div>
                  <span className="truncate">{allOptionLabel}</span>
                </div>
                {isAllSelected && <Check className="w-3.5 h-3.5 text-maribel-700 shrink-0" />}
              </button>
            )}

            {filteredCategories.map((cat) => {
              const isSelected =
                !isAllSelected &&
                (value || '').toLowerCase() === cat.name.toLowerCase();

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onChange(cat.name);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-rose-50/90 text-maribel-800 font-bold'
                      : 'hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-maribel-700 text-white'
                          : 'bg-rose-50 text-maribel-700'
                      }`}
                    >
                      <Tag className="w-3 h-3" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate">{cat.name}</span>
                        {!cat.isActive && (
                          <span className="text-[9px] px-1 rounded bg-stone-100 text-stone-500">
                            Inactiva
                          </span>
                        )}
                      </div>
                      {cat.description && (
                        <span className="text-[10px] text-stone-400 block truncate">
                          {cat.description}
                        </span>
                      )}
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-maribel-700 shrink-0" />}
                </button>
              );
            })}

            {filteredCategories.length === 0 && !isLoading && (
              <div className="py-4 px-3 text-center text-xs text-stone-400">
                No hay categorías disponibles.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
