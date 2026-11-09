import React, { useState } from 'react';
import { Gift, Plus, Trash2, Sparkles, CheckCircle2, Loader2, Edit3 } from 'lucide-react';
import { useWebCatalogStore } from '../store/useWebCatalogStore';
import { WebCombo } from '../types/webCatalog.types';
import { Button } from '@/components/ui';
import { ToggleSwitch, ConfirmModal, Can } from '@/componentes';
import { resolveImageUrl } from '@/services/files.service';
import { CreateComboModal } from './CreateComboModal/index';
import { EditComboModal } from './EditComboModal/index';

export const CombosCreatorTab: React.FC = () => {
  const combos = useWebCatalogStore((state) => state.combos);
  const isLoading = useWebCatalogStore((state) => state.isLoading);
  const toggleActive = useWebCatalogStore((state) => state.toggleComboActive);
  const deleteCombo = useWebCatalogStore((state) => state.deleteCombo);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [comboToEdit, setComboToEdit] = useState<WebCombo | null>(null);
  const [comboToDelete, setComboToDelete] = useState<WebCombo | null>(null);

  const activeCombosCount = combos.filter((c) => c.isActive).length;
  const totalSavings = combos.reduce((sum, c) => sum + c.savingsAmount, 0);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-500 font-medium">Combos Activos en Web</span>
            <div className="font-serif font-bold text-2xl text-stone-900 mt-1">
              {activeCombosCount} <span className="text-xs text-stone-400 font-sans font-normal">de {combos.length}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-maribel-700 flex items-center justify-center">
            <Gift className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-500 font-medium">Ahorro Promocional Promedio</span>
            <div className="font-serif font-bold text-2xl text-emerald-700 mt-1">
              Gs. {combos.length > 0 ? new Intl.NumberFormat('es-PY').format(Math.round(totalSavings / combos.length)) : 0}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-500 font-medium">Descuento de Stock</span>
            <div className="font-bold text-sm text-stone-800 mt-1">
              Atómico por producto
            </div>
            <span className="text-[11px] text-stone-400">Descuenta de inventario físico</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h3 className="font-serif font-bold text-base text-stone-900">
            Listado de Combos & Sets de Regalo
          </h3>
          <p className="text-xs text-stone-500">
            Los combos activos se publican directamente en la sección "Regalos" de la tienda online
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Crear Nuevo Combo
        </Button>
      </div>

      {/* Grid of Combos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {combos.map((combo) => (
          <div
            key={combo.id}
            className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col shadow-xs ${
              combo.isActive ? 'border-stone-200/90 hover:shadow-md' : 'border-dashed border-stone-300 opacity-70'
            }`}
          >
            {/* Combo Image with Badges */}
            <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
              <img
                src={resolveImageUrl(combo.imageUrl)}
                alt={combo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs text-[#9a3412] text-[10.5px] font-bold px-2.5 py-0.5 rounded-md shadow-xs border border-orange-200">
                {combo.discountBadge}
              </div>
              <div className="absolute bottom-2.5 right-2.5 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                {combo.fragranceCountLabel}
              </div>
            </div>

            {/* Details */}
            <div className="p-4 flex-1 flex flex-col">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#9b7036] mb-0.5">
                {combo.kicker}
              </span>
              <h4 className="font-serif font-bold text-base text-stone-900 leading-snug">
                {combo.title}
              </h4>
              <p className="text-stone-500 text-xs leading-relaxed mt-1 line-clamp-2">
                {combo.description}
              </p>

              {/* Perfumes incluidos */}
              <div className="mt-3 pt-3 border-t border-stone-100 space-y-1">
                <span className="text-[10.5px] font-bold text-stone-400 uppercase tracking-wider block">
                  Contenido ({combo.items.length}):
                </span>
                <ul className="space-y-0.5">
                  {combo.items.map((i) => (
                    <li key={i.productId} className="text-[11px] text-stone-600 flex items-center justify-between">
                      <span className="truncate max-w-[200px]">
                        • {i.productName}
                      </span>
                      <span className="text-stone-400">
                        Gs. {new Intl.NumberFormat('es-PY').format(i.originalPrice)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Row & Controls */}
              <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-stone-400 line-through block">
                    Gs. {new Intl.NumberFormat('es-PY').format(combo.originalPrice)}
                  </span>
                  <span className="font-serif font-bold text-base text-maribel-700">
                    Gs. {new Intl.NumberFormat('es-PY').format(combo.price)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Switch Activo en Web Tradicional */}
                  <div className="flex items-center gap-1.5" title={combo.isActive ? 'Activo en web' : 'Pausado'}>
                    <ToggleSwitch
                      checked={combo.isActive}
                      onChange={() => toggleActive(combo.id)}
                      size="md"
                      ariaLabel="Activar combo en web"
                    />
                    <span className={`text-[11px] font-bold ${combo.isActive ? 'text-emerald-700' : 'text-stone-400'}`}>
                      {combo.isActive ? 'Web' : 'Off'}
                    </span>
                  </div>

                  {/* Botón Editar Combo */}
                  <button
                    type="button"
                    onClick={() => setComboToEdit(combo)}
                    className="p-1.5 text-stone-400 hover:text-maribel-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Editar combo"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <Can role="ADMIN">
                    <button
                      type="button"
                      onClick={() => setComboToDelete(combo)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                      title="Eliminar combo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Can>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isLoading && combos.length === 0 && (
        <div className="py-16 text-center text-maribel-700 bg-white rounded-2xl border border-stone-200">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="font-serif text-sm font-semibold">Cargando combos promocionales...</p>
        </div>
      )}

      {!isLoading && combos.length === 0 && (
        <div className="py-16 text-center text-stone-400 bg-white rounded-2xl border border-dashed border-stone-200">
          <Gift className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <p className="font-serif text-sm text-stone-700">Aún no tienes combos creados</p>
          <p className="text-xs text-stone-400 mt-1">Haz clic en "Crear Nuevo Combo" para armar tu primer paquete.</p>
        </div>
      )}

      {/* Modals */}
      <CreateComboModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditComboModal
        combo={comboToEdit}
        isOpen={!!comboToEdit}
        onClose={() => setComboToEdit(null)}
      />

      {/* Modal de Confirmación de Eliminación */}
      <ConfirmModal
        isOpen={!!comboToDelete}
        onClose={() => setComboToDelete(null)}
        onConfirm={() => {
          if (comboToDelete) {
            deleteCombo(comboToDelete.id);
            setComboToDelete(null);
          }
        }}
        title="¿Eliminar combo promocional?"
        itemTitle={comboToDelete?.title}
        description="Esta acción eliminará el combo y dejará de exhibirse en la tienda online. No afecta el inventario de las fragancias individuales."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
};
