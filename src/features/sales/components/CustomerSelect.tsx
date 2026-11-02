import React, { useState, useRef, useEffect } from 'react';
import { Customer } from '@/features/customers/types/customer.types';
import { useTranslation } from '@/locale';
import { Search, ChevronDown, Check, Phone, MapPin, UserCheck } from 'lucide-react';

export interface CustomerSelectProps {
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer) => void;
  customers: Customer[];
  label?: string;
}

export const CustomerSelect: React.FC<CustomerSelectProps> = ({
  selectedCustomer,
  onSelectCustomer,
  customers,
  label,
}) => {
  const { t } = useTranslation(['sales', 'translation']);
  const displayLabel = label ?? t('form.customerLabel');

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus search input on open
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q) ||
      String(c.code).includes(q)
    );
  });

  const getInitials = (name: string): string => {
    if (!name || name === 'Cliente casual' || name === t('customerSelect.casualCustomer')) return 'CC';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const isCasual =
    !selectedCustomer ||
    selectedCustomer.name === 'Cliente casual' ||
    selectedCustomer.name === t('customerSelect.casualCustomer');

  return (
    <div ref={dropdownRef} className="relative w-full">
      {displayLabel && (
        <label className="block text-xs font-semibold text-stone-700 mb-1.5">
          {displayLabel}
        </label>
      )}

      {/* Botón trigger elegante con Nombre + Teléfono concatenados */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between ${
          isOpen
            ? 'border-maribel-600 ring-2 ring-maribel-600/10 bg-white shadow-xs'
            : 'border-stone-200 bg-stone-50 hover:bg-white hover:border-stone-300'
        }`}
      >
        <div className="flex items-center space-x-3 min-w-0 pr-2">
          {isCasual ? (
            <div className="w-10 h-10 rounded-xl bg-stone-200 text-stone-600 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-maribel-800 font-bold text-xs flex items-center justify-center shrink-0 border border-rose-200/80">
              {getInitials(selectedCustomer.name)}
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 flex-wrap">
              <span className="text-xs font-bold text-stone-900 truncate">
                {selectedCustomer ? selectedCustomer.name : t('customerSelect.casualCustomerCounter')}
              </span>
              {selectedCustomer &&
                selectedCustomer.phone &&
                selectedCustomer.phone !== 'Sin teléfono' &&
                selectedCustomer.phone !== t('customerSelect.noPhone') && (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <Phone className="w-2.5 h-2.5 text-emerald-600" />
                    <span>{selectedCustomer.phone}</span>
                  </span>
                )}
            </div>

            <p className="text-[11px] text-stone-400 truncate mt-0.5 flex items-center space-x-1">
              {selectedCustomer && selectedCustomer.address ? (
                <>
                  <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                  <span className="truncate">{selectedCustomer.address}</span>
                </>
              ) : (
                <span>{t('customerSelect.casualCustomerDesc')}</span>
              )}
            </p>
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-maribel-700' : ''
          }`}
        />
      </button>

      {/* Menú desplegable flotante con buscador integrado */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Buscador dentro del dropdown */}
          <div className="p-3 border-b border-stone-100 bg-stone-50/50">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('customerSelect.searchPlaceholder')}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-maribel-600 focus:border-maribel-600"
              />
            </div>
          </div>

          {/* Lista de clientes con scroll */}
          <div className="max-h-64 overflow-y-auto divide-y divide-stone-100">
            {/* Opción rápida: Cliente casual */}
            <button
              type="button"
              onClick={() => {
                const casual = customers.find((c) => c.name === 'Cliente casual') || {
                  id: 'casual',
                  code: 0,
                  name: t('customerSelect.casualCustomer'),
                  phone: t('customerSelect.noPhone'),
                  address: t('customerSelect.casualCustomerDesc'),
                  registrationDate: new Date().toISOString(),
                };
                onSelectCustomer(casual);
                setIsOpen(false);
                setSearchQuery('');
              }}
              className={`w-full p-3 text-left flex items-center justify-between hover:bg-stone-50 transition-colors ${
                isCasual ? 'bg-rose-50/60' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">
                    {t('customerSelect.casualCustomerCounter')}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    {t('customerSelect.casualCustomerQuick')}
                  </p>
                </div>
              </div>
              {isCasual && <Check className="w-4 h-4 text-maribel-700" />}
            </button>

            {/* Listado de clientes registrados */}
            {filteredCustomers
              .filter((c) => c.name !== 'Cliente casual' && c.name !== t('customerSelect.casualCustomer'))
              .map((customer) => {
                const isSelected = selectedCustomer?.id === customer.id;

                return (
                  <button
                    key={customer.id}
                    type="button"
                    onClick={() => {
                      onSelectCustomer(customer);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full p-3 text-left flex items-center justify-between hover:bg-stone-50 transition-colors ${
                      isSelected ? 'bg-rose-50/60' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-2">
                      <div className="w-8 h-8 rounded-lg bg-rose-100 text-maribel-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {getInitials(customer.name)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-xs font-bold text-stone-900 truncate">
                            {customer.name}
                          </p>
                          <span className="text-[10px] text-stone-400 font-mono">
                            #{customer.code}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-[11px] text-stone-500 mt-0.5">
                          {customer.phone &&
                          customer.phone !== 'Sin teléfono' &&
                          customer.phone !== t('customerSelect.noPhone') ? (
                            <span className="font-semibold text-emerald-800 flex items-center space-x-0.5">
                              <Phone className="w-2.5 h-2.5 text-emerald-600" />
                              <span>{customer.phone}</span>
                            </span>
                          ) : (
                            <span className="text-stone-400">{t('customerSelect.noPhone')}</span>
                          )}

                          {customer.address && (
                            <span className="text-stone-400 truncate">
                              • {customer.address}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-maribel-700 shrink-0" />}
                  </button>
                );
              })}

            {filteredCustomers.length === 0 && (
              <div className="p-5 text-center text-xs text-stone-400">
                {t('customerSelect.noCustomersFound', { query: searchQuery })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
