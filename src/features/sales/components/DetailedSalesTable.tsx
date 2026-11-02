import React from 'react';
import { Sale } from '@/features/sales/types/sale.types';
import { formatCurrency } from '@/utils/formatters';
import { Barcode, Clock } from 'lucide-react';

export interface DetailedSalesTableProps {
  sales: Sale[];
}

export const DetailedSalesTable: React.FC<DetailedSalesTableProps> = ({ sales }) => {
  // Desglosar cada venta en sus renglones individuales
  const flattenedRows = sales.flatMap((sale) =>
    sale.items.map((item, idx) => ({
      rowKey: `${sale.id}-${item.barcode}-${idx}`,
      saleNumber: sale.saleNumber,
      date: sale.date,
      time: sale.time,
      customerCode: sale.customerCode || '-',
      customerName: sale.customerName,
      barcode: item.barcode,
      brand: item.brand,
      name: item.name,
      size: item.size,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
    }))
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] border-b border-stone-200">
          <tr>
            <th className="px-5 py-3.5">Código de barras</th>
            <th className="px-4 py-3.5 text-center">Cantidad</th>
            <th className="px-4 py-3.5">Fecha y Hora</th>
            <th className="px-5 py-3.5">Marca del producto</th>
            <th className="px-5 py-3.5">Descripción del producto</th>
            <th className="px-4 py-3.5">Medida</th>
            <th className="px-5 py-3.5 text-right">Precio venta</th>
            <th className="px-4 py-3.5 text-center">Cód. cliente</th>
            <th className="px-5 py-3.5">Nombre cliente</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {flattenedRows.map((row) => (
            <tr key={row.rowKey} className="hover:bg-stone-50/70 transition-colors">
              <td className="px-5 py-3.5 font-mono text-[11px] text-stone-600 whitespace-nowrap">
                <div className="flex items-center space-x-1.5">
                  <Barcode className="w-3.5 h-3.5 text-stone-400" />
                  <span>{row.barcode}</span>
                </div>
              </td>
              <td className="px-4 py-3.5 text-center whitespace-nowrap font-bold text-stone-900">
                <span className="inline-block px-2.5 py-0.5 bg-stone-100 rounded-md">
                  {row.quantity}
                </span>
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap">
                <span className="font-mono text-[11px] font-semibold text-stone-800 block">
                  {row.date}
                </span>
                <span className="text-[10px] text-stone-400 flex items-center space-x-1">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{row.time}</span>
                </span>
              </td>
              <td className="px-5 py-3.5 font-semibold text-stone-900 whitespace-nowrap">
                {row.brand}
              </td>
              <td className="px-5 py-3.5 text-stone-800 font-medium max-w-xs truncate" title={row.name}>
                {row.name}
              </td>
              <td className="px-4 py-3.5 text-stone-500 whitespace-nowrap">
                {row.size}
              </td>
              <td className="px-5 py-3.5 font-bold text-stone-900 text-right whitespace-nowrap">
                {formatCurrency(row.unitPrice)}
              </td>
              <td className="px-4 py-3.5 text-center font-mono text-[11px] text-stone-500 whitespace-nowrap">
                {row.customerCode !== '-' ? `#${row.customerCode}` : '-'}
              </td>
              <td className="px-5 py-3.5 font-medium text-stone-800 whitespace-nowrap">
                {row.customerName}
              </td>
            </tr>
          ))}
          {flattenedRows.length === 0 && (
            <tr>
              <td colSpan={9} className="px-5 py-8 text-center text-stone-400">
                No hay ventas detalladas para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
