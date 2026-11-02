import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Customer } from '@/features/customers/types/customer.types';
import { formatCurrency } from '@/utils/formatters';
import { t } from '@/lang';
import { Search, Users, Phone, Mail } from 'lucide-react';

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c-1',
    code: 'CLI-01',
    name: 'María González',
    phone: '+54 9 11 4455-8899',
    email: 'maria.gonzalez@email.com',
    totalPurchases: 240000,
  },
  {
    id: 'c-2',
    code: 'CLI-02',
    name: 'Carlos Benítez',
    phone: '+54 9 11 3322-1144',
    email: 'carlos.benitez@email.com',
    totalPurchases: 180000,
  },
  {
    id: 'c-3',
    code: 'CLI-03',
    name: 'Laura Martínez',
    phone: '+54 9 11 9988-7766',
    email: 'laura.martinez@email.com',
    totalPurchases: 230000,
  },
];

export const CustomersScreen: React.FC = () => {
  const [customers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Header
        title={t('customers.title')}
        subtitle={t('customers.subtitle')}
      />

      <section className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por código, nombre o email..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-maribel-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] border-b border-stone-200">
              <tr>
                <th className="px-5 py-3.5">{t('customers.code')}</th>
                <th className="px-5 py-3.5">{t('customers.name')}</th>
                <th className="px-5 py-3.5">Contacto</th>
                <th className="px-5 py-3.5 text-right">{t('customers.totalPurchases')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-semibold text-stone-900">
                    {customer.code}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-stone-800 flex items-center space-x-2">
                    <Users className="w-4 h-4 text-stone-400" />
                    <span>{customer.name}</span>
                  </td>
                  <td className="px-5 py-3.5 text-stone-500">
                    <div className="flex items-center space-x-1.5 text-[11px]">
                      <Phone className="w-3 h-3 text-stone-400" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-[11px] mt-0.5">
                      <Mail className="w-3 h-3 text-stone-400" />
                      <span>{customer.email}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right font-bold text-stone-900">
                    {formatCurrency(customer.totalPurchases)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
