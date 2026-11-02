import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui';
import { CustomerFormModal } from '@/features/customers/components/CustomerFormModal';
import { CustomerFormData } from '@/features/customers/types/customer.types';
import { useCustomerStore } from '@/store/useCustomerStore';
import { Search, UserPlus, MapPin, ExternalLink, MessageCircle } from 'lucide-react';

export const CustomersScreen: React.FC = () => {
  const { customers, addCustomer } = useCustomerStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(c.code).includes(searchQuery) ||
      c.phone.includes(searchQuery) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCustomer = (data: CustomerFormData) => {
    addCustomer(data);
  };

  const getCleanPhone = (phone: string) => {
    return phone.replace(/\D/g, '');
  };

  return (
    <div>
      <Header
        title="Directorio de Clientes"
        subtitle="Control de clientes, datos de contacto, direcciones y ubicación GPS"
        action={
          <Button
            variant="primary"
            leftIcon={<UserPlus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Nuevo Cliente
          </Button>
        }
      />

      <section className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por código, nombre, teléfono o ciudad..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-maribel-600"
            />
          </div>
          <span className="text-xs text-stone-500 font-medium">
            {filteredCustomers.length} clientes registrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] border-b border-stone-200">
              <tr>
                <th className="px-5 py-3.5 text-center">Código</th>
                <th className="px-4 py-3.5">Fecha Registro</th>
                <th className="px-5 py-3.5">Nombre</th>
                <th className="px-5 py-3.5">Número de Teléfono</th>
                <th className="px-5 py-3.5">Dirección o Referencia</th>
                <th className="px-4 py-3.5 text-center">Ubicación GPS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredCustomers.map((customer) => {
                const cleanPhone = getCleanPhone(customer.phone);
                const isPhoneValid = cleanPhone.length >= 7;

                return (
                  <tr key={customer.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-5 py-3.5 text-center font-mono font-bold text-stone-900 whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 bg-stone-100 rounded-md">
                        {customer.code}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-stone-500 whitespace-nowrap font-mono text-[11px]">
                      {customer.registrationDate}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-stone-900">
                      {customer.name}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {customer.phone !== 'Sin teléfono' && isPhoneValid ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-stone-700 font-mono text-[11px]">
                            {customer.phone}
                          </span>
                          <a
                            href={`https://wa.me/595${cleanPhone.replace(/^0+/, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                            title="Enviar WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ) : (
                        <span className="text-stone-400 italic text-[11px]">
                          {customer.phone}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-stone-600">
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{customer.address}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      {customer.gpsUrl && customer.gpsUrl !== '0' ? (
                        <a
                          href={customer.gpsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 px-2.5 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg text-xs font-medium transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Ver Mapa</span>
                        </a>
                      ) : (
                        <span className="text-stone-300 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-stone-400">
                    No se encontraron clientes coincidentes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <CustomerFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitCustomer={handleCreateCustomer}
      />
    </div>
  );
};
