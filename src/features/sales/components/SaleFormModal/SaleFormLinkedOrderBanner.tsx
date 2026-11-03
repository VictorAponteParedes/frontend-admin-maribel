import React from 'react';
import { PackageCheck } from 'lucide-react';

interface PendingOrderSaleData {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
}

interface SaleFormLinkedOrderBannerProps {
  pendingOrderSale: PendingOrderSaleData;
}

export const SaleFormLinkedOrderBanner: React.FC<SaleFormLinkedOrderBannerProps> = ({
  pendingOrderSale,
}) => {
  return (
    <div className="p-3.5 bg-gradient-to-r from-rose-50 via-maribel-50/60 to-amber-50/40 border border-maribel-200/90 rounded-2xl flex items-start gap-3 shadow-2xs">
      <div className="w-9 h-9 rounded-xl bg-maribel-700 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
        <PackageCheck className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h5 className="text-xs font-bold text-maribel-900 truncate">
            Venta vinculada al Pedido #{pendingOrderSale.orderNumber}
          </h5>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-maribel-100 text-maribel-800 border border-maribel-200 shrink-0">
            Pedido Web
          </span>
        </div>
        <p className="text-[11px] text-stone-600 mt-0.5">
          Cliente: <strong>{pendingOrderSale.customerName}</strong>
          {pendingOrderSale.customerPhone ? ` • WhatsApp: ${pendingOrderSale.customerPhone}` : ''}
        </p>
        <p className="text-[10px] text-maribel-700 font-medium mt-1">
          ✓ Al completar la venta, se descontará el stock y el pedido se marcará como <strong>&ldquo;Entregado&rdquo;</strong> automáticamente.
        </p>
      </div>
    </div>
  );
};
