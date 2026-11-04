import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  Filter,
  RotateCcw,
  User,
  Phone,
  Calendar,
  Hash,
  Check,
} from 'lucide-react';
import { Button, AppInput, DatePickerInput } from '@/components/ui';

export interface CustomerFiltersState {
  code: string;
  name: string;
  phone: string;
  startDate: string;
  endDate: string;
}

export interface CustomerFilterDrawerProps {
  isOpen: boolean;
  filters: CustomerFiltersState;
  onClose: () => void;
  onChangeFilter: (key: keyof CustomerFiltersState, value: string) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
  totalResultsCount: number;
}

export const CustomerFilterDrawer: React.FC<CustomerFilterDrawerProps> = ({
  isOpen,
  filters,
  onClose,
  onChangeFilter,
  onResetFilters,
  onApplyFilters,
  totalResultsCount,
}) => {
  const hasActiveFilters = Object.values(filters).some((val) => Boolean(val && val.trim()));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Fondo oscuro con fade animado */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs"
            onClick={onClose}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
            {/* Panel lateral con slide fluido de entrada y salida */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'spring',
                damping: 32,
                stiffness: 340,
                mass: 0.8,
              }}
              className="pointer-events-auto w-screen max-w-md bg-white shadow-2xl border-l border-stone-200 flex flex-col justify-between"
            >
              {/* Cabecera del Drawer */}
              <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-maribel-50 border border-maribel-100 flex items-center justify-center text-maribel-700">
                    <Filter className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-stone-900">
                      Filtros Avanzados
                    </h3>
                    <p className="text-xs text-stone-500">
                      Filtra la lista de clientes desde la base de datos
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition-colors"
                  aria-label="Cerrar panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Formulario de Campos */}
              <div className="p-6 space-y-5 overflow-y-auto overflow-x-hidden flex-1">
                {/* Filtro por Código */}
                <AppInput
                  label="Código de Cliente"
                  type="number"
                  value={filters.code}
                  onChange={(e) => onChangeFilter('code', e.target.value)}
                  placeholder="Ej: 1, 15..."
                  leftIcon={<Hash className="w-4 h-4" />}
                  className="font-mono"
                />

                {/* Filtro por Nombre */}
                <AppInput
                  label="Nombre o Apellido"
                  type="text"
                  value={filters.name}
                  onChange={(e) => onChangeFilter('name', e.target.value)}
                  placeholder="Ej: Claudia, Marlene..."
                  leftIcon={<User className="w-4 h-4" />}
                />

                {/* Filtro por Teléfono */}
                <AppInput
                  label="Número de Teléfono"
                  type="tel"
                  value={filters.phone}
                  onChange={(e) => onChangeFilter('phone', e.target.value)}
                  placeholder="Ej: 0981, 0982..."
                  leftIcon={<Phone className="w-4 h-4" />}
                  className="font-mono"
                />

                {/* Sección de Rango de Fechas: Desde - Hasta */}
                <div className="pt-2 border-t border-stone-100 space-y-3">
                  <div className="flex items-center space-x-1.5 text-stone-700">
                    <Calendar className="w-4 h-4 text-maribel-700" />
                    <span className="text-xs font-semibold">
                      Rango de Fecha de Registro
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 -mt-1">
                    Filtra clientes dados de alta dentro de un período específico.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <DatePickerInput
                      label="Fecha Desde"
                      value={filters.startDate}
                      onChange={(val) => onChangeFilter('startDate', val)}
                      placeholder="DD/MM/AAAA"
                      allowClear
                      align="left"
                    />

                    <DatePickerInput
                      label="Fecha Hasta"
                      value={filters.endDate}
                      onChange={(val) => onChangeFilter('endDate', val)}
                      placeholder="DD/MM/AAAA"
                      allowClear
                      align="right"
                    />
                  </div>
                </div>
              </div>

              {/* Pie de Acciones */}
              <div className="p-6 border-t border-stone-100 bg-stone-50/60 space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500 pb-1">
                  <span>Coincidencias encontradas:</span>
                  <span className="font-semibold text-stone-900">
                    {totalResultsCount} {totalResultsCount === 1 ? 'cliente' : 'clientes'}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1 text-stone-600 hover:text-stone-800"
                    disabled={!hasActiveFilters}
                    onClick={onResetFilters}
                    leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                  >
                    Limpiar
                  </Button>

                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={onApplyFilters}
                    leftIcon={<Check className="w-4 h-4" />}
                  >
                    Aplicar
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
