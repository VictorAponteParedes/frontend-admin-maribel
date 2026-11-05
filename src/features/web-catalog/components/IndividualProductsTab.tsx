import React, { useState } from 'react';
import {
  Search,
  Globe,
  Edit3,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import { ToggleSwitch, CategorySelect } from '@/componentes';
import { resolveImageUrl } from '@/services/files.service';
import { useWebCatalogStore } from '../store/useWebCatalogStore';
import { WebProduct } from '../types/webCatalog.types';
import { EditWebProductModal } from './EditWebProductModal/index';

type VisibilityFilter = 'Todos' | 'Publicados' | 'Ocultos';

export const IndividualProductsTab: React.FC = () => {
  const products = useWebCatalogStore((state) => state.products);
  const toggleVisibility = useWebCatalogStore((state) => state.toggleProductVisibility);
  const updateProduct = useWebCatalogStore((state) => state.updateProduct);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('Todos');
  const [selectedProductToEdit, setSelectedProductToEdit] = useState<WebProduct | null>(null);

  const filtered = products.filter((prod) => {
    if (visibilityFilter === 'Publicados' && !prod.isWebVisible) return false;
    if (visibilityFilter === 'Ocultos' && prod.isWebVisible) return false;

    if (
      selectedCategory !== 'Todos' &&
      prod.webCategory.toLowerCase() !== selectedCategory.toLowerCase()
    ) {
      return false;
    }

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      prod.name.toLowerCase().includes(q) ||
      prod.brand.toLowerCase().includes(q) ||
      prod.barcode.includes(q)
    );
  });

  const publishedCount = products.filter((p) => p.isWebVisible).length;

  return (
    <div className="space-y-4">
      {/* Search, Category Dropdown & Status Filter */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
          {/* Buscador */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, marca o código..."
              className="w-full bg-white border border-stone-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-stone-800 outline-none focus:border-maribel-700 shadow-xs"
            />
          </div>

          {/* Selector Desplegable Reutilizable de Categorías (desde BD) */}
          <div className="min-w-[240px]">
            <CategorySelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              includeAllOption
              allOptionLabel="Todas las categorías"
              placeholder="Filtrar por categoría"
              size="sm"
            />
          </div>

          {/* Filtro rápido de Estado Web (Todos / Publicados / Ocultos) */}
          <div className="inline-flex items-center bg-stone-100/80 p-1 rounded-xl border border-stone-200/80 self-start sm:self-auto">
            {(['Todos', 'Publicados', 'Ocultos'] as VisibilityFilter[]).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setVisibilityFilter(status)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  visibilityFilter === status
                    ? 'bg-maribel-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Contador de visibles en web */}
        <div className="flex items-center gap-2 text-xs text-stone-500 shrink-0">
          <Globe className="w-4 h-4 text-emerald-600" />
          <span>
            <strong>{publishedCount}</strong> de {products.length} visibles en la web
          </span>
        </div>
      </div>

      {/* Chip informativo si hay una categoría activa */}
      {selectedCategory !== 'Todos' && (
        <div className="flex items-center gap-2 text-xs text-stone-600">
          <span>Filtrando por categoría:</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-maribel-800 font-semibold">
            <Tag className="w-3 h-3 text-maribel-700" />
            <span>{selectedCategory}</span>
            <button
              type="button"
              onClick={() => setSelectedCategory('Todos')}
              className="hover:text-maribel-950 cursor-pointer"
              title="Quitar filtro"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        </div>
      )}

      {/* Table of Products */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[10.5px]">
                <th className="py-3 px-4">Producto & Frasco</th>
                <th className="py-3 px-3">Stock Físico</th>
                <th className="py-3 px-3">Precio Tienda / Web</th>
                <th className="py-3 px-3">Categoría Web</th>
                <th className="py-3 px-3">Etiqueta</th>
                <th className="py-3 px-3 text-center">Publicado en Web</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-stone-50/60 transition-colors">
                  {/* Photo & Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => setSelectedProductToEdit(prod)}
                        className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden flex-shrink-0 cursor-pointer relative group"
                        title="Clic para cambiar foto"
                      >
                        <img
                          src={resolveImageUrl(prod.imageUrl)}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=80';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-stone-900 block truncate max-w-xs">
                          {prod.name}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          {prod.brand} · {prod.size}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Stock */}
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold text-[11px] ${
                        prod.stockQuantity > 5
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {prod.stockQuantity} un.
                    </span>
                  </td>

                  {/* Prices */}
                  <td className="py-3 px-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-stone-800">
                        Gs. {new Intl.NumberFormat('es-PY').format(prod.webPrice || prod.sellingPrice)}
                      </span>
                      {prod.webPrice && prod.webPrice !== prod.sellingPrice && (
                        <span className="text-[10px] text-stone-400 line-through">
                          Gs. {new Intl.NumberFormat('es-PY').format(prod.sellingPrice)}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Category Web */}
                  <td className="py-3 px-3">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 font-semibold text-[11px]">
                      {prod.webCategory}
                    </span>
                  </td>

                  {/* Badge */}
                  <td className="py-3 px-3">
                    {prod.webBadge && prod.webBadge !== 'Ninguno' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-maribel-700 text-[10.5px] font-bold">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>{prod.webBadge}</span>
                      </span>
                    ) : (
                      <span className="text-stone-300 text-[11px]">-</span>
                    )}
                  </td>

                  {/* Switch Directo en Tabla */}
                  <td className="py-3 px-3 text-center">
                    <div className="inline-flex items-center gap-1.5" title={prod.isWebVisible ? 'Publicado en la web' : 'Solo en inventario físico'}>
                      <ToggleSwitch
                        checked={prod.isWebVisible}
                        onChange={() => toggleVisibility(prod.id)}
                        size="sm"
                        ariaLabel="Publicar en tienda online"
                      />
                      <span className={`text-[10px] font-bold ${prod.isWebVisible ? 'text-emerald-700' : 'text-stone-400'}`}>
                        {prod.isWebVisible ? 'Web' : 'Off'}
                      </span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedProductToEdit(prod)}
                      className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-maribel-700 hover:border-maribel-300 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Editar ficha web"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-stone-400 text-xs">
            No se encontraron productos con ese filtro.
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <EditWebProductModal
        product={selectedProductToEdit}
        isOpen={!!selectedProductToEdit}
        onClose={() => setSelectedProductToEdit(null)}
        onSave={(id, data) => updateProduct(id, data)}
      />
    </div>
  );
};
