import React from 'react';
import { useSaleDetail } from '@/features/sales/hooks/useSaleDetail';
import {
  SaleDetailNotFound,
  SaleDetailHeaderNav,
  SaleDetailHero,
  SaleDetailInfoCards,
  SaleDetailItemsTable,
} from '@/features/sales/components/SaleDetail';

export const SaleDetailScreen: React.FC = () => {
  const { id, sale, actions } = useSaleDetail();

  if (!sale) {
    return <SaleDetailNotFound id={id} onBack={actions.handleBackToSales} />;
  }

  return (
    <div className="space-y-6">
      <SaleDetailHeaderNav onPrint={actions.handlePrint} />

      <SaleDetailHero
        saleNumber={sale.saleNumber}
        saleId={sale.id}
        total={sale.total}
      />

      <SaleDetailInfoCards
        date={sale.date}
        time={sale.time}
        customerName={sale.customerName}
        customerCode={sale.customerCode}
        customerPhone={sale.customerPhone}
        customerAddress={sale.customerAddress}
      />

      <SaleDetailItemsTable
        items={sale.items}
        totalQuantity={sale.totalQuantity}
        total={sale.total}
      />
    </div>
  );
};
