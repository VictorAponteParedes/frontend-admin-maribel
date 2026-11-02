import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui';
import { SaleTable } from '@/features/sales/components/SaleTable';
import { SaleFormModal } from '@/features/sales/components/SaleFormModal';
import { SaleDetailModal } from '@/features/sales/components/SaleDetailModal';
import { useSalesStore } from '@/store/useSalesStore';
import { formatCurrency } from '@/utils/formatters';
import { t } from '@/lang';
import { Plus, Search, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';

export const SalesScreen: React.FC = () => {
  const { sales, openCreateModal, openDetailModal } = useSalesStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSales = sales.filter(
    (sale) =>
      sale.saleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.date.includes(searchQuery)
  );

  const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);
  const totalItemsSold = sales.reduce((acc, s) => acc + s.totalQuantity, 0);
  const averageTicket = sales.length > 0 ? Math.round(totalRevenue / sales.length) : 0;

  return (
    <div>
      <Header
        title={t('sales.title')}
        subtitle={t('sales.subtitle')}
        action={
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={openCreateModal}
          >
            {t('sales.newSale')}
          </Button>
        }
      />

      {/* Mini metric bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 bg-maribel-50 text-maribel-700 rounded-lg">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase text-stone-500">Facturación Registrada</p>
            <p className="text-xl font-bold font-serif text-stone-900">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase text-stone-500">Unidades Vendidas</p>
            <p className="text-xl font-bold font-serif text-stone-900">
              {totalItemsSold} perfumes
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-lg">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase text-stone-500">Ticket Promedio</p>
            <p className="text-xl font-bold font-serif text-stone-900">
              {formatCurrency(averageTicket)}
            </p>
          </div>
        </div>
      </div>

      <section className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por N° de venta, cliente o fecha..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-maribel-600"
            />
          </div>
        </div>

        <SaleTable sales={filteredSales} onSelectSale={openDetailModal} />
      </section>

      {/* Modales de Ventas */}
      <SaleFormModal />
      <SaleDetailModal />
    </div>
  );
};
